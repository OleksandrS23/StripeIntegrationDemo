'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Alert from '@/components/Alert'
import { checkoutAPI } from '@/lib/api'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    amount: 2000,
    currency: 'usd',
    connectedAccountId: '',
    applicationFeeAmount: 200,
    productName: 'Produto Teste',
    customerEmail: '',
  })

  useEffect(() => {
    const accountId = searchParams.get('accountId')
    if (accountId) {
      setFormData((prev) => ({ ...formData, connectedAccountId: accountId }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await checkoutAPI.createCheckoutSession(formData)
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Erro ao criar Checkout Session',
      )
    } finally {
      setLoading(false)
    }
  }

  const sellerAmount = formData.amount - formData.applicationFeeAmount

  return (
    <Layout
      title="Checkout Session"
      description="Página de pagamento hospedada pelo Stripe"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💰 Valor (centavos)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💱 Moeda
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="usd">USD - Dólar</option>
                  <option value="brl">BRL - Real</option>
                  <option value="eur">EUR - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔗 Conta Conectada
                </label>
                <input
                  type="text"
                  required
                  value={formData.connectedAccountId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      connectedAccountId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                  placeholder="acct_..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💸 Taxa da Plataforma (centavos)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.applicationFeeAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationFeeAmount: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📦 Nome do Produto
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 Email do Cliente (opcional)
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <Button type="submit" isLoading={loading} fullWidth>
                🛒 Criar Checkout Session
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="📊 Resumo">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span>Valor Total:</span>
                <strong>${(formData.amount / 100).toFixed(2)}</strong>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Taxa Plataforma:</span>
                <strong className="text-purple-600">
                  ${(formData.applicationFeeAmount / 100).toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between py-2">
                <span>Vendedor Recebe:</span>
                <strong className="text-green-600">
                  ${(sellerAmount / 100).toFixed(2)}
                </strong>
              </div>
            </div>
          </Card>

          {error && (
            <Alert type="error" title="Erro">
              {error}
            </Alert>
          )}

          {result && (
            <Alert type="success" title="Checkout Session Criado!">
              <div className="space-y-3 mt-3">
                <p>
                  <strong>Session ID:</strong> {result.sessionId}
                </p>
                <Button
                  onClick={() => window.open(result.url, '_blank')}
                  fullWidth
                  variant="success"
                >
                  🚀 Abrir Página de Pagamento
                </Button>
                <p className="text-sm text-green-800">
                  Compartilhe este link com o cliente para que ele possa pagar
                </p>
              </div>
            </Alert>
          )}

          <Card title="✨ Vantagens do Checkout">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Página segura hospedada pelo Stripe</li>
              <li>✅ Design responsivo e otimizado</li>
              <li>✅ Suporte a múltiplos métodos de pagamento</li>
              <li>✅ Não requer integração de frontend complexa</li>
            </ul>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

