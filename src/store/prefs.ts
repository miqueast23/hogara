import { create } from 'zustand';

import i18n from '@/i18n';

export type Currency = 'USD' | 'VES';
export type Language = 'es' | 'en';

type Prefs = {
  currency: Currency;
  language: Language;
  setCurrency: (c: Currency) => void;
  setLanguage: (l: Language) => void;
};

export const usePrefs = create<Prefs>((set) => ({
  currency: 'USD',
  language: (i18n.language as Language) ?? 'es',
  setCurrency: (currency) => set({ currency }),
  setLanguage: (language) => {
    i18n.changeLanguage(language);
    set({ language });
  },
}));
