import { useQuery } from '@tanstack/react-query';

import { exchangeRateProvider } from '@/services/exchange-rate';
import { usePrefs } from '@/store/prefs';
import { usdToBs } from './rules';

/** Formats a USD price in the viewer's currency (rule 16). */
export function usePrice() {
  const currency = usePrefs((s) => s.currency);
  const language = usePrefs((s) => s.language);
  const { data: rate } = useQuery({ queryKey: ['usd-bs'], queryFn: exchangeRateProvider.getUsdToBs });

  return (usd: number) => {
    const locale = language === 'es' ? 'es-VE' : 'en-US';
    if (currency === 'VES' && rate) {
      return `Bs ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(usdToBs(usd, rate))}`;
    }
    return `US$ ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(usd)}`;
  };
}
