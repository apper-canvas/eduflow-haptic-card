class CourseService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'course'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "long_description" } },
          { field: { Name: "instructor_name" } },
          { field: { Name: "instructor_avatar" } },
          { field: { Name: "instructor_title" } },
          { field: { Name: "instructor_bio" } },
          { field: { Name: "instructor_students" } },
          { field: { Name: "instructor_courses" } },
          { field: { Name: "price" } },
          { field: { Name: "category" } },
          { field: { Name: "level" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "rating" } },
          { field: { Name: "enrollment_count" } },
          { field: { Name: "duration" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "instructor_id" } }
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
        console.error("Error fetching courses:", error?.response?.data?.message)
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
          { field: { Name: "description" } },
          { field: { Name: "long_description" } },
          { field: { Name: "instructor_name" } },
          { field: { Name: "instructor_avatar" } },
          { field: { Name: "instructor_title" } },
          { field: { Name: "instructor_bio" } },
          { field: { Name: "instructor_students" } },
          { field: { Name: "instructor_courses" } },
          { field: { Name: "price" } },
          { field: { Name: "category" } },
          { field: { Name: "level" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "rating" } },
          { field: { Name: "enrollment_count" } },
          { field: { Name: "duration" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "instructor_id" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [{
          Name: courseData.Name || courseData.title,
          title: courseData.title,
          description: courseData.description,
          long_description: courseData.long_description,
          instructor_name: courseData.instructor_name,
          instructor_avatar: courseData.instructor_avatar,
          instructor_title: courseData.instructor_title,
          instructor_bio: courseData.instructor_bio,
          instructor_students: courseData.instructor_students,
          instructor_courses: courseData.instructor_courses,
          price: courseData.price,
          category: courseData.category,
          level: courseData.level,
          thumbnail: courseData.thumbnail,
          rating: courseData.rating,
          enrollment_count: courseData.enrollment_count,
          duration: courseData.duration,
          instructor_id: courseData.instructor_id
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
          console.error(`Failed to create ${failedRecords.length} courses:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, courseData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: courseData.Name || courseData.title,
          title: courseData.title,
          description: courseData.description,
          long_description: courseData.long_description,
          instructor_name: courseData.instructor_name,
          instructor_avatar: courseData.instructor_avatar,
          instructor_title: courseData.instructor_title,
          instructor_bio: courseData.instructor_bio,
          instructor_students: courseData.instructor_students,
          instructor_courses: courseData.instructor_courses,
          price: courseData.price,
          category: courseData.category,
          level: courseData.level,
          thumbnail: courseData.thumbnail,
          rating: courseData.rating,
          enrollment_count: courseData.enrollment_count,
          duration: courseData.duration,
          instructor_id: courseData.instructor_id
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
          console.error(`Failed to update ${failedUpdates.length} courses:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message)
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
          console.error(`Failed to delete ${failedDeletions.length} courses:${JSON.stringify(failedDeletions)}`)
        }
        
        return failedDeletions.length === 0
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async getByInstructor(instructorId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "price" } },
          { field: { Name: "category" } },
          { field: { Name: "level" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "rating" } },
          { field: { Name: "enrollment_count" } },
          { field: { Name: "instructor_id" } }
        ],
        where: [
          {
            FieldName: "instructor_id",
            Operator: "EqualTo",
            Values: [instructorId]
          }
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
        console.error("Error fetching instructor courses:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async updatePrice(id, newPrice) {
    try {
      const params = {
        records: [{
          Id: id,
          price: newPrice
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
          console.error(`Failed to update price for ${failedUpdates.length} courses:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course price:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }
}

export const courseService = new CourseService()