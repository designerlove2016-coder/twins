import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, PrivacySettings } from '../types';

/**
 * Fetches the complete profile and preferences for a user from PostgreSQL / Supabase.
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*, cities(name_en, name_ar)')
      .eq('id', userId)
      .single();

    if (profileError || !profileData) {
      return null;
    }

    // Fetch preferences concurrently
    const [
      sportsRes,
      coffeeRes,
      foodRes,
      lifestyleRes,
      vehicleRes,
      privacyRes,
    ] = await Promise.all([
      supabase.from('sports_preferences').select('sport_id').eq('user_id', userId),
      supabase.from('coffee_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('food_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('lifestyle_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('vehicle_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('privacy_settings').select('*').eq('user_id', userId).single(),
    ]);

    const answers: Record<string, string | string[]> = {};

    if (sportsRes.data && sportsRes.data.length > 0) {
      answers.q_sports = sportsRes.data.map((r: any) => r.sport_id);
    }
    if (coffeeRes.data?.coffee_style) {
      answers.q_coffee = coffeeRes.data.coffee_style;
    }
    if (foodRes.data?.comfort_food) {
      answers.q_food = foodRes.data.comfort_food;
    }
    if (foodRes.data?.favorite_drink) {
      answers.q_drinks = foodRes.data.favorite_drink;
    }
    if (lifestyleRes.data) {
      if (lifestyleRes.data.dominant_vibe) answers.q_vibe = lifestyleRes.data.dominant_vibe;
      if (lifestyleRes.data.weekend_leisure) answers.q_leisure = lifestyleRes.data.weekend_leisure;
      if (lifestyleRes.data.ideal_place) answers.q_places = lifestyleRes.data.ideal_place;
      if (lifestyleRes.data.daily_rhythm) answers.q_lifestyle = lifestyleRes.data.daily_rhythm;
    }
    if (vehicleRes.data?.driving_philosophy) {
      answers.q_cars = vehicleRes.data.driving_philosophy;
    }

    const privacy: PrivacySettings = {
      showCityPublicly: privacyRes.data?.show_city_publicly ?? true,
      showGenderPublicly: privacyRes.data?.show_gender_publicly ?? false,
      showAgeRangePublicly: privacyRes.data?.show_age_range_publicly ?? true,
      allowDiscoverability: privacyRes.data?.allow_discoverability ?? true,
    };

    return {
      id: profileData.id,
      username: profileData.username,
      city: profileData.cities?.name_en || 'Riyadh',
      gender: profileData.gender,
      ageRange: profileData.age_range,
      avatar: profileData.avatar,
      answers,
      bio: profileData.bio,
      isCompleted: profileData.is_completed,
      privacy,
    };
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

/**
 * Saves or updates user profile and normalized preferences across tables.
 */
export async function saveUserProfile(user: UserProfile): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Local persistence fallback
    try {
      localStorage.setItem('twin_user_profile', JSON.stringify(user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  try {
    const cityId = user.city ? user.city.toLowerCase().replace(/\s+/g, '_') : 'riyadh';

    // 1. Upsert profiles row
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id,
      username: user.username,
      gender: user.gender || 'prefer_not_to_say',
      age_range: user.ageRange,
      city_id: cityId,
      avatar: user.avatar,
      bio: user.bio,
      is_completed: user.isCompleted,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // 2. Upsert privacy settings
    await supabase.from('privacy_settings').upsert({
      user_id: user.id,
      show_city_publicly: user.privacy.showCityPublicly,
      show_gender_publicly: user.privacy.showGenderPublicly,
      show_age_range_publicly: user.privacy.showAgeRangePublicly,
      allow_discoverability: user.privacy.allowDiscoverability,
      updated_at: new Date().toISOString(),
    });

    // 3. Normalized preference tables
    const answers = user.answers;

    // Sports (delete existing and insert batch)
    if (answers.q_sports && Array.isArray(answers.q_sports)) {
      await supabase.from('sports_preferences').delete().eq('user_id', user.id);
      if (answers.q_sports.length > 0) {
        const sportsBatch = answers.q_sports.map((sportId) => ({
          user_id: user.id,
          sport_id: sportId,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('sports_preferences').insert(sportsBatch);
      }
    }

    // Coffee
    if (answers.q_coffee) {
      await supabase.from('coffee_preferences').upsert({
        user_id: user.id,
        coffee_style: answers.q_coffee as string,
        updated_at: new Date().toISOString(),
      });
    }

    // Food & Drinks
    if (answers.q_food || answers.q_drinks) {
      await supabase.from('food_preferences').upsert({
        user_id: user.id,
        comfort_food: (answers.q_food as string) || 'food_burger',
        favorite_drink: (answers.q_drinks as string) || 'drink_orangemint',
        updated_at: new Date().toISOString(),
      });
    }

    // Lifestyle & Leisure
    if (answers.q_vibe || answers.q_leisure || answers.q_places || answers.q_lifestyle) {
      await supabase.from('lifestyle_preferences').upsert({
        user_id: user.id,
        dominant_vibe: (answers.q_vibe as string) || 'vibe_ambitious',
        weekend_leisure: (answers.q_leisure as string) || 'leisure_cafe',
        ideal_place: (answers.q_places as string) || 'place_cozycafe',
        daily_rhythm: (answers.q_lifestyle as string) || 'lifestyle_nightowl',
        updated_at: new Date().toISOString(),
      });
    }

    // Vehicle
    if (answers.q_cars) {
      await supabase.from('vehicle_preferences').upsert({
        user_id: user.id,
        driving_philosophy: answers.q_cars as string,
        updated_at: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error saving user profile to Supabase:', err);
    return { success: false, error: err.message || 'Failed to save profile' };
  }
}

/**
 * Blocks a user so they will never appear in matches or discovery.
 */
export async function blockUser(currentUserId: string, targetUserId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  try {
    const { error } = await supabase.from('blocked_users').insert({
      user_id: currentUserId,
      blocked_user_id: targetUserId,
    });
    return !error;
  } catch {
    return false;
  }
}
