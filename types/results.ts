export interface CourseResult {
  _id: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  grade: string;
  gradePoint: number;
  qualityPoints: number;
  lecturer: string;
}

export interface SemesterResults {
  semester: string;
  courses: CourseResult[];
  totalCredits: number;
  totalQualityPoints: number;
  gpa: number;
}

export interface AllResults {
  semesters: SemesterResults[];
  overall: {
    totalCourses: number;
    totalCredits: number;
    cgpa: number;
  };
}

export interface Transcript {
  student: {
    matricNo: string;
    fullName: string;
    email: string;
    department: string;
    currentLevel: number;
    graduationDate: string | null;
  };
  academicSessions: Array<{
    session: string;
    firstSemester: {
      courses: CourseResult[];
      totalCredits: number;
      totalQualityPoints: number;
      gpa: number;
    };
    secondSemester: {
      courses: CourseResult[];
      totalCredits: number;
      totalQualityPoints: number;
      gpa: number;
    };
  }>;
  overall: {
    totalCredits: number;
    cumulativeQualityPoints: number;
    cgpa: number;
    classOfDegree: string;
  };
  generatedAt: string;
}

export interface AcademicProgress {
  gpaTrend: Array<{
    semester: string;
    gpa: number;
    credits: number;
    courses: number;
  }>;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  };
  performanceByCredits: {
    [key: string]: {
      total: number;
      passed: number;
    };
  };
}