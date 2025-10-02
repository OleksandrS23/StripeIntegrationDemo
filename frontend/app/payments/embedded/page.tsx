'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key'

declare global {
  interface Window {
    Stripe: any;
  }
}

export default function EmbeddedCheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [checkoutMounted, setCheckoutMounted] = useState(false)

  const createEmbeddedCheckout = async () => {
    setLoading(true)
    setError('')
    setClientSecret('')
    setCheckoutMounted(false)
    
    const amount = parseInt((document.getElementById('embAmount') as HTMLInputElement).value)
    const currency = (document.getElementById('embCurrency') as HTMLSelectElement).value
    const connectedAccountId = (document.getElementById('embAccountId') as HTMLInputElement).value
    const applicationFeeAmount = parseInt((document.getElementById('embFee') as HTMLInputElement).value)
    const productName = (document.getElementById('embProductName') as HTMLInputElement).value

    try {
      const response = await fetch(`${API_URL}/stripe/checkout/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          currency, 
          connectedAccountId,
          applicationFeeAmount,
          productName,
          uiMode: 'embedded'
        })
      })
      
      const result = await response.json()
      console.log('📦 Resposta Embedded Checkout:', result)
      
      if (response.ok && result.success && result.data.clientSecret) {
        setClientSecret(result.data.clientSecret)
        setPaymentInfo({
          id: result.data.sessionId,
          amount: amount / 100,
          currency: currency.toUpperCase(),
          fee: applicationFeeAmount / 100,
          seller: (amount - applicationFeeAmount) / 100
        })
      } else {
        setError(result.error || result.message || 'Erro ao criar checkout embedded')
      }
    } catch (err: any) {
      console.error('❌ Erro:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (clientSecret && window.Stripe) {
      mountEmbeddedCheckout()
    }
  }, [clientSecret])

  const mountEmbeddedCheckout = async () => {
    try {
      const stripe = window.Stripe(STRIPE_PK)
      
      // Limpar completamente o container antes de montar
      const container = document.getElementById('checkout-container')
      if (container) {
        container.innerHTML = ''
      }
      
      const checkout = await stripe.initEmbeddedCheckout({
        clientSecret: clientSecret
      })

      checkout.mount('#checkout-container')
      setCheckoutMounted(true)
    } catch (error) {
      console.error('Erro ao montar checkout:', error)
      setError('Erro ao carregar checkout: ' + error.message)
    }
  }

  const clearCheckout = () => {
    setClientSecret('')
    setPaymentInfo(null)
    setError('')
    setCheckoutMounted(false)
    
    const container = document.getElementById('checkout-container')
    if (container) {
      container.innerHTML = ''
    }
  }

  return (
    <>
      <div className="header">
        <h1>
          <i className="fas fa-tablet-alt"></i> Stripe Embedded Checkout
        </h1>
        <p>Checkout integrado diretamente na sua página - sem redirects!</p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <a href="/" className="btn" style={{ marginBottom: '20px', background: '#6c757d', display: 'inline-block', width: 'auto', padding: '10px 20px' }}>
          <i className="fas fa-arrow-left"></i> Voltar
        </a>

        <div className="info" style={{ marginBottom: '20px' }}>
          <i className="fas fa-star"></i>
          <strong>Novidade!</strong> Com Embedded Checkout, o cliente permanece no seu site durante todo o processo de pagamento.
          Experiência mais integrada e profissional! 🎉
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: clientSecret ? '1fr 1.5fr' : '1fr', gap: '20px' }}>
          {/* Formulário */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-cog"></i>
              <h2>Configurar Pagamento</h2>
            </div>

            {!clientSecret && (
              <>
                <div className="form-group">
                  <label htmlFor="embAmount">
                    <i className="fas fa-dollar-sign"></i> Valor Total (centavos)
                  </label>
                  <input
                    type="number"
                    id="embAmount"
                    defaultValue="5000"
                    min="50"
                    placeholder="5000"
                  />
                  <small style={{ color: '#666' }}>Ex: 5000 = $50.00</small>
                </div>

                <div className="form-group">
                  <label htmlFor="embCurrency">
                    <i className="fas fa-coins"></i> Moeda
                  </label>
                  <select id="embCurrency">
                    <option value="eur">EUR - Euro (Com Multibanco 🇵🇹)</option>
                    <option value="usd">USD - Dólar Americano</option>
                    <option value="brl">BRL - Real Brasileiro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="embAccountId">
                    <i className="fas fa-user"></i> Conta do Vendedor
                  </label>
                  <input
                    type="text"
                    id="embAccountId"
                    placeholder="acct_1234567890"
                  />
                  <small style={{ color: '#666' }}>ID da conta Connect do vendedor</small>
                </div>

                <div className="form-group">
                  <label htmlFor="embFee">
                    <i className="fas fa-percentage"></i> Sua Taxa da Plataforma (centavos)
                  </label>
                  <input
                    type="number"
                    id="embFee"
                    defaultValue="500"
                    min="0"
                    placeholder="500"
                  />
                  <small style={{ color: '#666' }}>Ex: 500 = $5.00 de comissão</small>
                </div>

                <div className="form-group">
                  <label htmlFor="embProductName">
                    <i className="fas fa-box"></i> Nome do Produto/Serviço
                  </label>
                  <input
                    type="text"
                    id="embProductName"
                    defaultValue="Produto Premium"
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
                      <span>Cliente paga:</span>
                      <strong>$50.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#635bff' }}>
                      <span>Sua taxa:</span>
                      <strong>- $5.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px', borderTop: '1px solid #dee2e6' }}>
                      <span>Vendedor recebe:</span>
                      <strong style={{ color: '#28a745' }}>$45.00</strong>
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className={`btn ${loading ? 'loading' : ''}`}
                  onClick={createEmbeddedCheckout}
                  disabled={loading}
                  style={{ background: 'linear-gradient(135deg, #635bff 0%, #5a52e8 100%)' }}
                >
                  {!loading && <><i className="fas fa-rocket"></i> Criar Checkout Embedded</>}
                </button>
              </>
            )}

            {clientSecret && (
              <>
                <div className="result success" style={{ display: 'block', marginBottom: '15px' }}>
                  <strong>✅ Checkout Embedded criado!</strong><br/>
                  <strong>Session ID:</strong> <code style={{ fontSize: '0.85rem' }}>{paymentInfo?.id}</code><br/>
                  <div style={{ marginTop: '10px', padding: '10px', background: '#e8f5e9', borderRadius: '4px' }}>
                    <small>
                      Cliente paga: <strong>${paymentInfo?.amount}</strong> {paymentInfo?.currency}<br/>
                      Sua comissão: <strong style={{ color: '#635bff' }}>${paymentInfo?.fee}</strong><br/>
                      Vendedor recebe: <strong style={{ color: '#28a745' }}>${paymentInfo?.seller}</strong>
                    </small>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn"
                  onClick={clearCheckout}
                  style={{ background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)' }}
                >
                  <i className="fas fa-redo"></i> Criar Novo Pagamento
                </button>
              </>
            )}

            {error && (
              <div className="result error" style={{ display: 'block', marginTop: '15px' }}>
                <strong>❌ Erro:</strong> {error}
              </div>
            )}
          </div>

          {/* Embedded Checkout Container */}
          {clientSecret && (
            <div className="card">
              <div className="card-header">
                <i className="fas fa-credit-card"></i>
                <h2>Checkout - Experiência do Cliente</h2>
              </div>
              
              <div className="info" style={{ marginBottom: '15px' }}>
                <i className="fas fa-check-circle"></i>
                <strong>Checkout Integrado!</strong> O cliente permanece na sua página durante todo o processo.
              </div>

              {!checkoutMounted && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666',
                  minHeight: '400px'
                }}>
                  <div className="btn loading" style={{ display: 'inline-block' }}></div>
                  <p style={{ marginTop: '15px' }}>Carregando checkout...</p>
                </div>
              )}
              
              <div 
                id="checkout-container"
                style={{
                  minHeight: '400px',
                  position: 'relative',
                  display: checkoutMounted ? 'block' : 'none'
                }}
              ></div>
            </div>
          )}
        </div>

        {!clientSecret && (
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <i className="fas fa-info-circle"></i>
              <h2>Vantagens do Embedded Checkout</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <i className="fas fa-home" style={{ fontSize: '3rem', color: '#635bff', marginBottom: '10px' }}></i>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Sem Redirect</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Cliente permanece no seu site durante todo o processo
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <i className="fas fa-paint-brush" style={{ fontSize: '3rem', color: '#28a745', marginBottom: '10px' }}></i>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Mais Integrado</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Experiência visual consistente com sua marca
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <i className="fas fa-shield-alt" style={{ fontSize: '3rem', color: '#007bff', marginBottom: '10px' }}></i>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>100% Seguro</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Todos os dados são processados pelo Stripe de forma segura
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

