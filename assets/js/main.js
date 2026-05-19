(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};

  function whatsappUrl(number) {
    const n = String(number).replace(/\D/g, "");
    if (!n) return "#contato";
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(
      "Olá! Gostaria de solicitar um orçamento para mudança/transporte."
    );
  }

  function applyConfig() {
    const fields = {
      whatsapp: document.getElementById("contact-whatsapp"),
      phone: document.getElementById("contact-phone"),
      email: document.getElementById("contact-email"),
      location: document.getElementById("contact-location"),
    };

    Object.keys(fields).forEach(function (key) {
      const el = fields[key];
      const value = config[key];
      if (!el) return;
      if (value) {
        const displayValue = key === "whatsapp" && config.whatsappDisplay ? config.whatsappDisplay : value;
        el.textContent = displayValue;
        el.classList.remove("placeholder");
        if (key === "whatsapp" || key === "phone") {
          const link = document.createElement("a");
          link.href = key === "whatsapp" ? whatsappUrl(config.whatsapp) : "tel:" + value.replace(/\D/g, "");
          link.textContent = displayValue;
          el.replaceWith(link);
          link.id = "contact-" + key;
        }
        if (key === "email") {
          const link = document.createElement("a");
          link.href = "mailto:" + value;
          link.textContent = value;
          el.replaceWith(link);
          link.id = "contact-email";
        }
      }
    });

    const waLinks = document.querySelectorAll(
      "#btn-whatsapp-header, #btn-whatsapp-hero, #btn-whatsapp-cta, #footer-whatsapp"
    );
    const waHref = whatsappUrl(config.whatsapp);
    waLinks.forEach(function (el) {
      if (config.whatsapp) {
        el.href = waHref;
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      } else {
        el.href = "#contato";
      }
    });

    const cnpjEl = document.querySelector(".footer__bottom p:last-child");
    if (cnpjEl && config.cnpj) {
      cnpjEl.textContent = "Empresa privada • CNPJ: " + config.cnpj;
    }
  }

  applyConfig();

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open");
    });

    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const message = document.getElementById("form-message");
      if (message) {
        message.hidden = false;
        message.classList.add("form-message--success");
        message.textContent =
          "Solicitação registrada! Em breve nossa equipe entrará em contato.";
        form.reset();
        message.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  const header = document.querySelector(".header");
  if (header) {
    let lastScroll = 0;
    window.addEventListener(
      "scroll",
      function () {
        const current = window.scrollY;
        if (current > 80 && current > lastScroll) {
          header.style.transform = "translateY(-100%)";
        } else {
          header.style.transform = "translateY(0)";
        }
        lastScroll = current;
      },
      { passive: true }
    );
    header.style.transition = "transform 0.3s ease";
  }
})();
