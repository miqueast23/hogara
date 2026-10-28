import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { WRAP } from '@/lib/ui';

export function Footer() {
  const { t } = useTranslation();
  return (
    <View className="mt-12 border-t border-line bg-brand-50 py-8 dark:border-night-line dark:bg-night-card">
      <View className={WRAP}>
        <Text className="text-lg font-extrabold text-brand-700 dark:text-brand-200">hogara</Text>
        <Text className="mt-2 text-xs leading-5 text-muted dark:text-brand-200">{t('footer.rights')}</Text>
      </View>
    </View>
  );
}
