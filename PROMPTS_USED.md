# Prompts Used During Development

This document records the key prompts I used while building this application with Cursor AI assistance.

## Initial Project Setup

I started by describing what I wanted to build:

```
I want to build Option A: Website UX Reviewer

Build a web app where I can:
- paste a website link
- the app loads the page and captures key content (title, headings, forms, buttons, main text)
- the app generates a UX review with 8-12 issues grouped by category
- show before/after suggestions for top 3 issues
- save and view the last 5 reviews
```

## LLM Provider Selection

When OpenAI quota ran out, I asked about alternatives:

```
Failed to analyze website: 429 You exceeded your current quota...
Are there any free resources for this?
```

This led to switching from OpenAI → Google Gemini → Groq (which worked best).

## Database Setup

For production database, I asked:

```
How to deploy database in Supabase for my database URL?
```

The AI walked me through:
1. Creating a Supabase project
2. Getting connection strings
3. URL-encoding special characters in password
4. Updating Prisma schema from SQLite to PostgreSQL

## Export Feature

I requested adding export functionality:

```
Could we also add a section from where I can export the report too?
```

This added PDF (print), Markdown, and JSON export options.

## Deployment Issues

During Vercel deployment, I shared error logs and asked for fixes:

```
I got error while deploying: [pasted build logs]
```

Fixed issues included:
- ESLint apostrophe escaping (`'` → `&apos;`)
- TypeScript Set iteration (`[...new Set()]` → `Array.from(new Set())`)

## The Main UX Analysis Prompt

This is the prompt used in production to analyze websites:

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

---

*Note: Only prompts are included here, not the AI responses.*
