class EnrollmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'enrollment'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "progress" } },
          { field: { Name: "completed_lessons" } },
          { field: { Name: "enrolled_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "student_id" } },
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
        console.error("Error fetching enrollments:", error?.response?.data?.message)
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
          { field: { Name: "progress" } },
          { field: { Name: "completed_lessons" } },
          { field: { Name: "enrolled_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "student_id" } },
          { field: { Name: "course_id" } }
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
        console.error(`Error fetching enrollment with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "progress" } },
          { field: { Name: "completed_lessons" } },
          { field: { Name: "enrolled_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "student_id" } },
          { field: { Name: "course_id" } }
        ],
        where: [
          {
            FieldName: "student_id",
            Operator: "EqualTo",
            Values: [studentId]
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
        console.error("Error fetching student enrollments:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getByStudentAndCourse(studentId, courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "progress" } },
          { field: { Name: "completed_lessons" } },
          { field: { Name: "enrolled_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "student_id" } },
          { field: { Name: "course_id" } }
        ],
        where: [
          {
            FieldName: "student_id",
            Operator: "EqualTo",
            Values: [studentId]
          },
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
        return null
      }

      const enrollments = response.data || []
      return enrollments.length > 0 ? enrollments[0] : null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching enrollment:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(enrollmentData) {
    try {
      const params = {
        records: [{
          Name: enrollmentData.Name || `Enrollment-${enrollmentData.student_id}-${enrollmentData.course_id}`,
          progress: enrollmentData.progress || 0,
          completed_lessons: enrollmentData.completed_lessons || "",
          student_id: enrollmentData.student_id,
          course_id: enrollmentData.course_id
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
          console.error(`Failed to create ${failedRecords.length} enrollments:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating enrollment:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, enrollmentData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: enrollmentData.Name || `Enrollment-${enrollmentData.student_id}-${enrollmentData.course_id}`,
          progress: enrollmentData.progress,
          completed_lessons: enrollmentData.completed_lessons,
          student_id: enrollmentData.student_id,
          course_id: enrollmentData.course_id
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
          console.error(`Failed to update ${failedUpdates.length} enrollments:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating enrollment:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async markLessonComplete(studentId, courseId, lessonId) {
    try {
      const enrollment = await this.getByStudentAndCourse(studentId, courseId)
      if (!enrollment) {
        throw new Error('Enrollment not found')
      }
      
      // Parse completed lessons
      let completedLessons = []
      if (enrollment.completed_lessons) {
        try {
          completedLessons = typeof enrollment.completed_lessons === 'string'
            ? enrollment.completed_lessons.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
            : []
        } catch (e) {
          console.warn('Failed to parse completed lessons:', e)
        }
      }
      
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId)
        
        // Calculate progress (simple calculation - could be enhanced)
        const totalLessons = 10 // This would be dynamic in real app
        const progress = Math.round((completedLessons.length / totalLessons) * 100)
        
        const updatedEnrollment = await this.update(enrollment.Id, {
          ...enrollment,
          progress: progress,
          completed_lessons: completedLessons.join(',')
        })
        
        const courseCompleted = progress >= 100
        
        return { ...updatedEnrollment, courseCompleted }
      }
      
      return { ...enrollment, courseCompleted: enrollment.progress >= 100 }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking lesson complete:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }

  async checkCourseCompletion(studentId, courseId) {
    try {
      const enrollment = await this.getByStudentAndCourse(studentId, courseId)
      if (!enrollment) return false
      
      return enrollment.progress >= 100
    } catch (error) {
      console.error("Error checking course completion:", error)
      return false
    }
  }

  async generateCertificate(studentId, courseId, courseTitle) {
    try {
      // For demonstration, we'll use a simple approach
      // In production, you might want to integrate with the user service
      const studentName = `Student ${studentId}` // Simplified for demo
      
      // Create certificate template element
      const certificateElement = this.createCertificateElement(studentName, courseTitle, new Date())
      
      // Dynamically import libraries for PDF generation
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).jsPDF

      // Generate PDF
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      
      const imgWidth = 297 // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      
      // Download the certificate
      const fileName = `${studentName.replace(/\s+/g, '_')}_${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`
      pdf.save(fileName)
      
      // Clean up
      document.body.removeChild(certificateElement)
      
      return true
    } catch (error) {
      console.error('Certificate generation failed:', error)
      throw new Error('Failed to generate certificate')
    }
  }

  createCertificateElement(studentName, courseTitle, completionDate) {
    const certificateDiv = document.createElement('div')
    certificateDiv.style.cssText = `
      width: 800px;
      height: 600px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border: 8px solid #4f46e5;
      border-radius: 16px;
      padding: 60px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      position: absolute;
      top: -9999px;
      left: -9999px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    `
    
    certificateDiv.innerHTML = `
      <div style="text-align: center; height: 100%;">
        <div style="border: 2px solid #4f46e5; border-radius: 12px; padding: 40px; height: 100%; display: flex; flex-direction: column; justify-content: center; background: white;">
          <h1 style="color: #4f46e5; font-size: 48px; margin-bottom: 20px; font-weight: 700;">Certificate of Completion</h1>
          <div style="width: 100px; height: 4px; background: linear-gradient(90deg, #4f46e5, #7c3aed); margin: 0 auto 30px auto; border-radius: 2px;"></div>
          
          <p style="font-size: 24px; color: #6b7280; margin-bottom: 30px;">This is to certify that</p>
          <h2 style="color: #1f2937; font-size: 42px; margin-bottom: 30px; font-weight: 600;">${studentName}</h2>
          <p style="font-size: 20px; color: #6b7280; margin-bottom: 15px;">has successfully completed the course</p>
          <h3 style="color: #4f46e5; font-size: 28px; margin-bottom: 40px; font-weight: 600;">${courseTitle}</h3>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 60px;">
            <div style="text-align: left;">
              <div style="width: 200px; height: 2px; background: #e5e7eb; margin-bottom: 10px;"></div>
              <p style="font-size: 16px; color: #6b7280;">Instructor Signature</p>
            </div>
            <div style="text-align: center;">
              <p style="font-size: 18px; color: #1f2937; font-weight: 600;">Date of Completion</p>
              <p style="font-size: 20px; color: #4f46e5; font-weight: 600;">${completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style="text-align: right;">
              <div style="width: 200px; height: 2px; background: #e5e7eb; margin-bottom: 10px;"></div>
              <p style="font-size: 16px; color: #6b7280;">EduFlow Academy</p>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(certificateDiv)
    return certificateDiv
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
          console.error(`Failed to delete ${failedDeletions.length} enrollments:${JSON.stringify(failedDeletions)}`)
        }
        
        return failedDeletions.length === 0
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting enrollment:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export const enrollmentService = new EnrollmentService()