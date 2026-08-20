/* ===================================================================
   CodeBridge Academy — script.js
   Vanilla JS only. Central config below powers WhatsApp links, phone/
   email links and social links across every page.
   =================================================================== */

/* ------------------------------------------------------------------
   1. CENTRAL CONFIG — replace the placeholder values before launch.
   ------------------------------------------------------------------ */
const ACADEMY_CONFIG = {
  name: "CodeBridge Academy",
  location: "Jankipuram, Lucknow, Uttar Pradesh, India",
  phone: "+91 63935 24941",
  email: "CodeBridgeAcademy@gmail.com",
  whatsapp: "916393524941", // digits only, with country code, e.g. 9198XXXXXXXX
  social: {
    instagram: "#",
    facebook: "#",
    youtube: "#",
    linkedin: "#"
  }
};

const WHATSAPP_DEFAULT_MESSAGE = "Hello CodeBridge Academy, I would like to book a free demo.";

/* Builds a wa.me URL from the config + message. Falls back gracefully
   even if the placeholder number hasn't been replaced yet. */
function buildWhatsAppUrl(message) {
  const digits = (ACADEMY_CONFIG.whatsapp || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message || WHATSAPP_DEFAULT_MESSAGE);
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initLucideIcons();
  wireWhatsAppLinks();
  wireContactPlaceholders();
  wireSocialLinks();
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initFaqAccordion();
  initBookDemoForm();
  initContactForm();
  setFooterYear();
  initNavShadowOnScroll();
});

/* ------------------------------------------------------------------
   Lucide icons
   ------------------------------------------------------------------ */
function initLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

/* ------------------------------------------------------------------
   WhatsApp — every element with [data-wa-link] gets a live wa.me URL.
   Optional [data-wa-message] overrides the default message.
   ------------------------------------------------------------------ */
function wireWhatsAppLinks() {
  document.querySelectorAll("[data-wa-link]").forEach((el) => {
    const customMessage = el.getAttribute("data-wa-message");
    el.setAttribute("href", buildWhatsAppUrl(customMessage));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

/* ------------------------------------------------------------------
   Phone / email placeholders — [data-phone-link] / [data-email-link]
   ------------------------------------------------------------------ */
function wireContactPlaceholders() {
  document.querySelectorAll("[data-phone-link]").forEach((el) => {
    el.setAttribute("href", `tel:${ACADEMY_CONFIG.phone}`);
  });
  document.querySelectorAll("[data-email-link]").forEach((el) => {
    el.setAttribute("href", `mailto:${ACADEMY_CONFIG.email}`);
  });
  document.querySelectorAll("[data-phone-text]").forEach((el) => {
    el.textContent = ACADEMY_CONFIG.phone;
  });
  document.querySelectorAll("[data-email-text]").forEach((el) => {
    el.textContent = ACADEMY_CONFIG.email;
  });
}

/* ------------------------------------------------------------------
   Social links — [data-social="instagram|facebook|youtube|linkedin"]
   ------------------------------------------------------------------ */
function wireSocialLinks() {
  document.querySelectorAll("[data-social]").forEach((el) => {
    const key = el.getAttribute("data-social");
    if (ACADEMY_CONFIG.social[key]) {
      el.setAttribute("href", ACADEMY_CONFIG.social[key]);
    }
  });
}

/* ------------------------------------------------------------------
   Mobile hamburger menu — accessible, closes on link click / Escape.
   ------------------------------------------------------------------ */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    iconOpen && iconOpen.classList.add("hidden");
    iconClose && iconClose.classList.remove("hidden");
  }
  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    iconOpen && iconOpen.classList.remove("hidden");
    iconClose && iconClose.classList.add("hidden");
  }

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ------------------------------------------------------------------
   Sticky navbar shadow once the page scrolls.
   ------------------------------------------------------------------ */
function initNavShadowOnScroll() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 8) {
      nav.classList.add("shadow-lg", "shadow-slate-900/5");
    } else {
      nav.classList.remove("shadow-lg", "shadow-slate-900/5");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ------------------------------------------------------------------
   Scroll reveal — adds .is-visible to [.reveal] elements as they
   enter the viewport. Respects prefers-reduced-motion via CSS.
   ------------------------------------------------------------------ */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------
   Back-to-top button
   ------------------------------------------------------------------ */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  const toggle = () => {
    if (window.scrollY > 640) btn.classList.remove("opacity-0", "pointer-events-none");
    else btn.classList.add("opacity-0", "pointer-events-none");
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ------------------------------------------------------------------
   FAQ accordion — [data-faq-item] with [data-faq-trigger] / [data-faq-panel]
   ------------------------------------------------------------------ */
function initFaqAccordion() {
  document.querySelectorAll("[data-faq-item]").forEach((item) => {
    const trigger = item.querySelector("[data-faq-trigger]");
    const panel = item.querySelector("[data-faq-panel]");
    const icon = item.querySelector("[data-faq-icon]");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";

      document.querySelectorAll("[data-faq-item]").forEach((other) => {
        if (other !== item) {
          other.setAttribute("data-open", "false");
          other.querySelector("[data-faq-trigger]").setAttribute("aria-expanded", "false");
          const otherPanel = other.querySelector("[data-faq-panel]");
          otherPanel.style.maxHeight = null;
          const otherIcon = other.querySelector("[data-faq-icon]");
          if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
        }
      });

      item.setAttribute("data-open", (!isOpen).toString());
      trigger.setAttribute("aria-expanded", (!isOpen).toString());
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
      if (icon) icon.style.transform = !isOpen ? "rotate(45deg)" : "rotate(0deg)";
    });
  });
}

