'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { resultsApi } from '../../../lib/resultsApi';
import { AllResults, SemesterResults, Transcript, AcademicProgress } from '../../../types/results';
import { useAuth } from '../../../context/AuthContext';

type ViewMode = 'overview' | 'semester' | 'transcript' | 'progress';

export default function ResultsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [allResults, setAllResults] = useState<AllResults | null>(null);
  const [semesterResults, setSemesterResults] = useState<SemesterResults | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await resultsApi.getAllResults();
      setAllResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const loadSemesterResults = async (semester: string) => {
    try {
      setLoading(true);
      const response = await resultsApi.getSemesterResults(semester);
      setSemesterResults(response.data);
      setViewMode('semester');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load semester results');
    } finally {
      setLoading(false);
    }
  };

  const loadTranscript = async () => {
    try {
      setLoading(true);
      const response = await resultsApi.generateTranscript();
      setTranscript(response.data.transcript);
      setViewMode('transcript');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate transcript');
    } finally {
      setLoading(false);
    }
  };

  const loadAcademicProgress = async () => {
    try {
      setLoading(true);
      const response = await resultsApi.getAcademicProgress();
      setAcademicProgress(response.data);
      setViewMode('progress');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load academic progress');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
  };

  const getGradeColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'B': 'bg-blue-50 text-blue-700 border border-blue-200',
      'C': 'bg-amber-50 text-amber-700 border border-amber-200',
      'D': 'bg-orange-50 text-orange-700 border border-orange-200',
      'E': 'bg-red-50 text-red-700 border border-red-200',
      'F': 'bg-red-100 text-red-800 border border-red-300'
    };
    return colors[grade] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 4.5) return 'text-emerald-600';
    if (gpa >= 3.5) return 'text-blue-600';
    if (gpa >= 2.5) return 'text-amber-600';
    if (gpa >= 1.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Academic Results</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            View your examination results and academic transcript
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-500 text-lg">⚠️</div>
                <p className="ml-3 text-red-700 text-sm sm:text-base">{error}</p>
              </div>
              <button 
                onClick={clearMessages} 
                className="text-red-500 hover:text-red-700 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => {
                setViewMode('overview');
                loadOverview();
              }}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                viewMode === 'overview'
                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Results Overview
            </button>
            <button
              onClick={loadTranscript}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                viewMode === 'transcript'
                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Academic Transcript
            </button>
            <button
              onClick={loadAcademicProgress}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                viewMode === 'progress'
                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Progress Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading academic results...</p>
          </div>
        ) : viewMode === 'overview' ? (
          <ResultsOverview 
            allResults={allResults}
            onViewSemester={loadSemesterResults}
            getGradeColor={getGradeColor}
            getGPAColor={getGPAColor}
          />
        ) : viewMode === 'semester' ? (
          <SemesterResultsView 
            semesterResults={semesterResults}
            onBack={() => setViewMode('overview')}
            getGradeColor={getGradeColor}
          />
        ) : viewMode === 'transcript' ? (
          <TranscriptView 
            transcript={transcript}
            getGradeColor={getGradeColor}
            getGPAColor={getGPAColor}
          />
        ) : (
          <ProgressView 
            academicProgress={academicProgress}
            getGPAColor={getGPAColor}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Results Overview Component
function ResultsOverview({ 
  allResults, 
  onViewSemester,
  getGradeColor,
  getGPAColor 
}: { 
  allResults: AllResults | null;
  onViewSemester: (semester: string) => void;
  getGradeColor: (grade: string) => string;
  getGPAColor: (gpa: number) => string;
}) {
  if (!allResults) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8 text-center">
        <div className="text-5xl sm:text-6xl mb-4">📊</div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Results Available</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          You haven't completed any graded courses yet. Results will appear here once your lecturers upload grades.
        </p>
      </div>
    );
  }

  const { semesters, overall } = allResults;

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="bg-slate-800 rounded-xl p-6 text-white">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Academic Summary</h2>
          <div className="text-4xl sm:text-5xl font-bold mb-2">{overall.cgpa.toFixed(2)}</div>
          <p className="text-slate-300 text-sm sm:text-base">Cumulative GPA (CGPA)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xl sm:text-2xl font-bold">{overall.totalCourses}</p>
              <p className="text-slate-300 text-xs sm:text-sm">Courses Completed</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{overall.totalCredits}</p>
              <p className="text-slate-300 text-xs sm:text-sm">Total Credits</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{calculateClassOfDegree(overall.cgpa)}</p>
              <p className="text-slate-300 text-xs sm:text-sm">Current Class</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semesters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {semesters.map((semester, index) => (
          <div
            key={semester.semester}
            className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6 hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => onViewSemester(semester.semester)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  {formatSemesterDisplay(semester.semester)}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {semester.courses.length} courses • {semester.totalCredits} credits
                </p>
              </div>
              <span className={`text-lg sm:text-xl font-bold ${getGPAColor(semester.gpa)}`}>
                {semester.gpa.toFixed(2)}
              </span>
            </div>

            {/* Top Grades Preview */}
            <div className="space-y-2">
              {semester.courses.slice(0, 3).map((course, courseIndex) => (
                <div key={courseIndex} className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">{course.courseCode}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(course.grade)}`}>
                    {course.grade}
                  </span>
                </div>
              ))}
              {semester.courses.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{semester.courses.length - 3} more courses
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-slate-700 hover:text-slate-900 font-medium text-xs sm:text-sm">
                View Full Results →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Legend */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Grading System</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { grade: 'A', points: '5.0', desc: 'Excellent' },
            { grade: 'B', points: '4.0', desc: 'Very Good' },
            { grade: 'C', points: '3.0', desc: 'Good' },
            { grade: 'D', points: '2.0', desc: 'Fair' },
            { grade: 'E', points: '1.0', desc: 'Poor' },
            { grade: 'F', points: '0.0', desc: 'Fail' }
          ].map((item) => (
            <div key={item.grade} className="text-center p-3 border border-gray-200 rounded-lg">
              <span className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-sm font-medium ${getGradeColor(item.grade)}`}>
                {item.grade}
              </span>
              <p className="text-sm font-medium text-gray-900 mt-1">{item.points} points</p>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Semester Results Component
// Semester Results Component
function SemesterResultsView({ 
  semesterResults, 
  onBack,
  getGradeColor 
}: { 
  semesterResults: SemesterResults | null;
  onBack: () => void;
  getGradeColor: (grade: string) => string;
}) {
  if (!semesterResults) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8 text-center">
        <p className="text-gray-600">No semester results found.</p>
      </div>
    );
  }

  const { semester, courses } = semesterResults;

  // Calculate summary from courses
  const calculateGPA = (courses: any[]): number => {
    if (!courses.length) return 0;
    
    const totalQualityPoints = courses.reduce((sum, course) => sum + (course.qualityPoints || 0), 0);
    const totalCredits = courses.reduce((sum, course) => sum + (course.creditUnits || 0), 0);
    
    return totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
  };

  const summary = {
    gpa: calculateGPA(courses),
    totalCourses: courses.length,
    totalCredits: courses.reduce((sum, course) => sum + course.creditUnits, 0),
    totalQualityPoints: courses.reduce((sum, course) => sum + course.qualityPoints, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-slate-700 hover:text-slate-900 font-medium mb-2 text-sm sm:text-base"
          >
            ← Back to Overview
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatSemesterDisplay(semester)} Results
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Semester GPA</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-700">{summary.gpa.toFixed(2)}</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Course</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Credits</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Grade</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Grade Point</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Quality Points</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Lecturer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course, index) => (
                <tr key={course._id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{course.courseCode}</p>
                      <p className="text-xs text-gray-600">{course.courseTitle}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 text-sm">{course.creditUnits}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 text-sm">{course.gradePoint?.toFixed(1) || '0.0'}</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-medium text-sm">
                    {course.qualityPoints?.toFixed(1) || '0.0'}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 text-xs">
                    {course.lecturer || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Semester Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Semester Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-slate-700">{summary.totalCourses}</p>
            <p className="text-xs sm:text-sm text-slate-600">Courses</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-emerald-600">{summary.totalCredits}</p>
            <p className="text-xs sm:text-sm text-emerald-700">Total Credits</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{summary.totalQualityPoints.toFixed(1)}</p>
            <p className="text-xs sm:text-sm text-purple-700">Quality Points</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-slate-700">{summary.gpa.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-slate-600">Semester GPA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Transcript View Component
function TranscriptView({ 
  transcript, 
  getGradeColor,
  getGPAColor 
}: { 
  transcript: Transcript | null;
  getGradeColor: (grade: string) => string;
  getGPAColor: (gpa: number) => string;
}) {
  if (!transcript) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8 text-center">
        <p className="text-gray-600">No transcript data available.</p>
      </div>
    );
  }

  const { student, academicSessions, overall } = transcript;

  return (
    <div className="space-y-6">
      {/* Transcript Header */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">University of Port Harcourt</h1>
          <p className="text-gray-600 text-base sm:text-lg">Academic Transcript</p>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8 text-gray-900">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Student Information</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p><span className="font-medium">Name:</span> {student.fullName}</p>
              <p><span className="font-medium">Matric No:</span> {student.matricNo}</p>
              <p><span className="font-medium">Department:</span> {student.department}</p>
              <p><span className="font-medium">Level:</span> {student.currentLevel} Level</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Academic Summary</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p><span className="font-medium">Cumulative GPA:</span> {overall.cgpa.toFixed(2)}</p>
              <p><span className="font-medium">Total Credits:</span> {overall.totalCredits}</p>
              <p><span className="font-medium">Class of Degree:</span> {overall.classOfDegree}</p>
              <p><span className="font-medium">Generated:</span> {new Date(transcript.generatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Academic Sessions */}
        {academicSessions.map((session, sessionIndex) => (
          <div key={sessionIndex} className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              Academic Session: {session.session}
            </h3>

            {/* First Semester */}
            {session.firstSemester.courses.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">First Semester</h4>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-left font-medium text-gray-700">Course Code</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-left font-medium text-gray-700">Course Title</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium text-gray-700">Credits</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium text-gray-700">Grade</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium text-gray-700">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {session.firstSemester.courses.map((course, courseIndex) => (
                        <tr key={courseIndex} className='text-gray-900'>
                          <td className="px-3 py-2 sm:px-4 sm:py-2 font-medium">{course.courseCode}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-2">{course.courseTitle}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-2 text-center">{course.creditUnits}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(course.grade)}`}>
                              {course.grade}
                            </span>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-2 text-center">{course.qualityPoints.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50">
                      <tr className='text-gray-900'>
                        <td colSpan={2} className="px-3 py-2 sm:px-4 sm:py-2 font-medium">First Semester Summary</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium">{session.firstSemester.totalCredits}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium">GPA</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium">{session.firstSemester.gpa.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Second Semester */}
            {session.secondSemester.courses.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Second Semester</h4>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-left font-medium text-gray-700">Course Code</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-left font-medium text-gray-700">Course Title</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium text-gray-700">Credits</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium text-gray-700">Grade</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium text-gray-700">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {session.secondSemester.courses.map((course, courseIndex) => (
                        <tr key={courseIndex}>
                          <td className="px-3 py-2 sm:px-4 sm:py-2 font-medium">{course.courseCode}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-2">{course.courseTitle}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-2 text-center">{course.creditUnits}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(course.grade)}`}>
                              {course.grade}
                            </span>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-2 text-center">{course.qualityPoints.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50">
                      <tr>
                        <td colSpan={2} className="px-3 py-2 sm:px-4 sm:py-2 font-medium">Second Semester Summary</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium">{session.secondSemester.totalCredits}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium">GPA</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-2 text-center font-medium">{session.secondSemester.gpa.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Overall Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Cumulative Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-700">{overall.cgpa.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-slate-600">Cumulative GPA</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">{overall.totalCredits}</p>
              <p className="text-xs sm:text-sm text-emerald-700">Total Credits</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{overall.cumulativeQualityPoints.toFixed(1)}</p>
              <p className="text-xs sm:text-sm text-purple-700">Quality Points</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-700">{overall.classOfDegree}</p>
              <p className="text-xs sm:text-sm text-slate-600">Class of Degree</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print/Download Button */}
      <div className="text-center">
        <button
          onClick={() => window.print()}
          className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 font-medium transition-colors text-sm sm:text-base"
        >
          Print Transcript
        </button>
      </div>
    </div>
  );
}

// Progress View Component
function ProgressView({ 
  academicProgress,
  getGPAColor 
}: { 
  academicProgress: AcademicProgress | null;
  getGPAColor: (gpa: number) => string;
}) {
  if (!academicProgress) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8 text-center">
        <p className="text-gray-600">No progress data available.</p>
      </div>
    );
  }

  const { gpaTrend, gradeDistribution, performanceByCredits } = academicProgress;

  return (
    <div className="space-y-6">
      {/* GPA Trend */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">GPA Trend</h3>
        <div className="space-y-3 sm:space-y-4">
          {gpaTrend.map((semester, index) => (
            <div key={index} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">{semester.semester}</h4>
                <p className="text-xs text-gray-600">
                  {semester.courses} courses • {semester.credits} credits
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xl sm:text-2xl font-bold ${getGPAColor(semester.gpa)}`}>
                  {semester.gpa.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">GPA</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="text-center p-3 sm:p-4 border border-gray-200 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs sm:text-sm text-gray-600">Grade {grade}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance by Credit Units */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Performance by Credit Units</h3>
        <div className="space-y-3 sm:space-y-4">
          {Object.entries(performanceByCredits).map(([creditType, data]) => (
            <div key={creditType} className="flex items-center justify-between">
              <span className="font-medium text-gray-700 text-sm sm:text-base">
                {creditType.replace('-', ' ').toUpperCase()} Courses
              </span>
              <div className="text-right">
                <span className="text-xs sm:text-sm text-gray-600">
                  {data.passed}/{data.total} passed
                </span>
                <span className="ml-2 text-xs sm:text-sm font-medium text-emerald-600">
                  ({data.total > 0 ? ((data.passed / data.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to format semester display
function formatSemesterDisplay(semester: string): string {
  const [sem, year] = semester.split('-');
  const semesterName = sem === '1' ? 'First Semester' : 'Second Semester';
  return `${semesterName} 20${year}`;
}

// Helper function to calculate class of degree
function calculateClassOfDegree(cgpa: number): string {
  if (cgpa >= 4.50) return 'First Class';
  if (cgpa >= 3.50) return 'Second Class Upper';
  if (cgpa >= 2.40) return 'Second Class Lower';
  if (cgpa >= 1.50) return 'Third Class';
  return 'Pass';
}