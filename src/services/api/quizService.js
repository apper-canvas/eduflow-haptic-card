import quizzesData from '@/services/mockData/quizzes.json'

class QuizService {
  constructor() {
    this.quizzes = [...quizzesData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.quizzes]
  }

  async getById(id) {
    await this.delay()
    const quiz = this.quizzes.find(q => q.Id === id)
    if (!quiz) {
      throw new Error('Quiz not found')
    }
    return { ...quiz }
  }

  async getByCourseId(courseId) {
    await this.delay()
    return this.quizzes.filter(quiz => quiz.courseId === courseId)
  }

  async create(quizData) {
    await this.delay()
    const newQuiz = {
      ...quizData,
      Id: Math.max(...this.quizzes.map(q => q.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.quizzes.push(newQuiz)
    return { ...newQuiz }
  }

  async update(id, quizData) {
    await this.delay()
    const index = this.quizzes.findIndex(q => q.Id === id)
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    this.quizzes[index] = {
      ...this.quizzes[index],
      ...quizData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.quizzes[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.quizzes.findIndex(q => q.Id === id)
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    this.quizzes.splice(index, 1)
    return true
  }
}

export const quizService = new QuizService()