-- Add date_of_birth column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN date_of_birth DATE;
  END IF;
END $$;

-- Create function to automatically update age based on date_of_birth
CREATE OR REPLACE FUNCTION update_age_from_dob()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date_of_birth IS NOT NULL THEN
    NEW.age := DATE_PART('year', AGE(CURRENT_DATE, NEW.date_of_birth));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update age whenever date_of_birth is changed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_age_trigger'
  ) THEN
    CREATE TRIGGER update_age_trigger
    BEFORE INSERT OR UPDATE OF date_of_birth ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_age_from_dob();
  END IF;
END $$;

-- Create function to update age for all profiles on a schedule
CREATE OR REPLACE FUNCTION update_all_ages()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET age = DATE_PART('year', AGE(CURRENT_DATE, date_of_birth))
  WHERE date_of_birth IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run the update_all_ages function daily
-- Note: This requires pg_cron extension to be enabled
-- If pg_cron is not available, you can run this manually or set up an external scheduler
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    SELECT cron.schedule('0 0 * * *', 'SELECT update_all_ages()');
  END IF;
EXCEPTION
  WHEN undefined_function THEN
    -- pg_cron not available, skip this step
    RAISE NOTICE 'pg_cron extension not available, skipping cron job creation';
END $$;