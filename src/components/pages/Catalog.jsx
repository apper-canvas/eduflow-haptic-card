import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '@/components/molecules/SearchBar'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import CourseGrid from '@/components/organisms/CourseGrid'
import { courseService } from '@/services/api/courseService'

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    price: searchParams.get('price') || 'all',
    level: searchParams.get('level') || 'all'
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (filters.category !== 'all') params.set('category', filters.category)
    if (filters.price !== 'all') params.set('price', filters.price)
    if (filters.level !== 'all') params.set('level', filters.level)
    setSearchParams(params)
  }, [searchQuery, filters, setSearchParams])

  const loadCategories = async () => {
    try {
      const courses = await courseService.getAll()
      const uniqueCategories = [...new Set(courses.map(course => course.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleCategoryFilter = (category) => {
    setFilters(prev => ({ ...prev, category }))
  }

  const handlePriceFilter = (price) => {
    setFilters(prev => ({ ...prev, price }))
  }

  const handleLevelFilter = (level) => {
    setFilters(prev => ({ ...prev, level }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Course Catalog
            </h1>
            <p className="text-xl text-gray-600">
              Discover thousands of courses from expert instructors
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search for courses, instructors, or topics..."
              showButton={false}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Filter */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
              <CategoryFilter 
                categories={categories}
                onFilterChange={handleCategoryFilter}
              />
            </div>
            
            {/* Price Filter */}
            <div className="lg:w-48">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Price</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'free', 'paid'].map((price) => (
                  <button
                    key={price}
                    onClick={() => handlePriceFilter(price)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.price === price
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {price === 'all' ? 'All Prices' : price === 'free' ? 'Free' : 'Paid'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Level Filter */}
            <div className="lg:w-48">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Level</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleLevelFilter(level)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.level === level
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseGrid 
          filters={filters}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  )
}

export default Catalog