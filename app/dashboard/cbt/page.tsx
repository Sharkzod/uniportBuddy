'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { cbtApi } from '../../../lib/cbtApi';
import { PracticeCourse, Question, PracticeSession, PracticeHistory, OverallStats } from '../../../types/cbt';
import { useAuth } from '../../../context/AuthContext';

type ViewMode = 'courses' | 'practice' | 'results' | 'history';

export default function CBTPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('courses');
  const [courses, setCourses] = useState<PracticeCourse[]>([]);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistory[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    loadCourses();
    loadHistory();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await cbtApi.getAvailableCourses();
      setCourses(response.data.courses);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await cbtApi.getPracticeHistory({ limit: 5 });
      setPracticeHistory(response.data.history);
      setOverallStats(response.data.overallStats);
    } catch (err: any) {
      console.error('Failed to load history:', err);
    }
  };

  const startPractice = async (courseCode: string, questionCount: number = 10, difficulty: string = 'all', timeLimit: number = 0) => {
    try {
      setLoading(true);
      setError('');

      const response = await cbtApi.startPracticeSession({
        courseCode,
        questionCount,
        difficulty,
        timeLimit
      });

      setCurrentSession(response.data.session);
      setCurrentQuestions(response.data.questions);
      setViewMode('practice');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start practice session');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <ProtectedRoute>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CBT Practice Platform</h1>
          <p className="text-gray-600 mt-2">
            Practice with mock tests and improve your exam performance
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-500">⚠️</div>
                <p className="ml-3 text-red-700">{error}</p>
              </div>
              <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {overallStats && viewMode === 'courses' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalSessions}</p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Accuracy</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {overallStats.overallAccuracy.toFixed(1)}%
                  </p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions Practiced</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalQuestions}</p>
                </div>
                <div className="text-2xl">❓</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-green-600">
                    {overallStats.averageScore.toFixed(1)}%
                  </p>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {viewMode !== 'practice' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setViewMode('courses')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'courses'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Practice Courses
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'history'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Practice History
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : viewMode === 'courses' ? (
          <CoursesView 
            courses={courses} 
            onStartPractice={startPractice}
            getDifficultyColor={getDifficultyColor}
          />
        ) : viewMode === 'practice' && currentSession ? (
          <PracticeView 
            session={currentSession}
            questions={currentQuestions}
            onComplete={() => {
              setViewMode('results');
              loadHistory();
            }}
            onExit={() => setViewMode('courses')}
          />
        ) : viewMode === 'results' && currentSession ? (
          <ResultsView 
            session={currentSession}
            onBackToCourses={() => setViewMode('courses')}
            onNewPractice={() => setViewMode('courses')}
          />
        ) : (
          <HistoryView 
            history={practiceHistory}
            overallStats={overallStats}
            onStartPractice={startPractice}
            getDifficultyColor={getDifficultyColor}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Courses View Component
function CoursesView({ 
  courses, 
  onStartPractice,
  getDifficultyColor 
}: { 
  courses: PracticeCourse[];
  onStartPractice: (courseCode: string, questionCount: number, difficulty: string, timeLimit: number) => void;
  getDifficultyColor: (difficulty: string) => string;
}) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('all');
  const [timeLimit, setTimeLimit] = useState(0);

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">💻</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Practice Courses Available</h2>
        <p className="text-gray-600">
          Practice questions will be added by your lecturers. Check back later for available courses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.courseCode}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{course.courseCode}</h3>
                <p className="text-gray-600 text-sm">{course.courseTitle}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                {course.questionCount} Qs
              </span>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Easy:</span>
                <span className="text-green-600 font-medium">{course.difficultyBreakdown.easy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Medium:</span>
                <span className="text-yellow-600 font-medium">{course.difficultyBreakdown.medium}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hard:</span>
                <span className="text-red-600 font-medium">{course.difficultyBreakdown.hard}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCourse(course.courseCode);
                const modal = document.getElementById('practice-modal') as HTMLDialogElement;
                modal?.showModal();
              }}
              className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 font-medium transition-colors"
            >
              Start Practice
            </button>
          </div>
        ))}
      </div>

      {/* Practice Settings Modal */}
      <dialog id="practice-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Practice Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={25}>25 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy Only</option>
                <option value="medium">Medium Only</option>
                <option value="hard">Hard Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (Optional)
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>No Time Limit</option>
                <option value={10}>10 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {timeLimit > 0 ? `Timed practice: ${timeLimit} minutes` : 'Untimed practice'}
              </p>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2">Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (selectedCourse) {
                    onStartPractice(selectedCourse, questionCount, difficulty, timeLimit);
                  }
                }}
              >
                Start Practice
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

