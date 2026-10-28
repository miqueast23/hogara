import { Link } from 'expo-router';
import { BadgeCheck, MapPin, Rotate3d, ShieldCheck } from 'lucide-react-native';
import { Image, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { scarcityUnits } from '@/lib/rules';
import { useIconColors } from '@/lib/ui';
import { usePrice } from '@/lib/use-price';
import type { Property } from '@/types';
import { ScoreBadge } from './score-badge';

/** Search result row: photo left, facts middle, score + price + CTA right (stacked on phones). */
export function PropertyCard({ property: p }: { property: Property }) {
  const { t } = useTranslation();
  const price = usePrice();
  const colors = useIconColors();
  const units = scarcityUnits(p.units_available);

  return (
    <View className="gap-4 rounded-xl border border-line bg-white p-3 md:flex-row dark:border-night-line dark:bg-night-card">
      <View className="relative">
        <Image
          source={{ uri: p.photos[0] }}
          accessibilityIgnoresInvertColors
          className="h-52 w-full rounded-lg md:h-56 md:w-60"
          resizeMode="cover"
        />
        {p.has_tour360 && (
          <View className="absolute bottom-2 left-2 flex-row items-center gap-1 rounded-md bg-black/70 px-2 py-1">
            <Rotate3d size={14} color="#fff" />
            <Text className="text-xs font-bold text-white">{t('card.tour360')}</Text>
          </View>
        )}
      </View>

      <View className="flex-1 gap-1.5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Link href={{ pathname: '/property/[id]', params: { id: p.id } }}>
              <Text className="text-lg font-bold leading-snug text-brand-600 hover:underline dark:text-brand-200">
                {p.title}
              </Text>
            </Link>
            <View className="flex-row items-center gap-1">
              <MapPin size={14} color={colors.brand} />
              <Text className="text-sm text-brand-600 underline dark:text-brand-200">
                {p.zone}, {p.city}
              </Text>
            </View>
          </View>
          <View className="hidden md:flex">
            <ScoreBadge rating={p.rating} count={p.reviews_count} />
          </View>
        </View>

        <Text className="text-sm text-ink dark:text-white">
          {t(`types.${p.type}`)} · {p.bedrooms > 0 ? `${t('card.beds', { count: p.bedrooms })} · ` : ''}
          {t('card.baths', { count: p.bathrooms })} · {p.area_m2} m²
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {p.verified && (
            <View className="flex-row items-center gap-1 rounded-md bg-brand-50 px-2 py-1 dark:bg-brand-900">
              <BadgeCheck size={14} color={colors.brand} />
              <Text className="text-xs font-semibold text-brand-700 dark:text-brand-200">{t('card.verified')}</Text>
            </View>
          )}
          <Text className="self-center text-xs text-muted dark:text-brand-200">{t('card.trust', { score: p.trust_score })}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <ShieldCheck size={16} color={colors.success} />
          <Text className="text-sm font-semibold text-success dark:text-[#5fd3a8]">{t('card.escrow')}</Text>
        </View>
        {units != null && (
          <Text className="text-sm font-semibold text-[#b42318] dark:text-[#ff8a80]">{t('card.onlyLeft', { count: units })}</Text>
        )}

        <View className="mt-auto flex-row items-end justify-between gap-3 pt-2">
          <View className="md:hidden">
            <ScoreBadge rating={p.rating} count={p.reviews_count} reverse />
          </View>
          <View className="ml-auto items-end gap-1">
            <Text className="text-2xl font-extrabold text-ink dark:text-white">
              {price(p.price_usd)}
              {p.operation === 'rent' && <Text className="text-sm font-normal"> {t('card.perMonth')}</Text>}
            </Text>
            <Text className="text-xs text-muted dark:text-brand-200">{t('card.priceNote')}</Text>
            <Link href={{ pathname: '/property/[id]', params: { id: p.id } }} asChild>
              <Pressable
                accessibilityRole="link"
                className="mt-1 min-h-11 items-center justify-center rounded-md bg-brand-600 px-5 hover:bg-brand-700 active:bg-brand-800"
              >
                <Text className="font-bold text-white">{t('card.seeAvailability')} ›</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
