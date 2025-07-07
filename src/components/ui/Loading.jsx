import { cn } from '@/utils/cn'

const Loading = ({ className }) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {/* Course Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border shadow-md overflow-hidden">
            {/* Image placeholder */}
            <div className="w-full h-48 bg-gray-200 shimmer" />
            
            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <div className="h-4 bg-gray-200 rounded shimmer mb-3" />
              <div className="h-4 bg-gray-200 rounded shimmer w-3/4 mb-4" />
              
              {/* Description */}
              <div className="h-3 bg-gray-200 rounded shimmer mb-2" />
              <div className="h-3 bg-gray-200 rounded shimmer w-5/6 mb-4" />
              
              {/* Instructor */}
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full shimmer mr-2" />
                <div className="h-3 bg-gray-200 rounded shimmer w-20" />
              </div>
              
              {/* Stats */}
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded shimmer w-16" />
                <div className="h-3 bg-gray-200 rounded shimmer w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading