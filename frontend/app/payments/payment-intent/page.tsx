'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Alert from '@/components/Alert'
import { paymentAPI } from '@/lib/api'

export default function PaymentIntentPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    amount: 2000,
    currency: 'usd',
    connectedAccountId: '',
    applicationFeeAmount: 200,
    description: '',
    customerEmail: '',
  })

  useEffect(() => {
    const accountId = searchParams.get('accountId')
    if (accountId) {
      setFormData((prev) => ({ ...prev, connectedAccountId: accountId }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await paymentAPI.createPaymentIntent(formData)
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Error creating Payment Intent',
      )
    } finally {
      setLoading(false)
    }
  }

  const sellerAmount = formData.amount - formData.applicationFeeAmount

  return (
    <Layout
      title="Payment Intent"
      description="Criar intenção de pagamento customizada"
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
                  placeholder="2000"
                />
                <p className="mt-1 text-sm text-gray-500">Ex: 2000 = $20.00</p>
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
                  <option value="usd">USD - Dólar Americano</option>
                  <option value="brl">BRL - Real Brasileiro</option>
                  <option value="eur">EUR - Euro</option>
                  <option value="gbp">GBP - Libra Esterlina</option>
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
                  placeholder="acct_1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💸 Taxa da Plataforma (centavos)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.applicationFeeAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationFeeAmount: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="200"
                />
                <p className="mt-1 text-sm text-gray-500">Ex: 200 = $2.00</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Descrição (opcional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Pagamento por produto/serviço"
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
                  placeholder="cliente@exemplo.com"
                />
              </div>

              <Button type="submit" isLoading={loading} fullWidth>
                💳 Criar Payment Intent
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Resumo */}
          <Card title="📊 Resumo do Pagamento">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Valor Total:</span>
                <span className="font-bold">
                  ${(formData.amount / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Taxa Plataforma:</span>
                <span className="font-semibold text-purple-600">
                  ${(formData.applicationFeeAmount / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Vendedor Recebe:</span>
                <span className="font-bold text-green-600">
                  ${(sellerAmount / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Result */}
          {error && (
            <Alert type="error" title="Erro">
              {error}
            </Alert>
          )}

          {result && (
            <Alert type="success" title="Payment Intent Criado!">
              <div className="space-y-2 mt-3">
                <p>
                  <strong>ID:</strong>{' '}
                  <code className="bg-white px-2 py-1 rounded text-xs">
                    {result.id}
                  </code>
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="font-semibold text-yellow-700">
                    {result.status.toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong>Client Secret:</strong>
                  <code className="block bg-white px-2 py-1 rounded text-xs mt-1 break-all">
                    {result.client_secret}
                  </code>
                </p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-green-800">
                    ✅ Use o client_secret para confirmar o pagamento via Stripe
                    Elements ou SDK
                  </p>
                </div>
              </div>
            </Alert>
          )}

          {/* Info */}
          <Card title="ℹ️ Como funciona">
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>1. Criação:</strong> Payment Intent é criado com status
                'requires_payment_method'
              </p>
              <p>
                <strong>2. Confirmação:</strong> Cliente fornece dados de pagamento
                via Stripe Elements
              </p>
              <p>
                <strong>3. Processamento:</strong> Pagamento é processado
                automaticamente
              </p>
              <p>
                <strong>4. Transferência:</strong> Valor (menos taxa) é transferido
                para o vendedor
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

