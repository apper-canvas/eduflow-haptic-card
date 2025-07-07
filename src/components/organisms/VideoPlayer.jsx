import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

const VideoPlayer = ({ videoUrl, title, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Mock video player - in a real app, you'd integrate with a video service
  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleTimeUpdate = (time) => {
    setCurrentTime(time)
    // Mark as complete when 90% watched
    if (time / duration >= 0.9 && onComplete) {
      onComplete()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        {/* Placeholder for video player */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <ApperIcon name="Play" size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">{title}</p>
            <p className="text-sm opacity-70">Video Player Placeholder</p>
          </div>
        </div>
        
        {/* Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2"
                  onClick={isPlaying ? handlePause : handlePlay}
                >
                  <ApperIcon name={isPlaying ? "Pause" : "Play"} size={20} />
                </Button>
                
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <ApperIcon name={isFullscreen ? "Minimize" : "Maximize"} size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer