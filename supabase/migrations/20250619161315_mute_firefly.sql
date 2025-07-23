-- Add status field to workout_sessions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'workout_sessions' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.workout_sessions ADD COLUMN status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'completed', 'cancelled'));
  END IF;
END $$;

-- Create function to update session status based on participant count
CREATE OR REPLACE FUNCTION update_session_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If session is already cancelled or completed, don't change the status
  IF EXISTS (
    SELECT 1 FROM public.workout_sessions 
    WHERE id = NEW.session_id AND status IN ('cancelled', 'completed')
  ) THEN
    RETURN NEW;
  END IF;

  -- Update session status based on participant count
  UPDATE public.workout_sessions
  SET 
    status = CASE
      WHEN current_participants >= max_participants THEN 'full'
      ELSE 'open'
    END
  WHERE id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update session status when participants change
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_session_status_trigger'
  ) THEN
    CREATE TRIGGER update_session_status_trigger
    AFTER INSERT OR DELETE ON public.session_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_session_status();
  END IF;
END $$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to handle new user creation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Create function to update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities 
    SET member_count = member_count + 1 
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities 
    SET member_count = member_count - 1 
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update community member count
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_community_member_count_trigger'
  ) THEN
    CREATE TRIGGER update_community_member_count_trigger
    AFTER INSERT OR DELETE ON public.community_members
    FOR EACH ROW
    EXECUTE FUNCTION update_community_member_count();
  END IF;
END $$;

-- Create function to check if user is a community admin
CREATE OR REPLACE FUNCTION is_community_admin(user_id UUID, community_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.community_members
    WHERE user_id = $1 AND community_id = $2 AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's role in a community
CREATE OR REPLACE FUNCTION get_user_community_role(user_id UUID, community_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.community_members
  WHERE user_id = $1 AND community_id = $2;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql;