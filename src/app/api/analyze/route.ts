import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scrapeWebsite } from '@/lib/scraper'
import { analyzeUX } from '@/lib/llm'
import { isValidUrl } from '@/lib/utils'

export const maxDuration = 60 // Allow up to 60 seconds for analysis

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.' },
        { status: 400 }
      )
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key is not configured. Please set GROQ_API_KEY in environment variables.' },
        { status: 500 }
      )
    }

    // Step 1: Scrape the website
    let scrapedContent
    try {
      scrapedContent = await scrapeWebsite(url)
    } catch (error) {
      console.error('Scraping error:', error)
      return NextResponse.json(
        { error: `Failed to fetch website: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 400 }
      )
    }

    // Step 2: Analyze with LLM
    let analysis
    try {
      analysis = await analyzeUX(scrapedContent)
    } catch (error) {
      console.error('LLM analysis error:', error)
      return NextResponse.json(
        { error: `Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Step 3: Save to database
    const review = await prisma.review.create({
      data: {
        url,
        title: scrapedContent.title,
        screenshot: '', // We'll add screenshot support later if needed
        issues: JSON.stringify(analysis.issues),
        suggestions: JSON.stringify(analysis.suggestions),
        score: analysis.score,
      },
    })

    return NextResponse.json({
      id: review.id,
      url: review.url,
      title: review.title,
      score: review.score,
      issueCount: analysis.issues.length,
      message: 'Analysis complete',
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during analysis' },
      { status: 500 }
    )
  }
}
