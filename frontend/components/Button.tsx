import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  isLoading?: boolean
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'py-4 px-6 rounded-lg font-semibold uppercase tracking-wide hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 inline-flex items-center justify-center gap-2'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#635bff] to-[#5a52e8] text-white hover:shadow-lg hover:shadow-[#635bff]/40',
    secondary: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:shadow-lg',
    success: 'bg-gradient-to-r from-[#28a745] to-[#20c997] text-white hover:shadow-lg hover:shadow-[#28a745]/40',
    danger: 'bg-gradient-to-r from-[#dc3545] to-[#c82333] text-white hover:shadow-lg hover:shadow-[#dc3545]/40',
  }

  const widthClass = fullWidth ? 'w-full' : ''
  const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

