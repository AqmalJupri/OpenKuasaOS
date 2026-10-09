import { describe, expect, test, vi } from 'vitest';
import {
  createCrmContact,
  parseCrmContactForm,
} from '@/lib/crm/contacts';

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

function createInsertClient() {
  const query = {
    insert: vi.fn(() => query),
    select: vi.fn(() => query),
    single: vi.fn(async () => ({
      data: {
        id: 'contact-1',
        email: 'aisyah@example.com',
        company_name: 'Rimba Ventures',
        first_name: 'Aisyah',
        last_name: 'Rahim',
        phone: '+60123456789',
        country: 'MY',
        status: 'qualified',
        lead_score: 72,
        owner_name: null,
        last_interaction_at: null,
      },
      error: null,
    })),
  };
  return { client: { from: vi.fn(() => query) }, query };
}

describe('create Kasturi contact', () => {
  test('parses form data into an org-scoped insert payload', () => {
    const payload = parseCrmContactForm(
      form({
        firstName: ' Aisyah ',
        lastName: ' Rahim ',
        email: ' AISYAH@EXAMPLE.COM ',
        phone: ' +60123456789 ',
        company: ' Rimba Ventures ',
        country: ' my ',
        status: 'Qualified',
        leadScore: '72',
      }),
      'org-1',
    );

    expect(payload).toEqual({
      org_id: 'org-1',
      first_name: 'Aisyah',
      last_name: 'Rahim',
      email: 'aisyah@example.com',
      phone: '+60123456789',
      company_name: 'Rimba Ventures',
      country: 'MY',
      status: 'qualified',
      lead_score: 72,
    });
  });

  test('rejects an invalid email before insert', () => {
    expect(() =>
      parseCrmContactForm(
        form({ firstName: 'Aisyah', email: 'bad-email' }),
        'org-1',
      ),
    ).toThrow('Enter a valid email.');
  });

  test('inserts the contact and maps the returned row', async () => {
    const { client, query } = createInsertClient();

    const contact = await createCrmContact(client, {
      org_id: 'org-1',
      first_name: 'Aisyah',
      last_name: 'Rahim',
      email: 'aisyah@example.com',
      phone: '+60123456789',
      company_name: 'Rimba Ventures',
      country: 'MY',
      status: 'qualified',
      lead_score: 72,
    });

    expect(client.from).toHaveBeenCalledWith('crm_contacts');
    expect(query.insert).toHaveBeenCalledWith({
      org_id: 'org-1',
      first_name: 'Aisyah',
      last_name: 'Rahim',
      email: 'aisyah@example.com',
      phone: '+60123456789',
      company_name: 'Rimba Ventures',
      country: 'MY',
      status: 'qualified',
      lead_score: 72,
    });
    expect(query.select).toHaveBeenCalled();
    expect(query.single).toHaveBeenCalled();
    expect(contact.email).toBe('aisyah@example.com');
    expect(contact.status).toBe('Qualified');
  });
});
