export interface StudentCourse {
  _id: string;
  studentId: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  semester: string;
  session: string;
  lecturer: string;
  schedule?: {
    day: string;
    time: string;
    venue: string;
  };
  grade: string;
  status: 'registered' | 'completed' | 'dropped';
  addedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddCourseData {
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  lecturer?: string;
  schedule?: {
    day: string;
    time: string;
    venue: string;
  };
}

export interface StudentCoursesResponse {
  success: boolean;
  data: {
    courses: StudentCourse[];
    totalCredits: number;
    semester: string;
  };
}

export interface RegistrationSummary {
  success: boolean;
  data: {
    totalCredits: number;
    registeredCount: number;
    maxCredits: number;
    courses: StudentCourse[];
  };
}