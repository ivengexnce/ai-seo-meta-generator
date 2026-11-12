# Contributing to Rankora

Thank you for your interest in contributing to **Rankora**! We welcome contributions from developers, SEO practitioners, and designers of all skill levels.

---

## 🛠️ How to Fork and Clone

1. **Fork the Repository**:
   Click the **Fork** button at the top-right of the [Rankora repository](https://github.com/ivengexnce/ai-seo-meta-generator) to create your own copy on GitHub.

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/<your-username>/ai-seo-meta-generator.git
   cd ai-seo-meta-generator
   ```

3. **Set Up Remote Upstream**:
   ```bash
   git remote add upstream https://github.com/ivengexnce/ai-seo-meta-generator.git
   ```

4. **Create a Topic Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## 💻 How to Run Locally

1. **Create and Activate a Virtual Environment**:
   ```bash
   # On macOS/Linux:
   python3 -m venv .venv
   source .venv/bin/activate

   # On Windows (PowerShell):
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/):
   ```ini
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```
   *(Note: You can also enter `"demo"` as your API key or test in Demo Mode without a real key).*

4. **Start the Development Server**:
   ```bash
   python app.py
   ```
   Open `http://localhost:5000` in your web browser.

---

## 🎯 Good First Issues

Looking for somewhere to start? Here are four high-impact features ready for contribution:

- [ ] **Add dark / light mode toggle**:
  Implement a theme switcher allowing users to alternate between the default Deep Navy palette and a clean Cloud White light mode.
- [ ] **Add export to HTML file feature**:
  Create a one-click download button that exports generated tags as a downloadable `.html` boilerplate file.
- [ ] **Add character count live preview**:
  Enable dynamic real-time character counters and pixel-width calculations while the user edits the generated fields directly in the UI.
- [ ] **Add support for more meta tag types**:
  Expand generation to support JSON-LD Schema (`Article`, `Product`, `Organization`), canonical URL tags, and Dublin Core metadata.

---

## 📋 Pull Request (PR) Guidelines

To ensure smooth reviews and fast merges, please follow these guidelines:

1. **Branch Naming**:
   - `feat/feature-name` for new capabilities.
   - `fix/bug-description` for bug fixes.
   - `docs/update-description` for documentation improvements.
   - `refactor/component-name` for code cleanups without changing behavior.

2. **Commit Messages**:
   Use clear, conventional commit messages:
   - `feat: add export to HTML file button in studio`
   - `fix: resolve mobile overflow in SERP preview card`
   - `docs: update setup guide for Windows PowerShell`

3. **Code Quality & Testing**:
   - Verify that your local server starts cleanly without errors.
   - Ensure existing tests pass:
     ```bash
     python -c "import app; print('App loads successfully')"
     ```
   - Do not commit `.env`, sensitive API keys, or temporary files.

4. **Submitting the PR**:
   - Push your branch to your fork:
     ```bash
     git push origin feat/your-feature-name
     ```
   - Open a Pull Request against `main`.
   - Include a clear summary of what your PR changes, why it is needed, and attach screenshots or GIFs for any UI changes.

---

## 💬 Community & Questions

Have questions or need assistance? Feel free to open a [GitHub Issue](https://github.com/ivengexnce/ai-seo-meta-generator/issues) or reach out via our feedback modal directly in the app.
