'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Alert from '@/components/Alert'
import { checkoutAPI } from '@/lib/api'

export default function PaymentLinkPage() {
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
    productDescription: '',
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
      const response = await checkoutAPI.createPaymentLink(formData)
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Erro ao criar Payment Link',
      )
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Link copiado para a área de transferência!')
  }

  return (
    <Layout
      title="Payment Link"
      description="Link de pagamento para compartilhar via WhatsApp, email, etc."
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
                  📝 Descrição do Produto (opcional)
                </label>
                <textarea
                  value={formData.productDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <Button type="submit" isLoading={loading} fullWidth>
                🔗 Criar Payment Link
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          {error && (
            <Alert type="error" title="Erro">
              {error}
            </Alert>
          )}

          {result && (
            <Alert type="success" title="Payment Link Criado!">
              <div className="space-y-3 mt-3">
                <p>
                  <strong>Link ID:</strong>{' '}
                  <code className="text-xs">{result.paymentLinkId}</code>
                </p>
                <div className="bg-white p-3 rounded border break-all text-sm">
                  {result.url}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(result.url)}
                    variant="secondary"
                    fullWidth
                  >
                    📋 Copiar Link
                  </Button>
                  <Button
                    onClick={() => window.open(result.url, '_blank')}
                    variant="success"
                    fullWidth
                  >
                    🚀 Abrir Link
                  </Button>
                </div>
                {result.note && (
                  <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                    💡 {result.note}
                  </p>
                )}
              </div>
            </Alert>
          )}

          <Card title="📱 Como usar">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Compartilhe via WhatsApp, Instagram, Facebook</li>
              <li>✅ Envie por email ou SMS</li>
              <li>✅ Use em bio de redes sociais</li>
              <li>✅ Link permanente - não expira</li>
              <li>✅ Perfeito para vendas nas redes sociais</li>
            </ul>
          </Card>

          <Card title="💡 Dica">
            <p className="text-sm text-gray-600">
              Payment Links são ideais para vendedores que usam redes sociais para
              vender. O cliente clica no link e é direcionado para uma página
              segura do Stripe para completar o pagamento.
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

