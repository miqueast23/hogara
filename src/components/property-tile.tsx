import { Link } from 'expo-router';
import { BadgeCheck } from 'lucide-react-native';
import { Image, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { scoreWord } from '@/lib/rules';
import { useIconColors } from '@/lib/ui';
import { usePrice } from '@/lib/use-price';
import type { Property } from '@/types';

/** Compact vertical card for home carousels. */
export function PropertyTile({ property: p }: { property: Property }) {
  const { t } = useTranslation();
  const price = usePrice();
  const colors = useIconColors();

  return (
    <Link href={{ pathname: '/property/[id]', params: { id: p.id } }} asChild>
      <Pressable
        accessibilityRole="link"
        className="w-64 overflow-hidden rounded-xl border border-line bg-white hover:shadow-lg dark:border-night-line dark:bg-night-card"
      >
        <Image source={{ uri: p.photos[0] }} accessibilityIgnoresInvertColors className="h-44 w-full" resizeMode="cover" />
        <View className="gap-1 p-3">
          <View className="flex-row items-center gap-1">
            <Text numberOfLines={1} className="flex-1 text-base font-bold text-ink dark:text-white">
              {p.title}
            </Text>
            {p.verified && <BadgeCheck size={16} color={colors.brand} accessibilityLabel={t('card.verified')} />}
          </View>
          <Text className="text-sm text-muted dark:text-brand-200">
            {p.zone} · {t(`types.${p.type}`)}
          </Text>
          {p.rating != null && (
            <View className="mt-1 flex-row items-center gap-2">
              <View className="rounded-md rounded-bl-none bg-brand-800 px-1.5 py-0.5">
                <Text className="text-sm font-bold text-white">{p.rating.toFixed(1)}</Text>
              </View>
              <Text className="text-sm text-ink dark:text-white">
                {t(`score.${scoreWord(p.rating)}`)} · {t('card.reviews', { count: p.reviews_count })}
              </Text>
            </View>
          )}
          <Text className="mt-2 text-right text-lg font-extrabold text-ink dark:text-white">
            {price(p.price_usd)}
            {p.operation === 'rent' && <Text className="text-xs font-normal"> {t('card.perMonth')}</Text>}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
