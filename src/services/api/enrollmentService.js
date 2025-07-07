import enrollmentsData from '@/services/mockData/enrollments.json'
import usersData from '@/services/mockData/users.json'
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
    
    // Check if course is now complete
    const courseCompleted = await this.checkCourseCompletion(studentId, courseId)
    
    return { ...enrollment, courseCompleted }
  }

  async checkCourseCompletion(studentId, courseId) {
    const enrollment = this.enrollments.find(e => 
      e.studentId === studentId && e.courseId === courseId
    )
    if (!enrollment) return false
    
    // Mock: Course is complete when progress reaches 100%
    return enrollment.progress >= 100
  }

  async generateCertificate(studentId, courseId, courseTitle) {
    await this.delay()
    
    try {
      // Get student information
      const student = usersData.find(u => u.Id === studentId)
      if (!student) {
        throw new Error('Student not found')
      }

      // Create certificate template element
      const certificateElement = this.createCertificateElement(student.name, courseTitle, new Date())
      
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
      const fileName = `${student.name.replace(/\s+/g, '_')}_${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`
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