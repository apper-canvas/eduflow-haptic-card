import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const Rating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 16, 
  className,
  showValue = true 
}) => {
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const filled = index < Math.floor(rating)
    const halfFilled = index === Math.floor(rating) && rating % 1 !== 0
    
    return (
      <div key={index} className="relative">
        <ApperIcon
          name="Star"
          size={size}
          className={cn(
            'transition-colors duration-200',
            filled ? 'text-yellow-400 fill-current' : 'text-gray-300'
          )}
        />
        {halfFilled && (
          <ApperIcon
            name="Star"
            size={size}
            className="absolute inset-0 text-yellow-400 fill-current"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        )}
      </div>
    )
  })

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {stars}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  )
}

export default Rating