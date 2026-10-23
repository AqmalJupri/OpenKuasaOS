-- Bendahara: an owner or admin sends an approved expense back (additive; safe to
-- apply while the previous code is still deployed).
--
-- An approved expense is in the books: Dr its category, Cr Accrued Expenses. When
-- it turns out to be wrong before it is paid (a duplicate, a wrong amount), an owner
-- or admin sends it back. It returns to pending with who, when and why recorded, is
-- corrected, and is approved again as today. The books keep what happened: the first
-- approval stays, a reversal undoes it on the day it was sent back, and the next
-- approval is an entry of its own.
--
--   * finance_expense_approvals: one row per approval, as posted (amount, SST,
--     category, the date it is in the books), and, once it has left the books, when,
--     by whom, how (sent back or rejected) and why. Written only by a trigger on
--     finance_expenses; members read it. An expense can be approved, sent back and
--     approved again any number of times, with a different amount or category each
--     time: each row undoes exactly what it posted.
--   * Every expense approved today becomes one row, dated its expense date, so the
--     ledger's expense lines are the same, row for row, when this file has run
--     (checked at the end).
--   * Dates: the first approval is in the books on the expense date, as today. A
--     later one is in the books on the day it was approved (or the expense date, if
--     that is later), so a correction is never written into a past month. A
--     reversal is dated the day the expense left the books (never before the
--     approval it undoes). Both days are Malaysian (Asia/Kuala_Lumpur).
--   * Rejecting an approved expense (already allowed while no payment stands
--     against it) now reverses its entry on the day it was rejected. Before, the
--     entry left the books as if it had never been there.
--   * finance_send_back_expense(target_org, target_expense, seen_updated_at, reason):
--     approved -> pending, with a reason. The expense's guard is restated to allow it
--     for an owner or admin, with no payment against it, and only with a reason.
--   * An expense that has ever been in the books is no longer deleted (FIN68): its
--     entries stay, so it does too. It is rejected instead.
--   * finance_expense_totals gains sent_back_at and sent_back_reason (the latest
--     send-back, while the expense is pending and has not been rejected since) and
--     in_books (approved at least once), at the end.
--   * finance_ledger_lines: only the expense branch changes. It reads the approvals.
--   * The audit trail logs a send-back and the rejection of an approved expense.
--   * The books lock judges an expense by the day its entry posts (one rule,
--     private.finance_expense_posts_on, shared with the approvals' writer): a
--     reversal or a later approval dated today is not refused for an old expense
--     date, and is refused when today is in the closed period.
--
-- Error codes: FIN68 and FIN69 are new (the highest before this file is FIN67).
--   FIN68  an expense that has been in the books is kept
--   FIN69  an expense is sent back with a reason

-- Fail fast instead of queueing behind a long transaction and stalling sign-ins.
set local lock_timeout = '5s';

-- No expense changes while this file runs: the snapshot below and the check at the end
-- see the same expenses. Readers go on; writers to finance_expenses wait (lock_timeout).
lock table public.finance_expenses in share row exclusive mode;

-- The expense lines of the books as they are, to check at the end that none moved. Only
-- the expense branch of the ledger changes, so the other branches are not read twice.
create temp table exp308_ledger_before on commit drop as
  select * from public.finance_ledger_lines where source = 'expense';

-- ---- approvals ----------------------------------------------------------------------
create table public.finance_expense_approvals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  expense_id uuid not null,
  -- 1 for the first approval of the expense, then 2, 3, ...
  round_no integer not null check (round_no > 0),
  -- As posted: what the expense said when it was approved.
  amount numeric(14,2) not null check (amount > 0),
  sst_amount numeric(14,2) not null check (sst_amount >= 0),
  category_id uuid not null,
  posted_on date not null,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz not null,
  -- When it left the books, by whom, and how. reason is a send-back's.
  reversed_on date,
  reversed_at timestamptz,
  reversed_by uuid references auth.users(id) on delete set null,
  reversed_as text check (reversed_as in ('sent_back', 'rejected')),
  reason text check (char_length(reason) <= 200),
  -- A send-back's reason stops being the expense's open question when the expense,
  -- pending again, is then rejected: from that moment it is not shown on the row.
  reason_closed_at timestamptz,
  unique (org_id, expense_id, round_no),
  constraint finance_expense_approvals_reversed_check
    check (num_nulls(reversed_on, reversed_at, reversed_as) in (0, 3)),
  constraint finance_expense_approvals_reversed_after_check check (reversed_on >= posted_on),
  -- Cascade: an expense with approvals is never deleted (FIN68) but by its workspace's delete.
  foreign key (org_id, expense_id) references public.finance_expenses(org_id, id) on delete cascade,
  foreign key (org_id, category_id) references public.finance_categories(org_id, id)
);
-- At most one approval of an expense is in the books at a time.
create unique index finance_expense_approvals_open_idx
  on public.finance_expense_approvals (org_id, expense_id) where reversed_at is null;
create index finance_expense_approvals_category_idx on public.finance_expense_approvals (org_id, category_id);

-- Anyone in the workspace reads. Nobody writes: the trigger below does, as the owner.
alter table public.finance_expense_approvals enable row level security;
create policy finance_expense_approvals_select on public.finance_expense_approvals
  for select to authenticated using (private.is_org_member(org_id));
create policy mfa_required on public.finance_expense_approvals as restrictive for all to authenticated
  using ((select private.mfa_ok())) with check ((select private.mfa_ok()));
revoke all on public.finance_expense_approvals from anon, authenticated, service_role;
grant select on public.finance_expense_approvals to authenticated;

-- Every expense approved now is one approval, in the books on its expense date, as
-- the ledger has it today. A rejected one that was approved before has no entry
-- today and gets none.
insert into public.finance_expense_approvals
  (org_id, expense_id, round_no, amount, sst_amount, category_id, posted_on, approved_by, approved_at)
select e.org_id, e.id, 1, e.amount, e.sst_amount, e.category_id, e.expense_date, e.approved_by, e.approved_at
from public.finance_expenses e
where e.status = 'approved';

