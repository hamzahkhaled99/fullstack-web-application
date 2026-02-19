(() => {
  const PLAN_CONFIG = {
    Free: { key: "free", monthlyWords: 5000, label: "Free", tier: "Starter" },
    Sapphire: { key: "sapphire", monthlyWords: 50000, label: "Sapphire", tier: "Growth" },
    Emerald: { key: "emerald", monthlyWords: 150000, label: "Emerald", tier: "Pro" },
    Ruby: { key: "ruby", monthlyWords: Infinity, label: "Ruby", tier: "Highest" }
  };

  const TOOL_KEYS = [
    "humanizer",
    "chat",
    "essay",
    "note",
    "report",
    "editor",
    "citation",
    "plagiarism",
    "methodology",
    "paraphrase",
    "thesis",
    "outline",
    "file",
    "heatmap",
    "readiness"
  ];
  const memory = {
    session: null,
    user: null,
    settings: null,
    usage: null
  };

  const toWords = (text) => {
    const t = String(text || "").trim();
    return t ? t.split(/\s+/).length : 0;
  };
  const normalizeRemaining = (v) => (v === "unlimited" ? Infinity : Number(v));
  const normalizePlan = (plan) => {
    const p = plan && typeof plan === "object" ? plan : PLAN_CONFIG.Free;
    return {
      ...p,
      monthlyWords: p.monthlyWords === "unlimited" ? Infinity : p.monthlyWords
    };
  };

  const api = (method, url, body) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, false);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(body ? JSON.stringify(body) : null);
      const raw = xhr.responseText || "{}";
      const data = JSON.parse(raw);
      if (xhr.status >= 200 && xhr.status < 300) return { ok: true, data };
      return { ok: false, data };
    } catch (_) {
      return { ok: false, data: { ok: false, error: "network_error" } };
    }
  };

  const getPlan = (name) => PLAN_CONFIG[name] || PLAN_CONFIG.Free;

  const refreshSession = () => {
    const r = api("GET", "/api/auth/session");
    if (!r.ok || !r.data?.authenticated) {
      memory.session = null;
      memory.user = null;
      return null;
    }
    memory.session = r.data.session || null;
    memory.user = r.data.user || null;
    return memory.session;
  };

  const getSession = () => memory.session || refreshSession();
  const getCurrentUser = () => memory.user || (refreshSession() && memory.user);

  const getUsageStats = (user) => {
    const active = user || getCurrentUser();
    if (!active) {
      return {
        cycleStart: new Date().toISOString(),
        wordsUsed: 0,
        calls: TOOL_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
        remaining: 0,
        plan: PLAN_CONFIG.Free
      };
    }
    const r = api("GET", "/api/usage");
    if (!r.ok || !r.data?.ok) {
      return {
        cycleStart: new Date().toISOString(),
        wordsUsed: 0,
        calls: TOOL_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
        remaining: 0,
        plan: getPlan(active.plan)
      };
    }
    memory.usage = r.data;
    return {
      cycleStart: r.data.cycleStart,
      wordsUsed: Number(r.data.wordsUsed || 0),
      calls: r.data.calls || TOOL_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      remaining: normalizeRemaining(r.data.remaining),
      plan: normalizePlan(r.data.plan || getPlan(active.plan))
    };
  };

  const getRemainingWords = (user) => {
    const stats = getUsageStats(user);
    return stats.remaining;
  };

  const canConsumeWords = (user, wordsNeeded) => {
    const remaining = getRemainingWords(user);
    const needed = Math.max(0, Number(wordsNeeded) || 0);
    if (remaining === Infinity) return { ok: true, remaining };
    if (needed <= remaining) return { ok: true, remaining };
    return { ok: false, remaining };
  };

  const consumeWords = ({ user, tool, inputText, outputText = "", meta = {} }) => {
    const active = user || getCurrentUser();
    if (!active) return { ok: false, code: "unauthorized", message: "Please sign in first." };
    const r = api("POST", "/api/usage/consume", {
      tool,
      inputText: String(inputText || ""),
      outputText: String(outputText || ""),
      meta
    });
    if (!r.ok || !r.data?.ok) {
      return {
        ok: false,
        code: r.data?.code || "consume_failed",
        words: Number(r.data?.words || 0),
        remaining: normalizeRemaining(r.data?.remaining),
        message: r.data?.message || "Could not process usage request."
      };
    }
    memory.usage = null;
    return {
      ok: true,
      words: Number(r.data.words || 0),
      remaining: normalizeRemaining(r.data.remaining)
    };
  };

  const getToolHistory = ({ user, tool }) => {
    const active = user || getCurrentUser();
    if (!active) return [];
    const safeTool = TOOL_KEYS.includes(tool) ? tool : "humanizer";
    const r = api("GET", `/api/history/${encodeURIComponent(safeTool)}`);
    if (!r.ok || !r.data?.ok) return [];
    return Array.isArray(r.data.items) ? r.data.items : [];
  };

  const getUserSettings = (userId) => {
    const active = getCurrentUser();
    if (!active || (userId && active.id !== userId)) {
      return { language: "en", storeHistoryConsent: true, onboardingDone: false };
    }
    const r = api("GET", "/api/settings");
    if (!r.ok || !r.data?.ok) {
      return { language: "en", storeHistoryConsent: true, onboardingDone: false };
    }
    memory.settings = r.data.settings;
    return memory.settings;
  };

  const updateUserSettings = (userId, patch) => {
    const active = getCurrentUser();
    if (!active || (userId && active.id !== userId)) {
      return { language: "en", storeHistoryConsent: true, onboardingDone: false };
    }
    const r = api("POST", "/api/settings", { patch: patch || {} });
    if (!r.ok || !r.data?.ok) {
      return getUserSettings(active.id);
    }
    memory.settings = r.data.settings;
    return memory.settings;
  };

  const signIn = (email, password) => {
    const r = api("POST", "/api/auth/signin", { email, password });
    if (!r.ok || !r.data?.ok) return { ok: false, error: r.data?.error || "invalid_credentials" };
    memory.session = r.data.session || null;
    memory.user = r.data.user || null;
    return { ok: true, user: memory.user, session: memory.session };
  };

  const signUp = ({ name, email, password, source, plan }) => {
    const r = api("POST", "/api/auth/signup", { name, email, password, source, plan });
    if (!r.ok || !r.data?.ok) return { ok: false, error: r.data?.error || "signup_failed" };
    memory.session = r.data.session || null;
    memory.user = r.data.user || null;
    return { ok: true, user: memory.user, session: memory.session };
  };

  const requestPasswordReset = (email) => {
    const r = api("POST", "/api/auth/forgot-password/request", { email });
    if (!r.ok || !r.data?.ok) return { ok: false, error: r.data?.error || "reset_request_failed" };
    return { ok: true };
  };

  const resetPassword = (email, code, newPassword) => {
    const r = api("POST", "/api/auth/forgot-password/verify", { email, code, newPassword });
    if (!r.ok || !r.data?.ok) return { ok: false, error: r.data?.error || "reset_failed" };
    return { ok: true };
  };

  const clearSession = () => {
    api("POST", "/api/auth/logout", {});
    memory.session = null;
    memory.user = null;
  };

  const createUser = (payload) => signUp(payload);
  const createSession = (_user) => ({ ok: true, session: getSession() });

  const findUserByEmail = (email) => {
    const r = api("GET", `/api/users/by-email?email=${encodeURIComponent(String(email || ""))}`);
    if (!r.ok || !r.data?.ok) return null;
    return r.data.user || null;
  };

  const upgradeUserPlan = (userId, planName) => {
    const active = getCurrentUser();
    if (!active || (userId && active.id !== userId)) return false;
    const r = api("POST", "/api/user/upgrade", { planName });
    if (!r.ok || !r.data?.ok) return false;
    memory.user = r.data.user || memory.user;
    return true;
  };

  const exportAccountData = () => {
    const r = api("GET", "/api/account/export");
    if (!r.ok || !r.data?.ok) {
      return { ok: false, error: r.data?.error || "export_failed" };
    }
    return { ok: true, data: r.data };
  };

  const deleteAccount = ({ password, confirm }) => {
    const r = api("POST", "/api/account/delete", {
      password: String(password || ""),
      confirm: String(confirm || "")
    });
    if (!r.ok || !r.data?.ok) {
      return { ok: false, error: r.data?.error || "delete_failed" };
    }
    memory.session = null;
    memory.user = null;
    memory.settings = null;
    memory.usage = null;
    return { ok: true };
  };

  const getUsage = (_userId) => getUsageStats(getCurrentUser());
  const pushHistory = () => {};

  refreshSession();

  window.BSHCore = {
    PLAN_CONFIG,
    TOOL_KEYS,
    findUserByEmail,
    createUser,
    createSession,
    signIn,
    signUp,
    requestPasswordReset,
    resetPassword,
    getSession,
    clearSession,
    getCurrentUser,
    upgradeUserPlan,
    getPlan,
    getUsage,
    getUsageStats,
    getRemainingWords,
    canConsumeWords,
    consumeWords,
    pushHistory,
    getToolHistory,
    getUserSettings,
    updateUserSettings,
    exportAccountData,
    deleteAccount,
    toWords
  };
})();
