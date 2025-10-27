export interface Course {
  _id: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  semester: number;
  level: number;
  department: string;
  prerequisite: string[];
  lecturer: string;
  capacity: number;
  enrolled: number;
  schedule?: {
    day: string;
    time: string;
    venue: string;
  };
  isActive: boolean;
  isRegistered?: boolean;
  canRegister?: boolean;
}

export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: Course;
  semester: string;
  session: string;
  registeredAt: string;
  status: 'registered' | 'pending' | 'approved' | 'rejected';
}

export interface CourseRegistrationResponse {
  success: boolean;
  data: {
    courses: Course[];
    student: {
      level: number;
      department: string;
      semester: number;
    };
  };
}

export interface MyCoursesResponse {
  success: boolean;
  data: {
    courses: (Course & {
      enrollmentId: string;
      registrationStatus: string;
      registeredAt: string;
    })[];
    totalCredits: number;
    semester: string;
  };
}