import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
}

export default function Alert({ children, type = 'info', title }: AlertProps) {
  const styles = {
    success: 'bg-green-50 border border-green-200 text-green-800',
    error: 'bg-red-50 border border-red-200 text-red-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border border-blue-200 text-blue-800',
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'i',
  }

  const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  }

  return (
    <div className={`rounded-lg p-4 ${styles[type]}`}>
      <div className="flex gap-3">
        <div className={`flex-shrink-0 font-bold ${iconStyles[type]}`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1 text-sm">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}

