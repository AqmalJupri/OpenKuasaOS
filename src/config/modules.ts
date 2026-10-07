import {
  Compass,
  Megaphone,
  SquareKanban,
  Users,
  UserPlus,
  Landmark,
  type LucideIcon,
} from 'lucide-react';

export type ModuleItem = {
  /** route segment / stable key */
  key: string;
  /** Hang codename shown in the UI */
  name: string;
  /** original Kuasa module, kept for reference */
  kuasa: string;
  /** persona one-liner (from the warrior's character) */
  tagline: string;
  href: string;
  icon: LucideIcon;
};

/**
 * The operating modules, named after the five Hang warriors + the Bendahara.
 * The AI assistant (Taming Sari) is not a module — it rides along every screen.
 */
export const MODULES: ModuleItem[] = [
  {
    key: 'command',
    name: 'Tuah',
    kuasa: 'AI CEO',
    tagline: 'Command your business',
    href: '/command',
    icon: Compass,
  },
  {
    key: 'reach',
    name: 'Jebat',
    kuasa: 'ARA · Ads',
    tagline: 'Win new leads with AI ads',
    href: '/reach',
    icon: Megaphone,
  },
  {
    key: 'crm',
    name: 'Kasturi',
    kuasa: 'ARA · CRM',
    tagline: 'Manage & close your pipeline',
    href: '/crm',
    icon: SquareKanban,
  },
  {
    key: 'people',
    name: 'Lekiu',
    kuasa: 'HIRA · Team',
    tagline: 'Build & manage your team',
    href: '/people',
    icon: Users,
  },
  {
    key: 'hire',
    name: 'Lekir',
    kuasa: 'HIRA · Recruit',
    tagline: 'Recruit & hire your next team',
    href: '/hire',
    icon: UserPlus,
  },
  {
    key: 'finance',
    name: 'Bendahara',
    kuasa: 'Safa',
    tagline: 'Accounting & e-Invois LHDN',
    href: '/finance',
    icon: Landmark,
  },
];

/** The cross-app AI assistant. */
export const ASSISTANT = {
  name: 'Taming Sari',
  short: 'Sari',
  tagline: 'Ask anything',
} as const;
