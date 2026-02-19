const mobileToggle = document.getElementById("mobileToggle");
const mobileNav = document.getElementById("mobileNav");
const core = window.BSHCore;
const sessionRaw = core && core.getSession ? core.getSession() : localStorage.getItem("bsh_session_v2");
const primaryCtas = document.querySelectorAll('a.get-started');
const topNavWrap = document.querySelector(".top-nav-wrap");

if (sessionRaw && primaryCtas.length) {
  primaryCtas.forEach((cta) => {
    cta.setAttribute("href", "dashboard.html");
  });
}

if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener("click", () => {
    const opened = mobileNav.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(opened));
  });
}

const getNavOffset = () => {
  if (!topNavWrap) return 88;
  return Math.ceil(topNavWrap.getBoundingClientRect().height + 12);
};

const scrollToHashTarget = (hash) => {
  if (!hash || hash === "#") return;
  const target = document.querySelector(hash);
  if (!target) return;
  const top = window.scrollY + target.getBoundingClientRect().top - getNavOffset();
  window.scrollTo({ top, behavior: "smooth" });
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", hash);
    scrollToHashTarget(hash);

    if (mobileNav && mobileNav.classList.contains("open")) {
      mobileNav.classList.remove("open");
      if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
    }
  });
});

window.addEventListener("load", () => {
  if (window.location.hash) {
    window.setTimeout(() => scrollToHashTarget(window.location.hash), 50);
  }
});

const toolMenu = document.querySelector(".tools-menu");
const toolButton = toolMenu ? toolMenu.querySelector(".dropdown-btn") : null;

if (toolMenu && toolButton) {
  toolButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = toolMenu.classList.toggle("open");
    toolButton.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", () => {
    toolMenu.classList.remove("open");
    toolButton.setAttribute("aria-expanded", "false");
  });
}

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    if (!item) return;
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("open");
      const btn = faq.querySelector("button");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
    if (!isOpen) item.classList.add("open");
    button.setAttribute("aria-expanded", String(!isOpen));
  });
});

const faqMasterToggle = document.getElementById("faqMasterToggle");
const faqList = document.getElementById("faqList");

if (faqMasterToggle && faqList) {
  faqMasterToggle.addEventListener("click", () => {
    const isExpanded = faqMasterToggle.getAttribute("aria-expanded") === "true";
    faqMasterToggle.setAttribute("aria-expanded", String(!isExpanded));
    faqList.hidden = isExpanded;
  });
}

const demoTabs = document.querySelectorAll(".demo-tabs button[data-demo]");
const demoContentArea = document.getElementById("demoContentArea");
const demoCta = document.getElementById("demoCta");

