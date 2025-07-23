/*
  # Enhanced User Features Migration

  1. New Tables
    - `user_availability` - User workout schedule preferences
    - `workout_reviews` - Partner reviews and ratings system
    - `user_compatibility_scores` - Cached compatibility calculations
    - `notification_preferences` - User notification settings

  2. Security
    - Enable RLS on all new tables
    - Add comprehensive policies for data access control

  3. Functions
    - `calculate_compatibility_score()` - Calculate user compatibility
    - `find_compatible_users()` - Find matching users for sessions
*/

-- Create user availability table
CREATE TABLE IF NOT EXISTS public.user_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_availability' 
    AND constraint_name = 'user_availability_user_id_day_of_week_start_time_end_time_key'
  ) THEN
    ALTER TABLE public.user_availability 
    ADD CONSTRAINT user_availability_user_id_day_of_week_start_time_end_time_key 
    UNIQUE(user_id, day_of_week, start_time, end_time);
  END IF;
END $$;

-- Create workout reviews table
CREATE TABLE IF NOT EXISTS public.workout_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  motivation_rating INTEGER CHECK (motivation_rating BETWEEN 1 AND 5),
  knowledge_rating INTEGER CHECK (knowledge_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'workout_reviews' 
    AND constraint_name = 'workout_reviews_reviewer_id_reviewee_id_session_id_key'
  ) THEN
    ALTER TABLE public.workout_reviews 
    ADD CONSTRAINT workout_reviews_reviewer_id_reviewee_id_session_id_key 
    UNIQUE(reviewer_id, reviewee_id, session_id);
  END IF;
END $$;

-- Create user compatibility scores table (for caching)
CREATE TABLE IF NOT EXISTS public.user_compatibility_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  compatibility_score DECIMAL(3,2) CHECK (compatibility_score BETWEEN 0.00 AND 1.00),
  factors JSONB, -- Store breakdown of compatibility factors
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_compatibility_scores' 
    AND constraint_name = 'user_compatibility_scores_user1_id_user2_id_key'
  ) THEN
    ALTER TABLE public.user_compatibility_scores 
    ADD CONSTRAINT user_compatibility_scores_user1_id_user2_id_key 
    UNIQUE(user1_id, user2_id);
  END IF;
END $$;

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  new_matches BOOLEAN DEFAULT true,
  session_reminders BOOLEAN DEFAULT true,
  buddy_requests BOOLEAN DEFAULT true,
  community_updates BOOLEAN DEFAULT true,
  achievement_unlocked BOOLEAN DEFAULT true,
  workout_invitations BOOLEAN DEFAULT true,
  email_frequency TEXT DEFAULT 'daily' CHECK (email_frequency IN ('immediate', 'daily', 'weekly', 'never')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'notification_preferences' 
    AND constraint_name = 'notification_preferences_user_id_key'
  ) THEN
    ALTER TABLE public.notification_preferences 
    ADD CONSTRAINT notification_preferences_user_id_key 
    UNIQUE(user_id);
  END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE public.user_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_compatibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- User availability policies
  DROP POLICY IF EXISTS "Users can manage their own availability" ON public.user_availability;
  DROP POLICY IF EXISTS "Users can view others' availability for matching" ON public.user_availability;
  
  CREATE POLICY "Users can manage their own availability" 
    ON public.user_availability 
    FOR ALL 
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can view others' availability for matching" 
    ON public.user_availability 
    FOR SELECT 
    USING (is_active = true);

  -- Workout reviews policies
  DROP POLICY IF EXISTS "Users can view reviews about themselves" ON public.workout_reviews;
  DROP POLICY IF EXISTS "Users can create reviews for sessions they attended" ON public.workout_reviews;
  DROP POLICY IF EXISTS "Users can update their own reviews" ON public.workout_reviews;
  
  CREATE POLICY "Users can view reviews about themselves" 
    ON public.workout_reviews 
    FOR SELECT 
    USING (auth.uid() = reviewee_id OR auth.uid() = reviewer_id);

  CREATE POLICY "Users can create reviews for sessions they attended" 
    ON public.workout_reviews 
    FOR INSERT 
    WITH CHECK (
      auth.uid() = reviewer_id AND 
      EXISTS (
        SELECT 1 FROM public.session_participants sp 
        WHERE sp.session_id = workout_reviews.session_id 
        AND sp.user_id = auth.uid() 
        AND sp.status = 'accepted'
      )
    );

  CREATE POLICY "Users can update their own reviews" 
    ON public.workout_reviews 
    FOR UPDATE 
    USING (auth.uid() = reviewer_id);

  -- Compatibility scores policies
  DROP POLICY IF EXISTS "Users can view their own compatibility scores" ON public.user_compatibility_scores;
  DROP POLICY IF EXISTS "System can manage compatibility scores" ON public.user_compatibility_scores;
  
  CREATE POLICY "Users can view their own compatibility scores" 
    ON public.user_compatibility_scores 
    FOR SELECT 
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

  CREATE POLICY "System can manage compatibility scores" 
    ON public.user_compatibility_scores 
    FOR ALL 
    USING (true);

  -- Notification preferences policies
  DROP POLICY IF EXISTS "Users can manage their own notification preferences" ON public.notification_preferences;
  
  CREATE POLICY "Users can manage their own notification preferences" 
    ON public.notification_preferences 
    FOR ALL 
    USING (auth.uid() = user_id);
