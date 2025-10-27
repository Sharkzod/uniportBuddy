'use client';

import { useAdminAuth } from '../context/AdminAuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊', roles: ['admin', 'lecturer'] },
  { name: 'Student Management', href: '/admin/students', icon: '👥', roles: ['admin'] },
  { name: 'Grade Management', href: '/admin/grading', icon: '📝', roles: ['lecturer'] },
  { name: 'Question Bank', href: '/admin/questions', icon: '❓', roles: ['admin', 'lecturer'] },
  { name: 'Course Management', href: '/admin/courses', icon: '📚', roles: ['admin'] },
  { name: 'System Settings', href: '/admin/settings', icon: '⚙️', roles: ['admin'] },
];

export default function AdminSidebar() {
  const { adminUser, adminLogout } = useAdminAuth();
  const pathname = usePathname();

  if (!adminUser) {
    return null;
  }

  const filteredNavigation = adminNavigation.filter(item => 
    item.roles.includes(adminUser.role)
  );

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-xl font-bold">UniportBuddy</h1>
        <p className="text-blue-200 text-sm mt-1">
          {adminUser.role === 'admin' ? 'Admin Portal' : 'Lecturer Portal'}
        </p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
            <span className="font-semibold">
              {adminUser?.firstName?.charAt(0)}{adminUser?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {adminUser.firstName} {adminUser.lastName}
            </p>
            <p className="text-xs text-blue-200 capitalize">
              {adminUser.role}
            </p>
            {adminUser.role === 'lecturer' && adminUser.department && (
              <p className="text-xs text-blue-200">
                {adminUser.department}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
        >
          <span>👤</span>
          <span>Student Portal</span>
        </Link>
        <button
          onClick={adminLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-800 hover:text-white transition-colors w-full"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}