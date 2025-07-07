import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import DashboardStats from '@/components/organisms/DashboardStats'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import PriceEditModal from '@/components/organisms/PriceEditModal'
import { courseService } from '@/services/api/courseService'
import { enrollmentService } from '@/services/api/enrollmentService'
import { toast } from 'react-toastify'

const InstructorDashboard = () => {
const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const [selectedCourse, setSelectedCourse] = useState(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCourseForAnalytics, setSelectedCourseForAnalytics] = useState(null)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeStudents: 0,
    completionRate: 0,
    totalEarnings: 0
  })
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get instructor courses (mock instructor ID = 1)
      const allCourses = await courseService.getAll()
      const instructorCourses = allCourses.filter(course => course.instructorId === 1)
      setCourses(instructorCourses)
      
      // Get enrollments for instructor courses
      const allEnrollments = await enrollmentService.getAll()
      const instructorEnrollments = allEnrollments.filter(enrollment =>
        instructorCourses.some(course => course.Id === enrollment.courseId)
      )
      
      // Calculate stats
      const totalCourses = instructorCourses.length
      const activeStudents = instructorEnrollments.length
      const completedEnrollments = instructorEnrollments.filter(e => e.progress >= 100).length
      const completionRate = instructorEnrollments.length > 0 
        ? Math.round((completedEnrollments / instructorEnrollments.length) * 100)
        : 0
      const totalEarnings = instructorCourses.reduce((sum, course) => 
        sum + (course.price * course.enrollmentCount), 0
      )
      
      setStats({
        totalCourses,
        activeStudents,
        completionRate,
        totalEarnings
      })
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
}

  const handleEditPrice = (course) => {
    setSelectedCourse(course)
    setShowPriceModal(true)
  }
const handleViewAnalytics = (course = null) => {
    setSelectedCourseForAnalytics(course)
    setShowAnalyticsModal(true)
  }

const handlePriceUpdate = (updatedCourse) => {
    setCourses(prev => prev.map(course => 
      course.Id === updatedCourse.Id ? updatedCourse : course
    ))
    // Refresh stats to reflect updated earnings
    loadDashboardData()
  }
  const handleCreateCourse = () => {
    setShowCreateModal(true)
  }

  const handleCourseCreate = async (courseData) => {
    try {
      setCreateLoading(true)
      
      // Create course using the service
      const newCourse = await courseService.create(courseData)
      
      if (newCourse) {
        toast.success('Course created successfully!')
        setShowCreateModal(false)
        // Refresh dashboard data to include new course
        loadDashboardData()
      }
    } catch (err) {
      console.error('Error creating course:', err.message)
      toast.error(err.message || 'Failed to create course')
    } finally {
      setCreateLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage your courses and track your teaching success
            </p>
          </div>
<Button 
            size="lg" 
            className="inline-flex items-center space-x-2"
            onClick={handleCreateCourse}
          >
            <ApperIcon name="Plus" size={20} />
            <span>Create New Course</span>
          </Button>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} className="mb-8" />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Courses</span>
<Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCreateCourse}
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Create Course
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <Empty 
                    message="No courses created yet"
                    description="Start sharing your knowledge by creating your first course"
                    actionLabel="Create Your First Course"
                    actionLink="/instructor-dashboard"
                    icon="BookOpen"
                  />
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.Id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {course.category}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ApperIcon name="Users" size={14} className="mr-1" />
                              {course.enrollmentCount} students
                            </div>
                            <div className="flex items-center">
                              <ApperIcon name="Star" size={14} className="mr-1" />
                              {course.rating.toFixed(1)}
                            </div>
                            <div className="flex items-center">
                              <ApperIcon name="DollarSign" size={14} className="mr-1" />
                              ${course.price}
                            </div>
                          </div>
                        </div>
<div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditPrice(course)}
                            title="Edit Price"
                          >
                            <ApperIcon name="DollarSign" size={16} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ApperIcon name="Edit" size={16} />
                          </Button>
<Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewAnalytics(course)}
                            title="View Analytics"
                          >
                            <ApperIcon name="BarChart" size={16} />
                          </Button>
                          <Link to={`/course/${course.Id}`}>
                            <Button size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <ApperIcon name="UserPlus" size={20} className="text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium">New Student Enrolled</p>
                      <p className="text-xs text-gray-600">React Fundamentals - 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <ApperIcon name="CheckCircle" size={20} className="text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Course Completed</p>
                      <p className="text-xs text-gray-600">JavaScript Basics - 1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <ApperIcon name="Star" size={20} className="text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium">5-Star Review</p>
                      <p className="text-xs text-gray-600">Python for Beginners - 3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Teaching Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
<Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleCreateCourse}
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Create Course
                  </Button>
<Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleViewAnalytics(null)}
                  >
                    <ApperIcon name="BarChart" size={16} className="mr-2" />
                    Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                    Student Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ApperIcon name="Calendar" size={16} className="mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Earnings */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      ${stats.totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        $2,450
                      </p>
                      <p className="text-xs text-gray-600">This Month</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        $890
                      </p>
                      <p className="text-xs text-gray-600">This Week</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
</div>
        </div>
      </div>

<PriceEditModal
        course={selectedCourse}
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        onSuccess={handlePriceUpdate}
      />

<CourseCreateModal
        isOpen={showCreateModal}
        loading={createLoading}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCourseCreate}
      />

      <AnalyticsModal
        course={selectedCourseForAnalytics}
        isOpen={showAnalyticsModal}
        loading={analyticsLoading}
        onClose={() => setShowAnalyticsModal(false)}
        courses={courses}
        stats={stats}
      />
    </div>
  )
}

// Course Creation Modal Component
const CourseCreateModal = ({ isOpen, loading, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    Name: '',
    title: '',
    description: '',
    long_description: '',
    instructor_name: '',
    instructor_title: '',
    instructor_bio: '',
    instructor_students: 0,
    instructor_courses: 0,
    price: 0,
    category: '',
    level: '',
    thumbnail: '',
    rating: 5,
    enrollment_count: 0,
    duration: 0
  })

  const [errors, setErrors] = useState({})

  const categories = [
    'Web Development',
    'Data Science', 
    'Design',
    'Business',
    'Photography',
    'Music'
  ]

  const levels = ['beginner', 'intermediate', 'advanced']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.Name.trim()) newErrors.Name = 'Course name is required'
    if (!formData.title.trim()) newErrors.title = 'Course title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.instructor_name.trim()) newErrors.instructor_name = 'Instructor name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.level) newErrors.level = 'Level is required'
    if (formData.price < 0) newErrors.price = 'Price must be 0 or greater'
    if (formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting')
      return
    }

    onSubmit(formData)
  }

  const resetForm = () => {
    setFormData({
      Name: '',
      title: '',
      description: '',
      long_description: '',
      instructor_name: '',
      instructor_title: '',
      instructor_bio: '',
      instructor_students: 0,
      instructor_courses: 0,
      price: 0,
      category: '',
      level: '',
      thumbnail: '',
      rating: 5,
      enrollment_count: 0,
      duration: 0
    })
    setErrors({})
  }

  const handleClose = () => {
    if (!loading) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  value={formData.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  placeholder="Enter course name"
                  className={errors.Name ? 'border-red-500' : ''}
                />
                {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name}</p>}
              </div>

              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter course description"
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="long_description">Detailed Description</Label>
              <textarea
                id="long_description"
                value={formData.long_description}
                onChange={(e) => handleInputChange('long_description', e.target.value)}
                placeholder="Enter detailed course description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Instructor Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Instructor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructor_name">Instructor Name *</Label>
                  <Input
                    id="instructor_name"
                    value={formData.instructor_name}
                    onChange={(e) => handleInputChange('instructor_name', e.target.value)}
                    placeholder="Enter instructor name"
                    className={errors.instructor_name ? 'border-red-500' : ''}
                  />
                  {errors.instructor_name && <p className="text-red-500 text-sm mt-1">{errors.instructor_name}</p>}
                </div>

                <div>
                  <Label htmlFor="instructor_title">Instructor Title</Label>
                  <Input
                    id="instructor_title"
                    value={formData.instructor_title}
                    onChange={(e) => handleInputChange('instructor_title', e.target.value)}
                    placeholder="Enter instructor title"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="instructor_bio">Instructor Bio</Label>
                <textarea
                  id="instructor_bio"
                  value={formData.instructor_bio}
                  onChange={(e) => handleInputChange('instructor_bio', e.target.value)}
                  placeholder="Enter instructor bio"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Course Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.category ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="level">Level *</Label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.level ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select level</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
                </div>

                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="duration">Duration (hours) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 0)}
                    placeholder="Enter duration in hours"
                    className={errors.duration ? 'border-red-500' : ''}
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                </div>

                <div>
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                    placeholder="Enter thumbnail image URL"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  'Create Course'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Analytics Modal Component
const AnalyticsModal = ({ course, isOpen, loading, onClose, courses, stats }) => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      loadAnalyticsData()
    }
  }, [isOpen, course])

  const loadAnalyticsData = async () => {
    try {
      setAnalyticsLoading(true)
      setAnalyticsError(null)

      // Get enrollment data for analytics
      const allEnrollments = await enrollmentService.getAll()
      
      let data = {}

      if (course) {
        // Single course analytics
        const courseEnrollments = allEnrollments.filter(e => e.courseId === course.Id)
        
        data = {
          title: course.title,
          totalStudents: courseEnrollments.length,
          completedStudents: courseEnrollments.filter(e => e.progress >= 100).length,
          averageProgress: courseEnrollments.length > 0 
            ? courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length 
            : 0,
          revenue: course.price * courseEnrollments.length,
          rating: course.rating,
          enrollmentTrend: generateEnrollmentTrend(courseEnrollments),
          progressDistribution: generateProgressDistribution(courseEnrollments)
        }
      } else {
        // Overall instructor analytics
        const instructorEnrollments = allEnrollments.filter(enrollment =>
          courses.some(c => c.Id === enrollment.courseId)
        )

        data = {
          title: 'Overall Performance',
          totalStudents: instructorEnrollments.length,
          completedStudents: instructorEnrollments.filter(e => e.progress >= 100).length,
          averageProgress: instructorEnrollments.length > 0 
            ? instructorEnrollments.reduce((sum, e) => sum + e.progress, 0) / instructorEnrollments.length 
            : 0,
          revenue: stats.totalEarnings,
          totalCourses: courses.length,
          enrollmentTrend: generateEnrollmentTrend(instructorEnrollments),
          progressDistribution: generateProgressDistribution(instructorEnrollments),
          coursePerformance: generateCoursePerformance(courses, instructorEnrollments)
        }
      }

      setAnalyticsData(data)
    } catch (err) {
      setAnalyticsError(err.message || 'Failed to load analytics data')
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const generateEnrollmentTrend = (enrollments) => {
    // Generate monthly enrollment data for the past 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      month,
      enrollments: Math.floor(Math.random() * enrollments.length) + 1
    }))
  }

  const generateProgressDistribution = (enrollments) => {
    const ranges = [
      { range: '0-25%', count: 0 },
      { range: '26-50%', count: 0 },
      { range: '51-75%', count: 0 },
      { range: '76-100%', count: 0 }
    ]

    enrollments.forEach(enrollment => {
      if (enrollment.progress <= 25) ranges[0].count++
      else if (enrollment.progress <= 50) ranges[1].count++
      else if (enrollment.progress <= 75) ranges[2].count++
      else ranges[3].count++
    })

    return ranges
  }

  const generateCoursePerformance = (courses, enrollments) => {
    return courses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.courseId === course.Id)
      return {
        name: course.title,
        students: courseEnrollments.length,
        completion: courseEnrollments.length > 0 
          ? Math.round((courseEnrollments.filter(e => e.progress >= 100).length / courseEnrollments.length) * 100)
          : 0,
        revenue: course.price * courseEnrollments.length
      }
    })
  }

  const handleClose = () => {
    if (!analyticsLoading) {
      setAnalyticsData(null)
      setAnalyticsError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Analytics - {analyticsData?.title || 'Loading...'}
            </h2>
            <button
              onClick={handleClose}
              disabled={analyticsLoading}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          {/* Content */}
          {analyticsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading analytics...</span>
              </div>
            </div>
          ) : analyticsError ? (
            <div className="text-center py-12">
              <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
              <p className="text-gray-600 mb-4">{analyticsError}</p>
              <Button onClick={loadAnalyticsData}>Try Again</Button>
            </div>
          ) : analyticsData ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {analyticsData.totalStudents}
                    </div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.completedStudents}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(analyticsData.averageProgress)}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Progress</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${analyticsData.revenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Enrollment Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-full">
                        {analyticsData.enrollmentTrend.map((item, index) => (
                          <div key={index} className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">{item.month}</span>
                            <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${(item.enrollments / Math.max(...analyticsData.enrollmentTrend.map(i => i.enrollments))) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold">{item.enrollments}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-full space-y-4">
                        {analyticsData.progressDistribution.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 w-16">{item.range}</span>
                            <div className="flex-1 mx-3 bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full ${
                                  index === 0 ? 'bg-red-500' :
                                  index === 1 ? 'bg-yellow-500' :
                                  index === 2 ? 'bg-blue-500' : 'bg-green-500'
                                }`}
                                style={{ 
                                  width: `${analyticsData.totalStudents > 0 ? (item.count / analyticsData.totalStudents) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold w-8">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course Performance (only for overall analytics) */}
              {!course && analyticsData.coursePerformance && (
                <Card>
                  <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Course</th>
                            <th className="text-center py-2">Students</th>
                            <th className="text-center py-2">Completion</th>
                            <th className="text-right py-2">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.coursePerformance.map((course, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{course.name}</td>
                              <td className="text-center py-2">{course.students}</td>
                              <td className="text-center py-2">
                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                  course.completion >= 80 ? 'bg-green-100 text-green-800' :
                                  course.completion >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {course.completion}%
                                </span>
                              </td>
                              <td className="text-right py-2">${course.revenue.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                <Button variant="outline">
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export Report
                </Button>
                <Button onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard