-- ============================================================================
-- TWIN: Phase 2 Deterministic Matching Engine & RPC Functions (PostgreSQL)
-- Migration: 20261020000001_matching_engine_rpc.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DETERMINISTIC SIMILARITY CALCULATION FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_twin_similarity(
  p_user_a UUID,
  p_user_b UUID
)
RETURNS TABLE (
  similarity_score NUMERIC(5,2),
  coverage_score NUMERIC(5,2),
  shared_interests TEXT[],
  meaningful_diffs TEXT[],
  reason_keys TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_weight_lifestyle CONSTANT NUMERIC := 0.20;
  v_weight_food CONSTANT NUMERIC := 0.15;
  v_weight_coffee CONSTANT NUMERIC := 0.10;
  v_weight_sports CONSTANT NUMERIC := 0.15;
  v_weight_cars CONSTANT NUMERIC := 0.10;
  v_weight_vibe CONSTANT NUMERIC := 0.10;
  v_weight_rhythm CONSTANT NUMERIC := 0.10;
  v_weight_leisure CONSTANT NUMERIC := 0.10;

  v_sum_weights NUMERIC := 0;
  v_weighted_sim NUMERIC := 0;

  -- Sports variables for Jaccard similarity
  v_sports_a TEXT[];
  v_sports_b TEXT[];
  v_sports_inter_count INT := 0;
  v_sports_union_count INT := 0;
  v_sports_sim NUMERIC := 0;

  -- Individual category records
  v_coffee_a TEXT; v_coffee_b TEXT;
  v_food_a TEXT; v_food_b TEXT;
  v_drink_a TEXT; v_drink_b TEXT;
  v_vibe_a TEXT; v_vibe_b TEXT;
  v_leisure_a TEXT; v_leisure_b TEXT;
  v_place_a TEXT; v_place_b TEXT;
  v_rhythm_a TEXT; v_rhythm_b TEXT;
  v_car_a TEXT; v_car_b TEXT;

  v_shared TEXT[] := ARRAY[]::TEXT[];
  v_diffs TEXT[] := ARRAY[]::TEXT[];
  v_reasons TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- 1. Sports & Gaming (Jaccard Index)
  SELECT array_agg(sport_id) INTO v_sports_a FROM public.sports_preferences WHERE user_id = p_user_a;
  SELECT array_agg(sport_id) INTO v_sports_b FROM public.sports_preferences WHERE user_id = p_user_b;

  IF v_sports_a IS NOT NULL AND v_sports_b IS NOT NULL AND array_length(v_sports_a, 1) > 0 AND array_length(v_sports_b, 1) > 0 THEN
    SELECT count(*) INTO v_sports_inter_count FROM (
      SELECT unnest(v_sports_a) INTERSECT SELECT unnest(v_sports_b)
    ) s_inter;

    SELECT count(*) INTO v_sports_union_count FROM (
      SELECT unnest(v_sports_a) UNION SELECT unnest(v_sports_b)
    ) s_union;

    IF v_sports_union_count > 0 THEN
      v_sports_sim := v_sports_inter_count::NUMERIC / v_sports_union_count::NUMERIC;
      v_weighted_sim := v_weighted_sim + (v_sports_sim * v_weight_sports);
      v_sum_weights := v_sum_weights + v_weight_sports;

      IF v_sports_inter_count > 0 THEN
        v_shared := array_append(v_shared, 'sports_overlap');
        v_reasons := array_append(v_reasons, 'shared_sports_passion');
      END IF;
    END IF;
  END IF;

  -- 2. Coffee Ritual
  SELECT coffee_style INTO v_coffee_a FROM public.coffee_preferences WHERE user_id = p_user_a;
  SELECT coffee_style INTO v_coffee_b FROM public.coffee_preferences WHERE user_id = p_user_b;

  IF v_coffee_a IS NOT NULL AND v_coffee_b IS NOT NULL THEN
    v_sum_weights := v_sum_weights + v_weight_coffee;
    IF v_coffee_a = v_coffee_b THEN
      v_weighted_sim := v_weighted_sim + (1.0 * v_weight_coffee);
      v_shared := array_append(v_shared, v_coffee_a);
      v_reasons := array_append(v_reasons, 'identical_coffee_ritual');
    ELSE
      v_diffs := array_append(v_diffs, 'coffee_preference');
    END IF;
  END IF;

  -- 3. Food & Comfort
  SELECT comfort_food, favorite_drink INTO v_food_a, v_drink_a FROM public.food_preferences WHERE user_id = p_user_a;
  SELECT comfort_food, favorite_drink INTO v_food_b, v_drink_b FROM public.food_preferences WHERE user_id = p_user_b;

  IF v_food_a IS NOT NULL AND v_food_b IS NOT NULL THEN
    v_sum_weights := v_sum_weights + (v_weight_food * 0.6);
    IF v_food_a = v_food_b THEN
      v_weighted_sim := v_weighted_sim + (1.0 * v_weight_food * 0.6);
      v_shared := array_append(v_shared, v_food_a);
      v_reasons := array_append(v_reasons, 'shared_comfort_food');
    ELSE
      v_diffs := array_append(v_diffs, 'comfort_food');
    END IF;
  END IF;

  IF v_drink_a IS NOT NULL AND v_drink_b IS NOT NULL THEN
    v_sum_weights := v_sum_weights + (v_weight_food * 0.4);
    IF v_drink_a = v_drink_b THEN
      v_weighted_sim := v_weighted_sim + (1.0 * v_weight_food * 0.4);
      v_shared := array_append(v_shared, v_drink_a);
    END IF;
  END IF;

  -- 4. Lifestyle & Environment
  SELECT dominant_vibe, weekend_leisure, ideal_place, daily_rhythm 
  INTO v_vibe_a, v_leisure_a, v_place_a, v_rhythm_a 
  FROM public.lifestyle_preferences WHERE user_id = p_user_a;

  SELECT dominant_vibe, weekend_leisure, ideal_place, daily_rhythm 
  INTO v_vibe_b, v_leisure_b, v_place_b, v_rhythm_b 
  FROM public.lifestyle_preferences WHERE user_id = p_user_b;

  -- Vibe
  IF v_vibe_a IS NOT NULL AND v_vibe_b IS NOT NULL THEN
    v_sum_weights := v_sum_weights + v_weight_vibe;
    IF v_vibe_a = v_vibe_b THEN
      v_weighted_sim := v_weighted_sim + (1.0 * v_weight_vibe);
      v_shared := array_append(v_shared, v_vibe_a);
      v_reasons := array_append(v_reasons, 'aligned_energy_vibe');
    END IF;
  END IF;

  -- Leisure
  IF v_leisure_a IS NOT NULL AND v_leisure_b IS NOT NULL THEN
    v_sum_weights := v_sum_weights + v_weight_leisure;
    IF v_leisure_a = v_leisure_b THEN
      v_weighted_sim := v_weighted_sim + (1.0 * v_weight_leisure);
      v_shared := array_append(v_shared, v_leisure_a);
      v_reasons := array_append(v_reasons, 'matching_weekend_plans');
    END IF;
  END IF;

  -- Ideal Place
  IF v_place_a IS NOT NULL AND v_place_b IS NOT NULL THEN
    v_sum_weights := v_sum_weights + v_weight_lifestyle;
    IF v_place_a = v_place_b THEN
      v_weighted_sim := v_weighted_sim + (1.0 * v_weight_lifestyle);
      v_shared := array_append(v_shared, v_place_a);
    END IF;
  END IF;

  -- Daily Rhythm
  IF v_rhythm_a IS NOT NULL AND v_rhythm_b IS NOT NULL THEN
    v_sum_weights := v_sum_weights + v_weight_rhythm;
    IF v_rhythm_a = v_rhythm_b THEN
      v_weighted_sim := v_weighted_sim + (1.0 * v_weight_rhythm);
      v_shared := array_append(v_shared, v_rhythm_a);
      v_reasons := array_append(v_reasons, 'synchronized_daily_rhythm');
    END IF;
  END IF;

  -- 5. Vehicle Philosophy
  SELECT driving_philosophy INTO v_car_a FROM public.vehicle_preferences WHERE user_id = p_user_a;
  SELECT driving_philosophy INTO v_car_b FROM public.vehicle_preferences WHERE user_id = p_user_b;

  IF v_car_a IS NOT NULL AND v_car_b IS NOT NULL THEN
    v_sum_weights := v_sum_weights + v_weight_cars;
    IF v_car_a = v_car_b THEN
      v_weighted_sim := v_weighted_sim + (1.0 * v_weight_cars);
      v_shared := array_append(v_shared, v_car_a);
      v_reasons := array_append(v_reasons, 'matching_driving_style');
    END IF;
  END IF;

  -- Calculate final normalized percentage and coverage
  IF v_sum_weights > 0 THEN
    similarity_score := ROUND(((v_weighted_sim / v_sum_weights) * 100)::NUMERIC, 1);
    coverage_score := ROUND((v_sum_weights * 100)::NUMERIC, 1);
  ELSE
    similarity_score := 0.0;
    coverage_score := 0.0;
  END IF;

  shared_interests := v_shared;
  meaningful_diffs := v_diffs;
  reason_keys := v_reasons;

  RETURN NEXT;
END;
$$;

-- ----------------------------------------------------------------------------
-- 2. GET TOP TWIN MATCHES RPC FUNCTION (With Stable Tie-Breaking)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_top_twin_matches(
  p_user_id UUID,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  matched_user_id UUID,
  username TEXT,
  city_name_en TEXT,
  city_name_ar TEXT,
  gender TEXT,
  age_range TEXT,
  avatar JSONB,
  bio TEXT,
  similarity_score NUMERIC(5,2),
  coverage_score NUMERIC(5,2),
  shared_interests TEXT[],
  reason_keys TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH eligible_candidates AS (
    -- Exclude self, blocked users, incomplete profiles, and non-discoverable users
    SELECT 
      p.id AS candidate_id,
      p.username,
      c.name_en AS city_en,
      c.name_ar AS city_ar,
      CASE WHEN ps.show_gender_publicly THEN p.gender ELSE NULL END AS visible_gender,
      CASE WHEN ps.show_age_range_publicly THEN p.age_range ELSE NULL END AS visible_age_range,
      p.avatar,
      p.bio,
      ps.show_city_publicly
    FROM public.profiles p
    JOIN public.privacy_settings ps ON ps.user_id = p.id
    LEFT JOIN public.cities c ON c.id = p.city_id
    WHERE p.id <> p_user_id
      AND p.is_completed = true
      AND ps.allow_discoverability = true
      AND NOT EXISTS (
        SELECT 1 FROM public.blocked_users bu
        WHERE (bu.user_id = p_user_id AND bu.blocked_user_id = p.id)
           OR (bu.user_id = p.id AND bu.blocked_user_id = p_user_id)
      )
  ),
  scored_candidates AS (
    SELECT 
      ec.candidate_id,
      ec.username,
      CASE WHEN ec.show_city_publicly THEN ec.city_en ELSE 'Global' END AS city_name_en,
      CASE WHEN ec.show_city_publicly THEN ec.city_ar ELSE 'حول العالم' END AS city_name_ar,
      ec.visible_gender,
      ec.visible_age_range,
      ec.avatar,
      ec.bio,
      sim.similarity_score,
      sim.coverage_score,
      sim.shared_interests,
      sim.reason_keys
    FROM eligible_candidates ec
    CROSS JOIN LATERAL public.calculate_twin_similarity(p_user_id, ec.candidate_id) sim
    -- Minimum coverage threshold of 40% to be eligible as a valid twin match
    WHERE sim.coverage_score >= 40.0
  )
  SELECT 
    sc.candidate_id,
    sc.username,
    sc.city_name_en,
    sc.city_name_ar,
    sc.visible_gender,
    sc.visible_age_range,
    sc.avatar,
    sc.bio,
    sc.similarity_score,
    sc.coverage_score,
    sc.shared_interests,
    sc.reason_keys
  FROM scored_candidates sc
  -- Deterministic Stable Tie-Breaking: Similarity DESC, Coverage DESC, candidate_id ASC
  ORDER BY sc.similarity_score DESC, sc.coverage_score DESC, sc.candidate_id ASC
  LIMIT p_limit;
END;
$$;
