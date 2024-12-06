import React from 'react'

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const baseStyles = "px-6 py-3 rounded-full font-bold transition-colors duration-300"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    dark: "bg-black text-white hover:bg-gray-800 border border-gray-200"
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
} 