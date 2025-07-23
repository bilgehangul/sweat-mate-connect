import { useState } from 'react';

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
  const [surveys] = useState<CommunitySurvey[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const createSurvey = async (surveyData: {
    title: string;
    description?: string;
    options: string[];
    is_multiple_choice?: boolean;
    allows_multiple_answers?: boolean;
    is_anonymous?: boolean;
    expires_at?: string;
  }) => {
    throw new Error('Community surveys feature not available yet');
  };

  const respondToSurvey = async (surveyId: string, optionIds: string[]) => {
    throw new Error('Community surveys feature not available yet');
  };

  const refetch = async () => {
    // No-op
  };

  return {
    surveys,
    loading,
    error,
    createSurvey,
    respondToSurvey,
    refetch
  };
};