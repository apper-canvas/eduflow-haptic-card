import { Link } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const Empty = ({ 
  message = 'No items found', 
  description = 'Try adjusting your search or filters to find what you\'re looking for.',
  actionLabel = 'Browse All Courses',
  actionLink = '/catalog',
  icon = 'BookOpen',
  className 
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={48} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      <Link to={actionLink}>
        <Button className="inline-flex items-center space-x-2">
          <ApperIcon name="Search" size={18} />
          <span>{actionLabel}</span>
        </Button>
      </Link>
    </div>
  )
}

export default Empty