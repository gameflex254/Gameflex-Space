import test from 'node:test';
import assert from 'node:assert/strict';

import { recommendationService } from './RecommendationService.ts';

test('recommendation service returns an empty result when Supabase is not configured', async () => {
  const previousUrl = process.env.SUPABASE_URL;
  const previousServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const previousAnonKey = process.env.SUPABASE_ANON_KEY;

  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  try {
    const response = await recommendationService.recommend({
      feedType: 'home',
      limit: 5,
    });

    assert.deepEqual(response, { items: [] });
  } finally {
    if (previousUrl !== undefined) process.env.SUPABASE_URL = previousUrl;
    if (previousServiceKey !== undefined) process.env.SUPABASE_SERVICE_KEY = previousServiceKey;
    if (previousAnonKey !== undefined) process.env.SUPABASE_ANON_KEY = previousAnonKey;
  }
});
