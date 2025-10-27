'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { studentCourseApi } from '../../../lib/studentCourseApi';
import { StudentCourse, AddCourseData } from '../../../types/studentCourse';
import { useAuth } from '../../../context/AuthContext';

type ViewMode = 'list' | 'add' | 'edit';

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCourse, setEditingCourse] = useState<StudentCourse | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await studentCourseApi.getMyCourses();
      setCourses(response.data.courses);
      setTotalCredits(response.data.totalCredits);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (courseData: AddCourseData) => {
    try {
      setActionLoading('add');
      setError('');
      setSuccess('');

      const response = await studentCourseApi.addCourse(courseData);
      
      if (response.success) {
        setSuccess('Course added successfully!');
        setViewMode('list');
        await loadCourses();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateCourse = async (courseId: string, updateData: Partial<AddCourseData>) => {
    try {
      setActionLoading(courseId);
      setError('');
      setSuccess('');

      const response = await studentCourseApi.updateCourse(courseId, updateData);
      
      if (response.success) {
        setSuccess('Course updated successfully!');
        setViewMode('list');
        setEditingCourse(null);
        await loadCourses();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCourse = async (courseId: string, courseCode: string) => {
    if (!confirm(`Are you sure you want to delete ${courseCode}?`)) {
      return;
    }

    try {
      setActionLoading(courseId);
      setError('');
      setSuccess('');

      const response = await studentCourseApi.deleteCourse(courseId);
      
      if (response.success) {
        setSuccess('Course deleted successfully!');
        await loadCourses();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setActionLoading(null);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const startEditing = (course: StudentCourse) => {
    setEditingCourse(course);
    setViewMode('edit');
  };

  return (
    <ProtectedRoute>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Registration</h1>
          <p className="text-gray-600 mt-2">
            Manage your course registration for {user?.level} Level
          </p>
        </div>

        {/* Alert Messages */}
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

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-green-500">✅</div>
                <p className="ml-3 text-green-700">{success}</p>
              </div>
              <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === 'list' && (
          <CourseListView
            courses={courses}
            totalCredits={totalCredits}
            loading={loading}
            actionLoading={actionLoading}
            onAddCourse={() => setViewMode('add')}
            onEditCourse={startEditing}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {viewMode === 'add' && (
          <AddCourseView
            loading={actionLoading === 'add'}
            onSave={handleAddCourse}
            onCancel={() => setViewMode('list')}
          />
        )}

        {viewMode === 'edit' && editingCourse && (
          <EditCourseView
            course={editingCourse}
            loading={actionLoading === editingCourse._id}
            onSave={(data) => handleUpdateCourse(editingCourse._id, data)}
            onCancel={() => {
              setViewMode('list');
              setEditingCourse(null);
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Course List View Component
function CourseListView({ 
  courses, 
  totalCredits, 
  loading, 
  actionLoading, 
  onAddCourse, 
  onEditCourse, 
  onDeleteCourse 
}: { 
  courses: StudentCourse[];
  totalCredits: number;
  loading: boolean;
  actionLoading: string | null;
  onAddCourse: () => void;
  onEditCourse: (course: StudentCourse) => void;
  onDeleteCourse: (courseId: string, courseCode: string) => void;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Card */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Registration Summary</h2>
            <p className="text-blue-100">
              {courses.length} courses • {totalCredits} credit units
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Maximum allowed</p>
            <p className="text-2xl font-bold">24 credits</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 bg-blue-500 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${Math.min((totalCredits / 24) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-blue-100 text-sm mt-2">
          {24 - totalCredits} credits remaining
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">My Courses</h3>
          <button
            onClick={onAddCourse}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-medium transition-colors"
          >
            + Add Course
          </button>
        </div>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Courses Added Yet</h2>
          <p className="text-gray-600 mb-6">Start by adding your first course for this semester.</p>
          <button
            onClick={onAddCourse}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 font-medium transition-colors"
          >
            Add Your First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{course.courseCode}</h3>
                  <p className="text-gray-600">{course.courseTitle}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.creditUnits} CU
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lecturer:</span>
                  <span className="text-gray-900">{course.lecturer}</span>
                </div>
                {course.schedule && course.schedule.day && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Schedule:</span>
                      <span className="text-gray-900">{course.schedule.day} {course.schedule.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Venue:</span>
                      <span className="text-gray-900">{course.schedule.venue}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    course.status === 'registered' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {course.status}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEditCourse(course)}
                  disabled={actionLoading === course._id}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {actionLoading === course._id ? 'Loading...' : 'Edit'}
                </button>
                <button
                  onClick={() => onDeleteCourse(course._id, course.courseCode)}
                  disabled={actionLoading === course._id}
                  className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {actionLoading === course._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add Course View Component
function AddCourseView({ 
  loading, 
  onSave, 
  onCancel 
}: { 
  loading: boolean;
  onSave: (data: AddCourseData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<AddCourseData>({
    courseCode: '',
    courseTitle: '',
    creditUnits: 3,
    lecturer: '',
    schedule: {
      day: '',
      time: '',
      venue: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.courseCode.trim() || !formData.courseTitle.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('schedule.')) {
      const scheduleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule!,
          [scheduleField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'creditUnits' ? parseInt(value) : value
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Course</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 placeholder-gray-500 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Course Code */}
          <div className=''>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-2">
              Course Code *
            </label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              required
              value={formData.courseCode}
              onChange={handleChange}
              placeholder="e.g., CSC 201"
              className="w-full  px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Course Title */}
          <div>
            <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              id="courseTitle"
              name="courseTitle"
              required
              value={formData.courseTitle}
              onChange={handleChange}
              placeholder="e.g., Data Structures and Algorithms"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Credit Units */}
          <div>
            <label htmlFor="creditUnits" className="block text-sm font-medium text-gray-700 mb-2">
              Credit Units *
            </label>
            <select
              id="creditUnits"
              name="creditUnits"
              required
              value={formData.creditUnits}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value={1}>1 Credit Unit</option>
              <option value={2}>2 Credit Units</option>
              <option value={3}>3 Credit Units</option>
              <option value={4}>4 Credit Units</option>
              <option value={5}>5 Credit Units</option>
              <option value={6}>6 Credit Units</option>
            </select>
          </div>
        </div>
          {/* Lecturer */}
            
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
            {loading ? 'Adding Course...' : 'Add Course'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Edit Course View Component (similar to AddCourseView but with existing data)
function EditCourseView({ 
  course, 
  loading, 
  onSave, 
  onCancel 
}: { 
  course: StudentCourse;
  loading: boolean;
  onSave: (data: Partial<AddCourseData>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<AddCourseData>>({
    courseCode: course.courseCode,
    courseTitle: course.courseTitle,
    creditUnits: course.creditUnits,
    lecturer: course.lecturer,
    schedule: course.schedule || {
      day: '',
      time: '',
      venue: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseCode?.trim() || !formData.courseTitle?.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('schedule.')) {
      const scheduleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule!,
          [scheduleField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'creditUnits' ? parseInt(value) : value
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Course: {course.courseCode}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Code */}
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-2">
              Course Code *
            </label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              required
              value={formData.courseCode}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Course Title */}
          <div>
            <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              id="courseTitle"
              name="courseTitle"
              required
              value={formData.courseTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Credit Units */}
          <div>
            <label htmlFor="creditUnits" className="block text-sm font-medium text-gray-700 mb-2">
              Credit Units *
            </label>
            <select
              id="creditUnits"
              name="creditUnits"
              required
              value={formData.creditUnits}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value={1}>1 Credit Unit</option>
              <option value={2}>2 Credit Units</option>
              <option value={3}>3 Credit Units</option>
              <option value={4}>4 Credit Units</option>
              <option value={5}>5 Credit Units</option>
              <option value={6}>6 Credit Units</option>
            </select>
          </div>

          {/* Lecturer */}
          <div>
            <label htmlFor="lecturer" className="block text-sm font-medium text-gray-700 mb-2">
              Lecturer
            </label>
            <input
              type="text"
              id="lecturer"
              name="lecturer"
              value={formData.lecturer}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Schedule - Day */}
          <div>
            <label htmlFor="schedule.day" className="block text-sm font-medium text-gray-700 mb-2">
              Day
            </label>
            <select
              id="schedule.day"
              name="schedule.day"
              value={formData.schedule?.day || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Select day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          {/* Schedule - Time */}
          <div>
            <label htmlFor="schedule.time" className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="text"
              id="schedule.time"
              name="schedule.time"
              value={formData.schedule?.time || ''}
              onChange={handleChange}
              placeholder="e.g., 10:00 - 12:00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Schedule - Venue */}
          <div className="md:col-span-2">
            <label htmlFor="schedule.venue" className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              id="schedule.venue"
              name="schedule.venue"
              value={formData.schedule?.venue || ''}
              onChange={handleChange}
              placeholder="e.g., LT1, Room 101"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
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
            {loading ? 'Updating Course...' : 'Update Course'}
          </button>
        </div>
      </form>
    </div>
  );
}