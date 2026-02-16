# UX Reviewer - AI-Powered Website Analysis

An AI-powered web application that analyzes any website for UX issues and provides actionable recommendations.

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
- **Health Status**: Monitor backend, database, and LLM connections

## Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **LLM**: Groq Llama 3.3 70B (FREE)
- **Web Scraping**: Cheerio for HTML parsing

## How to Run

### Prerequisites

- Node.js 18+ installed
- Groq API key (FREE - get from https://console.groq.com/keys)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
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
   Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=gsk_your-groq-api-key-here
   DATABASE_URL="file:./dev.db"
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

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
   - `DATABASE_URL`: For production, use a PostgreSQL database URL
4. Deploy

### Docker

```bash
docker build -t ux-reviewer .
docker run -p 3000:3000 -e GROQ_API_KEY=gsk_xxx ux-reviewer
```

## What's Done

- [x] Home page with URL input and validation
- [x] Website content scraping (title, headings, forms, buttons, links, images)
- [x] AI-powered UX analysis with Groq
- [x] Issues grouped by category with severity levels
- [x] Before/After suggestions for top 3 issues
- [x] UX score (0-100)
- [x] Review history (last 5 reviews)
- [x] Status/health page
- [x] Error handling for invalid URLs
- [x] Responsive design
- [x] Export reports (PDF, Markdown, JSON)

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
    ├── llm.ts         # OpenAI integration
    ├── scraper.ts     # Web scraping
    └── utils.ts       # Utility functions
```

## License

MIT
