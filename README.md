# Hogara 🏠

**Real estate app for Venezuela (starting with Caracas) to buy, rent and sell property with confidence.**

Hogara borrows the search patterns people already know from big booking platforms, but with its own identity and four things the local market is missing:

1. **Verified users and listings.** Users go through identity checks (KYC), and property documents are reviewed by a moderator.
2. **Escrow.** Booking and deposit money is held until each step of the deal is met.
3. **Guided legal help.** An AI legal assistant explains the process and a licensed lawyer validates it.
4. **AI tools for agents.** Automated social media publishing and a CRM with built-in prompts.

> 🚧 Work in progress. Phase 1 (buyer search experience) is partly done. See [PROGRESS.md](PROGRESS.md).

## Features so far
- Home with Buy / Rent / Sell tabs, search by area, type, bedrooms and budget
- Results page with live-count filters (verified, 360° tour, rating, area, type), 5 sort options and shareable filter URLs
- Property detail with gallery, rating, price box and escrow and guarantee info
- Spanish / English (i18n) and USD / Bs currency toggle
- Light and dark mode
- Business rules covered by unit tests (Vitest)

## Tech stack
| Layer | Tools |
|---|---|
| App | Expo (React Native) · Expo Router · TypeScript (strict) · web support |
| UI | NativeWind (Tailwind) · light/dark mode |
| Data | TanStack Query · Zustand |
| Backend | Supabase (Auth, Postgres, Storage, Realtime, Edge Functions) |
| AI | Anthropic Claude, called only from Edge Functions |
| i18n | i18next (es / en) |
| Deploy | Vercel (Expo web export) |

Every external integration (KYC, escrow, maps, exchange rate, AI, messaging) sits behind an interface in `src/services/` with a **mock implementation by default**. Real providers are switched on with environment variables, so no keys live in the code.

## Run it locally
```bash
npm install
cp .env.example .env   # optional: mock services work without keys
npx expo start         # press w for web, a for Android, i for iOS
```

Run the tests:
```bash
npm test
```

## Roles
- **Buyer / tenant**: mobile
- **Agent** and **admin**: web and mobile

## License
MIT. Built by [Miqueas Timothy](https://github.com/miqueast23).
