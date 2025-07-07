import HeroSection from '@/components/organisms/HeroSection'
import FeaturedCourses from '@/components/organisms/FeaturedCourses'
import ApperIcon from '@/components/ApperIcon'
import { Card, CardContent } from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { Link } from 'react-router-dom'

const Home = () => {
  const categories = [
    { name: 'Web Development', icon: 'Code', count: 450, color: 'from-blue-500 to-blue-600' },
    { name: 'Data Science', icon: 'BarChart', count: 320, color: 'from-green-500 to-green-600' },
    { name: 'Design', icon: 'Palette', count: 280, color: 'from-purple-500 to-purple-600' },
    { name: 'Business', icon: 'Briefcase', count: 190, color: 'from-orange-500 to-orange-600' },
    { name: 'Photography', icon: 'Camera', count: 150, color: 'from-pink-500 to-pink-600' },
    { name: 'Music', icon: 'Music', count: 120, color: 'from-indigo-500 to-indigo-600' },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content: 'EduFlow transformed my career. The courses are incredibly well-structured and the instructors are industry experts.',
      avatar: '/api/placeholder/64/64',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      content: 'I love the flexibility to learn at my own pace. The platform is intuitive and the content is always up-to-date.',
      avatar: '/api/placeholder/64/64',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      content: 'The quality of instruction is outstanding. I\'ve completed 5 courses and each one exceeded my expectations.',
      avatar: '/api/placeholder/64/64',
      rating: 5
    }
  ]

  return (
    <div>
      <HeroSection />
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect course for your learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={`/catalog?category=${category.name.toLowerCase()}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <ApperIcon name={category.icon} size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-600">{category.count} courses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeaturedCourses />
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied learners who've transformed their careers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <ApperIcon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community of learners and start your journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Browse Courses
              </Button>
            </Link>
            <Link to="/instructor-dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Become an Instructor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home