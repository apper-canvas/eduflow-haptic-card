import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Home from '@/components/pages/Home'
import Catalog from '@/components/pages/Catalog'
import CourseDetail from '@/components/pages/CourseDetail'
import StudentDashboard from '@/components/pages/StudentDashboard'
import InstructorDashboard from '@/components/pages/InstructorDashboard'
import LessonViewer from '@/components/pages/LessonViewer'
import Quiz from '@/components/pages/Quiz'
import Profile from '@/components/pages/Profile'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonViewer />} />
          <Route path="/course/:courseId/quiz/:quizId" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App