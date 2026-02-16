# Prompts Used During Development

This document records the key prompts I used while building this application with Cursor AI assistance.

## Project Architecture & Setup

```
Set up a Next.js 14 project with App Router for a UX analysis tool. 
Requirements:
- TypeScript with strict mode
- Tailwind CSS for styling
- Prisma ORM for database operations
- API routes for backend logic
- Server-side rendering where needed for SEO
```

## Web Scraping Implementation

```
Implement a web scraper using Cheerio that extracts structured data from any URL:
- Parse HTML and extract: title, meta description, heading hierarchy (h1-h6)
- Identify all form elements with their input fields and action URLs
- Extract button elements with text content and type attributes
- Map all anchor tags, distinguish internal vs external links
- Check images for alt text presence (accessibility audit)
- Extract navigation menu items from <nav> and header elements
- Get main content text, strip scripts/styles, limit to 5000 chars
- Return typed interface with all extracted data
Handle errors gracefully for unreachable URLs or malformed HTML.
```

## LLM Integration & Prompt Engineering

```
Create a Groq SDK integration for UX analysis:
- Use llama-3.3-70b-versatile model
- Implement structured JSON output using response_format
- Design system prompt as senior UX designer persona
- User prompt should include scraped content summary
- Response schema: score (0-100), issues array (8-12 items), suggestions array (3 items)
- Each issue needs: id, category enum, severity enum, title, description, proof string
- Handle API errors and implement retry logic
- Parse and validate JSON response before returning
```

## Database Schema Design

```
Design Prisma schema for PostgreSQL (Supabase):
- Review model with cuid() for ID generation
- Store issues and suggestions as JSON strings (flexible schema)
- Include nullable fields for optional data
- Add createdAt/updatedAt timestamps
- Configure connection pooling for serverless (pgbouncer)
- Support both direct and pooled connection URLs
```

## API Route Architecture

```
Create RESTful API routes in Next.js App Router:

POST /api/analyze:
- Validate URL format using URL constructor
- Check for configured API keys before processing
- Chain: scrape -> analyze -> save -> return ID
- Set maxDuration for serverless timeout (60s)
- Return structured error responses with status codes

GET /api/reviews:
- Fetch last 5 reviews ordered by createdAt desc
- Select only necessary fields for list view
- Handle empty state gracefully

GET /api/reviews/[id]:
- Fetch single review with all fields
- Parse JSON strings back to objects
- Return 404 for non-existent IDs

GET /api/status:
- Health check endpoint for monitoring
- Test database connection with raw query
- Test LLM connection with minimal prompt
- Return aggregate status with timestamps
```

## Frontend Components

```
Build React components with TypeScript:

ReviewPage:
- Fetch review data on mount using useEffect
- Parse issues by category for grouped display
- Implement tab switching between issues/suggestions
- Add severity indicators with appropriate icons
- Color-code scores: green (80+), yellow (60+), orange (40+), red (<40)

Export functionality:
- PDF: Use window.print() with print-optimized CSS media query
- Markdown: Generate formatted .md with proper heading hierarchy
- JSON: Blob download with proper MIME type
- Dropdown menu with click-outside detection using useRef
```

## Database Migration (SQLite to PostgreSQL)

```
Migrate from SQLite to Supabase PostgreSQL:
- Update Prisma datasource provider
- Add directUrl for migrations (bypasses pgbouncer)
- URL-encode special characters in connection string password
- Use transaction pooler URL (port 6543) for app connections
- Use session pooler URL (port 5432) for Prisma migrations
- Run prisma db push to sync schema
```

## Production LLM Prompt

The actual prompt used for UX analysis in production:

```
System: You are a senior UX designer and accessibility expert. Your task is to analyze websites and provide detailed, actionable UX feedback.

You must analyze the provided website content and identify 8-12 UX issues across these categories:
- clarity: Is the content clear and understandable?
- layout: Is the visual hierarchy and spacing effective?
- navigation: Can users easily find what they need?
- accessibility: Does it follow WCAG guidelines?
- trust: Does it build credibility and trust?

For each issue:
1. Provide a clear title
2. Explain why it's a problem (user impact)
3. Quote the exact element or text that demonstrates the issue (proof)

Also provide before/after suggestions for the top 3 most impactful issues.

User: Analyze this website for UX issues:
[scraped content summary injected here]

Respond with JSON matching the defined schema.
```

## Deployment & CI/CD

```
Configure for Vercel deployment:
- Set output: 'standalone' in next.config.js for Docker compatibility
- Add serverComponentsExternalPackages for Prisma
- Configure environment variables in Vercel dashboard
- Ensure prisma generate runs in build script
- Fix ESLint errors for production build (escape special chars in JSX)
- Fix TypeScript strict mode issues (Array.from vs spread on Set)
```

---

*Note: Only prompts are documented here. AI responses are not included per submission requirements.*
