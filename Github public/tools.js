(() => {
  const core = window.BSHCore;
  if (!core) return;

  const user = core.getCurrentUser();
  if (!user) {
    window.location.href = "auth.html?mode=signin";
    return;
  }

  const byId = (id) => document.getElementById(id);
  const words = core.toWords;
  const sessionInfo = byId("sessionInfo");
  const logoutBtn = byId("logoutBtn");
  const getLang = () => (localStorage.getItem("bsh_lang") === "ar" ? "ar" : "en");
  const t = (en, ar) => (getLang() === "ar" ? ar : en);

  const AGENTS = {
    fusion: ["Research Fusion Agent", "Builds a full human-like research using all writing, quality, and review tools."],
    humanizer: ["Humanizer Agent", "Rewrites AI-like text into natural academic writing."],
    chat: ["Research Copilot Agent", "Provides structured, non-repetitive research support."],
    essay: ["Essay Architect Agent", "Builds coherent essay drafts with clear sections."],
    note: ["Notes Agent", "Converts long content into concise study notes."],
    report: ["Authenticity Agent", "Analyzes AI-like writing signals and risk patterns."],
    editor: ["Editor Agent", "Improves grammar, clarity, and coherence without changing meaning."],
    citation: ["Citation Agent", "Formats citations and references in APA/MLA/Harvard style."],
    plagiarism: ["Plagiarism Risk Agent", "Estimates overlap risk and highlights risky phrasing patterns."],
    methodology: ["Methodology Agent", "Builds research method structure with practical steps."],
    paraphrase: ["Paraphrase Agent", "Rewrites text by academic level while preserving meaning."],
    thesis: ["Thesis Agent", "Generates strong thesis statement options for your topic."],
    outline: ["Outline Draft Agent", "Converts outlines into coherent draft sections."],
    file: ["Document Analyzer Agent", "Summarizes document content into key points and actions."],
    heatmap: ["Style Heatmap Agent", "Detects grammar, clarity, and flow issues by priority."],
    readiness: ["Submission Readiness Agent", "Scores draft readiness and recommends final fixes."]
  };
  let toolConfigMap = {};
  const normalizeTool = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();
  const labelForQuestion = (q) =>
    getLang() === "ar"
      ? String(q?.label_ar || q?.label_en || q?.id || "").trim()
      : String(q?.label_en || q?.label_ar || q?.id || "").trim();
  const fetchToolConfigs = async () => {
    try {
      const resp = await fetch("/api/tools/config", {
        method: "GET",
        credentials: "same-origin"
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok || !Array.isArray(data.tools)) return {};
      const next = {};
      data.tools.forEach((cfg) => {
        const key = normalizeTool(cfg?.tool_name);
        if (!key) return;
        next[key] = cfg;
      });
      return next;
    } catch (_) {
      return {};
    }
  };

  const esc = (s) => String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const flash = (btn, text) => {
    if (!btn) return;
    const old = btn.textContent;
    btn.textContent = text;
    setTimeout(() => (btn.textContent = old), 900);
  };

  const withBusy = (btn, busyText) => {
    if (!btn) return () => {};
    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = busyText;
    return () => {
      btn.disabled = false;
      btn.textContent = oldText;
    };
  };

  const requestAgent = async (tool, payload) => {
    const body = {
      tool_name: normalizeTool(tool),
      payload: payload && typeof payload === "object" ? payload : {}
    };
    try {
      const resp = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body)
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok) return { ok: false, error: data, missing: data?.missing || [] };
      return {
        ok: true,
        output:
          String(data.output || "") ||
          String(data?.structured_output?.main_result || ""),
        structured: data.structured_output || null,
        qualityChecks:
          data?.structured_output?.quality_checks ||
          data?.quality_checks ||
          null,
        limitations: Array.isArray(data?.structured_output?.limitations)
          ? data.structured_output.limitations
          : [],
        traceId: data.trace_id || "",
        words: Number(data.words || 0),
        remaining: data.remaining
      };
    } catch (_) {
      return {
        ok: false,
        error: {
          message: t("Service unavailable. Retry.", "الخدمة غير متاحة حاليًا. أعد المحاولة.")
        }
      };
    }
  };
  const describeAgentError = (ai) => {
    const base =
      ai?.error?.message ||
      ai?.error?.error ||
      t("Could not generate output right now. Please try again.", "تعذر إنشاء المخرجات الآن. حاول مرة أخرى.");
    const missing = Array.isArray(ai?.missing) ? ai.missing : [];
    if (!missing.length) return String(base);
    const labels = missing
      .map((m) => String(m?.label || m?.id || m || "").trim())
      .filter(Boolean);
    if (!labels.length) return String(base);
    return `${base}\n${t("Missing:", "مفقود:")} ${labels.join(", ")}`;
  };

  const copy = async (text) => {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  const download = (name, text) => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const normalizeHeading = (line) =>
    String(line || "")
      .replace(/^#{1,6}\s*/, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  const mapApaHeading = (line) => {
    const h = normalizeHeading(line)
      .replace(/[_*`]/g, "")
      .replace(/\s*\/\s*/g, "/")
      .replace(/\s*&\s*/g, "&");
    if (h === "title") return "Title";
    if (h === "abstract") return "Abstract";
    if (h === "introduction") return "Introduction";
    if (h === "literature review") return "Literature Review";
    if (h === "research methodology") return "Research Methodology";
    if (h === "expected outcomes/preliminary results") return "Expected Outcomes/Preliminary Results";
    if (h === "conclusion&references" || h === "conclusion and references" || h === "conclusion & references") {
      return "Conclusion & References";
    }
    return "";
  };
  const parseApaDocument = (text, titleHint = "") => {
    const sectionOrder = [
      "Abstract",
      "Introduction",
      "Literature Review",
      "Research Methodology",
      "Expected Outcomes/Preliminary Results",
      "Conclusion & References"
    ];
    const lines = String(text || "").replace(/\r/g, "").split("\n");
    const sections = sectionOrder.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
    let active = "";
    let title = String(titleHint || "").trim();
    let expectTitleLine = false;

    lines.forEach((rawLine) => {
      const line = String(rawLine || "").trim();
      if (!line) {
        if (active) sections[active].push("");
        return;
      }
      const mapped = mapApaHeading(line);
      if (mapped === "Title") {
        expectTitleLine = true;
        return;
      }
      if (expectTitleLine && !mapped) {
        if (!title) title = line.replace(/^#{1,6}\s*/, "").trim();
        expectTitleLine = false;
        return;
      }
      expectTitleLine = false;

      if (mapped && mapped !== "Title") {
        active = mapped;
        return;
      }

      if (!title && !mapped) {
        title = line.replace(/^#{1,6}\s*/, "").trim();
        return;
      }

      const target = active || "Introduction";
      sections[target].push(line.replace(/^#{1,6}\s*/, "").trim());
    });

    const toParagraphs = (arr) =>
      arr
        .join("\n")
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\n+/g, " ").trim())
        .filter(Boolean);

    const orderedSections = sectionOrder.map((heading) => ({
      heading,
      paragraphs: toParagraphs(sections[heading])
    }));

    return {
      title: title || t("Research Paper", "ورقة بحثية"),
      sections: orderedSections
    };
  };
  const normalizeExportParagraph = (value) =>
    String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const downloadWord = (name, text, titleHint = "") => {
    if (!text) return;
    const parsed = parseApaDocument(text, titleHint);
    const bodyHtml = parsed.sections
      .map((section) => {
        const paragraphs = section.paragraphs.length
          ? section.paragraphs
          : [t("[Section content is not available in this export.]", "[محتوى هذا القسم غير متاح في ملف التصدير.]")];
        const paragraphHtml = paragraphs
          .map((p) => {
            const cleanParagraph = normalizeExportParagraph(p);
            return `<p class="apa-paragraph">${esc(cleanParagraph)}</p>`;
          })
          .join("");
        return `<section class="apa-section"><h2>${esc(section.heading)}</h2>${paragraphHtml}</section>`;
      })
      .join("");

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { size: 8.5in 11in; margin: 1in; }
      body { margin: 0; font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.85; color: #111; }
      .title-page { height: 9in; display: flex; align-items: center; justify-content: center; text-align: center; page-break-after: always; }
      .title-page h1 { font-size: 12pt; font-weight: 700; margin: 0; max-width: 6.2in; }
      .apa-section { margin: 0 0 18pt; }
      .apa-section h2 { margin: 0 0 12pt; text-align: center; font-size: 12pt; font-weight: 700; }
      .apa-paragraph { margin: 0 0 12pt; text-indent: 0; text-align: justify; }
    </style>
  </head>
  <body>
    <section class="title-page"><h1>${esc(parsed.title)}</h1></section>
    ${bodyHtml}
  </body>
</html>`;

    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const downloadPdf = (name, text, titleHint = "") => {
    if (!text) return;
    const jsPdfLib = window.jspdf && window.jspdf.jsPDF;
    if (!jsPdfLib) {
      downloadWord(name.replace(/\.pdf$/i, ".doc"), text, titleHint);
      return;
    }
    const parsed = parseApaDocument(text, titleHint);
    const doc = new jsPdfLib({ unit: "pt", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 72;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 22;
    let y = margin;

    const ensureSpace = (needed = lineHeight) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    const titleLines = doc.splitTextToSize(parsed.title, contentWidth);
    const titleBlockHeight = titleLines.length * lineHeight;
    y = Math.max(margin, (pageHeight - titleBlockHeight) / 2);
    titleLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += lineHeight;
    });

    doc.addPage();
    y = margin;

    parsed.sections.forEach((section) => {
      ensureSpace(lineHeight * 2);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text(section.heading, pageWidth / 2, y, { align: "center" });
      y += lineHeight;

      doc.setFont("times", "normal");
      const paragraphs = section.paragraphs.length
        ? section.paragraphs
        : [t("[Section content is not available in this export.]", "[محتوى هذا القسم غير متاح في ملف التصدير.]")];
      paragraphs.forEach((paragraph) => {
        const cleanParagraph = normalizeExportParagraph(paragraph);
        if (!cleanParagraph) return;
        const lines = doc.splitTextToSize(cleanParagraph, contentWidth);
        lines.forEach((line) => {
          ensureSpace(lineHeight);
          doc.text(line, margin, y);
          y += lineHeight;
        });
        y += 4;
      });
      y += 10;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i += 1) {
      doc.setPage(i);
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.text(String(i), pageWidth - margin, 40, { align: "right" });
    }
    doc.save(name);
  };
  const bindDocDownloads = ({ wordBtn, pdfBtn, baseName, getText, getTitle }) => {
    if (wordBtn) {
      wordBtn.addEventListener("click", () => {
        const text = String(typeof getText === "function" ? getText() : "");
        const title = typeof getTitle === "function" ? String(getTitle() || "") : "";
        downloadWord(`${baseName}.doc`, text, title);
      });
    }
    if (pdfBtn) {
      pdfBtn.addEventListener("click", () => {
        const text = String(typeof getText === "function" ? getText() : "");
        const title = typeof getTitle === "function" ? String(getTitle() || "") : "";
        downloadPdf(`${baseName}.pdf`, text, title);
      });
    }
  };

  const readability = (text) => {
    const w = words(text);
    if (!w) return "-";
    const s = Math.max(1, (String(text).match(/[.!?]+/g) || []).length);
    const sy = (String(text).match(/[aeiouy]+/gi) || []).length || w;
    const sc = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (w / s) - 84.6 * (sy / w))));
    if (sc >= 70) return `Easy (${sc})`;
    if (sc >= 50) return `Moderate (${sc})`;
    return `Advanced (${sc})`;
  };

  const diffHtml = (a, b) => {
    const x = String(a || "").split(/\s+/).filter(Boolean);
    const y = String(b || "").split(/\s+/).filter(Boolean);
    const out = [];
    const n = Math.max(x.length, y.length);
    for (let i = 0; i < n; i += 1) {
      const o = x[i] || "";
      const p = y[i] || "";
      if (o === p) out.push(`<span>${esc(o)}</span>`);
      else {
        if (o) out.push(`<span class=\"diff-old\">${esc(o)}</span>`);
        if (p) out.push(`<span class=\"diff-new\">${esc(p)}</span>`);
      }
    }
    return out.join(" ");
  };

  const remainingLabel = () => {
    const r = core.getRemainingWords(user);
    return r === Infinity ? t("Unlimited", "غير محدود") : r.toLocaleString();
  };

  const refreshSession = () => {
    if (!sessionInfo) return;
    const planLabel = String(user.plan || "Free");
    sessionInfo.textContent = `${planLabel} • ${remainingLabel()}`;
    const sessionBar = sessionInfo.closest(".session-bar");
    if (sessionBar) {
      sessionBar.classList.toggle("session-bar-premium", planLabel.toLowerCase() === "ruby");
    }
  };

  const historyFor = (tool) => core.getToolHistory({ user, tool });

  const renderHistory = (container, items, onRestore, empty = t("No saved versions yet.", "لا توجد نسخ محفوظة بعد.")) => {
    if (!container) return;
    if (!items.length) {
      container.textContent = empty;
      return;
    }
    container.innerHTML = items
      .map((it, i) => `<div class=\"history-item\"><p>${esc(new Date(it.createdAt).toLocaleString())}</p><button type=\"button\" data-i=\"${i}\">Restore</button></div>`)
      .join("");
    container.querySelectorAll("button[data-i]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const it = items[Number(btn.dataset.i)];
        if (it) onRestore(it);
      });
    });
  };

  const mountAgents = () => {
    document.querySelectorAll(".tool-panel").forEach((panel) => {
      if (panel.querySelector(".agent-card")) return;
      const key = (panel.id || "").replace("tool-", "");
      if (key === "fusion") return;
      const data = AGENTS[key];
      if (!data) return;
      const h2 = panel.querySelector("h2");
      if (!h2) return;
      const box = document.createElement("div");
      box.className = "agent-card";
      box.innerHTML = `
        <div class="agent-top">
          <span class="agent-pill">AI Agent</span>
          <span class="agent-state">Live</span>
        </div>
        <div class="agent-tags">
          <span>Real-Time Response</span>
          <span>Academic Safe</span>
          <span>Context Aware</span>
        </div>
        <p class="agent-title">${esc(data[0])}</p>
        <p class="agent-goal">${esc(data[1])}</p>
      `;
      h2.insertAdjacentElement("afterend", box);
    });
  };

  const mountToolWizards = () => {
    document.querySelectorAll(".tool-panel").forEach((panel) => {
      const key = normalizeTool((panel.id || "").replace("tool-", ""));
      const cfg = toolConfigMap[key];
      const old = panel.querySelector(".tool-wizard-card");
      if (old) old.remove();
      if (!cfg) return;
      const h2 = panel.querySelector("h2");
      if (!h2) return;

      const required = (cfg.questions || []).filter((q) => q && q.required).slice(0, 6);
      const optional = (cfg.questions || []).filter((q) => q && !q.required);

      const requiredHtml = required.length
        ? required
            .map((q) => `<li>${esc(labelForQuestion(q))}</li>`)
            .join("")
        : `<li>${esc(t("No required fields", "لا يوجد حقول إلزامية"))}</li>`;
      const optionalText = optional.length
        ? optional.slice(0, 3).map((q) => labelForQuestion(q)).join(" • ")
        : t("No optional fields", "لا يوجد حقول اختيارية");

      const box = document.createElement("details");
      box.className = "tool-wizard-card";
      box.innerHTML = `
        <summary>
          <span>${esc(t("Guided wizard", "معالج موجه"))}</span>
          <strong>${esc(required.length)} ${esc(t("required", "إلزامي"))}</strong>
        </summary>
        <p class="wizard-summary">${esc(cfg.description || "")}</p>
        <p class="wizard-entry">${esc(t("Entry paths", "مسارات البدء"))}: ${esc((cfg.entry_paths || []).join(" • "))}</p>
        <p class="wizard-label">${esc(t("Required questions", "الأسئلة الإلزامية"))}</p>
        <ul>${requiredHtml}</ul>
        <p class="wizard-optional">${esc(t("Advanced options", "خيارات متقدمة"))}: ${esc(optionalText)}</p>
      `;
      h2.insertAdjacentElement("afterend", box);
    });
  };

  refreshSession();
  mountAgents();
  fetchToolConfigs().then((cfgMap) => {
    toolConfigMap = cfgMap || {};
    mountToolWizards();
  });
  document.addEventListener("bsh:languageChanged", () => mountToolWizards());

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      core.clearSession();
      window.location.href = "auth.html?mode=signin";
    });
  }

  const tabs = document.querySelectorAll("#toolTabs button[data-tool]");
  const panels = document.querySelectorAll(".tool-panel");
  const setTool = (tool) => {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tool === tool));
    panels.forEach((p) => p.classList.toggle("active", p.id === `tool-${tool}`));
  };
  tabs.forEach((t) => t.addEventListener("click", () => setTool(t.dataset.tool || "humanizer")));
  setTool(new URLSearchParams(window.location.search).get("tool") || "humanizer");

  // Research Fusion
  (() => {
    const titleInput = byId("fusionTitle");
    const problemInput = byId("fusionProblem");
    const objectiveInput = byId("fusionObjective");
    const rqInput = byId("fusionRQ");
    const contextInput = byId("fusionContext");
    const methodPrefInput = byId("fusionMethodPreference");
    const constraintsInput = byId("fusionConstraints");
    const domain = byId("fusionDomain");
    const tone = byId("fusionTone");
    const style = byId("fusionCitationStyle");
    const accuracy = byId("fusionAccuracy");
    const runBtn = byId("fusionGenerateBtn");
    const clearBtn = byId("fusionClearBtn");
    const copyBtn = byId("fusionCopyBtn");
    const dlWordBtn = byId("fusionDownloadWordBtn");
    const dlPdfBtn = byId("fusionDownloadPdfBtn");
    const status = byId("fusionStatus");
    const output = byId("fusionOutput");
    const review = byId("fusionReviewOutput");
    const wc = byId("fusionWordCount");
    const health = byId("fusionPipelineHealth");
    const phase = byId("fusionPipelinePhase");
    const vision = byId("fusionVisionMode");
    const progressBar = byId("fusionProgressBar");
    const progressText = byId("fusionProgressText");
    const stageGrid = byId("fusionStageGrid");
    const fusionPanel = byId("tool-fusion");
    const fusionTabBtn = document.querySelector('#toolTabs button[data-tool="fusion"]');
    const entryPathWrap = byId("fusionEntryPaths");

    if (!titleInput || !runBtn || !status || !output || !review) return;
    let fusionEntryPath = "idea";
    if (entryPathWrap) {
      const entryButtons = entryPathWrap.querySelectorAll("button[data-path]");
      entryButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          fusionEntryPath = String(btn.dataset.path || "idea");
          entryButtons.forEach((b) => b.classList.toggle("active", b === btn));
        });
      });
    }

    const setStatus = (lines) => {
      const text = Array.isArray(lines) ? lines.join("\n") : String(lines || "");
      if (typeof status.value === "string") status.value = text;
      else status.textContent = text;
      status.scrollTop = status.scrollHeight;
    };
    const updateWords = () => {
      if (wc) wc.textContent = String(words(output.value));
    };
    const readVal = (el) => String(el?.value || "").trim();
    const METHOD_PREF_LABEL = {
      auto: "Auto by AI",
      quantitative: "Quantitative",
      qualitative: "Qualitative",
      mixed: "Mixed methods",
      experimental: "Experimental",
      "case-study": "Case study",
      "systematic-review": "Systematic review"
    };
    const collectIntake = () => ({
      problem: readVal(problemInput),
      objective: readVal(objectiveInput),
      rq: readVal(rqInput),
      context: readVal(contextInput),
      method: readVal(methodPrefInput) || "auto",
      constraints: readVal(constraintsInput)
    });
    const getMissingIntake = (intake) => {
      const missing = [];
      if (!intake.problem) missing.push(t("Research problem or gap", "مشكلة البحث أو الفجوة"));
      if (!intake.objective) missing.push(t("Main objective", "الهدف الرئيسي"));
      if (!intake.rq) missing.push(t("Primary RQ or hypothesis", "سؤال البحث أو الفرضية"));
      return missing;
    };
    const buildIntakeContext = (intake) =>
      [
        "Client research intake:",
        `- Problem/gap: ${intake.problem || "Not provided"}`,
        `- Main objective: ${intake.objective || "Not provided"}`,
        `- Primary RQ/hypothesis: ${intake.rq || "Not provided"}`,
        `- Population/context: ${intake.context || "Not provided"}`,
        `- Method preference: ${METHOD_PREF_LABEL[intake.method] || "Auto by AI"}`,
        `- Constraints/notes: ${intake.constraints || "None specified"}`
      ].join("\n");
    const REQUIRED_SECTIONS = [
      "Title",
      "Abstract",
      "Introduction",
      "Literature Review",
      "Research Methodology",
      "Expected Outcomes/Preliminary Results",
      "Conclusion & References"
    ];
    const STEP_BLUEPRINT = [
      { key: "deep_validate", label: "Deep Reasoning - Validate RQ", required: true },
      { key: "deep_theory", label: "Deep Reasoning - Lock Theory", required: true },
      { key: "deep_method", label: "Deep Reasoning - Align Method", required: true },
      { key: "draft", label: "Generate Draft", required: true },
      { key: "qa_reject", label: "QA Ensemble - Reject Weak Sections", required: true },
      { key: "qa_regen", label: "QA Ensemble - Force Regeneration", required: true },
      { key: "gatekeeper", label: "Final Gatekeeper", required: true }
    ];
    const STEP_LABEL = {
      pending: "Waiting",
      running: "Running",
      retrying: "Retrying",
      done: "Completed",
      skipped: "Skipped",
      failed: "Failed"
    };
    const buildStepState = (highAccuracy) =>
      STEP_BLUEPRINT
        .filter((s) => (highAccuracy ? true : !s.highOnly))
        .map((s) => ({ ...s, status: "pending", detail: "Waiting for execution" }));
    let fusionSteps = buildStepState((accuracy?.value || "high") === "high");
    const clip = (text, max = 5000) => String(text || "").slice(0, Math.max(0, max));
    const syncStageTicker = () => {
      if (!stageGrid) return;
      const track = stageGrid.querySelector(".fusion-stage-track");
      if (!track) return;
      if (stageGrid.clientWidth < 40) {
        stageGrid.classList.remove("is-moving");
        stageGrid.style.setProperty("--fusion-move-distance", "0px");
        return;
      }
      stageGrid.classList.remove("is-moving");
      stageGrid.style.setProperty("--fusion-move-distance", "0px");
      stageGrid.style.setProperty("--fusion-move-duration", "16s");
      const overflow = Math.ceil(track.scrollWidth - stageGrid.clientWidth);
      if (overflow > 26) {
        stageGrid.classList.add("is-moving");
        stageGrid.style.setProperty("--fusion-move-distance", `${overflow}px`);
        const duration = Math.max(14, Math.min(40, overflow / 22));
        stageGrid.style.setProperty("--fusion-move-duration", `${duration}s`);
      }
    };
    const renderStages = () => {
      if (!stageGrid) return;
      const stageCards = fusionSteps
        .map(
          (s, i) => `
          <article class="fusion-stage fusion-stage-${esc(s.status)}">
            <span class="fusion-stage-index">${String(i + 1).padStart(2, "0")}</span>
            <div class="fusion-stage-meta">
              <strong>${esc(s.label)}</strong>
              <p>${esc(s.detail || STEP_LABEL[s.status] || "Waiting")}</p>
            </div>
          </article>
        `
        )
        .join("");
      stageGrid.innerHTML = `<div class="fusion-stage-track">${stageCards}</div>`;
      requestAnimationFrame(syncStageTicker);
    };
    const updatePipelineVisuals = () => {
      const total = fusionSteps.length;
      const completed = fusionSteps.filter((s) => s.status === "done" || s.status === "skipped").length;
      const runningStep = fusionSteps.find((s) => s.status === "running" || s.status === "retrying");
      const failedRequired = fusionSteps.some((s) => s.required && s.status === "failed");
      const hasSoftIssue = fusionSteps.some(
        (s) => s.status === "skipped" || (!s.required && s.status === "failed")
      );

      let healthState = "idle";
      let healthText = "Ready";
      if (failedRequired) {
        healthState = "failed";
        healthText = "Critical Failure";
      } else if (runningStep) {
        healthState = "running";
        healthText = "Executing";
      } else if (completed === total && total > 0) {
        healthState = hasSoftIssue ? "degraded" : "complete";
        healthText = hasSoftIssue ? "Completed with Warnings" : "Completed";
      } else if (completed > 0) {
        healthState = "running";
        healthText = "In Progress";
      }

      if (health) {
        health.className = `fusion-health fusion-health-${healthState}`;
        health.textContent = healthText;
      }
      if (phase) {
        if (runningStep) {
          phase.textContent = runningStep.label;
        } else if (completed === total && total > 0) {
          phase.textContent = "All orchestration stages completed";
        } else {
          phase.textContent = "Awaiting execution";
        }
      }

      const percent = total ? Math.round((completed / total) * 100) : 0;
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressBar) progressBar.classList.toggle("is-running", Boolean(runningStep));
      if (progressText) progressText.textContent = `${percent}% complete - ${completed}/${total} steps`;

      renderStages();
    };
    const setStepStatus = (key, nextStatus, detail) => {
      const step = fusionSteps.find((s) => s.key === key);
      if (!step) return;
      step.status = nextStatus;
      step.detail = detail || STEP_LABEL[nextStatus] || "Updated";
      updatePipelineVisuals();
    };
    const resetPipelineBoard = (highAccuracy) => {
      fusionSteps = buildStepState(highAccuracy);
      if (vision) {
        vision.textContent = highAccuracy ? "Deep Reasoning + QA Ensemble" : "Balanced Multi-Agent";
      }
      updatePipelineVisuals();
    };
    const enforceSectionsFallback = (text, title) => {
      const raw = String(text || "").trim();
      if (!raw) return "";
      const exists = (name) => {
        const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`(^|\\n)\\s*#{0,3}\\s*${safe}\\s*$`, "im").test(raw);
      };
      const out = [];
      out.push("Title");
      out.push(String(title || "Untitled Research"));
      out.push("");
      REQUIRED_SECTIONS.slice(1).forEach((section) => {
        out.push(section);
        out.push(exists(section) ? raw : "[Content generated but section heading normalization was required.]");
        out.push("");
      });
      return out.join("\n").trim();
    };

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const shouldRetry = (msg) =>
      /timeout|aborted|rate limit|quota|429|temporar|network/i.test(String(msg || ""));
    const runStep = async ({ lines, key, label, tool, payload, retries = 1 }) => {
      lines.push(`- ${label}: running...`);
      setStatus(lines);
      setStepStatus(key, "running", "Sending request to AI engine");
      let lastError = "";
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        const ai = await requestAgent(tool, {
          entry_path: fusionEntryPath,
          ...(payload || {})
        });
        if (ai.ok && ai.output) {
          lines[lines.length - 1] =
            attempt > 0 ? `- ${label}: done (retry ${attempt}/${retries})` : `- ${label}: done`;
          setStepStatus(
            key,
            "done",
            attempt > 0 ? `Completed after retry ${attempt}/${retries}` : "Completed successfully"
          );
          setStatus(lines);
          return { key, label, text: ai.output };
        }
        lastError = describeAgentError(ai);
        if (attempt < retries && shouldRetry(lastError)) {
          lines[lines.length - 1] = `- ${label}: retrying... (${attempt + 1}/${retries})`;
          setStepStatus(key, "retrying", `Retry ${attempt + 1}/${retries} after transient error`);
          setStatus(lines);
          await wait(800 * (attempt + 1));
          continue;
        }
        setStepStatus(key, "failed", lastError);
        throw new Error(`${label} failed: ${lastError}`);
      }
      setStepStatus(key, "failed", lastError || "Request failed.");
      throw new Error(`${label} failed: ${lastError || "Request failed."}`);
    };
    const runOptionalStep = async (params) => {
      try {
        return await runStep({ ...params, retries: 1 });
      } catch (err) {
        const msg = err?.message || "Optional step failed.";
        params.lines.push(`- ${params.label}: skipped (${msg})`);
        setStepStatus(params.key, "skipped", "Skipped due to non-blocking error");
        setStatus(params.lines);
        return { key: params.key, label: params.label, text: `[${params.label} unavailable: ${msg}]` };
      }
    };
    const hasSectionHeading = (text, section) => {
      const safe = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|\\n)\\s*#{0,3}\\s*${safe}\\s*$`, "im").test(String(text || ""));
    };
    const hasAllRequiredSections = (text) =>
      REQUIRED_SECTIONS.slice(1).every((section) => hasSectionHeading(text, section));
    const qaDecisionIsReject = (text) => /(?:QA_DECISION|VERDICT)\s*:\s*REJECT/i.test(String(text || ""));
    const gateDecisionIsFail = (text) => /GATEKEEPER\s*:\s*FAIL/i.test(String(text || ""));
    const requestOptionalAgent = async ({ tool, payload }) => {
      const ai = await requestAgent(tool, {
        entry_path: fusionEntryPath,
        ...(payload || {})
      });
      if (ai.ok && ai.output) return ai.output;
      throw new Error(describeAgentError(ai));
    };

    runBtn.addEventListener("click", async () => {
      const title = titleInput.value.trim();
      const highAccuracy = (accuracy?.value || "high") === "high";
      const intake = collectIntake();
      const missingIntake = getMissingIntake(intake);
      if (!title) {
        output.value = t("Please provide research title.", "يرجى إدخال عنوان البحث.");
        review.value = "";
        updateWords();
        return;
      }
      if (missingIntake.length) {
        const missingList = missingIntake.map((item) => `- ${item}`).join("\n");
        setStatus([
          t("Pipeline not started", "لم يبدأ مسار التنفيذ"),
          t("Research intake is incomplete.", "بيانات إدخال البحث غير مكتملة."),
          t("Please answer the required questions before running:", "يرجى الإجابة عن الأسئلة المطلوبة قبل التشغيل:")
        ]);
        output.value =
          `${t("Please answer these required research questions first:", "يرجى الإجابة عن أسئلة البحث المطلوبة أولًا:")}\n` +
          `${missingList}\n\n` +
          `${t("This improves logical flow and reduces manual editing.", "هذا يرفع منطقية النتيجة ويقلل التعديلات اليدوية.")}`;
        review.value = "";
        updateWords();
        return;
      }

      resetPipelineBoard(highAccuracy);
      const release = withBusy(runBtn, "Building...");
      const intakeAnswered = Object.values(intake).filter((v) => Boolean(v)).length;
      const lines = [
        t("Pipeline started", "بدأ مسار التنفيذ"),
        `${t("Title", "العنوان")}: ${title}`,
        `${t("Intake", "الإدخال")}: ${intakeAnswered}/6 ${t("answered", "مُجاب")}`,
        t("Mode: Deep Reasoning + QA Ensemble", "الوضع: استدلال عميق + مراجعة متعددة")
      ];
      setStatus(lines);
      output.value = "";
      review.value = "";

      try {
        const intakeContext = buildIntakeContext(intake);
        const baseContext =
          `Research title: ${title}\n` +
          `Domain: ${domain?.value || "general"}\n` +
          `Tone: ${tone?.value || "academic"}\n` +
          `Citation style: ${style?.value || "APA"}\n\n` +
          `${intakeContext}`;

        const deepValidate = await runStep({
          lines,
          key: "deep_validate",
          label: "Deep Reasoning - Validate RQ",
          tool: "chat",
          payload: {
            message:
              `Act as Deep Reasoning Agent.\n${baseContext}\n\n` +
              `Task: Validate the research question quality based on title and intake answers.\n` +
              `Return sections:\n` +
              `1) RQ validity check\n2) Scope & boundaries\n3) Variables/constructs\n4) Main risk assumptions\n` +
              `Keep it concise and academically rigorous.`
          },
          retries: 2
        });

        const deepTheory = await runStep({
          lines,
          key: "deep_theory",
          label: "Deep Reasoning - Lock Theory",
          tool: "chat",
          payload: {
            message:
              `Act as Deep Reasoning Agent.\n${baseContext}\n\n` +
              `Using this RQ validation context:\n${clip(deepValidate.text, 2200)}\n\n` +
              `Task: Lock the best-fit theory/framework.\n` +
              `Return sections:\n` +
              `1) Selected theory\n2) Why this theory fits\n3) Core constructs mapping\n4) Testable propositions`
          },
          retries: 2
        });

        const deepMethod = await runStep({
          lines,
          key: "deep_method",
          label: "Deep Reasoning - Align Method",
          tool: "methodology",
          payload: {
            text:
              `${baseContext}\n\nRQ validation:\n${clip(deepValidate.text, 1800)}\n\n` +
              `Theory lock:\n${clip(deepTheory.text, 1800)}\n\n` +
              `Method preference: ${METHOD_PREF_LABEL[intake.method] || "Auto by AI"}\n` +
              `Align a coherent methodology to this reasoning and to client constraints.`,
            options: { domain: domain?.value || "general" }
          },
          retries: 2
        });

        const draft = await runStep({
          lines,
          key: "draft",
          label: "Generate Draft",
          tool: "essay",
          payload: {
            text:
              `${baseContext}\n\nUse this deep reasoning package:\n` +
              `RQ validation:\n${clip(deepValidate.text, 1400)}\n\n` +
              `Theory lock:\n${clip(deepTheory.text, 1400)}\n\n` +
              `Method alignment:\n${clip(deepMethod.text, 1400)}\n\n` +
              `Client intake constraints:\n${clip(intakeContext, 1200)}\n\n` +
              `Write complete research paper sections using EXACTLY this order:\n` +
              `${REQUIRED_SECTIONS.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n` +
              `Requirements:\n` +
              `- Keep Abstract between 200-300 words.\n` +
              `- Keep formal academic style.\n` +
              `- Align claims with provided problem, objective, RQ, and context.\n` +
              `- Do not skip or rename section headings.\n`,
            options: {
              tone: tone?.value || "academic",
              template: "research-paper"
            }
          },
          retries: 2
        });

        let draftText = String(draft.text || "");
        const citationGuidance = await requestOptionalAgent({
          tool: "citation",
          payload: {
            text:
              `Prepare concise reference guidance in ${style?.value || "APA"} style.\n` +
              `Use placeholders when source metadata is missing.\n\nDraft:\n${clip(draftText, 6000)}`,
            options: { style: style?.value || "APA" }
          }
        });
        draftText = `${draftText}\n\nReferences guidance\n${citationGuidance}`;

        const structureLock = await requestOptionalAgent({
          tool: "editor",
          payload: {
            text:
              `Reformat this draft to preserve EXACT heading order:\n` +
              `${REQUIRED_SECTIONS.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n` +
              `Keep content natural and coherent.\n\nDraft:\n${clip(draftText, 6500)}`,
            options: { mode: "academic", strength: "medium" }
          }
        });
        draftText = structureLock;
        if (!hasAllRequiredSections(draftText)) {
          draftText = enforceSectionsFallback(draftText, title);
        }

        output.value = draftText;
        updateWords();

        const qaReject = await runStep({
          lines,
          key: "qa_reject",
          label: "QA Ensemble - Reject Weak Sections",
          tool: "chat",
          payload: {
            message:
              `You are QA Ensemble.\n` +
              `Evaluate this draft and decide whether weak sections should be rejected.\n` +
              `Return EXACT format:\n` +
              `QA_DECISION: PASS or REJECT\n` +
              `Weak sections: ...\n` +
              `Required fixes: ...\n` +
              `Priority order: ...\n\n` +
              `Draft:\n${clip(draftText, 6500)}`
          },
          retries: 2
        });

        let finalText = draftText;
        const forceRegen = highAccuracy || qaDecisionIsReject(qaReject.text);
        if (forceRegen) {
          const qaRegenerated = await runStep({
            lines,
            key: "qa_regen",
            label: "QA Ensemble - Force Regeneration",
            tool: "editor",
            payload: {
              text:
                `Revise this draft by enforcing QA fixes below.\n` +
                `Do not change the heading order.\n` +
                `Improve weak sections and keep academic coherence.\n\n` +
                `QA report:\n${clip(qaReject.text, 2200)}\n\n` +
                `Draft:\n${clip(draftText, 6500)}`,
              options: { mode: "academic", strength: highAccuracy ? "strong" : "medium" }
            },
            retries: 2
          });
          finalText = qaRegenerated.text;
          if (highAccuracy) {
            const postHumanized = await requestOptionalAgent({
              tool: "humanizer",
              payload: {
                text: clip(finalText, 6500),
                options: { mode: "academic", strength: "strong" }
              }
            });
            finalText = postHumanized;
          }
        } else {
          lines.push("- QA Ensemble - Force Regeneration: done (no weak sections)");
          setStepStatus("qa_regen", "done", "No weak sections detected");
          setStatus(lines);
        }

        if (!hasAllRequiredSections(finalText)) {
          finalText = enforceSectionsFallback(finalText, title);
        }
        output.value = finalText;
        updateWords();

        const gatekeeper = await runStep({
          lines,
          key: "gatekeeper",
          label: "Final Gatekeeper",
          tool: "chat",
          payload: {
            message:
              `You are Final Gatekeeper.\n` +
              `Check this final draft for academic readiness.\n` +
              `Return EXACT format:\n` +
              `GATEKEEPER: PASS or FAIL\n` +
              `Blocking issues: ...\n` +
              `Final verdict note: ...\n\n` +
              `QA report:\n${clip(qaReject.text, 1800)}\n\nDraft:\n${clip(finalText, 6500)}`
          },
          retries: 2
        });

        if (gateDecisionIsFail(gatekeeper.text) && highAccuracy) {
          const emergencyFix = await requestOptionalAgent({
            tool: "editor",
            payload: {
              text:
                `Apply a strict final gatekeeper fix on this draft without changing the heading order.\n` +
                `Gatekeeper report:\n${clip(gatekeeper.text, 1800)}\n\n` +
                `Draft:\n${clip(finalText, 6500)}`,
              options: { mode: "academic", strength: "strong" }
            }
          });
          finalText = emergencyFix;
          if (!hasAllRequiredSections(finalText)) {
            finalText = enforceSectionsFallback(finalText, title);
          }
          output.value = finalText;
          updateWords();
        }

        const diagReadiness = await requestOptionalAgent({
          tool: "readiness",
          payload: { text: clip(finalText, 6500) }
        });
        const diagHeatmap = await requestOptionalAgent({
          tool: "heatmap",
          payload: { text: clip(finalText, 6500) }
        });
        const diagPlagiarism = await requestOptionalAgent({
          tool: "plagiarism",
          payload: { text: clip(finalText, 6500) }
        });
        const diagAuth = await requestOptionalAgent({
          tool: "report",
          payload: { text: clip(finalText, 6500) }
        });
        const diagNotes = await requestOptionalAgent({
          tool: "note",
          payload: { text: clip(finalText, 6500) }
        });

        lines.push("- Pipeline: completed");
        setStatus(lines);
        review.value = [
          "=== DEEP REASONING • VALIDATE RQ ===",
          deepValidate.text,
          "",
          "=== DEEP REASONING • LOCK THEORY ===",
          deepTheory.text,
          "",
          "=== DEEP REASONING • ALIGN METHOD ===",
          deepMethod.text,
          "",
          "=== QA ENSEMBLE • REJECT DECISION ===",
          qaReject.text,
          "",
          "=== FINAL GATEKEEPER ===",
          gatekeeper.text,
          "",
          "=== AUTHENTICITY REPORT ===",
          diagAuth,
          "",
          "=== PLAGIARISM CHECK ===",
          diagPlagiarism,
          "",
          "=== STYLE HEATMAP ===",
          diagHeatmap,
          "",
          "=== SUBMISSION READINESS ===",
          diagReadiness,
          "",
          "=== RESEARCH NOTES (Lecture Notes AI) ===",
          diagNotes
        ].join("\n");
        updateWords();
        refreshSession();
      } catch (err) {
        const reason = err?.message || "unknown error";
        lines.push(`- ${t("Pipeline", "المسار")}: ${t("stopped", "توقف")} (${reason})`);
        setStatus(lines);
        output.value =
          `${t("Service unavailable. Retry.", "الخدمة غير متاحة حاليًا. أعد المحاولة.")}\n` +
          `${t("Reason", "السبب")}: ${reason}\n\n` +
          `${t("Click Generate Full Research to retry.", "اضغط Generate Full Research لإعادة المحاولة.")}`;
        review.value = "";
        updateWords();
      } finally {
        release();
      }
    });

    if (accuracy) {
      accuracy.addEventListener("change", () => {
        if (runBtn.disabled) return;
        resetPipelineBoard((accuracy.value || "high") === "high");
      });
    }
    if (fusionTabBtn) {
      fusionTabBtn.addEventListener("click", () => {
        setTimeout(syncStageTicker, 60);
      });
    }
    if (fusionPanel && typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(() => {
        if (fusionPanel.classList.contains("active")) {
          setTimeout(syncStageTicker, 40);
        }
      });
      observer.observe(fusionPanel, { attributes: true, attributeFilter: ["class"] });
    }
    window.addEventListener("resize", () => {
      syncStageTicker();
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        titleInput.value = "";
        if (problemInput) problemInput.value = "";
        if (objectiveInput) objectiveInput.value = "";
        if (rqInput) rqInput.value = "";
        if (contextInput) contextInput.value = "";
        if (methodPrefInput) methodPrefInput.value = "auto";
        if (constraintsInput) constraintsInput.value = "";
        output.value = "";
        review.value = "";
        setStatus(t("No pipeline run yet.", "لا يوجد تشغيل للمسار حتى الآن."));
        resetPipelineBoard((accuracy?.value || "high") === "high");
        updateWords();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => flash(copyBtn, (await copy(output.value)) ? "Copied" : "Copy failed"));
    }

    bindDocDownloads({
      wordBtn: dlWordBtn,
      pdfBtn: dlPdfBtn,
      baseName: "research-fusion-output",
      getText: () => output.value,
      getTitle: () => titleInput.value.trim()
    });

    setStatus(t("No pipeline run yet.", "لا يوجد تشغيل للمسار حتى الآن."));
    resetPipelineBoard((accuracy?.value || "high") === "high");
    updateWords();
  })();

  // Humanizer
  (() => {
    const input = byId("humanizerInput");
    const output = byId("humanizerOutput");
    const runBtn = byId("humanizeBtn");
    const mode = byId("humanizerMode");
    const strength = byId("humanizerStrength");
    const tmpl = byId("humanizerTemplate");
    const tmplBtn = byId("humanizerTemplateBtn");
    const clearBtn = byId("humanizerClearBtn");
    const copyBtn = byId("humanizerCopyBtn");
    const dlWordBtn = byId("humanizerDownloadWordBtn");
    const dlPdfBtn = byId("humanizerDownloadPdfBtn");
    const inW = byId("humanizerInputWords");
    const inC = byId("humanizerInputChars");
    const outW = byId("humanizerOutputWords");
    const read = byId("humanizerReadability");
    const diff = byId("humanizerDiff");
    const historyBox = byId("humanizerHistory");

    if (!input || !output || !runBtn) return;

    const templates = {
      academic: "The rapid adoption of artificial intelligence has transformed decision quality, operational efficiency, and employee performance.",
      business: "I am following up on the proposal timeline and requesting confirmation for next milestones.",
      report: "This report summarizes key performance constraints and outlines practical improvement actions."
    };

    const update = () => {
      if (inW) inW.textContent = String(words(input.value));
      if (inC) inC.textContent = String((input.value || "").length);
      if (outW) outW.textContent = String(words(output.value));
      if (read) read.textContent = readability(output.value);
    };

    const refresh = () => {
      const list = historyFor("humanizer");
      renderHistory(historyBox, list, (it) => {
        input.value = it.input || "";
        output.value = it.output || "";
        if (diff) diff.innerHTML = diffHtml(input.value, output.value);
        update();
      });
    };

    input.addEventListener("input", update);

    runBtn.addEventListener("click", async () => {
      const src = input.value.trim();
      if (!src) return;
      const release = withBusy(runBtn, "Humanizing...");
      const ai = await requestAgent("humanizer", {
        text: src,
        options: { mode: mode?.value, strength: strength?.value }
      });
      if (!ai.ok || !ai.output) {
        output.value = describeAgentError(ai);
        update();
        release();
        return;
      }
      const out = ai.output;
      refreshSession();
      output.value = out;
      if (diff) diff.innerHTML = diffHtml(src, out);
      update();
      refresh();
      release();
    });

    if (tmplBtn && tmpl) tmplBtn.addEventListener("click", () => {
      const v = templates[tmpl.value];
      if (!v) return;
      input.value = v;
      update();
    });

    if (clearBtn) clearBtn.addEventListener("click", () => {
      input.value = "";
      output.value = "";
      if (diff) diff.textContent = "No comparison yet.";
      update();
    });
    if (copyBtn) copyBtn.addEventListener("click", async () => flash(copyBtn, (await copy(output.value)) ? "Copied" : "Copy failed"));
    bindDocDownloads({
      wordBtn: dlWordBtn,
      pdfBtn: dlPdfBtn,
      baseName: "humanized-output",
      getText: () => output.value
    });

    refresh();
    update();
  })();

  // Chat
  (() => {
    const box = byId("chatBox");
    const input = byId("chatInput");
    const sendBtn = byId("chatSendBtn");
    const tmpl = byId("chatTemplate");
    const tmplBtn = byId("chatTemplateBtn");
    const clearBtn = byId("chatClearBtn");
    const copyBtn = byId("chatCopyBtn");
    const dlWordBtn = byId("chatDownloadWordBtn");
    const dlPdfBtn = byId("chatDownloadPdfBtn");
    const historyBox = byId("chatHistory");
    const msgCount = byId("chatMsgCount");
    const wCount = byId("chatWordCount");

    if (!box || !input || !sendBtn) return;

    const templates = {
      method: "Help me design a rigorous research methodology for my topic.",
      literature: "Summarize key themes for my literature review.",
      plan: "Build a practical 7-day study plan."
    };

    let transcript = [{ who: "bot", text: "Research Copilot Agent is active. Ask your question." }];

    const render = () => {
      box.innerHTML = transcript.map((m) => `<div class=\"msg ${m.who}\">${esc(m.text).replace(/\n/g, "<br />")}</div>`).join("");
      box.scrollTop = box.scrollHeight;
      if (msgCount) msgCount.textContent = String(transcript.length);
      if (wCount) wCount.textContent = String(words(transcript.map((x) => x.text).join(" ")));
    };

    const refresh = () => {
      const list = historyFor("chat");
      renderHistory(historyBox, list, (it) => {
        transcript = it.meta?.messages || transcript;
        render();
      }, "No chat history yet.");
    };

    const asText = () => transcript.map((m) => `${m.who === "user" ? "User" : "Assistant"}: ${m.text}`).join("\n");

    const send = async () => {
      const txt = input.value.trim();
      if (!txt) return;
      const release = withBusy(sendBtn, "Sending...");
      const ai = await requestAgent("chat", {
        message: txt,
        context: transcript
      });
      if (!ai.ok || !ai.output) {
        transcript.push({ who: "bot", text: describeAgentError(ai) });
        render();
        release();
        return;
      }
      const r = ai.output;
      const next = [...transcript, { who: "user", text: txt }, { who: "bot", text: r }];
      refreshSession();
      transcript = next;
      input.value = "";
      render();
      refresh();
      release();
    };

    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
    if (tmplBtn && tmpl) tmplBtn.addEventListener("click", () => { if (templates[tmpl.value]) input.value = templates[tmpl.value]; });
    if (clearBtn) clearBtn.addEventListener("click", () => { transcript = [{ who: "bot", text: "Research Copilot Agent reset." }]; render(); });
    if (copyBtn) copyBtn.addEventListener("click", async () => flash(copyBtn, (await copy(asText())) ? "Copied" : "Copy failed"));
    bindDocDownloads({
      wordBtn: dlWordBtn,
      pdfBtn: dlPdfBtn,
      baseName: "research-chat",
      getText: () => asText()
    });

    render();
    refresh();
  })();

  // Essay
  (() => {
    const topic = byId("essayTopic");
    const tone = byId("essayTone");
    const template = byId("essayTemplate");
    const output = byId("essayOutput");
    const genBtn = byId("essayGenerateBtn");
    const clearBtn = byId("essayClearBtn");
    const copyBtn = byId("essayCopyBtn");
    const dlWordBtn = byId("essayDownloadWordBtn");
    const dlPdfBtn = byId("essayDownloadPdfBtn");
    const wc = byId("essayWordCount");
    const rd = byId("essayReadability");
    const historyBox = byId("essayHistory");

    if (!topic || !tone || !output || !genBtn) return;

    const upd = () => {
      if (wc) wc.textContent = String(words(output.value));
      if (rd) rd.textContent = readability(output.value);
    };

    const build = (t, tn, tp) => {
      const style = tn === "persuasive" ? "This essay adopts a persuasive tone." : tn === "simple" ? "This essay uses clear and direct language." : "This essay follows an academic tone.";
      const shape = tp === "compare" ? "The argument compares two perspectives before evaluation." : tp === "case" ? "The analysis is framed as a focused case discussion." : "The discussion develops claims with analytical reasoning.";
      return [
        `Title: ${t}`,
        "",
        "Introduction",
        `${style} The introduction sets context and states the thesis clearly.`,
        "",
        "Body",
        `${shape}`,
        "- Point 1: Core context and definitions.",
        "- Point 2: Main argument and interpretation.",
        "- Point 3: Counterpoint and limitation.",
        "",
        "Conclusion",
        "The conclusion summarizes findings and provides practical implications."
      ].join("\n");
    };

    const refresh = () => {
      const list = historyFor("essay");
      renderHistory(historyBox, list, (it) => {
        topic.value = it.meta?.topic || "";
        tone.value = it.meta?.tone || "academic";
        if (template && it.meta?.template) template.value = it.meta.template;
        output.value = it.output || "";
        upd();
      });
    };

    genBtn.addEventListener("click", async () => {
      const t = topic.value.trim();
      if (!t) return;
      const release = withBusy(genBtn, "Generating...");
      const ai = await requestAgent("essay", {
        topic: t,
        text: t,
        options: { tone: tone.value, template: template ? template.value : "" }
      });
      if (!ai.ok || !ai.output) {
        output.value = describeAgentError(ai);
        upd();
        release();
        return;
      }
      const out = ai.output;
      refreshSession();
      output.value = out;
      upd();
      refresh();
      release();
    });

    if (clearBtn) clearBtn.addEventListener("click", () => { topic.value = ""; output.value = ""; upd(); });
    if (copyBtn) copyBtn.addEventListener("click", async () => flash(copyBtn, (await copy(output.value)) ? "Copied" : "Copy failed"));
    bindDocDownloads({
      wordBtn: dlWordBtn,
      pdfBtn: dlPdfBtn,
      baseName: "essay-output",
      getText: () => output.value,
      getTitle: () => topic.value.trim()
    });

    refresh();
    upd();
  })();

  // Note
  (() => {
    const input = byId("noteInput");
    const output = byId("noteOutput");
    const runBtn = byId("noteProcessBtn");
    const tmpl = byId("noteTemplate");
    const tmplBtn = byId("noteTemplateBtn");
    const clearBtn = byId("noteClearBtn");
    const copyBtn = byId("noteCopyBtn");
    const dlWordBtn = byId("noteDownloadWordBtn");
    const dlPdfBtn = byId("noteDownloadPdfBtn");
    const wc = byId("noteWordCount");
    const historyBox = byId("noteHistory");

    if (!input || !output || !runBtn) return;

    const templates = {
      lecture: "Cell membrane controls transport. Mitochondria produce energy. Rough ER and smooth ER serve different functions. Golgi apparatus packages proteins.",
      chapter: "Main idea. Supporting arguments. Important terms. Examples. Summary.",
      meeting: "Objective. Decisions. Action items. Owners. Deadlines."
    };

    const upd = () => { if (wc) wc.textContent = String(words(output.value)); };

    const process = (raw) => {
      const lines = raw.split(/[\n\.]/).map((x) => x.trim()).filter(Boolean).slice(0, 12);
      const bullets = lines.map((x) => `- ${x}`).join("\n");
      return [
        "Key Takeaways",
        bullets || "- No key takeaways detected.",
        "",
        "Quick Revision",
        "- Convert each point to a practice question.",
        "- Review weak areas first."
      ].join("\n");
    };

    const refresh = () => {
      const list = historyFor("note");
      renderHistory(historyBox, list, (it) => {
        input.value = it.input || "";
        output.value = it.output || "";
        upd();
      });
    };

    runBtn.addEventListener("click", async () => {
      const src = input.value.trim();
      if (!src) return;
      const release = withBusy(runBtn, "Processing...");
      const ai = await requestAgent("note", { content: src, text: src });
      if (!ai.ok || !ai.output) {
        output.value = describeAgentError(ai);
        upd();
        release();
        return;
      }
      const out = ai.output;
      refreshSession();
      output.value = out;
      upd();
      refresh();
      release();
    });

    if (tmplBtn && tmpl) tmplBtn.addEventListener("click", () => { if (templates[tmpl.value]) input.value = templates[tmpl.value]; });
    if (clearBtn) clearBtn.addEventListener("click", () => { input.value = ""; output.value = ""; upd(); });
    if (copyBtn) copyBtn.addEventListener("click", async () => flash(copyBtn, (await copy(output.value)) ? "Copied" : "Copy failed"));
    bindDocDownloads({
      wordBtn: dlWordBtn,
      pdfBtn: dlPdfBtn,
      baseName: "notes-output",
      getText: () => output.value
    });

    refresh();
    upd();
  })();

  // Report
  (() => {
    const input = byId("reportInput");
    const analyzeBtn = byId("reportAnalyzeBtn");
    const ai = byId("aiScore");
    const human = byId("humanScore");
    const hint = byId("reportHint");
    const tmpl = byId("reportTemplate");
    const tmplBtn = byId("reportTemplateBtn");
    const clearBtn = byId("reportClearBtn");
    const copyBtn = byId("reportCopyBtn");
    const dlWordBtn = byId("reportDownloadWordBtn");
    const dlPdfBtn = byId("reportDownloadPdfBtn");
    const wc = byId("reportWordCount");
    const historyBox = byId("reportHistory");

    if (!input || !analyzeBtn || !ai || !human || !hint) return;

    const templates = {
      executive: "Quarterly summary: conversion dropped, CPA increased, and delivery delays affected onboarding quality.",
      ops: "Operational incidents increased due to delayed approvals and unclear ownership.",
      education: "The committee is reviewing student outcomes, attendance patterns, and policy compliance."
    };

    const upd = () => { if (wc) wc.textContent = String(words(input.value)); };

    const summary = () => `AI probability: ${ai.textContent}\nHuman probability: ${human.textContent}\n${hint.textContent}`;

    const refresh = () => {
      const list = historyFor("report");
      renderHistory(historyBox, list, (it) => {
        input.value = it.input || "";
        const metaAi = it.meta?.ai;
        const metaHuman = it.meta?.human;
        const metaHint = it.meta?.hint;
        if (metaAi || metaHuman || metaHint) {
          ai.textContent = metaAi || "-";
          human.textContent = metaHuman || "-";
          hint.textContent = metaHint || "No analysis yet.";
        } else {
          const aiMatch = String(it.output || "").match(/AI Score:\s*([0-9]{1,3})%?/i);
          const humanMatch = String(it.output || "").match(/Human Score:\s*([0-9]{1,3})%?/i);
          const assessMatch = String(it.output || "").match(/Assessment:\s*([\s\S]*)/i);
          ai.textContent = aiMatch ? `${aiMatch[1]}%` : "-";
          human.textContent = humanMatch ? `${humanMatch[1]}%` : "-";
          hint.textContent = assessMatch && assessMatch[1] ? assessMatch[1].trim() : "No analysis yet.";
        }
        upd();
      }, "No reports yet.");
    };

    analyzeBtn.addEventListener("click", async () => {
      const txt = input.value.trim();
      if (!txt) return;
      const release = withBusy(analyzeBtn, "Analyzing...");
      const aiResp = await requestAgent("report", { text: txt });
      if (!aiResp.ok || !aiResp.output) {
        hint.textContent = describeAgentError(aiResp);
        release();
        return;
      }
      const aiMatch = aiResp.output.match(/AI Score:\s*([0-9]{1,3})%?/i);
      const humanMatch = aiResp.output.match(/Human Score:\s*([0-9]{1,3})%?/i);
      const assessMatch = aiResp.output.match(/Assessment:\s*([\s\S]*)/i);

      if (aiMatch && humanMatch) {
        const aiScore = Math.max(0, Math.min(100, Number(aiMatch[1])));
        const parsedHuman = Math.max(0, Math.min(100, Number(humanMatch[1])));
        if (!Number.isNaN(parsedHuman)) {
          ai.textContent = `${aiScore}%`;
          human.textContent = `${parsedHuman}%`;
        }
      }
      hint.textContent =
        assessMatch && assessMatch[1] ? assessMatch[1].trim() : t("No analysis yet.", "لا يوجد تحليل بعد.");
      refreshSession();
      refresh();
      release();
    });

    if (tmplBtn && tmpl) tmplBtn.addEventListener("click", () => { if (templates[tmpl.value]) { input.value = templates[tmpl.value]; upd(); } });
    if (clearBtn) clearBtn.addEventListener("click", () => { input.value = ""; ai.textContent = "-"; human.textContent = "-"; hint.textContent = "No analysis yet."; upd(); });
    if (copyBtn) copyBtn.addEventListener("click", async () => flash(copyBtn, (await copy(summary())) ? "Copied" : "Copy failed"));
    bindDocDownloads({
      wordBtn: dlWordBtn,
      pdfBtn: dlPdfBtn,
      baseName: "authenticity-report",
      getText: () => summary()
    });

    input.addEventListener("input", upd);
    refresh();
    upd();
  })();

  // Editor
  (() => {
    const input = byId("editorInput");
    const output = byId("editorOutput");
    const runBtn = byId("editorFixBtn");
    const clearBtn = byId("editorClearBtn");
    const copyBtn = byId("editorCopyBtn");
    const dlWordBtn = byId("editorDownloadWordBtn");
    const dlPdfBtn = byId("editorDownloadPdfBtn");
    const mode = byId("editorMode");
    const strength = byId("editorStrength");
    const wc = byId("editorWordCount");
    const rd = byId("editorReadability");
    const diff = byId("editorDiff");
    const historyBox = byId("editorHistory");

    if (!input || !output || !runBtn) return;

    const upd = () => {
      if (wc) wc.textContent = String(words(output.value));
      if (rd) rd.textContent = readability(output.value);
    };

    const refresh = () => {
      const list = historyFor("editor");
      renderHistory(historyBox, list, (it) => {
        input.value = it.input || "";
        output.value = it.output || "";
        if (diff) diff.innerHTML = diffHtml(input.value, output.value);
        upd();
      });
    };

    runBtn.addEventListener("click", async () => {
      const src = input.value.trim();
      if (!src) return;
      const release = withBusy(runBtn, "Editing...");
      const ai = await requestAgent("editor", {
        text: src,
        options: { mode: mode?.value, strength: strength?.value }
      });
      if (!ai.ok || !ai.output) {
        output.value = describeAgentError(ai);
        upd();
        release();
        return;
      }
      const out = ai.output;
      refreshSession();
      output.value = out;
      if (diff) diff.innerHTML = diffHtml(src, out);
      upd();
      refresh();
      release();
    });

    if (clearBtn) clearBtn.addEventListener("click", () => { input.value = ""; output.value = ""; if (diff) diff.textContent = "No comparison yet."; upd(); });
    if (copyBtn) copyBtn.addEventListener("click", async () => flash(copyBtn, (await copy(output.value)) ? "Copied" : "Copy failed"));
    bindDocDownloads({
      wordBtn: dlWordBtn,
      pdfBtn: dlPdfBtn,
      baseName: "edited-output",
      getText: () => output.value
    });

    refresh();
    upd();
  })();

  // Advanced tools (shared wiring)
  const mountSimpleAgentTool = ({
    tool,
    inputId,
    outputId,
    runBtnId,
    clearBtnId,
    copyBtnId,
    downloadWordBtnId,
    downloadPdfBtnId,
    wordCountId,
    historyId,
    topicId,
    optionsBuilder
  }) => {
    const input = byId(inputId);
    const output = byId(outputId);
    const runBtn = byId(runBtnId);
    const clearBtn = byId(clearBtnId);
    const copyBtn = byId(copyBtnId);
    const dlWordBtn = byId(downloadWordBtnId);
    const dlPdfBtn = byId(downloadPdfBtnId);
    const wc = byId(wordCountId);
    const historyBox = byId(historyId);
    const topic = topicId ? byId(topicId) : null;

    if (!input || !output || !runBtn) return;

    const upd = () => {
      if (wc) wc.textContent = String(words(output.value));
    };

    const refresh = () => {
      const list = historyFor(tool);
      renderHistory(historyBox, list, (it) => {
        input.value = it.input || "";
        output.value = it.output || "";
        if (topic && it.meta?.topic) topic.value = it.meta.topic;
        upd();
      });
    };

    runBtn.addEventListener("click", async () => {
      const src = input.value.trim();
      if (!src) return;
      const release = withBusy(runBtn, "Generating...");
      const options = typeof optionsBuilder === "function" ? optionsBuilder() : {};
      const payload = {
        text: src,
        topic: topic ? topic.value.trim() : "",
        options
      };

      const ai = await requestAgent(tool, payload);
      if (!ai.ok || !ai.output) {
        output.value = describeAgentError(ai);
        upd();
        release();
        return;
      }
      const out = ai.output;
      refreshSession();

      output.value = out;
      upd();
      refresh();
      release();
    });

    if (clearBtn) clearBtn.addEventListener("click", () => {
      input.value = "";
      output.value = "";
      if (topic) topic.value = "";
      upd();
    });
    if (copyBtn) copyBtn.addEventListener("click", async () => flash(copyBtn, (await copy(output.value)) ? "Copied" : "Copy failed"));
    bindDocDownloads({
      wordBtn: dlWordBtn,
      pdfBtn: dlPdfBtn,
      baseName: `${tool}-output`,
      getText: () => output.value,
      getTitle: () => (topic ? topic.value.trim() : "")
    });

    refresh();
    upd();
  };

  mountSimpleAgentTool({
    tool: "citation",
    inputId: "citationInput",
    outputId: "citationOutput",
    runBtnId: "citationGenerateBtn",
    clearBtnId: "citationClearBtn",
    copyBtnId: "citationCopyBtn",
    downloadWordBtnId: "citationDownloadWordBtn",
    downloadPdfBtnId: "citationDownloadPdfBtn",
    wordCountId: "citationWordCount",
    historyId: "citationHistory",
    topicId: "citationTopic",
    optionsBuilder: () => ({ style: byId("citationStyle")?.value || "APA" })
  });

  mountSimpleAgentTool({
    tool: "plagiarism",
    inputId: "plagiarismInput",
    outputId: "plagiarismOutput",
    runBtnId: "plagiarismGenerateBtn",
    clearBtnId: "plagiarismClearBtn",
    copyBtnId: "plagiarismCopyBtn",
    downloadWordBtnId: "plagiarismDownloadWordBtn",
    downloadPdfBtnId: "plagiarismDownloadPdfBtn",
    wordCountId: "plagiarismWordCount",
    historyId: "plagiarismHistory"
  });

  mountSimpleAgentTool({
    tool: "methodology",
    inputId: "methodologyInput",
    outputId: "methodologyOutput",
    runBtnId: "methodologyGenerateBtn",
    clearBtnId: "methodologyClearBtn",
    copyBtnId: "methodologyCopyBtn",
    downloadWordBtnId: "methodologyDownloadWordBtn",
    downloadPdfBtnId: "methodologyDownloadPdfBtn",
    wordCountId: "methodologyWordCount",
    historyId: "methodologyHistory",
    topicId: "methodologyTopic",
    optionsBuilder: () => ({ domain: byId("methodologyDomain")?.value || "general" })
  });

  mountSimpleAgentTool({
    tool: "paraphrase",
    inputId: "paraphraseInput",
    outputId: "paraphraseOutput",
    runBtnId: "paraphraseGenerateBtn",
    clearBtnId: "paraphraseClearBtn",
    copyBtnId: "paraphraseCopyBtn",
    downloadWordBtnId: "paraphraseDownloadWordBtn",
    downloadPdfBtnId: "paraphraseDownloadPdfBtn",
    wordCountId: "paraphraseWordCount",
    historyId: "paraphraseHistory",
    topicId: "paraphraseTopic",
    optionsBuilder: () => ({ level: byId("paraphraseLevel")?.value || "undergraduate" })
  });

  mountSimpleAgentTool({
    tool: "thesis",
    inputId: "thesisInput",
    outputId: "thesisOutput",
    runBtnId: "thesisGenerateBtn",
    clearBtnId: "thesisClearBtn",
    copyBtnId: "thesisCopyBtn",
    downloadWordBtnId: "thesisDownloadWordBtn",
    downloadPdfBtnId: "thesisDownloadPdfBtn",
    wordCountId: "thesisWordCount",
    historyId: "thesisHistory"
  });

  mountSimpleAgentTool({
    tool: "outline",
    inputId: "outlineInput",
    outputId: "outlineOutput",
    runBtnId: "outlineGenerateBtn",
    clearBtnId: "outlineClearBtn",
    copyBtnId: "outlineCopyBtn",
    downloadWordBtnId: "outlineDownloadWordBtn",
    downloadPdfBtnId: "outlineDownloadPdfBtn",
    wordCountId: "outlineWordCount",
    historyId: "outlineHistory"
  });

  mountSimpleAgentTool({
    tool: "file",
    inputId: "fileInput",
    outputId: "fileOutput",
    runBtnId: "fileGenerateBtn",
    clearBtnId: "fileClearBtn",
    copyBtnId: "fileCopyBtn",
    downloadWordBtnId: "fileDownloadWordBtn",
    downloadPdfBtnId: "fileDownloadPdfBtn",
    wordCountId: "fileWordCount",
    historyId: "fileHistory"
  });

  (() => {
    const uploadInput = byId("fileUploadInput");
    const uploadBtn = byId("fileUploadBtn");
    const uploadStatus = byId("fileUploadStatus");
    const textInput = byId("fileInput");
    if (!uploadInput || !uploadBtn || !uploadStatus || !textInput) return;

    const setUploadStatus = (text, type = "idle") => {
      uploadStatus.textContent = String(text || "");
      uploadStatus.classList.remove("is-ok", "is-error", "is-busy");
      if (type === "ok") uploadStatus.classList.add("is-ok");
      if (type === "error") uploadStatus.classList.add("is-error");
      if (type === "busy") uploadStatus.classList.add("is-busy");
    };

    const refreshRecentFiles = async () => {
      try {
        const resp = await fetch("/api/files", {
          method: "GET",
          credentials: "same-origin"
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data?.ok || !Array.isArray(data.files) || !data.files.length) return;
        const latest = data.files[0];
        const name = latest?.original_name || latest?.name || "";
        if (name) {
          setUploadStatus(
            t("Last indexed file:", "آخر ملف تمت فهرسته:") + ` ${name}`,
            "idle"
          );
        }
      } catch (_) {
        // keep silent, upload flow still works without this hint
      }
    };

    uploadBtn.addEventListener("click", async () => {
      const file = uploadInput.files && uploadInput.files[0] ? uploadInput.files[0] : null;
      if (!file) {
        setUploadStatus(t("Select a file first.", "اختر ملف أولًا."), "error");
        return;
      }
      const release = withBusy(uploadBtn, t("Uploading...", "جاري الرفع..."));
      setUploadStatus(t("Uploading and indexing file...", "جاري رفع وفهرسة الملف..."), "busy");
      try {
        const fd = new FormData();
        fd.append("file", file);
        const resp = await fetch("/api/files/upload", {
          method: "POST",
          credentials: "same-origin",
          body: fd
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data?.ok) {
          setUploadStatus(
            data?.message || t("Upload failed. Try another file.", "فشل الرفع. جرب ملفًا آخر."),
            "error"
          );
          release();
          return;
        }

        textInput.value = String(data.extracted_preview || "");
        const chunks = Number(data.chunks_indexed || 0);
        setUploadStatus(
          `${t("Indexed successfully.", "تمت الفهرسة بنجاح.")} ${chunks} ${t("chunks ready for analysis.", "مقطع جاهز للتحليل.")}`,
          "ok"
        );
      } catch (_) {
        setUploadStatus(t("Network error during upload.", "خطأ شبكة أثناء الرفع."), "error");
      } finally {
        release();
      }
    });

    refreshRecentFiles();
  })();

  mountSimpleAgentTool({
    tool: "heatmap",
    inputId: "heatmapInput",
    outputId: "heatmapOutput",
    runBtnId: "heatmapGenerateBtn",
    clearBtnId: "heatmapClearBtn",
    copyBtnId: "heatmapCopyBtn",
    downloadWordBtnId: "heatmapDownloadWordBtn",
    downloadPdfBtnId: "heatmapDownloadPdfBtn",
    wordCountId: "heatmapWordCount",
    historyId: "heatmapHistory"
  });

  mountSimpleAgentTool({
    tool: "readiness",
    inputId: "readinessInput",
    outputId: "readinessOutput",
    runBtnId: "readinessGenerateBtn",
    clearBtnId: "readinessClearBtn",
    copyBtnId: "readinessCopyBtn",
    downloadWordBtnId: "readinessDownloadWordBtn",
    downloadPdfBtnId: "readinessDownloadPdfBtn",
    wordCountId: "readinessWordCount",
    historyId: "readinessHistory"
  });
})();


