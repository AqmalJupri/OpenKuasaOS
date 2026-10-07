import type { ComponentType } from 'react';
import ContactsScreen from '@/screens/reach/contacts';

/**
 * Built-out screens, keyed by `${productKey}/${itemSlug}`.
 * Anything not here falls back to a generic placeholder.
 */
export const SCREENS: Record<string, ComponentType> = {
  'reach/contacts': ContactsScreen,
};
