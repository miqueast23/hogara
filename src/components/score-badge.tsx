import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { scoreWord } from '@/lib/rules';

/** Word + review count next to the square score, like Booking's review badge. */
export function ScoreBadge({ rating, count, reverse = false }: { rating: number | null; count: number; reverse?: boolean }) {
  const { t } = useTranslation();

  if (rating == null) {
    return <Text className="text-sm text-muted dark:text-brand-200">{t('card.noReviews')}</Text>;
  }

  return (
    <View className={`items-center gap-2 ${reverse ? 'flex-row-reverse' : 'flex-row'}`}>
      <View className={reverse ? 'items-start' : 'items-end'}>
        <Text className="text-base font-bold text-ink dark:text-white">{t(`score.${scoreWord(rating)}`)}</Text>
        <Text className="text-xs text-muted dark:text-brand-200">{t('card.reviews', { count })}</Text>
      </View>
      <View className="h-9 min-w-9 items-center justify-center rounded-md rounded-bl-none bg-brand-800 px-1.5">
        <Text className="text-base font-bold text-white">{rating.toFixed(1)}</Text>
      </View>
    </View>
  );
}
