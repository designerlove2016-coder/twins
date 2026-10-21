import { MatchProfile, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_MATCHES } from '../data/mockMatches';

export interface CategoryScoreResult {
  weight: number;
  similarity: number; // 0.0 to 1.0
  observed: boolean;
  shared?: string;
  diff?: string;
  reasonKey?: string;
}

export interface DetailedMatchCalculation {
  similarityScore: number; // 0 - 100
  coverageScore: number; // 0 - 100
  isSufficientCoverage: boolean;
  sharedInterests: string[];
  meaningfulDifferences: string[];
  reasonKeys: string[];
  categoryBreakdown: Record<string, CategoryScoreResult>;
}

// 9 Core Dimensions summing to 1.00 (100%)
export const CATEGORY_WEIGHTS = {
  sports: 0.15,
  lifestyle_leisure: 0.15,
  lifestyle_place: 0.15,
  lifestyle_rhythm: 0.10,
  lifestyle_vibe: 0.10,
  food: 0.10,
  drinks: 0.05,
  coffee: 0.10,
  cars: 0.10,
};

const MIN_COVERAGE_THRESHOLD = 40.0; // Minimum 40% observed data to constitute a valid Twin match

/**
 * Calculates Jaccard similarity between two arrays of items:
 * J(A, B) = |A ∩ B| / |A ∪ B|
 * Returns 0 if either array is empty.
 */
export function calculateJaccardSimilarity(a: string[] | undefined, b: string[] | undefined): number {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;

  // Filter out negative selection like 'sport_none'
  const setA = new Set(a.filter((item) => item !== 'sport_none'));
  const setB = new Set(b.filter((item) => item !== 'sport_none'));

  if (setA.size === 0 && setB.size === 0) {
    // Both explicitly do not participate in regular sports
    return a.includes('sport_none') && b.includes('sport_none') ? 1.0 : 0;
  }

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) intersectionCount++;
  }

  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount > 0 ? intersectionCount / unionCount : 0;
}

/**
 * Deterministic matching calculation between two user profiles.
 * Pure mathematical function: Reproducible, explainable, and zero AI-hallucinated scoring.
 */
