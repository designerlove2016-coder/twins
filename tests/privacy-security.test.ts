import { validateUsername } from '../src/services/authService';
import { getTopTwinMatches } from '../src/services/matchingService';
import { UserProfile } from '../src/types';

export async function runPrivacyAndSecurityTests(): Promise<{ passed: number; failed: number; errors: string[] }> {
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

  console.log('\n--- Running Privacy, Security & Business Logic Tests ---');

  // Test 1: Username format validation
  assert(validateUsername('rayan_99').isValid, 'Valid username "rayan_99" must pass validation');
  assert(!validateUsername('ab').isValid, 'Username with 2 characters must be rejected (min 3 required)');
  assert(!validateUsername('this_username_is_way_too_long_to_be_allowed').isValid, 'Username > 20 characters must be rejected');
  assert(!validateUsername('rayan@riyadh!').isValid, 'Special characters outside underscores must be rejected');
  assert(!validateUsername('Rayan Riyadh').isValid, 'Spaces must be rejected');

  // Test 2: Phone privacy verification in public match objects
  const mockUser: UserProfile = {
    id: 'user_tester',
    username: 'test_twin',
    city: 'Riyadh',
    avatar: {
      id: 'av_1',
      baseGender: 'neutral',
      skinTone: '#E0AC69',
      hairStyle: 'traditional',
      hairColor: '#1A1816',
      clothingStyle: 'thobe',
      clothingColor: '#0B5D3B',
      accessory: 'none',
      expression: 'smile',
    },
    answers: {
      q_vibe: 'vibe_ambitious',
      q_coffee: 'coffee_v60',
      q_food: 'food_burger',
      q_sports: ['sport_football', 'sport_padel'],
    },
    isCompleted: true,
    privacy: {
      showCityPublicly: true,
      showGenderPublicly: false,
      showAgeRangePublicly: true,
      allowDiscoverability: true,
    },
  };

  const matches = await getTopTwinMatches(mockUser, 5);

  // Check invariant: no match object should ever expose phone number or OTP
  let leakedPhone = false;
  for (const m of matches) {
    const rawKeys = Object.keys(m);
    if (rawKeys.includes('phone') || rawKeys.includes('phoneNumber') || rawKeys.includes('otp')) {
      leakedPhone = true;
    }
  }
  assert(!leakedPhone, 'Public match records MUST NOT contain phone numbers, credentials, or OTP tokens');

  // Test 3: Top 5 count limit and self-exclusion
  assert(matches.length <= 5, 'Matches query must never exceed the requested limit of 5');
  assert(!matches.some((m) => m.id === mockUser.id), 'Current user must never match with themselves');

  // Test 4: Stable sorting order
  let isSorted = true;
  for (let i = 0; i < matches.length - 1; i++) {
    if (matches[i].similarityScore < matches[i + 1].similarityScore) {
      isSorted = false;
    }
  }
  assert(isSorted, 'Top matches must be stably sorted by similarity score in descending order');

  return { passed, failed, errors };
}
