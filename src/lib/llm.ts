import Groq from 'groq-sdk'
import { ScrapedContent, summarizeContent } from './scraper'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface UXIssue {
  id: string
  category: 'clarity' | 'layout' | 'navigation' | 'accessibility' | 'trust'
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  proof: string
  element?: string
}

export interface BeforeAfterSuggestion {
  issueId: string
  title: string
  before: string
  after: string
  explanation: string
}

export interface UXAnalysis {
  score: number
  issues: UXIssue[]
  suggestions: BeforeAfterSuggestion[]
  summary: string
}

export async function analyzeUX(content: ScrapedContent): Promise<UXAnalysis> {
  const contentSummary = summarizeContent(content)

  const systemPrompt = `You are a senior UX designer and accessibility expert. Your task is to analyze websites and provide detailed, actionable UX feedback.

You must analyze the provided website content and identify 8-12 UX issues across these categories:
- clarity: Is the content clear and understandable?
- layout: Is the visual hierarchy and spacing effective?
- navigation: Can users easily find what they need?
- accessibility: Does it follow WCAG guidelines?
- trust: Does it build credibility and trust?

For each issue:
1. Provide a clear title
2. Explain why it's a problem
3. Quote the exact element or text that demonstrates the issue (proof)

Also provide before/after suggestions for the top 3 most impactful issues.

Respond with ONLY valid JSON, no markdown code blocks.`

  const userPrompt = `Analyze this website for UX issues:

${contentSummary}

Respond with a JSON object in this exact format:
{
  "score": <number 0-100 representing overall UX quality>,
  "summary": "<2-3 sentence summary of overall UX quality>",
  "issues": [
    {
      "id": "<unique-id like issue-1>",
      "category": "<clarity|layout|navigation|accessibility|trust>",
      "severity": "<high|medium|low>",
      "title": "<short issue title>",
      "description": "<why this is a UX problem>",
      "proof": "<exact text, element, or observation from the page that proves this issue>",
      "element": "<optional: specific HTML element or section>"
    }
  ],
  "suggestions": [
    {
      "issueId": "<matches an issue id>",
      "title": "<suggestion title>",
      "before": "<current problematic text/element>",
      "after": "<improved version>",
      "explanation": "<why this is better>"
    }
  ]
}

Provide exactly 8-12 issues and exactly 3 before/after suggestions.`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  })

  let responseText = completion.choices[0]?.message?.content || '{}'
  
  // Clean up the response - remove markdown code blocks if present
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  
  try {
    const analysis = JSON.parse(responseText) as UXAnalysis
    
    // Validate and ensure we have required fields
    if (!analysis.issues || !Array.isArray(analysis.issues)) {
      throw new Error('Invalid response: missing issues array')
    }
    
    if (!analysis.suggestions || !Array.isArray(analysis.suggestions)) {
      analysis.suggestions = []
    }
    
    if (typeof analysis.score !== 'number') {
      analysis.score = 50
    }
    
    if (!analysis.summary) {
      analysis.summary = 'Analysis complete.'
    }

    return analysis
  } catch (error) {
    console.error('Failed to parse LLM response:', responseText)
    throw new Error('Failed to parse AI analysis response')
  }
}

export async function testLLMConnection(): Promise<{ success: boolean; message: string; model?: string }> {
  try {
    if (!process.env.GROQ_API_KEY) {
      return {
        success: false,
        message: 'GROQ_API_KEY not configured',
      }
    }
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 10,
    })
    
    return {
      success: true,
      message: 'Connected to Groq',
      model: 'llama-3.3-70b-versatile',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to Groq',
    }
  }
}
