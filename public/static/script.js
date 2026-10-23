/**
 * AI SEO Meta Generator — Frontend Controller
 * Modern motion design, interactive 3D particle canvas, GSAP reveals, and shadcn patterns
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- DOM Elements ---
  const form = document.getElementById('generator-form');
  const contentInput = document.getElementById('page-content');
  const charCountEl = document.getElementById('char-count');
  const clearContentBtn = document.getElementById('clear-content-btn');
  const generateBtn = document.getElementById('generate-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnIcon = document.getElementById('btn-icon');
  const btnText = document.getElementById('btn-text');

  // State Containers
  const stateEmpty = document.getElementById('state-empty');
  const stateLoading = document.getElementById('state-loading');
  const stateResults = document.getElementById('state-results');
  const loadingStepText = document.getElementById('loading-step-text');
  const quickActionsBar = document.getElementById('quick-actions-bar');

  // SEO Score Gauge Elements
  const seoScoreCard = document.getElementById('seo-score-card');
  const scoreGaugeBar = document.getElementById('score-gauge-bar');
  const scoreGaugeNumber = document.getElementById('score-gauge-number');
  const scoreGradePill = document.getElementById('score-grade-pill');
  const chkTitle = document.getElementById('chk-title');
  const chkTitleText = document.getElementById('chk-title-text');
  const chkDesc = document.getElementById('chk-desc');
  const chkDescText = document.getElementById('chk-desc-text');
  const chkOg = document.getElementById('chk-og');
  const chkOgText = document.getElementById('chk-og-text');
  const chkKw = document.getElementById('chk-kw');
  const chkKwText = document.getElementById('chk-kw-text');

  // Result Elements
  const metaTitleEl = document.getElementById('meta-title-text');
  const metaDescEl = document.getElementById('meta-desc-text');
  const titleCharBadge = document.getElementById('title-char-badge');
  const descCharBadge = document.getElementById('desc-char-badge');
  const titleProgressBar = document.getElementById('title-progress-bar');
  const descProgressBar = document.getElementById('desc-progress-bar');

  // Open Graph Elements
  const ogTitleEl = document.getElementById('og-title-text');
  const ogDescEl = document.getElementById('og-desc-text');
  const ogTypeEl = document.getElementById('og-type-text');
  const copyAllOgBtn = document.getElementById('copy-all-og-btn');

  // Keywords Elements
  const keywordsChipsEl = document.getElementById('keywords-chips');
  const copyKeywordsBtn = document.getElementById('copy-keywords-btn');

  // Previews Elements
  const serpContainer = document.getElementById('serp-container');
  const serpTitlePreview = document.getElementById('serp-title-preview');
  const serpDescPreview = document.getElementById('serp-desc-preview');
  const serpViewDesktop = document.getElementById('serp-view-desktop');
  const serpViewMobile = document.getElementById('serp-view-mobile');

  const socialTitlePreview = document.getElementById('social-title-preview');
  const socialDescPreview = document.getElementById('social-desc-preview');
  const socialViewTwitter = document.getElementById('social-view-twitter');
  const socialViewLinkedin = document.getElementById('social-view-linkedin');

  // Code Export Elements
  const htmlCodeBlock = document.getElementById('html-code-block');
  const jsonCodeBlock = document.getElementById('json-code-block');
  const copyAllTagsBtn = document.getElementById('copy-all-tags-btn');
  const downloadHtmlBtn = document.getElementById('download-html-btn');
  const downloadSnippetBtn = document.getElementById('download-snippet-btn');
  const downloadJsonBtn = document.getElementById('download-json-btn');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Modal Dialog Elements
  const toggleKeyBtn = document.getElementById('toggle-key-btn');
  const apiKeyModal = document.getElementById('api-key-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const customApiKeyInput = document.getElementById('custom-api-key');
  const toggleKeyVisibilityBtn = document.getElementById('toggle-key-visibility');
  const eyeIcon = document.getElementById('eye-icon');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const clearKeyBtn = document.getElementById('clear-key-btn');
  const demoModeBtn = document.getElementById('demo-mode-btn');
  const apiStatusLabel = document.getElementById('api-status-label');

  // Sample Presets
  const samplePills = document.querySelectorAll('.pill-btn');

  // Active Metadata State
  let currentMetadata = {
    meta_title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_type: 'website',
    keywords: []
  };

  // --- Sample Content Data ---
  const SAMPLES = {
    blog: `Modern Web Engineering: How AI-Augmented Development is Transforming Frontend Architecture in 2026

Artificial intelligence is no longer just a coding assistant for snippets—it is reshaping how front-end systems are designed, tested, and shipped. From declarative UI generation to automated accessibility (a11y) audits and real-time Core Web Vitals optimization, engineering teams are adopting AI-assisted workflows to build faster, more resilient web applications.

Key architectural shifts explored in this deep dive:
1. Component-driven systems powered by multimodal LLMs that respect design system constraints.
2. Automated performance tuning for Largest Contentful Paint (LCP) and Interaction to Next Paint (INP).
3. The emergence of edge-deployed AI microservices that generate personalized SEO meta tags, structured schema.org data, and dynamic open graph previews on demand.

Whether you are an engineering leader managing a distributed frontend team or a senior developer looking to future-proof your tech stack, discover the exact tools, architectural patterns, and practical case studies defining modern web development.`,

    saas: `PulseFlow — Intelligent DevOps & Incident Response Automation for High-Velocity Engineering Teams

Stop context-switching during production incidents. PulseFlow unifies distributed telemetry, CI/CD pipeline signals, and cloud infrastructure alerts into a single real-time operational hub powered by autonomous root-cause intelligence.

Key Benefits & Features:
- Instant Anomaly Detection: Correlate Kubernetes pod metrics, database query bottlenecks, and API error spikes within milliseconds.
- Automated Runbook Execution: Trigger remediations, rollbacks, and blue-green failovers without manual intervention.
- Zero-Friction Integrations: Seamless bi-directional sync with Slack, PagerDuty, GitHub Actions, Datadog, and AWS CloudWatch.
- SOC2 Type II Certified: Enterprise-grade end-to-end encryption with zero customer data retention on models.

Join over 1,400+ engineering teams at scaleups and Fortune 500 enterprises who reduced Mean Time to Resolution (MTTR) by 73%. Start your 14-day unrestricted free trial today with no credit card required.`,

    ecommerce: `Apex Glide Carbon Pro — Ultralight Marathon Racing Shoes for Peak Performance

Engineered for runners who refuse to compromise on speed and endurance. The Apex Glide Carbon Pro combines aerospace-grade carbon fiber propulsion plates with our proprietary NitroFoam cushioning to deliver unmatched energy return over 42 kilometers.

Product Specifications:
- Featherweight Design: Only 178 grams per shoe (Men's size 9).
- Full-Length Dynamic Carbon Plate: Maximizes toe-off propulsion and reduces calf fatigue on race day.
- Ultra-Breathable Engineered Mesh Upper: Hydrophobic yarn keeps your feet dry and cool across hot weather marathons.
- High-Traction Continental Rubber Outsole: Exceptional grip on wet asphalt and sharp turns.
- Certified World Athletics Compliant (39.5mm stack height).

Free 2-day express shipping and 30-day wear-and-test guarantee. Unlock your next personal best today.`
  };

  // =========================================================================
  // 1. Interactive 3D / Particle Constellation Background Canvas
  // =========================================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let particles = [];
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let animationFrameId = null;
    let isVisible = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Responsive particle count based on screen width
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 0.8;
        this.alpha = Math.random() * 0.45 + 0.2;
        // Accent colors: indigo / cyan
        this.color = Math.random() > 0.4 ? '99, 102, 241' : '6, 182, 212';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Subtle mouse pull
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180;
          this.x += (dx / dist) * force * 0.6;
          this.y += (dy / dist) * force * 0.6;
        }

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function renderCanvas() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const opacity = (1 - dist / 110) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderCanvas);
      }
    }

    if (!prefersReducedMotion) {
      renderCanvas();
    }

    // Pointer move listener
    window.addEventListener('pointermove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    }, { passive: true });

    // Resize listener
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Pause on tab hidden to save CPU/GPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isVisible = true;
        if (!prefersReducedMotion) renderCanvas();
      }
    });
  }

  // =========================================================================
  // 2. Modal Dialog (Shadcn-style API Key Configuration)
  // =========================================================================
  const storedApiKey = localStorage.getItem('gemini_api_key');
  if (storedApiKey) {
    customApiKeyInput.value = storedApiKey;
    apiStatusLabel.textContent = storedApiKey.toLowerCase() === 'demo' ? 'Demo Mode Active' : 'Custom Key Active';
  }

  function openModal() {
    apiKeyModal.classList.remove('hidden');
    toggleKeyBtn.setAttribute('aria-expanded', 'true');
    customApiKeyInput.focus();
  }

  function closeModal() {
    apiKeyModal.classList.add('hidden');
    toggleKeyBtn.setAttribute('aria-expanded', 'false');
    toggleKeyBtn.focus();
  }

  toggleKeyBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  apiKeyModal.addEventListener('click', (e) => {
    if (e.target === apiKeyModal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !apiKeyModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Password Visibility Toggle
  toggleKeyVisibilityBtn.addEventListener('click', () => {
    const isPassword = customApiKeyInput.type === 'password';
    customApiKeyInput.type = isPassword ? 'text' : 'password';
    eyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
    if (window.lucide) window.lucide.createIcons();
  });

  // Save Key
  saveKeyBtn.addEventListener('click', () => {
    const key = customApiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      apiStatusLabel.textContent = key.toLowerCase() === 'demo' ? 'Demo Mode Active' : 'Custom Key Active';
      showToast('API Key securely saved for this browser session.', 'success');
      closeModal();
    } else {
      showToast('Please enter an API key or use Demo Mode.', 'error');
    }
  });

  // Clear Key
  clearKeyBtn.addEventListener('click', () => {
    localStorage.removeItem('gemini_api_key');
    customApiKeyInput.value = '';
    apiStatusLabel.textContent = 'Custom API Key';
    showToast('Saved API Key removed.', 'success');
  });

  // Instant Demo Mode
  demoModeBtn.addEventListener('click', () => {
    customApiKeyInput.value = 'demo';
    localStorage.setItem('gemini_api_key', 'demo');
    apiStatusLabel.textContent = 'Demo Mode Active';
    showToast('Demo Mode activated! Simulated AI responses enabled.', 'success');
    closeModal();
  });

  // =========================================================================
  // 3. Input Counters & Quick Actions
  // =========================================================================
  function updateInputCounters() {
    const text = contentInput.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    charCountEl.textContent = `${chars.toLocaleString()} characters · ${words.toLocaleString()} words`;
  }

  contentInput.addEventListener('input', updateInputCounters);

  clearContentBtn.addEventListener('click', () => {
    if (contentInput.value) {
      contentInput.value = '';
      updateInputCounters();
      contentInput.focus();
      showToast('Input content cleared.', 'success');
    }
  });

  // Quick Samples
  samplePills.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sample');
      if (SAMPLES[type]) {
        contentInput.value = SAMPLES[type];
        updateInputCounters();
        showToast(`Loaded ${btn.textContent.trim()} sample!`, 'success');
        contentInput.scrollTop = 0;
      }
    });
  });

  // Keyboard Shortcut: Ctrl/Cmd + Enter to Submit
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (document.activeElement === contentInput || form.contains(document.activeElement)) {
        e.preventDefault();
        form.requestSubmit();
      }
    }
  });

  // =========================================================================
  // 4. Tab Navigation (Segmented Control)
  // =========================================================================
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const activePane = document.getElementById(`tab-pane-${targetTab}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 5. SERP & Social Simulator View Switchers (Origin UI)
  // =========================================================================
  // Google Desktop vs Mobile SERP View
  serpViewDesktop.addEventListener('click', () => {
    serpViewDesktop.classList.add('active');
    serpViewMobile.classList.remove('active');
    serpContainer.classList.remove('mobile-view');
  });

  serpViewMobile.addEventListener('click', () => {
    serpViewMobile.classList.add('active');
    serpViewDesktop.classList.remove('active');
    serpContainer.classList.add('mobile-view');
  });

  // Twitter vs LinkedIn Social Preview
  socialViewTwitter.addEventListener('click', () => {
    socialViewTwitter.classList.add('active');
    socialViewLinkedin.classList.remove('active');
  });

  socialViewLinkedin.addEventListener('click', () => {
    socialViewLinkedin.classList.add('active');
    socialViewTwitter.classList.remove('active');
  });

  // =========================================================================
  // 6. Form Submission & Generation Workflow
  // =========================================================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = contentInput.value.trim();

    if (!content) {
      showToast('Please paste page content before generating.', 'error');
      contentInput.focus();
      return;
    }

    setLoadingState(true);

    const statusSteps = [
      'Reading content and evaluating semantic structure...',
      'Optimizing meta title for Google character limits (50–60 chars)...',
      'Crafting high-CTR meta description (150–160 chars)...',
      'Synthesizing Open Graph social cards & keyword clusters...'
    ];
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % statusSteps.length;
      loadingStepText.textContent = statusSteps[stepIndex];
    }, 1200);

    const apiKey = localStorage.getItem('gemini_api_key') || customApiKeyInput.value.trim();

    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          content: content,
          api_key: apiKey || undefined
        })
      });

      clearInterval(stepInterval);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate metadata.');
      }

      currentMetadata = data;
      renderMetadata(data);
      setLoadingState(false, true);

      // Micro-confetti burst on success!
      if (window.confetti) {
        window.confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#38bdf8']
        });
      }

      showToast('SEO Metadata generated successfully!', 'success');

      // GSAP Staggered reveal if loaded
      if (window.gsap) {
        window.gsap.fromTo('.meta-card', 
          { opacity: 0, y: 16 }, 
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out' }
        );
      }

    } catch (err) {
      clearInterval(stepInterval);
      setLoadingState(false, false);
      showToast(err.message, 'error');
      console.error('Generation Error:', err);
    }
  });

  // State Switching
  function setLoadingState(isLoading, hasSuccess = false) {
    if (isLoading) {
      generateBtn.disabled = true;
      btnSpinner.classList.remove('hidden');
      btnIcon.classList.add('hidden');
      btnText.textContent = 'Generating...';

      stateEmpty.classList.add('hidden');
      stateResults.classList.add('hidden');
      stateLoading.classList.remove('hidden');
      seoScoreCard.classList.add('hidden');
      quickActionsBar.classList.add('hidden');
    } else {
      generateBtn.disabled = false;
      btnSpinner.classList.add('hidden');
      btnIcon.classList.remove('hidden');
      btnText.textContent = 'Generate Meta Tags';

      stateLoading.classList.add('hidden');
      if (hasSuccess) {
        stateEmpty.classList.add('hidden');
        stateResults.classList.remove('hidden');
        seoScoreCard.classList.remove('hidden');
        quickActionsBar.classList.remove('hidden');
      } else if (!currentMetadata.meta_title) {
        stateEmpty.classList.remove('hidden');
        stateResults.classList.add('hidden');
        seoScoreCard.classList.add('hidden');
        quickActionsBar.classList.add('hidden');
      }
    }
  }

  // =========================================================================
  // 7. Render Metadata & Live Auditing
  // =========================================================================
  function renderMetadata(data) {
    // 1. Meta Title
    metaTitleEl.textContent = data.meta_title || '';
    updateTitleIndicators(data.meta_title || '');

    // 2. Meta Description
    metaDescEl.textContent = data.meta_description || '';
    updateDescIndicators(data.meta_description || '');

    // 3. Open Graph
    ogTitleEl.textContent = data.og_title || data.meta_title || '';
    ogDescEl.textContent = data.og_description || data.meta_description || '';
    ogTypeEl.textContent = data.og_type || 'website';

    // 4. Keywords
    renderKeywords(data.keywords || []);

    // 5. Previews
    updatePreviews(data);

    // 6. Code Exports
    updateCodeBlocks(data);

    // 7. SEO Health Score Audit
    calculateSeoScore(data);

    // Refresh Lucide Icons in newly rendered nodes
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Title Indicators
  function updateTitleIndicators(title) {
    const len = title.length;
    titleCharBadge.textContent = `${len} / 60 chars`;

    const pct = Math.min(Math.round((len / 60) * 100), 100);
    titleProgressBar.style.width = `${pct}%`;

    titleCharBadge.className = 'char-badge';
    titleProgressBar.className = 'char-progress-bar';

    if (len >= 50 && len <= 60) {
      titleCharBadge.classList.add('optimal');
      titleProgressBar.classList.add('optimal');
    } else if ((len >= 40 && len < 50) || (len > 60 && len <= 68)) {
      titleCharBadge.classList.add('warning');
      titleProgressBar.classList.add('warning');
    } else {
      titleCharBadge.classList.add('danger');
      titleProgressBar.classList.add('danger');
    }
  }

  // Description Indicators
  function updateDescIndicators(desc) {
    const len = desc.length;
    descCharBadge.textContent = `${len} / 160 chars`;

    const pct = Math.min(Math.round((len / 160) * 100), 100);
    descProgressBar.style.width = `${pct}%`;

    descCharBadge.className = 'char-badge';
    descProgressBar.className = 'char-progress-bar';

    if (len >= 150 && len <= 160) {
      descCharBadge.classList.add('optimal');
      descProgressBar.classList.add('optimal');
    } else if ((len >= 130 && len < 150) || (len > 160 && len <= 175)) {
      descCharBadge.classList.add('warning');
      descProgressBar.classList.add('warning');
    } else {
      descCharBadge.classList.add('danger');
      descProgressBar.classList.add('danger');
    }
  }

  // SEO Health Score Calculator & Gauge Animation
  function calculateSeoScore(data) {
    const titleLen = (data.meta_title || '').length;
    const descLen = (data.meta_description || '').length;
    const kwCount = Array.isArray(data.keywords) ? data.keywords.length : 0;
    const hasOg = Boolean(data.og_title && data.og_description);

    let score = 0;

    // Title score (max 25)
    if (titleLen >= 50 && titleLen <= 60) {
      score += 25;
      chkTitleText.textContent = `Optimal (${titleLen} chars)`;
      updateCheckItem(chkTitle, 'success');
    } else if ((titleLen >= 40 && titleLen < 50) || (titleLen > 60 && titleLen <= 68)) {
      score += 16;
      chkTitleText.textContent = `Acceptable (${titleLen} chars)`;
      updateCheckItem(chkTitle, 'warning');
    } else {
      score += 6;
      chkTitleText.textContent = `Needs work (${titleLen} chars)`;
      updateCheckItem(chkTitle, 'danger');
    }

    // Description score (max 25)
    if (descLen >= 150 && descLen <= 160) {
      score += 25;
      chkDescText.textContent = `Optimal (${descLen} chars)`;
      updateCheckItem(chkDesc, 'success');
    } else if ((descLen >= 130 && descLen < 150) || (descLen > 160 && descLen <= 175)) {
      score += 16;
      chkDescText.textContent = `Acceptable (${descLen} chars)`;
      updateCheckItem(chkDesc, 'warning');
    } else {
      score += 6;
      chkDescText.textContent = `Needs work (${descLen} chars)`;
      updateCheckItem(chkDesc, 'danger');
    }

    // Open Graph score (max 25)
    if (hasOg) {
      score += 25;
      chkOgText.textContent = 'Social cards configured';
      updateCheckItem(chkOg, 'success');
    } else {
      score += 8;
      chkOgText.textContent = 'Incomplete OG tags';
      updateCheckItem(chkOg, 'warning');
    }

    // Keywords score (max 25)
    if (kwCount >= 5) {
      score += 25;
      chkKwText.textContent = `${kwCount} high-intent terms`;
      updateCheckItem(chkKw, 'success');
    } else if (kwCount > 0) {
      score += 14;
      chkKwText.textContent = `${kwCount} terms (suggest 5+)`;
      updateCheckItem(chkKw, 'warning');
    } else {
      score += 0;
      chkKwText.textContent = 'No keywords identified';
      updateCheckItem(chkKw, 'danger');
    }

    // Update Score Number & Grade Pill
    scoreGaugeNumber.textContent = score;

    scoreGradePill.className = 'grade-pill';
    if (score >= 90) {
      scoreGradePill.classList.add('grade-excellent');
      scoreGradePill.textContent = `Optimal (${score}%)`;
      scoreGaugeBar.style.stroke = 'var(--success)';
    } else if (score >= 70) {
      scoreGradePill.classList.add('grade-good');
      scoreGradePill.textContent = `Good (${score}%)`;
      scoreGaugeBar.style.stroke = 'var(--warning)';
    } else {
      scoreGradePill.classList.add('grade-needs-work');
      scoreGradePill.textContent = `Needs Tuning (${score}%)`;
      scoreGaugeBar.style.stroke = 'var(--danger)';
    }

    // Circumference = 2 * PI * 42 ≈ 263.89
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (score / 100) * circumference;
    scoreGaugeBar.style.strokeDashoffset = offset;
  }

  function updateCheckItem(el, status) {
    const icon = el.querySelector('.chk-icon');
    if (!icon) return;
    icon.className = `chk-icon ${status}`;
    if (status === 'success') {
      icon.setAttribute('data-lucide', 'check-circle-2');
    } else if (status === 'warning') {
      icon.setAttribute('data-lucide', 'alert-triangle');
    } else {
      icon.setAttribute('data-lucide', 'alert-circle');
    }
  }

  // Live editing listeners
  metaTitleEl.addEventListener('input', () => {
    const val = metaTitleEl.textContent;
    currentMetadata.meta_title = val;
    updateTitleIndicators(val);
    updatePreviews(currentMetadata);
    updateCodeBlocks(currentMetadata);
    calculateSeoScore(currentMetadata);
  });

  metaDescEl.addEventListener('input', () => {
    const val = metaDescEl.textContent;
    currentMetadata.meta_description = val;
    updateDescIndicators(val);
    updatePreviews(currentMetadata);
    updateCodeBlocks(currentMetadata);
    calculateSeoScore(currentMetadata);
  });

  ogTitleEl.addEventListener('input', () => {
    currentMetadata.og_title = ogTitleEl.textContent;
    updatePreviews(currentMetadata);
    updateCodeBlocks(currentMetadata);
  });

  ogDescEl.addEventListener('input', () => {
    currentMetadata.og_description = ogDescEl.textContent;
    updatePreviews(currentMetadata);
    updateCodeBlocks(currentMetadata);
  });

  // Keywords Rendering
  function renderKeywords(keywords) {
    keywordsChipsEl.innerHTML = '';
    keywords.forEach(kw => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'keyword-chip';
      chip.innerHTML = `<span>${escapeHtml(kw)}</span>`;
      chip.title = `Click to copy "${kw}"`;
      chip.addEventListener('click', () => {
        copyTextToClipboard(kw, `Copied keyword "${kw}"!`);
      });
      keywordsChipsEl.appendChild(chip);
    });
  }

  // Previews
  function updatePreviews(data) {
    serpTitlePreview.textContent = data.meta_title || 'Example Title';
    serpDescPreview.textContent = data.meta_description || 'Example meta description for search preview...';

    socialTitlePreview.textContent = data.og_title || data.meta_title || 'Example Title';
    socialDescPreview.textContent = data.og_description || data.meta_description || 'Example open graph description...';
  }

  // Code Blocks (HTML & JSON)
  function generateHtmlHeadSnippet(data) {
    const kwString = Array.isArray(data.keywords) ? data.keywords.join(', ') : '';
    return `<!-- Primary SEO Meta Tags -->
<title>${escapeHtml(data.meta_title || '')}</title>
<meta name="title" content="${escapeHtml(data.meta_title || '')}">
<meta name="description" content="${escapeHtml(data.meta_description || '')}">
<meta name="keywords" content="${escapeHtml(kwString)}">

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="${escapeHtml(data.og_type || 'website')}">
<meta property="og:url" content="https://example.com/">
<meta property="og:title" content="${escapeHtml(data.og_title || data.meta_title || '')}">
<meta property="og:description" content="${escapeHtml(data.og_description || data.meta_description || '')}">
<meta property="og:image" content="https://example.com/static/og-image.jpg">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://example.com/">
<meta name="twitter:title" content="${escapeHtml(data.og_title || data.meta_title || '')}">
<meta name="twitter:description" content="${escapeHtml(data.og_description || data.meta_description || '')}">
<meta name="twitter:image" content="https://example.com/static/og-image.jpg">`;
  }

  function updateCodeBlocks(data) {
    const htmlHead = generateHtmlHeadSnippet(data);
    htmlCodeBlock.textContent = htmlHead;
    jsonCodeBlock.textContent = JSON.stringify(data, null, 2);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // =========================================================================
  // 8. Clipboard Copy & File Download Utilities
  // =========================================================================
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (!copyBtn) return;

    const targetId = copyBtn.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      const textToCopy = targetEl.textContent || targetEl.innerText;
      copyTextToClipboard(textToCopy, 'Copied to clipboard!', copyBtn);
    }
  });

  // Copy All OG Tags
  copyAllOgBtn.addEventListener('click', () => {
    const ogHtml = `<meta property="og:type" content="${escapeHtml(currentMetadata.og_type || 'website')}">
<meta property="og:title" content="${escapeHtml(currentMetadata.og_title || currentMetadata.meta_title || '')}">
<meta property="og:description" content="${escapeHtml(currentMetadata.og_description || currentMetadata.meta_description || '')}">
<meta property="og:image" content="https://example.com/static/og-image.jpg">`;
    copyTextToClipboard(ogHtml, 'All Open Graph tags copied!', copyAllOgBtn);
  });

  // Copy All Keywords
  copyKeywordsBtn.addEventListener('click', () => {
    if (currentMetadata.keywords && currentMetadata.keywords.length > 0) {
      const kwList = currentMetadata.keywords.join(', ');
      copyTextToClipboard(kwList, 'All keywords copied!', copyKeywordsBtn);
    } else {
      showToast('No keywords available to copy.', 'error');
    }
  });

  // Copy All Tags (Header Action)
  copyAllTagsBtn.addEventListener('click', () => {
    const snippet = generateHtmlHeadSnippet(currentMetadata);
    copyTextToClipboard(snippet, 'All HTML <head> tags copied!', copyAllTagsBtn);
  });

  // File Download Helpers
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}!`, 'success');
  }

  downloadHtmlBtn.addEventListener('click', () => {
    downloadFile(generateHtmlHeadSnippet(currentMetadata), 'head-meta.html', 'text/html');
  });

  downloadSnippetBtn.addEventListener('click', () => {
    downloadFile(generateHtmlHeadSnippet(currentMetadata), 'head-meta.html', 'text/html');
  });

  downloadJsonBtn.addEventListener('click', () => {
    downloadFile(JSON.stringify(currentMetadata, null, 2), 'seo-metadata.json', 'application/json');
  });

  // Generic Clipboard Copy
  async function copyTextToClipboard(text, successMsg = 'Copied!', btnEl = null) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = text;
        tempTextarea.style.position = 'fixed';
        tempTextarea.style.left = '-9999px';
        document.body.appendChild(tempTextarea);
        tempTextarea.focus();
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
      }

      showToast(successMsg, 'success');

      if (btnEl) {
        const originalContent = btnEl.innerHTML;
        btnEl.innerHTML = `
          <i data-lucide="check" style="color: #10b981; width: 14px; height: 14px;"></i>
          <span style="color: #10b981;">Copied!</span>
        `;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          btnEl.innerHTML = originalContent;
          if (window.lucide) window.lucide.createIcons();
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Failed to copy to clipboard.', 'error');
    }
  }

  // Toast Notifications
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconHtml = type === 'success'
      ? `<i data-lucide="check-circle" style="color: #10b981; width: 18px; height: 18px; flex-shrink: 0;"></i>`
      : `<i data-lucide="alert-circle" style="color: #ef4444; width: 18px; height: 18px; flex-shrink: 0;"></i>`;

    toast.innerHTML = `${iconHtml}<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          container.removeChild(toast);
        }
      }, 250);
    }, 3200);
  }
});
