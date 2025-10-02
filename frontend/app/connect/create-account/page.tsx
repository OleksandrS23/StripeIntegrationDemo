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
      setError(err.response?.data?.message || err.message || 'Error creating account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      title="Create Connect Account"
      description="Create a new seller account on the platform"
    >
      <div className="max-w-3xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-bold text-gray-800">
                <span className="text-2xl">📧</span>
                Seller Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 text-base font-medium hover:border-purple-300"
                placeholder="seller@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-bold text-gray-800">
                <span className="text-2xl">🌍</span>
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 text-base font-medium hover:border-purple-300 bg-white cursor-pointer"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="BR">🇧🇷 Brazil</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="GB">🇬🇧 United Kingdom</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="FR">🇫🇷 France</option>
                <option value="PT">🇵🇹 Portugal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-bold text-gray-800">
                <span className="text-2xl">⚙️</span>
                Account Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'express' | 'standard' | 'custom',
                  })
                }
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 text-base font-medium hover:border-purple-300 bg-white cursor-pointer"
              >
                <option value="express">Express (Recommended - Simpler)</option>
                <option value="standard">Standard (More Control)</option>
                <option value="custom">Custom (Maximum Customization)</option>
              </select>
            </div>

            <Button type="submit" isLoading={loading} fullWidth>
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">➕</span>
                Create Connect Account
              </span>
            </Button>
          </form>

          {error && (
            <div className="mt-8">
              <Alert type="error" title="Error creating account">
                {error}
              </Alert>
            </div>
          )}

          {result && (
            <div className="mt-8">
              <Alert type="success" title="Account created successfully!">
                <div className="space-y-3 mt-4">
                  <div className="bg-white/50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Account ID:</p>
                    <code className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-lg font-mono text-sm font-bold text-purple-800 block">
                      {result.id}
                    </code>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600">Email</p>
                      <p className="font-bold text-gray-800">{result.email}</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600">Country</p>
                      <p className="font-bold text-gray-800">{result.country}</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600">Type</p>
                      <p className="font-bold text-gray-800 capitalize">{result.type}</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600">Status</p>
                      <p className="font-bold">
                        {result.charges_enabled ? '✅ Active' : '⏳ Pending Onboarding'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href={`/connect/onboarding?accountId=${result.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                  >
                    <span>→</span>
                    Go to Onboarding
                  </a>
                </div>
              </Alert>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2 text-purple-700">Express</h3>
            <p className="text-sm text-gray-600">
              Simplified process, ideal for getting started quickly
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2 text-indigo-700">Standard</h3>
            <p className="text-sm text-gray-600">
              More control over the user experience
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-3">🔧</div>
            <h3 className="font-bold text-lg mb-2 text-pink-700">Custom</h3>
            <p className="text-sm text-gray-600">
              Total control, requires complete implementation
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

