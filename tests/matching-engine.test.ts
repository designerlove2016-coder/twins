import {
  calculatePairwiseSimilarity,
  calculateJaccardSimilarity,
} from '../src/services/matchingService';

export function runMatchingEngineTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${testName}`);
    } else {
      failed++;
      errors.push(testName);
      console.error(`  ✗ ${testName}`);
    }
  }

  console.log('\n--- Running Matching Engine & Algorithm Tests ---');

  // Test 1: Jaccard similarity identical sets
  const jaccardIdentical = calculateJaccardSimilarity(
    ['sport_football', 'sport_padel'],
    ['sport_football', 'sport_padel']
  );
  assert(jaccardIdentical === 1.0, 'Jaccard similarity of identical sport sets must equal 1.0 (100%)');

  // Test 2: Jaccard similarity disjoint sets
  const jaccardDisjoint = calculateJaccardSimilarity(
    ['sport_football', 'sport_padel'],
    ['sport_gaming', 'sport_running']
  );
  assert(jaccardDisjoint === 0.0, 'Jaccard similarity of completely disjoint sport sets must equal 0.0 (0%)');

  // Test 3: Jaccard similarity partial overlap
  // A: [football, padel] (2), B: [padel, gaming] (2). Intersection = 1 (padel), Union = 3 (football, padel, gaming). J = 1/3 = 0.3333...
  const jaccardPartial = calculateJaccardSimilarity(
    ['sport_football', 'sport_padel'],
    ['sport_padel', 'sport_gaming']
  );
  assert(Math.abs(jaccardPartial - 0.3333) < 0.01, 'Jaccard partial overlap: 1 shared out of 3 total must equal 0.33');

  // Test 4: Both users selecting "I do not regularly play sports"
  const jaccardBothNone = calculateJaccardSimilarity(['sport_none'], ['sport_none']);
  assert(jaccardBothNone === 1.0, 'Users who both explicitly do not play sports must match on this trait');

  // Test 5: Identical answers across all categories
  const completeAnswersA = {
    q_vibe: 'vibe_ambitious',
    q_coffee: 'coffee_v60',
    q_food: 'food_burger',
    q_drinks: 'drink_mojito',
    q_sports: ['sport_football', 'sport_padel'],
    q_leisure: 'leisure_cafe',
    q_cars: 'car_luxury_sedan',
    q_places: 'place_cozycafe',
    q_lifestyle: 'lifestyle_nightowl',
  };

  const identicalCalc = calculatePairwiseSimilarity(completeAnswersA, completeAnswersA);
  assert(identicalCalc.similarityScore === 100, 'Identical answers must yield a 100% similarity score');
  assert(identicalCalc.coverageScore === 100, 'All dimensions answered must yield 100% coverage');
  assert(identicalCalc.isSufficientCoverage === true, '100% coverage must satisfy sufficiency threshold');

  // Test 6: Completely different answers across all categories
  const differentAnswersB = {
    q_vibe: 'vibe_chill',
    q_coffee: 'coffee_arabic',
    q_food: 'food_japanese',
    q_drinks: 'drink_matcha',
    q_sports: ['sport_gaming', 'sport_running'],
    q_leisure: 'leisure_kashta',
    q_cars: 'car_rugged_4x4',
    q_places: 'place_nature',
    q_lifestyle: 'lifestyle_earlybird',
  };

  const disjointCalc = calculatePairwiseSimilarity(completeAnswersA, differentAnswersB);
  assert(disjointCalc.similarityScore === 0, 'Completely divergent answers must yield a 0% similarity score');
  assert(disjointCalc.coverageScore === 100, 'Full answers on both sides must yield 100% coverage');

  // Test 7: Missing data handling (one user answered 3 questions, other answered 9)
  const sparseAnswersC = {
    q_coffee: 'coffee_v60',
    q_food: 'food_burger',
    q_sports: ['sport_football', 'sport_padel'],
  };

  const sparseCalc = calculatePairwiseSimilarity(sparseAnswersC, completeAnswersA);
  // Coffee (0.10) + Food (0.10) + Sports (0.15) = 0.35 weight observed
  assert(sparseCalc.coverageScore < 40, 'Sparse answers should result in coverage below 40%');
  assert(sparseCalc.isSufficientCoverage === false, 'Below 40% coverage must be flagged as insufficient coverage');
  assert(sparseCalc.similarityScore === 100, 'Normalized observed overlap should correctly equal 100% for the observed categories');

  // Test 8: Partial overlap with stable score
  const partialAnswersD = {
    q_vibe: 'vibe_ambitious', // match (0.10)
    q_coffee: 'coffee_v60', // match (0.10)
    q_food: 'food_traditional', // diff (0.10)
    q_drinks: 'drink_mojito', // match (0.05)
    q_sports: ['sport_football', 'sport_padel'], // match (0.15)
    q_leisure: 'leisure_cafe', // match (0.10)
    q_cars: 'car_rugged_4x4', // diff (0.10)
    q_places: 'place_cozycafe', // match (0.10)
    q_lifestyle: 'lifestyle_nightowl', // match (0.10)
  };

  const partialCalc = calculatePairwiseSimilarity(completeAnswersA, partialAnswersD);
  assert(partialCalc.similarityScore > 75 && partialCalc.similarityScore < 85, 'Partial overlap should deterministically yield ~80% similarity');
  assert(partialCalc.meaningfulDifferences.length > 0, 'Meaningful differences must be explicitly captured');

  return { passed, failed, errors };
}
