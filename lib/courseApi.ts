import api from './api';
import { Course, CourseRegistrationResponse, MyCoursesResponse, Enrollment } from '../types/course';

export const courseApi = {
  // Get available courses for registration
  getAvailableCourses: async (): Promise<CourseRegistrationResponse> => {
    const response = await api.get('/courses/available');
    return response.data;
  },

  // Get student's registered courses
  getMyCourses: async (): Promise<MyCoursesResponse> => {
    const response = await api.get('/courses/my-courses');
    return response.data;
  },

  // Register for a course
  registerCourse: async (courseId: string): Promise<{ success: boolean; message: string; data?: { enrollment: Enrollment } }> => {
    const response = await api.post('/courses/register', { courseId });
    return response.data;
  },

  // Drop a course
  dropCourse: async (enrollmentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/courses/drop/${enrollmentId}`);
    return response.data;
  },
};