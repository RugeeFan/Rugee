import React from 'react'

export default function Container({ 
  children, 
  className = '',
  size = 'default' 
}) {
  const sizes = {
    small: 'max-w-3xl',
    default: 'max-w-7xl',
    large: 'max-w-[90rem]'
  }

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  )
} 