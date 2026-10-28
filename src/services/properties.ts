import { useQuery } from '@tanstack/react-query';

import { SEED_PROPERTIES } from '@/data/seed';
import type { Property } from '@/types';

// ponytail: mock reads the seed in memory; swaps to a Supabase query (status = 'published') once the project is connected.
async function listPublished(): Promise<Property[]> {
  return SEED_PROPERTIES;
}

export function usePublishedProperties() {
  return useQuery({ queryKey: ['properties', 'published'], queryFn: listPublished });
}