-- ---- the expense's guard, restated ------------------------------------------------------
-- The body of 20261028100000 (its only definition), with three changes, each marked
-- "20261125160000": an expense that has been in the books is not deleted (FIN68); an
-- approved expense goes back to pending when an owner or admin sends it back, as it
-- stands, with no payment against it and with a reason (FIN69); and the payment check
-- is shared by that and by rejecting an approved expense.
create or replace function private.finance_expense_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  has_payments boolean;
begin
  if tg_op = 'DELETE' then
    if old.status = 'approved' and exists (select 1 from public.orgs where id = old.org_id) then
      raise exception 'an approved expense cannot be deleted' using errcode = 'FIN01';
    end if;
    -- 20261125160000: its entries stay in the books, so it stays too. It is rejected instead.
    if exists (select 1 from public.orgs where id = old.org_id)
       and exists (select 1 from public.finance_expense_approvals a where a.org_id = old.org_id and a.expense_id = old.id) then
      raise exception 'an expense that has been in the books is kept' using errcode = 'FIN68';
    end if;
    return old;
  end if;

  if tg_op = 'INSERT' then
    if new.status <> 'pending' then
      raise exception 'an expense starts as pending' using errcode = 'FIN01';
    end if;
    new.approved_by := null;
    new.approved_at := null;
    return new;
  end if;

  -- An expense stays in the workspace it was entered in. Asked first, before
  -- anything below can let an update through: who may approve is a question
  -- about one workspace, and it must be the one the expense is in.
  if new.org_id is distinct from old.org_id then
    raise exception 'an expense does not move to another workspace' using errcode = 'FIN01';
  end if;

  -- A deleted user is cleared from these two columns by their foreign keys,
  -- whatever the expense's status. Nothing else may change with it. That
  -- update is made by the foreign key's own trigger, so this guard runs one
  -- level down (pg_trigger_depth() > 1); a signed-in person's own update,
  -- which runs at the first level, is not let through here, or anyone who may
  -- write could erase who approved an expense. A session with no signed-in
  -- user (a migration, the SQL editor) may clear them by hand, and an update
  -- that changes nothing is let through as it always was.
  if new.status = old.status
     and (to_jsonb(new) - 'created_by' - 'approved_by') = (to_jsonb(old) - 'created_by' - 'approved_by')
     and (new.created_by is null or new.created_by = old.created_by)
     and (new.approved_by is null or new.approved_by = old.approved_by)
     and (pg_trigger_depth() > 1 or auth.uid() is null or to_jsonb(new) = to_jsonb(old)) then
    return new;
  end if;

  if new.status = old.status and old.status <> 'pending' then
    raise exception 'an expense that has been approved or rejected cannot be changed' using errcode = 'FIN01';
  end if;

  -- Who approved and when is written below, by this guard, and by nobody else.
  if auth.uid() is not null
     and (new.approved_at is distinct from old.approved_at or new.approved_by is distinct from old.approved_by) then
    raise exception 'only the database records who approved an expense' using errcode = 'FIN14';
  end if;

  if new.status = old.status then
    -- Pending, and edited: nobody has decided it.
    new.approved_by := null;
    new.approved_at := null;
    return new;
  end if;

  -- 20261125160000: money out, paid or still to be paid, against it.
  has_payments := exists (
    select 1
    from public.finance_allocations a
    join public.finance_transactions t on t.org_id = a.org_id and t.id = a.transaction_id
    where a.org_id = old.org_id and a.expense_id = old.id
      and t.status in ('draft','pending_approval','scheduled','posted')
  );

  -- 20261125160000: sent back. An approved expense goes back to pending as it
  -- stands, by an owner or admin, while no payment stands against it, and with a
  -- reason, which finance_send_back_expense passes in the transaction's
  -- openkuasa.expense_send_back_reason. A session with no signed-in user (a
  -- migration, the demo seed) is not asked for one.
  if new.status = 'pending' and old.status = 'approved' then
    if (to_jsonb(new) - 'status' - 'approved_by' - 'approved_at' - 'updated_at')
       is distinct from (to_jsonb(old) - 'status' - 'approved_by' - 'approved_at' - 'updated_at') then
      raise exception 'an expense is sent back as it stands' using errcode = 'FIN01';
    end if;
    if not (private.finance_may_decide(old.org_id) and private.finance_may_decide(new.org_id)) then
      raise exception 'only an owner or admin sends back an expense' using errcode = 'FIN14';
    end if;
    if has_payments then
      raise exception 'the expense has payments' using errcode = 'FIN02';
    end if;
    if auth.uid() is not null
       and coalesce(btrim(current_setting('openkuasa.expense_send_back_reason', true)), '') = '' then
      raise exception 'an expense is sent back with a reason' using errcode = 'FIN69';
    end if;
    new.approved_by := null;
    new.approved_at := null;
    return new;
  end if;

  -- Back to pending: only a rejected expense, and it may be edited in the same update.
  if new.status = 'pending' then
    if old.status <> 'rejected' then
      raise exception 'an approved expense does not go back to pending' using errcode = 'FIN01';
    end if;
    new.approved_by := null;
    new.approved_at := null;
    return new;
  end if;

  -- Approved or rejected: the expense is decided as it stands.
  if (to_jsonb(new) - 'status' - 'approved_by' - 'approved_at' - 'updated_at')
     is distinct from (to_jsonb(old) - 'status' - 'approved_by' - 'approved_at' - 'updated_at') then
    raise exception 'an expense is approved or rejected as it stands' using errcode = 'FIN01';
  end if;
  if old.status = 'rejected' then
    raise exception 'a rejected expense is edited before it is decided again' using errcode = 'FIN01';
  end if;
  -- Asked of the workspace the expense is in before the write and after it.
  -- They are the same (see the top of this guard); the rule does not lean on that.
  if not (private.finance_may_decide(old.org_id) and private.finance_may_decide(new.org_id)) then
    raise exception 'only an owner or admin approves or rejects an expense' using errcode = 'FIN14';
  end if;
  if old.status = 'approved' and has_payments then
    raise exception 'the expense has payments' using errcode = 'FIN02';
  end if;
  if auth.uid() is not null then
    new.approved_by := auth.uid();
    new.approved_at := now();
  else
    new.approved_at := coalesce(new.approved_at, now());
  end if;
  return new;
end $$;

-- ---- the day an approval is in the books ---------------------------------------------------
-- One rule, read by the approvals' writer below and by the books lock: the first
-- approval of an expense (it has no approval yet) is in the books on its expense date,
-- as before; a later one on the Malaysian day it was approved, or the expense date if
-- that is later. Asked before the new approval is written, so "no approval yet" means
-- this is the first. Its callers run as the owner, so it needs no rights of its own.
create function private.finance_expense_posts_on(p_org uuid, p_expense uuid, p_expense_date date, p_approved_at timestamptz)
returns date
language sql
stable
set search_path = ''
as $$
  select case
    when not exists (select 1 from public.finance_expense_approvals a where a.org_id = p_org and a.expense_id = p_expense)
      then p_expense_date
    else greatest(p_expense_date, (p_approved_at at time zone 'Asia/Kuala_Lumpur')::date)
  end
$$;
revoke all on function private.finance_expense_posts_on(uuid, uuid, date, timestamptz) from public, anon, authenticated, service_role;

-- ---- the approvals' writer --------------------------------------------------------------
-- After the guard has let the change through. Into approved: a new approval, as the
-- expense stands. Out of approved (sent back, or rejected): the approval in the books
-- leaves them today. Runs as the owner: nobody else writes the table.
create function private.finance_expense_approvals_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'Asia/Kuala_Lumpur')::date;
  last_round integer;
begin
  if old.status = 'approved' and new.status <> 'approved' then
    update public.finance_expense_approvals a
       set reversed_on = greatest(a.posted_on, today),
           reversed_at = now(),
           reversed_by = auth.uid(),
           reversed_as = case when new.status = 'pending' then 'sent_back' else 'rejected' end,
           reason = case when new.status = 'pending'
                         then nullif(btrim(current_setting('openkuasa.expense_send_back_reason', true)), '') end
     where a.org_id = new.org_id and a.expense_id = new.id and a.reversed_at is null;
  end if;

  -- A sent-back expense rejected while pending: its send-back reason is closed.
  if old.status = 'pending' and new.status = 'rejected' then
    update public.finance_expense_approvals a
       set reason_closed_at = now()
     where a.org_id = new.org_id and a.expense_id = new.id and a.reversed_as = 'sent_back' and a.reason_closed_at is null;
  end if;

  if new.status = 'approved' and old.status <> 'approved' then
    select max(a.round_no) into last_round
      from public.finance_expense_approvals a
     where a.org_id = new.org_id and a.expense_id = new.id;
    insert into public.finance_expense_approvals
      (org_id, expense_id, round_no, amount, sst_amount, category_id, posted_on, approved_by, approved_at)
    values (
      new.org_id, new.id, coalesce(last_round, 0) + 1, new.amount, new.sst_amount, new.category_id,
      -- The first approval on the expense date, as before; a later one on the day it was approved.
      private.finance_expense_posts_on(new.org_id, new.id, new.expense_date, new.approved_at),
      new.approved_by, new.approved_at
    );
  end if;
  return null;
