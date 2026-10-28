import { BedDouble, Building2, MapPin, Search, Wallet } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ZONES } from '@/data/seed';
import type { Filters } from '@/lib/search';
import { useIconColors } from '@/lib/ui';
import { PROPERTY_TYPES, type PropertyType } from '@/types';
import { Select } from './select';

const BEDROOM_OPTIONS = [1, 2, 3, 4];

/** Booking-style search bar: thick amber frame, white fields, one strong button. */
export function SearchBox({ initial, onSubmit }: { initial: Filters; onSubmit: (f: Filters) => void }) {
  const { t } = useTranslation();
  const colors = useIconColors();
  const [zone, setZone] = useState(initial.zone ?? '');
  const [type, setType] = useState<PropertyType | ''>(initial.type ?? '');
  const [bedrooms, setBedrooms] = useState(initial.bedroomsMin ?? 0);
  const [price, setPrice] = useState(initial.priceMax ? String(initial.priceMax) : '');

  const submit = () =>
    onSubmit({
      ...initial,
      zone: zone || undefined,
      type: type || undefined,
      bedroomsMin: bedrooms || undefined,
      priceMax: Number(price) > 0 ? Number(price) : undefined,
    });

  return (
    <View className="gap-1 rounded-xl bg-amber-400 p-1 shadow-lg md:flex-row">
      <Select
        className="md:flex-[1.4]"
        label={t('search.zone')}
        value={zone}
        onChange={setZone}
        icon={<MapPin size={20} color={colors.muted} />}
        options={[{ value: '', label: t('search.anyZone') }, ...ZONES.map((z) => ({ value: z, label: z }))]}
      />
      <Select
        className="md:flex-1"
        label={t('search.type')}
        value={type}
        onChange={setType}
        icon={<Building2 size={20} color={colors.muted} />}
        options={[
          { value: '' as const, label: t('search.anyType') },
          ...PROPERTY_TYPES.map((p) => ({ value: p, label: t(`types.${p}`) })),
        ]}
      />
      <Select
        className="md:flex-1"
        label={t('search.bedrooms')}
        value={bedrooms}
        onChange={setBedrooms}
        icon={<BedDouble size={20} color={colors.muted} />}
        options={[
          { value: 0, label: t('search.any') },
          ...BEDROOM_OPTIONS.map((n) => ({ value: n, label: t('search.bedroomsMin', { count: n }) })),
        ]}
      />
      <View className="min-h-14 flex-row items-center gap-3 rounded-lg bg-white px-3 md:flex-1 dark:bg-night-card">
        <Wallet size={20} color={colors.muted} />
        <View className="flex-1">
          <Text className="text-xs text-muted dark:text-brand-200">{t('search.priceMax')}</Text>
          <TextInput
            accessibilityLabel={t('search.priceMax')}
            value={price}
            onChangeText={(v) => setPrice(v.replace(/\D/g, ''))}
            onSubmitEditing={submit}
            inputMode="numeric"
            placeholder={t('search.priceMaxPlaceholder')}
            placeholderTextColor="#8a9aa0"
            className="p-0 text-base font-semibold text-ink outline-none dark:text-white"
          />
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={submit}
        className="min-h-14 flex-row items-center justify-center gap-2 rounded-lg bg-brand-600 px-8 hover:bg-brand-700 active:bg-brand-800"
      >
        <Search size={20} color="#fff" />
        <Text className="text-lg font-bold text-white">{t('search.submit')}</Text>
      </Pressable>
    </View>
  );
}
