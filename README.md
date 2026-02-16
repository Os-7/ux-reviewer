# UX Reviewer - AI-Powered Website Analysis

An AI-powered web application that analyzes any website for UX issues and provides actionable recommendations.

## Live Demo

- **Live App**: [Your Vercel URL here]
- **GitHub**: https://github.com/Os-7/ux-reviewer

## Features

- **URL Analysis**: Paste any website URL to analyze
- **AI-Powered Review**: Generates 8-12 UX issues categorized by:
  - Clarity
  - Layout
  - Navigation
  - Accessibility
  - Trust
- **Detailed Evidence**: Each issue includes proof from the actual page content
- **Before/After Suggestions**: Top 3 issues get actionable fix recommendations
- **UX Score**: Overall score from 0-100
- **History**: View and manage the last 5 reviews
- **Export Reports**: Download as PDF, Markdown, or JSON
- **Health Status**: Monitor backend, database, and LLM connections

## Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **LLM**: Groq Llama 3.3 70B (FREE)
- **Web Scraping**: Cheerio for HTML parsing
- **Hosting**: Vercel

## How to Run

### Prerequisites

- Node.js 18+ installed
- Groq API key (FREE - get from https://console.groq.com/keys)
- Supabase account (FREE - https://supabase.com)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Os-7/ux-reviewer.git
   cd ux-reviewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Get your Supabase database URLs:
   - Go to Supabase Dashboard → Project Settings → Database
   - Copy the "Transaction" URL (port 6543) for `DATABASE_URL`
   - Copy the "Session" URL (port 5432) for `DIRECT_URL`
   - URL-encode any special characters in your password

5. Edit `.env` with your credentials:
   ```
   GROQ_API_KEY=gsk_your-groq-api-key-here
   DATABASE_URL="postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres"
   ```

6. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `GROQ_API_KEY`: Your Groq API key (free)
   - `DATABASE_URL`: Supabase transaction URL (port 6543)
   - `DIRECT_URL`: Supabase session URL (port 5432)
4. Deploy

### Docker

```bash
docker build -t ux-reviewer .
docker run -p 3000:3000 \
  -e GROQ_API_KEY=gsk_xxx \
  -e DATABASE_URL=postgresql://... \
  -e DIRECT_URL=postgresql://... \
  ux-reviewer
```

## What's Done

- [x] Home page with URL input and validation
- [x] Website content scraping (title, headings, forms, buttons, links, images)
- [x] AI-powered UX analysis with Groq Llama 3.3 70B
- [x] Issues grouped by category with severity levels
- [x] Before/After suggestions for top 3 issues
- [x] UX score (0-100)
- [x] Review history (last 5 reviews)
- [x] Status/health page
- [x] Error handling for invalid URLs
- [x] Responsive design
- [x] Export reports (PDF, Markdown, JSON)
- [x] PostgreSQL database (Supabase) for production

## What's Not Done / Future Improvements

- [ ] Screenshot capture (requires Puppeteer/Browserless setup)
- [ ] Compare two URLs side-by-side
- [ ] User authentication
- [ ] More detailed accessibility checks (WCAG automated testing)
- [ ] Performance metrics (Lighthouse integration)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Analyze a website URL |
| `/api/reviews` | GET | Get last 5 reviews |
| `/api/reviews/[id]` | GET | Get a specific review |
| `/api/reviews/[id]` | DELETE | Delete a review |
| `/api/status` | GET | Health check for all services |

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── history/       # History page
│   ├── review/[id]/   # Review details page
│   ├── status/        # Health status page
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # React components
└── lib/
    ├── db.ts          # Prisma client
    ├── llm.ts         # Groq LLM integration
    ├── scraper.ts     # Web scraping
    └── utils.ts       # Utility functions
```

## License

MIT
