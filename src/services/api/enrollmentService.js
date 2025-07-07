import enrollmentsData from '@/services/mockData/enrollments.json'

class EnrollmentService {
  constructor() {
    this.enrollments = [...enrollmentsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.enrollments]
  }

  async getById(id) {
    await this.delay()
    const enrollment = this.enrollments.find(e => e.Id === id)
    if (!enrollment) {
      throw new Error('Enrollment not found')
    }
    return { ...enrollment }
  }

  async getByStudentId(studentId) {
    await this.delay()
    return this.enrollments.filter(enrollment => enrollment.studentId === studentId)
  }

  async getByStudentAndCourse(studentId, courseId) {
    await this.delay()
    const enrollment = this.enrollments.find(e => 
      e.studentId === studentId && e.courseId === courseId
    )
    if (!enrollment) {
      throw new Error('Enrollment not found')
    }
    return { ...enrollment }
  }

  async create(enrollmentData) {
    await this.delay()
    const newEnrollment = {
      ...enrollmentData,
      Id: Math.max(...this.enrollments.map(e => e.Id), 0) + 1,
      enrolledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.enrollments.push(newEnrollment)
    return { ...newEnrollment }
  }

  async update(id, enrollmentData) {
    await this.delay()
    const index = this.enrollments.findIndex(e => e.Id === id)
    if (index === -1) {
      throw new Error('Enrollment not found')
    }
    this.enrollments[index] = {
      ...this.enrollments[index],
      ...enrollmentData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.enrollments[index] }
  }

  async markLessonComplete(studentId, courseId, lessonId) {
    await this.delay()
    const enrollment = this.enrollments.find(e => 
      e.studentId === studentId && e.courseId === courseId
    )
    if (!enrollment) {
      throw new Error('Enrollment not found')
    }
    
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId)
      enrollment.updatedAt = new Date().toISOString()
      
      // Update progress (mock calculation)
      const totalLessons = 10 // This would be dynamic in real app
      enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    }
    
    return { ...enrollment }
  }

  async delete(id) {
    await this.delay()
    const index = this.enrollments.findIndex(e => e.Id === id)
    if (index === -1) {
      throw new Error('Enrollment not found')
    }
    this.enrollments.splice(index, 1)
    return true
  }
}

export const enrollmentService = new EnrollmentService()