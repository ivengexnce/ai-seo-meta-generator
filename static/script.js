/**
 * AI SEO Meta Generator — Frontend Controller
 * Plain Vanilla JavaScript with zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
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
  const serpTitlePreview = document.getElementById('serp-title-preview');
  const serpDescPreview = document.getElementById('serp-desc-preview');
  const socialTitlePreview = document.getElementById('social-title-preview');
  const socialDescPreview = document.getElementById('social-desc-preview');

  // Code Export
  const htmlCodeBlock = document.getElementById('html-code-block');
  const jsonCodeBlock = document.getElementById('json-code-block');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // API Key Drawer & Storage
  const toggleKeyBtn = document.getElementById('toggle-key-btn');
  const apiKeyDrawer = document.getElementById('api-key-drawer');
  const customApiKeyInput = document.getElementById('custom-api-key');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const clearKeyBtn = document.getElementById('clear-key-btn');
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

  // --- API Key Management ---
  const storedApiKey = localStorage.getItem('gemini_api_key');
  if (storedApiKey) {
    customApiKeyInput.value = storedApiKey;
    apiStatusLabel.textContent = 'Custom Key Active';
  }

  toggleKeyBtn.addEventListener('click', () => {
    apiKeyDrawer.classList.toggle('hidden');
  });

  saveKeyBtn.addEventListener('click', () => {
    const key = customApiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      apiStatusLabel.textContent = 'Custom Key Active';
      showToast('API Key saved locally in browser!', 'success');
      apiKeyDrawer.classList.add('hidden');
    } else {
      showToast('Please enter a valid API key.', 'error');
    }
  });

  clearKeyBtn.addEventListener('click', () => {
    localStorage.removeItem('gemini_api_key');
    customApiKeyInput.value = '';
    apiStatusLabel.textContent = 'Custom API Key';
    showToast('Saved API Key removed.', 'success');
  });

  // --- Input Counters & Clear ---
  function updateInputCounters() {
    const text = contentInput.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    charCountEl.textContent = `${chars.toLocaleString()} characters · ${words.toLocaleString()} words`;
  }

  contentInput.addEventListener('input', updateInputCounters);

  clearContentBtn.addEventListener('click', () => {
    contentInput.value = '';
    updateInputCounters();
    contentInput.focus();
  });

  // --- Sample Pill Selectors ---
  samplePills.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sample');
      if (SAMPLES[type]) {
        contentInput.value = SAMPLES[type];
        updateInputCounters();
        showToast(`Loaded ${btn.textContent} sample!`, 'success');
        contentInput.scrollTop = 0;
      }
    });
  });

  // --- Keyboard Shortcut: Ctrl/Cmd + Enter ---
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (document.activeElement === contentInput || form.contains(document.activeElement)) {
        e.preventDefault();
        form.requestSubmit();
      }
    }
  });

  // --- Tab Switching ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`tab-pane-${targetTab}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // --- Form Submission / API Call ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = contentInput.value.trim();

    if (!content) {
      showToast('Please paste page content before generating.', 'error');
      contentInput.focus();
      return;
    }

    // Set Loading UI
    setLoadingState(true);

    // Dynamic Loading Status Text Steps
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
      showToast('SEO Metadata generated successfully!', 'success');

    } catch (err) {
      clearInterval(stepInterval);
      setLoadingState(false, false);
      showToast(err.message, 'error');
      console.error('Generation Error:', err);
    }
  });

  // --- State Switching ---
  function setLoadingState(isLoading, hasSuccess = false) {
    if (isLoading) {
      generateBtn.disabled = true;
      btnSpinner.classList.remove('hidden');
      btnIcon.classList.add('hidden');
      btnText.textContent = 'Generating...';

      stateEmpty.classList.add('hidden');
      stateResults.classList.add('hidden');
      stateLoading.classList.remove('hidden');
    } else {
      generateBtn.disabled = false;
      btnSpinner.classList.add('hidden');
      btnIcon.classList.remove('hidden');
      btnText.textContent = 'Generate Meta Tags';

      stateLoading.classList.add('hidden');
      if (hasSuccess) {
        stateEmpty.classList.add('hidden');
        stateResults.classList.remove('hidden');
      } else if (!currentMetadata.meta_title) {
        stateEmpty.classList.remove('hidden');
        stateResults.classList.add('hidden');
      }
    }
  }

  // --- Render Metadata Results ---
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
  }

  // --- Title & Description Real-Time Character Indicators ---
  function updateTitleIndicators(title) {
    const len = title.length;
    titleCharBadge.textContent = `${len} / 60 chars`;

    // Percentage of 60 chars
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

  function updateDescIndicators(desc) {
    const len = desc.length;
    descCharBadge.textContent = `${len} / 160 chars`;

    // Percentage of 160 chars
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

  // Allow live editing of title & description
  metaTitleEl.addEventListener('input', () => {
    const val = metaTitleEl.textContent;
    currentMetadata.meta_title = val;
    updateTitleIndicators(val);
    updatePreviews(currentMetadata);
    updateCodeBlocks(currentMetadata);
  });

  metaDescEl.addEventListener('input', () => {
    const val = metaDescEl.textContent;
    currentMetadata.meta_description = val;
    updateDescIndicators(val);
    updatePreviews(currentMetadata);
    updateCodeBlocks(currentMetadata);
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

  // --- Keywords Rendering ---
  function renderKeywords(keywords) {
    keywordsChipsEl.innerHTML = '';
    keywords.forEach(kw => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'keyword-chip';
      chip.textContent = kw;
      chip.title = `Click to copy "${kw}"`;
      chip.addEventListener('click', () => {
        copyTextToClipboard(kw, `Copied keyword "${kw}"!`);
      });
      keywordsChipsEl.appendChild(chip);
    });
  }

  // --- SERP & Social Previews ---
  function updatePreviews(data) {
    serpTitlePreview.textContent = data.meta_title || 'Example Title';
    serpDescPreview.textContent = data.meta_description || 'Example meta description for search preview...';

    socialTitlePreview.textContent = data.og_title || data.meta_title || 'Example Title';
    socialDescDesc = data.og_description || data.meta_description || 'Example open graph description...';
    socialDescPreview.textContent = socialDescDesc;
  }

  // --- Code Blocks (HTML & JSON) ---
  function updateCodeBlocks(data) {
    const kwString = Array.isArray(data.keywords) ? data.keywords.join(', ') : '';
    const htmlHead = `<!-- Primary Meta Tags -->
<title>${escapeHtml(data.meta_title || '')}</title>
<meta name="title" content="${escapeHtml(data.meta_title || '')}">
<meta name="description" content="${escapeHtml(data.meta_description || '')}">
<meta name="keywords" content="${escapeHtml(kwString)}">

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="${escapeHtml(data.og_type || 'website')}">
<meta property="og:url" content="https://example.com/">
<meta property="og:title" content="${escapeHtml(data.og_title || data.meta_title || '')}">
<meta property="og:description" content="${escapeHtml(data.og_description || data.meta_description || '')}">
<meta property="og:image" content="https://example.com/og-image.jpg">

<!-- Twitter Cards -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://example.com/">
<meta property="twitter:title" content="${escapeHtml(data.og_title || data.meta_title || '')}">
<meta property="twitter:description" content="${escapeHtml(data.og_description || data.meta_description || '')}">
<meta property="twitter:image" content="https://example.com/og-image.jpg">`;

    htmlCodeBlock.textContent = htmlHead;
    jsonCodeBlock.textContent = JSON.stringify(data, null, 2);
  }

  function escapeHtml(str) {
    return str
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

  // Copy All OG Tags
  copyAllOgBtn.addEventListener('click', () => {
    const ogHtml = `<meta property="og:type" content="${escapeHtml(currentMetadata.og_type || 'website')}">
<meta property="og:title" content="${escapeHtml(currentMetadata.og_title || currentMetadata.meta_title || '')}">
<meta property="og:description" content="${escapeHtml(currentMetadata.og_description || currentMetadata.meta_description || '')}">`;
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

  // --- Generic Clipboard Copy ---
  async function copyTextToClipboard(text, successMsg = 'Copied!', btnEl = null) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-https or older browsers
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

      // Visual feedback on button if provided
      if (btnEl) {
        const originalHtml = btnEl.innerHTML;
        btnEl.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style="color: #10b981;">Copied!</span>
        `;
        setTimeout(() => {
          btnEl.innerHTML = originalHtml;
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Failed to copy to clipboard.', 'error');
    }
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          container.removeChild(toast);
        }
      }, 250);
    }, 3000);
  }
});
