import { PROPERTY_TYPES, type Operation, type Property, type PropertyType } from '@/types';

export type Filters = {
  operation: Operation;
  zone?: string;
  type?: PropertyType;
  bedroomsMin?: number;
  priceMax?: number;
  verified?: boolean;
  tour360?: boolean;
  score9?: boolean;
};

export type SortKey = 'recommended' | 'priceAsc' | 'priceDesc' | 'score' | 'trust';
export const SORT_KEYS: SortKey[] = ['recommended', 'priceAsc', 'priceDesc', 'score', 'trust'];

export function applyFilters(list: Property[], f: Filters): Property[] {
  return list.filter(
    (p) =>
      p.operation === f.operation &&
      (!f.zone || p.zone === f.zone) &&
      (!f.type || p.type === f.type) &&
      (f.bedroomsMin == null || p.bedrooms >= f.bedroomsMin) &&
      (f.priceMax == null || p.price_usd <= f.priceMax) &&
      (!f.verified || p.verified) &&
      (!f.tour360 || p.has_tour360) &&
      (!f.score9 || (p.rating ?? 0) >= 9),
  );
}

/** Live count for a filter option: how many results there would be if it were applied. */
export function countWith(list: Property[], f: Filters, patch: Partial<Filters>): number {
  return applyFilters(list, { ...f, ...patch }).length;
}

const recommended = (p: Property) => (p.rating ?? 0) * p.trust_score;

const COMPARATORS: Record<SortKey, (a: Property, b: Property) => number> = {
  recommended: (a, b) => recommended(b) - recommended(a),
  priceAsc: (a, b) => a.price_usd - b.price_usd,
  priceDesc: (a, b) => b.price_usd - a.price_usd,
  score: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  trust: (a, b) => b.trust_score - a.trust_score,
};

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const num = (v: string | undefined) => (v && Number(v) > 0 ? Number(v) : undefined);

/** Filters ↔ URL query, so results are shareable links. */
export function filtersFromParams(p: Params): Filters {
  const type = one(p.type);
  return {
    operation: one(p.operation) === 'rent' ? 'rent' : 'sale',
    zone: one(p.zone) || undefined,
    type: PROPERTY_TYPES.includes(type as PropertyType) ? (type as PropertyType) : undefined,
    bedroomsMin: num(one(p.bedroomsMin)),
    priceMax: num(one(p.priceMax)),
    verified: one(p.verified) === '1' || undefined,
    tour360: one(p.tour360) === '1' || undefined,
    score9: one(p.score9) === '1' || undefined,
  };
}

export function filtersToParams(f: Filters): Record<string, string> {
  const out: Record<string, string> = { operation: f.operation };
  for (const [k, v] of Object.entries(f)) {
    if (k === 'operation' || v == null || v === false) continue;
    out[k] = v === true ? '1' : String(v);
  }
  return out;
}

export function sortProperties(list: Property[], key: SortKey): Property[] {
  return [...list].sort(COMPARATORS[key]);
}
