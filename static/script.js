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

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (item) {
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

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
        scoreProgressEl.style.stroke = '#10b981';
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
    // Official canonical domain is rankoraa.vercel.app
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
        }).catch(() => {});
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

  // Dynamic Star rating descriptors & micro-interactions
  const ratingDescriptors = {
    1: '1 of 5 · Needs major improvements',
    2: '2 of 5 · Could be better',
    3: '3 of 5 · Good, some room to grow',
    4: '4 of 5 · Great experience!',
    5: '5 of 5 · Exceptional — highly recommended!'
  };

  if (starBtns.length > 0 && ratingInput) {
    starBtns.forEach(star => {
      // Hover preview
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.getAttribute('data-val') || '5', 10);
        if (ratingLabel) ratingLabel.textContent = ratingDescriptors[val] || `${val} of 5 stars`;
        starBtns.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-val') || '1', 10);
          s.classList.toggle('active', sVal <= val);
        });
      });

      // Select rating
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-val') || '5', 10);
        ratingInput.value = val;
        if (ratingLabel) ratingLabel.textContent = ratingDescriptors[val] || `${val} of 5 stars`;
        starBtns.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-val') || '1', 10);
          s.classList.toggle('active', sVal <= val);
        });
      });
    });

    const starContainer = document.getElementById('interactive-star-rating');
    if (starContainer) {
      starContainer.addEventListener('mouseleave', () => {
        const currentVal = parseInt(ratingInput.value || '5', 10);
        if (ratingLabel) ratingLabel.textContent = ratingDescriptors[currentVal] || `${currentVal} of 5 stars`;
        starBtns.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-val') || '1', 10);
          s.classList.toggle('active', sVal <= currentVal);
        });
      });
    }
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
          statusEl.textContent = 'Please enter your message.';
          statusEl.className = 'inline-feedback-status error';
        }
        return;
      }

      const submitBtn = document.getElementById('fb-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
      }
      if (statusEl) {
        statusEl.textContent = 'Submitting your feedback...';
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
          if (ratingLabel) ratingLabel.textContent = ratingDescriptors[5];
          starBtns.forEach(s => s.classList.add('active'));
          typeToggleBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-type') === 'testimonial'));
          if (ratingGroup) ratingGroup.style.display = 'block';
          if (submitBtnText) submitBtnText.textContent = 'Submit Testimonial';

          if (statusEl) {
            statusEl.textContent = type === 'testimonial'
              ? '✓ Thank you! Your testimonial has been received and will appear once reviewed by admin.'
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
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      }
    });
  }

  // Initial load
  loadTestimonials();
  loadIssues();
});
