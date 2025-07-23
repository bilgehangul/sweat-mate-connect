import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SurveyOption {
  id: string;
  option_text: string;
  vote_count: number;
  display_order: number;
}

interface CommunitySurvey {
  id: string;
  community_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  is_multiple_choice: boolean;
  allows_multiple_answers: boolean;
  is_anonymous: boolean;
  expires_at: string | null;
  is_active: boolean;
  total_responses: number;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  survey_options: SurveyOption[];
  user_responses?: { option_id: string }[];
}

export const useCommunitySurveys = (communityId: string) => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<CommunitySurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (communityId) {
      fetchSurveys();
    }
  }, [communityId]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_surveys')
        .select(`
          *,
          profiles (first_name, last_name, username, avatar_url),
          survey_options (*),
          survey_responses!left (option_id)
        `)
        .eq('community_id', communityId)
        .eq('survey_responses.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const surveysWithResponses = data?.map(survey => ({
        ...survey,
        user_responses: survey.survey_responses || []
      })) || [];

      setSurveys(surveysWithResponses);
    } catch (err: any) {
      console.error('Error fetching surveys:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSurvey = async (surveyData: {
    title: string;
    description?: string;
    options: string[];
    is_multiple_choice?: boolean;
    allows_multiple_answers?: boolean;
    is_anonymous?: boolean;
    expires_at?: string;
  }) => {
    try {
      const { data: survey, error: surveyError } = await supabase
        .from('community_surveys')
        .insert({
          community_id: communityId,
          creator_id: user?.id,
          title: surveyData.title,
          description: surveyData.description,
          is_multiple_choice: surveyData.is_multiple_choice ?? true,
          allows_multiple_answers: surveyData.allows_multiple_answers ?? false,
          is_anonymous: surveyData.is_anonymous ?? false,
          expires_at: surveyData.expires_at
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Create survey options
      const options = surveyData.options.map((option, index) => ({
        survey_id: survey.id,
        option_text: option,
        display_order: index
      }));

      const { error: optionsError } = await supabase
        .from('survey_options')
        .insert(options);

      if (optionsError) throw optionsError;
      await fetchSurveys();
    } catch (err: any) {
      console.error('Error creating survey:', err);
      throw err;
    }
  };

  const respondToSurvey = async (surveyId: string, optionIds: string[]) => {
    try {
      // Remove existing responses if not allowing multiple answers
      const survey = surveys.find(s => s.id === surveyId);
      if (survey && !survey.allows_multiple_answers) {
        await supabase
          .from('survey_responses')
          .delete()
          .eq('survey_id', surveyId)
          .eq('user_id', user?.id);
      }

      // Add new responses
      const responses = optionIds.map(optionId => ({
        survey_id: surveyId,
        user_id: user?.id,
        option_id: optionId
      }));

      const { error } = await supabase
        .from('survey_responses')
        .insert(responses);

      if (error) throw error;
      await fetchSurveys();
    } catch (err: any) {
      console.error('Error responding to survey:', err);
      throw err;
    }
  };

  return {
    surveys,
    loading,
    error,
    createSurvey,
    respondToSurvey,
    refetch: fetchSurveys
  };
};