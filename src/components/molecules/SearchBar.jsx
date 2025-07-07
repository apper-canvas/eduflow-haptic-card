import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search courses...", 
  className,
  showButton = true 
}) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    if (!showButton) {
      onSearch(e.target.value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-4"
        />
      </div>
      {showButton && (
        <Button type="submit">
          <ApperIcon name="Search" size={20} />
        </Button>
      )}
    </form>
  )
}

export default SearchBar