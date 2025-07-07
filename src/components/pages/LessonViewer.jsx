import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import CourseNavigation from '@/components/organisms/CourseNavigation'
import VideoPlayer from '@/components/organisms/VideoPlayer'
import PDFViewer from '@/components/organisms/PDFViewer'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { lessonService } from '@/services/api/lessonService'
import { enrollmentService } from '@/services/api/enrollmentService'
import { courseService } from '@/services/api/courseService'
const LessonViewer = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    loadLesson()
  }, [lessonId])

  const loadLesson = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const lessonData = await lessonService.getById(parseInt(lessonId))
      setLesson(lessonData)
      
      // Check if lesson is completed
      const enrollment = await enrollmentService.getByStudentAndCourse(1, parseInt(courseId))
      setIsCompleted(enrollment?.completedLessons?.includes(parseInt(lessonId)) || false)
    } catch (err) {
      setError(err.message || 'Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }
const handleComplete = async () => {
    try {
      const result = await enrollmentService.markLessonComplete(1, parseInt(courseId), parseInt(lessonId))
      setIsCompleted(true)
      toast.success('Lesson marked as complete!')
      
      // Check if course is now complete and generate certificate
      if (result.courseCompleted) {
        try {
          const course = await courseService.getById(parseInt(courseId))
          await enrollmentService.generateCertificate(1, parseInt(courseId), course.title)
          toast.success('🎉 Congratulations! Course completed and certificate downloaded!')
        } catch (certError) {
          toast.warning('Course completed but certificate generation failed')
        }
      }
    } catch (err) {
      toast.error('Failed to mark lesson as complete')
    }
  }
  const handleNext = () => {
    // Navigate to next lesson or quiz
    // This would be implemented based on course curriculum
    toast.info('Navigate to next lesson')
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <CourseNavigation />
        <div className="flex-1">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <CourseNavigation />
        <div className="flex-1">
          <Error message={error} onRetry={loadLesson} />
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex h-screen">
        <CourseNavigation />
        <div className="flex-1">
          <Error message="Lesson not found" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Course Navigation Sidebar */}
      <CourseNavigation />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <ApperIcon name="Clock" size={16} className="mr-1" />
                  {lesson.duration} minutes
                </div>
                <div className="flex items-center capitalize">
                  <ApperIcon 
                    name={lesson.type === 'video' ? 'Play' : lesson.type === 'pdf' ? 'FileText' : 'BookOpen'} 
                    size={16} 
                    className="mr-1" 
                  />
                  {lesson.type}
                </div>
                {isCompleted && (
                  <div className="flex items-center text-success">
                    <ApperIcon name="CheckCircle" size={16} className="mr-1" />
                    Completed
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isCompleted && (
                <Button onClick={handleComplete} variant="success">
                  <ApperIcon name="Check" size={16} className="mr-2" />
                  Mark Complete
                </Button>
              )}
              <Button onClick={handleNext}>
                Next
                <ApperIcon name="ChevronRight" size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {lesson.type === 'video' && (
              <VideoPlayer 
                videoUrl={lesson.content}
                title={lesson.title}
                onComplete={handleComplete}
              />
            )}
            
            {lesson.type === 'pdf' && (
              <PDFViewer 
                pdfUrl={lesson.content}
                title={lesson.title}
                onComplete={handleComplete}
              />
            )}
            
            {lesson.type === 'text' && (
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                </div>
                
                {!isCompleted && (
                  <div className="mt-8 text-center">
                    <Button onClick={handleComplete} size="lg">
                      <ApperIcon name="Check" size={20} className="mr-2" />
                      Mark as Complete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonViewer