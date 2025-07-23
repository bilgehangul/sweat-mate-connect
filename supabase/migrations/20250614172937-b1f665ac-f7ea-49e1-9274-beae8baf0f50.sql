
-- Drop existing policies on communities that might be causing recursion
DROP POLICY IF EXISTS "Users can view public communities" ON public.communities;
DROP POLICY IF EXISTS "Users can create communities" ON public.communities;
DROP POLICY IF EXISTS "Community creators and admins can update" ON public.communities;
DROP POLICY IF EXISTS "Community creators can delete" ON public.communities;

-- Create a security definer function to check if user is community admin
CREATE OR REPLACE FUNCTION public.is_community_admin(user_id uuid, community_id uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_members 
    WHERE user_id = $1 AND community_id = $2 AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new RLS policies for communities using security definer approach
CREATE POLICY "Users can view public communities" 
  ON public.communities 
  FOR SELECT 
  USING (NOT is_private OR auth.uid() = creator_id OR public.is_community_admin(auth.uid(), id));

CREATE POLICY "Users can create communities" 
  ON public.communities 
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Community creators and admins can update" 
  ON public.communities 
  FOR UPDATE 
  USING (auth.uid() = creator_id OR public.is_community_admin(auth.uid(), id));

CREATE POLICY "Community creators can delete" 
  ON public.communities 
  FOR DELETE 
  USING (auth.uid() = creator_id);

-- Enable RLS on communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
