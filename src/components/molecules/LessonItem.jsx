import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const LessonItem = ({ 
  lesson, 
  isCompleted = false, 
  isActive = false, 
  onClick,
  className 
}) => {
  const getIcon = () => {
    switch (lesson.type) {
      case 'video':
        return 'Play'
      case 'pdf':
        return 'FileText'
      case 'text':
        return 'BookOpen'
      default:
        return 'BookOpen'
    }
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group',
        isActive && 'bg-primary/10 border-primary/20',
        isCompleted && 'bg-success/5',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200',
          isCompleted ? 'bg-success border-success' : 'border-gray-300 group-hover:border-primary',
          isActive && 'border-primary'
        )}>
          {isCompleted ? (
            <ApperIcon name="Check" size={16} className="text-white" />
          ) : (
            <ApperIcon 
              name={getIcon()} 
              size={16} 
              className={cn(
                'text-gray-400 group-hover:text-primary transition-colors',
                isActive && 'text-primary'
              )} 
            />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className={cn(
            'font-medium text-gray-900 group-hover:text-primary transition-colors',
            isActive && 'text-primary',
            isCompleted && 'text-success'
          )}>
            {lesson.title}
          </h4>
          <p className="text-sm text-gray-600 capitalize">
            {lesson.type} • {formatDuration(lesson.duration)}
          </p>
        </div>
      </div>
      
      {isCompleted && (
        <div className="checkmark-animate">
          <ApperIcon name="CheckCircle" size={20} className="text-success" />
        </div>
      )}
    </button>
  )
}

export default LessonItem