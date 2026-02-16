import * as cheerio from 'cheerio'

export interface ScrapedContent {
  url: string
  title: string
  metaDescription: string
  headings: { level: string; text: string }[]
  forms: { action: string; fields: string[] }[]
  buttons: { text: string; type: string }[]
  links: { text: string; href: string; isExternal: boolean }[]
  images: { alt: string; src: string; hasAlt: boolean }[]
  mainText: string
  navigation: string[]
  rawHtml: string
  loadTime?: number
}

export async function scrapeWebsite(url: string): Promise<ScrapedContent> {
  const startTime = Date.now()
  
  // Fetch the page with a browser-like user agent
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  const html = await response.text()
  const loadTime = Date.now() - startTime
  const $ = cheerio.load(html)

  // Remove script and style elements for cleaner text extraction
  $('script, style, noscript').remove()

  // Extract title
  const title = $('title').first().text().trim() || 
                $('h1').first().text().trim() || 
                'No title found'

  // Extract meta description
  const metaDescription = $('meta[name="description"]').attr('content') || 
                          $('meta[property="og:description"]').attr('content') || 
                          ''

  // Extract headings
  const headings: { level: string; text: string }[] = []
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const text = $(el).text().trim()
    if (text) {
      headings.push({
        level: el.tagName.toLowerCase(),
        text: text.substring(0, 200),
      })
    }
  })

  // Extract forms
  const forms: { action: string; fields: string[] }[] = []
  $('form').each((_, el) => {
    const action = $(el).attr('action') || 'no-action'
    const fields: string[] = []
    $(el).find('input, select, textarea').each((_, field) => {
      const name = $(field).attr('name') || $(field).attr('placeholder') || $(field).attr('type') || 'unnamed'
      fields.push(name)
    })
    forms.push({ action, fields })
  })

  // Extract buttons
  const buttons: { text: string; type: string }[] = []
  $('button, input[type="submit"], input[type="button"], [role="button"]').each((_, el) => {
    const text = $(el).text().trim() || $(el).attr('value') || $(el).attr('aria-label') || 'unnamed'
    const type = $(el).attr('type') || 'button'
    if (text) {
      buttons.push({ text: text.substring(0, 100), type })
    }
  })

  // Extract links
  const links: { text: string; href: string; isExternal: boolean }[] = []
  const baseUrl = new URL(url)
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    const text = $(el).text().trim() || $(el).attr('aria-label') || ''
    if (href && text) {
      let isExternal = false
      try {
        const linkUrl = new URL(href, url)
        isExternal = linkUrl.hostname !== baseUrl.hostname
      } catch {
        isExternal = false
      }
      links.push({
        text: text.substring(0, 100),
        href: href.substring(0, 200),
        isExternal,
      })
    }
  })

  // Extract images
  const images: { alt: string; src: string; hasAlt: boolean }[] = []
  $('img').each((_, el) => {
    const src = $(el).attr('src') || ''
    const alt = $(el).attr('alt') || ''
    images.push({
      alt,
      src: src.substring(0, 200),
      hasAlt: Boolean(alt && alt.trim()),
    })
  })

  // Extract navigation
  const navigation: string[] = []
  $('nav a, header a, [role="navigation"] a').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length < 50) {
      navigation.push(text)
    }
  })

  // Extract main text content
  const mainText = $('main, article, [role="main"], .content, #content, body')
    .first()
    .text()
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 5000)

  return {
    url,
    title,
    metaDescription,
    headings: headings.slice(0, 20),
    forms: forms.slice(0, 10),
    buttons: buttons.slice(0, 20),
    links: links.slice(0, 50),
    images: images.slice(0, 30),
    mainText,
    navigation: Array.from(new Set(navigation)).slice(0, 15),
    rawHtml: html.substring(0, 50000), // Keep first 50KB for reference
    loadTime,
  }
}

export function summarizeContent(content: ScrapedContent): string {
  return `
URL: ${content.url}
Title: ${content.title}
Meta Description: ${content.metaDescription || 'None'}
Load Time: ${content.loadTime}ms

HEADINGS (${content.headings.length}):
${content.headings.map(h => `  ${h.level}: ${h.text}`).join('\n')}

NAVIGATION ITEMS (${content.navigation.length}):
${content.navigation.join(', ')}

FORMS (${content.forms.length}):
${content.forms.map(f => `  Action: ${f.action}, Fields: ${f.fields.join(', ')}`).join('\n')}

BUTTONS (${content.buttons.length}):
${content.buttons.map(b => `  "${b.text}" (${b.type})`).join('\n')}

LINKS (${content.links.length} total, ${content.links.filter(l => l.isExternal).length} external)

IMAGES (${content.images.length} total, ${content.images.filter(i => !i.hasAlt).length} missing alt text)

MAIN CONTENT PREVIEW:
${content.mainText.substring(0, 2000)}...
`.trim()
}
