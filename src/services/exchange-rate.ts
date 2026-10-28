export interface ExchangeRateProvider {
  /** Bs per 1 USD. */
  getUsdToBs(): Promise<number>;
}

// ponytail: fixed rate mock; real provider (BCV feed) arrives in phase 6 behind EXPO_PUBLIC_EXCHANGE_PROVIDER.
const MOCK_RATE = Number(process.env.EXPO_PUBLIC_MOCK_USD_BS ?? 220);

export const exchangeRateProvider: ExchangeRateProvider = {
  getUsdToBs: async () => MOCK_RATE,
};
