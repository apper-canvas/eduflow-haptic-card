import coursesData from '@/services/mockData/courses.json'

class CourseService {
  constructor() {
    this.courses = [...coursesData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.courses]
  }

  async getById(id) {
    await this.delay()
    const course = this.courses.find(c => c.Id === id)
    if (!course) {
      throw new Error('Course not found')
    }
    return { ...course }
  }

  async create(courseData) {
    await this.delay()
    const newCourse = {
      ...courseData,
      Id: Math.max(...this.courses.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.courses.push(newCourse)
    return { ...newCourse }
  }

  async update(id, courseData) {
    await this.delay()
    const index = this.courses.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Course not found')
    }
    this.courses[index] = {
      ...this.courses[index],
      ...courseData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.courses[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.courses.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Course not found')
    }
    this.courses.splice(index, 1)
    return true
  }

  async getByInstructor(instructorId) {
    await this.delay()
    return this.courses.filter(course => course.instructorId === instructorId)
  }
}

export const courseService = new CourseService()