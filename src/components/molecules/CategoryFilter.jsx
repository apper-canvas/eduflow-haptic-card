import { useState } from 'react'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

const CategoryFilter = ({ categories, onFilterChange, className }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    onFilterChange(category)
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Button
        variant={selectedCategory === 'all' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => handleCategoryChange('all')}
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

export default CategoryFilter