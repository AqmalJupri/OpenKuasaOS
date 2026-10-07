import type { ComponentType } from 'react';
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

/**
 * Built-out screens, keyed by `${productKey}/${itemSlug}`.
 * Anything not here falls back to a generic placeholder.
 */
export const SCREENS: Record<string, ComponentType> = {
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
};
