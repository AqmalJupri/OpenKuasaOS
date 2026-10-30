-- Bendahara SST (#222): an invoice on a return that is marked filed cannot be
-- voided. Once a return is filed, a sale that falls through is corrected with a
-- credit note, so the deduction in a later 13(a) has a document behind it. An
-- invoice that should never have been issued is an amendment instead: take the
-- filed mark off, void, and file an amended return (Pindaan). With this guard a
-- void always happens while its return is unmarked, so the SST report leaves a
-- voided invoice out of every return (src/lib/finance/sst-return.ts).
--
-- A void is refused when a filed mark's own two-month period holds the invoice
-- date and the invoice has a line on that return's form: service tax at 6% or
-- 8%, or sales tax at 5% or 10%, by the line's tax type or, with none, by its
-- rate (as taxTypeForRate in src/lib/finance/sst.ts). A line at a rate the form
-- has no item for was never on the return, so it does not hold the void back.
-- The period comes from the mark, not from the workspace's settings, so a
-- changed period start or a missing settings row cannot open a gap.
--
-- Security definer: the marks are read for the invoice's own workspace only,
-- and the caller has already passed the invoice's own update policy. Reading
-- them with the caller's rights would let a session that cannot see the marks
-- void past them.
-- Error code FIN71 is new (the highest before this file is FIN70).

create function private.finance_invoice_void_filed_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  hit record;
  period_end date;
  label text;
  which text;
begin
  if not (old.status = 'posted' and new.status = 'void') then
    return new;
  end if;

  select r.period_start, array_agg(r.tax_type order by r.tax_type) as types
    into hit
    from public.finance_sst_returns r
   where r.org_id = old.org_id
     and old.invoice_date >= r.period_start
     and old.invoice_date < (r.period_start + interval '2 months')::date
     and exists (
       select 1
         from public.finance_invoice_lines l
        where l.org_id = old.org_id
          and l.invoice_id = old.id
          and coalesce(
                l.tax_type,
                case when l.sst_rate in (5, 10) then 'sales' when l.sst_rate in (6, 8) then 'service' end
              ) = r.tax_type
          and ((r.tax_type = 'service' and l.sst_rate in (6, 8)) or (r.tax_type = 'sales' and l.sst_rate in (5, 10)))
     )
   group by r.period_start
   order by r.period_start
   limit 1;
  if not found then
    return new;
  end if;

  -- '1 Sep – 31 Oct 2026', or '1 Dec 2026 – 31 Jan 2027', as sstPeriodLabel words it.
  period_end := ((hit.period_start + interval '2 months')::date - 1);
  label := case
    when extract(year from hit.period_start) = extract(year from period_end)
      then to_char(hit.period_start, 'FMDD Mon') || ' – ' || to_char(period_end, 'FMDD Mon YYYY')
    else to_char(hit.period_start, 'FMDD Mon YYYY') || ' – ' || to_char(period_end, 'FMDD Mon YYYY')
  end;
  which := case
    when array_length(hit.types, 1) > 1 then 'SST'
    when hit.types[1] = 'sales' then 'sales tax'
    else 'service tax'
  end;
  raise exception
    'This invoice is on the % % return, which is marked filed. Issue a credit note instead. If the invoice should never have been issued, take the filed mark off the return, void the invoice, and file an amended return (Pindaan).',
    label, which
    using errcode = 'FIN71';
end $$;

revoke all on function private.finance_invoice_void_filed_guard() from public, anon, authenticated, service_role;

create trigger finance_invoice_void_filed_guard
  before update of status on public.finance_invoices
  for each row execute function private.finance_invoice_void_filed_guard();

-- ---- self-check -----------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_trigger
     where tgrelid = 'public.finance_invoices'::regclass and tgname = 'finance_invoice_void_filed_guard' and not tgisinternal
  ) then
    raise exception 'finance_invoice_void_filed_guard trigger is missing';
  end if;
  if has_function_privilege('authenticated', 'private.finance_invoice_void_filed_guard()', 'execute') then
    raise exception 'authenticated can call finance_invoice_void_filed_guard directly';
  end if;
end $$;
