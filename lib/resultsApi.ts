import api from './api';
import { AllResults, SemesterResults, Transcript, AcademicProgress } from '../types/results';

export const resultsApi = {
  // Get all results
  getAllResults: async (): Promise<{ success: boolean; data: AllResults }> => {
    const response = await api.get('/results/all');
    return response.data;
  },

  // Get semester results
  getSemesterResults: async (semester: string): Promise<{ success: boolean; data: SemesterResults }> => {
    const response = await api.get(`/results/semester/${semester}`);
    return response.data;
  },

  // Generate transcript
  generateTranscript: async (): Promise<{ success: boolean; data: { transcript: Transcript } }> => {
    const response = await api.get('/results/transcript');
    return response.data;
  },

  // Get academic progress data
  getAcademicProgress: async (): Promise<{ success: boolean; data: AcademicProgress }> => {
    const response = await api.get('/results/progress');
    return response.data;
  },
};