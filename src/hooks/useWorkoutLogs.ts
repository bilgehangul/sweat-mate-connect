import { useState } from 'react';

export interface WorkoutLog {
  id: string;
  user_id: string;
  session_id?: string;
  workout_type: string;
  duration_minutes?: number;
  calories_burned?: number;
  notes?: string;
  difficulty_rating?: number;
  satisfaction_rating?: number;
  workout_date: string;
  created_at: string;
  session?: {
    title: string;
    gym_location: string;
  };
}

export const useWorkoutLogs = () => {
  const [logs] = useState<WorkoutLog[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const createWorkoutLog = async (logData: {
    session_id?: string;
    workout_type: string;
    duration_minutes?: number;
    calories_burned?: number;
    notes?: string;
    difficulty_rating?: number;
    satisfaction_rating?: number;
    workout_date: string;
  }) => {
    throw new Error('Workout logs feature not available yet');
  };

  const updateWorkoutLog = async (logId: string, updates: Partial<WorkoutLog>) => {
    throw new Error('Workout logs feature not available yet');
  };

  const deleteWorkoutLog = async (logId: string) => {
    throw new Error('Workout logs feature not available yet');
  };

  const getWorkoutStats = async (startDate: string, endDate: string) => {
    return {
      totalWorkouts: 0,
      totalMinutes: 0,
      totalCalories: 0,
      averageRating: 0
    };
  };

  const refetch = async () => {
    // No-op
  };

  return {
    logs,
    loading,
    error,
    createWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
    getWorkoutStats,
    refetch
  };
};