import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const Error = ({ message = 'Something went wrong', onRetry, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" size={48} className="text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="inline-flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  )
}

export default Error