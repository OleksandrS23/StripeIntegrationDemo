'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Alert from '@/components/Alert'
import { connectAccountAPI } from '@/lib/api'

export default function CreateAccountPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    country: 'US',
    type: 'express' as 'express' | 'standard' | 'custom',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await connectAccountAPI.createAccount(formData)
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      title="Criar Conta Connect"
      description="Crie uma nova conta de vendedor na plataforma"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email do Vendedor
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="vendedor@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌍 País
              </label>
              <select
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="US">🇺🇸 Estados Unidos</option>
                <option value="BR">🇧🇷 Brasil</option>
                <option value="CA">🇨🇦 Canadá</option>
                <option value="GB">🇬🇧 Reino Unido</option>
                <option value="DE">🇩🇪 Alemanha</option>
                <option value="FR">🇫🇷 França</option>
                <option value="PT">🇵🇹 Portugal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⚙️ Tipo de Conta
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'express' | 'standard' | 'custom',
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="express">Express (Recomendado - Mais Simples)</option>
                <option value="standard">Standard (Mais Controle)</option>
                <option value="custom">Custom (Máxima Customização)</option>
              </select>
            </div>

            <Button type="submit" isLoading={loading} fullWidth>
              ➕ Criar Conta Connect
            </Button>
          </form>

          {error && (
            <div className="mt-6">
              <Alert type="error" title="Erro ao criar conta">
                {error}
              </Alert>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <Alert type="success" title="Conta criada com sucesso!">
                <div className="space-y-2 mt-3">
                  <p>
                    <strong>ID da Conta:</strong>{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">{result.id}</code>
                  </p>
                  <p>
                    <strong>Email:</strong> {result.email}
                  </p>
                  <p>
                    <strong>País:</strong> {result.country}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {result.type}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    {result.charges_enabled ? '✅ Ativo' : '⏳ Pendente Onboarding'}
                  </p>
                </div>
                <div className="mt-4">
                  <a
                    href={`/connect/onboarding?accountId=${result.id}`}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    → Ir para Onboarding
                  </a>
                </div>
              </Alert>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="mt-6" title="ℹ️ Informações">
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Express:</strong> Processo simplificado, ideal para começar rapidamente
            </p>
            <p>
              <strong>Standard:</strong> Mais controle sobre a experiência do usuário
            </p>
            <p>
              <strong>Custom:</strong> Controle total, requer implementação completa
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

