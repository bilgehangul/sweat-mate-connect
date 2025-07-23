import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityMeetup {
  id: string;
  community_id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  location: string;
  address: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  max_attendees: number | null;
  current_attendees: number;
  is_virtual: boolean;
  meeting_link: string | null;
  status: string;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  user_attendance?: {
    status: string;
  } | null;
}

export const useCommunityMeetups = (communityId: string) => {
  const { user } = useAuth();
  const [meetups, setMeetups] = useState<CommunityMeetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (communityId) {
      fetchMeetups();
    }
  }, [communityId]);

  const fetchMeetups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_meetups')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url),
          meetup_attendees!left (status)
        `)
        .eq('community_id', communityId)
        .eq('meetup_attendees.user_id', user?.id)
        .order('event_date', { ascending: true });

      if (error) throw error;
      
      const meetupsWithAttendance = data?.map(meetup => ({
        ...meetup,
        user_attendance: meetup.meetup_attendees?.[0] || null
      })) || [];

      setMeetups(meetupsWithAttendance);
    } catch (err: any) {
      console.error('Error fetching meetups:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMeetup = async (meetupData: {
    title: string;
    description?: string;
    location: string;
    address?: string;
    event_date: string;
    start_time: string;
    end_time?: string;
    max_attendees?: number;
    is_virtual?: boolean;
    meeting_link?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('community_meetups')
        .insert({
          ...meetupData,
          community_id: communityId,
          organizer_id: user?.id
        });

      if (error) throw error;
      await fetchMeetups();
    } catch (err: any) {
      console.error('Error creating meetup:', err);
      throw err;
    }
  };

  const joinMeetup = async (meetupId: string, status: 'attending' | 'maybe' | 'not_attending' = 'attending') => {
    try {
      const { error } = await supabase
        .from('meetup_attendees')
        .upsert({
          meetup_id: meetupId,
          user_id: user?.id,
          status
        });

      if (error) throw error;
      await fetchMeetups();
    } catch (err: any) {
      console.error('Error joining meetup:', err);
      throw err;
    }
  };

  const leaveMeetup = async (meetupId: string) => {
    try {
      const { error } = await supabase
        .from('meetup_attendees')
        .delete()
        .eq('meetup_id', meetupId)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchMeetups();
    } catch (err: any) {
      console.error('Error leaving meetup:', err);
      throw err;
    }
  };

  return {
    meetups,
    loading,
    error,
    createMeetup,
    joinMeetup,
    leaveMeetup,
    refetch: fetchMeetups
  };
};