END $$;

-- Create function to calculate compatibility score
CREATE OR REPLACE FUNCTION calculate_compatibility_score(user1_id UUID, user2_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  user1_profile RECORD;
  user2_profile RECORD;
  user1_prefs RECORD;
  user2_prefs RECORD;
  score DECIMAL(3,2) := 0.00;
  factors JSONB := '{}';
BEGIN
  -- Get user profiles
  SELECT * INTO user1_profile FROM public.profiles WHERE id = user1_id;
  SELECT * INTO user2_profile FROM public.profiles WHERE id = user2_id;
  
  -- Get user preferences (if table exists)
  BEGIN
    SELECT * INTO user1_prefs FROM public.user_preferences WHERE user_id = user1_id;
    SELECT * INTO user2_prefs FROM public.user_preferences WHERE user_id = user2_id;
  EXCEPTION
    WHEN undefined_table THEN
      -- user_preferences table doesn't exist, continue without it
      user1_prefs := NULL;
      user2_prefs := NULL;
  END;
  
  -- Experience level compatibility (20% weight)
  IF user1_profile.experience_level = user2_profile.experience_level THEN
    score := score + 0.20;
    factors := factors || '{"experience_match": true}';
  ELSIF (user1_profile.experience_level IN ('beginner', 'intermediate') AND 
         user2_profile.experience_level IN ('beginner', 'intermediate')) OR
        (user1_profile.experience_level IN ('intermediate', 'advanced') AND 
         user2_profile.experience_level IN ('intermediate', 'advanced')) THEN
    score := score + 0.10;
    factors := factors || '{"experience_match": "partial"}';
  END IF;
  
  -- Age compatibility (15% weight)
  IF user1_profile.age IS NOT NULL AND user2_profile.age IS NOT NULL THEN
    IF ABS(user1_profile.age - user2_profile.age) <= 5 THEN
      score := score + 0.15;
      factors := factors || '{"age_match": "excellent"}';
    ELSIF ABS(user1_profile.age - user2_profile.age) <= 10 THEN
      score := score + 0.10;
      factors := factors || '{"age_match": "good"}';
    ELSIF ABS(user1_profile.age - user2_profile.age) <= 15 THEN
      score := score + 0.05;
      factors := factors || '{"age_match": "fair"}';
    END IF;
  END IF;
  
  -- Location compatibility (25% weight)
  IF user1_profile.location = user2_profile.location THEN
    score := score + 0.25;
    factors := factors || '{"location_match": true}';
  END IF;
  
  -- Workout goals overlap (20% weight)
  IF user1_profile.workout_goals IS NOT NULL AND user2_profile.workout_goals IS NOT NULL THEN
    IF user1_profile.workout_goals && user2_profile.workout_goals THEN
      score := score + 0.20;
      factors := factors || '{"goals_overlap": true}';
    END IF;
  END IF;
  
  -- Workout preferences overlap (20% weight)
  IF user1_profile.workout_preferences IS NOT NULL AND user2_profile.workout_preferences IS NOT NULL THEN
    IF user1_profile.workout_preferences && user2_profile.workout_preferences THEN
      score := score + 0.20;
      factors := factors || '{"preferences_overlap": true}';
    END IF;
  END IF;
  
  -- Cache the result
  INSERT INTO public.user_compatibility_scores (user1_id, user2_id, compatibility_score, factors)
  VALUES (user1_id, user2_id, score, factors)
  ON CONFLICT (user1_id, user2_id) 
  DO UPDATE SET 
    compatibility_score = EXCLUDED.compatibility_score,
    factors = EXCLUDED.factors,
    calculated_at = NOW();
  
  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to find compatible users for a session
CREATE OR REPLACE FUNCTION find_compatible_users(session_id UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  user_id UUID,
  compatibility_score DECIMAL(3,2),
  profile_data JSONB
) AS $$
DECLARE
  session_creator UUID;
  session_workout_type TEXT;
  session_gym_location TEXT;
  session_scheduled_date DATE;
  session_start_time TIME;
BEGIN
  -- Get session information using individual variables
  SELECT creator_id, workout_type, gym_location, scheduled_date, start_time 
  INTO session_creator, session_workout_type, session_gym_location, session_scheduled_date, session_start_time
  FROM public.workout_sessions 
  WHERE id = session_id;
  
  -- Return if session not found
  IF session_creator IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id as user_id,
    COALESCE(ucs.compatibility_score, calculate_compatibility_score(session_creator, p.id)) as compatibility_score,
    jsonb_build_object(
      'first_name', p.first_name,
      'last_name', p.last_name,
      'username', p.username,
      'avatar_url', p.avatar_url,
      'experience_level', p.experience_level,
      'location', p.location
    ) as profile_data
  FROM public.profiles p
  LEFT JOIN public.user_compatibility_scores ucs ON 
    (ucs.user1_id = session_creator AND ucs.user2_id = p.id) OR
    (ucs.user1_id = p.id AND ucs.user2_id = session_creator)
  WHERE p.id != session_creator
    AND p.id NOT IN (
      SELECT sp.user_id 
      FROM public.session_participants sp 
      WHERE sp.session_id = find_compatible_users.session_id
    )
  ORDER BY compatibility_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;