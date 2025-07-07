import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const PDFViewer = ({ pdfUrl, title, onComplete }) => {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const handleDownload = () => {
    // Create download link
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title}.pdf`
    link.click()
  }

  // Mock PDF viewer - in a real app, you'd use a PDF library like react-pdf
  return (
    <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
      {/* PDF Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ApperIcon name="ZoomOut" size={16} />
          </Button>
          
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {zoom}%
          </span>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ApperIcon name="ZoomIn" size={16} />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
          >
            <ApperIcon name="Download" size={16} />
          </Button>
        </div>
      </div>
      
      {/* PDF Content */}
      <div className="h-[600px] bg-white m-4 rounded shadow-inner flex items-center justify-center">
        <div className="text-center text-gray-500">
          <ApperIcon name="FileText" size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">PDF Viewer Placeholder</p>
          <p className="text-sm opacity-70">Document: {title}</p>
          <p className="text-sm opacity-70">Zoom: {zoom}%</p>
          
          <Button
            className="mt-4"
            onClick={() => onComplete?.()}
          >
            Mark as Complete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PDFViewer