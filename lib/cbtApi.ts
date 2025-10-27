import api from './api';
import { PracticeCourse, Question, PracticeSession, SessionAnalysis, PracticeHistory, OverallStats } from '../types/cbt';

export const cbtApi = {
  // Get available courses for practice
  getAvailableCourses: async (): Promise<{ success: boolean; data: { courses: PracticeCourse[]; studentLevel: number } }> => {
    const response = await api.get('/cbt/courses');
    return response.data;
  },

  // Start a new practice session
  startPracticeSession: async (data: {
    courseCode: string;
    questionCount?: number;
    difficulty?: string;
    timeLimit?: number;
  }): Promise<{ success: boolean; data: { session: PracticeSession; questions: Question[] } }> => {
    const response = await api.post('/cbt/session/start', data);
    return response.data;
  },

  // Submit an answer
  submitAnswer: async (data: {
    sessionId: string;
    questionId: string;
    selectedAnswer: number;
    timeSpent?: number;
  }): Promise<{ success: boolean; data: { isCorrect: boolean; correctAnswer: number; explanation?: string; completedQuestions: number; correctAnswers: number; percentage: number } }> => {
    const response = await api.post('/cbt/session/answer', data);
    return response.data;
  },

  // Complete a session
  completeSession: async (sessionId: string): Promise<{ success: boolean; data: { session: PracticeSession } }> => {
    const response = await api.post(`/cbt/session/complete/${sessionId}`);
    return response.data;
  },

  // Get session results
  getSessionResults: async (sessionId: string): Promise<{ success: boolean; data: { session: PracticeSession; analysis: SessionAnalysis } }> => {
    const response = await api.get(`/cbt/session/results/${sessionId}`);
    return response.data;
  },

  // Get practice history
  getPracticeHistory: async (params?: { courseCode?: string; limit?: number }): Promise<{ success: boolean; data: { history: PracticeHistory[]; overallStats: OverallStats } }> => {
    const response = await api.get('/cbt/history', { params });
    return response.data;
  },
};