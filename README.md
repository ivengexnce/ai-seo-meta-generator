# AI SEO Meta Generator

An AI-powered web tool that analyses page content and generates production-ready SEO metadata — meta titles, descriptions, Open Graph cards, keyword suggestions, and real-time Google SERP simulators — powered by Google Gemini AI.

Built as the capstone project for the **FlyRank Front-End AI Engineering Internship Program (Jul–Oct 2026)**.

---

## Key Features & Visual Enhancements

- **Calibrated Meta Generation**:
  - **Meta Titles**: Strictly optimized for 50–60 characters to prevent Google SERP truncation.
  - **Meta Descriptions**: Formatted for 150–160 characters with high-CTR search intent.
  - **Open Graph & Twitter Cards**: `og:title`, `og:description`, `og:type`, and `twitter:card` tags.
  - **Semantic Keywords**: 5–10 algorithm-ranked terms extracted from content context.
- **Interactive 3D Particle Constellation**:
  - High-performance, GPU-accelerated canvas particle mesh that floats organically and reacts to mouse movement.
  - Automatically pauses when the tab is inactive or hidden to conserve 100% CPU/GPU resources.
  - Full support for `prefers-reduced-motion: reduce`.
- **Live SEO Health Score & Audit Gauge**:
  - Dynamic circular SVG gauge (0–100%) calculating on-page SEO readiness in real time.
  - Itemized checklist tracking title length, description length, social card readiness, and keyword density.
- **Google SERP & Social Feed Simulators**:
  - **SERP Simulator**: Preview search snippets in real time with desktop and mobile viewport toggles.
  - **Social Share Simulator**: Live previews for X / Twitter large summary cards and LinkedIn feed shares.
- **Modern UI & Design System**:
  - **Shadcn/ui & Magic UI Inspired**: Obsidian/slate tokens, glassmorphism, glowing accents, and smooth transitions.
  - **Accessible API Key Modal Dialog**: Keyboard-accessible dialog (ESC to close, backdrop click, focus trap) with one-click Demo Mode.
  - **Origin UI Input Patterns**: Quick preset pills (Tech Blog, SaaS Platform, Product Page), live character/word count, and one-click clear.
- **Export & Download Hub**:
  - Instant one-click copy for individual fields, all Open Graph tags, or all keywords.
  - Download ready-to-paste `head-meta.html` snippets and structured `seo-metadata.json`.
- **Brand Assets & SEO Metadata**:
  - Custom scalable SVG favicon (`favicon.svg`) with SEO lens and Gemini sparkle.
  - High-resolution Open Graph social preview card (`og-image.jpg`, 1200 × 630).
  - PWA Web Manifest (`site.webmanifest`).
  - Lucide icon system embedded across all interactive elements.

---

## Tech Stack

- **Backend**: Python 3.9+ · Flask · Google Generative AI SDK
- **AI Models**: Google Gemini 3.6 Flash / 2.5 Flash
- **Frontend Architecture**:
  - Semantic HTML5 & Modern CSS3 Design Tokens
  - Interactive Canvas 3D Particle Engine
  - GSAP (GreenSock) Motion & Staggered Reveal Animation
  - Canvas-Confetti Micro-Celebration Trigger
  - Lucide Icons (Universal SVG Iconography)
- **Deployment**: Vercel Serverless (`api/index.py`, `vercel.json`) / Render (`gunicorn app:app`)

---

## Getting Started

### Prerequisites
- Python 3.9+
- Google Gemini API key ([aistudio.google.com](https://aistudio.google.com)) or use the built-in **Demo Mode**.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ivengexnce/ai-seo-meta-generator.git
cd ai-seo-meta-generator

# 2. Set up virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment (optional, can also be configured directly in UI)
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here

# 5. Run the application
python app.py

# 6. Open in browser
http://localhost:5000
```

---

## Project Structure

```text
ai-seo-meta-generator/
├── app.py                      # Flask backend + Gemini API fallback engine
├── api/
│   └── index.py                # Vercel serverless entry point
├── requirements.txt            # Python dependencies (flask, google-generativeai, gunicorn)
├── vercel.json                 # Vercel routing configuration
├── templates/
│   └── index.html              # Modern, accessible semantic UI template
├── static/
│   ├── style.css               # Production design system & component styles
│   ├── script.js               # Frontend controller, 3D particle canvas & live audit
│   ├── favicon.svg             # Scalable vector favicon
│   ├── site.webmanifest        # PWA web manifest
│   └── og-image.jpg            # High-resolution (1200x630) social share card
├── public/static/              # Vercel static asset mirror
├── .env.example                # Sample environment configuration
├── .gitignore
└── README.md
```

---

## API Endpoints

### 1. `POST /generate`
Generates optimized SEO metadata from page content.

**Request Body:**
```json
{
  "content": "Page content, article text, or HTML...",
  "api_key": "optional_override_or_demo"
}
```

**Response:**
```json
{
  "meta_title": "SEO-optimized title between 50 and 60 characters",
  "meta_description": "Compelling meta description between 150 and 160 characters",
  "og_title": "Engaging Open Graph title for social feeds",
  "og_description": "Clear and attractive Open Graph description",
  "og_type": "website",
  "keywords": ["SEO Optimization", "Gemini AI", "Frontend", "Meta Tags"]
}
```

### 2. `GET /health`
Deployment monitoring health check endpoint.
```json
{
  "app": "AI SEO Meta Generator",
  "status": "ok"
}
```

### 3. Static & Asset Routes
- `GET /favicon.ico`, `GET /favicon.svg`: Dynamic SVG favicon
- `GET /site.webmanifest`: Web manifest
- `GET /static/og-image.jpg`: 1200 × 630 Open Graph preview image

---

## Deployment

### Vercel (Recommended)
1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set environment variable `GEMINI_API_KEY` (or users can provide their own key / demo mode in the UI).
4. Deploy! The project includes `vercel.json` and `api/index.py` for instant zero-configuration deployment.

### Render
1. Create a new Web Service on [Render](https://render.com) connected to your repository.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `gunicorn app:app`
4. Set `GEMINI_API_KEY` in environment variables.

---

## Capstone Context

This project was built and accepted as the capstone submission for the:
**FlyRank Front-End AI Engineering Internship Program (July–October 2026)**
- Verification Portal: [internship.flyrank.ai/verify](https://internship.flyrank.ai/verify)
- Verification ID: `FR-D11-02FDC-1F974`

---

## Author

**Meet Maru**
- GitHub: [@ivengexnce](https://github.com/ivengexnce)
- Portfolio: [meetmaru.netlify.app](https://meetmaru.netlify.app)