// Practice View Component
function PracticeView({ 
  session, 
  questions, 
  onComplete,
  onExit 
}: { 
  session: PracticeSession;
  questions: Question[];
  onComplete: () => void;
  onExit: () => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; correctAnswer: number; explanation?: string } | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer for time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === -1) return;

    setIsSubmitting(true);
    try {
      const response = await cbtApi.submitAnswer({
        sessionId: session._id,
        questionId: currentQuestion._id,
        selectedAnswer,
        timeSpent
      });

      setLastResult(response.data);
      setShowExplanation(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(-1);
    setTimeSpent(0);
    setShowExplanation(false);
    setLastResult(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete session
      cbtApi.completeSession(session._id);
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{session.courseCode} Practice</h2>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Time Spent</p>
          <p className="font-mono font-bold text-gray-900">{formatTime(timeSpent)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.question}</h3>
        
        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showExplanation && setSelectedAnswer(index)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAnswer === index
                  ? showExplanation
                    ? index === lastResult?.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-900'
                      : 'bg-red-100 border-red-500 text-red-900'
                    : 'bg-blue-100 border-blue-500 text-blue-900'
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
              } ${showExplanation && index === lastResult?.correctAnswer ? 'bg-green-100 border-green-500 text-green-900' : ''}`}
            >
              <div className="flex items-center">
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && lastResult && (
        <div className={`p-4 rounded-lg mb-6 ${
          lastResult.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            <span className={`text-lg mr-2 ${lastResult.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {lastResult.isCorrect ? '✅' : '❌'}
            </span>
            <span className={`font-medium ${lastResult.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {lastResult.isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          {lastResult.explanation && (
            <p className="text-sm text-gray-700">{lastResult.explanation}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={onExit}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Exit Practice
        </button>

        {!showExplanation ? (
          <button
            onClick={handleAnswerSubmit}
            disabled={selectedAnswer === -1 || isSubmitting}
            className="bg-blue-900 text-white hover:bg-blue-800 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
          </button>
        )}
      </div>
    </div>
  );
}

// Results View Component
function ResultsView({ 
  session, 
  onBackToCourses,
  onNewPractice 
}: { 
  session: PracticeSession;
  onBackToCourses: () => void;
  onNewPractice: () => void;
}) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await cbtApi.getSessionResults(session._id);
      setResults(response.data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Error loading results</p>
      </div>
    );
  }

  const { session: completedSession, analysis } = results;

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Practice Complete!</h2>
        <div className="text-5xl font-bold mb-2">{completedSession.percentage.toFixed(1)}%</div>
        <p className="text-green-100">
          {completedSession.correctAnswers} out of {completedSession.totalQuestions} correct
        </p>
        <p className="text-green-100 text-sm mt-2">
          Time spent: {Math.floor(completedSession.timeSpent / 60)}:{(completedSession.timeSpent % 60).toString().padStart(2, '0')}
        </p>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Easy Questions</p>
            <p className="text-2xl font-bold text-green-600">
              {analysis.difficulty.easy.correct}/{analysis.difficulty.easy.total}
            </p>
            <p className="text-sm text-gray-500">
              {analysis.difficulty.easy.total > 0 
                ? ((analysis.difficulty.easy.correct / analysis.difficulty.easy.total) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Medium Questions</p>
            <p className="text-2xl font-bold text-yellow-600">
              {analysis.difficulty.medium.correct}/{analysis.difficulty.medium.total}
            </p>
            <p className="text-sm text-gray-500">
              {analysis.difficulty.medium.total > 0 
                ? ((analysis.difficulty.medium.correct / analysis.difficulty.medium.total) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Hard Questions</p>
            <p className="text-2xl font-bold text-red-600">
              {analysis.difficulty.hard.correct}/{analysis.difficulty.hard.total}
            </p>
            <p className="text-sm text-gray-500">
              {analysis.difficulty.hard.total > 0 
                ? ((analysis.difficulty.hard.correct / analysis.difficulty.hard.total) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">Average time per question</p>
          <p className="text-lg font-semibold text-gray-900">
            {analysis.averageTimePerQuestion.toFixed(1)} seconds
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4 justify-center">
        <button
          onClick={onBackToCourses}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Back to Courses
        </button>
        <button
          onClick={onNewPractice}
          className="bg-blue-900 text-white hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          New Practice Session
        </button>
      </div>
    </div>
  );
}

// History View Component
function HistoryView({ 
  history, 
  overallStats,
  onStartPractice,
  getDifficultyColor 
}: { 
  history: PracticeHistory[];
  overallStats: OverallStats | null;
  onStartPractice: (courseCode: string, questionCount: number, difficulty: string, timeLimit: number) => void;
  getDifficultyColor: (difficulty: string) => string;
}) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">📈</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Practice History</h2>
        <p className="text-gray-600 mb-6">Start your first practice session to see your progress here.</p>
        <button
          onClick={() => onStartPractice('CSC 101', 10, 'all', 0)}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 font-medium transition-colors"
        >
          Start Your First Practice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Practice Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Course</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Questions</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Score</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Accuracy</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Time</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.map((session) => (
                <tr key={session._id}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{session.courseCode}</p>
                      <p className="text-sm text-gray-500 capitalize">{session.sessionType.replace('_', ' ')}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900">{session.totalQuestions}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-blue-600">{session.correctAnswers}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${
                      session.percentage >= 70 ? 'text-green-600' : 
                      session.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {session.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900">
                    {Math.floor(session.timeSpent / 60)}:{(session.timeSpent % 60).toString().padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500 text-sm">
                    {new Date(session.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall Statistics */}
      {overallStats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalSessions}</p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{overallStats.totalQuestions}</p>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{overallStats.overallAccuracy.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Overall Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.floor(overallStats.totalTimeSpent / 3600)}h {Math.floor((overallStats.totalTimeSpent % 3600) / 60)}m
              </p>
              <p className="text-sm text-gray-600">Total Practice Time</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}