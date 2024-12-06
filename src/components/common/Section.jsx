import React from 'react'

export default function Section({ 
  children, 
  className = '', 
  withCurve = false,
  ...props 
}) {
  return (
    <div className="relative">
      <section 
        className={`bg-section-bg py-20 ${className}`}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>

      {withCurve && (
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-section-bg rounded-b-[100%] translate-y-12 md:translate-y-16" />
      )}
    </div>
  )
} 