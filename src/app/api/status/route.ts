import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { testLLMConnection } from '@/lib/llm'

export async function GET() {
  const status = {
    backend: { status: 'healthy', message: 'API is running' },
    database: { status: 'unknown', message: 'Checking...' },
    llm: { status: 'unknown', message: 'Checking...', model: null as string | null },
    timestamp: new Date().toISOString(),
  }

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    const reviewCount = await prisma.review.count()
    status.database = {
      status: 'healthy',
      message: `Connected. ${reviewCount} reviews stored.`,
    }
  } catch (error) {
    status.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
    }
  }

  // Check LLM connection
  try {
    const llmStatus = await testLLMConnection()
    status.llm = {
      status: llmStatus.success ? 'healthy' : 'error',
      message: llmStatus.message,
      model: llmStatus.model || null,
    }
  } catch (error) {
    status.llm = {
      status: 'error',
      message: error instanceof Error ? error.message : 'LLM connection failed',
      model: null,
    }
  }

  // Determine overall health
  const allHealthy = 
    status.backend.status === 'healthy' && 
    status.database.status === 'healthy' && 
    status.llm.status === 'healthy'

  return NextResponse.json({
    ...status,
    overall: allHealthy ? 'healthy' : 'degraded',
  })
}
