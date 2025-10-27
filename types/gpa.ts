export interface SemesterGPA {
  semester: string;
  totalCredits: number;
  totalQualityPoints: number;
  gpa: number;
  courses: {
    courseCode: string;
    courseTitle: string;
    creditUnits: number;
    grade: string;
    gradePoint: number;
    qualityPoints: number;
  }[];
}

export interface CGPA {
  totalCredits: number;
  totalQualityPoints: number;
  cgpa: number;
  semesters: (SemesterGPA & { courses: any[] })[];
}

export interface AcademicSummary {
  currentGPA: number;
  cgpa: number;
  totalCourses: number;
  completedCourses: number;
  registeredCourses: number;
  totalCredits: number;
}

export interface GPAResponse {
  success: boolean;
  data: SemesterGPA | CGPA | AcademicSummary;
}

// Note: Removed GradeData interface - students can't input grades