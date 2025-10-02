'use client'

import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const createCheckout = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    
    const amount = parseInt((document.getElementById('checkoutAmount') as HTMLInputElement).value)
    const currency = (document.getElementById('checkoutCurrency') as HTMLSelectElement).value
    const connectedAccountId = (document.getElementById('checkoutAccountId') as HTMLInputElement).value
    const applicationFeeAmount = parseInt((document.getElementById('checkoutFee') as HTMLInputElement).value)
    const productName = (document.getElementById('productName') as HTMLInputElement).value

    try {
      const response = await fetch(`${API_URL}/stripe/checkout/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          currency, 
          connectedAccountId,
          applicationFeeAmount,
          productName
        })
      })
      const data = await response.json()
      console.log('📦 Checkout response:', data)
      
      if (response.ok && data.success) {
        console.log('✅ Success! SessionId:', data.data.sessionId, 'URL:', data.data.url)
        setResult(data.data)
      } else {
        setError(data.error || data.message || 'Error creating checkout')
      }
    } catch (err: any) {
      console.error('❌ Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="header">
        <h1>
          <i className="fas fa-shopping-cart"></i> Stripe Checkout
        </h1>
        <p>Payment page hosted by Stripe</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <a href="/" className="btn" style={{ marginBottom: '20px', background: '#6c757d', display: 'inline-block', width: 'auto', padding: '10px 20px' }}>
          <i className="fas fa-arrow-left"></i> Back
        </a>

        <div className="card">
          <div className="card-header">
            <i className="fas fa-external-link-alt"></i>
            <h2>Create Checkout Session</h2>
          </div>

          <div className="info">
            <i className="fas fa-info-circle"></i>
            <strong>Advantages:</strong> Secure page hosted by Stripe, responsive design, multiple payment methods.
          </div>

          <div className="form-group">
            <label htmlFor="checkoutAmount">
              <i className="fas fa-dollar-sign"></i> Amount (cents)
            </label>
            <input
              type="number"
              id="checkoutAmount"
              defaultValue="2000"
              min="50"
              placeholder="2000"
            />
            <small style={{ color: '#666' }}>Ex: 2000 = $20.00</small>
          </div>

          <div className="form-group">
            <label htmlFor="checkoutCurrency">
              <i className="fas fa-coins"></i> Currency
            </label>
            <select id="checkoutCurrency">
              <option value="usd">USD - US Dollar</option>
              <option value="brl">BRL - Brazilian Real</option>
              <option value="eur">EUR - Euro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="checkoutAccountId">
              <i className="fas fa-link"></i> Connected Account
            </label>
            <input
              type="text"
              id="checkoutAccountId"
              placeholder="acct_1234567890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="checkoutFee">
              <i className="fas fa-percentage"></i> Platform Fee (cents)
            </label>
            <input
              type="number"
              id="checkoutFee"
              defaultValue="200"
              min="0"
              placeholder="200"
            />
            <small style={{ color: '#666' }}>Ex: 200 = $2.00 fee</small>
          </div>

          <div className="form-group">
            <label htmlFor="productName">
              <i className="fas fa-box"></i> Product Name
            </label>
            <input
              type="text"
              id="productName"
              defaultValue="Test Product"
              placeholder="Test Product"
            />
          </div>

          <button 
            type="button" 
            className={`btn ${loading ? 'loading' : ''}`}
            onClick={createCheckout}
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }}
          >
            {!loading && <><i className="fas fa-shopping-cart"></i> Create Checkout Session</>}
          </button>

          {error && (
            <div className="result error" style={{ display: 'block' }}>
              <strong>❌ Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="result success" style={{ display: 'block' }}>
              <strong>✅ Checkout Session created!</strong><br/>
              <strong>Session ID:</strong> <code>{result.sessionId}</code><br/>
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn" 
                style={{ marginTop: '15px', display: 'inline-block' }}
              >
                <i className="fas fa-external-link-alt"></i> Open Payment Page
              </a>
              <div style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                <strong>URL:</strong><br/>
                <div className="url-display">{result.url}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
