export interface AdminStats {
  totalStudents?: number;
  totalLecturers?: number;
  totalCourses?: number;
  totalQuestions?: number;
  coursesCount?: number;
  studentsCount?: number;
  gradedCount?: number;
  pendingGrading?: number;
  myQuestions?: number;
  recentActivity?: {
    recentStudents: any[];
    recentGrades: any[];
  };
}

export interface Student {
  _id: string;
  matricNo: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  level: number;
  createdAt: string;
}

export interface StudentDetails {
  student: Student;
  academicSummary: {
    totalCourses: number;
    completedCourses: number;
    totalCredits: number;
    cgpa: number;
    currentSemester: string;
  };
  courses: Array<{
    _id: string;
    courseCode: string;
    courseTitle: string;
    creditUnits: number;
    grade: string;
    gradePoint: number;
    semester: string;
    lecturer: string;
    status: string;
  }>;
}

export interface GradingCourse {
  courseCode: string;
  courseTitle: string;
  students: Array<{
    _id: string;
    student: Student;
    creditUnits: number;
    grade: string;
    score?: number;
    semester: string;
    status: string;
  }>;
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  courseCode: string;
  courseTitle: string;
  level: number;
  semester: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  tags: string[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFilters {
  courses: string[];
  levels: number[];
}

export interface QuestionStats {
  totalQuestions: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  courseBreakdown: {
    [courseCode: string]: number;
  };
  levelBreakdown: {
    [level: string]: number;
  };
}

// Add these interfaces to the existing file

export interface StudentFilters {
  departments: string[];
  levels: number[];
}

export interface StudentDetails {
  student: Student;
  academicSummary: {
    totalCourses: number;
    completedCourses: number;
    currentCourses: number;
    totalCredits: number;
    cgpa: number;
    currentSemester: string;
  };
  courses: Array<{
    _id: string;
    courseCode: string;
    courseTitle: string;
    creditUnits: number;
    grade: string;
    gradePoint: number;
    semester: string;
    lecturer: string;
    status: string;
  }>;
  recentActivity: any[];
}

export interface StudentStats {
  totalStudents: number;
  departmentBreakdown: {
    [department: string]: number;
  };
  levelBreakdown: {
    [level: string]: number;
  };
  recentRegistrations: number;
}

export interface CreateStudentData {
  matricNo: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  department: string;
  level: number;
  phone?: string;
  address?: string;
}