# Kasturi CRM backend spine

This slice turns Kasturi from a screen-only CRM shell into a database-ready module.

## Scope

Tables added:

- `crm_pipelines`
- `crm_pipeline_stages`
- `crm_contacts`
- `crm_deals`
- `crm_activities`
- `crm_notes`
- `crm_attachments`
- `crm_audit_logs`

## Workflow covered

1. A user belongs to an organisation through `org_members`.
2. The organisation owns pipelines and stages.
3. Contacts belong to the organisation.
4. Deals belong to contacts, pipelines and stages.
5. Activities, notes and attachments can sit on a contact or a deal.
6. Audit logs record important CRM changes.

## Access rule

All CRM records are scoped by `org_id`.

- Org members can read.
- Org writers can create, update and delete.
- Audit logs are insert and read only from app-side policy.

The migration reuses the private tenancy helper functions:

- `private.is_org_member(org_id)`
- `private.is_org_writer(org_id)`

## Not included yet

- UI wiring
- Server actions
- CSV import
- Supabase Storage bucket policies
- Audit trigger functions
- Seed demo CRM data

Those should come as smaller follow-up slices.
