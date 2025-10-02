import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  className?: string
}

export default function Card({ children, title, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}
    >
      {title && <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>}
      {children}
    </div>
  )
}

