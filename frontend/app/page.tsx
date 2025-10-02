'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Home() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [stats, setStats] = useState({ accounts: 0, payments: 0, volume: 0 })
  const [loading, setLoading] = useState<string | null>(null)
  const [accountResult, setAccountResult] = useState<any>(null)
  const [accountError, setAccountError] = useState<string>('')
  const [linkResult, setLinkResult] = useState<any>(null)
  const [linkError, setLinkError] = useState<string>('')
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [paymentError, setPaymentError] = useState<string>('')
  const [transferResult, setTransferResult] = useState<any>(null)
  const [transferError, setTransferError] = useState<string>('')

  // Carregar contas ao iniciar
  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      console.log('🔄 Carregando contas de:', `${API_URL}/stripe/connect/accounts`)
      const response = await fetch(`${API_URL}/stripe/connect/accounts`)
      console.log('📡 Response status:', response.status)
      const result = await response.json()
      console.log('📦 Dados recebidos:', result)
      
      // A API retorna { success: true, data: { object: "list", data: [...] } }
      const accountsList = result.data?.data || result.accounts || []
      console.log('👥 Contas encontradas:', accountsList.length)
      
      setAccounts(accountsList)
      setStats({
        accounts: accountsList.length,
        payments: 0,
        volume: 0
      })
    } catch (error) {
      console.error('❌ Erro ao carregar contas:', error)
    }
  }

  const showResult = (elementId: string, message: string, isSuccess: boolean) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.className = `result ${isSuccess ? 'success' : 'error'}`
      element.innerHTML = message
      element.style.display = 'block'
    }
  }

  const createAccount = async () => {
    setLoading('createAccount')
    setAccountResult(null)
    setAccountError('')
    
    const email = (document.getElementById('email') as HTMLInputElement).value
    const country = (document.getElementById('country') as HTMLSelectElement).value
    const type = (document.getElementById('type') as HTMLSelectElement).value

    try {
      const response = await fetch(`${API_URL}/stripe/connect/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, country, type })
      })
      const result = await response.json()
      console.log('📦 Resposta criar conta:', result)
      
      if (response.ok && result.success) {
        setAccountResult(result.data)
        loadAccounts()
      } else {
        setAccountError(result.error || result.message || 'Erro ao criar conta')
      }
    } catch (error: any) {
      setAccountError(error.message)
    } finally {
      setLoading(null)
    }
  }

  const createAccountLink = async () => {
    setLoading('createLink')
    setLinkResult(null)
    setLinkError('')
    
    const accountId = (document.getElementById('accountId') as HTMLInputElement).value

    try {
      const response = await fetch(`${API_URL}/stripe/connect/account-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accountId,
          refreshUrl: 'http://localhost:3000/connect/refresh',
          returnUrl: 'http://localhost:3000/connect/return'
        })
      })
      const result = await response.json()
      console.log('📦 Resposta criar link:', result)
      console.log('📦 Link URL:', result.data?.url)
      
      if (response.ok && result.success) {
        setLinkResult(result.data)
      } else {
        setLinkError(result.error || result.message || 'Erro ao criar link')
      }
    } catch (error: any) {
      setLinkError(error.message)
    } finally {
      setLoading(null)
    }
  }

  const createPaymentIntent = async () => {
    setLoading('createPayment')
    const amount = parseInt((document.getElementById('amount') as HTMLInputElement).value)
    const currency = (document.getElementById('currency') as HTMLSelectElement).value
    const connectedAccountId = (document.getElementById('connectedAccountId') as HTMLInputElement).value

    try {
      const response = await fetch(`${API_URL}/stripe/payments/payment-intents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          currency, 
          connectedAccountId,
          applicationFeeAmount: 200 
        })
      })
      const result = await response.json()
      console.log('📦 Resposta criar payment intent:', result)
      
      if (response.ok && result.success) {
        const data = result.data
        showResult('createPaymentResult', `
          <strong>✅ Payment Intent criado!</strong><br/>
          <strong>ID:</strong> <code>${data.id}</code><br/>
          <strong>Valor:</strong> ${data.amount / 100} ${currency.toUpperCase()}<br/>
          <strong>Status:</strong> ${data.status}<br/>
          <strong>Client Secret:</strong> <code>${data.client_secret}</code><br/>
          <small>Use o client_secret para confirmar o pagamento!</small>
        `, true)
      } else {
        showResult('createPaymentResult', `<strong>❌ Erro:</strong> ${result.error || result.message || 'Erro ao criar payment intent'}`, false)
      }
    } catch (error: any) {
      showResult('createPaymentResult', `<strong>❌ Erro:</strong> ${error.message}`, false)
    } finally {
      setLoading(null)
    }
  }

  const createTransfer = async () => {
    setLoading('createTransfer')
    const amount = parseInt((document.getElementById('transferAmount') as HTMLInputElement).value)
    const currency = (document.getElementById('transferCurrency') as HTMLSelectElement).value
    const destination = (document.getElementById('destinationAccount') as HTMLInputElement).value

    try {
      const response = await fetch(`${API_URL}/stripe/payments/transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, destination })
      })
      const result = await response.json()
      console.log('📦 Resposta criar transferência:', result)
      
      if (response.ok && result.success) {
        const data = result.data
        showResult('createTransferResult', `
          <strong>✅ Transferência criada!</strong><br/>
          <strong>ID:</strong> <code>${data.id}</code><br/>
          <strong>Valor:</strong> ${data.amount / 100} ${currency.toUpperCase()}<br/>
          <strong>Destino:</strong> ${destination}
        `, true)
      } else {
        showResult('createTransferResult', `<strong>❌ Erro:</strong> ${result.error || result.message || 'Erro ao criar transferência'}`, false)
      }
    } catch (error: any) {
      showResult('createTransferResult', `<strong>❌ Erro:</strong> ${error.message}`, false)
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="header">
        <h1>
          <i className="fas fa-credit-card"></i> Stripe Connect Dashboard
        </h1>
        <p>Experimente todas as funcionalidades do Stripe Connect de forma interativa</p>
      </div>

      <div className="warning">
        <i className="fas fa-exclamation-triangle"></i>
        <strong> Modo de Teste:</strong> Esta aplicação está configurada para usar chaves de teste do Stripe. Nenhuma transação real será processada.
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.accounts}</div>
          <div className="stat-label">Contas Criadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.payments}</div>
          <div className="stat-label">Pagamentos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${stats.volume.toFixed(2)}</div>
          <div className="stat-label">Volume Total</div>
        </div>
      </div>

      <div className="dashboard">
        {/* Criar Conta Connect */}
        <div className="card">
          <div className="card-header">
            <i className="fas fa-user-plus"></i>
            <h2>Criar Conta Connect</h2>
          </div>
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email do Vendedor
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="vendedor@exemplo.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="country"><i className="fas fa-globe"></i> País</label>
            <select id="country" name="country">
              <option value="US">🇺🇸 Estados Unidos</option>
              <option value="BR">🇧🇷 Brasil</option>
              <option value="CA">🇨🇦 Canadá</option>
              <option value="GB">🇬🇧 Reino Unido</option>
              <option value="PT">🇵🇹 Portugal</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="type"><i className="fas fa-cog"></i> Tipo de Conta</label>
            <select id="type" name="type">
              <option value="express">Express (Recomendado - Mais Simples)</option>
              <option value="standard">Standard (Mais Controle)</option>
              <option value="custom">Custom (Máxima Customização)</option>
            </select>
          </div>
          <button 
            type="button" 
            className={`btn ${loading === 'createAccount' ? 'loading' : ''}`}
            onClick={createAccount}
            disabled={loading === 'createAccount'}
          >
            {loading !== 'createAccount' && <><i className="fas fa-plus"></i> Criar Conta</>}
          </button>

          {accountError && (
            <div className="result error" style={{ display: 'block' }}>
              <strong>❌ Erro:</strong> {accountError}
            </div>
          )}

          {accountResult && (
            <div className="result success" style={{ display: 'block' }}>
              <strong>✅ Conta criada com sucesso!</strong><br/>
              <strong>Account ID:</strong> <code>{accountResult.id}</code><br/>
              <strong>Email:</strong> {accountResult.email || 'N/A'}<br/>
              <strong>País:</strong> {accountResult.country}<br/>
              <strong>Tipo:</strong> {accountResult.type}<br/>
              <small>Use este Account ID no formulário de Onboarding!</small>
            </div>
          )}
        </div>

        {/* Onboarding */}
        <div className="card">
          <div className="card-header">
            <i className="fas fa-clipboard-check"></i>
            <h2>Onboarding</h2>
          </div>
          <div className="info">
            <i className="fas fa-info-circle"></i>
            Após criar uma conta, use este formulário para gerar o link de verificação.
          </div>
          <div className="form-group">
            <label htmlFor="accountId">
              <i className="fas fa-id-card"></i> Account ID
            </label>
            <input
              type="text"
              id="accountId"
              name="accountId"
              placeholder="acct_1234567890"
            />
          </div>
          <button 
            type="button" 
            className={`btn ${loading === 'createLink' ? 'loading' : ''}`}
            onClick={createAccountLink}
            disabled={loading === 'createLink'}
          >
            {loading !== 'createLink' && <><i className="fas fa-link"></i> Gerar Link de Verificação</>}
          </button>

          {linkError && (
            <div className="result error" style={{ display: 'block' }}>
              <strong>❌ Erro:</strong> {linkError}
            </div>
          )}

          {linkResult && (
            <div className="result success" style={{ display: 'block' }}>
              <strong>✅ Link de verificação gerado!</strong><br/>
              <a 
                href={linkResult.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn" 
                style={{ marginTop: '15px', display: 'inline-block' }}
              >
                <i className="fas fa-external-link-alt"></i> Abrir Link de Onboarding
              </a>
              <div style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                <strong>URL:</strong><br/>
                <div className="url-display">{linkResult.url}</div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Intent */}
        <div className="card">
          <div className="card-header">
            <i className="fas fa-credit-card"></i>
            <h2>Payment Intent - Pagamento Customizado</h2>
          </div>
          <div className="info">
            <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>
              <i className="fas fa-info-circle"></i> Como Funciona o Payment Intent
            </h4>
            <div style={{ fontSize: '0.9rem' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>🎯 Uso:</strong> Para integração customizada no seu site/app com controle total
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>💡 Fluxo:</strong> Cria intenção → Cliente confirma pagamento → Dinheiro transferido
              </p>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amount">
              <i className="fas fa-dollar-sign"></i> Valor (centavos)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="2000"
              defaultValue="2000"
              min="50"
            />
            <small style={{ color: '#666' }}>Ex: 2000 = $20.00</small>
          </div>
          <div className="form-group">
            <label htmlFor="currency"><i className="fas fa-coins"></i> Moeda</label>
            <select id="currency" name="currency">
              <option value="usd">USD - Dólar Americano</option>
              <option value="brl">BRL - Real Brasileiro</option>
              <option value="eur">EUR - Euro</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="connectedAccountId">
              <i className="fas fa-link"></i> Conta Conectada
            </label>
            <input
              type="text"
              id="connectedAccountId"
              name="connectedAccountId"
              placeholder="acct_1234567890"
            />
          </div>
          <button 
            type="button" 
            className={`btn ${loading === 'createPayment' ? 'loading' : ''}`}
            onClick={createPaymentIntent}
            disabled={loading === 'createPayment'}
          >
            {loading !== 'createPayment' && <><i className="fas fa-money-bill-wave"></i> Criar Payment Intent</>}
          </button>
          <div id="createPaymentResult" className="result" style={{ display: 'none' }}></div>
        </div>

        {/* Transferência */}
        <div className="card">
          <div className="card-header">
            <i className="fas fa-exchange-alt"></i>
            <h2>Transferência</h2>
          </div>
          <div className="form-group">
            <label htmlFor="transferAmount">
              <i className="fas fa-dollar-sign"></i> Valor (centavos)
            </label>
            <input
              type="number"
              id="transferAmount"
              name="amount"
              placeholder="1000"
              defaultValue="1000"
            />
          </div>
          <div className="form-group">
            <label htmlFor="transferCurrency"><i className="fas fa-coins"></i> Moeda</label>
            <select id="transferCurrency" name="currency">
              <option value="usd">USD</option>
              <option value="brl">BRL</option>
              <option value="eur">EUR</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="destinationAccount">
              <i className="fas fa-user"></i> Conta Destino
            </label>
            <input
              type="text"
              id="destinationAccount"
              name="destination"
              placeholder="acct_1234567890"
            />
          </div>
          <button 
            type="button" 
            className={`btn ${loading === 'createTransfer' ? 'loading' : ''}`}
            onClick={createTransfer}
            disabled={loading === 'createTransfer'}
            style={{ background: 'linear-gradient(135deg, #20c997 0%, #28a745 100%)' }}
          >
            {loading !== 'createTransfer' && <><i className="fas fa-paper-plane"></i> Enviar Transferência</>}
          </button>
          <div id="createTransferResult" className="result" style={{ display: 'none' }}></div>
        </div>

        {/* Checkout & Links */}
        <div className="card full-width">
          <div className="card-header">
            <i className="fas fa-shopping-cart"></i>
            <h2>Como o Cliente Paga?</h2>
          </div>
          <div className="info">
            <i className="fas fa-lightbulb"></i>
            Depois de criar uma conta Connect, use estas opções para que os clientes do vendedor possam pagar!
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '20px', background: '#f0e5ff', borderRadius: '8px', border: '2px solid #9b59b6' }}>
              <div style={{ display: 'inline-block', padding: '4px 8px', background: '#9b59b6', color: 'white', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' }}>
                NOVO! 🚀
              </div>
              <h3 style={{ color: '#6c3483', marginBottom: '15px' }}>
                <i className="fas fa-tablet-alt"></i> Embedded Checkout
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                Checkout integrado na sua página (sem redirect!)
              </p>
              <a href="/payments/embedded" className="btn" style={{ background: '#9b59b6', textDecoration: 'none' }}>
                <i className="fas fa-tablet-alt"></i> Ver Embedded
              </a>
            </div>
            <div style={{ padding: '20px', background: '#e7f3ff', borderRadius: '8px', border: '2px solid #007bff' }}>
              <h3 style={{ color: '#0056b3', marginBottom: '15px' }}>
                <i className="fas fa-external-link-alt"></i> Stripe Checkout
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                Página de pagamento hospedada pelo Stripe (mais fácil)
              </p>
              <a href="/payments/checkout" className="btn" style={{ background: '#007bff', textDecoration: 'none' }}>
                <i className="fas fa-external-link-alt"></i> Criar Checkout
              </a>
            </div>
            <div style={{ padding: '20px', background: '#e8f5e8', borderRadius: '8px', border: '2px solid #28a745' }}>
              <h3 style={{ color: '#155724', marginBottom: '15px' }}>
                <i className="fas fa-link"></i> Payment Link
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                Link direto para pagamento (WhatsApp, email, etc.)
              </p>
              <a href="/payments/payment-link" className="btn" style={{ background: '#28a745', textDecoration: 'none' }}>
                <i className="fas fa-link"></i> Gerar Link
              </a>
            </div>
            <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' }}>
              <h3 style={{ color: '#856404', marginBottom: '15px' }}>
                <i className="fas fa-rocket"></i> Demo Completa
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                Veja o fluxo completo com iframe do pagamento
              </p>
              <a href="/payments/demo" className="btn" style={{ background: '#ffc107', color: '#856404', textDecoration: 'none' }}>
                <i className="fas fa-rocket"></i> Ver Demo
              </a>
            </div>
          </div>
        </div>

        {/* Contas Conectadas */}
        <div className="card full-width accounts-list">
          <div className="card-header">
            <i className="fas fa-users"></i>
            <h2>Contas Conectadas</h2>
            <button 
              onClick={loadAccounts} 
              className="btn"
              style={{ 
                width: 'auto', 
                padding: '8px 16px', 
                fontSize: '0.9rem',
                marginLeft: 'auto'
              }}
            >
              <i className="fas fa-sync"></i> Recarregar
            </button>
          </div>
          {accounts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <i className="fas fa-inbox"></i><br />
              Nenhuma conta encontrada. Crie sua primeira conta acima!
            </p>
          ) : (
            accounts.map((account) => (
              <div key={account.id} className="account-item">
                <div className="account-header">
                  <span className="account-id">{account.id}</span>
                  <span className={`status-badge ${account.charges_enabled ? 'status-active' : 'status-pending'}`}>
                    {account.charges_enabled ? 'Ativa' : 'Pendente'}
                  </span>
                </div>
                <div>
                  <strong>Email:</strong> {account.email || 'N/A'}<br />
                  <strong>País:</strong> {account.country}<br />
                  <strong>Tipo:</strong> {account.type}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