end $$;
revoke all on function private.finance_expense_approvals_write() from public, anon, authenticated, service_role;
create trigger finance_expense_approvals_write
  after update of status on public.finance_expenses
  for each row execute function private.finance_expense_approvals_write();

-- ---- the books lock, restated ------------------------------------------------------------
-- private.finance_period_lock, restated from 20261125140000 (its only definition), with
-- one more branch, for finance_expenses (marked 20261125160000), ahead of the general
-- path, as finance_accounts has. A sent-back or rejected expense is reversed today, and
-- an expense approved again is in the books today, so the lock asks about those days,
-- not the old expense date. The triggers and their arguments are unchanged.
-- tg_argv[0]: the row's date column. tg_argv[1]: its ledger statuses, comma-separated, or '*' (every row is one).
-- On finance_accounts (no arguments): the opening balance, its date and its rate. Runs as the owner so the lock is
-- read whoever writes; it reads only the row's own workspace's settings. The status tests come first, so a draft
-- never costs a lookup.
--
-- A ledger row is refused (FIN63) when, with L the lock date:
--   * it is written in a ledger status, or moved into one, dated on or before L (and a row that was already in a
--     ledger status, by its old date too);
--   * it is voided while the void's own date is on or before L. The ledger dates a void's reversal on
--     (voided_at at time zone 'UTC')::date (finance_void_stamp sets voided_at := now()), so that is the date used;
--     it is never later than the Malaysia date;
--   * an expense (20261125160000) is judged by the day its entry posts, not by its expense date alone. An approved
--     expense that leaves the books (sent back, or rejected) is reversed on the later of the day its approval posted
--     and today in Malaysia, so it is refused when that day is on or before L. An expense approved for the first
--     time posts on its expense date; approved again after a send-back, on the later of its expense date and the
--     Malaysian day it was approved (private.finance_expense_posts_on); it is refused when that day is on or before L;
--   * its date changes while its status stays a ledger status, when either date is on or before L (the documents'
--     own guards refuse this today; this is defence in depth).
-- The status read is NEW's as it stands when this trigger fires. BEFORE triggers fire in name order, so a guard
-- that sets new.status must sort before 'finance_period_lock' for its status to be the one checked here.
create or replace function private.finance_period_lock()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  l date;
  n jsonb;
  o jsonb;
  d date;
  od date;
  st text;
  ost text;
  ledger text[];
  is_ledger boolean;
  was_ledger boolean := false;
begin
  if tg_table_name = 'finance_accounts' then
    if tg_op = 'DELETE' then
      -- A workspace being deleted takes its accounts with it: its row is already gone.
      if old.opening_balance = 0 or not exists (select 1 from public.orgs o2 where o2.id = old.org_id) then
        return old;
      end if;
      select s.lock_date into l from public.finance_settings s where s.org_id = old.org_id;
      if l is not null and old.opening_date <= l then
        raise exception 'This date is in a closed period: the books are locked to %.', to_char(l, 'FMDD Mon YYYY')
          using errcode = 'FIN63';
      end if;
      return old;
    end if;
    if tg_op = 'UPDATE' and new.opening_balance is not distinct from old.opening_balance
       and new.opening_date is not distinct from old.opening_date
       and new.opening_rate is not distinct from old.opening_rate then
      return new;
    end if;
    if new.opening_balance = 0 and (tg_op = 'INSERT' or old.opening_balance = 0) then
      return new;
    end if;
    select s.lock_date into l from public.finance_settings s where s.org_id = new.org_id;
    if l is null then
      return new;
    end if;
    if (new.opening_balance <> 0 and new.opening_date <= l)
       or (tg_op = 'UPDATE' and old.opening_balance <> 0 and old.opening_date <= l) then
      raise exception 'This date is in a closed period: the books are locked to %.', to_char(l, 'FMDD Mon YYYY')
        using errcode = 'FIN63';
    end if;
    return new;
  end if;

  -- 20261125160000: an expense, by the day its entry posts (see above).
  if tg_table_name = 'finance_expenses' then
    if tg_op = 'INSERT' then
      if new.status is distinct from 'approved' then
        return new;
      end if;
    elsif new.status is not distinct from old.status then
      -- Status unchanged: only an approved expense whose date moves.
      if new.status is distinct from 'approved' or new.expense_date is not distinct from old.expense_date then
        return new;
      end if;
    elsif new.status is distinct from 'approved' and old.status is distinct from 'approved' then
      -- Pending to rejected and back: no ledger effect.
      return new;
    end if;
    select s.lock_date into l from public.finance_settings s where s.org_id = new.org_id;
    if l is null then
      return new;
    end if;
    if tg_op = 'UPDATE' and new.status is not distinct from old.status then
      -- An approved expense's date changed (its guard refuses this today; this is defence in depth).
      if new.expense_date <= l or old.expense_date <= l then
        raise exception 'This date is in a closed period: the books are locked to %.', to_char(l, 'FMDD Mon YYYY')
          using errcode = 'FIN63';
      end if;
      return new;
    end if;
    if tg_op = 'UPDATE' and old.status = 'approved' then
      -- Leaving the books: the reversal posts on the later of the approval's day and today in Malaysia.
      select a.posted_on into od from public.finance_expense_approvals a
       where a.org_id = old.org_id and a.expense_id = old.id and a.reversed_at is null;
      if greatest(coalesce(od, old.expense_date), (now() at time zone 'Asia/Kuala_Lumpur')::date) <= l then
        raise exception 'This date is in a closed period: the books are locked to %.', to_char(l, 'FMDD Mon YYYY')
          using errcode = 'FIN63';
      end if;
    end if;
    if new.status = 'approved' then
      -- Into the books: the guard (it sorts first) has set approved_at; today if it has not.
      if private.finance_expense_posts_on(new.org_id, new.id, new.expense_date, coalesce(new.approved_at, now())) <= l then
        raise exception 'This date is in a closed period: the books are locked to %.', to_char(l, 'FMDD Mon YYYY')
          using errcode = 'FIN63';
      end if;
    end if;
    return new;
  end if;

  n := to_jsonb(new);
  d := (n ->> tg_argv[0])::date;
  if tg_op = 'UPDATE' then
    o := to_jsonb(old);
    od := (o ->> tg_argv[0])::date;
  end if;

  if tg_argv[1] = '*' then
    if tg_op = 'UPDATE' and d is not distinct from od then
      return new;
    end if;
  else
    ledger := string_to_array(tg_argv[1], ',');
    st := n ->> 'status';
    is_ledger := coalesce(st = any (ledger), false);
    if tg_op = 'UPDATE' then
      ost := o ->> 'status';
      was_ledger := coalesce(ost = any (ledger), false);
    end if;
    if tg_op = 'INSERT' then
      if not is_ledger then
        return new;
      end if;
    elsif st is not distinct from ost then
      -- Status unchanged: only a ledger row whose date moves.
      if not is_ledger or d is not distinct from od then
        return new;
      end if;
    elsif not is_ledger and not (was_ledger and st is distinct from 'void') then
      -- Draft to draft-like statuses (pending approval, scheduled, rejected...): no ledger effect.
      return new;
    end if;
  end if;

  select s.lock_date into l from public.finance_settings s where s.org_id = new.org_id;
  if l is null then
    return new;
  end if;
  if (is_ledger is not false and d <= l)
     or (was_ledger and od <= l)
     or (st = 'void' and (now() at time zone 'UTC')::date <= l) then
    raise exception 'This date is in a closed period: the books are locked to %.', to_char(l, 'FMDD Mon YYYY')
      using errcode = 'FIN63';
  end if;
  return new;
end $$;
revoke all on function private.finance_period_lock() from public, anon, authenticated, service_role;

-- ---- send back ----------------------------------------------------------------------
-- Sends an approved expense back to pending, as the person was shown it
-- (seen_updated_at), with a reason. Returns its id, or null when no approved
-- expense with that updated_at was found: it is gone, or it was changed or
-- decided since, and the caller reads which. Runs as the caller: the guard decides
-- who may (FIN14), and refuses it with a payment against it (FIN02).
create function public.finance_send_back_expense(target_org uuid, target_expense uuid, seen_updated_at timestamptz, reason text)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  why text := nullif(btrim(reason), '');
  done uuid;
begin
  if why is null then
    raise exception 'an expense is sent back with a reason' using errcode = 'FIN69';
  end if;
  perform set_config('openkuasa.expense_send_back_reason', why, true);
  update public.finance_expenses
     set status = 'pending', updated_at = now()
   where org_id = target_org and id = target_expense and status = 'approved' and updated_at = seen_updated_at
  returning id into done;
  perform set_config('openkuasa.expense_send_back_reason', '', true);
  return done;
end $$;
revoke all on function public.finance_send_back_expense(uuid, uuid, timestamptz, text) from public, anon, service_role;
grant execute on function public.finance_send_back_expense(uuid, uuid, timestamptz, text) to authenticated;

-- ---- finance_expense_totals ---------------------------------------------------------
-- The body of 20261028100000 (its only definition), with three columns at the end: when
-- a pending expense was last sent back, and why (both null for any other expense, and
-- once it has been rejected since), and in_books: it has been approved at least once,
-- so it has entries in the books and is never deleted (FIN68).
create or replace view public.finance_expense_totals with (security_invoker = true) as
select
  e.id,
  e.org_id,
  e.expense_date,
  e.category_id,
  cat.name as category_name,
  e.vendor_id,
  coalesce(c.name, e.vendor_name) as vendor_name,
  e.amount,
  e.sst_amount,
  e.notes,
  e.status,
  e.approved_by,
  e.approved_at,
  e.created_by,
  e.created_at,
  e.updated_at,
  coalesce(p.paid, 0)::numeric(14,2) as paid,
  coalesce(h.held, 0)::numeric(14,2) as held,
  case
    when e.status <> 'approved' then e.status
    when coalesce(p.paid, 0) >= e.amount then 'paid'
    else 'approved'
  end as display_status,
  last.method,
  last.txn_date as paid_on,
  sb.reversed_at as sent_back_at,
  sb.reason as sent_back_reason,
  exists (select 1 from public.finance_expense_approvals ia where ia.org_id = e.org_id and ia.expense_id = e.id) as in_books
from public.finance_expenses e
join public.finance_categories cat on cat.org_id = e.org_id and cat.id = e.category_id
left join public.finance_contacts c on c.org_id = e.org_id and c.id = e.vendor_id
left join lateral (
  -- Only posted money out counts as paid.
  select sum(a.amount) as paid
  from public.finance_allocations a
  join public.finance_transactions t on t.org_id = a.org_id and t.id = a.transaction_id
  where a.org_id = e.org_id and a.expense_id = e.id and t.direction = 'out' and t.status = 'posted'
) p on true
left join lateral (
  select sum(a.amount) as held
  from public.finance_allocations a
  join public.finance_transactions t on t.org_id = a.org_id and t.id = a.transaction_id
  where a.org_id = e.org_id and a.expense_id = e.id
    and t.direction = 'out' and t.status in ('draft','pending_approval','scheduled')
) h on true
left join lateral (
  select t.method, t.txn_date
  from public.finance_allocations a
  join public.finance_transactions t on t.org_id = a.org_id and t.id = a.transaction_id
  where a.org_id = e.org_id and a.expense_id = e.id and t.direction = 'out' and t.status = 'posted'
  order by t.txn_date desc, t.created_at desc, t.id
  limit 1
) last on true
left join lateral (
  -- The latest approval, if the expense is pending because it was sent back.
  select l.reversed_at, l.reason
  from (
    select a.reversed_at, a.reason, a.reversed_as, a.reason_closed_at
    from public.finance_expense_approvals a
    where e.status = 'pending' and a.org_id = e.org_id and a.expense_id = e.id
    order by a.round_no desc
    limit 1
  ) l
  where l.reversed_as = 'sent_back' and l.reason_closed_at is null
) sb on true;
-- "create or replace" keeps the grants; said again as 20261028100000 has them.
revoke all on public.finance_expense_totals from anon, authenticated;
grant select on public.finance_expense_totals to authenticated;

-- ---- the ledger ---------------------------------------------------------------------
-- finance_ledger_lines, replaced: main's current body as 20261123110000 (supplier
-- credit notes) left it, with only the expense branch changed (marked 20261125160000).
-- The same ten columns with the same types, so "create or replace" keeps the view and
-- everything that reads it (finance_ledger_balances).
create or replace view public.finance_ledger_lines with (security_invoker = true) as
select
  l.org_id,
  l.entry_key || case when r.reversal then ':void' else '' end as entry_key,
  case when r.reversal then l.voided_on else l.entry_date end as entry_date,
  l.source,
  l.source_id,
  l.source_no,
  case when r.reversal then 'Voided: ' || l.description else l.description end as description,
  coalesce(l.acct, s.id, b.id, c.id, d.id) as account_id,
  (case when r.reversal then l.credit else l.debit end)::numeric(14,2) as debit,
  (case when r.reversal then l.debit else l.credit end)::numeric(14,2) as credit
