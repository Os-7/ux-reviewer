# AI Usage Notes

This document describes how AI tools were used in building this project and what was manually verified.

## LLM Used in the App

**Provider**: Groq  
**Model**: Llama 3.3 70B Versatile

### Why Groq?

1. **FREE**: Generous free tier with 30 requests/minute
2. **Speed**: Extremely fast - powered by custom LPU hardware
3. **Quality**: Llama 3.3 70B is one of the best open-source models
4. **Reliability**: High uptime and consistent performance
5. **No credit card required**: Can start using immediately

### How the LLM is Used

The LLM receives:
- Scraped website content (title, headings, forms, buttons, links, images, text)
- A structured prompt asking for UX analysis

The LLM returns:
- 8-12 UX issues categorized by type
- Severity ratings (high/medium/low)
- Evidence/proof from the page content
- Before/after suggestions for top issues
- Overall UX score (0-100)

## AI Tools Used for Development

### Cursor AI (Claude)

**Used for:**
- Project scaffolding and file structure
- Writing React components
- Creating API routes
- Implementing the scraper logic
- Writing Tailwind CSS styles
- Creating documentation

### What I Verified Myself

1. **Architecture decisions**: Chose Next.js 14 with App Router, SQLite for simplicity
2. **Technology choices**: Evaluated Puppeteer vs Cheerio, chose Cheerio for simpler scraping
3. **Prompt engineering**: Tested and refined the UX analysis prompt
4. **Error handling**: Added proper validation and error messages
5. **UI/UX**: Reviewed and adjusted component styling for clarity
6. **Security**: Ensured API keys are not exposed, validated user inputs
7. **Database schema**: Designed the Review model structure
8. **API design**: Planned REST endpoints and response formats

### Code Review Checklist

- [x] No hardcoded secrets or API keys
- [x] Input validation on all user inputs
- [x] Proper error handling with user-friendly messages
- [x] TypeScript types are properly defined
- [x] Components are reasonably structured
- [x] Database queries use Prisma (SQL injection safe)
- [x] CORS and security headers handled by Next.js
- [x] Responsive design works on mobile

### Testing Performed

- Tested URL validation (valid/invalid URLs)
- Tested scraping on multiple websites
- Verified LLM responses are properly parsed
- Checked database read/write operations
- Tested status page health checks
- Verified review history displays correctly

## Limitations

1. **No screenshot capture**: Would require Puppeteer with a browser service
2. **Client-side JavaScript**: Pages that heavily rely on JS won't be fully scraped
3. **Rate limiting**: No rate limiting implemented yet
4. **Authentication**: No user accounts - all reviews are public

## Future AI Considerations

- Could add multi-model support (Anthropic Claude, Google Gemini)
- Could use vision models for actual screenshot analysis
- Could implement automated accessibility testing with AI
