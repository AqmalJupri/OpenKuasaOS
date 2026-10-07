import type { ComponentType } from 'react';

// Jebat (reach)
import AssistantScreen from '@/screens/reach/assistant';
import AgentsScreen from '@/screens/reach/agents';
import AdStudioScreen from '@/screens/reach/ad-studio';
import CreativeBankScreen from '@/screens/reach/creative-bank';
import ReportsScreen from '@/screens/reach/reports';
import ContactsScreen from '@/screens/reach/contacts';
import LeadFormsScreen from '@/screens/reach/lead-forms';
import AppointmentsScreen from '@/screens/reach/appointments';
import AdSettingsScreen from '@/screens/reach/ad-settings';
import HealthCheckScreen from '@/screens/reach/health-check';

// Kasturi (crm)
import CrmAssistantScreen from '@/screens/crm/assistant';
import CrmAgentsScreen from '@/screens/crm/agents';
import DealsScreen from '@/screens/crm/deals';
import BroadcastScreen from '@/screens/crm/broadcast';
import ChatbotScreen from '@/screens/crm/chatbot';
import AutomationsScreen from '@/screens/crm/automations';
import CrmLandingPageScreen from '@/screens/crm/landing-page';
import CalendarScreen from '@/screens/crm/calendar';
import BillingsScreen from '@/screens/crm/billings';
import PluginsScreen from '@/screens/crm/plugins';
import CrmSettingsScreen from '@/screens/crm/settings';

/**
 * Built-out screens, keyed by `${productKey}/${itemSlug}`.
 * Anything not here falls back to a generic placeholder.
 */
export const SCREENS: Record<string, ComponentType> = {
  // Jebat (ARA Get)
  'reach/assistant': AssistantScreen,
  'reach/agents': AgentsScreen,
  'reach/ad-studio': AdStudioScreen,
  'reach/creative-bank': CreativeBankScreen,
  'reach/reports': ReportsScreen,
  'reach/contacts': ContactsScreen,
  'reach/lead-forms': LeadFormsScreen,
  'reach/appointments': AppointmentsScreen,
  'reach/ad-settings': AdSettingsScreen,
  'reach/health-check': HealthCheckScreen,

  // Kasturi (ARA Manage) — generic data screens reuse the Jebat components
  'crm/assistant': CrmAssistantScreen,
  'crm/agents': CrmAgentsScreen,
  'crm/contacts': ContactsScreen,
  'crm/deals': DealsScreen,
  'crm/lead-forms': LeadFormsScreen,
  'crm/broadcast': BroadcastScreen,
  'crm/chatbot': ChatbotScreen,
  'crm/automations': AutomationsScreen,
  'crm/landing-page': CrmLandingPageScreen,
  'crm/appointments': AppointmentsScreen,
  'crm/calendar': CalendarScreen,
  'crm/billings': BillingsScreen,
  'crm/reports': ReportsScreen,
  'crm/plugins': PluginsScreen,
  'crm/settings': CrmSettingsScreen,
};
