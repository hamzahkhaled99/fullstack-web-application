(() => {
  const core = window.BSHCore;
  const i18n = window.BSHI18N;

  if (!core) return;

  const authPage = document.querySelector(".auth-page");
  if (authPage) {
    Array.from(authPage.childNodes).forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const raw = String(node.textContent || "");
      if (!raw.trim() || /`r`n|`n|`r/i.test(raw)) {
        node.remove();
      }
    });
  }

  const tabs = document.querySelectorAll(".auth-tabs button");
  const signinForm = document.getElementById("signinForm");
  const signupForm = document.getElementById("signupForm");
  const forgotForm = document.getElementById("forgotForm");
  const authMessage = document.getElementById("authMessage");
  const googleBtn = document.querySelector(".google-btn");
  const sendResetCodeBtn = document.getElementById("sendResetCodeBtn");
  const getLang = () => (i18n && typeof i18n.getLang === "function" ? i18n.getLang() : "en");
  const msg = (key) => {
    const lang = getLang();
    const dict = {
      invalid_credentials: {
        en: "Invalid credentials. Please check your email and password.",
        ar: "بيانات الدخول غير صحيحة. تأكد من البريد الإلكتروني وكلمة المرور."
      },
      welcome_redirect: {
        en: "Welcome {{name}}. Redirecting to dashboard...",
        ar: "أهلًا {{name}}. يتم تحويلك إلى لوحة التحكم..."
      },
      fill_required: {
        en: "Please complete all required fields.",
        ar: "يرجى تعبئة جميع الحقول المطلوبة."
      },
      pass_len: {
        en: "Password must be at least 8 characters.",
        ar: "كلمة المرور يجب أن تكون 8 أحرف على الأقل."
      },
      pass_mismatch: {
        en: "Passwords do not match.",
        ar: "كلمتا المرور غير متطابقتين."
      },
      accept_terms: {
        en: "You need to accept the user terms.",
        ar: "يجب الموافقة على شروط الاستخدام أولًا."
      },
      email_exists: {
        en: "This email already exists. Please log in.",
        ar: "هذا البريد مسجّل مسبقًا. يرجى تسجيل الدخول."
      },
      account_created: {
        en: "Account created successfully. Redirecting to dashboard...",
        ar: "تم إنشاء الحساب بنجاح. جارٍ التحويل إلى لوحة التحكم..."
      },
      invalid_code: {
        en: "Invalid or expired code. Please request a new code.",
        ar: "رمز التحقق غير صحيح أو منتهي. اطلب رمزًا جديدًا."
      },
      pass_updated: {
        en: "Password updated. You can log in now.",
        ar: "تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن."
      },
      enter_email: {
        en: "Enter your email first.",
        ar: "أدخل بريدك الإلكتروني أولًا."
      },
      email_not_config: {
        en: "Email service is not configured yet. Set RESEND_API_KEY and RESEND_FROM_EMAIL.",
        ar: "خدمة البريد غير مفعّلة بعد. اضبط RESEND_API_KEY و RESEND_FROM_EMAIL."
      },
      email_rejected: {
        en: "Email sender was rejected. Use a verified sender/domain in Resend settings.",
        ar: "تم رفض مرسل البريد. استخدم نطاقًا أو مرسلًا موثقًا في إعدادات Resend."
      },
      email_fail: {
        en: "Could not send verification code right now. Please try again.",
        ar: "تعذّر إرسال رمز التحقق الآن. حاول مرة أخرى."
      },
      email_sent: {
        en: "Verification code sent to your email.",
        ar: "تم إرسال رمز التحقق إلى بريدك الإلكتروني."
      }
    };
    const template = dict[key]?.[lang] || dict[key]?.en || "";
    return template;
  };

  const showMessage = (text, type = "") => {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.classList.remove("error", "success");
    if (type) authMessage.classList.add(type);
  };

  const setTab = (tab) => {
    tabs.forEach((btn) => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    if (signinForm) signinForm.classList.toggle("active", tab === "signin");
    if (signupForm) signupForm.classList.toggle("active", tab === "signup");
    if (forgotForm) forgotForm.classList.toggle("active", tab === "forgot");
  };

  tabs.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab || "signin"));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest("[data-go]");
    if (!trigger) return;
    const go = trigger.getAttribute("data-go");
    if (go === "signin") setTab("signin");
    if (go === "forgot") setTab("forgot");
  });

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const requestedPlan = params.get("plan");
  const selectedPlan = core.PLAN_CONFIG && core.PLAN_CONFIG[requestedPlan] ? requestedPlan : "Free";
  setTab(mode === "signup" ? "signup" : mode === "forgot" ? "forgot" : "signin");

  if (signinForm) {
    signinForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = (document.getElementById("signinEmail")?.value || "").trim().toLowerCase();
      const password = (document.getElementById("signinPassword")?.value || "").trim();

      const result = core.signIn(email, password);
      if (!result.ok) {
        showMessage(msg("invalid_credentials"), "error");
        return;
      }

      showMessage(msg("welcome_redirect").replace("{{name}}", result.user.name), "success");
      window.setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = (document.getElementById("signupName")?.value || "").trim();
      const email = (document.getElementById("signupEmail")?.value || "").trim().toLowerCase();
      const password = (document.getElementById("signupPassword")?.value || "").trim();
      const confirmPassword = (document.getElementById("signupConfirmPassword")?.value || "").trim();
      const source = (document.getElementById("signupSource")?.value || "").trim();
      const acceptedTerms = Boolean(document.getElementById("signupTerms")?.checked);

      if (!name || !email || !password || !confirmPassword || !source) {
        showMessage(msg("fill_required"), "error");
        return;
      }

      if (password.length < 8) {
        showMessage(msg("pass_len"), "error");
        return;
      }

      if (password !== confirmPassword) {
        showMessage(msg("pass_mismatch"), "error");
        return;
      }

      if (!acceptedTerms) {
        showMessage(msg("accept_terms"), "error");
        return;
      }

      const created = core.signUp({ name, email, password, source, plan: selectedPlan });
      if (!created.ok) {
        showMessage(msg("email_exists"), "error");
        setTab("signin");
        return;
      }

      showMessage(msg("account_created"), "success");
      window.setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = (document.getElementById("forgotEmail")?.value || "").trim().toLowerCase();
      const code = (document.getElementById("forgotCode")?.value || "").trim();
      const password = (document.getElementById("forgotPassword")?.value || "").trim();
      const confirmPassword = (document.getElementById("forgotConfirmPassword")?.value || "").trim();

      if (!email || !code || !password || !confirmPassword) {
        showMessage(msg("fill_required"), "error");
        return;
      }

      if (password.length < 8) {
        showMessage(msg("pass_len"), "error");
        return;
      }

      if (password !== confirmPassword) {
        showMessage(msg("pass_mismatch"), "error");
        return;
      }

      const reset = core.resetPassword(email, code, password);
      if (!reset.ok) {
        showMessage(msg("invalid_code"), "error");
        return;
      }

      showMessage(msg("pass_updated"), "success");
      setTab("signin");
    });
  }

  if (sendResetCodeBtn) {
    sendResetCodeBtn.addEventListener("click", () => {
      const email = (document.getElementById("forgotEmail")?.value || "").trim().toLowerCase();
      if (!email) {
        showMessage(msg("enter_email"), "error");
        return;
      }
      const requested = core.requestPasswordReset(email);
      if (!requested.ok) {
        if (requested.error === "email_service_not_configured") {
          showMessage(msg("email_not_config"), "error");
        } else if (requested.error === "email_send_failed") {
          showMessage(msg("email_rejected"), "error");
        } else {
          showMessage(msg("email_fail"), "error");
        }
        return;
      }
      showMessage(msg("email_sent"), "success");
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      window.location.href = "https://accounts.google.com/signin";
    });
  }

  document.addEventListener("bsh:languageChanged", () => {
    if (!i18n) return;
    // Placeholder for localized auth messages if needed later.
  });
})();
