/*
  # Add User Achievements and Gamification Features

  1. New Tables
    - `achievements` - Define available achievements
    - `user_achievements` - Track user progress on achievements
    - `user_streaks` - Track workout streaks and consistency
    - `workout_logs` - Detailed workout tracking
    
  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for user data access
    
  3. Features
    - Achievement system for motivation
    - Streak tracking for consistency
    - Detailed workout logging
    - Progress tracking
*/

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL CHECK (category IN ('workout', 'social', 'consistency', 'milestone')),
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('count', 'streak', 'social')),
  requirement_value INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  badge_color TEXT DEFAULT '#FFD700',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create user streaks table
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  streak_type TEXT NOT NULL CHECK (streak_type IN ('workout', 'login', 'social')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- Create workout logs table for detailed tracking
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE SET NULL,
  workout_type TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  notes TEXT,
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  workout_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user preferences table for better matching
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  preferred_workout_times TEXT[], -- e.g., ['morning', 'evening']
  preferred_days TEXT[], -- e.g., ['monday', 'wednesday', 'friday']
  max_travel_distance INTEGER DEFAULT 10, -- in miles/km
  workout_intensity TEXT CHECK (workout_intensity IN ('low', 'moderate', 'high', 'extreme')),
  social_level TEXT CHECK (social_level IN ('introvert', 'moderate', 'extrovert')),
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Everyone can view active achievements" 
  ON public.achievements 
  FOR SELECT 
  USING (is_active = true);

-- RLS Policies for user achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" 
  ON public.user_achievements 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create user achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for user streaks
CREATE POLICY "Users can view their own streaks" 
  ON public.user_streaks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
  ON public.user_streaks 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for workout logs
CREATE POLICY "Users can manage their own workout logs" 
  ON public.workout_logs 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for user preferences
CREATE POLICY "Users can manage their own preferences" 
  ON public.user_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, points) VALUES
('First Workout', 'Complete your first workout session', '🏃', 'workout', 'count', 1, 10),
('Workout Warrior', 'Complete 10 workout sessions', '💪', 'workout', 'count', 10, 50),
('Fitness Fanatic', 'Complete 50 workout sessions', '🔥', 'workout', 'count', 50, 200),
('Social Butterfly', 'Connect with 5 gym buddies', '🦋', 'social', 'count', 5, 30),
('Community Builder', 'Create your first community', '🏗️', 'social', 'count', 1, 25),
('Consistency King', 'Maintain a 7-day workout streak', '👑', 'consistency', 'streak', 7, 75),
('Unstoppable', 'Maintain a 30-day workout streak', '🚀', 'consistency', 'streak', 30, 300),
('Early Bird', 'Complete 10 morning workouts', '🌅', 'workout', 'count', 10, 40),
('Night Owl', 'Complete 10 evening workouts', '🦉', 'workout', 'count', 10, 40),
('Marathon Trainer', 'Log 100 hours of cardio', '🏃‍♂️', 'milestone', 'count', 100, 500);

-- Create function to update user streaks
CREATE OR REPLACE FUNCTION update_user_streak(user_id UUID, streak_type TEXT)
RETURNS VOID AS $$
DECLARE
  current_date DATE := CURRENT_DATE;
  last_activity DATE;
  current_streak_val INTEGER := 0;
  longest_streak_val INTEGER := 0;
BEGIN
  -- Get current streak data
  SELECT current_streak, longest_streak, last_activity_date 
  INTO current_streak_val, longest_streak_val, last_activity
  FROM public.user_streaks 
  WHERE user_id = $1 AND streak_type = $2;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date)
    VALUES ($1, $2, 1, 1, current_date);
    RETURN;
  END IF;
  
  -- If activity is today, don't update
  IF last_activity = current_date THEN
    RETURN;
  END IF;
  
  -- If activity was yesterday, increment streak
  IF last_activity = current_date - INTERVAL '1 day' THEN
    current_streak_val := current_streak_val + 1;
  ELSE
    -- Reset streak if gap is more than 1 day
    current_streak_val := 1;
  END IF;
  
  -- Update longest streak if current is higher
  IF current_streak_val > longest_streak_val THEN
    longest_streak_val := current_streak_val;
  END IF;
  
  -- Update the record
  UPDATE public.user_streaks 
  SET current_streak = current_streak_val,
      longest_streak = longest_streak_val,
      last_activity_date = current_date,
      updated_at = NOW()
  WHERE user_id = $1 AND streak_type = $2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_user_achievements(user_id UUID)
RETURNS VOID AS $$
DECLARE
  achievement_record RECORD;
  user_progress INTEGER;
BEGIN
  -- Loop through all active achievements
  FOR achievement_record IN 
    SELECT * FROM public.achievements WHERE is_active = true
  LOOP
    -- Calculate user progress based on achievement type
    CASE achievement_record.requirement_type
      WHEN 'count' THEN
        CASE achievement_record.category
          WHEN 'workout' THEN
            SELECT COUNT(*) INTO user_progress 
            FROM public.workout_logs 
            WHERE user_id = $1;
          WHEN 'social' THEN
            SELECT COUNT(*) INTO user_progress 
            FROM public.gym_buddies 
            WHERE (requester_id = $1 OR recipient_id = $1) AND status = 'accepted';
          ELSE
            user_progress := 0;
        END CASE;
      WHEN 'streak' THEN
        SELECT COALESCE(current_streak, 0) INTO user_progress 
        FROM public.user_streaks 
        WHERE user_id = $1 AND streak_type = 'workout';
      ELSE
        user_progress := 0;
    END CASE;
    
    -- Insert or update user achievement progress
    INSERT INTO public.user_achievements (user_id, achievement_id, progress, is_completed, completed_at)
    VALUES ($1, achievement_record.id, user_progress, 
            user_progress >= achievement_record.requirement_value,
            CASE WHEN user_progress >= achievement_record.requirement_value THEN NOW() ELSE NULL END)
    ON CONFLICT (user_id, achievement_id) 
    DO UPDATE SET 
      progress = EXCLUDED.progress,
      is_completed = EXCLUDED.is_completed,
      completed_at = CASE 
        WHEN EXCLUDED.is_completed AND NOT user_achievements.is_completed 
        THEN NOW() 
        ELSE user_achievements.completed_at 
      END;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;