'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Alert from '@/components/Alert'
import { connectAccountAPI } from '@/lib/api'

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [accountId, setAccountId] = useState('')

  useEffect(() => {
    const id = searchParams.get('accountId')
    if (id) setAccountId(id)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await connectAccountAPI.createAccountLink({
        accountId,
        refreshUrl: `${window.location.origin}/connect/onboarding?accountId=${accountId}`,
        returnUrl: `${window.location.origin}/connect/onboarding-success?accountId=${accountId}`,
      })

      if (response.success) {
        setResult(response.data)
        // Redirect to onboarding URL after 2 seconds
        setTimeout(() => {
          window.location.href = response.data.url
        }, 2000)
      } else {
        setError(response.error)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao criar link de onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      title="Onboarding de Vendedor"
      description="Complete o processo de verificação do vendedor"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🆔 Account ID
              </label>
              <input
                type="text"
                required
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                placeholder="acct_1234567890"
              />
              <p className="mt-2 text-sm text-gray-500">
                Cole o ID da conta Connect criada anteriormente
              </p>
            </div>

            <Button type="submit" isLoading={loading} fullWidth>
              🔗 Gerar Link de Onboarding
            </Button>
          </form>

          {error && (
            <div className="mt-6">
              <Alert type="error" title="Erro">
                {error}
              </Alert>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <Alert type="success" title="Link criado com sucesso!">
                <p className="mb-3">Redirecionando para o processo de onboarding...</p>
                <a
                  href={result.url}
                  className="text-purple-600 hover:text-purple-700 font-semibold break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.url}
                </a>
                <p className="mt-3 text-sm">
                  ⏰ O link expira em: {new Date(result.expires_at * 1000).toLocaleString('pt-BR')}
                </p>
              </Alert>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="mt-6" title="ℹ️ Como funciona o Onboarding">
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>1. Link de Verificação:</strong> Geramos um link seguro para o vendedor
            </p>
            <p>
              <strong>2. Preenchimento de Dados:</strong> O vendedor fornece informações da empresa e bancárias
            </p>
            <p>
              <strong>3. Verificação de Identidade:</strong> Stripe verifica documentos e informações
            </p>
            <p>
              <strong>4. Aprovação:</strong> Conta ativada e pronta para receber pagamentos
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

