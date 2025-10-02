import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
}

export default function Alert({ children, type = 'info', title }: AlertProps) {
  const styles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  }

  return (
    <div className={`p-4 border-l-4 rounded-lg ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[type]}</span>
        <div className="flex-1">
          {title && <h4 className="font-bold mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}

