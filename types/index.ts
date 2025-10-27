export interface User {
  _id: string;
  matricNo: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin' | 'lecturer';
  department: string;
  level: number;
  createdAt: string;
}

export interface LoginData {
  matricNo: string;
  password: string;
}

export interface RegisterData {
  matricNo: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  level: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}