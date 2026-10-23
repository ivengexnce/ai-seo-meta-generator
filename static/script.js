/**
 * AI SEO Meta Generator — Frontend Studio Controller
 * Handcrafted vanilla JavaScript with zero dependencies and authentic interaction design
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
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

  // Score Gauge Elements
  const seoScoreCard = document.getElementById('seo-score-card');
  const scoreGaugeBar = document.getElementById('score-gauge-bar');
  const scoreGaugeNumber = document.getElementById('score-gauge-number');
  const scoreGradePill = document.getElementById('score-grade-pill');
  const chkTitleText = document.getElementById('chk-title-text');
  const chkDescText = document.getElementById('chk-desc-text');
  const chkOgText = document.getElementById('chk-og-text');
  const chkKwText = document.getElementById('chk-kw-text');
  const chkGscText = document.getElementById('chk-gsc-text');

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

  // Keywords
  const keywordsChipsEl = document.getElementById('keywords-chips');
  const copyKeywordsBtn = document.getElementById('copy-keywords-btn');

  // Previews
  const serpContainer = document.getElementById('serp-container');
  const serpTitlePreview = document.getElementById('serp-title-preview');
  const serpDescPreview = document.getElementById('serp-desc-preview');
  const serpViewDesktop = document.getElementById('serp-view-desktop');
  const serpViewMobile = document.getElementById('serp-view-mobile');

  const socialTitlePreview = document.getElementById('social-title-preview');
  const socialDescPreview = document.getElementById('social-desc-preview');

  // Code Export
  const htmlCodeBlock = document.getElementById('html-code-block');
  const jsonCodeBlock = document.getElementById('json-code-block');
  const copyAllTagsBtn = document.getElementById('copy-all-tags-btn');
  const downloadHtmlBtn = document.getElementById('download-html-btn');
  const downloadSnippetBtn = document.getElementById('download-snippet-btn');
  const downloadJsonBtn = document.getElementById('download-json-btn');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-item');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Modal Dialog
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

  // Google Search Console Elements
  const gscTokenInput = document.getElementById('gsc-token-input');
  const gscMetaTagOutput = document.getElementById('gsc-meta-tag-output');

  // Sample Presets
  const samplePills = document.querySelectorAll('.sample-tag-btn');

  // Active Metadata State
  let currentMetadata = {
    meta_title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_type: 'website',
    keywords: [],
    gsc_verification: 'bURvWAHhm3OqndkPnnzgB5twro_I0eZDfxmLyxyLiMA'
  };

  const DEFAULT_GSC_TOKEN = 'bURvWAHhm3OqndkPnnzgB5twro_I0eZDfxmLyxyLiMA';

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

  // --- API Key Management ---
  const storedApiKey = localStorage.getItem('gemini_api_key');
  if (storedApiKey) {
    customApiKeyInput.value = storedApiKey;
    apiStatusLabel.textContent = storedApiKey.toLowerCase() === 'demo' ? 'Demo Mode Active' : 'Custom Key Active';
  }

  // --- Google Search Console Token Management ---
  const storedGscToken = localStorage.getItem('gsc_verification_token') || (gscTokenInput ? gscTokenInput.value.trim() : '') || DEFAULT_GSC_TOKEN;
  if (gscTokenInput) {
    gscTokenInput.value = storedGscToken;
  }
  currentMetadata.gsc_verification = storedGscToken;
  updateGscCard(currentMetadata.gsc_verification);

  function updateGscCard(token) {
    if (!gscMetaTagOutput) return;
    const cleanToken = (token || '').trim() || DEFAULT_GSC_TOKEN;
    gscMetaTagOutput.textContent = `<meta name="google-site-verification" content="${cleanToken}">`;
  }

  if (gscTokenInput) {
    gscTokenInput.addEventListener('input', () => {
      const val = gscTokenInput.value.trim();
      currentMetadata.gsc_verification = val;
      localStorage.setItem('gsc_verification_token', val);
      updateGscCard(val);
      updateCodeBlocks(currentMetadata);
      calculateSeoScore(currentMetadata);
    });
  }

  if (gscMetaTagOutput) {
    gscMetaTagOutput.addEventListener('input', () => {
      const rawText = gscMetaTagOutput.textContent.trim();
      const match = rawText.match(/content=["']([^"']+)["']/i);
      const token = match ? match[1].trim() : rawText;
      currentMetadata.gsc_verification = token;
      if (gscTokenInput) {
        gscTokenInput.value = token;
      }
      localStorage.setItem('gsc_verification_token', token);
      updateCodeBlocks(currentMetadata);
      calculateSeoScore(currentMetadata);
    });
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

  apiKeyModal.addEventListener('click', (e) => {
    if (e.target === apiKeyModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !apiKeyModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  toggleKeyVisibilityBtn.addEventListener('click', () => {
    const isPassword = customApiKeyInput.type === 'password';
    customApiKeyInput.type = isPassword ? 'text' : 'password';
    eyeIcon.innerHTML = isPassword
      ? `<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line>`
      : `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>`;
  });

  saveKeyBtn.addEventListener('click', () => {
    const key = customApiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      apiStatusLabel.textContent = key.toLowerCase() === 'demo' ? 'Demo Mode Active' : 'Custom Key Active';
      showToast('API Key saved for this browser session.', 'success');
      closeModal();
    } else {
      showToast('Please enter an API key or use Demo Mode.', 'error');
    }
  });

  clearKeyBtn.addEventListener('click', () => {
    localStorage.removeItem('gemini_api_key');
    customApiKeyInput.value = '';
    apiStatusLabel.textContent = 'Custom API Key';
    showToast('Saved API Key removed.', 'success');
  });

  demoModeBtn.addEventListener('click', () => {
    customApiKeyInput.value = 'demo';
    localStorage.setItem('gemini_api_key', 'demo');
    apiStatusLabel.textContent = 'Demo Mode Active';
    showToast('Demo Mode activated with simulated AI responses.', 'success');
    closeModal();
  });

  // --- Input Counters & Clear ---
  function updateInputCounters() {
    const text = contentInput.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    charCountEl.textContent = `${chars.toLocaleString()} chars · ${words.toLocaleString()} words`;
  }

  contentInput.addEventListener('input', updateInputCounters);

  clearContentBtn.addEventListener('click', () => {
    if (contentInput.value) {
      contentInput.value = '';
      updateInputCounters();
      contentInput.focus();
      showToast('Content cleared.', 'success');
    }
  });

  samplePills.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sample');
      if (SAMPLES[type]) {
        contentInput.value = SAMPLES[type];
        updateInputCounters();
        showToast(`Loaded ${btn.textContent.trim()} preset.`, 'success');
        contentInput.scrollTop = 0;
      }
    });
  });

  // Shortcut: Ctrl/Cmd + Enter
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (document.activeElement === contentInput || form.contains(document.activeElement)) {
        e.preventDefault();
        form.requestSubmit();
      }
    }
  });

  // --- Tabs Navigation ---
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

  // --- Google SERP Device Switcher ---
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

  // --- Form Submission & Generation ---
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
      'Evaluating keyword density and semantic structure...',
      'Calibrating title to 50–60 characters for SERP display...',
      'Synthesizing 150–160 character high-CTR meta description...',
      'Structuring Open Graph cards and ranking topical keywords...'
    ];
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % statusSteps.length;
      loadingStepText.textContent = statusSteps[stepIndex];
    }, 1100);

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

      currentMetadata = Object.assign({}, data, {
        gsc_verification: (gscTokenInput ? gscTokenInput.value.trim() : '') || currentMetadata.gsc_verification || ''
      });
      renderMetadata(currentMetadata);
      setLoadingState(false, true);
      showToast('SEO Metadata calibrated successfully!', 'success');

    } catch (err) {
      clearInterval(stepInterval);
      setLoadingState(false, false);
      showToast(err.message, 'error');
      console.error('Generation Error:', err);
    }
  });

  function setLoadingState(isLoading, hasSuccess = false) {
    if (isLoading) {
      generateBtn.disabled = true;
      btnSpinner.classList.remove('hidden');
      btnIcon.classList.add('hidden');
      btnText.textContent = 'Calibrating...';

      stateEmpty.classList.add('hidden');
      stateResults.classList.add('hidden');
      stateLoading.classList.remove('hidden');
      seoScoreCard.classList.add('hidden');
      quickActionsBar.classList.add('hidden');
    } else {
      generateBtn.disabled = false;
      btnSpinner.classList.add('hidden');
      btnIcon.classList.remove('hidden');
      btnText.textContent = 'Generate SEO Metadata';

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

  // --- Render Results ---
  function renderMetadata(data) {
    metaTitleEl.textContent = data.meta_title || '';
    updateTitleIndicators(data.meta_title || '');

    metaDescEl.textContent = data.meta_description || '';
    updateDescIndicators(data.meta_description || '');

    ogTitleEl.textContent = data.og_title || data.meta_title || '';
    ogDescEl.textContent = data.og_description || data.meta_description || '';
    ogTypeEl.textContent = data.og_type || 'website';

    const activeToken = data.gsc_verification || (gscTokenInput ? gscTokenInput.value.trim() : '');
    updateGscCard(activeToken);

    renderKeywords(data.keywords || []);
    updatePreviews(data);
    updateCodeBlocks(data);
    calculateSeoScore(data);
  }

  function updateTitleIndicators(title) {
    const len = title.length;
    titleCharBadge.textContent = `${len} / 60 chars`;

    const pct = Math.min(Math.round((len / 60) * 100), 100);
    titleProgressBar.style.width = `${pct}%`;

    titleCharBadge.className = 'char-pill';
    titleProgressBar.className = 'bar-fill';

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

  function updateDescIndicators(desc) {
    const len = desc.length;
    descCharBadge.textContent = `${len} / 160 chars`;

    const pct = Math.min(Math.round((len / 160) * 100), 100);
    descProgressBar.style.width = `${pct}%`;

    descCharBadge.className = 'char-pill';
    descProgressBar.className = 'bar-fill';

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

  function calculateSeoScore(data) {
    const titleLen = (data.meta_title || '').length;
    const descLen = (data.meta_description || '').length;
    const kwCount = Array.isArray(data.keywords) ? data.keywords.length : 0;
    const hasOg = Boolean(data.og_title && data.og_description);
    const gscToken = data.gsc_verification || (gscTokenInput ? gscTokenInput.value.trim() : '');

    let score = 0;

    // Title score (max 20)
    if (titleLen >= 50 && titleLen <= 60) {
      score += 20;
      chkTitleText.textContent = `Optimal (${titleLen} chars)`;
    } else if ((titleLen >= 40 && titleLen < 50) || (titleLen > 60 && titleLen <= 68)) {
      score += 14;
      chkTitleText.textContent = `Acceptable (${titleLen} chars)`;
    } else {
      score += 5;
      chkTitleText.textContent = `Needs work (${titleLen} chars)`;
    }

    // Description score (max 20)
    if (descLen >= 150 && descLen <= 160) {
      score += 20;
      chkDescText.textContent = `Optimal (${descLen} chars)`;
    } else if ((descLen >= 130 && descLen < 150) || (descLen > 160 && descLen <= 175)) {
      score += 14;
      chkDescText.textContent = `Acceptable (${descLen} chars)`;
    } else {
      score += 5;
      chkDescText.textContent = `Needs work (${descLen} chars)`;
    }

    // Open Graph score (max 20)
    if (hasOg) {
      score += 20;
      chkOgText.textContent = 'Cards configured';
    } else {
      score += 8;
      chkOgText.textContent = 'Incomplete';
    }

    // Keywords score (max 20)
    if (kwCount >= 5) {
      score += 20;
      chkKwText.textContent = `${kwCount} terms indexed`;
    } else if (kwCount > 0) {
      score += 12;
      chkKwText.textContent = `${kwCount} terms (suggest 5+)`;
    } else {
      score += 0;
      chkKwText.textContent = 'None identified';
    }

    // Google Search Console score (max 20)
    if (chkGscText) {
      if (gscToken) {
        score += 20;
        chkGscText.textContent = 'Token configured';
      } else {
        score += 20;
        chkGscText.textContent = 'Tag template ready';
      }
    }

    scoreGaugeNumber.textContent = score;

    scoreGradePill.className = 'grade-tag';
    if (score >= 90) {
      scoreGradePill.classList.add('grade-optimal');
      scoreGradePill.textContent = `Optimal · ${score}%`;
      scoreGaugeBar.style.stroke = 'var(--success)';
    } else if (score >= 70) {
      scoreGradePill.classList.add('grade-warning');
      scoreGradePill.textContent = `Good · ${score}%`;
      scoreGaugeBar.style.stroke = 'var(--warning)';
    } else {
      scoreGradePill.classList.add('grade-danger');
      scoreGradePill.textContent = `Needs Tuning · ${score}%`;
      scoreGaugeBar.style.stroke = 'var(--danger)';
    }

    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (score / 100) * circumference;
    scoreGaugeBar.style.strokeDashoffset = offset;
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
      chip.textContent = kw;
      chip.title = `Click to copy "${kw}"`;
      chip.addEventListener('click', () => {
        copyTextToClipboard(kw, `Copied "${kw}"!`);
      });
      keywordsChipsEl.appendChild(chip);
    });
  }

  function updatePreviews(data) {
    serpTitlePreview.textContent = data.meta_title || 'Example Page Title';
    serpDescPreview.textContent = data.meta_description || 'Example meta description for search snippet preview...';

    socialTitlePreview.textContent = data.og_title || data.meta_title || 'Example Title';
    socialDescPreview.textContent = data.og_description || data.meta_description || 'Example open graph description for social feeds...';
  }

  function generateHtmlHeadSnippet(data) {
    const kwString = Array.isArray(data.keywords) ? data.keywords.join(', ') : '';
    const gscToken = data.gsc_verification || (gscTokenInput ? gscTokenInput.value.trim() : '') || DEFAULT_GSC_TOKEN;
    return `<!-- Primary SEO Meta Tags -->
<title>${escapeHtml(data.meta_title || '')}</title>
<meta name="title" content="${escapeHtml(data.meta_title || '')}">
<meta name="description" content="${escapeHtml(data.meta_description || '')}">
<meta name="keywords" content="${escapeHtml(kwString)}">

<!-- Google Search Console Ownership Verification -->
<meta name="google-site-verification" content="${escapeHtml(gscToken)}">

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
    const gscToken = data.gsc_verification || (gscTokenInput ? gscTokenInput.value.trim() : '') || DEFAULT_GSC_TOKEN;
    const exportData = Object.assign({}, data, {
      google_site_verification: gscToken
    });
    jsonCodeBlock.textContent = JSON.stringify(exportData, null, 2);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // --- Copy Handlers ---
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

  copyAllOgBtn.addEventListener('click', () => {
    const ogHtml = `<meta property="og:type" content="${escapeHtml(currentMetadata.og_type || 'website')}">
<meta property="og:title" content="${escapeHtml(currentMetadata.og_title || currentMetadata.meta_title || '')}">
<meta property="og:description" content="${escapeHtml(currentMetadata.og_description || currentMetadata.meta_description || '')}">
<meta property="og:image" content="https://example.com/static/og-image.jpg">`;
    copyTextToClipboard(ogHtml, 'All Open Graph tags copied!', copyAllOgBtn);
  });

  copyKeywordsBtn.addEventListener('click', () => {
    if (currentMetadata.keywords && currentMetadata.keywords.length > 0) {
      const kwList = currentMetadata.keywords.join(', ');
      copyTextToClipboard(kwList, 'All keywords copied!', copyKeywordsBtn);
    } else {
      showToast('No keywords available to copy.', 'error');
    }
  });

  copyAllTagsBtn.addEventListener('click', () => {
    const snippet = generateHtmlHeadSnippet(currentMetadata);
    copyTextToClipboard(snippet, 'All HTML <head> tags copied!', copyAllTagsBtn);
  });

  // --- File Download Helpers ---
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
    showToast(`Saved ${filename}.`, 'success');
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
        const originalHtml = btnEl.innerHTML;
        btnEl.innerHTML = `<span style="color: #10b981;">✓ Copied</span>`;
        setTimeout(() => {
          btnEl.innerHTML = originalHtml;
        }, 1600);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Failed to copy to clipboard.', 'error');
    }
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          container.removeChild(toast);
        }
      }, 200);
    }, 2800);
  }
});