export function calculatePairwiseSimilarity(
  userAAnswers: Record<string, string | string[]>,
  userBAnswers: Record<string, string | string[]>
): DetailedMatchCalculation {
  const breakdown: Record<string, CategoryScoreResult> = {};
  let totalObservedWeight = 0;
  let accumulatedWeightedSim = 0;

  const sharedInterests: string[] = [];
  const meaningfulDifferences: string[] = [];
  const reasonKeys: string[] = [];

  // 1. Sports & Gaming (Multi-select Jaccard)
  const sportsA = userAAnswers.q_sports;
  const sportsB = userBAnswers.q_sports;
  const sportsArrayA = Array.isArray(sportsA) ? sportsA : sportsA ? [sportsA] : [];
  const sportsArrayB = Array.isArray(sportsB) ? sportsB : sportsB ? [sportsB] : [];

  if (sportsArrayA.length > 0 && sportsArrayB.length > 0) {
    const sim = calculateJaccardSimilarity(sportsArrayA, sportsArrayB);
    const weight = CATEGORY_WEIGHTS.sports;
    breakdown.sports = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    const commonSports = sportsArrayA.filter((s) => sportsArrayB.includes(s) && s !== 'sport_none');
    if (commonSports.length > 0) {
      sharedInterests.push('Sports & Gaming');
      reasonKeys.push('shared_sports_passion');
    } else {
      meaningfulDifferences.push('Sports Activities');
    }
  } else {
    breakdown.sports = { weight: CATEGORY_WEIGHTS.sports, similarity: 0, observed: false };
  }

  // 2. Coffee Ritual
  const coffeeA = userAAnswers.q_coffee as string | undefined;
  const coffeeB = userBAnswers.q_coffee as string | undefined;
  if (coffeeA && coffeeB) {
    const sim = coffeeA === coffeeB ? 1.0 : 0.0;
    const weight = CATEGORY_WEIGHTS.coffee;
    breakdown.coffee = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    if (sim === 1.0) {
      sharedInterests.push('Coffee Ritual');
      reasonKeys.push('identical_coffee_ritual');
    } else {
      meaningfulDifferences.push('Coffee Style');
    }
  } else {
    breakdown.coffee = { weight: CATEGORY_WEIGHTS.coffee, similarity: 0, observed: false };
  }

  // 3. Food & Comfort
  const foodA = userAAnswers.q_food as string | undefined;
  const foodB = userBAnswers.q_food as string | undefined;
  if (foodA && foodB) {
    const sim = foodA === foodB ? 1.0 : 0.0;
    const weight = CATEGORY_WEIGHTS.food;
    breakdown.food = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    if (sim === 1.0) {
      sharedInterests.push('Comfort Food');
      reasonKeys.push('shared_comfort_food');
    } else {
      meaningfulDifferences.push('Food Cravings');
    }
  } else {
    breakdown.food = { weight: CATEGORY_WEIGHTS.food, similarity: 0, observed: false };
  }

  // 4. Drinks & Juice
  const drinkA = userAAnswers.q_drinks as string | undefined;
  const drinkB = userBAnswers.q_drinks as string | undefined;
  if (drinkA && drinkB) {
    const sim = drinkA === drinkB ? 1.0 : 0.0;
    const weight = CATEGORY_WEIGHTS.drinks;
    breakdown.drinks = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    if (sim === 1.0) {
      sharedInterests.push('Refreshing Drinks');
    } else {
      meaningfulDifferences.push('Drink Preferences');
    }
  } else {
    breakdown.drinks = { weight: CATEGORY_WEIGHTS.drinks, similarity: 0, observed: false };
  }

  // 5. Daily Vibe
  const vibeA = userAAnswers.q_vibe as string | undefined;
  const vibeB = userBAnswers.q_vibe as string | undefined;
  if (vibeA && vibeB) {
    const sim = vibeA === vibeB ? 1.0 : 0.0;
    const weight = CATEGORY_WEIGHTS.lifestyle_vibe;
    breakdown.vibe = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    if (sim === 1.0) {
      sharedInterests.push('Daily Vibe');
      reasonKeys.push('aligned_energy_vibe');
    } else {
      meaningfulDifferences.push('Energy & Vibe');
    }
  } else {
    breakdown.vibe = { weight: CATEGORY_WEIGHTS.lifestyle_vibe, similarity: 0, observed: false };
  }

  // 6. Weekend Leisure
  const leisureA = userAAnswers.q_leisure as string | undefined;
  const leisureB = userBAnswers.q_leisure as string | undefined;
  if (leisureA && leisureB) {
    const sim = leisureA === leisureB ? 1.0 : 0.0;
    const weight = CATEGORY_WEIGHTS.lifestyle_leisure;
    breakdown.leisure = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    if (sim === 1.0) {
      sharedInterests.push('Weekend Leisure');
      reasonKeys.push('matching_weekend_plans');
    } else {
      meaningfulDifferences.push('Weekend Leisure');
    }
  } else {
    breakdown.leisure = { weight: CATEGORY_WEIGHTS.lifestyle_leisure, similarity: 0, observed: false };
  }

  // 7. Ideal Places
  const placeA = userAAnswers.q_places as string | undefined;
  const placeB = userBAnswers.q_places as string | undefined;
  if (placeA && placeB) {
    const sim = placeA === placeB ? 1.0 : 0.0;
    const weight = CATEGORY_WEIGHTS.lifestyle_place;
    breakdown.place = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    if (sim === 1.0) {
      sharedInterests.push('Ideal Environment');
    } else {
      meaningfulDifferences.push('Preferred Environment');
    }
  } else {
    breakdown.place = { weight: CATEGORY_WEIGHTS.lifestyle_place, similarity: 0, observed: false };
  }

  // 8. Daily Rhythm & Pace
  const rhythmA = userAAnswers.q_lifestyle as string | undefined;
  const rhythmB = userBAnswers.q_lifestyle as string | undefined;
  if (rhythmA && rhythmB) {
    const sim = rhythmA === rhythmB ? 1.0 : 0.0;
    const weight = CATEGORY_WEIGHTS.lifestyle_rhythm;
    breakdown.rhythm = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    if (sim === 1.0) {
      sharedInterests.push('Daily Pace & Rhythm');
      reasonKeys.push('synchronized_daily_rhythm');
    } else {
      meaningfulDifferences.push('Daily Schedule');
    }
  } else {
    breakdown.rhythm = { weight: CATEGORY_WEIGHTS.lifestyle_rhythm, similarity: 0, observed: false };
  }

  // 9. Cars & Driving Philosophy
  const carA = userAAnswers.q_cars as string | undefined;
  const carB = userBAnswers.q_cars as string | undefined;
  if (carA && carB) {
    const sim = carA === carB ? 1.0 : 0.0;
    const weight = CATEGORY_WEIGHTS.cars;
    breakdown.cars = { weight, similarity: sim, observed: true };
    totalObservedWeight += weight;
    accumulatedWeightedSim += sim * weight;

    if (sim === 1.0) {
      sharedInterests.push('Driving Philosophy');
      reasonKeys.push('matching_driving_style');
    } else {
      meaningfulDifferences.push('Vehicle Style');
    }
  } else {
    breakdown.cars = { weight: CATEGORY_WEIGHTS.cars, similarity: 0, observed: false };
  }

  // Calculate normalized percentage and coverage
  const theoreticalTotalWeight = Object.values(CATEGORY_WEIGHTS).reduce((acc, w) => acc + w, 0);
  const coverageScore = Math.round((totalObservedWeight / theoreticalTotalWeight) * 100);
  const isSufficientCoverage = coverageScore >= MIN_COVERAGE_THRESHOLD;

  let similarityScore = 0;
  if (totalObservedWeight > 0) {
    similarityScore = Math.round((accumulatedWeightedSim / totalObservedWeight) * 100);
  }

  return {
    similarityScore,
    coverageScore,
    isSufficientCoverage,
    sharedInterests,
    meaningfulDifferences,
    reasonKeys,
    categoryBreakdown: breakdown,
  };
}

