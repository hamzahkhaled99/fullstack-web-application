(() => {
  const LANG_KEY = "bsh_lang";

  const tr = {
    en: {
      lang_name: "English",
      nav_tools: "Tools",
      nav_pricing: "Pricing",
      nav_dashboard: "Dashboard",
      nav_team: "Team",
      nav_about: "About",
      nav_faq: "FAQ",
      nav_get_started: "Get started",
      back_to_site: "Back to Website",
      back_short: "Back",
      logout: "Log out",
      send: "Send",
      language_toggle_aria: "Switch language to Arabic",
      index_title: "Best student humanizer",
      auth_title_page: "Best student humanizer | Access",
      tools_title_page: "Best student humanizer | Workspace",
      dashboard_title_page: "Dashboard | Best student humanizer",
      hero_badge: "* Academic AI Workspace",
      hero_accent: "humanizer",
      hero_subline: "Built for Results",
      hero_text: "Humanize drafts, build essays, and convert lectures into clean notes in one place. Fast workflow, cleaner writing, better outcomes.",
      start_free: "Start Free",
      stat_learners: "Active Learners",
      stat_score: "Natural Output Score",
      stat_tools: "Academic Tools",
      showcase_title: "Live Workflow",
      high_demand: "High Demand",
      preview_kicker: "Hands-On Preview",
      preview_title: "Explore The Workspace",
      section_tools_kicker: "Student Toolset",
      section_tools_title: "Everything You Need in One Suite",
      group_core_title: "Core Tools",
      group_core_sub: "Daily academic workflow",
      group_adv_title: "Advanced Writing",
      group_adv_sub: "Build stronger drafts faster",
      group_review_title: "Quality & Review",
      group_review_sub: "Final checks before hand-in",
      about_kicker: "Why It Works",
      about_title: "Built for Real Coursework",
      about_body: "Built for real deadlines, cleaner submissions, and consistent academic quality from first draft to final version.",
      testimonials_kicker: "Student Voices",
      testimonials_title: "What Students Say",
      pricing_banner: "Limited-Time FREE Access: All premium tools are unlocked right now. Join today and secure your free early access before this offer ends.",
      faq_kicker: "FAQ",
      faq_title: "Before You Start",
      footer_products: "Products",
      footer_company: "Company",
      footer_resources: "Resources",
      footer_legals: "Legals",
      tools_workspace_h1: "Student humanizer",
      tools_group_core: "Core Tools",
      tools_group_adv: "Advanced Writing",
      tools_group_review: "Quality & Review",
      tools_fusion_title: "Research Fusion",
      tools_fusion_hint_title: "Deep Reasoning + QA Ensemble",
      tools_fusion_hint_proof: "Auto weak-section recovery + final gatekeeper review",
      tools_fusion_intake_title: "Smart Research Intake (Required for best one-pass quality)",
      tools_fusion_problem: "Research problem or gap *",
      tools_fusion_objective: "Main objective *",
      tools_fusion_rq: "Primary RQ or hypothesis *",
      tools_fusion_context: "Population / context",
      tools_fusion_method: "Preferred methodology *",
      tools_fusion_constraints: "Constraints, scope limits, or professor notes",
      tools_fusion_generate: "Generate Full Research",
      tools_fusion_clear: "Clear",
      tools_fusion_copy: "Copy Final",
      tools_fusion_console: "AI Orchestration Console",
      tools_fusion_final: "Final Human-Like Research",
      tools_fusion_bundle: "Quality & Review Bundle",
      tools_download_word: "Download Word",
      tools_download_pdf: "Download PDF",
      tools_input: "Input",
      tools_output: "Output",
      tools_history: "History",
      tools_compare: "Smart Compare",
      tools_no_history: "No saved versions yet.",
      tools_no_compare: "No comparison yet.",
      auth_title: "Create your AI writing workspace",
      auth_login: "Log In",
      auth_signup: "Create Account",
      auth_continue: "Continue",
      auth_email: "Email",
      auth_password: "Password",
      auth_full_name: "Full name",
      auth_confirm_password: "Confirm Password",
      auth_source: "How did you find us?",
      auth_forgot: "Forgot password?",
      auth_reset_it: "Reset it",
      auth_send_code: "Send Code to Email",
      auth_reset_password: "Reset Password",
      auth_remembered: "Remembered it?",
      auth_log_in: "Log in",
      auth_already: "Already with us?",
      auth_or_continue: "or continue with",
      auth_google: "Continue with Google",
      auth_terms: "I agree to the User Terms",
      auth_updates: "Send me product updates, learning tips, and special offers.",
      auth_create_cta: "Create Account ->",
      dash_run_unit: "runs",
      unlimited: "Unlimited",
      dash_back: "Back",
      back: "Back",
      welcome_dashboard: "Your Student Workspace",
      dashboard_sub: "Track usage, manage plan, and continue writing.",
      current_plan: "Current plan",
      monthly_credits: "Monthly credits",
      used_words: "Used words",
      remaining_words: "Remaining words",
      usage_by_tool: "Usage by tool",
      save_history_label: "Save my generated outputs for history & restore",
      open_tools: "Open Tools",
      onboarding_title: "Quick Start",
      onboarding_body: "Use Humanizer Pro for rewriting, Research Copilot for planning, and Essay Architect for structured drafts.",
      close: "Close"
    },
    ar: {
      lang_name: "العربية",
      nav_tools: "الأدوات",
      nav_pricing: "الأسعار",
      nav_dashboard: "لوحة التحكم",
      nav_team: "الفريق",
      nav_about: "حول المنصة",
      nav_faq: "الأسئلة الشائعة",
      nav_get_started: "ابدأ الآن",
      back_to_site: "العودة إلى الموقع",
      back_short: "رجوع",
      logout: "تسجيل الخروج",
      send: "إرسال",
      language_toggle_aria: "التبديل إلى اللغة الإنجليزية",
      index_title: "Best student humanizer",
      auth_title_page: "Best student humanizer | تسجيل الدخول",
      tools_title_page: "Best student humanizer | مساحة العمل",
      dashboard_title_page: "لوحة التحكم | Best student humanizer",
      hero_badge: "* منصة أكاديمية ذكية",
      hero_accent: "مساعد الكتابة",
      hero_subline: "نتائج أقوى بوقت أقل",
      hero_text: "طوّر مسوداتك لتصبح طبيعية، ابنِ المقالات بسرعة، وحوّل المحاضرات إلى ملاحظات مرتبة في مكان واحد.",
      start_free: "ابدأ مجانًا",
      stat_learners: "طالب نشط",
      stat_score: "مؤشر جودة الصياغة",
      stat_tools: "أداة أكاديمية",
      showcase_title: "سير العمل المباشر",
      high_demand: "طلب مرتفع",
      preview_kicker: "تجربة مباشرة",
      preview_title: "استكشف مساحة العمل",
      section_tools_kicker: "مجموعة الطالب",
      section_tools_title: "كل ما تحتاجه في منصة واحدة",
      group_core_title: "الأدوات الأساسية",
      group_core_sub: "سيرك الأكاديمي اليومي",
      group_adv_title: "الكتابة المتقدمة",
      group_adv_sub: "ابنِ مسودات أقوى بسرعة",
      group_review_title: "المراجعة والجودة",
      group_review_sub: "فحص نهائي قبل التسليم",
      about_kicker: "لماذا تنجح المنصة",
      about_title: "مصممة لواقع الدراسة",
      about_body: "مبنية لتناسب مواعيد التسليم الحقيقية، ورفع جودة الكتابة من أول مسودة حتى النسخة النهائية.",
      testimonials_kicker: "آراء الطلاب",
      testimonials_title: "ماذا يقول الطلاب",
      pricing_banner: "وصول مجاني لفترة محدودة: كل الأدوات الاحترافية مفتوحة الآن. سجّل اليوم وثبّت وصولك المجاني المبكر قبل انتهاء العرض.",
      faq_kicker: "الأسئلة الشائعة",
      faq_title: "قبل أن تبدأ",
      footer_products: "المنتجات",
      footer_company: "الشركة",
      footer_resources: "الموارد",
      footer_legals: "السياسات",
      tools_workspace_h1: "مساحة الطالب الذكية",
      tools_group_core: "الأدوات الأساسية",
      tools_group_adv: "الكتابة المتقدمة",
      tools_group_review: "المراجعة والجودة",
      tools_fusion_title: "دمج البحث الذكي",
      tools_fusion_hint_title: "استدلال عميق + مراجعة متعددة",
      tools_fusion_hint_proof: "معالجة تلقائية لنقاط الضعف + فحص نهائي قبل التسليم",
      tools_fusion_intake_title: "أسئلة بحث ذكية (مطلوبة لأفضل نتيجة من أول مرة)",
      tools_fusion_problem: "مشكلة البحث أو الفجوة *",
      tools_fusion_objective: "الهدف الرئيسي *",
      tools_fusion_rq: "سؤال البحث أو الفرضية *",
      tools_fusion_context: "المجتمع/السياق",
      tools_fusion_method: "المنهجية المفضلة *",
      tools_fusion_constraints: "القيود أو حدود النطاق أو ملاحظات الدكتور",
      tools_fusion_generate: "إنشاء البحث الكامل",
      tools_fusion_clear: "مسح",
      tools_fusion_copy: "نسخ النسخة النهائية",
      tools_fusion_console: "لوحة تنسيق الذكاء الاصطناعي",
      tools_fusion_final: "البحث النهائي بصياغة بشرية",
      tools_fusion_bundle: "باقة الجودة والمراجعة",
      tools_download_word: "تنزيل Word",
      tools_download_pdf: "تنزيل PDF",
      tools_input: "الإدخال",
      tools_output: "الناتج",
      tools_history: "السجل",
      tools_compare: "مقارنة ذكية",
      tools_no_history: "لا توجد نسخ محفوظة بعد.",
      tools_no_compare: "لا توجد مقارنة بعد.",
      auth_title: "أنشئ مساحتك الذكية للكتابة",
      auth_login: "تسجيل الدخول",
      auth_signup: "إنشاء حساب",
      auth_continue: "متابعة",
      auth_email: "البريد الإلكتروني",
      auth_password: "كلمة المرور",
      auth_full_name: "الاسم الكامل",
      auth_confirm_password: "تأكيد كلمة المرور",
      auth_source: "كيف وصلت إلينا؟",
      auth_forgot: "نسيت كلمة المرور؟",
      auth_reset_it: "استرجعها",
      auth_send_code: "إرسال رمز التحقق إلى البريد",
      auth_reset_password: "تعيين كلمة مرور جديدة",
      auth_remembered: "تذكّرتها؟",
      auth_log_in: "تسجيل الدخول",
      auth_already: "عندك حساب؟",
      auth_or_continue: "أو المتابعة عبر",
      auth_google: "المتابعة باستخدام Google",
      auth_terms: "أوافق على شروط الاستخدام",
      auth_updates: "أرسل لي تحديثات المنتج ونصائح تعليمية وعروض خاصة.",
      auth_create_cta: "إنشاء حساب <-",
      dash_run_unit: "عملية",
      unlimited: "غير محدود",
      dash_back: "رجوع",
      back: "رجوع",
      welcome_dashboard: "مساحة الطالب",
      dashboard_sub: "تابع استخدامك، أدر خطتك، وكمّل كتابتك بسهولة.",
      current_plan: "الخطة الحالية",
      monthly_credits: "الرصيد الشهري",
      used_words: "الكلمات المستخدمة",
      remaining_words: "الكلمات المتبقية",
      usage_by_tool: "استخدام الأدوات",
      save_history_label: "احفظ المخرجات في السجل لتتمكن من استعادتها لاحقًا",
      open_tools: "فتح الأدوات",
      onboarding_title: "بداية سريعة",
      onboarding_body: "استخدم Humanizer Pro لإعادة الصياغة، وResearch Copilot للتخطيط، وEssay Architect لبناء مسودات مرتبة.",
      close: "إغلاق"
    }
  };

  const getLang = () => (localStorage.getItem(LANG_KEY) === "ar" ? "ar" : "en");

  const t = (key, lang = getLang()) => tr[lang][key] || tr.en[key] || key;

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && typeof value === "string") el.textContent = value;
  };

  const setHtml = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && typeof value === "string") el.innerHTML = value;
  };

  const setById = (id, value) => {
    const el = document.getElementById(id);
    if (el && typeof value === "string") el.textContent = value;
  };

  const setPlaceholder = (id, value) => {
    const el = document.getElementById(id);
    if (el && typeof value === "string") el.setAttribute("placeholder", value);
  };

  const setSelectOptions = (id, pairs) => {
    const el = document.getElementById(id);
    if (!el || !pairs) return;
    Object.entries(pairs).forEach(([value, label]) => {
      const option = el.querySelector(`option[value="${value}"]`);
      if (option && typeof label === "string") option.textContent = label;
    });
  };

  const setBackLabel = (selector, text, lang) => {
    const arrow = lang === "ar" ? "\u2192" : "\u2190";
    setText(selector, `${arrow} ${text}`);
  };

  const tabMapValue = (lang, key) => {
    const map = {
      fusion: lang === "ar" ? "دمج البحث الذكي" : "Research Fusion",
      humanizer: lang === "ar" ? "مُحسّن النصوص" : "Humanizer Pro",
      chat: lang === "ar" ? "مساعد البحث" : "Research Copilot",
      essay: lang === "ar" ? "مهندس المقال" : "Essay Architect",
      note: lang === "ar" ? "ملاحظات المحاضرات" : "Lecture Notes AI",
      report: lang === "ar" ? "تقرير الأصالة" : "Authenticity Report",
      editor: lang === "ar" ? "المحرر الذكي" : "Smart Editor",
      citation: lang === "ar" ? "وكيل التوثيق" : "Citation Agent",
      plagiarism: lang === "ar" ? "فاحص الانتحال" : "Plagiarism Checker",
      methodology: lang === "ar" ? "بناء المنهجية" : "Methodology Builder",
      paraphrase: lang === "ar" ? "إعادة الصياغة حسب المستوى" : "Paraphrase by Level",
      thesis: lang === "ar" ? "مولد الأطروحة" : "Thesis Generator",
      outline: lang === "ar" ? "من مخطط إلى مسودة" : "Outline to Draft",
      file: lang === "ar" ? "محلل PDF/Doc" : "PDF/Doc Analyzer",
      heatmap: lang === "ar" ? "خريطة الأسلوب" : "Style Heatmap",
      readiness: lang === "ar" ? "جاهزية التسليم" : "Submission Readiness"
    };
    return map[key] || key;
  };

  const applyDir = (lang) => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  };

  const applyIndex = (lang) => {
    document.title = t("index_title", lang);
    setText(".pill", t("hero_badge", lang));
    setText("h1 .hero-accent", t("hero_accent", lang));
    setText("h1 .hero-subline", t("hero_subline", lang));
    setText(".hero-text", t("hero_text", lang));
    setHtml(".hero-actions .btn-light", `${t("start_free", lang)} <span>${lang === "ar" ? "&larr;" : "-&gt;"}</span>`);

    setText(".stats-box article:nth-child(1) p", t("stat_learners", lang));
    setText(".stats-box article:nth-child(2) p", t("stat_score", lang));
    setText(".stats-box article:nth-child(3) p", t("stat_tools", lang));

    setText(".showcase-card h3", t("showcase_title", lang));
    document.querySelectorAll(".showcase-card li strong").forEach((el) => {
      el.textContent = t("high_demand", lang);
    });

    setText(".demo-headline .section-kicker", t("preview_kicker", lang));
    setText(".demo-headline h2", t("preview_title", lang));
    setText("#tools .section-kicker", t("section_tools_kicker", lang));
    setText("#tools h2", t("section_tools_title", lang));
    setText("#about .section-kicker", t("about_kicker", lang));
    setText("#about h2", t("about_title", lang));
    setText(".about-intro .muted-copy", t("about_body", lang));
    setText("#testimonials .section-kicker", t("testimonials_kicker", lang));
    setText("#testimonials h2", t("testimonials_title", lang));
    setText(".pricing-free-banner", t("pricing_banner", lang));
    setText("#faq .section-kicker", t("faq_kicker", lang));
    setText("#faq h2", t("faq_title", lang));

    const navLinks = document.querySelectorAll(".desktop-nav > a");
    if (navLinks[0]) navLinks[0].textContent = t("nav_dashboard", lang);
    if (navLinks[1]) navLinks[1].textContent = t("nav_team", lang);
    if (navLinks[2]) navLinks[2].textContent = t("nav_about", lang);
    if (navLinks[3]) navLinks[3].textContent = t("nav_faq", lang);

    const mobileLinks = document.querySelectorAll(".mobile-nav > a");
    if (mobileLinks[0]) mobileLinks[0].textContent = t("nav_tools", lang);
    if (mobileLinks[1]) mobileLinks[1].textContent = t("nav_dashboard", lang);
    if (mobileLinks[2]) mobileLinks[2].textContent = t("nav_team", lang);
    if (mobileLinks[3]) mobileLinks[3].textContent = t("nav_about", lang);
    if (mobileLinks[4]) mobileLinks[4].textContent = t("nav_faq", lang);

    document.querySelectorAll(".get-started").forEach((el) => {
      el.innerHTML = `${t("nav_get_started", lang)} <span>${lang === "ar" ? "&larr;" : "-&gt;"}</span>`;
    });

    setHtml(".dropdown-btn", `${t("nav_tools", lang)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`);
    const toolMenuLinks = document.querySelectorAll(".dropdown-menu a");
    if (toolMenuLinks[0]) toolMenuLinks[0].textContent = tabMapValue(lang, "humanizer");
    if (toolMenuLinks[1]) toolMenuLinks[1].textContent = tabMapValue(lang, "chat");
    if (toolMenuLinks[2]) toolMenuLinks[2].textContent = tabMapValue(lang, "essay");
    if (toolMenuLinks[3]) toolMenuLinks[3].textContent = tabMapValue(lang, "note");
    setText(".tool-group:nth-child(1) .tool-group-head h3", t("group_core_title", lang));
    setText(".tool-group:nth-child(1) .tool-group-head p", t("group_core_sub", lang));
    setText(".tool-group:nth-child(2) .tool-group-head h3", t("group_adv_title", lang));
    setText(".tool-group:nth-child(2) .tool-group-head p", t("group_adv_sub", lang));
    setText(".tool-group:nth-child(3) .tool-group-head h3", t("group_review_title", lang));
    setText(".tool-group:nth-child(3) .tool-group-head p", t("group_review_sub", lang));

    const toolCardTitles = [
      tabMapValue(lang, "humanizer"),
      tabMapValue(lang, "chat"),
      tabMapValue(lang, "essay"),
      tabMapValue(lang, "note"),
      tabMapValue(lang, "report"),
      tabMapValue(lang, "editor"),
      tabMapValue(lang, "citation"),
      tabMapValue(lang, "plagiarism"),
      tabMapValue(lang, "methodology"),
      tabMapValue(lang, "paraphrase"),
      tabMapValue(lang, "thesis"),
      tabMapValue(lang, "outline"),
      tabMapValue(lang, "file"),
      tabMapValue(lang, "heatmap"),
      tabMapValue(lang, "readiness")
    ];
    document.querySelectorAll(".tool-card h3 a").forEach((el, i) => {
      if (toolCardTitles[i]) el.textContent = toolCardTitles[i];
    });

    const toolCardBodies = lang === "ar"
      ? [
          "أعد كتابة النص المشابه للذكاء الاصطناعي بصياغة طبيعية وموثوقة.",
          "خطّط للبحث وحلّ المهام عبر ردود منظمة خطوة بخطوة.",
          "أنشئ هيكلًا واضحًا للمقال مع مسودة متكاملة.",
          "حوّل المحاضرات والنصوص الطويلة إلى ملاحظات مراجعة مركزة.",
          "افحص مؤشرات النص قبل التسليم.",
          "صحّح القواعد وتدفق الأفكار بدون تغيير المعنى.",
          "ولّد مراجع جاهزة للتوثيق بالأنماط الشائعة.",
          "اكتشف المقاطع عالية المخاطر قبل التسليم.",
          "ابنِ المنهجية والمتغيرات وخطة التحليل بشكل واضح.",
          "أعد صياغة النص حسب العمق والمستوى الأكاديمي.",
          "أنشئ أطروحات دقيقة انطلاقًا من موضوعك.",
          "حوّل النقاط المختصرة إلى فقرات مترابطة.",
          "حلّل ملفاتك وقدّم ملخصًا عمليًا للتحسين.",
          "اعرض نقاط الضعف في اللغة والأسلوب بصريًا.",
          "قيّم جاهزية التسليم بقائمة واضحة."
        ]
      : [
          "Rewrite AI-like text into natural, credible writing.",
          "Plan research and solve tasks with guided responses.",
          "Generate clear essay structures and complete drafts.",
          "Convert lectures and long content into revision notes.",
          "Check text signals before submission.",
          "Fix grammar, flow, and clarity without changing meaning.",
          "Generate citation-ready references in common styles.",
          "Flag high-risk overlap patterns before submission.",
          "Outline methods, variables, and structured approach.",
          "Rephrase text by clarity, depth, and academic level.",
          "Create focused thesis options from your topic scope.",
          "Convert bullet outlines into coherent draft sections.",
          "Scan uploaded files and summarize actionable fixes.",
          "Visualize weak spots in tone, flow, and readability.",
          "Score your draft readiness with a clear checklist."
        ];
    document.querySelectorAll(".tool-card > p").forEach((el, i) => {
      if (toolCardBodies[i]) el.textContent = toolCardBodies[i];
    });

    const aboutItems = document.querySelectorAll(".about-intro-list li");
    if (aboutItems[0]) aboutItems[0].textContent = lang === "ar" ? "مخرجات منظمة للواجبات والتقارير" : "Structured outputs for assignments and reports";
    if (aboutItems[1]) aboutItems[1].textContent = lang === "ar" ? "لغة أنظف مع الحفاظ على صوتك الكتابي" : "Cleaner language with your writing voice preserved";
    if (aboutItems[2]) aboutItems[2].textContent = lang === "ar" ? "سير أسرع من الفكرة حتى التسليم النهائي" : "Faster workflow from idea to final submission";

    const featureTitles = document.querySelectorAll(".feature-card h3");
    const featureBodies = document.querySelectorAll(".feature-card p");
    const arFeatures = [
      ["الحفاظ على الأسلوب", "يحافظ على طابع كتابتك بشكل طبيعي ومقنع."],
      ["سير عمل موجّه بالمهام", "اختر الأداة المناسبة لكل مهمة أكاديمية."],
      ["وضوح أكاديمي أعلى", "هيكلة أفضل وصياغة أوضح وتدفق أقوى."],
      ["سرعة في الإنجاز", "انتقل من أفكار أولية إلى نسخة جاهزة بسرعة."]
    ];
    const enFeatures = [
      ["Voice Preservation", "Your writing style stays natural and believable."],
      ["Task-Based Workflow", "Pick the right tool for each academic task."],
      ["Academic Clarity", "Get clearer structure, cleaner wording, and stronger flow."],
      ["Fast Turnaround", "Move from rough notes to polished output quickly."]
    ];
    const featurePack = lang === "ar" ? arFeatures : enFeatures;
    featurePack.forEach((item, i) => {
      if (featureTitles[i]) featureTitles[i].textContent = item[0];
      if (featureBodies[i]) featureBodies[i].textContent = item[1];
    });

    const faqQuestions = document.querySelectorAll(".faq-item .faq-toggle span:first-child");
    const faqAnswers = document.querySelectorAll(".faq-item > p");
    const arFaq = [
      ["ما هو Research Copilot؟", "مساعد ذكي للتخطيط البحثي، دعم الواجبات، وإنجاز مهام الكتابة."],
      ["هل يمكنني استخدامه للواجبات والمقالات؟", "نعم. يمكنك التخطيط والكتابة وإعادة الصياغة والتحسين من مكان واحد."],
      ["هل يقلل Humanizer Pro من إشارات النمط الآلي؟", "يعيد صياغة اللغة والإيقاع لتبدو النتيجة أكاديمية وأكثر طبيعية."],
      ["ما الأدوات المتاحة داخل الحساب الواحد؟", "تحصل على Humanizer Pro وResearch Copilot وEssay Architect وLecture Notes AI وAuthenticity Report وSmart Editor."],
      ["كيف تعمل الاعتمادات الشهرية؟", "كل طلب يستهلك رصيدًا بحسب حجم المخرجات، وحدود خطتك تحدد السقف الشهري."],
      ["هل يمكنني ترقية أو تخفيض الخطة في أي وقت؟", "نعم، يمكنك تعديل الخطة حسب احتياجك من إعدادات الحساب."]
    ];
    const enFaq = [
      ["What is Research Copilot?", "An AI assistant for research planning, homework support, and writing tasks."],
      ["Can I use this for assignments and essays?", "Yes. You can plan, draft, humanize, and polish your work inside one workspace."],
      ["Does Humanizer Pro reduce AI-pattern signals?", "It rewrites phrasing and rhythm for more natural academic output."],
      ["Which tools are included in one account?", "You get Humanizer Pro, Research Copilot, Essay Architect, Lecture Notes AI, Authenticity Report, and Smart Editor."],
      ["How do monthly credits work?", "Each request consumes credits based on output size. Your plan defines your monthly credit ceiling."],
      ["Can I upgrade or downgrade my plan anytime?", "Yes, you can change your plan anytime from account settings."]
    ];
    const faqPack = lang === "ar" ? arFaq : enFaq;
    faqPack.forEach((item, i) => {
      if (faqQuestions[i]) faqQuestions[i].textContent = item[0];
      if (faqAnswers[i]) faqAnswers[i].textContent = item[1];
    });

    setText(".footer-columns div:nth-child(1) h4", t("footer_products", lang));
    setText(".footer-columns div:nth-child(2) h4", t("footer_company", lang));
    setText(".footer-columns div:nth-child(3) h4", t("footer_resources", lang));
    setText(".footer-columns div:nth-child(4) h4", t("footer_legals", lang));

    setText('.footer-columns a[href="index.html#pricing"]', lang === "ar" ? "الأسعار والباقات" : "Pricing & Plans");
    setText('.footer-columns a[href="affiliate-program.html"]', lang === "ar" ? "برنامج الشركاء" : "Affiliate program");
    setText('.footer-columns a[href="api.html"]', "API");
    setText('.footer-columns a[href="index.html#about"]', lang === "ar" ? "عن المنصة" : "About us");
    setText('.footer-columns a[href="blog.html"]', lang === "ar" ? "المدونة" : "Blog");
    setText('.footer-columns a[href="careers.html"]', lang === "ar" ? "الوظائف" : "Careers");
    setText('.footer-columns a[href="changelog.html"]', lang === "ar" ? "سجل التحديثات" : "Changelog");
    setText('.footer-columns a[href="mailto:support@beststudenthumanizer.ai"]', lang === "ar" ? "تواصل عبر البريد" : "Email us");
    setText('.footer-columns a[href="tools.html?tool=chat"]', lang === "ar" ? "دردشة مباشرة" : "Live Chat");
    setText('.footer-columns a[href="terms.html"]', lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions");
    setText('.footer-columns a[href="privacy.html"]', lang === "ar" ? "سياسة الخصوصية" : "Privacy policy");
    setText('.footer-columns a[href="cookies.html"]', lang === "ar" ? "سياسة ملفات الارتباط" : "Cookie policy");
    setText('.footer-columns a[href="affiliate-policy.html"]', lang === "ar" ? "سياسة الشركاء" : "Affiliate policy");
  };

  const applyAuth = (lang) => {
    document.title = t("auth_title_page", lang);
    setBackLabel(".back-link", t("back_to_site", lang), lang);
    setText(".auth-card h1", t("auth_title", lang));

    const tabs = document.querySelectorAll(".auth-tabs button");
    if (tabs[0]) tabs[0].textContent = t("auth_login", lang);
    if (tabs[1]) tabs[1].textContent = t("auth_signup", lang);

    const signinLabels = document.querySelectorAll("#signinForm label");
    if (signinLabels[0]) signinLabels[0].childNodes[0].textContent = t("auth_email", lang);
    if (signinLabels[1]) signinLabels[1].childNodes[0].textContent = t("auth_password", lang);
    setPlaceholder("signinEmail", lang === "ar" ? "you@example.com" : "you@example.com");
    setPlaceholder("signinPassword", lang === "ar" ? "كلمة المرور" : "Your password");
    setHtml("#signinForm .switch-copy", `${t("auth_forgot", lang)} <button type="button" class="text-btn" data-go="forgot">${t("auth_reset_it", lang)}</button>`);
    setText("#signinForm .primary-btn", t("auth_continue", lang));

    const forgotLabels = document.querySelectorAll("#forgotForm label");
    if (forgotLabels[0]) forgotLabels[0].childNodes[0].textContent = t("auth_email", lang);
    if (forgotLabels[1]) forgotLabels[1].childNodes[0].textContent = lang === "ar" ? "رمز التحقق" : "Verification Code";
    if (forgotLabels[2]) forgotLabels[2].childNodes[0].textContent = lang === "ar" ? "كلمة المرور الجديدة" : "New Password";
    if (forgotLabels[3]) forgotLabels[3].childNodes[0].textContent = lang === "ar" ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password";
    setPlaceholder("forgotCode", lang === "ar" ? "أدخل الرمز المكوّن من 6 أرقام" : "Enter 6-digit code");
    setPlaceholder("forgotPassword", lang === "ar" ? "على الأقل 8 أحرف" : "At least 8 characters");
    setPlaceholder("forgotConfirmPassword", lang === "ar" ? "أعد كتابة كلمة المرور" : "Repeat new password");
    setText("#sendResetCodeBtn", t("auth_send_code", lang));
    setText("#forgotForm .primary-btn", t("auth_reset_password", lang));
    setHtml("#forgotForm .switch-copy", `${t("auth_remembered", lang)} <button type="button" class="text-btn" data-go="signin">${t("auth_log_in", lang)}</button>`);

    const signupLabels = document.querySelectorAll("#signupForm label");
    if (signupLabels[0]) signupLabels[0].childNodes[0].textContent = t("auth_full_name", lang);
    if (signupLabels[1]) signupLabels[1].childNodes[0].textContent = t("auth_email", lang);
    if (signupLabels[2]) signupLabels[2].childNodes[0].textContent = t("auth_password", lang);
    if (signupLabels[3]) signupLabels[3].childNodes[0].textContent = t("auth_confirm_password", lang);
    if (signupLabels[4]) signupLabels[4].childNodes[0].textContent = t("auth_source", lang);
    setPlaceholder("signupName", lang === "ar" ? "مثال: أحمد خالد" : "e.g., Mark Rossi");
    setPlaceholder("signupEmail", lang === "ar" ? "name@email.com" : "name@email.com");
    setPlaceholder("signupPassword", lang === "ar" ? "على الأقل 8 أحرف" : "At least 8 characters");
    setPlaceholder("signupConfirmPassword", lang === "ar" ? "أعد كتابة كلمة المرور" : "Repeat password");
    setSelectOptions("signupSource", {
      "": lang === "ar" ? "اختر القناة" : "Select channel",
      google_search: lang === "ar" ? "بحث Google" : "Google Search",
      youtube: lang === "ar" ? "يوتيوب" : "YouTube",
      instagram: lang === "ar" ? "إنستغرام" : "Instagram",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      x_twitter: lang === "ar" ? "إكس (تويتر)" : "X (Twitter)",
      facebook: "Facebook",
      reddit: "Reddit",
      friend_family: lang === "ar" ? "صديق أو عائلة" : "Friend or family",
      blog_article: lang === "ar" ? "مقال أو مدونة" : "Blog / Article",
      community_group: lang === "ar" ? "مجموعة مجتمع" : "Community Group",
      other: lang === "ar" ? "أخرى" : "Other"
    });

    setHtml("#signupForm .check-row:nth-of-type(1) span", `${lang === "ar" ? "أوافق على <a href=\"terms.html\">شروط الاستخدام</a>" : "I agree to the <a href=\"terms.html\">User Terms</a>"}`);
    setText("#signupForm .check-row:nth-of-type(2) span", t("auth_updates", lang));
    setText("#signupForm .primary-btn", t("auth_create_cta", lang));
    setHtml("#signupForm .switch-copy", `${t("auth_already", lang)} <button type="button" class="text-btn" data-go="signin">${t("auth_log_in", lang)}</button>`);
    setText(".divider span", t("auth_or_continue", lang));
    setText(".google-btn", t("auth_google", lang));
  };

  const applyTools = (lang) => {
    document.title = t("tools_title_page", lang);
    setBackLabel(".back-link", t("back_short", lang), lang);
    setText(".tools-header h1", t("tools_workspace_h1", lang));
    setById("logoutBtn", t("logout", lang));

    setText("#toolTabs .tool-tab-group:nth-child(1) > p", t("tools_group_core", lang));
    setText("#toolTabs .tool-tab-group:nth-child(2) > p", t("tools_group_adv", lang));
    setText("#toolTabs .tool-tab-group:nth-child(3) > p", t("tools_group_review", lang));

    const tabMap = {
      fusion: lang === "ar" ? "دمج البحث الذكي" : "Research Fusion",
      humanizer: lang === "ar" ? "مُحسّن النصوص" : "Humanizer Pro",
      chat: lang === "ar" ? "مساعد البحث" : "Research Copilot",
      essay: lang === "ar" ? "مهندس المقال" : "Essay Architect",
      note: lang === "ar" ? "ملاحظات المحاضرات" : "Lecture Notes AI",
      report: lang === "ar" ? "تقرير الأصالة" : "Authenticity Report",
      editor: lang === "ar" ? "المحرر الذكي" : "Smart Editor",
      citation: lang === "ar" ? "وكيل التوثيق" : "Citation Agent",
      plagiarism: lang === "ar" ? "فاحص الانتحال" : "Plagiarism Checker",
      methodology: lang === "ar" ? "بناء المنهجية" : "Methodology Builder",
      paraphrase: lang === "ar" ? "إعادة الصياغة حسب المستوى" : "Paraphrase by Level",
      thesis: lang === "ar" ? "مولد الأطروحة" : "Thesis Generator",
      outline: lang === "ar" ? "من مخطط إلى مسودة" : "Outline to Draft",
      file: lang === "ar" ? "محلل PDF/Doc" : "PDF/Doc Analyzer",
      heatmap: lang === "ar" ? "خريطة الأسلوب" : "Style Heatmap",
      readiness: lang === "ar" ? "جاهزية التسليم" : "Submission Readiness"
    };
    document.querySelectorAll("#toolTabs button[data-tool]").forEach((btn) => {
      const key = btn.dataset.tool || "";
      if (tabMap[key]) btn.textContent = tabMap[key];
    });

    setText("#tool-fusion > h2", t("tools_fusion_title", lang));
    setText(".fusion-compact-title", t("tools_fusion_hint_title", lang));
    setText(".fusion-compact-proof", t("tools_fusion_hint_proof", lang));
    setText(".fusion-intake-title", t("tools_fusion_intake_title", lang));
    setText('label[for="fusionProblem"]', t("tools_fusion_problem", lang));
    setText('label[for="fusionObjective"]', t("tools_fusion_objective", lang));
    setText('label[for="fusionRQ"]', t("tools_fusion_rq", lang));
    setText('label[for="fusionContext"]', t("tools_fusion_context", lang));
    setText('label[for="fusionMethodPreference"]', t("tools_fusion_method", lang));
    setText('label[for="fusionConstraints"]', t("tools_fusion_constraints", lang));

    const fusionLabels = document.querySelectorAll("#tool-fusion .fusion-q");
    if (fusionLabels[0]) fusionLabels[0].childNodes[0].textContent = t("tools_fusion_problem", lang);
    if (fusionLabels[1]) fusionLabels[1].childNodes[0].textContent = t("tools_fusion_objective", lang);
    if (fusionLabels[2]) fusionLabels[2].childNodes[0].textContent = t("tools_fusion_rq", lang);
    if (fusionLabels[3]) fusionLabels[3].childNodes[0].textContent = t("tools_fusion_context", lang);
    if (fusionLabels[4]) fusionLabels[4].childNodes[0].textContent = t("tools_fusion_method", lang);
    if (fusionLabels[5]) fusionLabels[5].childNodes[0].textContent = t("tools_fusion_constraints", lang);

    setPlaceholder("fusionProblem", lang === "ar" ? "ما المشكلة الدقيقة التي يعالجها البحث؟" : "What exact problem should this study solve?");
    setPlaceholder("fusionObjective", lang === "ar" ? "ما القيمة العلمية التي سيضيفها البحث؟" : "What is the core contribution?");
    setPlaceholder("fusionRQ", lang === "ar" ? "اكتب سؤال بحث واضحًا أو فرضية واحدة." : "State one clear research question/hypothesis.");
    setPlaceholder("fusionContext", lang === "ar" ? "من هو مجتمع الدراسة؟ وفي أي سياق؟" : "Who/where is being studied? (sector, country, group)");
    setPlaceholder("fusionConstraints", lang === "ar" ? "مثال: 2500 كلمة، مستوى بكالوريوس، بدون جمع بيانات ميدانية." : "Example: 2500 words, undergraduate level, no primary data collection.");
    setPlaceholder("fusionTitle", lang === "ar" ? "عنوان البحث" : "Research title");

    setSelectOptions("fusionDomain", {
      general: lang === "ar" ? "عام" : "General",
      business: lang === "ar" ? "إدارة أعمال" : "Business",
      education: lang === "ar" ? "تعليم" : "Education",
      healthcare: lang === "ar" ? "صحة" : "Healthcare",
      technology: lang === "ar" ? "تقنية" : "Technology"
    });
    setSelectOptions("fusionTone", {
      academic: lang === "ar" ? "نبرة أكاديمية" : "Academic tone",
      persuasive: lang === "ar" ? "نبرة إقناعية" : "Persuasive tone",
      simple: lang === "ar" ? "نبرة بسيطة" : "Simple tone"
    });
    setSelectOptions("fusionCitationStyle", {
      APA: lang === "ar" ? "توثيق APA" : "APA citations",
      MLA: lang === "ar" ? "توثيق MLA" : "MLA citations",
      Harvard: lang === "ar" ? "توثيق Harvard" : "Harvard citations"
    });
    setSelectOptions("fusionAccuracy", {
      high: lang === "ar" ? "دقة عالية" : "High accuracy",
      balanced: lang === "ar" ? "توازن" : "Balanced"
    });
    setSelectOptions("fusionMethodPreference", {
      auto: lang === "ar" ? "اختيار تلقائي بالذكاء الاصطناعي" : "Auto by AI (based on title + RQ)",
      quantitative: lang === "ar" ? "كمّي" : "Quantitative",
      qualitative: lang === "ar" ? "نوعي" : "Qualitative",
      mixed: lang === "ar" ? "منهج مختلط" : "Mixed methods",
      experimental: lang === "ar" ? "تجريبي" : "Experimental",
      "case-study": lang === "ar" ? "دراسة حالة" : "Case study",
      "systematic-review": lang === "ar" ? "مراجعة منهجية" : "Systematic review"
    });

    setById("fusionGenerateBtn", t("tools_fusion_generate", lang));
    setById("fusionClearBtn", t("tools_fusion_clear", lang));
    setById("fusionCopyBtn", t("tools_fusion_copy", lang));
    setById("fusionDownloadWordBtn", t("tools_download_word", lang));
    setById("fusionDownloadPdfBtn", t("tools_download_pdf", lang));

    const fusionLabelsBlock = document.querySelectorAll("#tool-fusion .block-label");
    if (fusionLabelsBlock[0]) fusionLabelsBlock[0].textContent = t("tools_fusion_console", lang);
    if (fusionLabelsBlock[1]) fusionLabelsBlock[1].textContent = t("tools_fusion_final", lang);
    if (fusionLabelsBlock[2]) fusionLabelsBlock[2].textContent = t("tools_fusion_bundle", lang);

    const panelTitles = {
      humanizer: lang === "ar" ? "مُحسّن النصوص" : "Humanizer Pro",
      chat: lang === "ar" ? "مساعد البحث" : "Research Copilot",
      essay: lang === "ar" ? "مهندس المقال" : "Essay Architect",
      note: lang === "ar" ? "ملاحظات المحاضرات" : "Lecture Notes AI",
      report: lang === "ar" ? "تقرير الأصالة" : "Authenticity Report",
      editor: lang === "ar" ? "المحرر الذكي" : "Smart Editor",
      citation: lang === "ar" ? "وكيل التوثيق" : "Citation Agent",
      plagiarism: lang === "ar" ? "فاحص مخاطر الانتحال" : "Plagiarism Risk Checker",
      methodology: lang === "ar" ? "منشئ منهجية البحث" : "Research Methodology Builder",
      paraphrase: lang === "ar" ? "إعادة الصياغة حسب المستوى" : "Paraphrase by Level",
      thesis: lang === "ar" ? "مولد جملة الأطروحة" : "Thesis Statement Generator",
      outline: lang === "ar" ? "من مخطط إلى مسودة" : "Outline to Draft",
      file: lang === "ar" ? "محلل PDF/Doc" : "PDF/Doc Analyzer",
      heatmap: lang === "ar" ? "خريطة النحو والأسلوب" : "Grammar & Style Heatmap",
      readiness: lang === "ar" ? "مؤشر جاهزية التسليم" : "Submission Readiness Score"
    };
    Object.entries(panelTitles).forEach(([key, value]) => {
      setText(`#tool-${key} > h2`, value);
    });

    const introTexts = {
      humanizer: lang === "ar" ? "حوّل النص المشابه للذكاء الاصطناعي إلى كتابة أكاديمية طبيعية مع الحفاظ على المعنى." : "Turn AI-like writing into natural academic text while preserving your meaning.",
      chat: lang === "ar" ? "اطرح أسئلة البحث والواجبات واحصل على إرشاد عملي منظم." : "Ask research and assignment questions and get structured, practical guidance.",
      essay: lang === "ar" ? "أنشئ مسودة مرتبة وواضحة بصياغة أكاديمية خلال ثوانٍ." : "Generate a clean, well-structured draft with academic flow in seconds.",
      note: lang === "ar" ? "حوّل المحاضرات الطويلة إلى ملاحظات مختصرة للمراجعة السريعة." : "Convert long lectures or transcripts into concise notes for faster revision.",
      report: lang === "ar" ? "افحص أنماط الكتابة واحصل على تقدير سريع للأصالة مع توجيهات عملية." : "Screen writing patterns and get a quick authenticity estimate with guidance.",
      editor: lang === "ar" ? "حسّن القواعد والوضوح وتدفق النص مع الحفاظ على الفكرة الأصلية." : "Improve grammar, clarity, and flow while preserving your original intent.",
      citation: lang === "ar" ? "أنشئ المراجع والتوثيق داخل النص بضغطة واحدة." : "Generate references and in-text citation structure in one click.",
      plagiarism: lang === "ar" ? "احصل على تقدير عملي لمخاطر التشابه مع إرشادات إعادة الصياغة." : "Get a practical overlap-risk estimate and rewrite guidance.",
      methodology: lang === "ar" ? "ابنِ أساس منهجية البحث: المتغيرات، العينة، وآلية التحليل." : "Build methodology foundations: constructs, method, sample, and analysis plan.",
      paraphrase: lang === "ar" ? "أعد صياغة النص حسب المستوى الأكاديمي مع الحفاظ على المعنى." : "Rewrite text according to academic level while preserving core meaning.",
      thesis: lang === "ar" ? "أنشئ خيارات قوية للأطروحة واختر الأنسب." : "Create strong thesis options and select a final recommended thesis.",
      outline: lang === "ar" ? "حوّل المخططات النقطية إلى فقرات مترابطة بسلاسة." : "Turn bullet outlines into coherent draft sections with clean transitions.",
      file: lang === "ar" ? "حلّل محتوى المستند المستخرج إلى نقاط رئيسية وخطة عمل." : "Analyze pasted document content into key points, summary, and actions.",
      heatmap: lang === "ar" ? "احصل على خريطة تشخيصية لنقاط الضعف في اللغة والأسلوب." : "Get a diagnostic map of grammar, clarity, and flow weaknesses.",
      readiness: lang === "ar" ? "احصل على تقييم جاهزية نهائي مع أولويات التحسين قبل التسليم." : "Get final readiness scoring before submission with prioritized fixes."
    };
    Object.entries(introTexts).forEach(([key, value]) => {
      setText(`#tool-${key} .tool-intro p`, value);
    });

    const actionButtons = {
      humanizerTemplateBtn: lang === "ar" ? "تطبيق القالب" : "Apply Preset",
      humanizerClearBtn: lang === "ar" ? "مسح" : "Clear",
      humanizeBtn: lang === "ar" ? "تحسين النص الآن" : "Humanize Now",
      humanizerCopyBtn: lang === "ar" ? "نسخ" : "Copy",
      humanizerDownloadWordBtn: t("tools_download_word", lang),
      humanizerDownloadPdfBtn: t("tools_download_pdf", lang),
      chatTemplateBtn: lang === "ar" ? "استخدم السيناريو" : "Use Starter",
      chatClearBtn: lang === "ar" ? "إعادة ضبط المحادثة" : "Reset Chat",
      chatCopyBtn: lang === "ar" ? "نسخ المحادثة" : "Copy Conversation",
      chatDownloadWordBtn: t("tools_download_word", lang),
      chatDownloadPdfBtn: t("tools_download_pdf", lang),
      essayGenerateBtn: lang === "ar" ? "إنشاء المقال" : "Build Essay",
      essayClearBtn: lang === "ar" ? "مسح" : "Clear",
      essayCopyBtn: lang === "ar" ? "نسخ" : "Copy",
      essayDownloadWordBtn: t("tools_download_word", lang),
      essayDownloadPdfBtn: t("tools_download_pdf", lang),
      noteTemplateBtn: lang === "ar" ? "تطبيق القالب" : "Apply Preset",
      noteClearBtn: lang === "ar" ? "مسح" : "Clear",
      noteProcessBtn: lang === "ar" ? "إنشاء الملاحظات" : "Generate Notes",
      noteCopyBtn: lang === "ar" ? "نسخ" : "Copy",
      noteDownloadWordBtn: t("tools_download_word", lang),
      noteDownloadPdfBtn: t("tools_download_pdf", lang),
      reportTemplateBtn: lang === "ar" ? "تطبيق القالب" : "Apply Preset",
      reportClearBtn: lang === "ar" ? "مسح" : "Clear",
      reportAnalyzeBtn: lang === "ar" ? "تشغيل التحليل" : "Run Analysis",
      reportCopyBtn: lang === "ar" ? "نسخ الملخص" : "Copy Summary",
      reportDownloadWordBtn: t("tools_download_word", lang),
      reportDownloadPdfBtn: t("tools_download_pdf", lang),
      editorFixBtn: lang === "ar" ? "تنقيح النص" : "Refine Text",
      editorClearBtn: lang === "ar" ? "مسح" : "Clear",
      editorCopyBtn: lang === "ar" ? "نسخ" : "Copy",
      editorDownloadWordBtn: t("tools_download_word", lang),
      editorDownloadPdfBtn: t("tools_download_pdf", lang)
    };
    Object.entries(actionButtons).forEach(([id, label]) => {
      setById(id, label);
    });

    setPlaceholder("humanizerInput", lang === "ar" ? "الصق النص الذي تريد تحسينه..." : "Paste text to transform...");
    setPlaceholder("humanizerOutput", lang === "ar" ? "ستظهر النسخة المحسنة هنا..." : "Your refined text appears here...");
    setPlaceholder("chatInput", lang === "ar" ? "اكتب سؤالك البحثي..." : "Ask your research question...");
    setPlaceholder("essayTopic", lang === "ar" ? "أدخل موضوع المقال" : "Enter essay topic");
    setPlaceholder("essayOutput", lang === "ar" ? "ستظهر مسودة المقال هنا..." : "Your essay draft appears here...");
    setPlaceholder("noteInput", lang === "ar" ? "الصق محتوى المحاضرة أو النص الخام..." : "Paste lecture content, transcript, or rough notes...");
    setPlaceholder("noteOutput", lang === "ar" ? "ستظهر الملاحظات المنظمة هنا..." : "Structured revision notes appear here...");
    setPlaceholder("reportInput", lang === "ar" ? "الصق النص لفحص الأصالة..." : "Paste text for authenticity screening...");
    setPlaceholder("editorInput", lang === "ar" ? "الصق النص لتحسين الصياغة..." : "Paste text to refine grammar and flow...");
    setPlaceholder("editorOutput", lang === "ar" ? "ستظهر النسخة المحسنة هنا..." : "Your improved version appears here...");

    setSelectOptions("humanizerMode", {
      academic: lang === "ar" ? "أكاديمي" : "Academic",
      natural: lang === "ar" ? "طبيعي" : "Natural",
      simple: lang === "ar" ? "مبسّط" : "Simple",
      formal: lang === "ar" ? "رسمي" : "Formal"
    });
    setSelectOptions("humanizerStrength", {
      light: lang === "ar" ? "خفيف" : "Light",
      medium: lang === "ar" ? "متوسط" : "Medium",
      strong: lang === "ar" ? "قوي" : "Strong"
    });
    setSelectOptions("essayTone", {
      academic: lang === "ar" ? "أكاديمي" : "Academic",
      simple: lang === "ar" ? "مبسّط" : "Simple",
      persuasive: lang === "ar" ? "إقناعي" : "Persuasive"
    });
    setSelectOptions("editorMode", {
      academic: lang === "ar" ? "أكاديمي" : "Academic",
      professional: lang === "ar" ? "احترافي" : "Professional",
      simple: lang === "ar" ? "مبسّط" : "Simple"
    });
    setSelectOptions("editorStrength", {
      light: lang === "ar" ? "خفيف" : "Light",
      medium: lang === "ar" ? "متوسط" : "Medium",
      strong: lang === "ar" ? "قوي" : "Strong"
    });

    const blockMap = {
      Input: lang === "ar" ? "الإدخال" : "Input",
      Output: lang === "ar" ? "الناتج" : "Output",
      Settings: lang === "ar" ? "الإعدادات" : "Settings",
      Conversation: lang === "ar" ? "المحادثة" : "Conversation",
      "Your Message": lang === "ar" ? "رسالتك" : "Your Message",
      Analysis: lang === "ar" ? "التحليل" : "Analysis"
    };
    document.querySelectorAll(".block-label").forEach((el) => {
      if (!el.dataset.baseLabel) {
        el.dataset.baseLabel = (el.textContent || "").trim();
      }
      const base = el.dataset.baseLabel || "";
      el.textContent = blockMap[base] || base;
    });

    document.querySelectorAll(".history-wrap h3").forEach((el) => {
      el.textContent = t("tools_history", lang);
    });
    document.querySelectorAll(".diff-wrap h3").forEach((el) => {
      el.textContent = t("tools_compare", lang);
    });

    setText("#humanizerHistory", t("tools_no_history", lang));
    setText("#essayHistory", t("tools_no_history", lang));
    setText("#noteHistory", t("tools_no_history", lang));
    setText("#reportHistory", lang === "ar" ? "لا توجد تقارير بعد." : "No reports yet.");
    setText("#editorHistory", t("tools_no_history", lang));
    setText("#citationHistory", t("tools_no_history", lang));
    setText("#plagiarismHistory", t("tools_no_history", lang));
    setText("#methodologyHistory", t("tools_no_history", lang));
    setText("#paraphraseHistory", t("tools_no_history", lang));
    setText("#thesisHistory", t("tools_no_history", lang));
    setText("#outlineHistory", t("tools_no_history", lang));
    setText("#fileHistory", t("tools_no_history", lang));
    setText("#heatmapHistory", t("tools_no_history", lang));
    setText("#readinessHistory", t("tools_no_history", lang));

    setText("#humanizerDiff", t("tools_no_compare", lang));
    setText("#editorDiff", t("tools_no_compare", lang));
    setById("chatSendBtn", t("send", lang));
  };

  const applyDashboard = (lang) => {
    document.title = t("dashboard_title_page", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const v = tr[lang][key];
      if (v) el.textContent = v;
    });
    setText(".dash-link", t("dash_back", lang));
    setText("#accountPanelTitle", lang === "ar" ? "الحساب والخصوصية" : "Account & Privacy");
    setText(
      "#accountPanelHint",
      lang === "ar"
        ? "نزّل نسخة من بياناتك أو احذف حسابك بشكل نهائي."
        : "Export your data or permanently delete your account."
    );
    setText("#exportDataBtn", lang === "ar" ? "تصدير بياناتي" : "Export My Data");
    setText("#deleteAccountBtn", lang === "ar" ? "حذف الحساب" : "Delete Account");
  };

  const applyLang = (lang) => {
    applyDir(lang);
    if (document.querySelector(".hero-shell")) applyIndex(lang);
    if (document.querySelector(".auth-page")) applyAuth(lang);
    if (document.querySelector(".tools-page")) applyTools(lang);
    if (document.querySelector(".dashboard-page")) applyDashboard(lang);
    document.dispatchEvent(new CustomEvent("bsh:languageChanged", { detail: { lang } }));
  };

  const setLang = (lang) => {
    const next = lang === "ar" ? "ar" : "en";
    localStorage.setItem(LANG_KEY, next);
    applyLang(next);
  };

  const mountToggle = () => {
    if (document.getElementById("langToggle")) return;

    const btn = document.createElement("button");
    btn.id = "langToggle";
    btn.type = "button";
    btn.className = "theme-toggle lang-toggle";

    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn && themeBtn.classList.contains("theme-toggle-inline")) {
      btn.className = "theme-toggle-inline lang-toggle-inline";
      themeBtn.insertAdjacentElement("beforebegin", btn);
    } else {
      document.body.appendChild(btn);
    }

    const syncBtn = () => {
      const lang = getLang();
      const next = lang === "ar" ? "EN" : "AR";
      btn.textContent = next;
      btn.setAttribute("aria-label", t("language_toggle_aria", lang));
    };

    btn.addEventListener("click", () => {
      const lang = getLang();
      setLang(lang === "ar" ? "en" : "ar");
    });

    syncBtn();
    document.addEventListener("bsh:languageChanged", syncBtn);
  };

  window.BSHI18N = {
    getLang,
    setLang,
    t,
    applyLangCurrent: () => applyLang(getLang())
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      mountToggle();
      applyLang(getLang());
    });
  } else {
    mountToggle();
    applyLang(getLang());
  }
})();
