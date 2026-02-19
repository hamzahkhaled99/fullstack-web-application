(() => {
  const core = window.BSHCore;
  if (!core) return;

  const session = core.getSession();
  const user = core.getCurrentUser();
  if (!session || !user) {
    window.location.href = "auth.html?mode=signin";
    return;
  }

  const planEl = document.getElementById("dashPlan");
  const creditsEl = document.getElementById("dashCredits");
  const usedEl = document.getElementById("dashUsed");
  const remainingEl = document.getElementById("dashRemaining");
  const usageList = document.getElementById("toolUsageList");
  const logoutBtn = document.getElementById("dashLogoutBtn");
  const historyConsent = document.getElementById("historyConsent");
  const onboardingPanel = document.getElementById("onboardingPanel");
  const onboardingClose = document.getElementById("onboardingClose");
  const exportDataBtn = document.getElementById("exportDataBtn");
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  const accountActionStatus = document.getElementById("accountActionStatus");
  const getLang = () => (localStorage.getItem("bsh_lang") === "ar" ? "ar" : "en");
  const t = (en, ar) => (getLang() === "ar" ? ar : en);

  const toolLabels = {
    en: {
      humanizer: "Humanizer Pro",
      chat: "Research Copilot",
      essay: "Essay Architect",
      note: "Lecture Notes AI",
      report: "Authenticity Report",
      editor: "Smart Editor",
      citation: "Citation Agent",
      plagiarism: "Plagiarism Risk Checker",
      methodology: "Methodology Builder",
      paraphrase: "Paraphrase by Level",
      thesis: "Thesis Statement Generator",
      outline: "Outline to Draft",
      file: "PDF/Doc Analyzer",
      heatmap: "Grammar & Style Heatmap",
      readiness: "Submission Readiness Score"
    },
    ar: {
      humanizer: "مُحسّن النصوص",
      chat: "مساعد البحث",
      essay: "مهندس المقال",
      note: "ملاحظات المحاضرات",
      report: "تقرير الأصالة",
      editor: "المحرر الذكي",
      citation: "وكيل التوثيق",
      plagiarism: "فاحص مخاطر الانتحال",
      methodology: "بناء المنهجية",
      paraphrase: "إعادة الصياغة حسب المستوى",
      thesis: "مولد الأطروحة",
      outline: "من مخطط إلى مسودة",
      file: "محلل PDF/Doc",
      heatmap: "خريطة النحو والأسلوب",
      readiness: "مؤشر جاهزية التسليم"
    }
  };

  const render = () => {
    const lang = getLang();
    const labels = toolLabels[lang] || toolLabels.en;
    const stats = core.getUsageStats(user);
    const settings = core.getUserSettings(user.id);

    if (planEl) planEl.textContent = `${stats.plan.label} (${stats.plan.tier})`;
    if (creditsEl) creditsEl.textContent = stats.plan.monthlyWords === Infinity ? t("Unlimited", "غير محدود") : stats.plan.monthlyWords.toLocaleString();
    if (usedEl) usedEl.textContent = stats.wordsUsed.toLocaleString();
    if (remainingEl) remainingEl.textContent = stats.remaining === Infinity ? t("Unlimited", "غير محدود") : stats.remaining.toLocaleString();

    if (usageList) {
      usageList.innerHTML = Object.entries(stats.calls)
        .map(([tool, count]) => `<div class="usage-item"><strong>${labels[tool] || tool}</strong><span>${count} ${t("runs", "عملية")}</span></div>`)
        .join("");
    }

    if (historyConsent) {
      historyConsent.checked = Boolean(settings.storeHistoryConsent);
    }

    if (onboardingPanel) {
      onboardingPanel.classList.toggle("hidden", Boolean(settings.onboardingDone));
    }
  };

  const setActionStatus = (text, type = "") => {
    if (!accountActionStatus) return;
    accountActionStatus.textContent = text || "";
    accountActionStatus.classList.remove("ok", "error");
    if (type) accountActionStatus.classList.add(type);
  };

  render();

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      core.clearSession();
      window.location.href = "auth.html?mode=signin";
    });
  }

  if (historyConsent) {
    historyConsent.addEventListener("change", () => {
      core.updateUserSettings(user.id, { storeHistoryConsent: historyConsent.checked });
    });
  }

  if (onboardingClose) {
    onboardingClose.addEventListener("click", () => {
      core.updateUserSettings(user.id, { onboardingDone: true });
      render();
    });
  }

  if (exportDataBtn) {
    exportDataBtn.addEventListener("click", () => {
      const exported = core.exportAccountData();
      if (!exported.ok || !exported.data) {
        setActionStatus(
          t("Could not export account data right now.", "تعذّر تصدير بيانات الحساب الآن."),
          "error"
        );
        return;
      }
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const blob = new Blob([JSON.stringify(exported.data, null, 2)], {
        type: "application/json;charset=utf-8"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bsh-account-export-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setActionStatus(
        t("Account data exported successfully.", "تم تصدير بيانات الحساب بنجاح."),
        "ok"
      );
    });
  }

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {
      const password = window.prompt(
        t(
          "For security, enter your current password:",
          "لأسباب أمنية، أدخل كلمة المرور الحالية:"
        )
      );
      if (password === null) return;
      if (!String(password).trim()) {
        setActionStatus(
          t("Password is required to delete account.", "كلمة المرور مطلوبة لحذف الحساب."),
          "error"
        );
        return;
      }
      const confirm = window.prompt(
        t(
          "Type DELETE to confirm permanent account deletion:",
          "اكتب DELETE لتأكيد الحذف النهائي للحساب:"
        )
      );
      if (confirm === null) return;
      const deleted = core.deleteAccount({ password, confirm });
      if (!deleted.ok) {
        let message = t("Could not delete account.", "تعذّر حذف الحساب.");
        if (deleted.error === "invalid_credentials") {
          message = t("Incorrect password.", "كلمة المرور غير صحيحة.");
        } else if (deleted.error === "invalid_confirmation") {
          message = t("Confirmation phrase must be DELETE.", "جملة التأكيد يجب أن تكون DELETE.");
        }
        setActionStatus(message, "error");
        return;
      }
      setActionStatus(
        t("Account deleted successfully. Redirecting...", "تم حذف الحساب بنجاح. جارٍ التحويل..."),
        "ok"
      );
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    });
  }

  document.addEventListener("bsh:languageChanged", () => {
    setActionStatus("");
    render();
  });
})();
