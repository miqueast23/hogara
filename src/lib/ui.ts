import { useColorScheme } from 'react-native';

/** Centered page column, Booking-style max width. */
export const WRAP = 'w-full max-w-6xl self-center px-4';

/** Lucide icons take a color prop, not a class: pick it per scheme. */
export function useIconColors() {
  const dark = useColorScheme() === 'dark';
  return {
    brand: dark ? '#a9d5e0' : '#0f5c6e',
    muted: dark ? '#9fb0b6' : '#5a6b72',
    success: dark ? '#5fd3a8' : '#11795a',
  };
}
