import json
import os
import re
from flask import Flask, jsonify, render_template, request, send_from_directory
from dotenv import load_dotenv
import warnings

# Suppress deprecation warning from legacy SDK
warnings.filterwarnings("ignore", category=FutureWarning)

import google.generativeai as genai

# Load environment variables
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
)

# Fallback models in priority order, supporting Gemini 3.6 Flash and newer releases
MODELS_TO_TRY = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
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


@app.route("/")
def index():
    """Render the main UI page."""
    has_api_key = bool(os.getenv("GEMINI_API_KEY"))
    return render_template("index.html", has_api_key=has_api_key)


@app.route("/favicon.ico")
@app.route("/favicon.svg")
def favicon():
    """Serve scalable SVG favicon directly."""
    return send_from_directory(app.static_folder, "favicon.svg", mimetype="image/svg+xml")


@app.route("/site.webmanifest")
def site_webmanifest():
    """Serve web application manifest."""
    return send_from_directory(
        app.static_folder, "site.webmanifest", mimetype="application/manifest+json"
    )


@app.route("/health")
@app.route("/api/health")
def health():
    """Health check endpoint for deployment monitoring."""
    return jsonify({"status": "ok", "app": "AI SEO Meta Generator"}), 200


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
                        "Gemini 3.6 Flash",
                        "Frontend AI",
                        "Meta Tags",
                        "FlyRank Capstone",
                        "Open Graph",
                        "Performance",
                    ],
                }
            ),
            200,
        )

    # Configure Gemini API
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        return jsonify({"error": f"Failed to configure Gemini API: {str(e)}"}), 500

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

    for model_name in MODELS_TO_TRY:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config={
                    "response_mime_type": "application/json",
                    "temperature": 0.3,
                },
            )
            response = model.generate_content(prompt)

            if not response.text:
                raise ValueError("Received empty response from Gemini API.")

            result = clean_json_response(response.text)

            # Validate and normalize keys
            output = {
                "meta_title": str(result.get("meta_title", "")).strip(),
                "meta_description": str(result.get("meta_description", "")).strip(),
                "og_title": str(result.get("og_title", result.get("meta_title", ""))).strip(),
                "og_description": str(
                    result.get("og_description", result.get("meta_description", ""))
                ).strip(),
                "og_type": str(result.get("og_type", "website")).strip(),
                "keywords": [str(k).strip() for k in result.get("keywords", []) if str(k).strip()],
            }

            return jsonify(output), 200

        except Exception as exc:
            last_error = str(exc)
            # Try next model in list
            continue

    # If all models failed
    return (
        jsonify(
            {
                "error": f"Failed to generate metadata using Gemini API: {last_error}",
                "details": "Please check your GEMINI_API_KEY and model availability.",
            }
        ),
        500,
    )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
