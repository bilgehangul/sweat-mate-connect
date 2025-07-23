
-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view community memberships" ON public.community_members;
DROP POLICY IF EXISTS "Users can join communities" ON public.community_members;
DROP POLICY IF EXISTS "Users can leave communities" ON public.community_members;
DROP POLICY IF EXISTS "Community admins can manage members" ON public.community_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.community_members;
DROP POLICY IF EXISTS "Users can insert their own memberships" ON public.community_members;
DROP POLICY IF EXISTS "Users can update their own memberships" ON public.community_members;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON public.community_members;

-- Create a security definer function to get user's community memberships
CREATE OR REPLACE FUNCTION public.get_user_community_role(user_id uuid, community_id uuid)
RETURNS TEXT AS $$
  SELECT role FROM public.community_members 
  WHERE user_id = $1 AND community_id = $2
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new RLS policies for community_members using security definer approach
CREATE POLICY "Users can view community memberships" 
  ON public.community_members 
  FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.communities c 
    WHERE c.id = community_id AND c.creator_id = auth.uid()
  ));

CREATE POLICY "Users can join communities" 
  ON public.community_members 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave communities" 
  ON public.community_members 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Enable RLS on community_members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
