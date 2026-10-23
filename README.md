# Rankora — AI SEO Intelligence

**Your content. Better discovered.**

Generate search-ready metadata, preview your search appearance, and optimize content with AI.

Rankora is a modern, focused SEO metadata workspace that helps developers, marketers, creators, and businesses generate optimized meta titles and descriptions, create social-sharing metadata, discover relevant keywords, preview how pages appear in Google SERP results, and verify site ownership via Google Search Console.

---

## Brand & Design Architecture

- **Tagline**: *Your content. Better discovered.*
- **Brand Personality**: Intelligent, confident, minimal, data-driven, approachable.
- **Color Palette (Restrained 70 / 20 / 8 / 2 System)**:
  - **Deep Navy** (`#101827`): Main background, navigation, and footer surfaces (70%).
  - **Electric Teal** (`#14B8A6`): Primary buttons, active states, and focus highlights (20%).
  - **Cloud White** (`#F8FAFC`): Primary text and light surfaces.
  - **Slate** (`#64748B`): Secondary text, labels, and technical descriptions (8%).
  - **Signal Violet** (`#8B5CF6`): AI-generated labels and Gemini badges.
  - **Status Accents**: Green (`#22C55E`), Amber (`#F59E0B`), Red (`#EF4444`) (2%).
- **Typography**:
  - **Display / Headings**: Space Grotesk (600–700)
  - **Body / Interface**: Inter (400–600)
  - **Technical Values**: JetBrains Mono (character counters, URLs, code snippets)

---

## Core Features & Workflow

### 1. Workflow: Enter content → Generate → Review → Preview → Copy or export
1. **Enter Content Brief**: Paste article text, landing page drafts, or product specifications.
2. **AI Intelligence**: Google Gemini 3.8 Flash extracts core search intent, primary entities, and high-CTR phrasing.
3. **Calibrated SERP Preview**: Live authentic Google desktop search snippet with breadcrumb path and title truncation checks.
4. **Copy & Deploy**: One-click copy for HTML `<head>` tags, JSON schema, or individual fields.

### 2. Search Console Verification
- Live site verification meta tag:
  `<meta name="google-site-verification" content="bURvWAHhm3OqndkPnnzgB5twro_I0eZDfxmLyxyLiMA">`
- HTML verification file served dynamically:
  `/google7e9d5e6a885f213a.html` &rarr; `google-site-verification: google7e9d5e6a885f213a.html`

### 3. Technical SEO Calibration Standards
- **Meta Titles**: Strictly targeted to 50–60 characters to avoid Google desktop truncation.
- **Meta Descriptions**: Strictly targeted to 150–160 characters to maximize search snippet CTR.
- **Open Graph & Twitter Cards**: `og:title`, `og:description`, `og:type`, `og:image`, and `twitter:card` tags.
- **Semantic Keyword Extraction**: 5–10 algorithmically ranked keywords and topical phrases.

---

## Brand Assets

```
static/
├── assets/
│   └── brand/
│       ├── icon.svg        # Standalone vector brand mark
│       ├── logo.svg        # Primary dark logo (teal symbol + white wordmark)
│       ├── logo-dark.svg   # Dark surface vector logo
│       └── logo-light.svg  # Light surface vector logo (deep teal symbol + navy wordmark)
├── favicon.svg             # Scalable browser favicon
└── site.webmanifest        # PWA application manifest
```

---

## API Endpoints

### 1. `POST /generate` (or `/api/generate`)
Analyzes page content and returns strict calibrated metadata:
```json
{
  "content": "Page content brief, article draft, or product copy...",
  "focus_keywords": "seo, metadata",
  "api_key": "optional_override_or_demo"
}
```

**Response:**
```json
{
  "meta_title": "Page Title Between 50 and 60 Characters",
  "meta_description": "Search snippet description calibrated strictly between 150 and 160 characters with high-CTR action phrasing.",
  "og_title": "Engaging Open Graph Title for Social Previews",
  "og_description": "Open Graph description calibrated for social media feeds",
  "og_type": "website",
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
}
```

### 2. `GET /health` (or `/api/health`)
```json
{
  "app": "Rankora — AI SEO Intelligence",
  "status": "ok"
}
```

### 3. `GET /robots.txt`
Serves crawl directives allowing search indexation and declaring sitemap path.

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/ivengexnce/ai-seo-meta-generator.git
cd ai-seo-meta-generator

# Setup virtual environment
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py
```

Open `http://127.0.0.1:5000` in your browser.

---

## Author & Project Info

**Meet Maru**
- GitHub: [@ivengexnce](https://github.com/ivengexnce)
- Project Capstone: **FlyRank Front-End AI Engineering Internship Program**
