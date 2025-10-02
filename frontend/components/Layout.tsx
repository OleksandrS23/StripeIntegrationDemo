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
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-purple-600 hover:text-purple-700"
            >
              🚀 Stripe Connect
            </Link>
            <div className="flex gap-4">
              <Link
                href="/connect/accounts"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                👤 Contas
              </Link>
              <Link
                href="/payments/payment-intent"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                💳 Pagamentos
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">{children}</div>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Stripe Connect Dashboard - Modo de Teste</p>
        </div>
      </footer>
    </div>
  )
}

