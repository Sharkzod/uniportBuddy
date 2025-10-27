'use client';

import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Course Registration',
      description: 'Register for your courses this semester',
      href: '/dashboard/courses',
      icon: '📚',
      color: 'bg-slate-700'
    },
    {
      title: 'Check Results',
      description: 'View your latest examination results',
      href: '/dashboard/results',
      icon: '📈',
      color: 'bg-emerald-700'
    },
    {
      title: 'GPA Calculator',
      description: 'Calculate your GPA and CGPA',
      href: '/dashboard/gpa',
      icon: '🧮',
      color: 'bg-indigo-700'
    },
    {
      title: 'CBT Practice',
      description: 'Practice with mock tests',
      href: '/dashboard/cbt',
      icon: '💻',
      color: 'bg-amber-700'
    },
  ];

  const academicSummary = {
    currentGPA: 4.2,
    currentCGPA: 4.0,
    registeredCourses: 8,
    pendingResults: 2,
    nextSemester: 'First Semester 2024/2025'
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Here's your academic overview for {academicSummary.nextSemester}
            </p>
          </div>

          {/* Academic Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Current GPA</p>
                  <div className="text-lg sm:text-xl lg:text-2xl">⭐</div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{academicSummary.currentGPA}</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Current CGPA</p>
                  <div className="text-lg sm:text-xl lg:text-2xl">📊</div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{academicSummary.currentCGPA}</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Registered</p>
                  <div className="text-lg sm:text-xl lg:text-2xl">📚</div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{academicSummary.registeredCourses}</p>
                <p className="text-xs text-gray-500 mt-1">Courses</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                  <div className="text-lg sm:text-xl lg:text-2xl">⏳</div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{academicSummary.pendingResults}</p>
                <p className="text-xs text-gray-500 mt-1">Results</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="group bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl flex-shrink-0 ${action.color} group-hover:scale-105 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 group-hover:text-gray-700 transition-colors">{action.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Notifications</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Course Registration</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Course registration for First Semester 2024/2025 is now open until December 15th.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 bg-emerald-50 rounded-lg border border-emerald-100 hover:border-emerald-200 transition-colors">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Results Available</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Second Semester 2023/2024 results have been released.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 bg-amber-50 rounded-lg border border-amber-100 hover:border-amber-200 transition-colors">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">CBT Practice</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    New practice tests available for CSC 201 - Introduction to Programming.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}