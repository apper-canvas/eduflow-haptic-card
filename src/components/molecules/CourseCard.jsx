import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import Rating from '@/components/molecules/Rating'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const CourseCard = ({ course, className }) => {
  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`
  }

  return (
    <Link to={`/course/${course.Id}`}>
      <Card className={cn('overflow-hidden group', className)}>
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {course.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge 
              variant={course.price === 0 ? 'success' : 'default'}
              className="bg-white/90 text-gray-800 font-semibold"
            >
              {formatPrice(course.price)}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course.description}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={course.instructorAvatar} />
                <AvatarFallback className="text-xs">
                  {course.instructorName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{course.instructorName}</span>
            </div>
            <Rating rating={course.rating} size={14} showValue={false} />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Users" size={14} />
              <span>{course.enrollmentCount} students</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={14} />
              <span>{course.duration} hours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CourseCard