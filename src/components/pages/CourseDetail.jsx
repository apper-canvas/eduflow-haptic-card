import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Rating from '@/components/molecules/Rating'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { courseService } from '@/services/api/courseService'
import { lessonService } from '@/services/api/lessonService'
import { quizService } from '@/services/api/quizService'
import { enrollmentService } from '@/services/api/enrollmentService'

const CourseDetail = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    loadCourseData()
  }, [id])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const courseData = await courseService.getById(parseInt(id))
      const lessonsData = await lessonService.getByCourseId(parseInt(id))
      const quizzesData = await quizService.getByCourseId(parseInt(id))
      
      setCourse(courseData)
      setLessons(lessonsData)
      setQuizzes(quizzesData)
      
      // Check if user is enrolled
      try {
        const enrollmentData = await enrollmentService.getByStudentAndCourse(1, parseInt(id))
        setEnrollment(enrollmentData)
      } catch (err) {
        // Not enrolled, which is fine
        setEnrollment(null)
      }
    } catch (err) {
      setError(err.message || 'Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      setEnrolling(true)
      
      const newEnrollment = {
        studentId: 1, // Mock student ID
        courseId: parseInt(id),
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString()
      }
      
      const enrollment = await enrollmentService.create(newEnrollment)
      setEnrollment(enrollment)
      
      toast.success('Successfully enrolled in course!')
    } catch (err) {
      toast.error('Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const totalDuration = lessons.reduce((total, lesson) => total + lesson.duration, 0)
  const totalLessons = lessons.length
  const totalQuizzes = quizzes.length

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadCourseData} />
  }

  if (!course) {
    return <Error message="Course not found" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  {course.category}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  {course.level}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              
              <p className="text-xl text-white/90 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={course.instructorAvatar} />
                    <AvatarFallback>{course.instructorName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{course.instructorName}</p>
                    <p className="text-sm text-white/80">Instructor</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Rating rating={course.rating} size={16} />
                  <span className="text-sm text-white/80 ml-2">
                    ({course.enrollmentCount} students)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-white/80">
                <div className="flex items-center">
                  <ApperIcon name="Clock" size={16} className="mr-1" />
                  {formatDuration(totalDuration)}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="BookOpen" size={16} className="mr-1" />
                  {totalLessons} lessons
                </div>
                <div className="flex items-center">
                  <ApperIcon name="HelpCircle" size={16} className="mr-1" />
                  {totalQuizzes} quizzes
                </div>
              </div>
            </div>
            
            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                  </div>
                  
                  {enrollment ? (
                    <div className="space-y-3">
                      <div className="text-center">
                        <ApperIcon name="CheckCircle" size={48} className="text-success mx-auto mb-2" />
                        <p className="text-success font-medium">You're enrolled!</p>
                      </div>
                      <Link to={`/course/${id}/lesson/${lessons[0]?.Id}`}>
                        <Button className="w-full" size="lg">
                          Continue Learning
                        </Button>
                      </Link>
                      <Link to="/student-dashboard">
                        <Button variant="outline" className="w-full">
                          View Progress
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll Now'}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <ApperIcon name="Heart" size={16} className="mr-2" />
                        Add to Wishlist
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <ApperIcon name="Monitor" size={16} className="mr-2" />
                      Lifetime access
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Smartphone" size={16} className="mr-2" />
                      Mobile and desktop
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Award" size={16} className="mr-2" />
                      Certificate of completion
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {course.longDescription || course.description}
                </p>
              </CardContent>
            </Card>
            
            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.Id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {lesson.type} • {formatDuration(lesson.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon 
                          name={lesson.type === 'video' ? 'Play' : lesson.type === 'pdf' ? 'FileText' : 'BookOpen'} 
                          size={16} 
                          className="text-gray-400" 
                        />
                        {enrollment && (
                          <ApperIcon name="Lock" size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Instructor Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={course.instructorAvatar} />
                    <AvatarFallback className="text-lg">
                      {course.instructorName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.instructorName}</h3>
                    <p className="text-sm text-gray-600">{course.instructorTitle}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  {course.instructorBio || "Experienced instructor with years of expertise in the field."}
                </p>
                <div className="flex space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <ApperIcon name="Users" size={16} className="mr-1" />
                    {course.instructorStudents || 1200} students
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="BookOpen" size={16} className="mr-1" />
                    {course.instructorCourses || 8} courses
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>This Course Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <ApperIcon name="Clock" size={16} className="mr-3 text-primary" />
                    {formatDuration(totalDuration)} on-demand video
                  </div>
                  <div className="flex items-center text-sm">
                    <ApperIcon name="FileText" size={16} className="mr-3 text-primary" />
                    Downloadable resources
                  </div>
                  <div className="flex items-center text-sm">
                    <ApperIcon name="Monitor" size={16} className="mr-3 text-primary" />
                    Access on mobile and desktop
                  </div>
                  <div className="flex items-center text-sm">
                    <ApperIcon name="Award" size={16} className="mr-3 text-primary" />
                    Certificate of completion
                  </div>
                  <div className="flex items-center text-sm">
                    <ApperIcon name="Infinity" size={16} className="mr-3 text-primary" />
                    Full lifetime access
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail