# Prompts Used During Development

This document records the main prompts used to build this application with AI assistance.

## Project Setup

### Initial Prompt
```
Build a web app where I can:
- paste a website link
- the app loads the page and captures key content (title, headings, forms, buttons, main text)
- the app generates a UX review with:
  - 8-12 issues grouped by category (clarity, layout, navigation, accessibility, trust)
  - a short "why this is an issue"
  - a proof for each issue (a screenshot snippet OR the exact text/element it refers to)
- show a "before/after" suggestion for the top 3 issues
- save and view the last 5 reviews

Include:
- A simple home page with clear steps
- A status page that shows health of backend, database, and LLM connection
- Basic handling for empty/wrong input
```

## Component Development

### Home Page
```
Create a home page component with:
- Hero section explaining what the app does
- URL input with validation
- Loading state during analysis
- Feature highlights
- Step-by-step guide
```

### Review Page
```
Create a review results page that displays:
- Website title and URL
- Overall UX score with color coding
- Issues grouped by category
- Tabs for issues vs suggestions
- Before/after comparisons
- Severity indicators
```

### Status Page
```
Create a status page that checks:
- Backend API health
- Database connection
- LLM (OpenAI) connectivity
Display each service with status indicator and message.
```

## API Development

### Analyze Endpoint
```
Create an API endpoint that:
1. Validates the URL
2. Scrapes website content using Cheerio
3. Sends content to OpenAI for UX analysis
4. Saves results to database
5. Returns review ID
```

### LLM Prompt (Used in Production)
```
You are a senior UX designer and accessibility expert. Your task is to analyze websites and provide detailed, actionable UX feedback.

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
```

## Styling

### Tailwind Configuration
```
Set up Tailwind CSS with:
- Primary color palette (blue-based)
- Custom component classes (btn-primary, btn-secondary, card, input)
- Responsive design utilities
```

## Database

### Schema Design
```
Create a Prisma schema for storing reviews with:
- id (unique identifier)
- url (analyzed website)
- title (page title)
- issues (JSON string)
- suggestions (JSON string)
- score (0-100)
- timestamps
```

## Debugging/Fixes

### Error Handling
```
Add error handling for:
- Invalid URLs
- Failed website fetches
- LLM API errors
- Database connection issues
Display user-friendly error messages
```

---

*Note: Actual AI responses are not included per requirements. These are the prompts/instructions given to the AI assistant.*
