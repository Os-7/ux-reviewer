'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { History, ExternalLink, Loader2, Trash2, AlertCircle, FileSearch } from 'lucide-react'
import { formatDate, getScoreColor, getScoreBgColor, cn } from '@/lib/utils'

interface ReviewSummary {
  id: string
  url: string
  title: string
  score: number
  createdAt: string
}

export default function HistoryPage() {
  const [reviews, setReviews] = useState<ReviewSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      const response = await fetch('/api/reviews')
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      setReviews(data.reviews)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  async function deleteReview(id: string) {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    setDeleting(id)
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete review')
      }
      setReviews(reviews.filter(r => r.id !== id))
    } catch (err) {
      alert('Failed to delete review')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <History className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Review History</h1>
          <p className="text-slate-600">Your last 5 website UX reviews</p>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200 mb-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="card text-center py-12">
          <FileSearch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">No Reviews Yet</h2>
          <p className="text-slate-600 mb-6">
            Start by analyzing a website to see your review history here.
          </p>
          <Link href="/" className="btn-primary">
            Analyze Your First Website
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/review/${review.id}`}
                    className="text-lg font-semibold text-slate-800 hover:text-primary-600 transition-colors line-clamp-1"
                  >
                    {review.title}
                  </Link>
                  <a 
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-primary-600 flex items-center gap-1 mt-1"
                  >
                    <span className="truncate">{review.url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                  <p className="text-sm text-slate-400 mt-2">
                    {formatDate(review.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className={cn('text-center px-4 py-2 rounded-lg', getScoreBgColor(review.score))}>
                    <div className={cn('text-2xl font-bold', getScoreColor(review.score))}>
                      {review.score}
                    </div>
                    <div className="text-xs text-slate-500">Score</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/review/${review.id}`}
                      className="btn-primary text-sm py-2"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => deleteReview(review.id)}
                      disabled={deleting === review.id}
                      className="btn-secondary text-sm py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === review.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        <Trash2 className="w-4 h-4 mx-auto" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="btn-primary">
          Analyze Another Website
        </Link>
      </div>
    </div>
  )
}
