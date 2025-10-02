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
        <p>Experience all Stripe Connect features interactively</p>
      </div>

      <div className="warning">
        <i className="fas fa-exclamation-triangle"></i>
        <strong> Test Mode:</strong> This application is configured to use Stripe test keys. No real transactions will be processed.
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.accounts}</div>
          <div className="stat-label">Created Accounts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.payments}</div>
          <div className="stat-label">Payments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${stats.volume.toFixed(2)}</div>
          <div className="stat-label">Total Volume</div>
        </div>
      </div>

      <div className="dashboard">
        {/* Create Connect Account */}
        <div className="card">
          <div className="card-header">
            <i className="fas fa-user-plus"></i>
            <h2>Create Connect Account</h2>
          </div>
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Seller Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seller@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="country"><i className="fas fa-globe"></i> Country</label>
            <select id="country" name="country">
              <option value="US">🇺🇸 United States</option>
              <option value="BR">🇧🇷 Brazil</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="PT">🇵🇹 Portugal</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="type"><i className="fas fa-cog"></i> Account Type</label>
            <select id="type" name="type">
              <option value="express">Express (Recommended - Simpler)</option>
              <option value="standard">Standard (More Control)</option>
              <option value="custom">Custom (Maximum Customization)</option>
            </select>
          </div>
          <button 
            type="button" 
            className={`btn ${loading === 'createAccount' ? 'loading' : ''}`}
            onClick={createAccount}
            disabled={loading === 'createAccount'}
          >
            {loading !== 'createAccount' && <><i className="fas fa-plus"></i> Create Account</>}
          </button>

          {accountError && (
            <div className="result error" style={{ display: 'block' }}>
              <strong>❌ Error:</strong> {accountError}
            </div>
          )}

          {accountResult && (
            <div className="result success" style={{ display: 'block' }}>
              <strong>✅ Account created successfully!</strong><br/>
              <strong>Account ID:</strong> <code>{accountResult.id}</code><br/>
              <strong>Email:</strong> {accountResult.email || 'N/A'}<br/>
              <strong>Country:</strong> {accountResult.country}<br/>
              <strong>Type:</strong> {accountResult.type}<br/>
              <small>Use this Account ID in the Onboarding form!</small>
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
            After creating an account, use this form to generate the verification link.
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
            {loading !== 'createLink' && <><i className="fas fa-link"></i> Generate Verification Link</>}
          </button>

          {linkError && (
            <div className="result error" style={{ display: 'block' }}>
              <strong>❌ Error:</strong> {linkError}
            </div>
          )}

          {linkResult && (
            <div className="result success" style={{ display: 'block' }}>
              <strong>✅ Verification link generated!</strong><br/>
              <a 
                href={linkResult.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn" 
                style={{ marginTop: '15px', display: 'inline-block' }}
              >
                <i className="fas fa-external-link-alt"></i> Open Onboarding Link
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
            <h2>Payment Intent - Custom Payment</h2>
          </div>
          <div className="info">
            <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>
              <i className="fas fa-info-circle"></i> How Payment Intent Works
            </h4>
            <div style={{ fontSize: '0.9rem' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>🎯 Use:</strong> For custom integration in your site/app with full control
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>💡 Flow:</strong> Create intent → Customer confirms payment → Money transferred
              </p>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amount">
              <i className="fas fa-dollar-sign"></i> Amount (cents)
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
            <label htmlFor="currency"><i className="fas fa-coins"></i> Currency</label>
            <select id="currency" name="currency">
              <option value="usd">USD - US Dollar</option>
              <option value="brl">BRL - Brazilian Real</option>
              <option value="eur">EUR - Euro</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="connectedAccountId">
              <i className="fas fa-link"></i> Connected Account
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
            {loading !== 'createPayment' && <><i className="fas fa-money-bill-wave"></i> Create Payment Intent</>}
          </button>
          <div id="createPaymentResult" className="result" style={{ display: 'none' }}></div>
        </div>

        {/* Transfer */}
        <div className="card">
          <div className="card-header">
            <i className="fas fa-exchange-alt"></i>
            <h2>Transfer</h2>
          </div>
          <div className="form-group">
            <label htmlFor="transferAmount">
              <i className="fas fa-dollar-sign"></i> Amount (cents)
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
            <label htmlFor="transferCurrency"><i className="fas fa-coins"></i> Currency</label>
            <select id="transferCurrency" name="currency">
              <option value="usd">USD</option>
              <option value="brl">BRL</option>
              <option value="eur">EUR</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="destinationAccount">
              <i className="fas fa-user"></i> Destination Account
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
            {loading !== 'createTransfer' && <><i className="fas fa-paper-plane"></i> Send Transfer</>}
          </button>
          <div id="createTransferResult" className="result" style={{ display: 'none' }}></div>
        </div>

        {/* Checkout & Links */}
        <div className="card full-width">
          <div className="card-header">
            <i className="fas fa-shopping-cart"></i>
            <h2>How Does the Customer Pay?</h2>
          </div>
          <div className="info">
            <i className="fas fa-lightbulb"></i>
            After creating a Connect account, use these options so the seller's customers can pay!
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '20px', background: '#f0e5ff', borderRadius: '8px', border: '2px solid #9b59b6' }}>
              <div style={{ display: 'inline-block', padding: '4px 8px', background: '#9b59b6', color: 'white', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' }}>
                NEW! 🚀
              </div>
              <h3 style={{ color: '#6c3483', marginBottom: '15px' }}>
                <i className="fas fa-tablet-alt"></i> Embedded Checkout
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                Checkout integrated in your page (no redirect!)
              </p>
              <a href="/payments/embedded" className="btn" style={{ background: '#9b59b6', textDecoration: 'none' }}>
                <i className="fas fa-tablet-alt"></i> View Embedded
              </a>
            </div>
            <div style={{ padding: '20px', background: '#e7f3ff', borderRadius: '8px', border: '2px solid #007bff' }}>
              <h3 style={{ color: '#0056b3', marginBottom: '15px' }}>
                <i className="fas fa-external-link-alt"></i> Stripe Checkout
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                Payment page hosted by Stripe (easier)
              </p>
              <a href="/payments/checkout" className="btn" style={{ background: '#007bff', textDecoration: 'none' }}>
                <i className="fas fa-external-link-alt"></i> Create Checkout
              </a>
            </div>
            <div style={{ padding: '20px', background: '#e8f5e8', borderRadius: '8px', border: '2px solid #28a745' }}>
              <h3 style={{ color: '#155724', marginBottom: '15px' }}>
                <i className="fas fa-link"></i> Payment Link
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                Direct payment link (WhatsApp, email, etc.)
              </p>
              <a href="/payments/payment-link" className="btn" style={{ background: '#28a745', textDecoration: 'none' }}>
                <i className="fas fa-link"></i> Generate Link
              </a>
            </div>
            <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' }}>
              <h3 style={{ color: '#856404', marginBottom: '15px' }}>
                <i className="fas fa-rocket"></i> Full Demo
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                See the complete flow with payment preview
              </p>
              <a href="/payments/demo" className="btn" style={{ background: '#ffc107', color: '#856404', textDecoration: 'none' }}>
                <i className="fas fa-rocket"></i> View Demo
              </a>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="card full-width accounts-list">
          <div className="card-header">
            <i className="fas fa-users"></i>
            <h2>Connected Accounts</h2>
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
              <i className="fas fa-sync"></i> Reload
            </button>
          </div>
          {accounts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <i className="fas fa-inbox"></i><br />
              No accounts found. Create your first account above!
            </p>
          ) : (
            accounts.map((account) => (
              <div key={account.id} className="account-item">
                <div className="account-header">
                  <span className="account-id">{account.id}</span>
                  <span className={`status-badge ${account.charges_enabled ? 'status-active' : 'status-pending'}`}>
                    {account.charges_enabled ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div>
                  <strong>Email:</strong> {account.email || 'N/A'}<br />
                  <strong>Country:</strong> {account.country}<br />
                  <strong>Type:</strong> {account.type}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
