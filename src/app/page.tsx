'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, AlertCircle, CheckCircle2, ArrowRight, Sparkles, Shield, Clock } from 'lucide-react'
import { isValidUrl } from '@/lib/utils'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate URL
    let processedUrl = url.trim()
    if (!processedUrl) {
      setError('Please enter a website URL')
      return
    }

    // Add https if no protocol
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl
    }

    if (!isValidUrl(processedUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: processedUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze website')
      }

      // Redirect to review page
      router.push(`/review/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: '8-12 UX issues identified and categorized automatically',
    },
    {
      icon: Shield,
      title: 'Detailed Proof',
      description: 'Each issue includes evidence from your actual page content',
    },
    {
      icon: Clock,
      title: 'Before/After Suggestions',
      description: 'Actionable recommendations for your top 3 issues',
    },
  ]

  const steps = [
    { number: 1, text: 'Paste any website URL' },
    { number: 2, text: 'We analyze UX elements' },
    { number: 3, text: 'Get detailed review with fixes' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          AI-Powered <span className="text-primary-600">UX Review</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Get instant, actionable UX insights for any website. Identify issues, understand why they matter, and see exactly how to fix them.
        </p>
      </div>

      {/* Steps */}
      <div className="flex justify-center gap-4 md:gap-8 mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                {step.number}
              </span>
              <span className="text-sm text-slate-600 hidden md:block">{step.text}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-300 ml-4 hidden md:block" />
            )}
          </div>
        ))}
      </div>

      {/* URL Input Form */}
      <div className="card mb-12">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError('')
              }}
              placeholder="Enter website URL (e.g., example.com)"
              className="input pl-12 text-lg"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing website...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze UX
              </>
            )}
          </button>
        </form>

        {loading && (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center gap-3 text-primary-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <div>
                <p className="font-medium">Analysis in progress...</p>
                <p className="text-sm text-primary-600">
                  Fetching page content, capturing elements, and generating AI insights. This may take 30-60 seconds.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div key={feature.title} className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          )
        })}
      </div>

      {/* What We Check */}
      <div className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">
          What We Analyze
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Clarity', 'Layout', 'Navigation', 'Accessibility', 'Trust'].map((category) => (
            <div
              key={category}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-slate-700">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
