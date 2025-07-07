import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { enrollmentService } from '@/services/api/enrollmentService'

// Initialize Stripe (use your publishable key)
const stripePromise = loadStripe('pk_test_your_publishable_key_here')

const PaymentForm = ({ course, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    const card = elements.getElement(CardElement)

    try {
      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: {
          name: 'Student Name', // In real app, get from user data
          email: 'student@example.com'
        }
      })

      if (paymentError) {
        setError(paymentError.message)
        setProcessing(false)
        return
      }

      // Simulate payment processing (in real app, send to your backend)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create enrollment after successful payment
      const newEnrollment = {
        studentId: 1, // Mock student ID
        courseId: course.Id,
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString(),
        paymentId: paymentMethod.id,
        amountPaid: course.price
      }

      await enrollmentService.create(newEnrollment)
      
      toast.success('Payment successful! You are now enrolled in the course.')
      onSuccess(newEnrollment)
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
      toast.error('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'Inter, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-white">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ApperIcon name="AlertCircle" size={16} className="text-red-600 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>Course Price:</span>
            <span className="font-medium">${course.price}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span>Processing Fee:</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <div className="flex items-center justify-between font-semibold">
              <span>Total:</span>
              <span className="text-lg">${course.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={processing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1"
        >
          {processing ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ApperIcon name="CreditCard" size={16} className="mr-2" />
              Complete Payment
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

const PaymentModal = ({ course, isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Complete Your Purchase</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600">by {course.instructorName}</p>
                </div>
              </div>
            </div>

            <Elements stripe={stripePromise}>
              <PaymentForm
                course={course}
                onSuccess={onSuccess}
                onCancel={onClose}
              />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PaymentModal