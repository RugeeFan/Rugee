import React from 'react'

const animations = {
  fadeIn: 'opacity-0 animate-fadeIn',
  slideUp: 'translate-y-4 opacity-0 animate-slideUp',
  slideDown: 'translate-y-[-1rem] opacity-0 animate-slideDown',
  scale: 'scale-95 opacity-0 animate-scale',
  float: 'animate-float'
}

export default function Animate({ 
  children, 
  animation = 'fadeIn',
  delay = 0,
  className = '',
  ...props 
}) {
  return (
    <div
      className={`${animations[animation]} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  )
} 