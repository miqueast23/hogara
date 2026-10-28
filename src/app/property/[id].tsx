import { Link, useLocalSearchParams } from 'expo-router';
import { BadgeCheck, MapPin, Rotate3d, ShieldCheck } from 'lucide-react-native';
import { Image, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ScoreBadge } from '@/components/score-badge';
import { scarcityUnits } from '@/lib/rules';
import { useIconColors, WRAP } from '@/lib/ui';
import { usePrice } from '@/lib/use-price';
import { usePublishedProperties } from '@/services/properties';

// ponytail: detail v0 (gallery, facts, price box). Price history, AI valuation, trust breakdown, chat, visit and
// reservation breakdown land in phase 2/4 per CLAUDE.md.
export default function PropertyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const price = usePrice();
  const colors = useIconColors();
  const { data: all = [], isLoading } = usePublishedProperties();
  const p = all.find((x) => x.id === id);

  if (!p) {
    return (
      <View className="flex-1 bg-white dark:bg-night">
        <Header />
        {!isLoading && (
          <View className={`${WRAP} mt-10 items-start gap-3`}>
            <Text className="text-xl font-bold text-ink dark:text-white">{t('results.empty')}</Text>
            <Link href="/" className="font-semibold text-brand-600 underline">
              hogara
            </Link>
          </View>
        )}
      </View>
    );
  }

  const units = scarcityUnits(p.units_available);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-night">
      <Header />
      <View className={`${WRAP} mt-6 gap-4`}>
        <View className="flex-row flex-wrap items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text accessibilityRole="header" className="text-3xl font-extrabold text-ink dark:text-white">
              {p.title}
            </Text>
            <View className="flex-row items-center gap-1">
              <MapPin size={16} color={colors.brand} />
              <Text className="text-sm text-brand-600 dark:text-brand-200">
                {p.zone}, {p.city}
              </Text>
            </View>
          </View>
          <ScoreBadge rating={p.rating} count={p.reviews_count} />
        </View>

        <View className="gap-2 md:h-96 md:flex-row">
          <View className="relative md:flex-[2]">
            <Image source={{ uri: p.photos[0] }} accessibilityIgnoresInvertColors className="h-64 w-full rounded-xl md:h-full" />
            {p.has_tour360 && (
              <View className="absolute bottom-3 left-3 flex-row items-center gap-1 rounded-md bg-black/70 px-2 py-1">
                <Rotate3d size={16} color="#fff" />
                <Text className="text-sm font-bold text-white">{t('card.tour360')}</Text>
              </View>
            )}
          </View>
          <View className="flex-row gap-2 md:flex-1 md:flex-col">
            {p.photos.slice(1, 3).map((uri) => (
              <Image key={uri} source={{ uri }} accessibilityIgnoresInvertColors className="h-32 flex-1 rounded-xl md:h-auto" />
            ))}
          </View>
        </View>

        <View className="gap-6 md:flex-row md:items-start">
          <View className="flex-1 gap-3">
            <Text className="text-base text-ink dark:text-white">
              {t(`types.${p.type}`)} · {p.bedrooms > 0 ? `${t('card.beds', { count: p.bedrooms })} · ` : ''}
              {t('card.baths', { count: p.bathrooms })} · {p.area_m2} m²
            </Text>
            <Text className="text-base leading-6 text-ink dark:text-white">{p.description}</Text>
            <View className="flex-row flex-wrap gap-2">
              {p.verified && (
                <View className="flex-row items-center gap-1 rounded-md bg-brand-50 px-2 py-1 dark:bg-brand-900">
                  <BadgeCheck size={16} color={colors.brand} />
                  <Text className="text-sm font-semibold text-brand-700 dark:text-brand-200">{t('card.verified')}</Text>
                </View>
              )}
              <View className="rounded-md bg-canvas px-2 py-1 dark:bg-night-card">
                <Text className="text-sm text-muted dark:text-brand-200">{t('card.trust', { score: p.trust_score })}</Text>
              </View>
            </View>
          </View>

          <View className="gap-2 rounded-xl border border-line bg-brand-50 p-4 md:w-80 dark:border-night-line dark:bg-night-card">
            <Text className="text-3xl font-extrabold text-ink dark:text-white">
              {price(p.price_usd)}
              {p.operation === 'rent' && <Text className="text-base font-normal"> {t('card.perMonth')}</Text>}
            </Text>
            <Text className="text-xs text-muted dark:text-brand-200">{t('card.priceNote')}</Text>
            <View className="flex-row items-center gap-1">
              <ShieldCheck size={16} color={colors.success} />
              <Text className="text-sm font-semibold text-success dark:text-[#5fd3a8]">{t('card.escrow')}</Text>
            </View>
            {units != null && (
              <Text className="text-sm font-semibold text-[#b42318] dark:text-[#ff8a80]">{t('card.onlyLeft', { count: units })}</Text>
            )}
            <Text className="text-xs leading-5 text-muted dark:text-brand-200">{t('home.whyGuaranteeSub')}</Text>
          </View>
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
}
