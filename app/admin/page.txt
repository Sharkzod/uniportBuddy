'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../lib/adminApi';
import { AdminStats } from '../../types/admin';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && (user.role !== 'admin' && user.role !== 'lecturer')) {
      router.push('/dashboard');
      return;
    }
    
    if (user && (user.role === 'admin' || user.role === 'lecturer')) {
      loadDashboard();
    }
  }, [user, router]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await adminApi.getDashboardStats();
      setStats(response.data.stats);
      setUserRole(response.data.userRole);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user doesn't have access
  if (!user || (user.role !== 'admin' && user.role !== 'lecturer')) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-center">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to {userRole === 'admin' ? 'Admin' : 'Lecturer'} Portal
        </h1>
        <p className="text-gray-600 mt-2">
          {userRole === 'admin' 
            ? 'Manage the entire UniportBuddy system' 
            : 'Manage your courses and student grades'
          }
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-500">⚠️</div>
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Admin Stats */}
          {userRole === 'admin' && (
            <>
              <StatCard
                title="Total Students"
                value={stats.totalStudents || 0}
                icon="👥"
                color="blue"
              />
              <StatCard
                title="Total Lecturers"
                value={stats.totalLecturers || 0}
                icon="👨‍🏫"
                color="green"
              />
              <StatCard
                title="Total Courses"
                value={stats.totalCourses || 0}
                icon="📚"
                color="purple"
              />
              <StatCard
                title="Practice Questions"
                value={stats.totalQuestions || 0}
                icon="❓"
                color="orange"
              />
            </>
          )}

          {/* Lecturer Stats */}
          {userRole === 'lecturer' && (
            <>
              <StatCard
                title="My Courses"
                value={stats.coursesCount || 0}
                icon="📚"
                color="blue"
              />
              <StatCard
                title="Students"
                value={stats.studentsCount || 0}
                icon="👥"
                color="green"
              />
              <StatCard
                title="Graded"
                value={stats.gradedCount || 0}
                icon="✅"
                color="purple"
              />
              <StatCard
                title="Pending Grading"
                value={stats.pendingGrading || 0}
                icon="⏳"
                color="orange"
              />
            </>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userRole === 'admin' && (
            <>
              <ActionCard
                title="Manage Students"
                description="View and manage all student accounts"
                href="/admin/students"
                icon="👥"
              />
              <ActionCard
                title="Question Bank"
                description="Manage CBT practice questions"
                href="/admin/questions"
                icon="❓"
              />
              <ActionCard
                title="System Settings"
                description="Configure system-wide settings"
                href="/admin/settings"
                icon="⚙️"
              />
            </>
          )}

          {userRole === 'lecturer' && (
            <>
              <ActionCard
                title="Grade Management"
                description="Input and manage student grades"
                href="/admin/grading"
                icon="📝"
              />
              <ActionCard
                title="Question Bank"
                description="Create practice questions"
                href="/admin/questions"
                icon="❓"
              />
              <ActionCard
                title="My Courses"
                description="View assigned courses"
                href="/admin/grading"
                icon="📚"
              />
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && userRole === 'admin' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Students</h3>
            <div className="space-y-3">
              {stats.recentActivity.recentStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{student.matricNo}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
            <div className="space-y-3">
              {stats.recentActivity.recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {grade.studentId.firstName} {grade.studentId.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {grade.courseCode} • Grade: {grade.grade}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(grade.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: number; 
  icon: string; 
  color: string; 
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Action Card Component
function ActionCard({ title, description, href, icon }: { 
  title: string; 
  description: string; 
  href: string; 
  icon: string; 
}) {
  return (
    <a
      href={href}
      className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </a>
  );
}