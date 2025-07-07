import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from '@/components/molecules/CourseCard'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { courseService } from '@/services/api/courseService'

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFeaturedCourses()
  }, [])

  const loadFeaturedCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const allCourses = await courseService.getAll()
      // Get top 8 courses by rating
      const featured = allCourses
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
      
      setCourses(featured)
    } catch (err) {
      setError(err.message || 'Failed to load featured courses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadFeaturedCourses} />
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highly-rated courses from expert instructors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course) => (
            <CourseCard key={course.Id} course={course} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/catalog">
            <Button size="lg" className="inline-flex items-center space-x-2">
              <span>View All Courses</span>
              <ApperIcon name="ArrowRight" size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCourses