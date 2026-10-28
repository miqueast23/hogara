import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ZONES } from '@/data/seed';
import { countWith, type Filters } from '@/lib/search';
import { PROPERTY_TYPES, type Property } from '@/types';

type Props = { all: Property[]; filters: Filters; onChange: (f: Filters) => void };

function Row({ label, count, checked, onPress }: { label: string; count: number; checked: boolean; onPress: () => void }) {
  const disabled = count === 0 && !checked;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-11 flex-row items-center gap-3 ${disabled ? 'opacity-40' : ''}`}
    >
      <View
        className={`h-5 w-5 items-center justify-center rounded border ${checked ? 'border-brand-600 bg-brand-600' : 'border-muted bg-white dark:bg-night'}`}
      >
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </View>
      <Text className="flex-1 text-sm text-ink dark:text-white">{label}</Text>
      <Text className="text-sm text-muted dark:text-brand-200">{count}</Text>
    </Pressable>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="border-t border-line px-4 py-3 dark:border-night-line">
      <Text className="mb-1 text-base font-bold text-ink dark:text-white">{title}</Text>
      {children}
    </View>
  );
}

/** Booking-style filters: each option shows how many results it would leave. */
export function FilterPanel({ all, filters, onChange }: Props) {
  const { t } = useTranslation();
  const toggle = (key: 'verified' | 'tour360' | 'score9') => onChange({ ...filters, [key]: !filters[key] });

  return (
    <View className="rounded-xl border border-line bg-white dark:border-night-line dark:bg-night-card">
      <Text className="px-4 py-3 text-base font-bold text-ink dark:text-white">{t('results.filterBy')}</Text>
      <Group title={t('results.popular')}>
        {(['verified', 'tour360', 'score9'] as const).map((key) => (
          <Row
            key={key}
            label={t(`results.${key}`)}
            checked={!!filters[key]}
            count={countWith(all, filters, { [key]: true })}
            onPress={() => toggle(key)}
          />
        ))}
      </Group>
      <Group title={t('results.zone')}>
        {ZONES.map((z) => (
          <Row
            key={z}
            label={z}
            checked={filters.zone === z}
            count={countWith(all, filters, { zone: z })}
            onPress={() => onChange({ ...filters, zone: filters.zone === z ? undefined : z })}
          />
        ))}
      </Group>
      <Group title={t('results.type')}>
        {PROPERTY_TYPES.map((p) => (
          <Row
            key={p}
            label={t(`types.${p}`)}
            checked={filters.type === p}
            count={countWith(all, filters, { type: p })}
            onPress={() => onChange({ ...filters, type: filters.type === p ? undefined : p })}
          />
        ))}
      </Group>
    </View>
  );
}
