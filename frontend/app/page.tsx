import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            🚀 Stripe Connect Dashboard
          </h1>
          <p className="text-xl text-white/90">
            Plataforma completa para gestão de vendedores e pagamentos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Connect Accounts Section */}
          <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Connect Accounts
            </h2>
            <p className="text-gray-600 mb-6">
              Crie e gerencie contas de vendedores, complete o onboarding e
              monitore seus status
            </p>
            <div className="space-y-3">
              <Link
                href="/connect/create-account"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-center transition-colors"
              >
                ➕ Criar Conta
              </Link>
              <Link
                href="/connect/onboarding"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg text-center transition-colors"
              >
                📝 Onboarding
              </Link>
              <Link
                href="/connect/accounts"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-center transition-colors"
              >
                📋 Lista de Contas
              </Link>
            </div>
          </div>

          {/* Payments Section */}
          <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-4xl mb-4">💳</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Pagamentos
            </h2>
            <p className="text-gray-600 mb-6">
              Crie payment intents, checkout sessions, payment links e muito
              mais
            </p>
            <div className="space-y-3">
              <Link
                href="/payments/payment-intent"
                className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-center transition-colors"
              >
                💰 Payment Intent
              </Link>
              <Link
                href="/payments/checkout"
                className="block w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg text-center transition-colors"
              >
                🛒 Checkout Session
              </Link>
              <Link
                href="/payments/payment-link"
                className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-4 rounded-lg text-center transition-colors"
              >
                🔗 Payment Link
              </Link>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-3">ℹ️ Como funciona:</h3>
          <ul className="space-y-2 text-white/90">
            <li>
              <strong>1. Connect Accounts:</strong> Crie contas de vendedores e
              complete o onboarding
            </li>
            <li>
              <strong>2. Pagamentos:</strong> Crie diferentes tipos de
              pagamentos para seus clientes
            </li>
            <li>
              <strong>3. Gestão:</strong> Monitore transações, balanços e
              transferências
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

