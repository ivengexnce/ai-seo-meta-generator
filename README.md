# AI SEO Meta Generator

An AI-powered web tool that analyses page content and generates production-ready SEO metadata — meta titles, descriptions, Open Graph tags, and keyword suggestions — using Google Gemini API.

Built as the capstone project for the FlyRank Front-End AI Engineering Internship Program (Jul–Oct 2026).

---

## Features

- AI-generated meta title (optimised for 50–60 characters)
- AI-generated meta description (optimised for 150–160 characters)
- Open Graph tags (og:title, og:description, og:type)
- Keyword suggestions (5–10 relevant keywords)
- One-click copy for each output field
- Clean, responsive UI — works on all screen sizes
- Zero dependencies on the frontend (plain HTML + CSS + JS)

---

## Tech Stack

- Backend: Python · Flask
- AI: Google Gemini API (gemini-1.5-flash)
- Frontend: HTML5 · CSS3 · Vanilla JavaScript
- Deployment: Render

---

## Getting Started

### Prerequisites
- Python 3.9+
- Google Gemini API key (https://aistudio.google.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ivengexnce/ai-seo-meta-generator.git
cd ai-seo-meta-generator

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set your Gemini API key
export GEMINI_API_KEY=your_api_key_here

# 4. Run the app
python app.py

# 5. Open in browser
http://localhost:5000
```

---

## Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## Project Structure

```text
ai-seo-meta-generator/
├── app.py                  # Flask backend + Gemini API integration
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html          # Frontend UI
├── static/
│   ├── style.css           # Stylesheet
│   └── script.js           # Copy-to-clipboard + form handling
├── .env.example            # Environment variable template
├── .gitignore
└── README.md
```

---

## API

`POST /generate`
`Content-Type: application/json`

**Request:**
```json
{
  "content": "Your page content here..."
}
```

**Response:**
```json
{
  "meta_title": "...",
  "meta_description": "...",
  "og_title": "...",
  "og_description": "...",
  "keywords": ["...", "...", "..."]
}
```

---

## Deployment

### Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. In project settings, add the environment variable:
   - `GEMINI_API_KEY`: your Google Gemini API key
4. Deploy! The project includes `vercel.json` and `api/index.py` configured for zero-setup serverless deployment.

### Render
1. Create a new Web Service on [Render](https://render.com) connected to your repository.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `gunicorn app:app` (or `python app.py`)
4. Set `GEMINI_API_KEY` in environment variables.

---

## Capstone Context

This project was built and accepted as the capstone submission for the
FlyRank Front-End AI Engineering Internship Program (July–October 2026).
Verified at: https://internship.flyrank.ai/verify using ID `FR-D11-02FDC-1F974`

---

## Author

**Meet Maru**
- GitHub: [github.com/ivengexnce](https://github.com/ivengexnce)
- Portfolio: [meetmaru.netlify.app](https://meetmaru.netlify.app)