const demoContent = {
  humanizer: {
    html: `
      <div class="demo-head">
        <p><span class="dot red"></span> Original Text</p>
        <p class="score red-txt js-original-score">100% AI</p>
        <p><span class="dot green"></span> Humanized Text</p>
        <p class="score green-txt js-humanized-score">1% AI</p>
      </div>
      <div class="demo-texts">
        <div class="text-box js-original-text"></div>
        <div class="text-box js-humanized-text"></div>
      </div>
      <div class="demo-meta">
        <span>- Reduced detection signals</span>
        <span>- Natural academic rhythm</span>
      </div>
    `,
    ctaText: "Launch Humanizer Pro",
    ctaHref: "tools.html?tool=humanizer",
  },
  chat: {
    html: `
      <div class="mode-box chat-mode">
        <div class="mode-top">
          <strong>Research Copilot Assistant</strong>
          <div class="mode-tags"><span>Reasoning Mode</span><span>Multi-Modal</span></div>
        </div>
        <div class="chat-bubble user">homework_questions.pdf<br />Can you help me solve these tasks efficiently?</div>
        <div class="chat-bubble ai">Guided Breakdown Mode<br />Let's solve each question step by step with clear logic.</div>
        <div class="chat-input">Ask your question...</div>
      </div>
    `,
    ctaText: "Open Research Copilot",
    ctaHref: "tools.html?tool=chat",
  },
  essay: {
    html: `
      <div class="mode-box essay-mode">
        <div class="mode-top">
          <strong>Essay Draft: The Impact of Social Media on Mental Health</strong>
          <div class="mode-tags"><span>APA Ready</span><span>2000 words</span></div>
        </div>
        <div class="two-col">
          <div class="list-col">
            <p class="col-title">Outline</p>
            <ul>
              <li>Introduction</li>
              <li>Social Media Usage Statistics</li>
              <li>Psychological Impact Analysis</li>
              <li>Case Studies & Research</li>
            </ul>
          </div>
          <div class="list-col">
            <p class="col-title">Evidence Sources</p>
            <ul>
              <li>Journal of Psychology (2023)</li>
              <li>WHO Mental Health Report</li>
              <li>Clinical Psychology Review</li>
              <li>Digital Behavior Study</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    ctaText: "Start Essay Architect",
    ctaHref: "tools.html?tool=essay",
  },
  note: {
    html: `
      <div class="mode-box note-mode">
        <div class="mode-top">
          <strong>Biology 101: Cell Structure</strong>
          <div class="mode-tags"><span>Live Session - 15:30</span></div>
        </div>
        <div class="two-col">
          <div class="list-col">
            <p class="col-title">Key Notes</p>
            <ul>
              <li>Cell membrane controls substance movement</li>
              <li>Mitochondria: powerhouse of the cell</li>
              <li>Endoplasmic reticulum types: rough and smooth</li>
              <li>Golgi apparatus: packaging center</li>
            </ul>
          </div>
          <div class="list-col">
            <p class="col-title">Revision Tools</p>
            <ul>
              <li>Practice Quiz - Ready</li>
              <li>Flashcards - Generating</li>
              <li>Summary Notes - 3 min read</li>
              <li>Revision checklist available</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    ctaText: "Open Lecture Notes AI",
    ctaHref: "tools.html?tool=note",
  },
};

