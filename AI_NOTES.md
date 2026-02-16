# AI Usage Notes

This document explains how I used AI tools to build this project and what I verified myself.

## LLM Used in the App

**Provider**: Groq  
**Model**: Llama 3.3 70B Versatile

### Why I Chose Groq

I initially tried OpenAI (quota exceeded) and Google Gemini (model not found errors in my region). Groq worked immediately and offers:

1. **Free tier** - 30 requests/minute, no credit card needed
2. **Fast responses** - Their custom LPU hardware is noticeably quick
3. **Good quality** - Llama 3.3 70B produces solid UX analysis
4. **JSON mode** - Returns structured data reliably

### How the LLM Works in My App

1. User submits a URL
2. My scraper extracts: title, headings, forms, buttons, links, images, main text
3. This content is sent to Groq with a structured prompt
4. LLM returns JSON with issues, severity, proof, and suggestions
5. Results are saved to Supabase and displayed to user

## AI Tools Used for Development

### Cursor AI (Claude)

I used Cursor throughout development for:
- Setting up the Next.js project structure
- Writing React components and pages
- Creating the API routes
- Building the web scraper with Cheerio
- Styling with Tailwind CSS
- Debugging deployment errors
- Setting up Supabase database

## What I Did Myself

### Decisions I Made

- **Tech stack**: Chose Next.js 14 because it's easy to deploy on Vercel and handles both frontend and API
- **Database**: Started with SQLite for simplicity, switched to Supabase PostgreSQL for production
- **LLM provider**: Tested multiple providers, settled on Groq after issues with others
- **Scraping approach**: Used Cheerio instead of Puppeteer to avoid browser dependencies

### Things I Verified

- Tested the app with multiple websites to ensure scraping works
- Checked that the LLM responses parse correctly
- Verified database operations (create, read, delete)
- Tested export functionality (PDF, Markdown, JSON)
- Made sure error messages are user-friendly
- Confirmed no API keys are exposed in the code

### Code I Reviewed

- [x] Environment variables are properly configured
- [x] URL validation prevents bad inputs
- [x] Error handling shows helpful messages
- [x] TypeScript types are correct
- [x] Database queries use Prisma (safe from SQL injection)
- [x] Responsive design works on mobile

## Limitations I'm Aware Of

1. **No screenshots** - Would need Puppeteer and a browser service
2. **JavaScript-heavy sites** - Cheerio only gets static HTML
3. **No rate limiting** - Could add if needed for production
4. **Public reviews** - No user authentication yet

## What I Learned

- How to integrate LLM APIs into a web app
- Structuring prompts for consistent JSON output
- Deploying Next.js to Vercel with environment variables
- Setting up Supabase PostgreSQL with Prisma
- URL-encoding special characters in database passwords
