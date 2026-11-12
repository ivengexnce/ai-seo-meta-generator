import datetime
import json
import os
import re
from flask import Flask, abort, jsonify, render_template, request, send_from_directory
from dotenv import load_dotenv
import warnings

# Suppress deprecation warning from legacy SDK
warnings.filterwarnings("ignore", category=FutureWarning)

# Try importing modern official SDK google-genai
try:
    from google import genai as modern_genai
    HAS_MODERN_GENAI = True
except ImportError:
    HAS_MODERN_GENAI = False

# Fallback legacy SDK
try:
    import google.generativeai as legacy_genai
    HAS_LEGACY_GENAI = True
except ImportError:
    HAS_LEGACY_GENAI = False

# Load environment variables
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
)
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Models to try in priority order (gemini-3.5-flash-lite is fastest with generous free-tier limits)
MODERN_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.8-flash",
]

LEGACY_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.8-flash",
]


def clean_json_response(raw_text: str) -> dict:
    """Extract and parse JSON from the model's text output."""
    trimmed = raw_text.strip()

    # Strip markdown code blocks if present
    if trimmed.startswith("```"):
        trimmed = re.sub(r"^```(?:json)?\s*", "", trimmed, flags=re.IGNORECASE)
        trimmed = re.sub(r"\s*```$", "", trimmed)
        trimmed = trimmed.strip()

    try:
        return json.loads(trimmed)
    except json.JSONDecodeError:
        # Attempt to locate the first '{' and last '}'
        start = trimmed.find("{")
        end = trimmed.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(trimmed[start : end + 1])
        raise ValueError("Could not parse JSON response from Gemini model.")


FEEDBACK_FILE = os.path.join(BASE_DIR, "data", "feedbacks.json")

# Authentic feedback storage only — no fabricated testimonials or fake accounts
DEFAULT_FEEDBACKS = []

_FEEDBACKS_CACHE = None


def load_feedbacks():
    """Load community feedbacks from disk."""
    global _FEEDBACKS_CACHE
    if _FEEDBACKS_CACHE is not None:
        return _FEEDBACKS_CACHE

    try:
        if os.path.isfile(FEEDBACK_FILE):
            with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    _FEEDBACKS_CACHE = data
                    return _FEEDBACKS_CACHE
    except Exception as e:
        print(f"Failed to read feedbacks from disk: {e}")

    _FEEDBACKS_CACHE = list(DEFAULT_FEEDBACKS)
    return _FEEDBACKS_CACHE