if (demoTabs.length && demoContentArea && demoCta) {
  let activeDemoRun = 0;
  const demoTimeouts = [];

  const queueDemoTimeout = (cb, delay) => {
    const id = window.setTimeout(cb, delay);
    demoTimeouts.push(id);
    return id;
  };

  const clearDemoEffects = () => {
    activeDemoRun += 1;
    while (demoTimeouts.length) {
      const id = demoTimeouts.pop();
      if (id) window.clearTimeout(id);
    }
  };

  const formatAiScore = (value) => `${Math.max(0, Math.round(value))}% AI`;

  const animateScore = (el, from, to, duration, token, done) => {
    if (!el) return;
    const start = performance.now();

    const step = (now) => {
      if (token !== activeDemoRun) return;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      el.textContent = formatAiScore(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (typeof done === "function") {
        done();
      }
    };

    requestAnimationFrame(step);
  };

  const typeText = (el, text, minDelay, maxDelay, token, done) => {
    if (!el) return;
    let i = 0;
    el.textContent = "";
    el.classList.add("is-typing");

    const writeNext = () => {
      if (token !== activeDemoRun) return;
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i += 1;
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        queueDemoTimeout(writeNext, delay);
      } else {
        el.classList.remove("is-typing");
        if (typeof done === "function") done();
      }
    };

    writeNext();
  };

  const startHumanizerLivePreview = () => {
    const token = activeDemoRun;
    const originalEl = demoContentArea.querySelector(".js-original-text");
    const humanizedEl = demoContentArea.querySelector(".js-humanized-text");
    const originalScoreEl = demoContentArea.querySelector(".js-original-score");
    const humanizedScoreEl = demoContentArea.querySelector(".js-humanized-score");
    if (!originalEl || !humanizedEl || !originalScoreEl || !humanizedScoreEl) return;

    const samples = [
      {
        original:
          "Artificial intelligence is transforming modern education by helping students organize ideas, summarize complex material, and improve writing quality across assignments.",
        humanized:
          "Artificial intelligence is reshaping education by helping students structure ideas, simplify difficult material, and improve the overall quality of their assignments.",
      },
      {
        original:
          "Digital collaboration tools improve team productivity in universities, but communication quality and clear task ownership still determine final project outcomes.",
        humanized:
          "Collaboration tools can boost university team productivity, yet strong communication and clear ownership remain the main factors behind better project outcomes.",
      },
      {
        original:
          "The rapid adoption of data analytics in business schools has increased demand for practical decision-making skills and clearer evidence-based arguments.",
        humanized:
          "As data analytics spreads across business schools, students are expected to make practical decisions and support arguments with clearer, evidence-based reasoning.",
      },
    ];

    let sampleIndex = 0;

    const runCycle = () => {
      if (token !== activeDemoRun) return;
      const sample = samples[sampleIndex % samples.length];
      sampleIndex += 1;

      originalEl.textContent = "";
      humanizedEl.textContent = "";
      originalScoreEl.textContent = "84% AI";
      humanizedScoreEl.textContent = "19% AI";

      animateScore(originalScoreEl, 84, 100, 1800, token);
      animateScore(humanizedScoreEl, 19, 1, 2200, token);

      typeText(originalEl, sample.original, 8, 17, token, () => {
        queueDemoTimeout(() => {
          typeText(humanizedEl, sample.humanized, 8, 15, token, () => {
            let pulseCount = 0;
            const pulseScores = () => {
              if (token !== activeDemoRun || pulseCount >= 6) {
                queueDemoTimeout(runCycle, 700);
                return;
              }
              pulseCount += 1;
              const originalTo = 98 + Math.random() * 2;
              const humanizedTo = 1 + Math.random() * 2;
              const originalFrom = parseFloat(originalScoreEl.textContent) || 100;
              const humanizedFrom = parseFloat(humanizedScoreEl.textContent) || 1;
              animateScore(originalScoreEl, originalFrom, originalTo, 380, token);
              animateScore(humanizedScoreEl, humanizedFrom, humanizedTo, 420, token);
              queueDemoTimeout(pulseScores, 480);
            };
            pulseScores();
          });
        }, 260);
      });
    };

    runCycle();
  };

  const setDemoContent = (key) => {
    clearDemoEffects();
    const content = demoContent[key];
    if (!content) return;
    demoContentArea.innerHTML = content.html;
    demoCta.textContent = content.ctaText;
    demoCta.setAttribute("href", content.ctaHref);
    if (key === "humanizer") startHumanizerLivePreview();
  };

  setDemoContent("humanizer");

  demoTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.demo;
      if (!key || !demoContent[key]) return;

      demoTabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      setDemoContent(key);
    });
  });
}

const billingButtons = document.querySelectorAll(".price-switch button[data-billing]");
const billingTargets = document.querySelectorAll("[data-monthly][data-yearly]");

if (billingButtons.length && billingTargets.length) {
  const setBilling = (mode) => {
    billingButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.billing === mode);
    });

    billingTargets.forEach((el) => {
      const value = el.dataset[mode];
      if (value === undefined) return;
      el.textContent = value;
    });
  };

  billingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.billing || "monthly";
      setBilling(mode);
    });
  });

  setBilling("monthly");
}

const pricingCards = document.getElementById("pricingCards");
const pricingPrev = document.getElementById("pricingPrev");
const pricingNext = document.getElementById("pricingNext");
const pricingPager = document.getElementById("pricingPager");

