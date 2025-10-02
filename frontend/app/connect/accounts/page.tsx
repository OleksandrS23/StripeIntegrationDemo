'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Alert from '@/components/Alert'
import { connectAccountAPI } from '@/lib/api'

export default function AccountsPage() {
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await connectAccountAPI.listAccounts(20)
      if (response.success) {
        setAccounts(response.data.data)
      } else {
        setError(response.error)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar contas')
    } finally {
      setLoading(false)
    }
  }

  const viewAccountDetails = async (accountId: string) => {
    try {
      const response = await connectAccountAPI.getAccount(accountId)
      if (response.success) {
        setSelectedAccount(response.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar detalhes')
    }
  }

  if (loading) {
    return (
      <Layout title="Contas Conectadas" description="Lista de todas as contas de vendedores">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Contas Conectadas" description="Lista de todas as contas de vendedores">
      <div className="space-y-6">
        {error && (
          <Alert type="error" title="Erro">
            {error}
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Total: <strong>{accounts.length}</strong> contas
          </p>
          <Button onClick={loadAccounts} variant="secondary">
            🔄 Atualizar
          </Button>
        </div>

        {accounts.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-xl mb-2">Nenhuma conta encontrada</p>
              <p>Crie sua primeira conta de vendedor!</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {accounts.map((account) => (
              <Card key={account.id} className="hover:border-purple-300 border-2 border-transparent transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {account.email || 'Email não informado'}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          account.charges_enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {account.charges_enabled ? '✅ Ativo' : '⏳ Pendente'}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <p>
                        <strong>ID:</strong>{' '}
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {account.id}
                        </code>
                      </p>
                      <p>
                        <strong>País:</strong> {account.country}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {account.type}
                      </p>
                      <p>
                        <strong>Criado:</strong>{' '}
                        {new Date(account.created * 1000).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <Button
                        onClick={() => viewAccountDetails(account.id)}
                        variant="secondary"
                        className="text-sm py-2 px-4"
                      >
                        👁️ Ver Detalhes
                      </Button>
                      <a
                        href={`/connect/onboarding?accountId=${account.id}`}
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                      >
                        🔗 Onboarding
                      </a>
                      <a
                        href={`/payments/payment-intent?accountId=${account.id}`}
                        className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                      >
                        💰 Criar Pagamento
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Account Details Modal */}
        {selectedAccount && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAccount(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Detalhes da Conta</h3>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(selectedAccount, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

