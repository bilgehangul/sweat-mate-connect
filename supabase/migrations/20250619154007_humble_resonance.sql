/*
  # Community Features Database Schema

  1. New Tables
    - `community_posts` - Posts within communities
    - `community_meetups` - Community organized meetups/events
    - `meetup_attendees` - Track meetup attendance
    - `community_surveys` - Community polls and surveys
    - `survey_options` - Survey answer options
    - `survey_responses` - User responses to surveys
    - `community_forums` - Forum categories within communities
    - `forum_topics` - Discussion topics in forums
    - `forum_posts` - Posts within forum topics
    - `community_settings` - Community customization settings

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for community members

  3. Features
    - Community posting system
    - Meetup organization and attendance
    - Survey creation and response system
    - Forum discussions
    - Community customization (logo, colors, etc.)
*/

-- Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Meetups Table
CREATE TABLE IF NOT EXISTS public.community_meetups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  address TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetup Attendees Table
CREATE TABLE IF NOT EXISTS public.meetup_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meetup_id UUID REFERENCES public.community_meetups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meetup_id, user_id)
);

-- Community Surveys Table
CREATE TABLE IF NOT EXISTS public.community_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_multiple_choice BOOLEAN DEFAULT true,
  allows_multiple_answers BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  total_responses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Survey Options Table
CREATE TABLE IF NOT EXISTS public.survey_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.community_surveys(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Survey Responses Table
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.community_surveys(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.survey_options(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(survey_id, user_id, option_id)
);

-- Community Forums Table
CREATE TABLE IF NOT EXISTS public.community_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Topics Table
CREATE TABLE IF NOT EXISTS public.forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID REFERENCES public.community_forums(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reply_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Settings Table
CREATE TABLE IF NOT EXISTS public.community_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  primary_color TEXT DEFAULT '#FF6B35',
  secondary_color TEXT DEFAULT '#1E90FF',
  accent_color TEXT DEFAULT '#32CD32',
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  custom_css TEXT,
  welcome_message TEXT,
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetup_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Community Posts
CREATE POLICY "Community members can view posts" 
  ON public.community_posts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_posts.community_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Community members can create posts" 
  ON public.community_posts 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_posts.community_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update their own posts" 
  ON public.community_posts 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors and moderators can delete posts" 
  ON public.community_posts 
  FOR DELETE 
  USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_posts.community_id 
      AND cm.user_id = auth.uid() 
      AND cm.role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for Community Meetups
CREATE POLICY "Community members can view meetups" 
  ON public.community_meetups 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_meetups.community_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Community moderators can create meetups" 
  ON public.community_meetups 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = organizer_id AND
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_meetups.community_id 
      AND cm.user_id = auth.uid() 
      AND cm.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Organizers can update their meetups" 
  ON public.community_meetups 
  FOR UPDATE 
  USING (auth.uid() = organizer_id);

-- RLS Policies for Meetup Attendees
CREATE POLICY "Community members can view attendees" 
  ON public.meetup_attendees 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_meetups cm 
      JOIN public.community_members cmem ON cm.community_id = cmem.community_id
      WHERE cm.id = meetup_attendees.meetup_id 
      AND cmem.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own attendance" 
  ON public.meetup_attendees 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for Community Surveys
CREATE POLICY "Community members can view surveys" 
  ON public.community_surveys 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_surveys.community_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Community moderators can create surveys" 
  ON public.community_surveys 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_surveys.community_id 
      AND cm.user_id = auth.uid() 
      AND cm.role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for Survey Options
CREATE POLICY "Community members can view survey options" 
  ON public.survey_options 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_surveys cs
      JOIN public.community_members cm ON cs.community_id = cm.community_id
      WHERE cs.id = survey_options.survey_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Survey creators can manage options" 
  ON public.survey_options 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_surveys cs 
      WHERE cs.id = survey_options.survey_id 
      AND cs.creator_id = auth.uid()
    )
  );

-- RLS Policies for Survey Responses
CREATE POLICY "Users can view survey responses" 
  ON public.survey_responses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_surveys cs
      JOIN public.community_members cm ON cs.community_id = cm.community_id
      WHERE cs.id = survey_responses.survey_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own responses" 
  ON public.survey_responses 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for Community Forums
CREATE POLICY "Community members can view forums" 
  ON public.community_forums 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_forums.community_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Community moderators can manage forums" 
  ON public.community_forums 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_forums.community_id 
      AND cm.user_id = auth.uid() 
      AND cm.role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for Forum Topics
CREATE POLICY "Community members can view topics" 
  ON public.forum_topics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_forums cf
      JOIN public.community_members cm ON cf.community_id = cm.community_id
      WHERE cf.id = forum_topics.forum_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Community members can create topics" 
  ON public.forum_topics 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.community_forums cf
      JOIN public.community_members cm ON cf.community_id = cm.community_id
      WHERE cf.id = forum_topics.forum_id 
      AND cm.user_id = auth.uid()
    )
  );

-- RLS Policies for Forum Posts
CREATE POLICY "Community members can view forum posts" 
  ON public.forum_posts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.forum_topics ft
      JOIN public.community_forums cf ON ft.forum_id = cf.id
      JOIN public.community_members cm ON cf.community_id = cm.community_id
      WHERE ft.id = forum_posts.topic_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Community members can create forum posts" 
  ON public.forum_posts 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.forum_topics ft
      JOIN public.community_forums cf ON ft.forum_id = cf.id
      JOIN public.community_members cm ON cf.community_id = cm.community_id
      WHERE ft.id = forum_posts.topic_id 
      AND cm.user_id = auth.uid()
    )
  );

-- RLS Policies for Community Settings
CREATE POLICY "Community members can view settings" 
  ON public.community_settings 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_settings.community_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Community admins can manage settings" 
  ON public.community_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm 
      WHERE cm.community_id = community_settings.community_id 
      AND cm.user_id = auth.uid() 
      AND cm.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON public.community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_meetups_community_id ON public.community_meetups(community_id);
CREATE INDEX IF NOT EXISTS idx_community_meetups_event_date ON public.community_meetups(event_date);
CREATE INDEX IF NOT EXISTS idx_community_surveys_community_id ON public.community_surveys(community_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_forum_id ON public.forum_topics(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic_id ON public.forum_posts(topic_id);

-- Create triggers to update counters
CREATE OR REPLACE FUNCTION update_meetup_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_meetups 
    SET current_attendees = current_attendees + 1 
    WHERE id = NEW.meetup_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_meetups 
    SET current_attendees = current_attendees - 1 
    WHERE id = OLD.meetup_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meetup_attendee_count_trigger
  AFTER INSERT OR DELETE ON public.meetup_attendees
  FOR EACH ROW EXECUTE FUNCTION update_meetup_attendee_count();

-- Create trigger to update survey response count
CREATE OR REPLACE FUNCTION update_survey_response_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_surveys 
    SET total_responses = (
      SELECT COUNT(DISTINCT user_id) 
      FROM public.survey_responses 
      WHERE survey_id = NEW.survey_id
    )
    WHERE id = NEW.survey_id;
    
    UPDATE public.survey_options 
    SET vote_count = vote_count + 1 
    WHERE id = NEW.option_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_surveys 
    SET total_responses = (
      SELECT COUNT(DISTINCT user_id) 
      FROM public.survey_responses 
      WHERE survey_id = OLD.survey_id
    )
    WHERE id = OLD.survey_id;
    
    UPDATE public.survey_options 
    SET vote_count = vote_count - 1 
    WHERE id = OLD.option_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_survey_response_count_trigger
  AFTER INSERT OR DELETE ON public.survey_responses
  FOR EACH ROW EXECUTE FUNCTION update_survey_response_count();

-- Create trigger to update forum reply count
CREATE OR REPLACE FUNCTION update_forum_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_topics 
    SET reply_count = reply_count + 1,
        last_reply_at = NEW.created_at,
        last_reply_by = NEW.author_id
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_topics 
    SET reply_count = reply_count - 1
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forum_reply_count_trigger
  AFTER INSERT OR DELETE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_forum_reply_count();