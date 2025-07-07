import { forwardRef, useState } from 'react'
import { cn } from '@/utils/cn'

const Avatar = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  )
})
Avatar.displayName = 'Avatar'

const AvatarImage = forwardRef(({ className, src, alt, onError, ...props }, ref) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = (e) => {
    setHasError(true)
    setIsLoading(false)
    // Hide the img element when error occurs to show fallback
    if (e.target) {
      e.target.style.display = 'none'
    }
    // Call parent onError handler if provided
    if (onError) {
      onError(e)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  // Don't render img if no src or if error occurred
  if (!src || hasError) {
    return null
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt || 'Avatar'}
      className={cn('aspect-square h-full w-full object-cover', className)}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  )
})
AvatarImage.displayName = 'AvatarImage'

AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-medium text-sm',
        className
      )}
      {...props}
    />
  )
})

AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }