import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const migration = readFileSync(
  join(process.cwd(), 'supabase/migrations/20261009090700_kasturi_crm_schema.sql'),
  'utf8',
);

describe('Kasturi CRM schema migration', () => {
  test('creates the core CRM tables under org tenancy', () => {
    for (const table of [
      'crm_pipelines',
      'crm_pipeline_stages',
      'crm_contacts',
      'crm_deals',
      'crm_activities',
      'crm_notes',
      'crm_attachments',
      'crm_audit_logs',
    ]) {
      expect(migration).toContain(`create table public.${table}`);
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });

  test('keeps tenant records scoped by org_id and existing helper functions', () => {
    expect(migration).toContain('references public.orgs(id) on delete cascade');
    expect(migration).toContain('private.is_org_member(org_id)');
    expect(migration).toContain('private.is_org_writer(org_id)');
  });

  test('models the minimum sales workflow from contact to deal to activity', () => {
    expect(migration).toContain('crm_deals_contact_id_idx');
    expect(migration).toContain('crm_deals_stage_id_idx');
    expect(migration).toContain('crm_activities_deal_id_idx');
    expect(migration).toContain("check (status in ('open','won','lost'))");
    expect(migration).toContain("check (type in ('call','whatsapp','email','meeting','task','note'))");
  });
});
