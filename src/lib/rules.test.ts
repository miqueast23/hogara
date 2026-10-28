import { describe, expect, test } from 'vitest';

import { SEED_PROPERTIES } from '@/data/seed';
import { averageScore, scarcityUnits, scoreWord, usdToBs } from './rules';
import { applyFilters, countWith, filtersFromParams, filtersToParams, sortProperties } from './search';

describe('rule 10 · score word', () => {
  test.each([
    [9.5, 'exceptional'],
    [9.49, 'fantastic'],
    [9, 'fantastic'],
    [8.5, 'veryGood'],
    [8, 'good'],
    [7.9, 'fair'],
  ] as const)('%s → %s', (score, word) => expect(scoreWord(score)).toBe(word));
});

describe('rule 9 · average', () => {
  test('one decimal', () => expect(averageScore([9, 8, 8])).toBe(8.3));
  test('no reviews → null', () => expect(averageScore([])).toBeNull());
});

describe('rule 11 · scarcity only with real stock ≤3', () => {
  test('null for single listings', () => expect(scarcityUnits(null)).toBeNull());
  test('null when sold out', () => expect(scarcityUnits(0)).toBeNull());
  test('shows 3', () => expect(scarcityUnits(3)).toBe(3));
  test('hidden at 4', () => expect(scarcityUnits(4)).toBeNull());
});

describe('rule 16 · USD to Bs', () => {
  test('rounded', () => expect(usdToBs(1200.5, 36.6)).toBe(43938));
});

describe('search', () => {
  const sale = { operation: 'sale' as const };

  test('filters by operation and verified', () => {
    const r = applyFilters(SEED_PROPERTIES, { ...sale, verified: true });
    expect(r.every((p) => p.operation === 'sale' && p.verified)).toBe(true);
  });

  test('live count equals applied result size', () => {
    expect(countWith(SEED_PROPERTIES, sale, { tour360: true })).toBe(
      applyFilters(SEED_PROPERTIES, { ...sale, tour360: true }).length,
    );
  });

  test('URL params round-trip and reject junk', () => {
    const f = { operation: 'rent' as const, zone: 'Chacao', bedroomsMin: 2, verified: true };
    expect(filtersFromParams(filtersToParams(f))).toEqual({ ...f, type: undefined, priceMax: undefined, tour360: undefined, score9: undefined });
    expect(filtersFromParams({ operation: 'x', type: 'castle', priceMax: '-5' })).toMatchObject({ operation: 'sale', type: undefined, priceMax: undefined });
  });

  test('price ascending does not mutate input', () => {
    const copy = [...SEED_PROPERTIES];
    const r = sortProperties(SEED_PROPERTIES, 'priceAsc');
    expect(SEED_PROPERTIES).toEqual(copy);
    for (let i = 1; i < r.length; i++) expect(r[i].price_usd).toBeGreaterThanOrEqual(r[i - 1].price_usd);
  });
});
