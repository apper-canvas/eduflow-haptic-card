import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border bg-white shadow-md hover:shadow-lg transition-all duration-200 card-hover',
        className
      )}
      {...props}
    />
  )
})

Card.displayName = 'Card'

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
})

CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
})

CardTitle.displayName = 'CardTitle'

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
})

CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }