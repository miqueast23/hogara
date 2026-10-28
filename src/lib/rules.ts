export type ScoreWord = 'exceptional' | 'fantastic' | 'veryGood' | 'good' | 'fair';

/** Rule 10. */
export function scoreWord(score: number): ScoreWord {
  if (score >= 9.5) return 'exceptional';
  if (score >= 9) return 'fantastic';
  if (score >= 8.5) return 'veryGood';
  if (score >= 8) return 'good';
  return 'fair';
}

/** Rule 9: average with one decimal; null when there are no reviews. */
export function averageScore(scores: number[]): number | null {
  if (scores.length === 0) return null;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

/** Rule 11: only real stock of 1-3 units triggers the notice. Never fake urgency. */
export function scarcityUnits(units: number | null | undefined): number | null {
  if (units == null || !Number.isInteger(units)) return null;
  return units >= 1 && units <= 3 ? units : null;
}

/** Rule 16: prices live in USD; Bs is a rounded conversion. */
export function usdToBs(usd: number, rate: number): number {
  return Math.round(usd * rate);
}
