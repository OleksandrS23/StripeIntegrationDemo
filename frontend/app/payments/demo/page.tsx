'use client'

import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function PaymentDemoPage() {
  const [loading, setLoading] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [paymentType, setPaymentType] = useState<'checkout' | 'link'>('checkout')

  const createPayment = async () => {
    setLoading(true)
    setError('')
    setPaymentUrl('')
    setPaymentInfo(null)
    
    const amount = parseInt((document.getElementById('demoAmount') as HTMLInputElement).value)
    const currency = (document.getElementById('demoCurrency') as HTMLSelectElement).value
    const connectedAccountId = (document.getElementById('demoAccountId') as HTMLInputElement).value
    const applicationFeeAmount = parseInt((document.getElementById('demoFee') as HTMLInputElement).value)
    const productName = (document.getElementById('demoProductName') as HTMLInputElement).value

    try {
      let endpoint = ''
      let body = {}

      if (paymentType === 'checkout') {
        endpoint = `${API_URL}/stripe/checkout/sessions`
        body = { 
          amount, 
          currency, 
          connectedAccountId,
          applicationFeeAmount,
          productName
        }
      } else {
        endpoint = `${API_URL}/stripe/checkout/payment-links/with-fee`
        body = { 
          amount, 
          currency,
          connectedAccountId,
          applicationFeeAmount,
          productName
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const result = await response.json()
      console.log('📦 Resposta:', result)
      
      if (response.ok && result.success) {
        setPaymentUrl(result.data.url)
        setPaymentInfo({
          id: result.data.sessionId || result.data.paymentLinkId,
          type: paymentType === 'checkout' ? 'Checkout Session' : 'Payment Link',
          amount: amount / 100,
          currency: currency.toUpperCase(),
          fee: applicationFeeAmount / 100,
          seller: (amount - applicationFeeAmount) / 100
        })
      } else {
        setError(result.error || result.message || 'Erro ao criar pagamento')
      }
    } catch (err: any) {
      console.error('❌ Erro:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearPayment = () => {
    setPaymentUrl('')
    setPaymentInfo(null)
    setError('')
  }

  return (
    <>
      <div className="header">
        <h1>
          <i className="fas fa-rocket"></i> Payment Flow Demonstration
        </h1>
        <p>Create a payment and see the page the end customer will see</p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <a href="/" className="btn" style={{ marginBottom: '20px', background: '#6c757d', display: 'inline-block', width: 'auto', padding: '10px 20px' }}>
          <i className="fas fa-arrow-left"></i> Back
        </a>

        <div className="info" style={{ marginBottom: '20px' }}>
          <i className="fas fa-info-circle"></i>
          <strong>How it works:</strong> You (platform owner) create a payment with a fee. On the right side appears the iframe with the page your end customer will see to make the payment.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: paymentUrl ? '1fr 1fr' : '1fr', gap: '20px' }}>
          {/* Form */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-cog"></i>
              <h2>Configure Payment</h2>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-shopping-cart"></i> Tipo de Pagamento
              </label>
              <select 
                value={paymentType} 
                onChange={(e) => setPaymentType(e.target.value as 'checkout' | 'link')}
                style={{ width: '100%', padding: '12px 15px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '16px' }}
              >
                <option value="checkout">Checkout Session (Single session)</option>
                <option value="link">Payment Link (Reusable link)</option>
              </select>
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                {paymentType === 'checkout' 
                  ? '✓ Better for single payments' 
                  : '✓ Better for sharing link (WhatsApp, email)'}
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="demoAmount">
                <i className="fas fa-dollar-sign"></i> Valor Total (centavos)
              </label>
              <input
                type="number"
                id="demoAmount"
                defaultValue="5000"
                min="50"
                placeholder="5000"
              />
              <small style={{ color: '#666' }}>Ex: 5000 = $50.00</small>
            </div>

            <div className="form-group">
              <label htmlFor="demoCurrency">
                <i className="fas fa-coins"></i> Moeda
              </label>
              <select id="demoCurrency">
                <option value="usd">USD - US Dollar</option>
                <option value="eur">EUR - Euro</option>
                <option value="brl">BRL - Real Brasileiro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="demoAccountId">
                <i className="fas fa-user"></i> Conta do Vendedor
              </label>
              <input
                type="text"
                id="demoAccountId"
                placeholder="acct_1234567890"
              />
              <small style={{ color: '#666' }}>ID da conta Connect do vendedor</small>
            </div>

            <div className="form-group">
              <label htmlFor="demoFee">
                <i className="fas fa-percentage"></i> Sua Taxa da Plataforma (centavos)
              </label>
              <input
                type="number"
                id="demoFee"
                defaultValue="500"
                min="0"
                placeholder="500"
              />
              <small style={{ color: '#666' }}>Ex: 500 = $5.00 commission</small>
            </div>

            <div className="form-group">
              <label htmlFor="demoProductName">
                <i className="fas fa-box"></i> Product/Service Name
              </label>
              <input
                type="text"
                id="demoProductName"
                defaultValue="Premium Product"
                placeholder="Nome do produto"
              />
            </div>

            {/* Resumo */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '2px solid #e9ecef'
            }}>
              <strong style={{ display: 'block', marginBottom: '10px', color: '#495057' }}>
                <i className="fas fa-calculator"></i> Resumo Financeiro:
              </strong>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Customer pays:</span>
                  <strong>$50.00</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#635bff' }}>
                  <span>Sua taxa:</span>
                  <strong>- $5.00</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px', borderTop: '1px solid #dee2e6' }}>
                  <span>Seller receives:</span>
                  <strong style={{ color: '#28a745' }}>$45.00</strong>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className={`btn ${loading ? 'loading' : ''}`}
              onClick={createPayment}
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #635bff 0%, #5a52e8 100%)', marginBottom: '10px' }}
            >
              {!loading && <><i className="fas fa-rocket"></i> Criar Pagamento</>}
            </button>

            {paymentUrl && (
              <button 
                type="button" 
                className="btn"
                onClick={clearPayment}
                style={{ background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)' }}
              >
                <i className="fas fa-redo"></i> Criar Novo Pagamento
              </button>
            )}

            {error && (
              <div className="result error" style={{ display: 'block', marginTop: '15px' }}>
                <strong>❌ Erro:</strong> {error}
              </div>
            )}

            {paymentInfo && (
              <div className="result success" style={{ display: 'block', marginTop: '15px' }}>
                <strong>✅ Pagamento criado!</strong><br/>
                <strong>Type:</strong> {paymentInfo.type}<br/>
                <strong>ID:</strong> <code style={{ fontSize: '0.85rem' }}>{paymentInfo.id}</code><br/>
                <div style={{ marginTop: '10px', padding: '10px', background: '#e8f5e9', borderRadius: '4px' }}>
                  <small>
                    Customer pays: <strong>${paymentInfo.amount}</strong> {paymentInfo.currency}<br/>
                    Your commission: <strong style={{ color: '#635bff' }}>${paymentInfo.fee}</strong><br/>
                    Seller receives: <strong style={{ color: '#28a745' }}>${paymentInfo.seller}</strong>
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* Iframe do Pagamento */}
          {paymentUrl && (
            <div className="card" style={{ minHeight: '600px' }}>
              <div className="card-header">
                <i className="fas fa-desktop"></i>
                <h2>End Customer View</h2>
              </div>
              
              <div className="warning" style={{ marginBottom: '15px' }}>
                <i className="fas fa-info-circle"></i>
                <strong>Note:</strong> For security reasons, Stripe may block iframe loading. 
                Use the button below to open in a new tab and see the complete experience.
              </div>

              <a 
                href={paymentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn" 
                style={{ 
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, #635bff 0%, #5a52e8 100%)',
                  display: 'inline-block',
                  width: 'auto',
                  padding: '15px 30px'
                }}
              >
                <i className="fas fa-external-link-alt"></i> Open Payment Page (New Tab)
              </a>

              <div style={{ 
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '15px',
                border: '2px solid #e9ecef'
              }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>
                  <i className="fas fa-eye"></i> Page Preview:
                </strong>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                  The end customer will see a secure Stripe page with:
                </p>
                <ul style={{ fontSize: '0.9rem', color: '#666', marginLeft: '20px' }}>
                  <li>✓ Professional payment form</li>
                  <li>✓ Multiple payment methods (Card, Multibanco for EUR, etc.)</li>
                  <li>✓ Product and price information</li>
                  <li>✓ 100% secure connection (SSL)</li>
                </ul>
              </div>

              {/* Mockup Visual */}
              <div style={{
                width: '100%',
                border: '2px solid #635bff',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(99, 91, 255, 0.2)',
                background: 'white',
                overflow: 'hidden'
              }}>
                {/* Header do Stripe */}
                <div style={{
                  background: 'linear-gradient(135deg, #635bff 0%, #5a52e8 100%)',
                  padding: '20px',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <i className="fab fa-stripe" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                  <h3 style={{ margin: '0', fontSize: '1.2rem' }}>Secure Checkout</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                    Powered by Stripe
                  </p>
                </div>

                {/* Body do checkout */}
                <div style={{ padding: '30px' }}>
                  <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: '#333' }}>
                      {paymentInfo?.amount && `$${paymentInfo.amount} ${paymentInfo.currency}`}
                    </h2>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      <i className="fas fa-box"></i> {(document.getElementById('demoProductName') as HTMLInputElement)?.value || 'Premium Product'}
                    </p>
                  </div>

                  {/* Field simulation */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ 
                      background: '#f6f9fc', 
                      padding: '15px', 
                      borderRadius: '8px',
                      border: '1px solid #e6ebf1',
                      marginBottom: '15px'
                    }}>
                      <label style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '5px' }}>
                        Email
                      </label>
                      <div style={{ color: '#aaa' }}>cliente@exemplo.com</div>
                    </div>

                    <div style={{ 
                      background: '#f6f9fc', 
                      padding: '15px', 
                      borderRadius: '8px',
                      border: '1px solid #e6ebf1',
                      marginBottom: '15px'
                    }}>
                      <label style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '5px' }}>
                        Card information
                      </label>
                      <div style={{ color: '#aaa' }}>
                        <i className="far fa-credit-card"></i> •••• •••• •••• ••••
                      </div>
                    </div>

                    {paymentInfo?.currency === 'EUR' && (
                      <div style={{ 
                        background: '#e8f5e9', 
                        padding: '15px', 
                        borderRadius: '8px',
                        border: '1px solid #4caf50',
                        marginBottom: '15px'
                      }}>
                        <label style={{ fontSize: '0.85rem', color: '#2e7d32', display: 'block', marginBottom: '5px' }}>
                          <i className="fas fa-mobile-alt"></i> Multibanco available
                        </label>
                        <div style={{ fontSize: '0.8rem', color: '#388e3c' }}>
                          ✓ Payment by Multibanco reference
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    type="button"
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: '#635bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'not-allowed',
                      opacity: 0.7
                    }}
                    disabled
                  >
                    <i className="fas fa-lock"></i> Pay ${paymentInfo?.amount || '0.00'}
                  </button>

                  <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#999'
                  }}>
                    <i className="fas fa-shield-alt"></i> Secure payment processed by Stripe
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: '15px', 
                padding: '15px', 
                background: '#d1ecf1', 
                borderRadius: '8px',
                border: '1px solid #bee5eb'
              }}>
                <i className="fas fa-info-circle" style={{ color: '#0c5460' }}></i>
                <strong style={{ color: '#0c5460' }}> Why doesn't the iframe load?</strong>
                <p style={{ fontSize: '0.85rem', color: '#0c5460', margin: '5px 0 0 0' }}>
                  Stripe purposely blocks iframes for security (protection against clickjacking). 
                  The mockup above shows what it will look like. Use the button to open the real page in a new tab.
                </p>
              </div>
              <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#666' }}>
                <strong>Payment URL:</strong><br/>
                <div className="url-display" style={{ marginTop: '5px', fontSize: '0.75rem' }}>
                  {paymentUrl}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paymentUrl)
                    alert('URL copiada!')
                  }}
                  className="btn"
                  style={{ 
                    marginTop: '10px', 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                  }}
                >
                  <i className="fas fa-copy"></i> Copiar URL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

