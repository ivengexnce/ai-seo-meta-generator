> ⭐ **Star this if you found it useful**

<p align="center">
  <img src="og-image.png" alt="Rankora — AI SEO Metadata Workspace & Google SERP Simulator Screenshot" width="100%">
</p>

<!-- [screenshot here] -->

# Rankora

> **Your content. Better discovered.**

An AI-powered SEO metadata workspace and live Google SERP simulator that helps developers, creators, marketers, and businesses generate search-ready titles, descriptions, and social tags.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-14B8A6.svg?style=for-the-badge)](LICENSE)
[![Deployed on Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://rankoraa.vercel.app/)

🚀 **Live Demo:** [https://rankoraa.vercel.app/](https://rankoraa.vercel.app/)

---

## 💡 What It Does

- **Generates Search-Ready Titles & Descriptions**: Turns raw article drafts, product copy, or landing page text into click-worthy meta titles (50–60 characters) and meta descriptions (150–160 characters) calibrated to Google's pixel limits.
- **Shows Live Google SERP Previews**: Renders a realistic desktop and mobile Google Search snippet preview so you can verify how your page will appear before deploying.
- **Creates Social-Sharing Tags**: Automatically generates Open Graph (`og:title`, `og:description`, `og:image`) and Twitter Card tags for rich link previews across LinkedIn, X/Twitter, Slack, and Facebook.
- **Extracts Relevant Keywords**: Discovers high-intent semantic keywords and topical entities from your content to help search crawlers accurately index your pages.

---

## ✨ Features

- **Gemini 3.8 Flash Integration**: Powered by Google's modern Gemini models via the official `@google/genai` SDK for semantic entity extraction and high-CTR phrasing.
- **Offline Heuristic Engine**: Graceful fallback generator that creates calibrated metadata even during API connectivity or quota limits.
- **SEO Readiness Score**: Real-time 0–100 audit gauge with automated checks for title boundaries, description length, and social cards.
- **Google Search Console Support**: Includes verified site ownership tokens and verification file routes out of the box.
- **Dual Schema.org Markup**: Fully equipped with Google-compliant `FAQPage` JSON-LD structured data and microdata.
- **Privacy-First Architecture**: No account required. Custom API keys are stored strictly in client-side `localStorage` and never logged or persisted.
- **1-Click Export**: Easily copy formatted HTML `<head>` tags, raw text, or structured JSON.
- **In-App Feedback & Social Sharing**: Integrated user feedback collection and Web Share API support.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.11+, Flask, Gunicorn
- **AI / LLM**: Google Gemini API (`gemini-3.8-flash` via official `google-genai` SDK)
- **Frontend**: Semantic HTML5, Vanilla JavaScript, CSS3 (Modern Design System with Space Grotesk, Inter, and JetBrains Mono)
- **Structured Data**: JSON-LD Schema.org (`FAQPage`)
- **Deployment**: Render Cloud Web Service (`render.yaml`, `Procfile`) & Vercel Edge Serverless (`vercel.json`)

---

## 🚀 Local Development Setup

Follow these steps to run Rankora locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/ivengexnce/ai-seo-meta-generator.git
cd ai-seo-meta-generator
```

### 2. Create and activate a virtual environment
```bash
# On macOS / Linux:
python3 -m venv .venv
source .venv/bin/activate

# On Windows (PowerShell):
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and configure your API key (get one free at [aistudio.google.com](https://aistudio.google.com/)):
```ini
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
GOOGLE_SITE_VERIFICATION=your_verification_code_here
```
*(Tip: You can also enter `"demo"` as your API key or test in Demo Mode directly in the UI without an API key).*

### 5. Start the server
```bash
python app.py
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 📡 API Endpoints

### `POST /generate` (or `/api/generate`)
Analyzes page content and returns search-calibrated metadata.

**Request Body:**
```json
{
  "content": "Paste your article draft, product description, or page copy...",
  "focus_keywords": "seo, metadata",
  "api_key": "optional_override_or_demo"
}
```

**Response (200 OK):**
```json
{
  "meta_title": "AI SEO Meta Generator | Rankora — Search Intelligence",
  "meta_description": "Generate optimized meta titles and descriptions, create social-sharing tags, and preview how pages appear in search results.",
  "og_title": "Rankora — Your content deserves to be discovered.",
  "og_description": "Generate search-ready SEO metadata, preview Google SERP snippets, and craft social tags with AI.",
  "og_type": "website",
  "keywords": ["SEO Optimization", "Rankora", "Search Intelligence", "Meta Tags", "Open Graph"]
}
```

### `GET /health` (or `/api/health`)
Health check endpoint for deployment monitoring.
```json
{
  "app": "Rankora — AI SEO Intelligence",
  "status": "ok"
}
```

### `POST /api/feedback`
Submits user feedback, feature suggestions, or bug reports.
```json
{
  "message": "The SERP preview simulator is super helpful!",
  "category": "idea",
  "email": "user@example.com"
}
```

### `GET /og-image.png`
Directly serves the canonical 1200 × 630 Open Graph preview card for social crawlers.

### `GET /robots.txt`
Serves crawl directives allowing search indexation and declaring sitemap path.

---

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for local setup steps, PR guidelines, and a list of good first issues.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) &copy; 2026 Meet Maru.

---
