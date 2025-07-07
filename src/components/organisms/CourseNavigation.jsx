import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LessonItem from '@/components/molecules/LessonItem'
import ProgressBar from '@/components/molecules/ProgressBar'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { courseService } from '@/services/api/courseService'
import { lessonService } from '@/services/api/lessonService'
import { quizService } from '@/services/api/quizService'
import { enrollmentService } from '@/services/api/enrollmentService'

const CourseNavigation = () => {
  const { courseId, lessonId, quizId } = useParams()
  const navigate = useNavigate()
  
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCourseData()
  }, [courseId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [courseData, lessonsData, quizzesData, enrollmentData] = await Promise.all([
        courseService.getById(parseInt(courseId)),
        lessonService.getByCourseId(parseInt(courseId)),
        quizService.getByCourseId(parseInt(courseId)),
        enrollmentService.getByStudentAndCourse(1, parseInt(courseId)) // Mock student ID
      ])
      
      setCourse(courseData)
      setLessons(lessonsData)
      setQuizzes(quizzesData)
      setEnrollment(enrollmentData)
    } catch (err) {
      setError(err.message || 'Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  const handleLessonClick = (lesson) => {
    navigate(`/course/${courseId}/lesson/${lesson.Id}`)
  }

  const handleQuizClick = (quiz) => {
    navigate(`/course/${courseId}/quiz/${quiz.Id}`)
  }

  const calculateProgress = () => {
    if (!enrollment || !lessons.length) return 0
    
    const completedLessons = enrollment.completedLessons || []
    return (completedLessons.length / lessons.length) * 100
  }

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-80 bg-white border-r border-gray-200">
        <Error message={error} onRetry={loadCourseData} />
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {course?.title}
        </h2>
        <ProgressBar 
          progress={calculateProgress()} 
          size="sm" 
          className="mb-4"
        />
        <p className="text-sm text-gray-600">
          {enrollment?.completedLessons?.length || 0} of {lessons.length} lessons complete
        </p>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Lessons */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <ApperIcon name="PlayCircle" size={16} className="mr-2" />
            Lessons
          </h3>
          <div className="space-y-1">
            {lessons.map((lesson) => (
              <LessonItem
                key={lesson.Id}
                lesson={lesson}
                isCompleted={enrollment?.completedLessons?.includes(lesson.Id)}
                isActive={parseInt(lessonId) === lesson.Id}
                onClick={() => handleLessonClick(lesson)}
              />
            ))}
          </div>
        </div>

        {/* Quizzes */}
        {quizzes.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <ApperIcon name="HelpCircle" size={16} className="mr-2" />
              Quizzes
            </h3>
            <div className="space-y-1">
              {quizzes.map((quiz) => (
                <button
                  key={quiz.Id}
                  onClick={() => handleQuizClick(quiz)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors duration-200 ${
                    parseInt(quizId) === quiz.Id
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ApperIcon name="HelpCircle" size={16} className="mr-2" />
                      <span className="font-medium">{quiz.title}</span>
                    </div>
                    <ApperIcon name="ChevronRight" size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseNavigation