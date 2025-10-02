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
      console.log('📦 Resposta do payment link:', result)
      
      if (response.ok && result.success) {
        const data = result.data
        showResult('linkDirectResult', `
          <strong>✅ Payment Link criado!</strong><br/>
          <strong>Link ID:</strong> <code>${data.paymentLinkId}</code><br/>
          <a href="${data.url}" target="_blank" class="btn" style="margin-top: 15px; display: inline-block;">
            <i class="fas fa-link"></i> Abrir Payment Link
          </a>
          <div style="margin-top: 15px; font-size: 0.9rem;">
            <strong>URL:</strong><br/>
            <div class="url-display">${data.url}</div>
            <small style="color: #666; display: block; margin-top: 10px;">
              Compartilhe este link via WhatsApp, email, SMS, etc.
            </small>
          </div>
        `, true)
      } else {
        showResult('linkDirectResult', `<strong>❌ Erro:</strong> ${result.error || result.message || 'Erro ao criar payment link'}`, false)
      }
    } catch (error: any) {
      showResult('linkDirectResult', `<strong>❌ Erro:</strong> ${error.message}`, false)
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
      console.log('📦 Resposta do payment link com taxa:', result)
      
      if (response.ok && result.success) {
        const data = result.data
        showResult('linkFeeResult', `
          <strong>✅ Payment Link com Taxa criado!</strong><br/>
          <strong>Link ID:</strong> <code>${data.paymentLinkId}</code><br/>
          <strong>Taxa Plataforma:</strong> $${(applicationFeeAmount / 100).toFixed(2)}<br/>
          <a href="${data.url}" target="_blank" class="btn" style="margin-top: 15px; display: inline-block;">
            <i class="fas fa-link"></i> Abrir Payment Link
          </a>
          <div style="margin-top: 15px; font-size: 0.9rem;">
            <strong>URL:</strong><br/>
            <div class="url-display">${data.url}</div>
          </div>
        `, true)
      } else {
        showResult('linkFeeResult', `<strong>❌ Erro:</strong> ${result.error || result.message || 'Erro ao criar payment link'}`, false)
      }
    } catch (error: any) {
      showResult('linkFeeResult', `<strong>❌ Erro:</strong> ${error.message}`, false)
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
        <p>Link direto para pagamento - WhatsApp, email, SMS</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <a href="/" className="btn" style={{ marginBottom: '20px', background: '#6c757d', display: 'inline-block', width: 'auto', padding: '10px 20px' }}>
          <i className="fas fa-arrow-left"></i> Voltar
        </a>

        <div className="dashboard">
          {/* Payment Link Direto ao Vendedor */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-link"></i>
              <h2>Payment Link - Direto ao Vendedor</h2>
            </div>

            <div className="info">
              <i className="fas fa-info-circle"></i>
              <strong>Recomendado:</strong> Cliente paga diretamente ao vendedor (sem taxas automáticas)
            </div>

            <div className="form-group">
              <label htmlFor="linkAmount">
                <i className="fas fa-dollar-sign"></i> Valor (centavos)
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
                <i className="fas fa-link"></i> Conta Conectada
              </label>
              <input
                type="text"
                id="linkAccountId"
                placeholder="acct_1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkProductName">
                <i className="fas fa-box"></i> Nome do Produto
              </label>
              <input
                type="text"
                id="linkProductName"
                defaultValue="Produto Teste"
                placeholder="Produto Teste"
              />
            </div>

            <button 
              type="button" 
              className={`btn ${loading === 'direct' ? 'loading' : ''}`}
              onClick={createPaymentLinkDirect}
              disabled={loading === 'direct'}
              style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
            >
              {loading !== 'direct' && <><i className="fas fa-link"></i> Gerar Payment Link</>}
            </button>

            <div id="linkDirectResult" className="result" style={{ display: 'none' }}></div>
          </div>

          {/* Payment Link com Taxa da Plataforma */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-percent"></i>
              <h2>Payment Link - Com Taxa</h2>
            </div>

            <div className="info">
              <i className="fas fa-info-circle"></i>
              <strong>Via Plataforma:</strong> Pagamento vai para sua conta principal, depois transfere para o vendedor
            </div>

            <div className="form-group">
              <label htmlFor="linkFeeAmount">
                <i className="fas fa-dollar-sign"></i> Valor (centavos)
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
                <i className="fas fa-link"></i> Conta Conectada
              </label>
              <input
                type="text"
                id="linkFeeAccountId"
                placeholder="acct_1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkFee">
                <i className="fas fa-percentage"></i> Taxa da Plataforma (centavos)
              </label>
              <input
                type="number"
                id="linkFee"
                defaultValue="200"
                min="0"
                placeholder="200"
              />
              <small style={{ color: '#666' }}>Ex: 200 = $2.00 de taxa</small>
            </div>

            <div className="form-group">
              <label htmlFor="linkFeeProductName">
                <i className="fas fa-box"></i> Nome do Produto
              </label>
              <input
                type="text"
                id="linkFeeProductName"
                defaultValue="Produto Teste"
                placeholder="Produto Teste"
              />
            </div>

            <button 
              type="button" 
              className={`btn ${loading === 'withFee' ? 'loading' : ''}`}
              onClick={createPaymentLinkWithFee}
              disabled={loading === 'withFee'}
              style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }}
            >
              {loading !== 'withFee' && <><i className="fas fa-link"></i> Gerar Link com Taxa</>}
            </button>

            <div id="linkFeeResult" className="result" style={{ display: 'none' }}></div>
          </div>
        </div>
      </div>
    </>
  )
}
