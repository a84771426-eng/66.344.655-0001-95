/**
 * Só liga dados do site.config.js ao HTML (textos, chips de transparência, mailto, ano, menu mobile).
 */
(function () {
  "use strict";

  function get(obj, path) {
    if (!obj || !path) return "";
    return path.split(".").reduce(function (acc, key) {
      return acc != null && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function bindPaths(cfg) {
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var path = el.getAttribute("data-bind");
      var val = get(cfg, path);
      if (val !== undefined && val !== null) {
        el.textContent = String(val);
      }
    });
  }

  function renderTransparenciaChips(cfg) {
    var t = cfg.transparencia;
    if (!t || !t.itens) return "";
    return t.itens
      .map(function (texto) {
        return '<span class="transparencia__item" role="listitem">' + esc(texto) + "</span>";
      })
      .join("");
  }

  function renderTransparenciaList(cfg) {
    var t = cfg.transparencia;
    if (!t || !t.itens) return "";
    return t.itens
      .map(function (texto) {
        return "<li>" + esc(texto) + "</li>";
      })
      .join("");
  }

  function applyTransparencia(cfg) {
    var track = document.querySelector("[data-transparencia-track]");
    if (track) track.innerHTML = renderTransparenciaChips(cfg);
    document.querySelectorAll("[data-transparencia-footer]").forEach(function (footList) {
      footList.innerHTML = renderTransparenciaList(cfg);
    });
  }

  function applyMailtoLinks(cfg) {
    document.querySelectorAll("a[data-mailto]").forEach(function (a) {
      var path = a.getAttribute("data-mailto");
      var email = get(cfg, path);
      if (email) {
        a.setAttribute("href", "mailto:" + email);
      }
    });
  }

  function applyYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function applyDocumentTitle(cfg) {
    var page = document.body.getAttribute("data-page-title");
    if (page && cfg.meta && cfg.meta.nomePortal) {
      document.title = page + " · " + cfg.meta.nomePortal;
    }
  }

  function initNavToggle() {
    var btn = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initContactForm() {
    var form = document.getElementById("form-contato");
    if (!form) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) {
        if (typeof form.reportValidity === "function") {
          form.reportValidity();
        }
        return;
      }
      var cfg = window.SITE_CONFIG;
      if (!cfg || !cfg.empresa) return;
      var nome = document.getElementById("nome").value.trim();
      var email = document.getElementById("email").value.trim();
      var assunto = document.getElementById("assunto").value.trim();
      var mensagem = document.getElementById("mensagem").value.trim();
      if (!nome || !email || !assunto || !mensagem) {
        return;
      }
      var body = "Nome: " + nome + "\nE-mail: " + email + "\n\nMensagem:\n" + mensagem;
      var href =
        "mailto:" +
        encodeURIComponent(cfg.empresa.emailContato) +
        "?subject=" +
        encodeURIComponent(assunto) +
        "&body=" +
        encodeURIComponent(body);
      window.location.href = href;
    });
  }

  function init() {
    var cfg = window.SITE_CONFIG;
    if (!cfg) return;
    bindPaths(cfg);
    applyTransparencia(cfg);
    applyMailtoLinks(cfg);
    applyYear();
    applyDocumentTitle(cfg);
    initNavToggle();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
