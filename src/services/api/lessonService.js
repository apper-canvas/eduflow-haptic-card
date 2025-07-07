import lessonsData from '@/services/mockData/lessons.json'

class LessonService {
  constructor() {
    this.lessons = [...lessonsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.lessons]
  }

  async getById(id) {
    await this.delay()
    const lesson = this.lessons.find(l => l.Id === id)
    if (!lesson) {
      throw new Error('Lesson not found')
    }
    return { ...lesson }
  }

  async getByCourseId(courseId) {
    await this.delay()
    return this.lessons
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order)
  }

  async create(lessonData) {
    await this.delay()
    const newLesson = {
      ...lessonData,
      Id: Math.max(...this.lessons.map(l => l.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.lessons.push(newLesson)
    return { ...newLesson }
  }

  async update(id, lessonData) {
    await this.delay()
    const index = this.lessons.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error('Lesson not found')
    }
    this.lessons[index] = {
      ...this.lessons[index],
      ...lessonData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.lessons[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.lessons.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error('Lesson not found')
    }
    this.lessons.splice(index, 1)
    return true
  }
}

export const lessonService = new LessonService()