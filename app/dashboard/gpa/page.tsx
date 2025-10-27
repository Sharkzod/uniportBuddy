'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { gpaApi } from '../../../lib/gpaApi';
import { AcademicSummary, SemesterGPA, CGPA } from '../../../types/gpa';
import { useAuth } from '../../../context/AuthContext';

type ViewMode = 'calculator' | 'transcript';

export default function GPAPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calculator');
  const [academicSummary, setAcademicSummary] = useState<AcademicSummary | null>(null);
  const [semesterGPA, setSemesterGPA] = useState<SemesterGPA | null>(null);
  const [cgpa, setCGPA] = useState<CGPA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [viewMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Always load academic summary
      const summaryResponse = await gpaApi.getAcademicSummary();
      setAcademicSummary(summaryResponse.data);

      if (viewMode === 'calculator') {
        const cgpaResponse = await gpaApi.calculateCGPA();
        setCGPA(cgpaResponse.data);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load academic data');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 4.5) return 'text-emerald-600';
    if (gpa >= 3.5) return 'text-blue-600';
    if (gpa >= 2.5) return 'text-amber-600';
    if (gpa >= 1.5) return 'text-orange-600';
    return 'text-red-600';
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">GPA Calculator & Results</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            View your academic performance and GPA calculations
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

        {/* Quick Stats */}
        {academicSummary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xs border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Current GPA</p>
                  <p className={`text-xl sm:text-2xl font-bold ${getGPAColor(academicSummary.currentGPA)}`}>
                    {academicSummary.currentGPA.toFixed(2)}
                  </p>
                </div>
                <div className="text-xl sm:text-2xl">📊</div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xs border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Cumulative GPA</p>
                  <p className={`text-xl sm:text-2xl font-bold ${getGPAColor(academicSummary.cgpa)}`}>
                    {academicSummary.cgpa.toFixed(2)}
                  </p>
                </div>
                <div className="text-xl sm:text-2xl">⭐</div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xs border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Completed Courses</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{academicSummary.completedCourses}</p>
                </div>
                <div className="text-xl sm:text-2xl">✅</div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xs border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Credits</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{academicSummary.totalCredits}</p>
                </div>
                <div className="text-xl sm:text-2xl">🎓</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setViewMode('calculator')}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                viewMode === 'calculator'
                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              GPA Calculator
            </button>
            <button
              onClick={() => setViewMode('transcript')}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                viewMode === 'transcript'
                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Academic Transcript
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading academic data...</p>
          </div>
        ) : viewMode === 'calculator' ? (
          <GPACalculatorView 
            cgpa={cgpa} 
            getGradeColor={getGradeColor}
            getGPAColor={getGPAColor}
          />
        ) : (
          <TranscriptView academicSummary={academicSummary} />
        )}
      </div>
    </ProtectedRoute>
  );
}

