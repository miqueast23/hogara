import { router } from 'expo-router';
import { BadgeCheck, HandCoins, Landmark, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { PropertyTile } from '@/components/property-tile';
import { SearchBox } from '@/components/search-box';
import { ZONES } from '@/data/seed';
import { filtersToParams, sortProperties, type Filters } from '@/lib/search';
import { useIconColors, WRAP } from '@/lib/ui';
import { usePublishedProperties } from '@/services/properties';
import { PROPERTY_TYPES, type Operation } from '@/types';

type Tab = Operation | 'sell';
const TABS: Tab[] = ['sale', 'rent', 'sell'];

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <View className={`${WRAP} mt-10`}>
      <Text className="text-2xl font-extrabold text-ink dark:text-white">{title}</Text>
      {sub && <Text className="mt-1 text-sm text-muted dark:text-brand-200">{sub}</Text>}
      <View className="mt-4">{children}</View>
    </View>
  );
}

function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
      {children}
    </ScrollView>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const colors = useIconColors();
  const [tab, setTab] = useState<Tab>('sale');
  const operation: Operation = tab === 'rent' ? 'rent' : 'sale';
  const { data: all = [] } = usePublishedProperties();
  const forOp = all.filter((p) => p.operation === operation);

  const search = (f: Filters) => router.push({ pathname: '/search', params: filtersToParams(f) });

  const zones = ZONES.map((zone) => ({ zone, list: forOp.filter((p) => p.zone === zone) })).filter((z) => z.list.length);
  const types = PROPERTY_TYPES.map((type) => ({ type, list: forOp.filter((p) => p.type === type) })).filter((x) => x.list.length);

  const why = [
    { icon: BadgeCheck, title: t('home.whyVerified'), sub: t('home.whyVerifiedSub') },
    { icon: ShieldCheck, title: t('home.whyEscrow'), sub: t('home.whyEscrowSub') },
    { icon: Landmark, title: t('home.whyLegal'), sub: t('home.whyLegalSub') },
    { icon: HandCoins, title: t('home.whyGuarantee'), sub: t('home.whyGuaranteeSub') },
  ];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-night">
      <Header>
        <View className={`${WRAP} flex-row gap-2 pb-2`} accessibilityRole="tablist">
          {TABS.map((k) => {
            const active = tab === k;
            return (
              <Pressable
                key={k}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setTab(k)}
                className={`min-h-11 justify-center rounded-full border px-4 ${active ? 'border-white bg-white/15' : 'border-transparent hover:bg-white/10'}`}
              >
                <Text className="font-semibold text-white">{t(`nav.${k}`)}</Text>
              </Pressable>
            );
          })}
        </View>
        <View className={`${WRAP} pb-14 pt-8`}>
          <Text className="text-4xl font-extrabold leading-tight text-white md:text-5xl">{t(`hero.${tab}Title`)}</Text>
          <Text className="mt-3 text-lg text-brand-100 md:text-xl">{t(`hero.${tab}Sub`)}</Text>
        </View>
      </Header>

      <View className={`${WRAP} -mt-8`}>
        {tab === 'sell' ? (
          <View className="items-start gap-3 rounded-xl border-4 border-amber-400 bg-white p-5 dark:bg-night-card">
            <Text className="text-lg font-bold text-ink dark:text-white">{t('hero.sellCta')}</Text>
            <View className="min-h-11 justify-center rounded-md bg-line px-5 dark:bg-night-line">
              <Text className="font-semibold text-muted dark:text-brand-200">{t('hero.soon')}</Text>
            </View>
          </View>
        ) : (
          <SearchBox key={operation} initial={{ operation }} onSubmit={search} />
        )}
      </View>

      <Section title={t('home.exploreTitle')} sub={t('home.exploreSub')}>
        <Carousel>
          {zones.map(({ zone, list }) => (
            <Pressable
              key={zone}
              accessibilityRole="link"
              onPress={() => search({ operation, zone })}
              className="w-48 overflow-hidden rounded-xl"
            >
              <Image source={{ uri: list[0].photos[0] }} accessibilityIgnoresInvertColors className="h-32 w-full rounded-xl" />
              <Text className="mt-2 text-base font-bold text-ink dark:text-white">{zone}</Text>
              <Text className="text-sm text-muted dark:text-brand-200">{t('home.listings', { count: list.length })}</Text>
            </Pressable>
          ))}
        </Carousel>
      </Section>

      <Section title={t('home.byTypeTitle')}>
        <Carousel>
          {types.map(({ type, list }) => (
            <Pressable key={type} accessibilityRole="link" onPress={() => search({ operation, type })} className="w-56">
              <Image source={{ uri: list[0].photos[1] ?? list[0].photos[0] }} accessibilityIgnoresInvertColors className="h-40 w-full rounded-xl" />
              <Text className="mt-2 text-base font-bold text-ink dark:text-white">{t(`typesPlural.${type}`)}</Text>
              <Text className="text-sm text-muted dark:text-brand-200">{t('home.listings', { count: list.length })}</Text>
            </Pressable>
          ))}
        </Carousel>
      </Section>

      <Section title={t('home.lovedTitle')} sub={t('home.lovedSub')}>
        <Carousel>
          {sortProperties(forOp, 'score').map((p) => (
            <PropertyTile key={p.id} property={p} />
          ))}
        </Carousel>
      </Section>

      <Section title={t('home.whyTitle')}>
        <View className="gap-3 md:flex-row">
          {why.map(({ icon: Icon, title, sub }) => (
            <View key={title} className="flex-1 gap-2 rounded-xl border border-line p-4 dark:border-night-line">
              <Icon size={28} color={colors.brand} />
              <Text className="text-base font-bold text-ink dark:text-white">{title}</Text>
              <Text className="text-sm leading-5 text-muted dark:text-brand-200">{sub}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Footer />
    </ScrollView>
  );
}
