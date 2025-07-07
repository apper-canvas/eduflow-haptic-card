import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import CourseNavigation from "@/components/organisms/CourseNavigation";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { quizService } from "@/services/api/quizService";

const Quiz = () => {
  const { courseId, quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const quizData = await quizService.getById(parseInt(quizId))
      setQuiz(quizData)
    } catch (err) {
      setError(err.message || 'Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

const handleAnswerSelect = (questionIndex, value) => {
    if (submitted) return
    
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }))
  }

const handleSubmit = () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error('Please answer all questions before submitting')
      return
    }
    
    // Calculate score based on question type
    let correctAnswers = 0
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index]
      
      switch (question.type) {
        case 'multiple-choice':
          if (userAnswer === question.correctAnswer) {
            correctAnswers++
          }
          break
        case 'true-false':
          if (userAnswer === question.correctAnswer) {
            correctAnswers++
          }
          break
        case 'fill-in-blank':
          if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
            correctAnswers++
          }
          break
        case 'short-answer':
        case 'essay':
          // For demonstration, we'll check if answer contains key terms
          if (userAnswer && question.keyTerms && question.keyTerms.some(term => 
            userAnswer.toLowerCase().includes(term.toLowerCase())
          )) {
            correctAnswers++
          }
          break
        default:
          // Default to multiple choice behavior
          if (userAnswer === question.correctAnswer) {
            correctAnswers++
          }
      }
    })
    
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100)
    setScore(finalScore)
    setSubmitted(true)
    setShowResults(true)
    
    if (finalScore >= quiz.passingScore) {
      toast.success(`Congratulations! You passed with ${finalScore}%`)
    } else {
      toast.error(`You scored ${finalScore}%. You need ${quiz.passingScore}% to pass.`)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setShowResults(false)
    setCurrentQuestion(0)
    setScore(0)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <CourseNavigation />
        <div className="flex-1">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <CourseNavigation />
        <div className="flex-1">
          <Error message={error} onRetry={loadQuiz} />
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex h-screen">
        <CourseNavigation />
        <div className="flex-1">
          <Error message="Quiz not found" />
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Course Navigation Sidebar */}
      <CourseNavigation />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {quiz.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <ApperIcon name="HelpCircle" size={16} className="mr-1" />
                  {quiz.questions.length} questions
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Target" size={16} className="mr-1" />
                  {quiz.passingScore}% to pass
                </div>
                {submitted && (
                  <div className={cn(
                    "flex items-center font-medium",
                    score >= quiz.passingScore ? "text-success" : "text-error"
                  )}>
                    <ApperIcon 
                      name={score >= quiz.passingScore ? "CheckCircle" : "XCircle"} 
                      size={16} 
                      className="mr-1" 
                    />
                    {score}%
                  </div>
                )}
              </div>
            </div>
            
            {!submitted && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            {!showResults ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {currentQuestion + 1}: {currentQ.question}
                  </CardTitle>
</CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Multiple Choice Questions */}
                    {(!currentQ.type || currentQ.type === 'multiple-choice') && currentQ.options && currentQ.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion, index)}
                        disabled={submitted}
                        className={cn(
                          "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
                          answers[currentQuestion] === index
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                          submitted && index === currentQ.correctAnswer && "border-success bg-success/10 text-success",
                          submitted && answers[currentQuestion] === index && index !== currentQ.correctAnswer && "border-error bg-error/10 text-error"
                        )}
                      >
                        <div className="flex items-center">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3",
                            answers[currentQuestion] === index
                              ? "border-primary bg-primary"
                              : "border-gray-300"
                          )}>
                            {answers[currentQuestion] === index && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                          <span className="ml-2">{option}</span>
                          {submitted && index === currentQ.correctAnswer && (
                            <ApperIcon name="Check" size={16} className="ml-auto text-success" />
                          )}
                          {submitted && answers[currentQuestion] === index && index !== currentQ.correctAnswer && (
                            <ApperIcon name="X" size={16} className="ml-auto text-error" />
                          )}
                        </div>
                      </button>
                    ))}

                    {/* True/False Questions */}
                    {currentQ.type === 'true-false' && (
                      <div className="space-y-3">
                        {[true, false].map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(currentQuestion, option)}
                            disabled={submitted}
                            className={cn(
                              "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
                              answers[currentQuestion] === option
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                              submitted && option === currentQ.correctAnswer && "border-success bg-success/10 text-success",
                              submitted && answers[currentQuestion] === option && option !== currentQ.correctAnswer && "border-error bg-error/10 text-error"
                            )}
                          >
                            <div className="flex items-center">
                              <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3",
                                answers[currentQuestion] === option
                                  ? "border-primary bg-primary"
                                  : "border-gray-300"
                              )}>
                                {answers[currentQuestion] === option && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                              </div>
                              <span className="font-medium">{option ? 'True' : 'False'}</span>
                              {submitted && option === currentQ.correctAnswer && (
                                <ApperIcon name="Check" size={16} className="ml-auto text-success" />
                              )}
                              {submitted && answers[currentQuestion] === option && option !== currentQ.correctAnswer && (
                                <ApperIcon name="X" size={16} className="ml-auto text-error" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Fill-in-the-Blank Questions */}
                    {currentQ.type === 'fill-in-blank' && (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={answers[currentQuestion] || ''}
                            onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                            placeholder="Enter your answer..."
                            disabled={submitted}
                            className={cn(
                              "w-full p-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                              submitted && answers[currentQuestion]?.toLowerCase().trim() === currentQ.correctAnswer?.toLowerCase().trim()
                                ? "border-success bg-success/10 text-success"
                                : submitted && answers[currentQuestion] 
                                ? "border-error bg-error/10 text-error"
                                : "border-gray-200 focus:border-primary"
                            )}
                          />
                          {submitted && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <ApperIcon 
                                name={answers[currentQuestion]?.toLowerCase().trim() === currentQ.correctAnswer?.toLowerCase().trim() ? "Check" : "X"} 
                                size={16} 
                                className={answers[currentQuestion]?.toLowerCase().trim() === currentQ.correctAnswer?.toLowerCase().trim() ? "text-success" : "text-error"}
                              />
                            </div>
                          )}
                        </div>
                        {submitted && (
                          <div className="text-sm text-gray-600">
                            <strong>Correct answer:</strong> {currentQ.correctAnswer}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Short Answer/Essay Questions */}
                    {(currentQ.type === 'short-answer' || currentQ.type === 'essay') && (
                      <div className="space-y-3">
                        <textarea
                          value={answers[currentQuestion] || ''}
                          onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                          placeholder={currentQ.type === 'essay' ? "Write your essay response..." : "Enter your short answer..."}
                          disabled={submitted}
                          rows={currentQ.type === 'essay' ? 6 : 3}
                          className={cn(
                            "w-full p-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none",
                            submitted && answers[currentQuestion] && currentQ.keyTerms && currentQ.keyTerms.some(term => 
                              answers[currentQuestion].toLowerCase().includes(term.toLowerCase())
                            )
                              ? "border-success bg-success/10"
                              : submitted && answers[currentQuestion] 
                              ? "border-warning bg-warning/10"
                              : "border-gray-200 focus:border-primary"
                          )}
                        />
                        {submitted && currentQ.keyTerms && (
                          <div className="text-sm text-gray-600">
                            <strong>Key terms to include:</strong> {currentQ.keyTerms.join(', ')}
                          </div>
                        )}
                        {submitted && currentQ.sampleAnswer && (
                          <div className="text-sm text-gray-600">
                            <strong>Sample answer:</strong> {currentQ.sampleAnswer}
                          </div>
                        )}
                      </div>
                    )}
                  
                  {submitted && currentQ.explanation && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                      <p className="text-blue-800">{currentQ.explanation}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
                      Previous
                    </Button>
                    
                    {!submitted && (
                      <div className="flex space-x-3">
                        {currentQuestion < quiz.questions.length - 1 ? (
                          <Button onClick={handleNext}>
                            Next
                            <ApperIcon name="ChevronRight" size={16} className="ml-2" />
                          </Button>
                        ) : (
                          <Button onClick={handleSubmit}>
                            Submit Quiz
                            <ApperIcon name="Send" size={16} className="ml-2" />
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {submitted && currentQuestion < quiz.questions.length - 1 && (
                      <Button onClick={handleNext}>
                        Next
                        <ApperIcon name="ChevronRight" size={16} className="ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Quiz Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={cn(
                      "w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center",
                      score >= quiz.passingScore ? "bg-success/20" : "bg-error/20"
                    )}>
                      <ApperIcon 
                        name={score >= quiz.passingScore ? "Trophy" : "XCircle"} 
                        size={48} 
                        className={score >= quiz.passingScore ? "text-success" : "text-error"}
                      />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">
                      {score >= quiz.passingScore ? "Congratulations!" : "Better luck next time!"}
                    </h3>
                    
<p className="text-lg text-gray-600 mb-6">
                      You scored {score}% ({Object.values(answers).filter((answer, index) => {
                        const question = quiz.questions[index];
                        switch (question.type) {
                          case 'multiple-choice':
                            return answer === question.correctAnswer;
                          case 'true-false':
                            return answer === question.correctAnswer;
                          case 'fill-in-blank':
                            return answer && answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                          case 'short-answer':
                          case 'essay':
                            return answer && question.keyTerms && question.keyTerms.some(term => 
                              answer.toLowerCase().includes(term.toLowerCase())
                            );
                          default:
                            return answer === question.correctAnswer;
                        }
                      }).length} out of {quiz.questions.length} correct)
                    </p>
                    
                    <div className="flex justify-center space-x-4">
                      <Button onClick={handleRetry} variant="outline">
                        <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                        Try Again
                      </Button>
                      <Button onClick={() => navigate(`/course/${courseId}`)}>
                        <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                        Back to Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz