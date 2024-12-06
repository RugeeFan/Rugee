import React from 'react'

export default function Title({ 
  children, 
  className = '',
  as: Component = 'h2',
  size = 'default'
}) {
  const sizes = {
    small: 'text-2xl md:text-3xl',
    default: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl'
  }

  return (
    <Component className={`font-bold text-center ${sizes[size]} ${className}`}>
      {children}
    </Component>
  )
} 