import { Link } from 'expo-router';
import { House } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { WRAP } from '@/lib/ui';
import { usePrefs } from '@/store/prefs';

function HeaderButton({ label, onPress, a11y }: { label: string; onPress: () => void; a11y: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      onPress={onPress}
      className="min-h-11 min-w-11 items-center justify-center rounded-md px-2 hover:bg-white/10 active:bg-white/20"
    >
      <Text className="text-sm font-semibold text-white">{label}</Text>
    </Pressable>
  );
}

export function Header({ children }: { children?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { currency, language, setCurrency, setLanguage } = usePrefs();

  return (
    <View className="bg-brand-600 dark:bg-brand-800" style={{ paddingTop: insets.top }}>
      <View className={`${WRAP} flex-row items-center justify-between py-3`}>
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Hogara" className="min-h-11 flex-row items-center gap-2">
            <House size={26} color="#f2a93b" strokeWidth={2.5} />
            <Text className="text-2xl font-extrabold tracking-tight text-white">hogara</Text>
          </Pressable>
        </Link>
        <View className="flex-row items-center gap-1">
          <HeaderButton
            label={currency === 'USD' ? 'US$' : 'Bs'}
            a11y={t('header.currency')}
            onPress={() => setCurrency(currency === 'USD' ? 'VES' : 'USD')}
          />
          <HeaderButton
            label={language.toUpperCase()}
            a11y={t('header.language')}
            onPress={() => setLanguage(language === 'es' ? 'en' : 'es')}
          />
        </View>
      </View>
      {children}
    </View>
  );
}
