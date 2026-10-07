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

// Lekiu (people / HIRA)
import HrAssistantScreen from '@/screens/people/assistant';
import DashboardScreen from '@/screens/people/dashboard';
import AnnouncementsScreen from '@/screens/people/announcements';
import MyAttendanceScreen from '@/screens/people/my-attendance';
import MyGoalsScreen from '@/screens/people/my-goals';
import MyDocumentsScreen from '@/screens/people/my-documents';
import RecordsScreen from '@/screens/people/records';
import LeaveScreen from '@/screens/people/leave';
import TimeOffScreen from '@/screens/people/time-off';
import ClaimsScreen from '@/screens/people/claims';
import OtClaimsScreen from '@/screens/people/ot-claims';
import EmployeesScreen from '@/screens/people/employees';
import ApproveLeaveScreen from '@/screens/people/approve-leave';
import ApproveClaimsScreen from '@/screens/people/approve-claims';
import ApproveOvertimeScreen from '@/screens/people/approve-overtime';
import ApproveTimeOffScreen from '@/screens/people/approve-time-off';
import PublicHolidaysScreen from '@/screens/people/public-holidays';
import LettersScreen from '@/screens/people/letters';
import TimesheetScreen from '@/screens/people/timesheet';
import ShiftCalendarScreen from '@/screens/people/shift-calendar';
import OvertimeScreen from '@/screens/people/overtime';
import PayrollScreen from '@/screens/people/payroll';
import PaymentVouchersScreen from '@/screens/people/payment-vouchers';
import ScorecardScreen from '@/screens/people/scorecard';
import ReviewScoresScreen from '@/screens/people/review-scores';
import TrainingScreen from '@/screens/people/training';
import HrSettingsScreen from '@/screens/people/settings';

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

  // Kasturi (ARA Manage)
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

  // Lekiu (HIRA Team)
  'people/assistant': HrAssistantScreen,
  'people/dashboard': DashboardScreen,
  'people/calendar': CalendarScreen,
  'people/announcements': AnnouncementsScreen,
  'people/my-attendance': MyAttendanceScreen,
  'people/my-goals': MyGoalsScreen,
  'people/my-documents': MyDocumentsScreen,
  'people/records': RecordsScreen,
  'people/leave': LeaveScreen,
  'people/time-off': TimeOffScreen,
  'people/claims': ClaimsScreen,
  'people/ot-claims': OtClaimsScreen,
  'people/employees': EmployeesScreen,
  'people/approve-leave': ApproveLeaveScreen,
  'people/approve-claims': ApproveClaimsScreen,
  'people/approve-overtime': ApproveOvertimeScreen,
  'people/approve-time-off': ApproveTimeOffScreen,
  'people/public-holidays': PublicHolidaysScreen,
  'people/letters': LettersScreen,
  'people/timesheet': TimesheetScreen,
  'people/shift-calendar': ShiftCalendarScreen,
  'people/overtime': OvertimeScreen,
  'people/payroll': PayrollScreen,
  'people/payment-vouchers': PaymentVouchersScreen,
  'people/scorecard': ScorecardScreen,
  'people/review-scores': ReviewScoresScreen,
  'people/training': TrainingScreen,
  'people/settings': HrSettingsScreen,
};
