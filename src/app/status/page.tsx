'use client'

import { useEffect, useState } from 'react'
import { Activity, Database, Brain, Server, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceStatus {
  status: 'healthy' | 'error' | 'unknown'
  message: string
  model?: string | null
}

interface StatusResponse {
  backend: ServiceStatus
  database: ServiceStatus
  llm: ServiceStatus
  overall: string
  timestamp: string
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchStatus() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/status')
      if (!response.ok) {
        throw new Error('Failed to fetch status')
      }
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const services = status ? [
    {
      name: 'Backend API',
      icon: Server,
      status: status.backend,
    },
    {
      name: 'Database',
      icon: Database,
      status: status.database,
    },
    {
      name: 'LLM (Groq)',
      icon: Brain,
      status: status.llm,
    },
  ] : []

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">System Status</h1>
            <p className="text-slate-600">Health check for all services</p>
          </div>
        </div>
        
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Overall Status */}
      {status && (
        <div className={cn(
          'card mb-8 border-2',
          status.overall === 'healthy' 
            ? 'border-green-200 bg-green-50' 
            : 'border-yellow-200 bg-yellow-50'
        )}>
          <div className="flex items-center gap-4">
            {status.overall === 'healthy' ? (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-yellow-500" />
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {status.overall === 'healthy' ? 'All Systems Operational' : 'Some Services Degraded'}
              </h2>
              <p className="text-slate-600">
                Last checked: {new Date(status.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border-red-200 mb-8">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !status && (
        <div className="card text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-slate-600">Checking service health...</p>
        </div>
      )}

      {/* Service Cards */}
      {status && (
        <div className="space-y-4">
          {services.map((service) => {
            const Icon = service.icon
            const isHealthy = service.status.status === 'healthy'
            
            return (
              <div key={service.name} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      isHealthy ? 'bg-green-100' : 'bg-red-100'
                    )}>
                      <Icon className={cn(
                        'w-6 h-6',
                        isHealthy ? 'text-green-600' : 'text-red-600'
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{service.name}</h3>
                      <p className="text-sm text-slate-600">{service.status.message}</p>
                      {service.status.model && (
                        <p className="text-xs text-slate-500 mt-1">
                          Model: {service.status.model}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                    isHealthy 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  )}>
                    {isHealthy ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Healthy
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Error
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Section */}
      <div className="card mt-8 bg-slate-50">
        <h3 className="font-semibold text-slate-800 mb-2">About This Page</h3>
        <p className="text-sm text-slate-600">
          This status page shows the health of the backend API, database connection, 
          and LLM integration. If any service shows an error, some features may not 
          work correctly. The LLM service uses Groq's Llama 3.3 70B model for UX analysis (FREE and fast!).
        </p>
      </div>
    </div>
  )
}
