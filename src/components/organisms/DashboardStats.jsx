import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const DashboardStats = ({ stats, className }) => {
  const statCards = [
    {
      title: 'Total Courses',
      value: stats.totalCourses || 0,
      icon: 'BookOpen',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Students',
      value: stats.activeStudents || 0,
      icon: 'Users',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate || 0}%`,
      icon: 'TrendingUp',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings || 0}`,
      icon: 'DollarSign',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ]

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {statCards.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <ApperIcon name={stat.icon} size={20} className={stat.textColor} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline">
              <span className={cn(
                'text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                stat.color
              )}>
                {stat.value}
              </span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ApperIcon name="TrendingUp" size={14} className="mr-1" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DashboardStats