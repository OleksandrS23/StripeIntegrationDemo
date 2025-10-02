import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Stripe Connect
            </Link>
            <div className="flex gap-6">
              <Link
                href="/connect/accounts"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Accounts
              </Link>
              <Link
                href="/payments/payment-intent"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Payments
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Test Mode</span>
            <span className="text-gray-300">•</span>
            <span>© 2025 Stripe Connect</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

