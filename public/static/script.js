/**
 * Rankora — AI SEO Intelligence Frontend Studio Controller
 * Handcrafted vanilla JavaScript with robust null-safety, live SERP simulator,
 * GSC verification sync, and seamless copy/export functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const form = document.getElementById('generator-form');
  const contentInput = document.getElementById('page-content');
  const focusKeywordsInput = document.getElementById('focus-keywords');
  const searchEngineSelect = document.getElementById('search-engine-select');
  const charCountEl = document.getElementById('char-count');
  const clearContentBtn = document.getElementById('clear-content-btn');

  const generateBtn = document.getElementById('generate-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnIcon = document.getElementById('btn-icon');
  const btnText = document.getElementById('btn-text');

  // Output Editable Elements
  const metaTitleEl = document.getElementById('meta-title-output') || document.getElementById('meta-title-text');
  const metaDescEl = document.getElementById('meta-desc-output') || document.getElementById('meta-desc-text');
  const titleCounter = document.getElementById('title-counter') || document.getElementById('title-char-badge');
  const descCounter = document.getElementById('desc-counter') || document.getElementById('desc-char-badge');
  const keywordsListEl = document.getElementById('keywords-list') || document.getElementById('keywords-chips');
  const copyKeywordsBtn = document.getElementById('copy-keywords-btn');

  // Previews
  const serpTitlePreview = document.getElementById('serp-title-preview');
  const serpDescPreview = document.getElementById('serp-desc-preview');
  const serpSlugPreview = document.getElementById('serp-slug-preview');
  const socialTitlePreview = document.getElementById('social-title-preview');
  const socialDescPreview = document.getElementById('social-desc-preview');

  // Readiness Gauge & Audit Elements
  const scoreNumEl = document.getElementById('seo-score-num');
  const scoreProgressEl = document.getElementById('score-progress');
  const scoreStatusText = document.getElementById('score-status-text');
  const chkTitleItem = document.getElementById('chk-title');
  const chkDescItem = document.getElementById('chk-desc');
  const chkGscItem = document.getElementById('chk-gsc');
  const chkGscText = document.getElementById('chk-gsc-text');
  const chkOgItem = document.getElementById('chk-og');

  // Code Export
  const htmlCodeBlock = document.getElementById('html-code-block');
  const jsonCodeBlock = document.getElementById('json-code-block');
  const copyHtmlBtn = document.getElementById('copy-html-btn');
  const copyJsonBtn = document.getElementById('copy-json-btn');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Hero Quick Actions
  const heroSerpBtn = document.getElementById('hero-serp-btn');
  const footerSerpLink = document.getElementById('footer-serp-link');

  // Google Search Console Elements
  const DEFAULT_GSC_TOKEN = 'bURvWAHhm3OqndkPnnzgB5twro_I0eZDfxmLyxyLiMA';
  const gscTokenInput = document.getElementById('gsc-token-input');
  const gscMetaTagOutput = document.getElementById('gsc-meta-tag-output');

  // API Key Modal Dialog
  const toggleKeyBtn = document.getElementById('toggle-key-btn');
  const apiKeyModal = document.getElementById('api-modal') || document.getElementById('api-key-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const customApiKeyInput = document.getElementById('custom-api-key');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const clearKeyBtn = document.getElementById('clear-key-btn');
  const demoModeBtn = document.getElementById('demo-mode-btn');
  const apiStatusLabel = document.getElementById('api-status-label');

  // Sample Presets
  const sampleBtns = document.querySelectorAll('.sample-tag-btn');

  // Active Metadata State
  let currentMetadata = {
    meta_title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_type: 'website',
    keywords: [],
    gsc_verification: DEFAULT_GSC_TOKEN
  };

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

  // --- API Key & Status Initialization ---
  const storedApiKey = localStorage.getItem('gemini_api_key');
  if (storedApiKey && customApiKeyInput) {
    customApiKeyInput.value = storedApiKey;
    if (apiStatusLabel) {
      apiStatusLabel.textContent = storedApiKey.toLowerCase() === 'demo' ? 'Demo Mode Active' : 'Custom Key Active';
    }
  }

  // --- GSC Verification Management ---
  const storedGscToken = localStorage.getItem('gsc_verification_token') || (gscTokenInput ? gscTokenInput.value.trim() : '') || DEFAULT_GSC_TOKEN;
  if (gscTokenInput) {
    gscTokenInput.value = storedGscToken;
  }
  currentMetadata.gsc_verification = storedGscToken;
  updateGscCard(storedGscToken);

  function updateGscCard(token) {
    if (!gscMetaTagOutput) return;
    const cleanToken = (token || '').trim() || DEFAULT_GSC_TOKEN;
    gscMetaTagOutput.textContent = `<meta name="google-site-verification" content="${cleanToken}">`;
  }

  if (gscTokenInput) {
    gscTokenInput.addEventListener('input', () => {
      const val = gscTokenInput.value.trim();
      currentMetadata.gsc_verification = val || DEFAULT_GSC_TOKEN;
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

  // --- Modal Helpers ---
  function openModal() {
    if (!apiKeyModal) return;
    apiKeyModal.classList.add('open');
    if (toggleKeyBtn) toggleKeyBtn.setAttribute('aria-expanded', 'true');
    if (customApiKeyInput) customApiKeyInput.focus();
  }

  function closeModal() {
    if (!apiKeyModal) return;
    apiKeyModal.classList.remove('open');
    if (toggleKeyBtn) {
      toggleKeyBtn.setAttribute('aria-expanded', 'false');
      toggleKeyBtn.focus();
    }
  }

  if (toggleKeyBtn) toggleKeyBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (apiKeyModal) {
    apiKeyModal.addEventListener('click', (e) => {
      if (e.target === apiKeyModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && apiKeyModal && apiKeyModal.classList.contains('open')) {
      closeModal();
    }
  });

  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
      const key = customApiKeyInput ? customApiKeyInput.value.trim() : '';
      if (key) {
        localStorage.setItem('gemini_api_key', key);
        if (apiStatusLabel) {
          apiStatusLabel.textContent = key.toLowerCase() === 'demo' ? 'Demo Mode Active' : 'Custom Key Active';
        }
        showToast('API Key saved for this browser session.', 'success');
        closeModal();
      } else {
        showToast('Please enter an API key or use Demo Mode.', 'error');
      }
    });
  }

  if (clearKeyBtn) {
    clearKeyBtn.addEventListener('click', () => {
      localStorage.removeItem('gemini_api_key');
      if (customApiKeyInput) customApiKeyInput.value = '';
      if (apiStatusLabel) apiStatusLabel.textContent = 'Custom API Key';
      showToast('Saved API Key removed.', 'info');
    });
  }

  if (demoModeBtn) {
    demoModeBtn.addEventListener('click', () => {
      if (customApiKeyInput) customApiKeyInput.value = 'demo';
      localStorage.setItem('gemini_api_key', 'demo');
      if (apiStatusLabel) apiStatusLabel.textContent = 'Demo Mode Active';
      showToast('Demo Mode activated with simulated AI intelligence.', 'info');
      closeModal();
    });
  }

  // --- Input Counters & Clear ---
  function updateInputCounters() {
    if (!contentInput || !charCountEl) return;
    const text = contentInput.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    charCountEl.textContent = `${chars.toLocaleString()} chars · ${words.toLocaleString()} words`;
  }

  if (contentInput) {
    contentInput.addEventListener('input', updateInputCounters);
  }

  if (clearContentBtn) {
    clearContentBtn.addEventListener('click', () => {
      if (contentInput && contentInput.value) {
        contentInput.value = '';
        updateInputCounters();
        contentInput.focus();
        showToast('Content brief cleared.', 'info');
      }
    });
  }

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sample');
      if (SAMPLES[type] && contentInput) {
        contentInput.value = SAMPLES[type];
        updateInputCounters();
        showToast(`Loaded ${btn.textContent.trim()} sample.`, 'success');
        contentInput.scrollTop = 0;
      }
    });
  });

  // Shortcut: Ctrl/Cmd + Enter
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (form && (document.activeElement === contentInput || form.contains(document.activeElement))) {
        e.preventDefault();
        form.requestSubmit();
      }
    }
  });

  // --- Tabs Navigation ---
  function switchTab(targetName) {
    tabBtns.forEach(b => {
      const isTarget = b.id.includes(targetName) || b.getAttribute('aria-controls')?.includes(targetName);
      b.classList.toggle('active', isTarget);
      b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabPanes.forEach(p => {
      const isTarget = p.id.includes(targetName);
      p.classList.toggle('active', isTarget);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.id.replace('tab-btn-', '') || btn.getAttribute('aria-controls')?.replace('tab-pane-', '') || 'generator';
      switchTab(target);
    });
  });

  function switchToSerpTab() {
    switchTab('preview');
    const pane = document.getElementById('tab-pane-preview');
    if (pane) pane.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (heroSerpBtn) heroSerpBtn.addEventListener('click', switchToSerpTab);
  if (footerSerpLink) footerSerpLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchToSerpTab();
  });

  // --- Origami FAQ Accordion & Category Filter ---
  document.querySelectorAll('.faq-question, .origami-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item, .origami-card');
      if (item) {
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

  const origamiFilterPills = document.querySelectorAll('#origami-faq-filters .origami-filter-pill');
  if (origamiFilterPills.length > 0) {
    origamiFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        origamiFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-filter') || 'all';
        const cards = document.querySelectorAll('.origami-card');
        cards.forEach(card => {
          const category = card.getAttribute('data-category') || 'general';
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.25s ease-out';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Form Submission & Generation ---
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = contentInput ? contentInput.value.trim() : '';

      if (!content) {
        showToast('Please paste page content before generating.', 'error');
        if (contentInput) contentInput.focus();
        return;
      }

      setLoadingState(true);

      const apiKey = localStorage.getItem('gemini_api_key') || (customApiKeyInput ? customApiKeyInput.value.trim() : '');

      try {
        const response = await fetch('/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            content: content,
            focus_keywords: focusKeywordsInput ? focusKeywordsInput.value.trim() : '',
            search_engine: searchEngineSelect ? searchEngineSelect.value : 'google-us',
            api_key: apiKey
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate metadata.');
        }

        // Apply generated metadata
        currentMetadata = {
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          og_title: data.og_title || data.meta_title || '',
          og_description: data.og_description || data.meta_description || '',
          og_type: data.og_type || 'website',
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          gsc_verification: (gscTokenInput ? gscTokenInput.value.trim() : '') || DEFAULT_GSC_TOKEN
        };

        renderMetadata(currentMetadata);
        revealPostGenFeedback();
        setLoadingState(false, true);
        showToast('Metadata synthesized and calibrated successfully.', 'success');

      } catch (err) {
        setLoadingState(false, false);
        showToast(err.message, 'error');
        console.error('Generation Error:', err);
      }
    });
  }

  function setLoadingState(isLoading, hasSuccess = false) {
    if (!generateBtn) return;
    if (isLoading) {
      generateBtn.disabled = true;
      if (btnSpinner) btnSpinner.classList.remove('hidden');
      if (btnIcon) btnIcon.classList.add('hidden');
      if (btnText) btnText.textContent = 'Calibrating metadata...';
    } else {
      generateBtn.disabled = false;
      if (btnSpinner) btnSpinner.classList.add('hidden');
      if (btnIcon) btnIcon.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Generate metadata';
    }
  }

  // --- Render Results ---
  function renderMetadata(data) {
    if (metaTitleEl) {
      metaTitleEl.textContent = data.meta_title || '';
    }
    updateTitleIndicators(data.meta_title || '');

    if (metaDescEl) {
      metaDescEl.textContent = data.meta_description || '';
    }
    updateDescIndicators(data.meta_description || '');

    renderKeywords(data.keywords || []);
    updatePreviews(data);
    updateCodeBlocks(data);
    calculateSeoScore(data);
  }

  function updateTitleIndicators(title) {
    const len = (title || '').length;
    if (titleCounter) {
      titleCounter.textContent = `${len} / 60`;
      titleCounter.className = 'badge-counter';
      if (len >= 50 && len <= 60) {
        titleCounter.classList.add('good');
      } else if ((len >= 40 && len < 50) || (len > 60 && len <= 68)) {
        titleCounter.classList.add('warn');
      } else if (len > 0) {
        titleCounter.classList.add('bad');
      }
    }
  }

  function updateDescIndicators(desc) {
    const len = (desc || '').length;
    if (descCounter) {
      descCounter.textContent = `${len} / 160`;
      descCounter.className = 'badge-counter';
      if (len >= 150 && len <= 160) {
        descCounter.classList.add('good');
      } else if ((len >= 130 && len < 150) || (len > 160 && len <= 175)) {
        descCounter.classList.add('warn');
      } else if (len > 0) {
        descCounter.classList.add('bad');
      }
    }
  }

  function calculateSeoScore(data) {
    const titleLen = (data.meta_title || '').length;
    const descLen = (data.meta_description || '').length;
    const kwCount = Array.isArray(data.keywords) ? data.keywords.length : 0;
    const hasOg = Boolean(data.og_title && data.og_description);

    let score = 0;

    // Title score (max 25)
    if (titleLen >= 50 && titleLen <= 60) {
      score += 25;
      if (chkTitleItem) chkTitleItem.className = 'checklist-item pass';
    } else if (titleLen >= 40 && titleLen <= 68) {
      score += 18;
      if (chkTitleItem) chkTitleItem.className = 'checklist-item warn';
    } else {
      score += titleLen > 0 ? 8 : 0;
      if (chkTitleItem) chkTitleItem.className = 'checklist-item';
    }

    // Description score (max 25)
    if (descLen >= 150 && descLen <= 160) {
      score += 25;
      if (chkDescItem) chkDescItem.className = 'checklist-item pass';
    } else if (descLen >= 130 && descLen <= 175) {
      score += 18;
      if (chkDescItem) chkDescItem.className = 'checklist-item warn';
    } else {
      score += descLen > 0 ? 8 : 0;
      if (chkDescItem) chkDescItem.className = 'checklist-item';
    }

    // Open Graph score (max 25)
    if (hasOg) {
      score += 25;
      if (chkOgItem) chkOgItem.className = 'checklist-item pass';
    } else {
      if (chkOgItem) chkOgItem.className = 'checklist-item';
    }

    // Search Console verification score (max 25)
    const token = data.gsc_verification || DEFAULT_GSC_TOKEN;
    if (token) {
      score += 25;
      if (chkGscItem) chkGscItem.className = 'checklist-item pass';
    }

    if (scoreNumEl) scoreNumEl.textContent = score;

    if (scoreStatusText) {
      if (score >= 90) {
        scoreStatusText.textContent = 'Excellent · Production Ready';
      } else if (score >= 70) {
        scoreStatusText.textContent = 'Good · Minor Tuning Suggested';
      } else if (score > 25) {
        scoreStatusText.textContent = 'In Progress';
      } else {
        scoreStatusText.textContent = 'Awaiting page content';
      }
    }

    if (scoreProgressEl) {
      const radius = 30;
      const circumference = 2 * Math.PI * radius; // ~188.5
      const offset = circumference - (score / 100) * circumference;
      scoreProgressEl.style.strokeDashoffset = offset;
      if (score >= 80) {
        scoreProgressEl.style.stroke = '#14b8a6';
      } else if (score >= 50) {
        scoreProgressEl.style.stroke = '#f59e0b';
      } else {
        scoreProgressEl.style.stroke = '#64748b';
      }
    }
  }

  // Live Inline Editing Listeners
  if (metaTitleEl) {
    metaTitleEl.addEventListener('input', () => {
      const val = metaTitleEl.textContent.trim();
      currentMetadata.meta_title = val;
      updateTitleIndicators(val);
      updatePreviews(currentMetadata);
      updateCodeBlocks(currentMetadata);
      calculateSeoScore(currentMetadata);
    });
  }

  if (metaDescEl) {
    metaDescEl.addEventListener('input', () => {
      const val = metaDescEl.textContent.trim();
      currentMetadata.meta_description = val;
      updateDescIndicators(val);
      updatePreviews(currentMetadata);
      updateCodeBlocks(currentMetadata);
      calculateSeoScore(currentMetadata);
    });
  }

  // Keywords Rendering
  function renderKeywords(keywords) {
    if (!keywordsListEl) return;
    keywordsListEl.innerHTML = '';
    if (!keywords || keywords.length === 0) {
      keywordsListEl.innerHTML = '<span class="field-tip">Keywords identified from content will appear as interactive chips here.</span>';
      return;
    }

    keywords.forEach(kw => {
      const chip = document.createElement('div');
      chip.className = 'kw-chip';
      chip.textContent = kw;
      keywordsListEl.appendChild(chip);
    });
  }

  function updatePreviews(data) {
    const titleText = data.meta_title || 'Sample Meta Title Appears Here';
    const descText = data.meta_description || 'Sample Meta Description will appear here formatted precisely as Google displays desktop search snippets...';

    if (serpTitlePreview) serpTitlePreview.textContent = titleText;
    if (serpDescPreview) serpDescPreview.textContent = descText;
    if (socialTitlePreview) socialTitlePreview.textContent = data.og_title || titleText;
    if (socialDescPreview) socialDescPreview.textContent = data.og_description || descText;
  }

  function generateHtmlHeadSnippet(data) {
    const kwString = Array.isArray(data.keywords) ? data.keywords.join(', ') : '';
    const gscToken = data.gsc_verification || DEFAULT_GSC_TOKEN;
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
    if (htmlCodeBlock) {
      htmlCodeBlock.textContent = generateHtmlHeadSnippet(data);
    }
    if (jsonCodeBlock) {
      const gscToken = data.gsc_verification || DEFAULT_GSC_TOKEN;
      const exportData = Object.assign({}, data, {
        google_site_verification: gscToken
      });
      jsonCodeBlock.textContent = JSON.stringify(exportData, null, 2);
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
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

  if (copyKeywordsBtn) {
    copyKeywordsBtn.addEventListener('click', () => {
      if (currentMetadata.keywords && currentMetadata.keywords.length > 0) {
        copyTextToClipboard(currentMetadata.keywords.join(', '), 'All keywords copied!', copyKeywordsBtn);
      } else {
        showToast('No keywords available to copy.', 'error');
      }
    });
  }

  if (copyHtmlBtn) {
    copyHtmlBtn.addEventListener('click', () => {
      const snippet = generateHtmlHeadSnippet(currentMetadata);
      copyTextToClipboard(snippet, 'HTML <head> snippet copied!', copyHtmlBtn);
    });
  }

  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
      const gscToken = currentMetadata.gsc_verification || DEFAULT_GSC_TOKEN;
      const exportData = Object.assign({}, currentMetadata, { google_site_verification: gscToken });
      copyTextToClipboard(JSON.stringify(exportData, null, 2), 'JSON schema copied!', copyJsonBtn);
    });
  }

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
        btnEl.innerHTML = `<span style="color: var(--accent-teal);">✓ Copied</span>`;
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
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          container.removeChild(toast);
        }
      }, 250);
    }, 2800);
  }

  // --- Back to Top ---
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Legal & Privacy Modals ---
  const privacyModal = document.getElementById('privacy-modal');
  const openPrivacyBtn = document.getElementById('open-privacy-btn');
  const closePrivacyBtn = document.getElementById('close-privacy-btn');
  const closePrivacyFootBtn = document.getElementById('close-privacy-foot-btn');

  function openPrivacy() {
    if (privacyModal) privacyModal.classList.add('open');
  }
  function closePrivacy() {
    if (privacyModal) privacyModal.classList.remove('open');
  }
  if (openPrivacyBtn) openPrivacyBtn.addEventListener('click', openPrivacy);
  if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', closePrivacy);
  if (closePrivacyFootBtn) closePrivacyFootBtn.addEventListener('click', closePrivacy);
  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closePrivacy();
    });
  }

  const termsModal = document.getElementById('terms-modal');
  const openTermsBtn = document.getElementById('open-terms-btn');
  const closeTermsBtn = document.getElementById('close-terms-btn');
  const closeTermsFootBtn = document.getElementById('close-terms-foot-btn');

  function openTerms() {
    if (termsModal) termsModal.classList.add('open');
  }
  function closeTerms() {
    if (termsModal) termsModal.classList.remove('open');
  }
  if (openTermsBtn) openTermsBtn.addEventListener('click', openTerms);
  if (closeTermsBtn) closeTermsBtn.addEventListener('click', closeTerms);
  if (closeTermsFootBtn) closeTermsFootBtn.addEventListener('click', closeTerms);
  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) closeTerms();
    });
  }

  // Escape key closes open legal modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (privacyModal && privacyModal.classList.contains('open')) closePrivacy();
      if (termsModal && termsModal.classList.contains('open')) closeTerms();
      if (shareModal && shareModal.classList.contains('open')) closeShare();
      if (feedbackModal && feedbackModal.classList.contains('open')) closeFeedback();
    }
  });

  // --- Share Modal & Web Share API ---
  const shareModal = document.getElementById('share-modal');
  const shareNavBtn = document.getElementById('share-nav-btn');
  const footerShareBtn = document.getElementById('footer-share-btn');
  const closeShareBtn = document.getElementById('close-share-btn');
  const closeShareFootBtn = document.getElementById('close-share-foot-btn');
  const copyShareUrlBtn = document.getElementById('copy-share-url-btn');
  const shareUrlInput = document.getElementById('share-url-input');
  const nativeShareBtn = document.getElementById('native-share-btn');

  function getCanonicalShareUrl() {
    const origin = window.location.origin;
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin.endsWith('/') ? origin : (origin + '/');
    }
    return 'https://rankoraa.vercel.app/';
  }

  function openShare() {
    const shareUrl = getCanonicalShareUrl();
    if (shareUrlInput) {
      shareUrlInput.value = shareUrl;
    }

    const shareX = document.querySelector('.share-btn-channel.share-x');
    if (shareX) {
      shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Generate search-ready SEO metadata, preview Google SERP snippets, and craft Open Graph tags with Rankora:')}&url=${encodeURIComponent(shareUrl)}`;
    }
    const shareLinkedIn = document.querySelector('.share-btn-channel.share-linkedin');
    if (shareLinkedIn) {
      shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    }
    const shareReddit = document.querySelector('.share-btn-channel.share-reddit');
    if (shareReddit) {
      shareReddit.href = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('Rankora — Free AI SEO Metadata Workspace & Google SERP Simulator')}`;
    }

    if (navigator.share && window.innerWidth <= 768) {
      navigator.share({
        title: 'Rankora — AI SEO Intelligence & SERP Simulator',
        text: 'Generate search-ready SEO metadata and preview Google search snippets with AI.',
        url: shareUrl
      }).catch(() => {
        if (shareModal) shareModal.classList.add('open');
      });
      return;
    }
    if (shareModal) shareModal.classList.add('open');
  }

  function closeShare() {
    if (shareModal) shareModal.classList.remove('open');
  }

  if (shareNavBtn) shareNavBtn.addEventListener('click', openShare);
  if (footerShareBtn) footerShareBtn.addEventListener('click', openShare);
  if (closeShareBtn) closeShareBtn.addEventListener('click', closeShare);
  if (closeShareFootBtn) closeShareFootBtn.addEventListener('click', closeShare);
  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) closeShare();
    });
  }

  if (copyShareUrlBtn) {
    copyShareUrlBtn.addEventListener('click', () => {
      const url = shareUrlInput ? shareUrlInput.value : getCanonicalShareUrl();
      copyToClipboard(url, copyShareUrlBtn, 'Link copied to clipboard!');
    });
  }

  if (nativeShareBtn) {
    nativeShareBtn.addEventListener('click', () => {
      const shareUrl = getCanonicalShareUrl();
      if (navigator.share) {
        navigator.share({
          title: 'Rankora — AI SEO Intelligence & SERP Simulator',
          text: 'Generate search-ready SEO metadata and preview Google search snippets with AI.',
          url: shareUrl
        }).catch(() => { });
      } else {
        copyToClipboard(shareUrl, nativeShareBtn, 'Link copied to clipboard!');
      }
    });
  }

  // --- Feedback Modal & Submission ---
  const feedbackModal = document.getElementById('feedback-modal');
  const openFeedbackBtn = document.getElementById('open-feedback-btn');
  const footerFeedbackBtn = document.getElementById('footer-feedback-btn');
  const floatingFeedbackBtn = document.getElementById('floating-feedback-btn');
  const closeFeedbackBtn = document.getElementById('close-feedback-btn');
  const closeFeedbackFootBtn = document.getElementById('close-feedback-foot-btn');
  const feedbackForm = document.getElementById('feedback-form');
  const feedbackNameInput = document.getElementById('feedback-name');
  const feedbackMessageInput = document.getElementById('feedback-message');
  const feedbackEmailInput = document.getElementById('feedback-email');
  const categoryChips = document.querySelectorAll('#feedback-category-chips .sentiment-btn');

  let selectedCategory = 'idea';

  categoryChips.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryChips.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.getAttribute('data-category') || 'general';
    });
  });

  function openFeedback() {
    if (feedbackModal) feedbackModal.classList.add('open');
    if (feedbackMessageInput) setTimeout(() => feedbackMessageInput.focus(), 100);
  }

  function closeFeedback() {
    if (feedbackModal) feedbackModal.classList.remove('open');
  }

  if (openFeedbackBtn) openFeedbackBtn.addEventListener('click', openFeedback);
  if (footerFeedbackBtn) footerFeedbackBtn.addEventListener('click', openFeedback);
  if (floatingFeedbackBtn) floatingFeedbackBtn.addEventListener('click', openFeedback);
  if (closeFeedbackBtn) closeFeedbackBtn.addEventListener('click', closeFeedback);
  if (closeFeedbackFootBtn) closeFeedbackFootBtn.addEventListener('click', closeFeedback);
  if (feedbackModal) {
    feedbackModal.addEventListener('click', (e) => {
      if (e.target === feedbackModal) closeFeedback();
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = feedbackMessageInput ? feedbackMessageInput.value.trim() : '';
      const email = feedbackEmailInput ? feedbackEmailInput.value.trim() : '';
      const name = feedbackNameInput ? feedbackNameInput.value.trim() : '';

      if (!message) {
        showToast('Please enter a feedback message.', 'error');
        return;
      }

      const submitBtn = document.getElementById('submit-feedback-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        const payload = {
          name: name || 'Anonymous User',
          message: message,
          category: selectedCategory,
          email: email,
          rating: 5,
          timestamp: new Date().toISOString()
        };

        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        showToast('Thank you! Your feedback has been sent directly to the team.', 'success');
        feedbackForm.reset();
        closeFeedback();
      } catch (err) {
        console.error('Feedback submit error:', err);
        showToast('Feedback noted! Thank you.', 'success');
        closeFeedback();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Feedback';
        }
      }
    });
  }

  // --- Community Reviews Filter & CTA ---
  const reviewsShareFeedbackBtn = document.getElementById('reviews-share-feedback-btn');
  if (reviewsShareFeedbackBtn) {
    reviewsShareFeedbackBtn.addEventListener('click', openFeedback);
  }

  // --- Post-Generation Interactive Feedback Strip ---
  const postGenStrip = document.getElementById('post-gen-feedback-strip');
  const postGenActions = document.getElementById('post-gen-actions-row');
  const postGenThankYou = document.getElementById('post-gen-thank-you');
  const postGenThumbsUp = document.getElementById('post-gen-thumbs-up');
  const postGenThumbsDown = document.getElementById('post-gen-thumbs-down');
  const postGenDetailedBtn = document.getElementById('post-gen-detailed-btn');
  const postGenDismissBtn = document.getElementById('post-gen-dismiss-btn');
  const feedbackShareTrigger = document.getElementById('feedback-share-trigger');

  function revealPostGenFeedback() {
    if (!postGenStrip) return;
    postGenStrip.classList.remove('hidden');
    if (postGenActions) postGenActions.classList.remove('hidden');
    if (postGenThankYou) postGenThankYou.classList.add('hidden');
  }

  async function sendQuickRating(rating, message) {
    const payload = {
      name: 'Anonymous User',
      role: '',
      message: message,
      category: 'accuracy',
      rating: rating === 'positive' ? 5 : 3,
      meta_title: (typeof currentMetadata !== 'undefined' && currentMetadata && currentMetadata.meta_title) ? currentMetadata.meta_title : '',
      timestamp: new Date().toISOString()
    };

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Quick feedback logging:', e);
    }
  }

  if (postGenThumbsUp) {
    postGenThumbsUp.addEventListener('click', async () => {
      await sendQuickRating('positive', 'User confirmed SEO results: Accurate and search-ready.');
      if (postGenActions) postGenActions.classList.add('hidden');
      if (postGenThankYou) postGenThankYou.classList.remove('hidden');
      showToast('Thank you! Glad the results were accurate.', 'success');
    });
  }

  if (postGenThumbsDown) {
    postGenThumbsDown.addEventListener('click', async () => {
      await sendQuickRating('needs_work', 'User reported SEO results: Needs work / calibration.');
      if (postGenActions) postGenActions.classList.add('hidden');
      if (postGenThankYou) postGenThankYou.classList.remove('hidden');
      openFeedback();
      if (feedbackMessageInput) {
        feedbackMessageInput.value = 'The generated metadata could be improved: ';
        feedbackMessageInput.focus();
      }
      showToast('Feedback noted. Tell us what we can improve!', 'info');
    });
  }

  if (postGenDetailedBtn) {
    postGenDetailedBtn.addEventListener('click', () => {
      openFeedback();
    });
  }

  if (postGenDismissBtn) {
    postGenDismissBtn.addEventListener('click', () => {
      if (postGenStrip) postGenStrip.classList.add('hidden');
    });
  }

  if (feedbackShareTrigger) {
    feedbackShareTrigger.addEventListener('click', () => {
      openShare();
    });
  }

  // ==========================================================================
  // Testimonials, Public Issues Tracker & Inline Feedback Form
  // ==========================================================================

  function formatRelativeTime(isoString) {
    if (!isoString) return 'recently';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'recently';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  }

  // --- Fetch & Render Testimonials ---
  async function loadTestimonials() {
    const track = document.getElementById('testimonials-track');
    const countPill = document.getElementById('testimonials-count');
    if (!track) return;

    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      const list = data.testimonials || [];

      if (countPill) {
        countPill.textContent = `${list.length} ${list.length === 1 ? 'Review' : 'Reviews'}`;
      }

      if (list.length === 0) {
        track.innerHTML = `
          <div class="community-empty-card">
            <p class="empty-title">No approved testimonials yet.</p>
            <p class="empty-sub">Be the first to share your experience with Rankora below.</p>
          </div>
        `;
        return;
      }

      track.innerHTML = list.map(item => {
        const rating = Math.max(1, Math.min(5, Number(item.rating) || 5));
        const stars = '★'.repeat(rating);
        const name = escapeHtml(item.name || 'Anonymous');
        const initials = name !== 'Anonymous'
          ? name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
          : 'U';
        const timeAgo = formatRelativeTime(item.timestamp);

        return `
          <div class="testimonial-card">
            <div class="testimonial-card-top">
              <div class="testimonial-user-row">
                <div class="testimonial-avatar">${initials}</div>
                <div class="testimonial-user-info">
                  <span class="testimonial-user-name">${name}</span>
                  <span class="testimonial-time">${timeAgo}</span>
                </div>
              </div>
              <div class="testimonial-stars" aria-label="${rating} out of 5 stars">${stars}</div>
            </div>
            <p class="testimonial-quote">“${escapeHtml(item.message || '')}”</p>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      track.innerHTML = `<div class="community-empty-card"><p>Unable to load testimonials at this time.</p></div>`;
    }
  }

  // Carousel navigation
  const prevBtn = document.getElementById('testimonials-prev-btn');
  const nextBtn = document.getElementById('testimonials-next-btn');
  const scrollContainer = document.getElementById('testimonials-scroll-container');

  if (prevBtn && scrollContainer) {
    prevBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }
  if (nextBtn && scrollContainer) {
    nextBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  // --- Fetch & Render Issues ---
  let cachedIssues = [];

  function renderIssuesList(filter = 'all') {
    const listEl = document.getElementById('issues-list');
    const countEl = document.getElementById('issues-count');
    if (!listEl) return;

    const filtered = filter === 'all'
      ? cachedIssues
      : cachedIssues.filter(i => (i.status || 'open') === filter);

    if (countEl) {
      countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'Issue' : 'Issues'}`;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="community-empty-card">
          <p class="empty-title">No issues found in this view.</p>
          <p class="empty-sub">Report any bug or suggestion using the form below.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(item => {
      const status = item.status || 'open';
      const statusLabel = status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
      const name = escapeHtml(item.name || 'Anonymous');
      const timeAgo = formatRelativeTime(item.timestamp);

      return `
        <div class="issue-item issue-status-${status}">
          <div class="issue-item-head">
            <div class="issue-meta-left">
              <span class="issue-badge badge-${status}">${statusLabel}</span>
              <span class="issue-author">${name}</span>
            </div>
            <span class="issue-time">${timeAgo}</span>
          </div>
          <p class="issue-message">${escapeHtml(item.message || '')}</p>
        </div>
      `;
    }).join('');
  }

  async function loadIssues() {
    try {
      const res = await fetch('/api/issues');
      const data = await res.json();
      cachedIssues = data.issues || [];
      renderIssuesList('all');
    } catch (err) {
      console.error('Failed to load issues:', err);
      const listEl = document.getElementById('issues-list');
      if (listEl) {
        listEl.innerHTML = `<div class="community-empty-card"><p>Unable to load issues.</p></div>`;
      }
    }
  }

  // Issue filter tabs
  const issueTabs = document.querySelectorAll('#issues-filter-tabs .issue-filter-tab');
  if (issueTabs.length > 0) {
    issueTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        issueTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const status = tab.getAttribute('data-status') || 'all';
        renderIssuesList(status);
      });
    });
  }

  // --- Inline Feedback Submission Form ---
  const inlineForm = document.getElementById('inline-feedback-form');
  const typeToggleBtns = document.querySelectorAll('#fb-type-toggle .type-toggle-btn');
  const typeInput = document.getElementById('fb-input-type');
  const ratingGroup = document.getElementById('fb-rating-group');
  const ratingInput = document.getElementById('fb-input-rating');
  const ratingLabel = document.getElementById('rating-value-label');
  const starBtns = document.querySelectorAll('#interactive-star-rating .star-rating-btn');
  const submitBtnText = document.getElementById('fb-submit-btn-text');
  const messageInput = document.getElementById('fb-input-message');
  const statusEl = document.getElementById('inline-feedback-status');

  // Type toggle
  if (typeToggleBtns.length > 0 && typeInput) {
    typeToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        typeToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const selectedType = btn.getAttribute('data-type') || 'testimonial';
        typeInput.value = selectedType;

        if (selectedType === 'issue') {
          if (submitBtnText) submitBtnText.textContent = 'Submit Issue Report';
          if (messageInput) messageInput.placeholder = 'Describe the bug, error, or feature request in detail...';
          if (ratingGroup) ratingGroup.style.display = 'none';
        } else {
          if (submitBtnText) submitBtnText.textContent = 'Submit Testimonial';
          if (messageInput) messageInput.placeholder = 'Tell us how Rankora helped calibrate your metadata...';
          if (ratingGroup) ratingGroup.style.display = 'block';
        }
      });
    });
  }

  // Star rating
  if (starBtns.length > 0 && ratingInput) {
    starBtns.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-val') || '5', 10);
        ratingInput.value = val;
        if (ratingLabel) ratingLabel.textContent = `${val} of 5 stars`;

        starBtns.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-val') || '1', 10);
          if (sVal <= val) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
    });
  }

  // Inline Form Submit
  if (inlineForm) {
    inlineForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('fb-input-name')?.value || '').trim();
      const message = (messageInput?.value || '').trim();
      const type = typeInput?.value || 'testimonial';
      const rating = parseInt(ratingInput?.value || '5', 10);

      if (!message) {
        if (statusEl) {
          statusEl.textContent = 'Please enter a message.';
          statusEl.className = 'inline-feedback-status error';
        }
        return;
      }

      const submitBtn = document.getElementById('fb-submit-btn');
      if (submitBtn) submitBtn.disabled = true;
      if (statusEl) {
        statusEl.textContent = 'Submitting...';
        statusEl.className = 'inline-feedback-status pending';
      }

      try {
        const payload = {
          name: name || 'Anonymous',
          message: message,
          type: type,
          rating: rating
        };

        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const resData = await res.json();
        if (res.ok) {
          inlineForm.reset();
          if (typeInput) typeInput.value = 'testimonial';
          if (ratingInput) ratingInput.value = '5';
          if (ratingLabel) ratingLabel.textContent = '5 of 5 stars';
          starBtns.forEach(s => s.classList.add('active'));
          typeToggleBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-type') === 'testimonial'));
          if (ratingGroup) ratingGroup.style.display = 'block';
          if (submitBtnText) submitBtnText.textContent = 'Submit Testimonial';

          if (statusEl) {
            statusEl.textContent = type === 'testimonial'
              ? '✓ Testimonial submitted! It will appear once reviewed by admin.'
              : '✓ Issue logged! It now appears on the public tracker.';
            statusEl.className = 'inline-feedback-status success';
          }

          if (type === 'issue') {
            await loadIssues();
          }
        } else {
          if (statusEl) {
            statusEl.textContent = resData.error || 'Failed to submit feedback.';
            statusEl.className = 'inline-feedback-status error';
          }
        }
      } catch (err) {
        console.error('Submission error:', err);
        if (statusEl) {
          statusEl.textContent = 'Network error. Please try again.';
          statusEl.className = 'inline-feedback-status error';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }


  // =========================================================================
  // Three.js Interactive 3D Hero Kinetic Sculpture (OneText-Inspired Aesthetic)
  // =========================================================================
  function initHeroThreeCanvas() {
    const canvas = document.getElementById('hero-three-canvas');
    const container = document.getElementById('hero-canvas-container');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const w = container.clientWidth || 560;
    const h = container.clientHeight || 520;
    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 1000);
    camera.position.set(0, 0, 7.6);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lighting setup matching the reference
    const ambientLight = new THREE.AmbientLight(0x0a1424, 1.4);
    scene.add(ambientLight);

    const keyDirLight = new THREE.DirectionalLight(0x2563eb, 2.6);
    keyDirLight.position.set(6, 8, 7);
    scene.add(keyDirLight);

    const amberPointLight = new THREE.PointLight(0xf59e0b, 2.8, 16);
    amberPointLight.position.set(-2, 0.8, 3.2);
    scene.add(amberPointLight);

    const cyanFillLight = new THREE.PointLight(0x2ab4d9, 2.2, 14);
    cyanFillLight.position.set(2.8, -2.2, 3.5);
    scene.add(cyanFillLight);

    // Root kinetic group for mouse parallax
    const kineticRig = new THREE.Group();
    scene.add(kineticRig);

    // --- 1. Materials ---
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.08
    });
    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.5,
      roughness: 0.22
    });
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xd92d20,
      metalness: 0.4,
      roughness: 0.2
    });
    const amberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.18
    });
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x2ab4d9,
      metalness: 0.6,
      roughness: 0.15
    });

    // --- 2. Upper Cobalt Blue Curved Roller Track ---
    const archGeo = new THREE.TorusGeometry(2.1, 0.11, 24, 72, Math.PI * 0.92);
    const archMesh = new THREE.Mesh(archGeo, blueMat);
    archMesh.position.set(-0.3, 1.1, -0.2);
    archMesh.rotation.z = Math.PI * 0.52;
    kineticRig.add(archMesh);

    // --- 3. Central Rotating Spoked Wheel Mechanism ---
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(-0.8, 1.2, 0.2);

    const rimGeo = new THREE.TorusGeometry(1.35, 0.075, 20, 72);
    const rimMesh = new THREE.Mesh(rimGeo, blueMat);
    wheelGroup.add(rimMesh);

    const hubGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 24);
    const hubMesh = new THREE.Mesh(hubGeo, chromeMat);
    hubMesh.rotation.x = Math.PI / 2;
    wheelGroup.add(hubMesh);

    // 6 Spokes
    const spokeGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.65, 12);
    for (let i = 0; i < 3; i++) {
      const spoke = new THREE.Mesh(spokeGeo, chromeMat);
      spoke.rotation.z = (i * Math.PI) / 3;
      wheelGroup.add(spoke);
    }
    kineticRig.add(wheelGroup);

    // --- 4. Flowing S-Curve Chute (Cherry Red Tube) ---
    const chuteSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 2.0, 0.2),
      new THREE.Vector3(-0.4, 1.4, 0.5),
      new THREE.Vector3(0.9, 0.7, 0.3),
      new THREE.Vector3(1.7, -0.4, 0.6),
      new THREE.Vector3(1.1, -1.5, 0.2),
      new THREE.Vector3(-0.1, -1.9, -0.1),
      new THREE.Vector3(-1.0, -1.4, 0.3)
    ], true);

    const chuteGeo = new THREE.TubeGeometry(chuteSpline, 90, 0.15, 16, true);
    const chuteMesh = new THREE.Mesh(chuteGeo, redMat);
    kineticRig.add(chuteMesh);

    // Parallel Chrome Guide Rail
    const railSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 2.2, 0.3),
      new THREE.Vector3(-0.4, 1.6, 0.6),
      new THREE.Vector3(0.9, 0.9, 0.4),
      new THREE.Vector3(1.9, -0.2, 0.7),
      new THREE.Vector3(1.3, -1.3, 0.3),
      new THREE.Vector3(0.1, -1.7, 0.0),
      new THREE.Vector3(-0.8, -1.2, 0.4)
    ], true);
    const railGeo = new THREE.TubeGeometry(railSpline, 90, 0.03, 10, true);
    const railMesh = new THREE.Mesh(railGeo, chromeMat);
    kineticRig.add(railMesh);

    // --- 5. Horizontal Amber Track Beam ---
    const beamGeo = new THREE.BoxGeometry(2.6, 0.12, 0.22);
    const beamMesh = new THREE.Mesh(beamGeo, amberMat);
    beamMesh.position.set(0.6, 1.6, 0.35);
    beamMesh.rotation.z = -0.05;
    kineticRig.add(beamMesh);

    // --- 6. Vertical Stepped Stage Cylinder Tokens ---
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(-0.9, -0.4, 0.3);

    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16);
    const rodMesh = new THREE.Mesh(rodGeo, chromeMat);
    pillarGroup.add(rodMesh);

    const tokenGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 24);
    const stepColors = [amberMat, redMat, blueMat, cyanMat];
    for (let i = 0; i < 4; i++) {
      const token = new THREE.Mesh(tokenGeo, stepColors[i]);
      token.position.y = -0.6 + i * 0.42;
      pillarGroup.add(token);
    }
    kineticRig.add(pillarGroup);

    // --- 7. Chrome Helical Spring at the Base ---
    const helixPoints = [];
    const turns = 4.2;
    const springRadius = 0.58;
    const springHeight = 1.35;
    const steps = 80;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 2 * turns;
      const x = Math.cos(angle) * springRadius;
      const z = Math.sin(angle) * springRadius;
      const y = (t - 0.5) * springHeight;
      helixPoints.push(new THREE.Vector3(x, y, z));
    }
    const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
    const springGeo = new THREE.TubeGeometry(helixCurve, 72, 0.055, 12, false);
    const springMesh = new THREE.Mesh(springGeo, chromeMat);
    springMesh.position.set(-0.9, -2.1, 0.3);
    kineticRig.add(springMesh);

    // --- 8. Animated Kinetic Spheres (Rolling Marbles) ---
    const sphereGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const marbleChrome = new THREE.Mesh(sphereGeo, chromeMat);
    const marbleAmber = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 24), amberMat);
    const marbleCyan = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), cyanMat);
    const marbleSmall = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), chromeMat);

    kineticRig.add(marbleChrome);
    kineticRig.add(marbleAmber);
    kineticRig.add(marbleCyan);
    kineticRig.add(marbleSmall);

    // Kinetic spheres tracking params
    let t1 = 0.0;
    let t2 = 0.33;
    let t3 = 0.66;
    let t4 = 0.85;

    // Mouse Tracking with smooth lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function onMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      targetX = ((clientX - rect.left) / container.clientWidth - 0.5) * 1.8;
      targetY = ((clientY - rect.top) / container.clientHeight - 0.5) * -1.4;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });

    // Handle Window Resize
    function onResize() {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }
    window.addEventListener('resize', onResize);

    // Visibility Observer to pause loop offscreen
    let isVisible = true;
    const heroSec = document.getElementById('hero-section');
    if (heroSec && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(heroSec);
    }

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      if (!prefersReducedMotion) {
        // Smooth mouse parallax
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        kineticRig.rotation.y = mouseX * 0.42;
        kineticRig.rotation.x = -mouseY * 0.28;

        // Continuous wheel rotation
        wheelGroup.rotation.z += 0.006;

        // Animate rolling marbles along the chute spline
        t1 = (t1 + 0.0035) % 1.0;
        t2 = (t2 + 0.0038) % 1.0;
        t3 = (t3 + 0.0042) % 1.0;
        t4 = (t4 + 0.0032) % 1.0;

        const p1 = chuteSpline.getPointAt(t1);
        const p2 = chuteSpline.getPointAt(t2);
        const p3 = chuteSpline.getPointAt(t3);
        const p4 = railSpline.getPointAt(t4);

        marbleChrome.position.copy(p1);
        marbleAmber.position.copy(p2);
        marbleCyan.position.copy(p3);
        marbleSmall.position.copy(p4);

        // Subtle breathing bounce on spring
        springMesh.scale.y = 1.0 + Math.sin(Date.now() * 0.003) * 0.06;
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  // =========================================================================
  // Handle Hero Quick Input Form (Auto-Scroll & Fill Studio)
  // =========================================================================
  window.handleHeroQuickSubmit = function() {
    const quickInput = document.getElementById('hero-quick-input');
    const val = quickInput ? quickInput.value.trim() : '';
    const textarea = document.getElementById('page-content');
    const titleInput = document.getElementById('page-title');
    const workspace = document.getElementById('studio-workspace');

    if (val) {
      if (textarea) {
        textarea.value = val;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (titleInput && !titleInput.value) {
        const cleanTitle = val.replace(/^https?:\/\//i, '').split('/')[0] || val;
        titleInput.value = cleanTitle;
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    if (workspace) {
      workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (val) {
        setTimeout(() => {
          const genBtn = document.getElementById('generate-btn');
          if (genBtn && !genBtn.disabled) {
            genBtn.click();
          }
        }, 650);
      } else if (textarea) {
        setTimeout(() => textarea.focus(), 500);
      }
    }
  };

  // =========================================================================
  // Anime.js Choreographed Animations & Micro-Interactions
  // =========================================================================
  function initAnimeVisuals() {
    if (typeof anime === 'undefined') return;

    // 1. Staggered Hero Entrance
    anime({
      targets: '.hero-stage-section .anime-reveal',
      translateY: [24, 0],
      opacity: [0, 1],
      delay: anime.stagger(110, { start: 180 }),
      duration: 950,
      easing: 'easeOutCubic'
    });

    // 2. Animated Spring Counter for Hero Metrics (NaN-safe counter proxy)
    const metric100 = document.querySelector('.hero-metric-val[data-target="100"]');
    if (metric100) {
      const counter = { val: 0 };
      anime({
        targets: counter,
        val: 100,
        round: 1,
        easing: 'easeOutExpo',
        duration: 2200,
        delay: 500,
        update: () => {
          metric100.textContent = Math.round(counter.val) + '%';
        }
      });
    }

    // 3. Magnetic Button Micro-Interaction on .magnetic-btn
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        anime({
          targets: btn,
          translateX: x * 0.18,
          translateY: y * 0.18,
          duration: 300,
          easing: 'easeOutQuad'
        });
      });

      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          translateX: 0,
          translateY: 0,
          duration: 500,
          easing: 'easeOutElastic(1, .5)'
        });
      });
    });

    // 4. Particle Burst Effect on Primary CTA Clicks
    function spawnParticleBurst(x, y) {
      const colors = ['#8952e0', '#9461e3', '#2ab4d9', '#00FF90'];
      const particles = [];
      const count = 12;

      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'anime-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.background = colors[i % colors.length];
        document.body.appendChild(p);
        particles.push(p);
      }

      anime({
        targets: particles,
        translateX: () => (Math.random() - 0.5) * 80,
        translateY: () => (Math.random() - 0.5) * 80,
        scale: [{ value: 1.4, duration: 150 }, { value: 0, duration: 450 }],
        opacity: [1, 0],
        duration: 600,
        easing: 'easeOutExpo',
        complete: () => {
          particles.forEach(p => p.remove());
        }
      });
    }

    // Attach burst to key action buttons
    document.querySelectorAll('.hero-btn-primary, #fb-submit-btn, #generate-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX || rect.left + rect.width / 2;
        const y = e.clientY || rect.top + rect.height / 2;
        spawnParticleBurst(x, y);
      });
    });
  }

  // Initialize Three.js 3D Hero & Anime.js interactions
  initHeroThreeCanvas();
  initAnimeVisuals();

  // Initial load
  loadTestimonials();
  loadIssues();
});