// GPA Calculator View Component
function GPACalculatorView({ 
  cgpa, 
  getGradeColor,
  getGPAColor 
}: { 
  cgpa: CGPA | null;
  getGradeColor: (grade: string) => string;
  getGPAColor: (gpa: number) => string;
}) {
  const [currentSemester, setCurrentSemester] = useState('1-2024');
  const [semesterGPA, setSemesterGPA] = useState<SemesterGPA | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateSemesterGPA = async (semester: string) => {
    try {
      setLoading(true);
      const response = await gpaApi.calculateSemesterGPA(semester);
      setSemesterGPA(response.data);
    } catch (error) {
      console.error('Error calculating semester GPA:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentSemester) {
      calculateSemesterGPA(currentSemester);
    }
  }, [currentSemester]);

  if (!cgpa) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8 text-center">
        <div className="text-5xl sm:text-6xl mb-4">🧮</div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Academic Records</h2>
        <p className="text-gray-600 text-sm sm:text-base">You haven't completed any graded courses yet.</p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
          <p className="text-blue-800 text-xs sm:text-sm">
            <strong>Note:</strong> Grades are assigned by lecturers. Contact your course lecturer if you have questions about your grades.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CGPA Summary */}
      <div className="bg-slate-800 rounded-xl p-6 text-white">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Cumulative GPA (CGPA)</h2>
          <div className="text-4xl sm:text-5xl font-bold mb-2">{cgpa.cgpa.toFixed(2)}</div>
          <p className="text-slate-300 text-sm sm:text-base">
            {cgpa.totalCredits} total credits • {cgpa.totalQualityPoints.toFixed(2)} quality points
          </p>
        </div>
      </div>

      {/* Grading System Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Grading System</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { grade: 'A', points: '5.0', desc: 'Excellent' },
            { grade: 'B', points: '4.0', desc: 'Very Good' },
            { grade: 'C', points: '3.0', desc: 'Good' },
            { grade: 'D', points: '2.0', desc: 'Fair' },
            { grade: 'E', points: '1.0', desc: 'Poor' },
            { grade: 'F', points: '0.0', desc: 'Fail' }
          ].map((item) => (
            <div key={item.grade} className="text-center p-3 border border-slate-200 rounded-lg bg-white">
              <span className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-sm font-medium ${getGradeColor(item.grade)}`}>
                {item.grade}
              </span>
              <p className="text-sm font-medium text-slate-900 mt-1">{item.points} points</p>
              <p className="text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Semester Selector */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Semester GPA</h3>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
          <label className="text-sm font-medium text-gray-700">Select Semester:</label>
          <select
            value={currentSemester}
            onChange={(e) => setCurrentSemester(e.target.value)}
            className="px-3 sm:px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm sm:text-base"
          >
            <option value="1-2024">First Semester 2023/2024</option>
            <option value="2-2024">Second Semester 2023/2024</option>
            <option value="1-2023">First Semester 2022/2023</option>
            <option value="2-2023">Second Semester 2022/2023</option>
          </select>
        </div>

        {/* Semester GPA Results */}
        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Calculating GPA...</p>
          </div>
        ) : semesterGPA ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Semester GPA</p>
                <p className={`text-2xl sm:text-3xl font-bold ${getGPAColor(semesterGPA.gpa)}`}>
                  {semesterGPA.gpa.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{semesterGPA.totalCredits}</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Quality Points</p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{semesterGPA.totalQualityPoints.toFixed(2)}</p>
              </div>
            </div>

            {/* Course Breakdown */}
            {semesterGPA.courses.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Course Results</h4>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">Course</th>
                        <th className="px-3 sm:px-4 py-2 text-center text-xs sm:text-sm font-medium text-gray-700">Credits</th>
                        <th className="px-3 sm:px-4 py-2 text-center text-xs sm:text-sm font-medium text-gray-700">Grade</th>
                        <th className="px-3 sm:px-4 py-2 text-center text-xs sm:text-sm font-medium text-gray-700">Grade Point</th>
                        <th className="px-3 sm:px-4 py-2 text-center text-xs sm:text-sm font-medium text-gray-700">Quality Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {semesterGPA.courses.map((course, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{course.courseCode}</p>
                              <p className="text-xs text-gray-600">{course.courseTitle}</p>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center text-gray-900 text-sm">{course.creditUnits}</td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(course.grade)}`}>
                              {course.grade}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center text-gray-900 text-sm">{course.gradePoint.toFixed(1)}</td>
                          <td className="px-3 sm:px-4 py-3 text-center text-emerald-600 font-medium text-sm">{course.qualityPoints.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-600 text-sm sm:text-base">No graded courses found for the selected semester.</p>
          </div>
        )}
      </div>

      {/* All Semesters Summary */}
      {cgpa.semesters.length > 0 && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Academic History</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {cgpa.semesters.map((semester, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-2">{formatSemester(semester.semester)}</h4>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">GPA:</span>
                    <span className={`font-semibold text-sm sm:text-base ${getGPAColor(semester.gpa)}`}>
                      {semester.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
  <span className="text-xs sm:text-sm text-gray-600">Credits:</span>
  <span className="font-medium text-gray-900 text-sm sm:text-base">{semester.totalCredits}</span>
</div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Courses:</span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{semester.courses.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Transcript View Component
function TranscriptView({ academicSummary }: { academicSummary: AcademicSummary | null }) {
  return (
    <div className="space-y-6">
      {/* Transcript Header */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Academic Transcript</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">University of Port Harcourt</p>
        </div>
        
        {academicSummary && (
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600">Cumulative GPA</p>
              <p className="text-lg sm:text-xl font-bold text-slate-700">{academicSummary.cgpa.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600">Total Credits</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{academicSummary.totalCredits}</p>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600">Completed Courses</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{academicSummary.completedCourses}</p>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600">Current Level</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">200 Level</p>
            </div>
          </div>
        )}
      </div>

      {/* Transcript Content */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8 text-center">
        <div className="text-5xl sm:text-6xl mb-4">📄</div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Official Transcript</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Official transcript generation feature coming soon...</p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
          <h3 className="font-semibold text-amber-800 mb-2 text-sm sm:text-base">Coming Features:</h3>
          <ul className="text-amber-700 text-xs sm:text-sm list-disc list-inside space-y-1">
            <li>Official PDF transcript with university branding</li>
            <li>Complete academic history with all semesters</li>
            <li>Digital signature and verification</li>
            <li>Download and print functionality</li>
            <li>Official grading system and CGPA calculation</li>
          </ul>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-blue-800 text-xs sm:text-sm">
            <strong>Note for Students:</strong> Your transcript will include all completed courses with grades assigned by your lecturers. 
            Contact the examination office for official transcript requests.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to format semester display
function formatSemester(semester: string): string {
  const [sem, year] = semester.split('-');
  const semesterName = sem === '1' ? 'First Semester' : 'Second Semester';
  return `${semesterName} 20${year}`;
}