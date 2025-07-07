import { cn } from '@/utils/cn'

const ProgressBar = ({ 
  progress = 0, 
  className,
  showLabel = true,
  size = 'md',
  color = 'primary'
}) => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const colors = {
    primary: 'from-primary to-secondary',
    success: 'from-success to-green-600',
    warning: 'from-warning to-yellow-600',
    error: 'from-error to-red-600'
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-500 ease-out',
            colors[color]
          )}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar