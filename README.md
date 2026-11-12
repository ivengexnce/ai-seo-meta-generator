<p align="center">
  <img src="og-image.png" alt="Rankora — AI SEO Metadata Intelligence & SERP Simulator" width="100%">
</p>

# Rankora — AI SEO Intelligence Workspace

> **AI-generated, high-CTR search metadata. In seconds.**

Rankora is an AI-orchestrated SEO metadata studio and live Google SERP simulator. Powered by Google Gemini 3.8 Flash, it helps developers, creators, marketers, and teams generate calibrated meta titles, descriptions, Open Graph social cards, and keyword ideas that follow Google Search Central guidance.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-rankoraa.vercel.app-8952e0?style=for-the-badge&logo=vercel&logoColor=white)](https://rankoraa.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-00FF90.svg?style=for-the-badge)](LICENSE)

🚀 **Live Application:** [https://rankoraa.vercel.app/](https://rankoraa.vercel.app/)
*(Legacy domain `ai-seo-meta-generator.vercel.app` redirects with a permanent 301.)*

---

## ⚡ Key Features

- **Landing page**: floating pill navbar, split hero with a quick URL/topic bar that hands off to the studio, social proof shelf, and platform badges.
- **SEO studio**: 50–60 character titles and 150–160 character descriptions, semantic keyword chips, and a 0–100 SEO readiness gauge.
- **Preview tabs**: Meta Generator, Google SERP Preview, Social Metadata (Open Graph card), and HTML `<head>` / JSON export.
- **Dual inference**: Gemini 3.8 Flash via the official `google-genai` SDK, with an offline heuristic fallback when out of quota.
- **Origami FAQ**: interactive FAQ with `FAQPage` JSON-LD structured data.
- **Community**: testimonial marquee, inline feedback form, and a public issue/feature tracker.
- **Admin console (`/admin`)**: moderate testimonials and update issue status, protected by a server-side secret.
- **Single static source**: all assets live in `public/static/`, used by both Flask and Vercel.

---

## 🎨 Design System

| Token | Value | Use |
| :--- | :--- | :--- |
| Canvas | `#0C1015` | Base background |
| Surface | `#19202b` | Cards |
| Primary accent | `#8952e0` / `#9461e3` | CTAs, highlights |
| Action highlight | `#2ab4d9` | Focus, technical accents |
| Success | `#00FF90` | Verified, 100% scores |
| Warning | `#F59E0B` | Ratings, pending |
| Typography | Space Grotesk, Inter, JetBrains Mono | Display, body, code |

---

## 🛠 Tech Stack

- **Backend**: Python 3.11+, Flask 3.0+, Gunicorn
- **AI**: Google Gemini API (`gemini-3.8-flash`) via `google-genai`
- **Frontend**: HTML5, vanilla JavaScript (ES6+), CSS3
- **Animation**: Anime.js, CSS keyframes, Three.js
- **Persistence**: atomic JSON file storage (`data/feedbacks.json`, git-ignored)
- **Deployment**: Vercel (`vercel.json`) and Render (`render.yaml`, `Procfile`)

---

## 📁 Project Structure

```text
ai-seo-meta-generator/
├── api/
│   └── index.py                 # Vercel serverless entrypoint
├── data/
│   └── feedbacks.json           # Runtime storage (git-ignored, never commit)
├── public/
│   ├── static/                  # All static assets
│   │   ├── assets/brand/
│   │   ├── hero-kinetic.jpg
│   │   ├── og-image.png
│   │   ├── script.js
│   │   ├── style.css
│   │   ├── site.webmanifest
│   │   └── favicon.*
│   ├── robots.txt
│   └── google*.html             # Search Console verification
├── templates/
│   ├── index.html
│   └── admin.html
├── .env.example                 # Placeholder values only
├── .gitignore
├── app.py
├── Procfile
├── render.yaml
├── requirements.txt
└── vercel.json
```

---

## 🚀 Quickstart

### Prerequisites
- Python 3.11+
- Git
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com/)

### 1. Clone
```bash
git clone https://github.com/ivengexnce/ai-seo-meta-generator.git
cd ai-seo-meta-generator
```

### 2. Virtual environment
```bash
# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Install
```bash
pip install -r requirements.txt
```

### 4. Configure environment
```bash
cp .env.example .env
```

Edit `.env` (never commit this file):
```ini
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000

# Generate a long random value, e.g.: python -c "import secrets; print(secrets.token_urlsafe(32))"
ADMIN_SECRET=your_admin_secret_here

CANONICAL_URL=https://your-domain.com
GOOGLE_SITE_VERIFICATION=your_verification_token_here
```

### 5. Run
```bash
python app.py
```
Open [http://localhost:5000](http://localhost:5000). The admin console is at `/admin`.

---

## 📡 REST API

### Metadata generation
`POST /api/generate` (or `/generate`)

**Request:**
```json
{
  "content": "Rankora is an AI-powered SEO metadata workspace.",
  "focus_keywords": "AI SEO, SERP simulator, meta tags"
}
```

**Response (200):**
```json
{
  "meta_title": "AI SEO Meta Generator | Rankora — Search Intelligence",
  "meta_description": "Generate search-calibrated meta titles, descriptions, and Open Graph tags with a live Google SERP simulator.",
  "og_title": "Rankora — Your Content Deserves to Be Discovered",
  "og_description": "AI-orchestrated SEO metadata and real-time Google search snippet previews.",
  "og_type": "website",
  "keywords": ["AI SEO", "Meta Tag Generator", "SERP Simulator", "Open Graph", "Technical SEO"]
}
```

A user-supplied Gemini key may be sent in the `X-Gemini-Key` request header. It is used for that single request only and is never logged or stored. Do not send keys in the request body or URL.

### Public community endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/testimonials` | Admin-approved testimonials, newest first |
| `GET` | `/api/issues` | Public roadmap and issues |
| `POST` | `/api/feedback` | Submit a testimonial or issue |

`POST /api/feedback` body:
```json
{ "name": "Sarah Connor", "message": "The SERP simulator caught our title truncation.", "type": "testimonial", "rating": 5 }
```

### Admin endpoints
All admin endpoints require the `X-ADMIN-SECRET` header to match the server-side `ADMIN_SECRET`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/feedback` | All feedback, testimonials, and issues |
| `PATCH` | `/api/feedback/<id>/approve` | Toggle approval |
| `PATCH` | `/api/feedback/<id>/status` | Update issue status |
| `DELETE` | `/api/feedback/<id>` | Delete an item |

### Crawling and health
- `GET /sitemap.xml`, `GET /robots.txt`
- `GET /health` (or `/api/health`)

---

## 🔒 Security

- **Never commit secrets.** `.env`, `data/`, and any `*.key` file must be listed in `.gitignore`. Only `.env.example` with placeholder values belongs in the repo.
- **Admin secret**: use a random value of 32+ characters, compare it server-side with `hmac.compare_digest`, and serve `/admin` over HTTPS only. Rotate it immediately if it is ever exposed.
- **If a secret was committed**, rotating it is not enough: the old value stays in git history. Rotate it, then purge history (`git filter-repo`) or treat the repo as compromised.
- **Rate limiting**: apply per-IP limits to `/api/generate`, `/api/feedback`, and the admin login to prevent quota abuse and brute force (for example with `Flask-Limiter`).
- **Input handling**: cap request body size, validate `type` and `rating` on `/api/feedback`, and escape all user-submitted text when rendering (including inside JSON-LD).
- **Feedback data**: `data/feedbacks.json` may contain names and emails. Keep it out of version control and out of public static paths.
- **Admin indexing**: `/admin` is excluded in `robots.txt` and the nav link uses `rel="nofollow"`. Set `X-Robots-Tag: noindex` on admin responses too.
- **Security headers**: send `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and HSTS.
- **Responsible disclosure**: report vulnerabilities privately through GitHub Security Advisories, not public issues.

---

## 🔏 Privacy

- **No storage of page content**: submitted text goes to the model for on-demand inference and is not logged, sold, or used for training by Rankora.
- **Client-side keys**: a Gemini key you enter stays in your browser's `localStorage`. Clear it any time from the API Key dialog.

---

## 🚢 Deployment

### Vercel
1. Push the repo to GitHub and import it in Vercel.
2. Set environment variables: `GEMINI_API_KEY`, `ADMIN_SECRET`, `CANONICAL_URL`.
3. Deploy. `api/index.py` builds the serverless function and `public/` serves static assets.

### Render
1. Create a Web Service from your repo (Python 3).
2. Build: `pip install -r requirements.txt`. Start: `gunicorn app:app`.
3. Add environment variables in the dashboard.

---

## 🤝 Contributing

1. Fork the project.
2. Create a branch (`git checkout -b feature/my-feature`).
3. Commit (`git commit -m 'feat: add my feature'`).
4. Push and open a Pull Request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

MIT. See [`LICENSE`](LICENSE).

---

<p align="center">
  <b>Rankora</b> — Built for developers, marketers, and creators.
</p>