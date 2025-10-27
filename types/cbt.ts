export interface Question {
  _id: string;
  question: string;
  options: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  courseCode: string;
  courseTitle: string;
  explanation?: string;
}

export interface PracticeCourse {
  courseCode: string;
  courseTitle: string;
  questionCount: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface PracticeSession {
  _id: string;
  courseCode: string;
  sessionType: 'practice' | 'mock_exam' | 'quick_quiz';
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  percentage: number;
  timeLimit: number;
  timeSpent: number;
  startedAt: string;
  completedAt?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: Array<{
    questionId: Question;
    selectedAnswer: number;
    isCorrect?: boolean;
    timeSpent?: number;
  }>;
}

export interface SessionAnalysis {
  difficulty: {
    easy: { total: number; correct: number };
    medium: { total: number; correct: number };
    hard: { total: number; correct: number };
  };
  accuracyByDifficulty: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
  averageTimePerQuestion: number;
}

export interface PracticeHistory {
  _id: string;
  courseCode: string;
  sessionType: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
}

export interface OverallStats {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  averageScore: number;
  totalTimeSpent: number;
  overallAccuracy: number;
}