/**
 * Retrieves the Top 5 matches for the current user using either the Supabase RPC
 * or the client-side deterministic matching engine with stable tie-breaking.
 */
export async function getTopTwinMatches(
  currentUser: UserProfile,
  limit: number = 5
): Promise<MatchProfile[]> {
  // If Supabase is configured, call the database RPC
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.rpc('get_top_twin_matches', {
        p_user_id: currentUser.id,
        p_limit: limit,
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: row.matched_user_id,
          username: row.username,
          city: row.city_name_en || 'Global',
          gender: row.gender,
          ageRange: row.age_range,
          similarityScore: Number(row.similarity_score),
          avatar: row.avatar,
          answers: {},
          sharedInterests: row.shared_interests || [],
          bio: row.bio || '',
          verifiedPersonality: true,
        }));
      }
    } catch (e) {
      console.warn('Supabase RPC get_top_twin_matches failed, falling back to local engine:', e);
    }
  }

  // Deterministic local matching over active candidate pool
  const candidates = MOCK_MATCHES.filter(
    (m) => m.id !== currentUser.id
  );

  const scoredCandidates = candidates
    .map((candidate) => {
      const calc = calculatePairwiseSimilarity(currentUser.answers, candidate.answers);
      return {
        ...candidate,
        similarityScore: calc.similarityScore,
        coverageScore: calc.coverageScore,
        isSufficientCoverage: calc.isSufficientCoverage,
        sharedInterests: calc.sharedInterests.length > 0 ? calc.sharedInterests : candidate.sharedInterests,
      };
    })
    .filter((c) => c.isSufficientCoverage)
    // Deterministic Stable Tie-Breaking:
    // 1. similarityScore DESC
    // 2. coverageScore DESC
    // 3. username ASC
    .sort((a, b) => {
      if (b.similarityScore !== a.similarityScore) {
        return b.similarityScore - a.similarityScore;
      }
      if (b.coverageScore !== a.coverageScore) {
        return b.coverageScore - a.coverageScore;
      }
      return a.username.localeCompare(b.username);
    });

  return scoredCandidates.slice(0, limit);
}
