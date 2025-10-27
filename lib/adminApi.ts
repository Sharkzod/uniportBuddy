import { 
  AdminStats, Student, StudentDetails, GradingCourse, Question, QuestionFilters, QuestionStats,
  StudentFilters, StudentStats, CreateStudentData 
} from '../types/admin';

// Create a separate axios instance for admin API
const adminApiBase = {
  get: async (url: string, params?: any) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}${params ? `?${new URLSearchParams(params)}` : ''}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  post: async (url: string, data?: any) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  put: async (url: string, data?: any) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (url: string) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },
};

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<{ success: boolean; data: { stats: AdminStats; userRole: string } }> => {
    return adminApiBase.get('/admin/dashboard');
  },

  // Student management
  getStudents: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    department?: string;
    level?: string;
    status?: string;
  }): Promise<{ 
    success: boolean; 
    data: { 
      students: Student[]; 
      filters: StudentFilters;
      pagination: any 
    } 
  }> => {
    return adminApiBase.get('/admin/students', params);
  },

  getStudentStats: async (): Promise<{ success: boolean; data: { stats: StudentStats } }> => {
    return adminApiBase.get('/admin/students/stats');
  },

  getStudentDetails: async (studentId: string): Promise<{ success: boolean; data: StudentDetails }> => {
    return adminApiBase.get(`/admin/students/${studentId}`);
  },

  createStudent: async (data: CreateStudentData): Promise<{ success: boolean; message: string; data: { student: Student } }> => {
    return adminApiBase.post('/admin/students', data);
  },

  updateStudent: async (studentId: string, data: Partial<CreateStudentData>): Promise<{ success: boolean; message: string; data: { student: Student } }> => {
    return adminApiBase.put(`/admin/students/${studentId}`, data);
  },

  deleteStudent: async (studentId: string): Promise<{ success: boolean; message: string }> => {
    return adminApiBase.delete(`/admin/students/${studentId}`);
  },

  bulkCreateStudents: async (students: CreateStudentData[]): Promise<{ success: boolean; message: string; data: { students: Student[] } }> => {
    return adminApiBase.post('/admin/students/bulk-create', { students });
  },

  resetStudentPassword: async (studentId: string, newPassword?: string): Promise<{ success: boolean; message: string }> => {
    return adminApiBase.post(`/admin/students/${studentId}/reset-password`, { newPassword });
  },

  // Grade management
  getCoursesForGrading: async (params?: { courseCode?: string; status?: string }): Promise<{ 
    success: boolean; 
    data: { courses: GradingCourse[]; lecturer: string } 
  }> => {
    return adminApiBase.get('/admin/grading/courses', params);
  },

  updateStudentGrade: async (courseId: string, data: { grade: string; score?: number }): Promise<{ 
    success: boolean; 
    message: string; 
    data: { course: any } 
  }> => {
    return adminApiBase.put(`/admin/grades/${courseId}`, data);
  },

  // Question management
  getQuestions: async (params?: { 
    page?: number; 
    limit?: number; 
    courseCode?: string; 
    difficulty?: string; 
    level?: number 
  }): Promise<{ 
    success: boolean; 
    data: { 
      questions: Question[]; 
      filters: QuestionFilters; 
      pagination: any 
    } 
  }> => {
    return adminApiBase.get('/admin/questions', params);
  },

  createQuestion: async (data: any): Promise<{ success: boolean; message: string; data: { question: Question } }> => {
    return adminApiBase.post('/admin/questions', data);
  },

  updateQuestion: async (questionId: string, data: any): Promise<{ success: boolean; message: string; data: { question: Question } }> => {
    return adminApiBase.put(`/admin/questions/${questionId}`, data);
  },

  deleteQuestion: async (questionId: string): Promise<{ success: boolean; message: string }> => {
    return adminApiBase.delete(`/admin/questions/${questionId}`);
  },

  bulkImportQuestions: async (questions: any[]): Promise<{ success: boolean; message: string; data: { questions: Question[] } }> => {
    return adminApiBase.post('/admin/questions/bulk-import', { questions });
  },

  getQuestionStats: async (): Promise<{ success: boolean; data: { stats: QuestionStats } }> => {
    return adminApiBase.get('/admin/questions/stats');
  },
};