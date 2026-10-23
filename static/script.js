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
      if (item) item.classList.toggle('open');
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
});
