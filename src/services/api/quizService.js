class QuizService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'quiz'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "passing_score" } },
          { field: { Name: "questions" } },
          { field: { Name: "course_id" } }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching quizzes:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "passing_score" } },
          { field: { Name: "questions" } },
          { field: { Name: "course_id" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      // Parse questions if it's stored as JSON string
      if (response.data && response.data.questions) {
        try {
          response.data.questions = typeof response.data.questions === 'string' 
            ? JSON.parse(response.data.questions)
            : response.data.questions
        } catch (e) {
          console.warn('Failed to parse quiz questions:', e)
        }
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching quiz with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "passing_score" } },
          { field: { Name: "questions" } },
          { field: { Name: "course_id" } }
        ],
        where: [
          {
            FieldName: "course_id",
            Operator: "EqualTo",
            Values: [courseId]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      // Parse questions for each quiz
      const quizzes = response.data || []
      quizzes.forEach(quiz => {
        if (quiz.questions) {
          try {
            quiz.questions = typeof quiz.questions === 'string' 
              ? JSON.parse(quiz.questions)
              : quiz.questions
          } catch (e) {
            console.warn('Failed to parse quiz questions:', e)
          }
        }
      })

      return quizzes
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course quizzes:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async create(quizData) {
    try {
      const params = {
        records: [{
          Name: quizData.Name || quizData.title,
          title: quizData.title,
          passing_score: quizData.passing_score || quizData.passingScore,
          questions: typeof quizData.questions === 'object' 
            ? JSON.stringify(quizData.questions)
            : quizData.questions,
          course_id: quizData.course_id
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} quizzes:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating quiz:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, quizData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: quizData.Name || quizData.title,
          title: quizData.title,
          passing_score: quizData.passing_score || quizData.passingScore,
          questions: typeof quizData.questions === 'object' 
            ? JSON.stringify(quizData.questions)
            : quizData.questions,
          course_id: quizData.course_id
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} quizzes:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating quiz:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} quizzes:${JSON.stringify(failedDeletions)}`)
        }
        
        return failedDeletions.length === 0
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting quiz:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export const quizService = new QuizService()