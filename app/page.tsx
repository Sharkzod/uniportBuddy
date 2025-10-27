import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">UniportBuddy</h1>
                <p className="text-xs text-slate-600 hidden sm:block">University of Port Harcourt</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors text-sm sm:text-base"
              >
                Student Login
              </Link>
              <Link 
                href="/admin/login" 
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors text-sm sm:text-base"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-8">
              <span className="text-2xl font-bold">UB</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              UniportBuddy
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 mb-4">
              University of Port Harcourt
            </p>
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Intelligent Academic Management System
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/login" 
                className="bg-white text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors text-sm sm:text-base shadow-sm"
              >
                Student Login
              </Link>
              <Link 
                href="/admin/login" 
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-colors text-sm sm:text-base"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Academic Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage your academic journey in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Course Registration</h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Easy and intuitive course registration with prerequisite validation and real-time availability checks.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Result Management</h3>
              <p className="text-slate-600 text-sm sm:text-base">
                View results, calculate GPA, generate transcripts instantly, and track your academic progress over time.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">CBT Practice</h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Practice with mock tests, track your performance, and get detailed analytics to improve your scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Student Features</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time grade tracking and GPA calculation
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Interactive course registration system
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Comprehensive academic transcript generation
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Performance analytics and progress tracking
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Admin Features</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Comprehensive student management system
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced grade submission and management
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Course and curriculum administration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Detailed reporting and analytics dashboard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} UniportBuddy - University of Port Harcourt. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Intelligent Academic Management System
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}