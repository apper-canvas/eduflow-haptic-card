import { useState, useEffect } from 'react'
import CourseCard from '@/components/molecules/CourseCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { courseService } from '@/services/api/courseService'

const CourseGrid = ({ filters, searchQuery, limit }) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [filters, searchQuery, limit])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let allCourses = await courseService.getAll()
      
      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        allCourses = allCourses.filter(course => 
          course.category.toLowerCase() === filters.category.toLowerCase()
        )
      }
      
      // Apply search
      if (searchQuery) {
        allCourses = allCourses.filter(course =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Apply limit
      if (limit) {
        allCourses = allCourses.slice(0, limit)
      }
      
      setCourses(allCourses)
    } catch (err) {
      setError(err.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadCourses} />
  }

  if (courses.length === 0) {
    return <Empty message="No courses found" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.Id} course={course} />
      ))}
    </div>
  )
}

export default CourseGrid