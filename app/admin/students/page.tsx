'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';
import { Student, StudentFilters, StudentStats } from '../../../types/admin';
import Link from 'next/link';

type ViewMode = 'list' | 'create' | 'bulk' | 'stats';

export default function StudentManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [students, setStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState<StudentFilters>({ departments: [], levels: [] });
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNext: false,
    hasPrev: false
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadStudents();
    loadStats();
  }, [currentPage, searchTerm, selectedDepartment, selectedLevel]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const params: any = {
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        department: selectedDepartment || undefined,
        level: selectedLevel || undefined
      };

      const response = await adminApi.getStudents(params);
      setStudents(response.data.students);
      setFilters(response.data.filters);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminApi.getStudentStats();
      setStats(response.data.stats);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadStudents();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    loadStudents();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedLevel('');
    setCurrentPage(1);
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteStudent(studentId);
      setError('');
      loadStudents(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete student');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600 mt-2">
          Manage all student accounts and academic records
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
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {stats && viewMode === 'list' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Registrations</p>
                <p className="text-2xl font-bold text-blue-600">{stats.recentRegistrations}</p>
              </div>
              <div className="text-2xl">🆕</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-green-600">{Object.keys(stats.departmentBreakdown).length}</p>
              </div>
              <div className="text-2xl">🏫</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Levels</p>
                <p className="text-2xl font-bold text-purple-600">{Object.keys(stats.levelBreakdown).length}</p>
              </div>
              <div className="text-2xl">🎓</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Students List
          </button>
          <button
            onClick={() => setViewMode('create')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'create'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Add Student
          </button>
          <button
            onClick={() => setViewMode('bulk')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'bulk'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bulk Import
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'stats'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' && (
        <StudentListView
          students={students}
          filters={filters}
          loading={loading}
          pagination={pagination}
          searchTerm={searchTerm}
          selectedDepartment={selectedDepartment}
          selectedLevel={selectedLevel}
          onSearch={handleSearch}
          onSearchChange={setSearchTerm}
          onDepartmentChange={(dept) => {
            setSelectedDepartment(dept);
            handleFilterChange();
          }}
          onLevelChange={(level) => {
            setSelectedLevel(level);
            handleFilterChange();
          }}
          onClearFilters={clearFilters}
          onPageChange={setCurrentPage}
          onDeleteStudent={handleDeleteStudent}
        />
      )}

      {viewMode === 'create' && (
        <CreateStudentView
          onCancel={() => setViewMode('list')}
          onSuccess={() => {
            setViewMode('list');
            loadStudents();
            loadStats();
          }}
        />
      )}

      {viewMode === 'bulk' && (
        <BulkImportView
          onCancel={() => setViewMode('list')}
          onSuccess={() => {
            setViewMode('list');
            loadStudents();
            loadStats();
          }}
        />
      )}

      {viewMode === 'stats' && (
        <StatisticsView stats={stats} filters={filters} />
      )}
    </div>
  );
}

// Student List View Component
function StudentListView({
  students,
  filters,
  loading,
  pagination,
  searchTerm,
  selectedDepartment,
  selectedLevel,
  onSearch,
  onSearchChange,
  onDepartmentChange,
  onLevelChange,
  onClearFilters,
  onPageChange,
  onDeleteStudent
}: {
  students: Student[];
  filters: StudentFilters;
  loading: boolean;
  pagination: any;
  searchTerm: string;
  selectedDepartment: string;
  selectedLevel: string;
  onSearch: (e: React.FormEvent) => void;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onDeleteStudent: (studentId: string, studentName: string) => void;
}) {
  const hasActiveFilters = searchTerm || selectedDepartment || selectedLevel;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={onSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, matric number, or email..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-medium transition-colors"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {filters.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => onLevelChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                {filters.levels.map((level) => (
                  <option key={level} value={level}>
                    {level} Level
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {students.length} of {pagination.totalStudents} students
        </p>
        <div className="text-sm text-gray-500">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h2>
          <p className="text-gray-600">
            {hasActiveFilters 
              ? 'Try adjusting your search criteria or filters.'
              : 'No students have been registered yet.'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Matric No</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Level</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Joined</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-mono">{student.matricNo}</td>
                  <td className="px-6 py-4 text-gray-900">{student.department}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.level} Level
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/students/${student._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => onDeleteStudent(student._id, `${student.firstName} ${student.lastName}`)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Create Student View Component
function CreateStudentView({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    matricNo: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
    level: 100,
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminApi.createStudent(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Student</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matric Number */}
          <div>
            <label htmlFor="matricNo" className="block text-sm font-medium text-gray-700 mb-2">
              Matriculation Number *
            </label>
            <input
              type="text"
              id="matricNo"
              name="matricNo"
              required
              value={formData.matricNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., U2021/1234567"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="student@uniport.edu.ng"
            />
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <input
              type="text"
              id="department"
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Computer Science"
            />
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              Level *
            </label>
            <select
              id="level"
              name="level"
              required
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={100}>100 Level</option>
              <option value={200}>200 Level</option>
              <option value={300}>300 Level</option>
              <option value={400}>400 Level</option>
              <option value={500}>500 Level</option>
              <option value={600}>600 Level</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave blank for default password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default password: password123
            </p>
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-900 text-white hover:bg-blue-800 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Student...' : 'Create Student'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Bulk Import View Component
function BulkImportView({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvData.trim()) {
      setError('Please paste CSV data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const students = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const student: any = {};
        headers.forEach((header, index) => {
          student[header] = values[index];
        });
        
        // Convert level to number
        if (student.level) {
          student.level = parseInt(student.level);
        }
        
        return student;
      }).filter(student => student.matricNo && student.email); // Filter out empty rows

      const response = await adminApi.bulkCreateStudents(students);
      setResults(response.data);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to import students');
      if (err.response?.data?.data?.errors) {
        setError(err.response.data.data.errors.join(', '));
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `matricNo,email,firstName,lastName,department,level,phone,address
U2021/1234567,student1@uniport.edu.ng,John,Doe,Computer Science,100,08012345678,Student Hostel
U2021/1234568,student2@uniport.edu.ng,Jane,Smith,Mathematics,200,08012345679,Off-campus`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Bulk Import Students</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {results && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">
            Successfully imported {results.students.length} students!
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Import Instructions</h3>
          <ul className="text-blue-800 text-sm list-disc list-inside space-y-1">
            <li>Prepare your data in CSV format with the following columns: matricNo, email, firstName, lastName, department, level, phone, address</li>
            <li>Required fields: matricNo, email, firstName, lastName, department, level</li>
            <li>Level must be a number between 100 and 600</li>
            <li>Passwords will be set to "password123" by default</li>
            <li>Download the template below to get started</li>
          </ul>
          <button
            type="button"
            onClick={downloadTemplate}
            className="mt-3 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium"
          >
            Download CSV Template
          </button>
        </div>

        {/* CSV Input */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="csvData" className="block text-sm font-medium text-gray-700 mb-2">
              Paste CSV Data
            </label>
            <textarea
              id="csvData"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Paste your CSV data here..."
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-900 text-white hover:bg-blue-800 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Importing Students...' : 'Import Students'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Statistics View Component
function StatisticsView({ stats, filters }: { stats: StudentStats | null; filters: StudentFilters }) {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No statistics available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Department Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Students by Department</h3>
        <div className="space-y-3">
          {Object.entries(stats.departmentBreakdown)
            .sort(([,a], [,b]) => b - a)
            .map(([department, count]) => (
              <div key={department} className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{department}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(count / stats.totalStudents) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Level Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Students by Level</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(stats.levelBreakdown)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([level, count]) => (
              <div key={level} className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-sm text-gray-600">{level} Level Students</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}