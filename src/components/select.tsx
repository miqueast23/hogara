import { Check, ChevronDown } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useIconColors } from '@/lib/ui';

export type Option<T> = { value: T; label: string };

type Props<T> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  icon?: ReactNode;
  className?: string;
};

/** Field button that opens a bottom sheet / centered list. Works the same on web and native. */
export function Select<T>({ label, value, options, onChange, icon, className = '' }: Props<T>) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const colors = useIconColors();
  const current = options.find((o) => o.value === value)?.label ?? '';

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current}`}
        onPress={() => setOpen(true)}
        className={`min-h-14 flex-row items-center gap-3 rounded-lg bg-white px-3 dark:bg-night-card ${className}`}
      >
        {icon}
        <View className="flex-1">
          <Text className="text-xs text-muted dark:text-brand-200">{label}</Text>
          <Text numberOfLines={1} className="text-base font-semibold text-ink dark:text-white">
            {current}
          </Text>
        </View>
        <ChevronDown size={18} color={colors.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          accessibilityLabel={t('search.close')}
          onPress={() => setOpen(false)}
          className="flex-1 items-center justify-end bg-black/40 md:justify-center"
        >
          <Pressable className="max-h-[70%] w-full rounded-t-2xl bg-white pb-6 md:w-96 md:rounded-2xl md:pb-2 dark:bg-night-card">
            <Text className="px-5 pb-2 pt-5 text-lg font-bold text-ink dark:text-white">{label}</Text>
            <ScrollView>
              {options.map((o) => {
                const selected = o.value === value;
                return (
                  <Pressable
                    key={String(o.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className="min-h-12 flex-row items-center justify-between px-5 hover:bg-brand-50 dark:hover:bg-night"
                  >
                    <Text
                      className={`text-base ${selected ? 'font-bold text-brand-600 dark:text-brand-200' : 'text-ink dark:text-white'}`}
                    >
                      {o.label}
                    </Text>
                    {selected && <Check size={18} color={colors.brand} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
