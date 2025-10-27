import api from './api';
import { StudentCourse, AddCourseData, StudentCoursesResponse, RegistrationSummary } from '../types/studentCourse';

export const studentCourseApi = {
  // Add a new course
  addCourse: async (courseData: AddCourseData): Promise<{ success: boolean; message: string; data?: { course: StudentCourse } }> => {
    const response = await api.post('/student-courses/add', courseData);
    return response.data;
  },

  // Get student's courses
  getMyCourses: async (): Promise<StudentCoursesResponse> => {
    const response = await api.get('/student-courses/my-courses');
    return response.data;
  },

  // Update a course
  updateCourse: async (courseId: string, updateData: Partial<AddCourseData>): Promise<{ success: boolean; message: string; data?: { course: StudentCourse } }> => {
    const response = await api.put(`/student-courses/update/${courseId}`, updateData);
    return response.data;
  },

  // Delete a course
  deleteCourse: async (courseId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/student-courses/delete/${courseId}`);
    return response.data;
  },

  // Get registration summary
  getRegistrationSummary: async (): Promise<RegistrationSummary> => {
    const response = await api.get('/student-courses/summary');
    return response.data;
  },
};