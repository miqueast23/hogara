export type Operation = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'townhouse' | 'studio' | 'commercial';

export const PROPERTY_TYPES: PropertyType[] = ['apartment', 'house', 'townhouse', 'studio', 'commercial'];

export type Property = {
  id: string;
  title: string;
  operation: Operation;
  type: PropertyType;
  zone: string;
  city: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  price_usd: number;
  description: string;
  verified: boolean;
  has_tour360: boolean;
  /** null = single listing; a number only for developments with real unit stock. */
  units_available: number | null;
  trust_score: number;
  photos: string[];
  /** Derived from completed-transaction reviews (rule 9); null when there are none. */
  rating: number | null;
  reviews_count: number;
};
