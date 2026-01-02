const LINKS = {
  en: "https://view.publitas.com/reportstellar/report-2025-stellar-english/",
  pt: "https://view.publitas.com/reportstellar/report-2025-stellar-portugues/"
};

const I18N = {
  en: {
    subtitle: "Market Report 2025",
    title: "Market Report 2025",
    lead: "Access the report in your preferred language and receive updates and materials from our team.",
    openReport: "Open the report",
    viewOnline: "View online",
    formTitle: "Stay in touch",
    formLead: "Leave your details to receive future editions and updates.",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Work email",
    emailHint: "Preferably your professional email.",
    submit: "Send",
    privacyNote: "By submitting, you agree to be contacted about this report and future editions.",
    success: "Thanks! Your details were sent successfully.",
    error: "Something went wrong. Please try again."
  },
  pt: {
    subtitle: "Relatório de Mercado 2025",
    title: "Relatório de Mercado 2025",
    lead: "Acesse o relatório no idioma desejado e receba atualizações e materiais da nossa equipe.",
    openReport: "Abrir relatório",
    viewOnline: "Ver online",
    formTitle: "Fique por dentro",
    formLead: "Deixe seus dados para receber futuras edições e atualizações.",
    firstNameLabel: "Nome",
    lastNameLabel: "Sobrenome",
    emailLabel: "E-mail profissional",
    emailHint: "Preferencialmente seu e-mail corporativo.",
    submit: "Enviar",
    privacyNote: "Ao enviar, você concorda em receber comunicações sobre este relatório e futuras edições.",
    success: "Obrigado! Seus dados foram enviados com sucesso.",
    error: "Algo deu errado. Tente novamente."
  }
};

function setText(lang) {
  document.documentElement.lang = lang;
  document.getElementById("openReport").href = LINKS[lang];
  document.getElementById("downloadReport").href = LINKS[lang];

  const langField = document.getElementById("languageField");
  if (langField) langField.value = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (I18N[lang] && I18N[lang][key]) {
      el.textContent = I18N[lang][key];
    }
  });

  document.querySelectorAll(".langBtn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function defaultLang() {
  const p = new URLSearchParams(window.location.search);
  const forced = p.get("lang");
  if (forced === "pt" || forced === "en") return forced;
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("pt") ? "pt" : "en";
}

document.getElementById("year").textContent = new Date().getFullYear();

const initial = defaultLang();
setText(initial);

document.querySelectorAll(".langBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    setText(lang);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
  });
});

const form = document.getElementById("leadForm");
const statusEl = document.getElementById("status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.className = "status";
    statusEl.textContent = "";

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      const lang = document.documentElement.lang || "en";
      if (res.ok) {
        form.reset();
        document.getElementById("languageField").value = lang;
        statusEl.className = "status ok";
        statusEl.textContent = I18N[lang].success;
      } else {
        statusEl.className = "status err";
        statusEl.textContent = I18N[lang].error;
      }
    } catch (err) {
      const lang = document.documentElement.lang || "en";
      statusEl.className = "status err";
      statusEl.textContent = I18N[lang].error;
    }
  });
}
