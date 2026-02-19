(() => {
  const STORAGE = {
    history: "bsh_chatbot_history_v3",
    state: "bsh_chatbot_state_v3"
  };

  const TEXT = {
    botName: "Chat bot",
    botSub: "Smart Student Assistant",
    openLabel: "Chat bot",
    placeholder: "Ask about tools, pricing, credits, dashboard...",
    typing: "Typing...",
    intro: "Hi. I am your on-site AI assistant. I can guide you through tools, plans, and account actions.",
    guestIntro: "Tip: sign in to get plan-aware support and personal usage guidance.",
    commandsTitle: "Quick commands:",
    commands: ["/help", "/tools", "/pricing", "/stats", "/go pricing", "/clear"],
    clear: "Clear",
    export: "Export",
    close: "×",
    send: "Send",
    restored: "Previous conversation restored.",
    empty: "Type a message and I will respond.",
    chatCleared: "Chat history cleared.",
    exported: "Chat exported as .txt",
    unknown: "I can help with tools, pricing, signup/login, dashboard, legal pages, and section navigation.",
    noCore: "Core account service is unavailable on this page, but I can still guide navigation.",
    noSession: "You are not signed in. Use Get started to create an account or sign in.",
    gotoMissing: "I could not find that section. Try: tools, pricing, about, faq, testimonials.",
    legalHint: "Legal pages available: Terms, Privacy, Cookies, Affiliate policy."
  };

  const SITE = {
    tools: [
      "Humanizer Pro",
      "Research Copilot",
      "Essay Architect",
      "Lecture Notes AI",
      "Authenticity Report",
      "Smart Editor"
    ],
    sections: {
      home: "#home",
      tools: "#tools",
      pricing: "#pricing",
      about: "#about",
      faq: "#faq",
      testimonials: "#testimonials"
    },
    legal: {
      terms: "terms.html",
      privacy: "privacy.html",
      cookies: "cookies.html",
      affiliate: "affiliate-policy.html"
    }
  };

  const nowIso = () => new Date().toISOString();
  const byId = (id) => document.getElementById(id);
  const isIndex = /index\.html$/.test(window.location.pathname) || window.location.pathname.endsWith("/");

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const safeParse = (raw, fallback) => {
    try {
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch (_) {
      return fallback;
    }
  };

  const readHistory = () => {
    const items = safeParse(localStorage.getItem(STORAGE.history), []);
    return Array.isArray(items) ? items.slice(-80) : [];
  };

  const writeHistory = (items) => {
    localStorage.setItem(STORAGE.history, JSON.stringify(items.slice(-80)));
  };

  const readState = () => {
    return safeParse(localStorage.getItem(STORAGE.state), {
      open: false,
      minimized: false,
      unread: 0
    });
  };

  const writeState = (state) => {
    localStorage.setItem(STORAGE.state, JSON.stringify(state));
  };

  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const scrollToSection = (hash) => {
    if (!isIndex) return false;
    const target = document.querySelector(hash);
    if (!target) return false;

    const nav = document.querySelector(".top-nav-wrap");
    const offset = nav ? Math.ceil(nav.getBoundingClientRect().height + 12) : 90;
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  };

  const resolveGoTarget = (question) => {
    const q = String(question || "").toLowerCase();
    if (/(home|landing|top)/i.test(q)) return SITE.sections.home;
    if (/(tool|tools|humanizer|copilot|essay|notes|editor|report)/i.test(q)) return SITE.sections.tools;
    if (/(pricing|price|plan|plans|upgrade|subscription)/i.test(q)) return SITE.sections.pricing;
    if (/(about|company|story)/i.test(q)) return SITE.sections.about;
    if (/(faq|questions|help)/i.test(q)) return SITE.sections.faq;
    if (/(testimonial|testimonials|review|reviews|students)/i.test(q)) return SITE.sections.testimonials;
    return null;
  };

  const getUserSnapshot = () => {
    const core = window.BSHCore;
    if (!core) return { ok: false, reason: "no_core" };

    const user = core.getCurrentUser?.();
    if (!user) return { ok: false, reason: "no_session" };

    const usage = core.getUsageStats?.(user);
    return {
      ok: true,
      user,
      planName: user.plan || "Free",
      used: String(usage?.wordsUsed ?? 0),
      remaining: usage?.remaining === Infinity ? "Unlimited" : String(usage?.remaining ?? 0)
    };
  };

  const buildPricingLines = () => {
    const core = window.BSHCore;
    if (!core || !core.PLAN_CONFIG) {
      return [
        "- Free: 5,000 monthly credits",
        "- Sapphire: 50,000 monthly credits",
        "- Emerald: 150,000 monthly credits",
        "- Ruby: Unlimited credits"
      ];
    }

    return Object.entries(core.PLAN_CONFIG).map(([name, cfg]) => {
      const credits = cfg.monthlyWords === Infinity
        ? "Unlimited credits"
        : `${cfg.monthlyWords.toLocaleString()} monthly credits`;
      return `- ${name}: ${credits}`;
    });
  };

  const buildReply = (question) => {
    const q = String(question || "").trim();
    const lower = q.toLowerCase();

    if (!q) return TEXT.empty;

    if (lower === "/clear") {
      return { special: "clear", text: TEXT.chatCleared };
    }

    if (lower === "/help") {
      return `${TEXT.commandsTitle} ${TEXT.commands.join("  ")}`;
    }

    if (lower === "/tools" || /(tool|tools|humanizer|copilot|essay|notes|editor|report)/i.test(q)) {
      return `You currently have ${SITE.tools.length} tools: ${SITE.tools.join(", ")}.`;
    }

    if (lower === "/pricing" || /(pricing|price|plan|plans|upgrade|subscription)/i.test(q)) {
      return `Available plans:\n${buildPricingLines().join("\n")}`;
    }

    if (lower === "/stats" || /(stats|usage|credit|credits|remaining|limit)/i.test(q)) {
      const snap = getUserSnapshot();
      if (!snap.ok) return snap.reason === "no_core" ? TEXT.noCore : TEXT.noSession;
      return `Your plan is ${snap.planName}. Used words this cycle: ${snap.used}. Remaining: ${snap.remaining}.`;
    }

    if (/^\/go\s+/i.test(lower) || /(go to|take me|navigate|where is|location)/i.test(q)) {
      const target = resolveGoTarget(q.replace(/^\/go\s+/i, ""));
      if (!target) return TEXT.gotoMissing;
      const done = scrollToSection(target);
      return done ? "Done. I moved you to that section." : TEXT.gotoMissing;
    }

    if (/(sign ?up|sign ?in|login|register|account)/i.test(q)) {
      return "To sign up or log in, click Get started in the top bar.";
    }

    if (/(dashboard|panel|usage page)/i.test(q)) {
      const snap = getUserSnapshot();
      if (!snap.ok) {
        return "Dashboard shows your plan, usage, and remaining credits. Sign in to see your personal data.";
      }
      return `Your dashboard is ready. You are on ${snap.planName} and your remaining credits are ${snap.remaining}.`;
    }

    if (/(faq|question|questions)/i.test(q)) {
      return "FAQ is near the bottom. Type /go faq and I will move you there.";
    }

    if (/(terms|privacy|cookie|affiliate|legal)/i.test(q)) {
      return `${TEXT.legalHint}\n- Terms: ${SITE.legal.terms}\n- Privacy: ${SITE.legal.privacy}\n- Cookies: ${SITE.legal.cookies}\n- Affiliate: ${SITE.legal.affiliate}`;
    }

    if (/(hello|hi|hey)/i.test(q)) {
      return `${randomPick(["Welcome.", "Hi, ready to help.", "Hey, what can I do for you?"])} Ask me anything about this platform.`;
    }

    return TEXT.unknown;
  };

  const formatClock = (iso) => {
    const d = new Date(iso || Date.now());
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const downloadText = (filename, text) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  };

  const injectStyles = () => {
    if (byId("aiRobotStyles")) return;
    const style = document.createElement("style");
    style.id = "aiRobotStyles";
    style.textContent = `
      #aiRobotFloatBtn {
        position: fixed;
        left: 16px;
        bottom: 16px;
        z-index: 10050;
        border: 1px solid rgba(255,255,255,.34);
        border-radius: 999px;
        background: linear-gradient(110deg,#5b74ff,#21d4fd);
        color: #fff;
        font: 800 13px "Outfit","Plus Jakarta Sans",sans-serif;
        padding: 10px 14px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        box-shadow: 0 16px 34px rgba(0,0,0,.35);
      }
      #aiRobotFloatBtn .robot-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #39f5a6;
        box-shadow: 0 0 10px rgba(57,245,166,.9);
      }
      #aiRobotUnread {
        min-width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #ff4d7a;
        color: #fff;
        font: 800 10px "Outfit",sans-serif;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
      }
      #aiRobotPanel {
        position: fixed;
        left: 16px;
        bottom: 66px;
        width: min(360px, calc(100vw - 28px));
        height: min(520px, calc(100vh - 96px));
        z-index: 10051;
        border: 1px solid rgba(109,152,255,.42);
        border-radius: 16px;
        background: linear-gradient(180deg, rgba(8,14,36,.97), rgba(5,9,24,.98));
        box-shadow: 0 20px 40px rgba(0,0,0,.4);
        display: grid;
        grid-template-rows: auto 1fr auto auto;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transform: translateY(8px) scale(.99);
        transition: opacity .2s ease, transform .2s ease;
        color: #eaf1ff;
        font-family: "Outfit","Plus Jakarta Sans",sans-serif;
      }
      #aiRobotPanel.is-open {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0) scale(1);
      }
      #aiRobotPanel.is-min {
        height: 58px;
        grid-template-rows: auto;
      }
      #aiRobotPanel.is-min .ai-robot-hide-min { display: none !important; }
      .ai-robot-head {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 8px;
        padding: 10px 11px;
        border-bottom: 1px solid rgba(109,152,255,.25);
        background: rgba(11,18,45,.8);
      }
      .ai-robot-title { margin: 0; font-size: 13px; font-weight: 800; }
      .ai-robot-sub { margin: 2px 0 0; font-size: 11px; color: #9fb3dc; display: inline-flex; align-items: center; gap: 6px; }
      .ai-robot-sub .live { width: 7px; height: 7px; border-radius: 999px; background: #39f5a6; box-shadow: 0 0 8px rgba(57,245,166,.9); }
      .ai-robot-head-actions { display: inline-flex; gap: 6px; }
      .ai-robot-head-btn {
        border: 1px solid rgba(122,160,255,.35);
        background: rgba(14,24,56,.75);
        color: #dce8ff;
        border-radius: 8px;
        padding: 5px 8px;
        font: 700 11px "Outfit",sans-serif;
        cursor: pointer;
      }
      #aiRobotMessages {
        overflow: auto;
        padding: 10px;
        display: grid;
        gap: 8px;
        background: radial-gradient(circle at 20% -20%, rgba(56,96,255,.18), transparent 40%), rgba(4,9,24,.88);
      }
      .ai-msg {
        max-width: 92%;
        border: 1px solid rgba(125,161,255,.24);
        border-radius: 11px;
        padding: 8px 10px;
        line-height: 1.45;
        font-size: 12px;
        white-space: pre-wrap;
      }
      .ai-msg.user { margin-left: auto; background: rgba(79,124,255,.22); }
      .ai-msg.bot { margin-right: auto; background: rgba(16,27,60,.95); }
      .ai-msg-meta {
        margin-top: 4px;
        font-size: 10px;
        color: #9cb1db;
        opacity: .9;
      }
      #aiRobotTyping {
        display: none;
        align-items: center;
        gap: 6px;
        margin: 0 10px 8px;
        font-size: 11px;
        color: #9bb2de;
      }
      #aiRobotTyping .dots { display: inline-flex; gap: 3px; }
      #aiRobotTyping .dots span {
        width: 5px;
        height: 5px;
        border-radius: 999px;
        background: #8cb2ff;
        opacity: .4;
        animation: aiRobotDot 1s infinite ease-in-out;
      }
      #aiRobotTyping .dots span:nth-child(2) { animation-delay: .15s; }
      #aiRobotTyping .dots span:nth-child(3) { animation-delay: .3s; }
      @keyframes aiRobotDot { 0%, 100% { opacity: .3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }
      #aiRobotQuick {
        padding: 8px 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        border-top: 1px solid rgba(109,152,255,.2);
        background: rgba(8,15,37,.9);
      }
      .ai-chip {
        border: 1px solid rgba(122,160,255,.33);
        background: rgba(13,24,57,.9);
        color: #d9e6ff;
        border-radius: 999px;
        padding: 5px 9px;
        font: 700 11px "Outfit",sans-serif;
        cursor: pointer;
      }
      .ai-input-wrap {
        padding: 10px;
        border-top: 1px solid rgba(109,152,255,.22);
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 7px;
        background: rgba(8,15,37,.92);
      }
      #aiRobotInput {
        border: 1px solid rgba(122,160,255,.35);
        background: rgba(9,17,44,.9);
        color: #edf3ff;
        border-radius: 10px;
        padding: 9px 10px;
        font: 500 12px "Outfit",sans-serif;
      }
      #aiRobotSend {
        border: 1px solid rgba(129,167,255,.45);
        border-radius: 10px;
        padding: 9px 12px;
        background: linear-gradient(110deg,#5b74ff,#21d4fd);
        color: #fff;
        font: 800 12px "Outfit",sans-serif;
        cursor: pointer;
      }
      @media (max-width: 640px) {
        #aiRobotFloatBtn { left: 12px; bottom: 12px; }
        #aiRobotPanel {
          left: 12px;
          right: 12px;
          width: auto;
          bottom: 60px;
          height: min(500px, calc(100vh - 84px));
        }
      }
    `;
    document.head.appendChild(style);
  };

  const mount = () => {
    if (byId("aiRobotFloatBtn")) return;

    injectStyles();

    const state = readState();
    const history = readHistory();

    const btn = document.createElement("button");
    btn.id = "aiRobotFloatBtn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Open AI chatbot");
    btn.innerHTML = `<span class="robot-dot" aria-hidden="true"></span><span id="aiRobotOpenLabel">${TEXT.openLabel}</span><span id="aiRobotUnread">0</span>`;

    const panel = document.createElement("section");
    panel.id = "aiRobotPanel";
    panel.setAttribute("aria-label", "AI robot chat panel");
    panel.innerHTML = `
      <header class="ai-robot-head">
        <div>
          <p class="ai-robot-title" id="aiRobotTitle">${TEXT.botName}</p>
          <p class="ai-robot-sub"><span class="live"></span><span id="aiRobotSub">${TEXT.botSub}</span></p>
        </div>
        <div class="ai-robot-head-actions">
          <button class="ai-robot-head-btn" id="aiRobotCloseBtn" type="button">${TEXT.close}</button>
        </div>
      </header>
      <div id="aiRobotMessages" class="ai-robot-hide-min"></div>
      <div id="aiRobotTyping" class="ai-robot-hide-min"><span id="aiRobotTypingLabel">${TEXT.typing}</span><span class="dots"><span></span><span></span><span></span></span></div>
      <div id="aiRobotQuick" class="ai-robot-hide-min"></div>
      <div class="ai-input-wrap ai-robot-hide-min">
        <input id="aiRobotInput" type="text" autocomplete="off" placeholder="${TEXT.placeholder}" />
        <button id="aiRobotSend" type="button">${TEXT.send}</button>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const el = {
      panel,
      btn,
      unread: byId("aiRobotUnread"),
      closeBtn: byId("aiRobotCloseBtn"),
      msg: byId("aiRobotMessages"),
      typingWrap: byId("aiRobotTyping"),
      quick: byId("aiRobotQuick"),
      input: byId("aiRobotInput"),
      send: byId("aiRobotSend")
    };

    if (!el.msg || !el.input || !el.send || !el.quick) return;

    const cleanedHistory = (Array.isArray(history) ? history : []).filter((item) => {
      const txt = String(item?.text || "").trim();
      return txt !== TEXT.restored;
    });

    const session = {
      open: Boolean(state.open),
      minimized: false,
      unread: Number(state.unread || 0),
      history: cleanedHistory,
      typingTimer: null
    };

    const render = () => {
      el.msg.innerHTML = session.history
        .map((item) => {
          const role = item.role === "user" ? "user" : "bot";
          return `<article class="ai-msg ${role}">${escapeHtml(item.text)}<div class="ai-msg-meta">${escapeHtml(formatClock(item.at))}</div></article>`;
        })
        .join("");
      el.msg.scrollTop = el.msg.scrollHeight;
    };

    const persist = () => {
      writeHistory(session.history);
      writeState({ open: session.open, minimized: false, unread: session.unread });
    };

    const refreshUnread = () => {
      const n = Math.max(0, session.unread);
      if (n === 0) {
        el.unread.style.display = "none";
        return;
      }
      el.unread.style.display = "inline-flex";
      el.unread.textContent = String(n > 99 ? "99+" : n);
    };

    const addMessage = (role, text) => {
      const content = String(text || "").trim();
      if (!content) return;
      session.history.push({ role, text: content, at: nowIso() });
      session.history = session.history.slice(-80);
      if (!session.open && role === "bot") {
        session.unread += 1;
      }
      render();
      refreshUnread();
      persist();
    };

    const setTyping = (show) => {
      el.typingWrap.style.display = show ? "inline-flex" : "none";
    };

    const openPanel = () => {
      session.open = true;
      session.unread = 0;
      el.panel.classList.add("is-open");
      refreshUnread();
      persist();
      setTimeout(() => el.input.focus(), 120);
    };

    const closePanel = () => {
      session.open = false;
      el.panel.classList.remove("is-open");
      persist();
    };

    const handleReply = (question) => {
      const result = buildReply(question);
      if (typeof result === "object" && result.special === "clear") {
        session.history = [];
        addMessage("bot", TEXT.chatCleared);
        return;
      }

      setTyping(true);
      clearTimeout(session.typingTimer);
      session.typingTimer = setTimeout(() => {
        setTyping(false);
        addMessage("bot", result);
      }, 360 + Math.floor(Math.random() * 220));
    };

    const submit = () => {
      const value = String(el.input.value || "").trim();
      if (!value) return;
      addMessage("user", value);
      el.input.value = "";
      handleReply(value);
    };

    const chips = [
      { label: "My stats", ask: "/stats" },
      { label: "Plans", ask: "/pricing" },
      { label: "Tools", ask: "/tools" },
      { label: "Go pricing", ask: "/go pricing" },
      { label: "Go FAQ", ask: "/go faq" },
      { label: "Help", ask: "/help" }
    ];

    el.quick.innerHTML = chips
      .map((item) => `<button class="ai-chip" type="button" data-ask="${escapeHtml(item.ask)}">${escapeHtml(item.label)}</button>`)
      .join("");

    el.quick.querySelectorAll("button[data-ask]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-ask") || "";
        addMessage("user", q);
        handleReply(q);
      });
    });

    el.btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (session.open) closePanel();
      else openPanel();
    });

    el.closeBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      closePanel();
    });

    el.send.addEventListener("click", submit);

    el.input.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      submit();
    });

    el.panel.addEventListener("click", (ev) => ev.stopPropagation());

    document.addEventListener("click", (ev) => {
      if (!session.open) return;
      const target = ev.target;
      if (!(target instanceof Node)) return;
      if (el.panel.contains(target) || el.btn.contains(target)) return;
      closePanel();
    });

    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && session.open) closePanel();
    });

    document.querySelectorAll("[data-manychat-link]").forEach((anchor) => {
      if (!(anchor instanceof HTMLAnchorElement)) return;
      anchor.href = "#";
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
      anchor.addEventListener("click", (ev) => {
        ev.preventDefault();
        openPanel();
      });
    });

    render();
    refreshUnread();

    if (!session.history.length) {
      addMessage("bot", TEXT.intro);
      addMessage("bot", TEXT.guestIntro);
      addMessage("bot", `${TEXT.commandsTitle} ${TEXT.commands.join("  ")}`);
    }

    if (session.open) openPanel();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
