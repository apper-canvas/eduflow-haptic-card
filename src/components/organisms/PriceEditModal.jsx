import { useState } from 'react'
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import { courseService } from '@/services/api/courseService'
const PriceEditModal = ({ course, isOpen, onClose, onSuccess }) => {
  const [price, setPrice] = useState(course?.price || 0)
  const [saving, setSaving] = useState(false)

  if (!isOpen || !course) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (price < 0) {
      toast.error('Price cannot be negative')
      return
    }

    try {
      setSaving(true)
      const updatedCourse = await courseService.updatePrice(course.Id, parseFloat(price))
      toast.success('Course price updated successfully!')
      onSuccess(updatedCourse)
      onClose()
    } catch (err) {
      toast.error('Failed to update course price')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Edit Course Price</CardTitle>
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
              <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600">Current price: ${course.price}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                  New Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to $0 to make this course free
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="DollarSign" size={16} className="mr-2" />
                      Update Price
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PriceEditModal