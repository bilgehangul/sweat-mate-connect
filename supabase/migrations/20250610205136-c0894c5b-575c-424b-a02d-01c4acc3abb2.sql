
-- Create communities table
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  member_count INTEGER DEFAULT 1,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community members table (many-to-many relationship)
CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE SET NULL,
  match_score DECIMAL(3,2), -- Score from 0.00 to 1.00
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'matched')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id, session_id)
);

-- Create favorite gym buddies table
CREATE TABLE public.favorite_gym_buddies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buddy_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, buddy_id)
);

-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  participant2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant1_id, participant2_id)
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supported gyms table
CREATE TABLE public.supported_gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all new tables
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_gym_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supported_gyms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communities
CREATE POLICY "Users can view public communities" ON public.communities FOR SELECT USING (NOT is_private OR auth.uid() IN (SELECT user_id FROM public.community_members WHERE community_id = id));
CREATE POLICY "Users can create communities" ON public.communities FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Community creators and admins can update" ON public.communities FOR UPDATE USING (
  auth.uid() = creator_id OR 
  auth.uid() IN (SELECT user_id FROM public.community_members WHERE community_id = id AND role IN ('admin', 'moderator'))
);
CREATE POLICY "Community creators can delete" ON public.communities FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for community members
CREATE POLICY "Users can view community members" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "Users can join communities" ON public.community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave communities" ON public.community_members FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Community admins can manage members" ON public.community_members FOR ALL USING (
  auth.uid() IN (
    SELECT cm.user_id FROM public.community_members cm 
    WHERE cm.community_id = community_id AND cm.role IN ('admin', 'moderator')
  )
);

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches" ON public.matches FOR SELECT USING (
  auth.uid() = user1_id OR auth.uid() = user2_id
);
CREATE POLICY "System can create matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their match status" ON public.matches FOR UPDATE USING (
  auth.uid() = user1_id OR auth.uid() = user2_id
);

-- RLS Policies for favorite gym buddies
CREATE POLICY "Users can view their own favorite buddies" ON public.favorite_gym_buddies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorite buddies" ON public.favorite_gym_buddies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorite buddies" ON public.favorite_gym_buddies FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat conversations
CREATE POLICY "Users can view their own conversations" ON public.chat_conversations FOR SELECT USING (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);
CREATE POLICY "Users can create conversations" ON public.chat_conversations FOR INSERT WITH CHECK (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);

-- RLS Policies for chat messages
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages FOR SELECT USING (
  auth.uid() IN (
    SELECT participant1_id FROM public.chat_conversations WHERE id = conversation_id
    UNION
    SELECT participant2_id FROM public.chat_conversations WHERE id = conversation_id
  )
);
CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own messages" ON public.chat_messages FOR UPDATE USING (auth.uid() = sender_id);

-- RLS Policies for supported gyms
CREATE POLICY "Everyone can view supported gyms" ON public.supported_gyms FOR SELECT USING (is_active = true);

-- Insert some sample supported gyms
INSERT INTO public.supported_gyms (name, location, address, logo_url) VALUES
('Planet Fitness', 'New York, NY', '123 Main St, New York, NY 10001', null),
('Gold''s Gym', 'Los Angeles, CA', '456 Sunset Blvd, Los Angeles, CA 90028', null),
('LA Fitness', 'Chicago, IL', '789 Michigan Ave, Chicago, IL 60611', null),
('24 Hour Fitness', 'Phoenix, AZ', '321 Central Ave, Phoenix, AZ 85004', null),
('Anytime Fitness', 'Miami, FL', '654 Ocean Dr, Miami, FL 33139', null);

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

-- Create trigger for community member count
CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION update_community_member_count();
