import api from './api';
import { SemesterGPA, CGPA, AcademicSummary } from '../types/gpa';

export const gpaApi = {
  // Calculate semester GPA
  calculateSemesterGPA: async (semester: string): Promise<{ success: boolean; data: SemesterGPA }> => {
    const response = await api.get(`/gpa/semester/${semester}`);
    return response.data;
  },

  // Calculate CGPA
  calculateCGPA: async (): Promise<{ success: boolean; data: CGPA }> => {
    const response = await api.get('/gpa/cgpa');
    return response.data;
  },

  // Get academic summary
  getAcademicSummary: async (): Promise<{ success: boolean; data: AcademicSummary }> => {
    const response = await api.get('/gpa/academic-summary');
    return response.data;
  },

  // Note: Removed updateCourseGrade function - students can't update grades
};