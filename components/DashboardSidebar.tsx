'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Course Registration', href: '/dashboard/courses', icon: '📚' },
  { name: 'Results', href: '/dashboard/results', icon: '📈' },
  { name: 'GPA Calculator', href: '/dashboard/gpa', icon: '🧮' },
  { name: 'CBT Practice', href: '/dashboard/cbt', icon: '💻' },
  { name: 'Transcript', href: '/dashboard/transcript', icon: '📄' },
  { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
];

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-800 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-bold">UniportBuddy</h1>
            <span className="text-xs text-slate-300 hidden sm:inline">Student Portal</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed  z-40 mt-16"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 sm:w-80 lg:w-64
          bg-slate-800 text-white
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          mt-16 lg:mt-0
        `}
      >
        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">UniportBuddy</h1>
          <p className="text-slate-300 text-sm mt-1">Student Portal</p>
        </div>

        {/* User Info */}
        <div className="p-4 sm:p-5 lg:p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-12 lg:h-12 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-semibold text-sm sm:text-base lg:text-sm">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base lg:text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs sm:text-sm lg:text-xs text-slate-300 truncate">
                {user?.matricNo}
              </p>
              <p className="text-xs sm:text-sm lg:text-xs text-slate-300">
                Level {user?.level}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 sm:p-5 lg:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-3 sm:px-4 lg:px-3 py-3 sm:py-3.5 lg:py-2.5 rounded-lg text-sm sm:text-base lg:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-200 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="text-lg sm:text-xl lg:text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 sm:p-5 lg:p-4 border-t border-slate-700">
          <button
            onClick={() => {
              logout();
              closeMobileMenu();
            }}
            className="flex items-center space-x-3 px-3 sm:px-4 lg:px-3 py-3 sm:py-3.5 lg:py-2.5 rounded-lg text-sm sm:text-base lg:text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors w-full"
          >
            <span className="text-lg sm:text-xl lg:text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}