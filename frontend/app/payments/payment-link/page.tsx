'use client'

import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function PaymentLinkPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const showResult = (elementId: string, message: string, isSuccess: boolean) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.className = `result ${isSuccess ? 'success' : 'error'}`
      element.innerHTML = message
      element.style.display = 'block'
    }
  }

  const createPaymentLinkDirect = async () => {
    setLoading('direct')
    const amount = parseInt((document.getElementById('linkAmount') as HTMLInputElement).value)
    const productName = (document.getElementById('linkProductName') as HTMLInputElement).value
    const connectedAccountId = (document.getElementById('linkAccountId') as HTMLInputElement).value

    try {
      const response = await fetch(`${API_URL}/stripe/checkout/payment-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, productName, connectedAccountId })
      })
      const result = await response.json()
      console.log('📦 Payment link response:', result)
      
      if (response.ok && result.success) {
        const data = result.data
        showResult('linkDirectResult', `
          <strong>✅ Payment Link created!</strong><br/>
          <strong>Link ID:</strong> <code>${data.paymentLinkId}</code><br/>
          <a href="${data.url}" target="_blank" class="btn" style="margin-top: 15px; display: inline-block;">
            <i class="fas fa-link"></i> Open Payment Link
          </a>
          <div style="margin-top: 15px; font-size: 0.9rem;">
            <strong>URL:</strong><br/>
            <div class="url-display">${data.url}</div>
            <small style="color: #666; display: block; margin-top: 10px;">
              Share this link via WhatsApp, email, SMS, etc.
            </small>
          </div>
        `, true)
      } else {
        showResult('linkDirectResult', `<strong>❌ Error:</strong> ${result.error || result.message || 'Error creating payment link'}`, false)
      }
    } catch (error: any) {
      showResult('linkDirectResult', `<strong>❌ Error:</strong> ${error.message}`, false)
    } finally {
      setLoading(null)
    }
  }

  const createPaymentLinkWithFee = async () => {
    setLoading('withFee')
    const amount = parseInt((document.getElementById('linkFeeAmount') as HTMLInputElement).value)
    const applicationFeeAmount = parseInt((document.getElementById('linkFee') as HTMLInputElement).value)
    const productName = (document.getElementById('linkFeeProductName') as HTMLInputElement).value
    const connectedAccountId = (document.getElementById('linkFeeAccountId') as HTMLInputElement).value

    try {
      const response = await fetch(`${API_URL}/stripe/checkout/payment-links/with-fee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, applicationFeeAmount, productName, connectedAccountId })
      })
      const result = await response.json()
      console.log('📦 Payment link with fee response:', result)
      
      if (response.ok && result.success) {
        const data = result.data
        showResult('linkFeeResult', `
          <strong>✅ Payment Link with Fee created!</strong><br/>
          <strong>Link ID:</strong> <code>${data.paymentLinkId}</code><br/>
          <strong>Platform Fee:</strong> $${(applicationFeeAmount / 100).toFixed(2)}<br/>
          <a href="${data.url}" target="_blank" class="btn" style="margin-top: 15px; display: inline-block;">
            <i class="fas fa-link"></i> Open Payment Link
          </a>
          <div style="margin-top: 15px; font-size: 0.9rem;">
            <strong>URL:</strong><br/>
            <div class="url-display">${data.url}</div>
          </div>
        `, true)
      } else {
        showResult('linkFeeResult', `<strong>❌ Error:</strong> ${result.error || result.message || 'Error creating payment link'}`, false)
      }
    } catch (error: any) {
      showResult('linkFeeResult', `<strong>❌ Error:</strong> ${error.message}`, false)
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="header">
        <h1>
          <i className="fas fa-link"></i> Payment Link
        </h1>
        <p>Direct payment link - WhatsApp, email, SMS</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <a href="/" className="btn" style={{ marginBottom: '20px', background: '#6c757d', display: 'inline-block', width: 'auto', padding: '10px 20px' }}>
          <i className="fas fa-arrow-left"></i> Back
        </a>

        <div className="dashboard">
          {/* Direct Payment Link to Seller */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-link"></i>
              <h2>Payment Link - Direct to Seller</h2>
            </div>

            <div className="info">
              <i className="fas fa-info-circle"></i>
              <strong>Recommended:</strong> Customer pays directly to the seller (no automatic fees)
            </div>

            <div className="form-group">
              <label htmlFor="linkAmount">
                <i className="fas fa-dollar-sign"></i> Amount (cents)
              </label>
              <input
                type="number"
                id="linkAmount"
                defaultValue="2000"
                min="50"
                placeholder="2000"
              />
              <small style={{ color: '#666' }}>Ex: 2000 = $20.00</small>
            </div>

            <div className="form-group">
              <label htmlFor="linkAccountId">
                <i className="fas fa-link"></i> Connected Account
              </label>
              <input
                type="text"
                id="linkAccountId"
                placeholder="acct_1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkProductName">
                <i className="fas fa-box"></i> Product Name
              </label>
              <input
                type="text"
                id="linkProductName"
                defaultValue="Test Product"
                placeholder="Test Product"
              />
            </div>

            <button 
              type="button" 
              className={`btn ${loading === 'direct' ? 'loading' : ''}`}
              onClick={createPaymentLinkDirect}
              disabled={loading === 'direct'}
              style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
            >
              {loading !== 'direct' && <><i className="fas fa-link"></i> Generate Payment Link</>}
            </button>

            <div id="linkDirectResult" className="result" style={{ display: 'none' }}></div>
          </div>

          {/* Payment Link with Platform Fee */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-percent"></i>
              <h2>Payment Link - With Fee</h2>
            </div>

            <div className="info">
              <i className="fas fa-info-circle"></i>
              <strong>Via Platform:</strong> Payment goes to your main account, then transfers to the seller
            </div>

            <div className="form-group">
              <label htmlFor="linkFeeAmount">
                <i className="fas fa-dollar-sign"></i> Amount (cents)
              </label>
              <input
                type="number"
                id="linkFeeAmount"
                defaultValue="2000"
                min="50"
                placeholder="2000"
              />
              <small style={{ color: '#666' }}>Ex: 2000 = $20.00</small>
            </div>

            <div className="form-group">
              <label htmlFor="linkFeeAccountId">
                <i className="fas fa-link"></i> Connected Account
              </label>
              <input
                type="text"
                id="linkFeeAccountId"
                placeholder="acct_1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkFee">
                <i className="fas fa-percentage"></i> Platform Fee (cents)
              </label>
              <input
                type="number"
                id="linkFee"
                defaultValue="200"
                min="0"
                placeholder="200"
              />
              <small style={{ color: '#666' }}>Ex: 200 = $2.00 fee</small>
            </div>

            <div className="form-group">
              <label htmlFor="linkFeeProductName">
                <i className="fas fa-box"></i> Product Name
              </label>
              <input
                type="text"
                id="linkFeeProductName"
                defaultValue="Test Product"
                placeholder="Test Product"
              />
            </div>

            <button 
              type="button" 
              className={`btn ${loading === 'withFee' ? 'loading' : ''}`}
              onClick={createPaymentLinkWithFee}
              disabled={loading === 'withFee'}
              style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }}
            >
              {loading !== 'withFee' && <><i className="fas fa-link"></i> Generate Link with Fee</>}
            </button>

            <div id="linkFeeResult" className="result" style={{ display: 'none' }}></div>
          </div>
        </div>
      </div>
    </>
  )
}
