import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  icon?: string
  className?: string
}

export default function Card({ children, title, icon, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {title && (
        <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-100">
          {icon && <i className={`${icon} text-4xl text-[#635bff] mr-4`}></i>}
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
      )}
      {children}
    </div>
  )
}