/* ------------------------------------------------------------------
   Book Demo form — static WhatsApp integration.
   After validation, all form details are converted into a pre-filled
   WhatsApp message and opened for the academy number. No backend needed.
   ------------------------------------------------------------------ */
function initBookDemoForm() {
  const form = document.getElementById("book-demo-form");
  if (!form) return;

  const successBox = document.getElementById("book-demo-success");
  const successWhatsAppLink = successBox ? successBox.querySelector("[data-wa-link]") : null;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const data = new FormData(form);
    const value = (name) => (data.get(name) || "").toString().trim();

    const message = [
      "Hello CodeBridge Academy! 👋",
      "",
      "I would like to book a *Free Demo Class*.",
      "",
      "*Student Details*",
      `👨‍🎓 Student Name: ${value("student_name")}`,
      `👨‍👩‍👧 Parent/Guardian: ${value("parent_name")}`,
      `📱 Phone: ${value("phone")}`,
      `📧 Email: ${value("email")}`,
      "",
      "*Learning Preferences*",
      `🏫 Preferred Mode: ${value("preferred_mode")}`,
      `📚 Learning Area: ${value("learning_area")}`,
      `📈 Current Level: ${value("current_level")}`,
      `💻 Programming Experience: ${value("programming_experience")}`,
      `🎯 Learning Goal: ${value("learning_goal")}`,
      value("message") ? `💬 Additional Message: ${value("message")}` : "",
      "",
      "Please contact me to schedule the free demo. Thank you!"
    ].filter(Boolean).join("\n");

    const whatsappUrl = buildWhatsAppUrl(message);

    // Keep the message available in the success section as well.
    if (successWhatsAppLink) {
      successWhatsAppLink.setAttribute("href", whatsappUrl);
    }

    // Open WhatsApp with all submitted details pre-filled.
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    form.reset();
    form.classList.add("hidden");

    if (successBox) {
      successBox.classList.remove("hidden");
      successBox.setAttribute("tabindex", "-1");
      successBox.focus();
    }
  });
}

/* ------------------------------------------------------------------
   Contact page form — same static approach as Book Demo.
   ------------------------------------------------------------------ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const successBox = document.getElementById("contact-success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    // TODO: connect a real form service here.

    form.reset();
    form.classList.add("hidden");
    if (successBox) {
      successBox.classList.remove("hidden");
      successBox.setAttribute("tabindex", "-1");
      successBox.focus();
    }
  });
}

/* ------------------------------------------------------------------
   Shared validation helper — marks required fields, shows inline
   error text, focuses the first invalid field.
   ------------------------------------------------------------------ */
function validateForm(form) {
  let firstInvalid = null;
  let isValid = true;

  form.querySelectorAll("[required]").forEach((field) => {
    const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);
    let fieldValid = true;

    if (field.type === "email") {
      fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    } else if (field.type === "tel") {
      fieldValid = /^[0-9+\-\s()]{7,15}$/.test(field.value.trim());
    } else {
      fieldValid = field.value.trim().length > 0;
    }

    if (!fieldValid) {
      isValid = false;
      field.setAttribute("aria-invalid", "true");
      field.classList.add("ring-2", "ring-red-400", "border-red-400");
      if (errorEl) errorEl.classList.remove("hidden");
      if (!firstInvalid) firstInvalid = field;
    } else {
      field.removeAttribute("aria-invalid");
      field.classList.remove("ring-2", "ring-red-400", "border-red-400");
      if (errorEl) errorEl.classList.add("hidden");
    }
  });

  if (firstInvalid) firstInvalid.focus();
  return isValid;
}

/* ------------------------------------------------------------------
   Footer year
   ------------------------------------------------------------------ */
function setFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}


// =========================================
// Cursor Bubble Animation
// =========================================
(function initCursorBubbles() {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!supportsHover || reduceMotion) return;

  let lastBubbleTime = 0;
  const bubbleInterval = 55;

  document.addEventListener("mousemove", (event) => {
    const now = Date.now();

    if (now - lastBubbleTime < bubbleInterval) return;
    lastBubbleTime = now;

    const bubble = document.createElement("span");
    const size = Math.floor(Math.random() * 18) + 10;
    const driftX = Math.floor(Math.random() * 50) - 25;
    const driftY = -(Math.floor(Math.random() * 65) + 25);
    const duration = (Math.random() * 0.45 + 0.65).toFixed(2);

    bubble.className = "cursor-bubble";
    bubble.style.left = `${event.clientX}px`;
    bubble.style.top = `${event.clientY}px`;
    bubble.style.setProperty("--bubble-size", `${size}px`);
    bubble.style.setProperty("--bubble-x", `${driftX}px`);
    bubble.style.setProperty("--bubble-y", `${driftY}px`);
    bubble.style.setProperty("--bubble-duration", `${duration}s`);

    document.body.appendChild(bubble);

    bubble.addEventListener("animationend", () => bubble.remove());
  });
})();
