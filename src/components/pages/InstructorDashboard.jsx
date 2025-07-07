import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import DashboardStats from '@/components/organisms/DashboardStats'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import PriceEditModal from '@/components/organisms/PriceEditModal'
import { courseService } from '@/services/api/courseService'
import { enrollmentService } from '@/services/api/enrollmentService'

const InstructorDashboard = () => {
const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
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

  const handlePriceUpdate = (updatedCourse) => {
    setCourses(prev => prev.map(course => 
      course.Id === updatedCourse.Id ? updatedCourse : course
    ))
    // Refresh stats to reflect updated earnings
    loadDashboardData()
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
          <Button size="lg" className="inline-flex items-center space-x-2">
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
                  <Button variant="outline" size="sm">
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
                          <Button size="sm" variant="outline">
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
                  <Button variant="outline" className="w-full justify-start">
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Create Course
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
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
    </div>
  )
}

export default InstructorDashboard