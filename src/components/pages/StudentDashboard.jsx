import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ProgressBar from '@/components/molecules/ProgressBar'
import ProgressRing from '@/components/molecules/ProgressRing'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { enrollmentService } from '@/services/api/enrollmentService'
import { courseService } from '@/services/api/courseService'

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgress: 0,
    totalHours: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get student enrollments (using mock student ID = 1)
      const enrollmentsData = await enrollmentService.getByStudentId(1)
      setEnrollments(enrollmentsData)
      
      // Get course details for each enrollment
      const coursesData = await Promise.all(
        enrollmentsData.map(enrollment => 
          courseService.getById(enrollment.courseId)
        )
      )
      setCourses(coursesData)
      
      // Calculate stats
      const totalCourses = enrollmentsData.length
      const completedCourses = enrollmentsData.filter(e => e.progress >= 100).length
      const inProgress = enrollmentsData.filter(e => e.progress > 0 && e.progress < 100).length
      const totalHours = coursesData.reduce((sum, course) => sum + (course.duration || 0), 0)
      
      setStats({
        totalCourses,
        completedCourses,
        inProgress,
        totalHours
      })
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Learning Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your progress and continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalCourses}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="BookOpen" size={24} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-success">{stats.completedCourses}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" size={24} className="text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-warning">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" size={24} className="text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Learning Hours</p>
                  <p className="text-2xl font-bold text-secondary">{stats.totalHours}h</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} className="text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Courses</span>
                  <Link to="/catalog">
                    <Button variant="outline" size="sm">
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Find More Courses
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <Empty 
                    message="No courses enrolled yet"
                    description="Start your learning journey by enrolling in a course"
                    actionLabel="Browse Courses"
                    actionLink="/catalog"
                  />
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment, index) => {
                      const course = courses[index]
                      if (!course) return null
                      
                      return (
                        <div key={enrollment.Id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
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
                              {course.instructorName}
                            </p>
                            <ProgressBar 
                              progress={enrollment.progress} 
                              size="sm"
                              showLabel={false}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(enrollment.progress)}% complete
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {enrollment.progress === 100 ? (
                              <div className="text-center">
                                <ApperIcon name="Award" size={24} className="text-success mx-auto mb-1" />
                                <p className="text-xs text-success">Complete</p>
                              </div>
                            ) : (
                              <Link to={`/course/${course.Id}`}>
                                <Button size="sm">
                                  Continue
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <ProgressRing 
                    progress={stats.totalCourses > 0 ? (stats.completedCourses / stats.totalCourses) * 100 : 0}
                    size={120}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {stats.completedCourses} of {stats.totalCourses} courses completed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.completedCourses > 0 && (
                    <div className="flex items-center p-3 bg-success/10 rounded-lg">
                      <ApperIcon name="Award" size={20} className="text-success mr-3" />
                      <div>
                        <p className="text-sm font-medium">Course Completer</p>
                        <p className="text-xs text-gray-600">Completed your first course</p>
                      </div>
                    </div>
                  )}
                  
                  {stats.totalCourses >= 5 && (
                    <div className="flex items-center p-3 bg-primary/10 rounded-lg">
                      <ApperIcon name="BookOpen" size={20} className="text-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium">Learning Enthusiast</p>
                        <p className="text-xs text-gray-600">Enrolled in 5+ courses</p>
                      </div>
                    </div>
                  )}
                  
                  {stats.totalHours >= 50 && (
                    <div className="flex items-center p-3 bg-secondary/10 rounded-lg">
                      <ApperIcon name="Clock" size={20} className="text-secondary mr-3" />
                      <div>
                        <p className="text-sm font-medium">Time Investor</p>
                        <p className="text-xs text-gray-600">50+ hours of learning</p>
                      </div>
                    </div>
                  )}
                  
                  {stats.completedCourses === 0 && stats.totalCourses === 0 && (
                    <div className="text-center py-4">
                      <ApperIcon name="Trophy" size={32} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Start learning to earn achievements!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link to="/catalog">
                    <Button variant="outline" className="w-full justify-start">
                      <ApperIcon name="Search" size={16} className="mr-2" />
                      Browse Courses
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <ApperIcon name="User" size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Download Certificates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard