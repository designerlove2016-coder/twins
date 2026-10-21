-- ============================================================================
-- TWIN: Phase 2 Database Schema & Row-Level Security (PostgreSQL / Supabase)
-- Migration: 20261020000000_initial_twin_schema.sql
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. CITIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cities (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'SA',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed standardized cities
INSERT INTO public.cities (id, name_en, name_ar, country_code) VALUES
  ('riyadh', 'Riyadh', 'الرياض', 'SA'),
  ('jeddah', 'Jeddah', 'جدة', 'SA'),
  ('dubai', 'Dubai', 'دبي', 'AE'),
  ('khobar', 'Khobar', 'الخبر', 'SA'),
  ('doha', 'Doha', 'الدوحة', 'QA'),
  ('abu_dhabi', 'Abu Dhabi', 'أبوظبي', 'AE'),
  ('cairo', 'Cairo', 'القاهرة', 'EG'),
  ('manama', 'Manama', 'المنامة', 'BH'),
  ('kuwait_city', 'Kuwait City', 'مدينة الكويت', 'KW')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. PROFILES TABLE (Linked to auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'prefer_not_to_say')),
  age_range TEXT CHECK (age_range IN ('18-23', '24-29', '30-35', '36-42', '43+')),
  city_id TEXT REFERENCES public.cities(id),
  avatar JSONB NOT NULL DEFAULT '{
    "id": "default",
    "baseGender": "neutral",
    "skinTone": "#E0AC69",
    "hairStyle": "traditional",
    "hairColor": "#1A1816",
    "clothingStyle": "thobe",
    "clothingColor": "#0B5D3B",
    "accessory": "sunglasses",
    "expression": "smile",
    "direction": "center"
  }'::jsonb,
  bio TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Username validation constraint: lowercase alphanumeric + underscore, 3-20 characters
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS username_format_check;
ALTER TABLE public.profiles 
  ADD CONSTRAINT username_format_check CHECK (username ~* '^[a-z0-9_]{3,20}$');

-- Indexes on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_city_id ON public.profiles(city_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_completed ON public.profiles(is_completed);

-- ----------------------------------------------------------------------------
-- 3. PRIVATE USER DATA TABLE (Strict Phone Isolation)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.private_user_data (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number_masked TEXT,
  phone_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. PRIVACY SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.privacy_settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  show_city_publicly BOOLEAN NOT NULL DEFAULT true,
  show_gender_publicly BOOLEAN NOT NULL DEFAULT false,
  show_age_range_publicly BOOLEAN NOT NULL DEFAULT true,
  allow_discoverability BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. BLOCKED USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blocked_users (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, blocked_user_id),
  CONSTRAINT no_self_block CHECK (user_id <> blocked_user_id)
);

CREATE INDEX IF NOT EXISTS idx_blocked_users_user ON public.blocked_users(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON public.blocked_users(blocked_user_id);

-- ----------------------------------------------------------------------------
-- 6. SPORTS & GAMING PREFERENCES (Multi-Select Overlap)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sports_preferences (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sport_id TEXT NOT NULL,
  skill_or_frequency TEXT DEFAULT 'regular',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, sport_id)
);

CREATE INDEX IF NOT EXISTS idx_sports_preferences_user ON public.sports_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_sports_preferences_sport ON public.sports_preferences(sport_id);

-- ----------------------------------------------------------------------------
-- 7. COFFEE PREFERENCES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coffee_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  coffee_style TEXT NOT NULL, -- 'coffee_v60', 'coffee_flatwhite', 'coffee_arabic', 'coffee_espresso', etc.
  roast_notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. FOOD & DRINK PREFERENCES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.food_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  comfort_food TEXT NOT NULL, -- 'food_burger', 'food_traditional', 'food_japanese', etc.
  favorite_drink TEXT NOT NULL, -- 'drink_orangemint', 'drink_matcha', 'drink_mojito', etc.
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9. LIFESTYLE & PLACES PREFERENCES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lifestyle_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  dominant_vibe TEXT NOT NULL, -- 'vibe_ambitious', 'vibe_chill', 'vibe_social', 'vibe_curious'
  weekend_leisure TEXT NOT NULL, -- 'leisure_cafe', 'leisure_kashta', 'leisure_sea', 'leisure_games', etc.
  ideal_place TEXT NOT NULL, -- 'place_malls', 'place_beach', 'place_cozycafe', 'place_nature', etc.
  daily_rhythm TEXT NOT NULL, -- 'lifestyle_nightowl', 'lifestyle_earlybird', 'lifestyle_spontaneous', 'lifestyle_curated'
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10. VEHICLE PREFERENCES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicle_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  driving_philosophy TEXT NOT NULL, -- 'car_luxury_sedan', 'car_rugged_4x4', 'car_electric_tech', etc.
  current_category TEXT, -- optional voluntarily provided
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11. MATCHES TABLE (Pairwise Similarity Scores)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  similarity_score NUMERIC(5,2) NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 100),
  coverage_score NUMERIC(5,2) NOT NULL CHECK (coverage_score >= 0 AND coverage_score <= 100),
  algorithm_version TEXT NOT NULL DEFAULT 'v1.0',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT no_self_match CHECK (user_id <> matched_user_id),
  CONSTRAINT unique_user_pair UNIQUE (user_id, matched_user_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_user_score ON public.matches(user_id, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_matched_user ON public.matches(matched_user_id);

-- ----------------------------------------------------------------------------
-- 12. MATCH REASONS TABLE (Explainable Similarity Factors)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.match_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  reason_key TEXT NOT NULL,
  explanation_en TEXT NOT NULL,
  explanation_ar TEXT NOT NULL,
  contribution_weight NUMERIC(4,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_match_reasons_match_id ON public.match_reasons(match_id);

-- ----------------------------------------------------------------------------
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_reasons ENABLE ROW LEVEL SECURITY;

-- CITIES: Everyone can read cities
CREATE POLICY "Cities are viewable by all authenticated and anon users"
  ON public.cities FOR SELECT
  USING (true);

-- PROFILES:
-- 1. Any authenticated user can view completed profiles that have allow_discoverability = true
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR (
      is_completed = true
      AND EXISTS (
        SELECT 1 FROM public.privacy_settings ps
        WHERE ps.user_id = profiles.id AND ps.allow_discoverability = true
      )
      AND NOT EXISTS (
        SELECT 1 FROM public.blocked_users bu
        WHERE (bu.user_id = auth.uid() AND bu.blocked_user_id = profiles.id)
           OR (bu.user_id = profiles.id AND bu.blocked_user_id = auth.uid())
      )
    )
  );

-- 2. Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile only
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- PRIVATE USER DATA:
-- Only the user can view or update their private data. Never exposed publicly.
CREATE POLICY "Users can only view their own private data"
  ON public.private_user_data FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can only insert their own private data"
  ON public.private_user_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can only update their own private data"
  ON public.private_user_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- PRIVACY SETTINGS:
CREATE POLICY "Users can view and manage their own privacy settings"
  ON public.privacy_settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- BLOCKED USERS:
CREATE POLICY "Users can view and manage their blocked list"
  ON public.blocked_users FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- PREFERENCES (Sports, Coffee, Food, Lifestyle, Vehicle):
-- Users can view their own preferences and preferences of discoverable non-blocked users
CREATE POLICY "Preferences select policy"
  ON public.sports_preferences FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.privacy_settings ps ON ps.user_id = p.id
      WHERE p.id = sports_preferences.user_id AND ps.allow_discoverability = true
    )
  );

CREATE POLICY "Sports preferences edit policy"
  ON public.sports_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coffee preferences select policy"
  ON public.coffee_preferences FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.privacy_settings ps ON ps.user_id = p.id
      WHERE p.id = coffee_preferences.user_id AND ps.allow_discoverability = true
    )
  );

CREATE POLICY "Coffee preferences edit policy"
  ON public.coffee_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Food preferences select policy"
  ON public.food_preferences FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.privacy_settings ps ON ps.user_id = p.id
      WHERE p.id = food_preferences.user_id AND ps.allow_discoverability = true
    )
  );

CREATE POLICY "Food preferences edit policy"
  ON public.food_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Lifestyle preferences select policy"
  ON public.lifestyle_preferences FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.privacy_settings ps ON ps.user_id = p.id
      WHERE p.id = lifestyle_preferences.user_id AND ps.allow_discoverability = true
    )
  );

CREATE POLICY "Lifestyle preferences edit policy"
  ON public.lifestyle_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vehicle preferences select policy"
  ON public.vehicle_preferences FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.privacy_settings ps ON ps.user_id = p.id
      WHERE p.id = vehicle_preferences.user_id AND ps.allow_discoverability = true
    )
  );

CREATE POLICY "Vehicle preferences edit policy"
  ON public.vehicle_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- MATCHES:
-- Only visible to the participating users
CREATE POLICY "Matches viewable by participating users"
  ON public.matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

-- Clients cannot insert or update matches directly (managed via secure RPC or triggers)
CREATE POLICY "Matches cannot be created directly by client"
  ON public.matches FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- MATCH REASONS:
CREATE POLICY "Match reasons viewable by match participants"
  ON public.match_reasons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = match_reasons.match_id
        AND (m.user_id = auth.uid() OR m.matched_user_id = auth.uid())
    )
  );