if (pricingCards && pricingPrev && pricingNext && pricingPager) {
  const plans = Array.from(pricingCards.querySelectorAll(".price-card"));
  let pricingIndex = 0;

  const isMobilePricing = () => window.matchMedia("(max-width: 700px)").matches;

  const renderPricingSlider = () => {
    const total = plans.length || 1;
    if (!isMobilePricing()) {
      pricingCards.style.transform = "translateX(0)";
      pricingPager.textContent = `1 / ${total}`;
      pricingIndex = 0;
      return;
    }

    if (pricingIndex < 0) pricingIndex = 0;
    if (pricingIndex > total - 1) pricingIndex = total - 1;

    const rtl = document.documentElement.getAttribute("dir") === "rtl";
    const offset = pricingIndex * 100;
    pricingCards.style.transform = rtl
      ? `translateX(${offset}%)`
      : `translateX(-${offset}%)`;
    pricingPager.textContent = `${pricingIndex + 1} / ${total}`;
  };

  pricingPrev.addEventListener("click", () => {
    if (!isMobilePricing()) return;
    pricingIndex -= 1;
    renderPricingSlider();
  });

  pricingNext.addEventListener("click", () => {
    if (!isMobilePricing()) return;
    pricingIndex += 1;
    renderPricingSlider();
  });

  window.addEventListener("resize", renderPricingSlider);
  document.addEventListener("bsh:languageChanged", renderPricingSlider);
  renderPricingSlider();
}

const toolStrips = document.querySelectorAll(".tool-group .tools-grid");

if (toolStrips.length) {
  toolStrips.forEach((strip, index) => {
    let rafId = 0;
    let paused = false;
    let direction = index % 2 === 0 ? 1 : -1;
    let speed = 0.95;

    const canScroll = () => strip.scrollWidth - strip.clientWidth > 8;

    const tick = () => {
      if (!paused && canScroll()) {
        strip.scrollLeft += speed * direction;

        const maxScroll = strip.scrollWidth - strip.clientWidth;
        if (strip.scrollLeft <= 0) {
          strip.scrollLeft = 0;
          direction = 1;
        } else if (strip.scrollLeft >= maxScroll) {
          strip.scrollLeft = maxScroll;
          direction = -1;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    strip.addEventListener("mouseenter", () => { paused = true; });
    strip.addEventListener("mouseleave", () => { paused = false; });
    strip.addEventListener("touchstart", () => { paused = true; }, { passive: true });
    strip.addEventListener("touchend", () => { paused = false; }, { passive: true });

    start();
    window.addEventListener("beforeunload", stop);
  });
}

const counterElements = document.querySelectorAll("[data-counter]");

if (counterElements.length) {
  const formatCounterValue = (value, type) => {
    if (type === "kplus") {
      return `${Math.max(1, Math.round(value))}K+`;
    }
    if (type === "percent") {
      return `${Math.max(0, value).toFixed(1)}%`;
    }
    return `${Math.max(1, Math.round(value))}+`;
  };

  const animateCounter = (el) => {
    const type = el.dataset.type || "plus";
    const target = Number(el.dataset.target || 0);
    const start = performance.now();
    const duration = 700;

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = formatCounterValue(current, type);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const startLiveEffect = (el) => {
    const type = el.dataset.type || "plus";
    const base = Number(el.dataset.target || 0);
    const min = Number(el.dataset.min || (type === "percent" ? Math.max(0, base - 2) : Math.max(1, base - 3)));
    const max = Number(el.dataset.max || (type === "percent" ? base + 2 : base + 4));
    let current = base;
    let anchor = base;

    const stepValue = () => {
      if (Math.random() > 0.7) {
        anchor = min + Math.random() * (max - min);
      }

      const pull = (anchor - current) * (type === "percent" ? 0.18 : 0.14);
      const jitter = type === "percent"
        ? (Math.random() - 0.5) * 0.18
        : (Math.random() - 0.5) * 0.7;

      current = Math.max(min, Math.min(max, current + pull + jitter));
      el.textContent = formatCounterValue(current, type);
    };

    stepValue();
    window.setInterval(stepValue, 850 + Math.floor(Math.random() * 420));
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        animateCounter(el);
        startLiveEffect(el);
        obs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  counterElements.forEach((el) => observer.observe(el));
}


