import React from 'react'

export default function Grid({ 
  children, 
  className = '',
  cols = {
    default: 1,
    md: 2,
    lg: 3
  },
  gap = 8
}) {
  const getColsClass = () => {
    const baseClass = 'grid-cols-'
    return `
      ${baseClass}${cols.default}
      ${cols.sm ? `sm:${baseClass}${cols.sm}` : ''}
      ${cols.md ? `md:${baseClass}${cols.md}` : ''}
      ${cols.lg ? `lg:${baseClass}${cols.lg}` : ''}
    `.trim()
  }

  return (
    <div className={`grid ${getColsClass()} gap-${gap} ${className}`}>
      {children}
    </div>
  )
} 