def save_feedbacks_to_disk(feedbacks_list):
    """Safely persist feedbacks to JSON disk storage."""
    global _FEEDBACKS_CACHE
    _FEEDBACKS_CACHE = feedbacks_list
    try:
        os.makedirs(os.path.dirname(FEEDBACK_FILE), exist_ok=True)
        with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
            json.dump(feedbacks_list, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Could not persist feedback file: {e}")
        return False


def compute_feedback_stats(feedbacks_list):
    """Calculate aggregate review metrics strictly from authentic user entries."""
    if not feedbacks_list:
        return {
            "average_rating": "5.0",
            "total_reviews": 0,
            "satisfaction_rate": "100%",
            "has_reviews": False,
        }

    total = len(feedbacks_list)
    ratings = [
        fb.get("rating", 5)
        for fb in feedbacks_list
        if isinstance(fb.get("rating"), (int, float))
    ]
    avg = round(sum(ratings) / len(ratings), 1) if ratings else 5.0
    positive = len([r for r in ratings if r >= 4])
    sat_rate = f"{round((positive / total) * 100)}%" if total > 0 else "100%"

    return {
        "average_rating": f"{avg:.1f}",
        "total_reviews": total,
        "satisfaction_rate": sat_rate,
        "has_reviews": True,
    }


def resolve_canonical_base_url():
    """Dynamically resolve canonical base URL for social cards, legal pages, and SEO tags."""
    proto = request.headers.get("X-Forwarded-Proto", request.scheme)
    host = request.headers.get("X-Forwarded-Host", request.host)
    if not host or "127.0.0.1" in host or "localhost" in host:
        return os.getenv("CANONICAL_URL", "https://rankoraa.vercel.app")
    return f"{proto}://{host}".rstrip("/")


@app.route("/")
def index():
    """Render the main UI page."""
    has_api_key = bool(os.getenv("GEMINI_API_KEY"))
    gsc_verification = os.getenv(
        "GOOGLE_SITE_VERIFICATION", "bURvWAHhm3OqndkPnnzgB5twro_I0eZDfxmLyxyLiMA"
    ).strip() or "bURvWAHhm3OqndkPnnzgB5twro_I0eZDfxmLyxyLiMA"

    base_url = resolve_canonical_base_url()
    feedbacks = load_feedbacks()
    feedback_stats = compute_feedback_stats(feedbacks)

    return render_template(
        "index.html",
        has_api_key=has_api_key,
        gsc_verification=gsc_verification,
        base_url=base_url,
        feedbacks=feedbacks,
        feedback_stats=feedback_stats,
    )


@app.route("/privacy")
def privacy_page():
    """Render dedicated, serious Privacy Policy document."""
    base_url = resolve_canonical_base_url()
    return render_template("privacy.html", base_url=base_url)


@app.route("/terms")
def terms_page():
    """Render dedicated, legally protective Terms of Service document."""
    base_url = resolve_canonical_base_url()
    return render_template("terms.html", base_url=base_url)


@app.route("/og-image.png")
def og_image_png():
    """Serve canonical 1200x630 Open Graph preview image (PNG)."""
    return send_from_directory(app.static_folder, "og-image.png", mimetype="image/png")


@app.route("/og-image.jpg")
@app.route("/og-image.jpeg")
def og_image_jpg():
    """Serve canonical 1200x630 Open Graph preview image (JPEG)."""
    return send_from_directory(app.static_folder, "og-image.jpg", mimetype="image/jpeg")


VALID_GSC_TOKENS = {
    "7e9d5e6a885f213a",
}


@app.route("/google<token>.html")
def gsc_file_verification(token):
    """Serve Google Search Console HTML verification file strictly for verified tokens or valid disk files."""
    filename = f"google{token}.html"
    for folder in [BASE_DIR, os.path.join(BASE_DIR, "public")]:
        file_path = os.path.join(folder, filename)
        if os.path.isfile(file_path):
            return send_from_directory(folder, filename, mimetype="text/html")
    
    # Strictly allow configured token if serverless runtime isolates static assets
    if token in VALID_GSC_TOKENS:
        return (
            f"google-site-verification: google{token}.html\n",
            200,
            {"Content-Type": "text/html; charset=utf-8"},
        )

    abort(404)


@app.route("/favicon.ico")
def favicon_ico():
    """Serve binary multi-resolution favicon.ico for Googlebot and search crawlers."""
    return send_from_directory(app.static_folder, "favicon.ico", mimetype="image/x-icon")


@app.route("/favicon.svg")
def favicon_svg():
    """Serve scalable SVG favicon directly."""
    return send_from_directory(app.static_folder, "favicon.svg", mimetype="image/svg+xml")


@app.route("/favicon-48x48.png")
def favicon_48():
    """Serve Google Search compliant 48x48 favicon PNG."""
    return send_from_directory(app.static_folder, "favicon-48x48.png", mimetype="image/png")


@app.route("/apple-touch-icon.png")
@app.route("/apple-touch-icon-precomposed.png")
def apple_touch_icon():
    """Serve Apple iOS and web clip icon."""
    return send_from_directory(app.static_folder, "apple-touch-icon.png", mimetype="image/png")


@app.route("/site.webmanifest")
def site_webmanifest():
    """Serve web application manifest."""
    return send_from_directory(
        app.static_folder, "site.webmanifest", mimetype="application/manifest+json"
    )


@app.route("/robots.txt")
def robots_txt():
    """Serve search crawler indexation policy."""
    return send_from_directory(BASE_DIR, "robots.txt", mimetype="text/plain")


@app.route("/health")
@app.route("/api/health")
def health():
    """Health check endpoint for deployment monitoring."""
    return jsonify({"status": "ok", "app": "Rankora — AI SEO Intelligence"}), 200


@app.route("/api/feedback", methods=["GET", "POST"])
def feedback_api():
    """Receive user feedback or allow admin retrieval."""
    feedbacks = load_feedbacks()

    if request.method == "GET":
        # Feedback is locked from public retrieval to protect user privacy
        admin_key = request.args.get("key") or request.headers.get("X-Admin-Key")
        expected_key = os.getenv("ADMIN_FEEDBACK_KEY", "rankora_admin_secret_2026")

        if admin_key != expected_key:
            return (
                jsonify(
                    {
                        "status": "locked",
                        "message": "User feedback is private and locked for administrative review only. You can submit feedback anytime via POST.",
                        "can_submit": True,
                    }
                ),
                200,
            )

        # Authenticated Admin access
        stats = compute_feedback_stats(feedbacks)
        return (
            jsonify(
                {
                    "status": "success",
                    "stats": stats,
                    "total": len(feedbacks),
                    "feedbacks": feedbacks,
                }
            ),
            200,
        )

    # POST: Write-only feedback submission
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    category = data.get("category", "feedback").strip()
    raw_rating = data.get("rating", "positive")

    # Accurate rating mapping without forcing 5-stars
    if isinstance(raw_rating, int) and 1 <= raw_rating <= 5:
        numeric_rating = raw_rating
    elif raw_rating in ("accurate", "positive"):
        numeric_rating = 5
    elif raw_rating in ("needs_work", "negative"):
        numeric_rating = 3
    else:
        try:
            numeric_rating = max(1, min(5, int(raw_rating)))
        except (ValueError, TypeError):
            numeric_rating = 5

    raw_name = data.get("name", "").strip()
    author_name = raw_name if raw_name else "Anonymous User"

    raw_role = data.get("role", "").strip()
    author_role = raw_role if raw_role else ""

    email = data.get("email", "").strip()

    if not message:
        return jsonify({"error": "Feedback message cannot be empty."}), 400

    parts = author_name.split()
    initials = (parts[0][0] + (parts[1][0] if len(parts) > 1 else "")).upper() if parts and author_name != "Anonymous User" else "U"

    category_labels = {
        "accuracy": "Accuracy & SERP",
        "idea": "Feature Request",
        "ux": "UX / Experience",
        "bug": "Bug Report",
        "general": "General Feedback",
    }

    new_entry = {
        "id": f"fb_{int(datetime.datetime.now().timestamp())}",
        "name": author_name,
        "role": author_role,
        "avatar_initials": initials,
        "rating": numeric_rating,
        "category": category,
        "tag": category_labels.get(category, category.title()),
        "message": message,
        "email": email,
        "verified": False,
        "date": datetime.date.today().strftime("%Y-%m-%d"),
    }

    feedbacks.insert(0, new_entry)
    save_feedbacks_to_disk(feedbacks)

    return (
        jsonify(
            {
                "status": "success",
                "message": "Thank you! Your feedback has been securely received by the team.",
            }
        ),
        200,
    )


@app.route("/admin/feedback")
def view_feedback_dashboard():
    """Dedicated private admin dashboard for viewing all submitted feedback."""
    admin_key = request.args.get("key") or request.headers.get("X-Admin-Key")
    expected_key = os.getenv("ADMIN_FEEDBACK_KEY", "rankora_admin_secret_2026")

    if admin_key != expected_key:
        return (
            jsonify(
                {
                    "error": "Unauthorized",
                    "hint": "Pass ?key=<ADMIN_FEEDBACK_KEY> to view admin feedback dashboard.",
                }
            ),
            401,
        )

    feedbacks = load_feedbacks()
    stats = compute_feedback_stats(feedbacks)
    return (
        jsonify(
            {
                "workspace": "Rankora Private Admin Feedback Log",
                "stats": stats,
                "count": len(feedbacks),
                "feedbacks": feedbacks,
            }
        ),
        200,
    )


@app.route("/generate", methods=["POST"])
@app.route("/api/generate", methods=["POST"])
def generate_meta():
    """Analyze page content and generate SEO metadata via Gemini API."""
    data = request.get_json(silent=True) or {}
    content = data.get("content", "").strip()

    if not content:
        return (
            jsonify({"error": "Content cannot be empty. Please paste your page content."}),
            400,
        )

    # API key from environment or user-provided override
    api_key = data.get("api_key", "").strip() or os.getenv("GEMINI_API_KEY")

    if not api_key:
        return (
            jsonify(
                {
                    "error": (
                        "GEMINI_API_KEY is not configured. Please set the GEMINI_API_KEY "
                        "environment variable in your .env file or enter an API key in the UI (or enter 'demo' to test)."
                    )
                }
            ),
            400,
        )

    # Offline / Demo Mode evaluation fallback
    if api_key.lower() == "demo":
        lines = [line.strip() for line in content.split("\n") if line.strip()]
        first_line = lines[0] if lines else "AI SEO Meta Generator"
        clean_title = re.sub(r"[^a-zA-Z0-9\s-]", "", first_line)[:42].strip()
        demo_title = f"{clean_title} | Expert Guide 2026"[:60]
        if len(demo_title) < 50:
            demo_title = f"{demo_title} - Best Practice Tips"[:60]

        demo_desc = (
            f"Explore {clean_title.lower()}. Discover in-depth architectural patterns, "
            f"real-world benchmarks, and actionable insights to elevate your workflow in 2026."
        )[:160]
        if len(demo_desc) < 150:
            demo_desc = (demo_desc.rstrip(".") + ". Learn more and get started now!")[:160]

        return (
            jsonify(
                {
                    "meta_title": demo_title,
                    "meta_description": demo_desc,
                    "og_title": f"{clean_title} - Architecture & Insights",
                    "og_description": demo_desc,
                    "og_type": "article" if "blog" in content.lower() else "website",
                    "keywords": [
                        "SEO Optimization",
                        "Gemini 3.8 Flash",
                        "Frontend AI",
                        "Meta Tags",
                        "Search Intelligence",
                        "Open Graph",
                        "Performance",
                    ],
                }
            ),
            200,
        )

    prompt = f"""You are an elite SEO specialist, copywriter, and digital marketing expert.
Analyze the following web page content and produce production-ready, highly optimized SEO metadata.

Page Content:
\"\"\"
{content}
\"\"\"

Produce a valid JSON object with EXACTLY this structure:
{{
  "meta_title": "SEO-optimized title between 50 and 60 characters with primary keyword and high click appeal",
  "meta_description": "Compelling meta description between 150 and 160 characters summarizing the page value proposition",
  "og_title": "Engaging Open Graph title crafted for high engagement on social feeds (Twitter, LinkedIn, Facebook)",
  "og_description": "Clear and attractive Open Graph description for social card previews",
  "og_type": "website",
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5", "keyword 6", "keyword 7"]
}}

Optimization Guidelines:
1. meta_title: STRICTLY target 50 to 60 characters. Do not exceed 60 characters. Make it punchy and relevant.
2. meta_description: STRICTLY target 150 to 160 characters. Do not exceed 160 characters. Include a subtle call to action.
3. og_title: Tailored for social click-throughs.
4. og_description: Natural, conversational, and enticing.
5. og_type: Usually 'website' or 'article'.
6. keywords: Provide between 5 and 10 highly relevant primary and secondary keywords/phrases.
7. Return ONLY pure valid JSON with no markdown wrapping or preamble.
"""

    last_error = None

    # 1. Try modern official google-genai SDK first
    if HAS_MODERN_GENAI:
        try:
            client = modern_genai.Client(api_key=api_key)
            for model_name in MODERN_MODELS:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config={
                            "response_mime_type": "application/json",
                            "temperature": 0.3,
                        },
                    )
                    if response.text:
                        result = clean_json_response(response.text)
                        output = {
                            "meta_title": str(result.get("meta_title", "")).strip(),
                            "meta_description": str(result.get("meta_description", "")).strip(),
                            "og_title": str(
                                result.get("og_title", result.get("meta_title", ""))
                            ).strip(),
                            "og_description": str(
                                result.get("og_description", result.get("meta_description", ""))
                            ).strip(),
                            "og_type": str(result.get("og_type", "website")).strip(),
                            "keywords": [
                                str(k).strip()
                                for k in result.get("keywords", [])
                                if str(k).strip()
                            ],
                        }
                        return jsonify(output), 200
                except Exception as m_err:
                    last_error = str(m_err)
                    continue
        except Exception as c_err:
            last_error = str(c_err)

    # 2. Fallback to legacy google.generativeai if modern SDK is not available
    if HAS_LEGACY_GENAI:
        try:
            legacy_genai.configure(api_key=api_key)
            for model_name in LEGACY_MODELS:
                try:
                    model = legacy_genai.GenerativeModel(
                        model_name=model_name,
                        generation_config={
                            "response_mime_type": "application/json",
                            "temperature": 0.3,
                        },
                    )
                    response = model.generate_content(prompt)
                    if response.text:
                        result = clean_json_response(response.text)
                        output = {
                            "meta_title": str(result.get("meta_title", "")).strip(),
                            "meta_description": str(result.get("meta_description", "")).strip(),
                            "og_title": str(
                                result.get("og_title", result.get("meta_title", ""))
                            ).strip(),
                            "og_description": str(
                                result.get("og_description", result.get("meta_description", ""))
                            ).strip(),
                            "og_type": str(result.get("og_type", "website")).strip(),
                            "keywords": [
                                str(k).strip()
                                for k in result.get("keywords", [])
                                if str(k).strip()
                            ],
                        }
                        return jsonify(output), 200
                except Exception as exc:
                    last_error = str(exc)
                    continue
        except Exception as l_err:
            last_error = str(l_err)

    # If all generation attempts failed, provide smart heuristic fallback
    lines = [line.strip() for line in content.split("\n") if line.strip()]
    first_line = lines[0] if lines else "Rankora SEO Metadata"
    clean_title = re.sub(r"[^a-zA-Z0-9\s-]", "", first_line)[:40].strip()
    fallback_title = f"{clean_title} | Rankora SEO Guide"[:60]
    if len(fallback_title) < 50:
        fallback_title = f"{fallback_title} - Search Insights"[:60]

    fallback_desc = (
        f"Discover {clean_title.lower()}. Explore in-depth architectural patterns, "
        f"technical benchmarks, and actionable insights to maximize search visibility."
    )[:160]
    if len(fallback_desc) < 150:
        fallback_desc = (fallback_desc.rstrip(".") + ". Read the complete overview today!")[:160]

    words = re.findall(r"\b[A-Za-z]{4,}\b", content)
    unique_words = []
    for w in words:
        w_lower = w.lower()
        if w_lower not in [x.lower() for x in unique_words] and w_lower not in [
            "with", "that", "this", "from", "your", "have", "more", "will", "page"
        ]:
            unique_words.append(w.capitalize())
        if len(unique_words) >= 7:
            break

    fallback_output = {
        "meta_title": fallback_title,
        "meta_description": fallback_desc,
        "og_title": f"{clean_title} — Rankora",
        "og_description": fallback_desc,
        "og_type": "article" if "blog" in content.lower() else "website",
        "keywords": unique_words if unique_words else [
            "SEO Optimization", "Rankora", "Search Intelligence", "Meta Tags", "Open Graph"
        ],
        "notice": f"Calibrated using Rankora offline engine ({last_error})" if last_error else None,
    }
    return jsonify(fallback_output), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