from (
  -- ---- invoice: posted, or voided after it was posted -------------------------------
  -- Mirrors finance_invoice_totals: subtotal is sum(amount), sst is
  -- sum(sst_amount), total is the two added. Every invoice credits the one
  -- account marked default_for = 'sales'.
  -- 20261120100000: in ringgit, from the lines' generated amount_myr and
  -- sst_amount_myr (equal to amount and sst_amount at rate 1), so a foreign
  -- invoice posts its ringgit and a ringgit one posts what it always did.
  select
    i.org_id,
    'invoice:' || i.id::text as entry_key,
    i.invoice_date as entry_date,
    'invoice'::text as source,
    i.id as source_id,
    i.invoice_no as source_no,
    concat_ws(' ', 'Invoice', i.invoice_no, 'to ' || ct.name) as description,
    case when i.status = 'void' then (i.voided_at at time zone 'UTC')::date end as voided_on,
    v.acct, v.sys, v.bank, v.cat, v.dflt, v.debit, v.credit
  from public.finance_invoices i
  left join public.finance_contacts ct on ct.org_id = i.org_id and ct.id = i.customer_id
  cross join lateral (
    select coalesce(sum(il.amount_myr), 0) as subtotal, coalesce(sum(il.sst_amount_myr), 0) as sst
    from public.finance_invoice_lines il
    where il.org_id = i.org_id and il.invoice_id = i.id
  ) t
  cross join lateral (values
    (null::uuid, 'receivable'::text, null::uuid, null::uuid, null::text, (t.subtotal + t.sst)::numeric, 0::numeric),
    (null::uuid, null::text, null::uuid, null::uuid, 'sales'::text, 0::numeric, t.subtotal::numeric),
    (null::uuid, 'sst_payable'::text, null::uuid, null::uuid, null::text, 0::numeric, t.sst::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  where i.status = 'posted' or (i.status = 'void' and i.voided_at is not null)

  union all

  -- ---- credit note: issued, or voided after it was issued ----------------------------
  -- Mirrors finance_invoice_totals, which takes only issued credit notes off
  -- what an invoice owes. A credit note is one amount, not lines, so its SST
  -- is the invoice's SST in proportion: amount * invoice SST / invoice total,
  -- rounded to the sen. The Sales line is the amount less that share, found
  -- by subtraction, so the two debits add back to the amount exactly whatever
  -- the rounding did. The share is never more than the amount (an invoice's
  -- SST is never more than its total); least() says so again. The invoice's
  -- lines are there, unchanged, whether the invoice is posted or has since
  -- been voided, so a voided credit note's two entries are the same numbers.
  -- 20261120120000: in ringgit. The credit note's amount_myr (what it took
  -- off the invoice, at the invoice's rate or the closing figure; null, so
  -- the amount, for a ringgit invoice), and the share from the invoice's
  -- ringgit lines. At rate 1 every figure is the one it was.
  select
    n.org_id,
    'credit_note:' || n.id::text,
    n.credit_date,
    'credit_note'::text,
    n.id,
    n.credit_note_no,
    concat_ws(' ', 'Credit note', n.credit_note_no, 'on ' || i.invoice_no),
    case when n.status = 'void' then (n.voided_at at time zone 'UTC')::date end,
    v.acct, v.sys, v.bank, v.cat, v.dflt, v.debit, v.credit
  from public.finance_credit_notes n
  left join public.finance_invoices i on i.org_id = n.org_id and i.id = n.invoice_id
  cross join lateral (
    select
      coalesce(sum(il.amount_myr), 0) + coalesce(sum(il.sst_amount_myr), 0) as total,
      coalesce(sum(il.sst_amount_myr), 0) as sst
    from public.finance_invoice_lines il
    where il.org_id = n.org_id and il.invoice_id = n.invoice_id
  ) t
  cross join lateral (select coalesce(n.amount_myr, n.amount) as amount_myr) m
  cross join lateral (
    select least(coalesce(round(m.amount_myr * t.sst / nullif(t.total, 0), 2), 0), m.amount_myr) as sst_share
  ) sh
  cross join lateral (values
    (null::uuid, null::text, null::uuid, null::uuid, 'sales'::text, (m.amount_myr - sh.sst_share)::numeric, 0::numeric),
    (null::uuid, 'sst_payable'::text, null::uuid, null::uuid, null::text, sh.sst_share::numeric, 0::numeric),
    (null::uuid, 'receivable'::text, null::uuid, null::uuid, null::text, 0::numeric, m.amount_myr::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  where n.status = 'issued' or (n.status = 'void' and n.voided_at is not null)

  union all

  -- ---- money in and money out: posted, or voided after it was posted; not a side of a transfer
  -- 'posted' is the one status that means the money has moved: it is what
  -- supplier_bill_totals, finance_invoice_totals, finance_expense_totals and
  -- finance_account_balances count. Drafts, payments waiting for approval,
  -- scheduled and rejected ones are out, and stay out when they are deleted.
  -- A void payment is in twice, once each way (see the top of this view).
  --
  -- What it is follows finance_cash_receipts and finance_payment_vouchers:
  --   money in                          source 'payment_in'
  --   money out against invoices or
  --     credit notes (finance_refunds)  source 'refund'
  --   every other money out             source 'payment_out'
  --
  -- The bank or cash account takes the whole amount on one side.
  --
  -- Money in, and a refund: the other side is at most two lines, as before.
  --   * to_category, on the payment's own category: the part of the payment
  --     that settles no document, when the payment has a category.
  --   * the rest, on Accounts Receivable.
  --
  -- Money out that is not a refund: the other side is at most three lines,
  -- by what the money settles.
  --   * to_category, as above: a payment voucher for a category has no split,
  --     so this is its whole amount.
  --   * to_expenses, on Accrued Expenses: what its split gives to expenses,
  --     which is what finance_expense_totals counts as paid.
  --   * the rest, on Accounts Payable: what its split gives to supplier
  --     bills, which is what supplier_bill_totals counts as paid, and any
  --     part that settles nothing on a payment with no category, as money
  --     paid on account, since there is no other account it could honestly
  --     go to.
  -- The three are to_category, to_expenses and the amount less both, so they
  -- add to the bank line by construction. to_expenses is held to no more
  -- than the amount less to_category, so the third is never below zero and
  -- never drops out as a line with no amount: the entry balances whatever
  -- the split is.
  --
  -- One payment pays one kind of document (FIN06 in
  -- private.finance_allocation_guard) and its split is never more than its
  -- amount (FIN03), so in practice a payment for expenses is one line on
  -- Accrued Expenses, a payment for bills one line on Accounts Payable, and
  -- to_expenses is exactly the sum of its expense allocations. The parts are
  -- still summed per kind from the split, not taken from "what kind is
  -- this", so a payment written by hand against both would post each part
  -- to its own account.
  --
  -- The functions the app records money with never make a payment that both
  -- settles documents and carries a category (FIN15 in
  -- finance_save_cash_receipt, finance_post_cash_receipt and
  -- finance_record_voucher), and they make its amount exactly its split. No
  -- table constraint says either, though: the guards only hold the split to
  -- no more than the amount, and call the part above it "money out that
  -- settles no document" (20261028100000, items 7 to 10). So a payment
  -- written by hand can be above its split, and its category then takes the
  -- part above the split, as that guard's wording has it.
  select
    t.org_id,
    p.source || ':' || t.id::text,
    t.txn_date,
    p.source,
    t.id,
    t.number,
    concat_ws(' ',
      case p.source when 'payment_in' then 'Receipt' when 'refund' then 'Refund' else 'Payment' end,
      t.number,
      case when t.direction = 'in' then 'from ' else 'to ' end || coalesce(ct.name, t.party_name)),
    case when t.status = 'void' then (t.voided_at at time zone 'UTC')::date end,
    v.acct, v.sys, v.bank, v.cat, v.dflt, v.debit, v.credit
  from public.finance_transactions t
  left join public.finance_contacts ct on ct.org_id = t.org_id and ct.id = t.contact_id
  -- 20261122100000: the movement in ringgit (the amount on a ringgit account; amount_myr on one in another
  -- currency). Every "rest" below is in ringgit too.
  cross join lateral (select coalesce(t.amount_myr, t.amount) as amount_myr) m
  cross join lateral (
    select
      coalesce(sum(a.amount), 0) as allocated,
      -- 20261120110000: what the split used of the payment, and what the documents carried, in ringgit.
      -- Both are the amount for a ringgit document (null columns).
      coalesce(sum(coalesce(a.amount_myr, a.amount)), 0) as allocated_myr,
      coalesce(sum(coalesce(a.carried_myr, a.amount)), 0) as carried_myr,
      coalesce(sum(a.amount) filter (where a.expense_id is not null), 0) as expenses,
      count(a.invoice_id) + count(a.credit_note_id) as sales_documents
    from public.finance_allocations a
    where a.org_id = t.org_id and a.transaction_id = t.id
  ) k
  cross join lateral (
    select
      case
        when t.direction = 'in' then 'payment_in'
        when k.sales_documents > 0 then 'refund'
        else 'payment_out'
      end as source,
      case when t.category_id is not null then greatest(m.amount_myr - k.allocated_myr, 0) else 0 end as to_category
  ) p
  cross join lateral (
    -- Only money out that is not a refund has a part for expenses.
    select
      case when p.source = 'payment_out' then least(k.expenses, m.amount_myr - p.to_category) else 0 end as to_expenses
  ) q
  cross join lateral (
    -- 20261120110000: realised exchange gain (above 0) or loss (below 0) on documents in another
    -- currency: the ringgit received less the ringgit they carried (money in), or the ringgit they
    -- carried less the ringgit paid out (a refund). 0 for ringgit documents, whose two figures are equal.
    -- 20261121100000: a payment of bills too, as a refund: the ringgit the bills carried less the ringgit
    -- paid out (spec "The difference"). Only 20261121110000 writes a bill allocation's figures; an expense,
    -- a category payment and every ringgit bill have null columns, so carried = allocated and it is 0.
    select
      case p.source
        when 'payment_in' then k.allocated_myr - k.carried_myr
        when 'refund' then k.carried_myr - k.allocated_myr
        when 'payment_out' then k.carried_myr - k.allocated_myr
        else 0
      end as realised
  ) g
  cross join lateral (values
    -- 20261122100000: the bank line in ringgit, amount_myr.
    (null::uuid, null::text, t.account_id, null::uuid, null::text,
      (case when t.direction = 'in' then m.amount_myr else 0 end)::numeric,
      (case when t.direction = 'out' then m.amount_myr else 0 end)::numeric),
    (null::uuid, case when p.source = 'payment_out' then 'payable' else 'receivable' end, null::uuid, null::uuid, null::text,
      (case when t.direction = 'out'
            then m.amount_myr - p.to_category - q.to_expenses
                 + case when p.source in ('refund','payment_out') then k.carried_myr - k.allocated_myr else 0 end
            else 0 end)::numeric,
      (case when t.direction = 'in' then m.amount_myr - p.to_category - k.allocated_myr + k.carried_myr else 0 end)::numeric),
    (null::uuid, 'accrued_expenses'::text, null::uuid, null::uuid, null::text,
      q.to_expenses::numeric,
      0::numeric),
    (null::uuid, null::text, null::uuid, t.category_id, null::text,
      (case when t.direction = 'out' then p.to_category else 0 end)::numeric,
      (case when t.direction = 'in' then p.to_category else 0 end)::numeric),
    -- 20261120110000: the realised difference, a gain as a credit and a loss as a debit. 0 drops out.
    (null::uuid, 'fx_realised'::text, null::uuid, null::uuid, null::text,
      greatest(-g.realised, 0)::numeric, greatest(g.realised, 0)::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  where t.transfer_id is null
    and (t.status = 'posted' or (t.status = 'void' and t.voided_at is not null and t.number is not null))

  union all

  -- ---- supplier bill: posted, or voided after it was posted --------------------------
  -- Mirrors supplier_bill_totals: total is sum(amount + sst_amount). SST on a
  -- purchase is part of the cost, so the whole total goes to the bill's
  -- category. category_id is read from the table: that view's columns were
  -- fixed before the column existed.
  -- 20261121100000: in ringgit, from the lines' generated amount_myr and
  -- sst_amount_myr (equal to amount and sst_amount at rate 1), so a foreign
  -- bill posts its ringgit and a ringgit one posts what it always did.
  select
    sb.org_id,
    'bill:' || sb.id::text,
    sb.bill_date,
    'bill'::text,
    sb.id,
    sb.bill_no,
    concat_ws(' ', 'Bill', sb.bill_no, 'from ' || ct.name),
    case when sb.status = 'void' then (sb.voided_at at time zone 'UTC')::date end,
    v.acct, v.sys, v.bank, v.cat, v.dflt, v.debit, v.credit
  from public.supplier_bills sb
  left join public.finance_contacts ct on ct.org_id = sb.org_id and ct.id = sb.supplier_id
  cross join lateral (
    select coalesce(sum(bl.amount_myr + bl.sst_amount_myr), 0) as total
    from public.supplier_bill_lines bl
    where bl.org_id = sb.org_id and bl.bill_id = sb.id
  ) t
  cross join lateral (values
    (null::uuid, null::text, null::uuid, sb.category_id, null::text, t.total::numeric, 0::numeric),
    (null::uuid, 'payable'::text, null::uuid, null::uuid, null::text, 0::numeric, t.total::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  where sb.status = 'posted' or (sb.status = 'void' and sb.voided_at is not null)

  union all

  -- ---- supplier credit note: issued, or voided after it was issued -----------------
  -- Mirrors finance_supplier_credit_note_totals. A supplier credit note is MYR-only
  -- (no amount_myr column), so n.amount is its ringgit, as the ledger needs. An issued
  -- note debits Accounts Payable and credits the bill's category (the whole amount, as
  -- the bill's own entry put the whole total there). A voided one is reversed on the
  -- day it was voided by the outer query, as every other void.
  select
    n.org_id,
    'supplier_credit_note:' || n.id::text,
    n.credit_date,
    'supplier_credit_note'::text,
    n.id,
    n.credit_note_no,
    concat_ws(' ', 'Supplier credit note', n.credit_note_no, 'on ' || sb.bill_no, 'from ' || ct.name),
    case when n.status = 'void' then (n.voided_at at time zone 'UTC')::date end,
    v.acct, v.sys, v.bank, v.cat, v.dflt, v.debit, v.credit
  from public.finance_supplier_credit_notes n
  left join public.supplier_bills sb on sb.org_id = n.org_id and sb.id = n.bill_id
  left join public.finance_contacts ct on ct.org_id = sb.org_id and ct.id = sb.supplier_id
  cross join lateral (values
    (null::uuid, 'payable'::text, null::uuid, null::uuid, null::text, n.amount::numeric, 0::numeric),
    (null::uuid, null::text, null::uuid, sb.category_id, null::text, 0::numeric, n.amount::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  where n.status = 'issued' or (n.status = 'void' and n.voided_at is not null)

  union all

  -- ---- expense: each approval, and its reversal once it left the books --------------
  -- 20261125160000: read from finance_expense_approvals, one row per approval as it was
  -- posted, so a reversal undoes what was posted, not what the expense says now. amount
  -- is what is to be paid, SST included, and all of it is the cost. It is owed on Accrued
  -- Expenses, not Accounts Payable; paying it is a payment out against it, above, which
  -- takes it off Accrued Expenses. An approval that was sent back or rejected is also in
  -- once more, sides swapped, on the day it left the books, keyed ':reverse' and
  -- described "Sent back: " or "Rejected: " and the original's description (the outer
  -- void device does not apply: voided_on is null). The first approval keeps the key
  -- 'expense:<id>'; a later one is 'expense:<id>:<round>'. Every approval of an
  -- expense before this file is round 1, open, on the expense date: the lines that
  -- branch gave, row for row.
  select
    a.org_id,
    'expense:' || a.expense_id::text
      || case when a.round_no > 1 then ':' || a.round_no::text else '' end
      || case when rv.rev then ':reverse' else '' end,
    case when rv.rev then a.reversed_on else a.posted_on end,
    'expense'::text,
    a.expense_id,
    null::text,
    concat_ws(' ',
      case when rv.rev then case a.reversed_as when 'sent_back' then 'Sent back:' else 'Rejected:' end end,
      'Expense', 'to ' || coalesce(ct.name, e.vendor_name)),
    null::date,
    v.acct, v.sys, v.bank, v.cat, v.dflt,
    case when rv.rev then v.credit else v.debit end,
    case when rv.rev then v.debit else v.credit end
  from public.finance_expense_approvals a
  join public.finance_expenses e on e.org_id = a.org_id and e.id = a.expense_id
  left join public.finance_contacts ct on ct.org_id = e.org_id and ct.id = e.vendor_id
  cross join lateral (values
    (null::uuid, null::text, null::uuid, a.category_id, null::text, a.amount::numeric, 0::numeric),
    (null::uuid, 'accrued_expenses'::text, null::uuid, null::uuid, null::text, 0::numeric, a.amount::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  cross join lateral (values (false), (true)) as rv(rev)
  where not rv.rev or a.reversed_on is not null

  union all

  -- ---- transfer between accounts: both sides posted, or both voided after that -----
  -- Two finance_transactions rows that share a transfer_id, money out of one
  -- account and money in to another (20261031090000;
  -- finance_bank_transactions calls both 'transfer'). One entry, read from
  -- the paying side: its date, its number and its amount on both lines, and,
  -- when the transfer has been voided, its voided_at, so a voided transfer
  -- is one reversal as it was one entry.
  -- private.finance_transfer_pair_check holds the two sides to the same
  -- amount, date, number and status, and one UPDATE voids both, so the
  -- receiving side would say the same; taking one amount for both lines is
  -- what makes this balance without leaning on that.
  select
    o.org_id,
    'transfer:' || o.transfer_id::text,
    o.txn_date,
    'transfer'::text,
    o.transfer_id,
    o.number,
    concat_ws(' ', 'Transfer', o.number, 'from ' || fa.name, 'to ' || ta.name),
    case when o.status = 'void' then (o.voided_at at time zone 'UTC')::date end,
    v.acct, v.sys, v.bank, v.cat, v.dflt, v.debit, v.credit
  from public.finance_transactions o
  join public.finance_transactions i
    on i.org_id = o.org_id and i.transfer_id = o.transfer_id and i.direction = 'in'
  left join public.finance_accounts fa on fa.org_id = o.org_id and fa.id = o.account_id
  left join public.finance_accounts ta on ta.org_id = i.org_id and ta.id = i.account_id
  -- 20261122100000: one ringgit figure on both lines, the paying side's (the pair check holds both sides'
  -- ringgit equal; on two ringgit accounts it is the amount).
  cross join lateral (values
    (null::uuid, null::text, i.account_id, null::uuid, null::text, coalesce(o.amount_myr, o.amount)::numeric, 0::numeric),
    (null::uuid, null::text, o.account_id, null::uuid, null::text, 0::numeric, coalesce(o.amount_myr, o.amount)::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  where o.transfer_id is not null and o.direction = 'out'
    and ((o.status = 'posted' and i.status = 'posted')
         or (o.status = 'void' and i.status = 'void' and o.voided_at is not null and o.number is not null))

  union all

  -- ---- opening balance of a bank or cash account: not zero ---------------------------
  -- Mirrors finance_account_balances, which adds opening_balance to every
  -- account's balance, archived ones included. A positive balance is money
  -- the business had: debit the account, credit Opening Balance Equity. A
  -- negative one (an overdraft) is the other way round.
  select
    a.org_id,
    'opening:' || a.id::text,
    a.opening_date,
    'opening'::text,
    a.id,
    null::text,
    'Opening balance of ' || a.name,
    null::date,
    v.acct, v.sys, v.bank, v.cat, v.dflt, v.debit, v.credit
  -- 20261122100000: in ringgit, opening_balance_myr (the opening balance at its rate; the balance itself on a
  -- ringgit account). One whose ringgit rounds to 0.00 drops out as a line with no amount.
  from public.finance_accounts a
  cross join lateral (values
    (null::uuid, null::text, a.id, null::uuid, null::text,
      greatest(a.opening_balance_myr, 0)::numeric, greatest(-a.opening_balance_myr, 0)::numeric),
    (null::uuid, 'opening_equity'::text, null::uuid, null::uuid, null::text,
      greatest(-a.opening_balance_myr, 0)::numeric, greatest(a.opening_balance_myr, 0)::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  where a.opening_balance <> 0 and a.opening_balance <> 'NaN'

  union all

  -- ---- contra entry: posted, or voided after it was posted ---------------------------
  -- 20261119100000. A contra entry sets off what a contact owes on invoices
  -- against what is owed to them on bills, with no money moving: Accounts
  -- Payable goes down (debit) and Accounts Receivable goes down (credit) by
  -- the same amount. Mirrors finance_invoice_totals and supplier_bill_totals,
  -- which take posted contra lines off each document's balance; the guard on
  -- contra entries posts one only when its invoice lines and its bill lines
  -- each add up to its amount, so the entry's one amount is what both views
  -- took off. No line names a bank or cash account, so the Cash Flow and
  -- every bank balance are untouched. A voided one is reversed on the day it
  -- was voided by the outer query, as every other void.
  select
    k.org_id,
    'contra:' || k.id::text,
    k.contra_date,
    'contra'::text,
    k.id,
    k.contra_no,
    concat_ws(' ', 'Contra', k.contra_no, 'with ' || ct.name),
    case when k.status = 'void' then (k.voided_at at time zone 'UTC')::date end,
    v.acct, v.sys, v.bank, v.cat, v.dflt, v.debit, v.credit
  from public.finance_contras k
  left join public.finance_contacts ct on ct.org_id = k.org_id and ct.id = k.contact_id
  cross join lateral (values
    (null::uuid, 'payable'::text, null::uuid, null::uuid, null::text, k.amount::numeric, 0::numeric),
    (null::uuid, 'receivable'::text, null::uuid, null::uuid, null::text, 0::numeric, k.amount::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  where k.status = 'posted' or (k.status = 'void' and k.voided_at is not null)

  union all

  -- ---- FX revaluation: a posted run on its month end, and its reversal the next day ---------
  -- 20261123100000. Stored figures only (posted_myr of each line of the run). Per ledger account, d is the
  -- change in its debit balance: posted_myr for invoices (Receivable) and accounts (the account's own
  -- ledger account), -posted_myr for bills (Payable: owing more is a credit). Each account's line is Dr
  -- max(d, 0), Cr max(-d, 0); one Unrealised line takes D = -sum(d) the same way, so debits - credits =
  -- sum(d) - sum(d) = 0: the entry balances by construction. The reversal is made here, sides swapped
  -- and dated period_end + 1, keyed ':reverse'; the outer void device does not apply (voided_on is null).
  -- The run's per-currency, per-document detail is on its lines (plan decision 9).
  select
    r.org_id,
    'fx_revaluation:' || r.id::text || case when rv.rev then ':reverse' else '' end,
    r.period_end + case when rv.rev then 1 else 0 end,
    'fx_revaluation'::text,
    r.id,
    r.revaluation_no,
    concat_ws(' ', case when rv.rev then 'Reversal of FX revaluation' else 'FX revaluation' end,
              r.revaluation_no, 'at', to_char(r.period_end, 'YYYY-MM-DD')),
    null::date,
    v.acct, v.sys, v.bank, v.cat, v.dflt,
    case when rv.rev then v.credit else v.debit end,
    case when rv.rev then v.debit else v.credit end
  from public.finance_fx_revaluations r
  cross join lateral (
    select x.sys, x.bank, sum(x.d) as d
    from (
      select case ln.kind when 'invoice' then 'receivable' when 'bill' then 'payable' end as sys,
             ln.account_id as bank,
             case when ln.kind = 'bill' then -ln.posted_myr else ln.posted_myr end as d
      from public.finance_fx_revaluation_lines ln
      where ln.org_id = r.org_id and ln.revaluation_id = r.id
    ) x
    group by x.sys, x.bank
    union all
    select 'fx_unrealised'::text, null::uuid,
           -sum(case when ln.kind = 'bill' then -ln.posted_myr else ln.posted_myr end)
    from public.finance_fx_revaluation_lines ln
    where ln.org_id = r.org_id and ln.revaluation_id = r.id
  ) g
  cross join lateral (values
    (null::uuid, g.sys, g.bank, null::uuid, null::text, greatest(g.d, 0)::numeric, greatest(-g.d, 0)::numeric)
  ) as v(acct, sys, bank, cat, dflt, debit, credit)
  cross join lateral (values (false), (true)) as rv(rev)

  union all

  -- ---- manual journal: posted ---------------------------------------------------------
  -- As entered. The guard on journals refused to post it unless its debits
  -- equalled its credits, and a posted journal's lines cannot change. A
  -- journal has no void: it is reversed by a second journal, which is an
  -- entry of its own here.
  select
    jl.org_id,
    'journal:' || j.id::text,
    j.journal_date,
    'journal'::text,
    j.id,
    j.journal_no,
    j.description,
    null::date,
    jl.account_id, null::text, null::uuid, null::uuid, null::text, jl.debit::numeric, jl.credit::numeric
  from public.finance_journal_lines jl
  join public.finance_journals j on j.org_id = jl.org_id and j.id = jl.journal_id
  where j.status = 'posted'
) l(org_id, entry_key, entry_date, source, source_id, source_no, description, voided_on,
    acct, sys, bank, cat, dflt, debit, credit)
-- Each line once as it is, and once more, sides swapped, if its document was voided.
cross join lateral (values (false), (true)) as r(reversal)
left join public.finance_ledger_accounts s on s.org_id = l.org_id and s.system_key = l.sys
left join public.finance_ledger_accounts b on b.org_id = l.org_id and b.bank_account_id = l.bank
left join public.finance_ledger_accounts c on c.org_id = l.org_id and c.category_id = l.cat
left join public.finance_ledger_accounts d on d.org_id = l.org_id and d.default_for = l.dflt
where (not r.reversal or l.voided_on is not null)
  -- A line with no amount is left out: an invoice with no SST has no SST line.
  and (l.debit > 0 or l.credit > 0);

-- "create or replace" keeps the grants; said again so this file can be read
-- without the others.
revoke all on public.finance_ledger_lines from anon, authenticated, service_role;
grant select on public.finance_ledger_lines to authenticated;


-- ---- the audit trail ----------------------------------------------------------------
-- private.finance_expenses_audit, restated from 20261125120000 (its only definition),
-- with two more events (marked 20261125160000): an approved expense sent back, with its
-- reason, and an approved expense rejected. The trigger is unchanged.
create or replace function private.finance_expenses_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.finance_expenses;
  what text;
  ev text;
  party text;
  why text;
begin
  if (select auth.uid()) is null then
    return null;
  end if;
  if tg_op = 'DELETE' then
    if old.status not in ('pending', 'rejected') then
      return null;
    end if;
    r := old; what := 'Deleted an expense claim'; ev := 'deleted';
  elsif new.status is not distinct from old.status then
    return null;
  elsif old.status = 'pending' and new.status = 'approved' then
    r := new; what := 'Approved an expense'; ev := 'approved';
  elsif old.status = 'pending' and new.status = 'rejected' then
    r := new; what := 'Rejected an expense'; ev := 'rejected';
  -- 20261125160000
  elsif old.status = 'approved' and new.status = 'pending' then
    r := new; what := 'Sent back an expense'; ev := 'sent_back';
    why := nullif(btrim(current_setting('openkuasa.expense_send_back_reason', true)), '');
  elsif old.status = 'approved' and new.status = 'rejected' then
    r := new; what := 'Rejected an approved expense'; ev := 'rejected';
  else
    return null;
  end if;

  select coalesce(r.vendor_name, c.name) into party
    from (select 1) one
    left join public.finance_contacts c on c.org_id = r.org_id and c.id = r.vendor_id;
  perform private.finance_log(r.org_id, 'finance_expense', r.id, what, coalesce(party, 'an expense'),
    jsonb_strip_nulls(jsonb_build_object('event', ev, 'party', party, 'amount', r.amount, 'date', r.expense_date,
      'reason', why)));
  return null;
end $$;
revoke all on function private.finance_expenses_audit() from public, anon, authenticated, service_role;

-- ---- the file checks itself -----------------------------------------------------------
do $$
declare
  n bigint;
  names text;
begin
  -- No expense line that was in the books moved, every workspace, row for row, both ways.
  -- (The other branches of the view are its text as 20261123110000 left it.)
  select count(*) into n from (
    (select * from public.finance_ledger_lines where source = 'expense' except all select * from exp308_ledger_before)
    union all
    (select * from exp308_ledger_before except all select * from public.finance_ledger_lines where source = 'expense')
  ) d;
  if n <> 0 then
    raise exception '% expense ledger lines changed', n;
  end if;

  -- Every approved expense has exactly one approval in the books, and nothing else has one.
  select count(*) into n
    from public.finance_expenses e
   where (e.status = 'approved') <> exists (
     select 1 from public.finance_expense_approvals a
      where a.org_id = e.org_id and a.expense_id = e.id and a.reversed_at is null);
  if n <> 0 then
    raise exception '% expenses do not match their approvals', n;
  end if;

  -- The triggers on finance_expenses: the guard before, and the approvals' writer and the audit after.
  select string_agg(g.tgname, ',' order by g.tgname) into names
    from pg_catalog.pg_trigger g
   where g.tgrelid = 'public.finance_expenses'::regclass and not g.tgisinternal
     and g.tgenabled = 'O' and (g.tgtype & 2) = 0;
  if names !~ '^(.*,)?finance_expense_approvals_write,(.*,)?finance_expenses_audit(,.*)?$' then
    raise exception 'the AFTER triggers on finance_expenses are not as this file needs: %', names;
  end if;

  -- service_role holds nothing on the new table.
  if exists (select 1 from pg_catalog.pg_class c, aclexplode(c.relacl) a
              where c.oid = 'public.finance_expense_approvals'::regclass and a.grantee = 'service_role'::regrole) then
    raise exception 'service_role still holds a privilege on finance_expense_approvals';
  end if;
end $$;
