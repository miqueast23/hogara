import { router, useLocalSearchParams } from 'expo-router';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FilterPanel } from '@/components/filter-panel';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { PropertyCard } from '@/components/property-card';
import { SearchBox } from '@/components/search-box';
import { Select } from '@/components/select';
import {
  applyFilters,
  filtersFromParams,
  filtersToParams,
  sortProperties,
  SORT_KEYS,
  type Filters,
  type SortKey,
} from '@/lib/search';
import { useIconColors, WRAP } from '@/lib/ui';
import { usePublishedProperties } from '@/services/properties';

export default function SearchScreen() {
  const { t } = useTranslation();
  const colors = useIconColors();
  const filters = filtersFromParams(useLocalSearchParams());
  const [sort, setSort] = useState<SortKey>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const { data: all = [] } = usePublishedProperties();

  const results = sortProperties(applyFilters(all, filters), sort);
  const setFilters = (f: Filters) => router.setParams(filtersToParams(f));
  const clear = () => router.replace({ pathname: '/search', params: { operation: filters.operation } });
  const sortOptions = SORT_KEYS.map((k) => ({ value: k, label: t(`sort.${k}`) }));

  return (
    <ScrollView className="flex-1 bg-canvas dark:bg-night">
      <Header>
        <View className={`${WRAP} pb-4`}>
          <SearchBox key={JSON.stringify(filters)} initial={filters} onSubmit={setFilters} />
        </View>
      </Header>

      <View className={`${WRAP} mt-5 gap-5 md:flex-row md:items-start`}>
        <View className="hidden w-64 md:flex">
          <FilterPanel all={all} filters={filters} onChange={setFilters} />
        </View>

        <View className="flex-1 gap-3">
          <Text accessibilityRole="header" className="text-2xl font-extrabold text-ink dark:text-white">
            {t('results.found', { place: filters.zone ?? 'Caracas', count: results.length })}
          </Text>

          <View className="flex-row gap-2">
            <Select
              className="flex-1 border border-line md:max-w-80 dark:border-night-line"
              label={t('results.sortBy')}
              value={sort}
              onChange={setSort}
              options={sortOptions}
              icon={<ArrowUpDown size={18} color={colors.muted} />}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowFilters(true)}
              className="min-h-14 flex-row items-center gap-2 rounded-lg border border-line bg-white px-4 md:hidden dark:border-night-line dark:bg-night-card"
            >
              <SlidersHorizontal size={18} color={colors.brand} />
              <Text className="font-semibold text-brand-600 dark:text-brand-200">{t('results.filters')}</Text>
            </Pressable>
          </View>

          {results.length === 0 ? (
            <View className="items-center gap-2 rounded-xl border border-line bg-white p-8 dark:border-night-line dark:bg-night-card">
              <Text className="text-lg font-bold text-ink dark:text-white">{t('results.empty')}</Text>
              <Text className="text-center text-sm text-muted dark:text-brand-200">{t('results.emptyHint')}</Text>
              <Pressable accessibilityRole="button" onPress={clear} className="mt-2 min-h-11 justify-center px-4">
                <Text className="font-semibold text-brand-600 underline dark:text-brand-200">{t('results.clear')}</Text>
              </Pressable>
            </View>
          ) : (
            results.map((p) => <PropertyCard key={p.id} property={p} />)
          )}
        </View>
      </View>

      <Modal visible={showFilters} animationType="slide" onRequestClose={() => setShowFilters(false)}>
        <View className="flex-1 bg-canvas dark:bg-night">
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <FilterPanel all={all} filters={filters} onChange={setFilters} />
          </ScrollView>
          <View className="flex-row gap-3 border-t border-line bg-white p-4 dark:border-night-line dark:bg-night-card">
            <Pressable accessibilityRole="button" onPress={clear} className="min-h-12 justify-center px-3">
              <Text className="font-semibold text-brand-600 dark:text-brand-200">{t('results.clear')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowFilters(false)}
              className="min-h-12 flex-1 items-center justify-center rounded-lg bg-brand-600"
            >
              <Text className="font-bold text-white">{t('results.show', { count: results.length })}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Footer />
    </ScrollView>
  );
}
