import { Link } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary via-secondary to-purple-700 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-40 right-32 w-48 h-48 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Learn Without
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Limits
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of learners accessing world-class courses from expert instructors. 
            Start your journey today and unlock your potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/catalog">
              <Button size="xl" className="bg-white text-primary hover:bg-gray-100 shadow-xl">
                <ApperIcon name="BookOpen" size={24} className="mr-2" />
                Browse Courses
              </Button>
            </Link>
            
            <Link to="/instructor-dashboard">
              <Button 
                size="xl" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary shadow-xl"
              >
                <ApperIcon name="Users" size={24} className="mr-2" />
                Become an Instructor
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/80">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1.2K+</div>
              <div className="text-white/80">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">200+</div>
              <div className="text-white/80">Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-white/80">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection