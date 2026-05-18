/* ═══════════════════════════════════════════════
   NEXOVRA STUDIOS — SHARED JS FINAL
   Fixed: Mobile Navbar | Theme | Loader | Reveal | Modal
═══════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── PAGE LOADER ── */
  function initLoader() {
    const loader = document.getElementById("page-loader");
    if (!loader) return;

    const fill = loader.querySelector(".pl-fill");

    if (fill) {
      requestAnimationFrame(() => {
        fill.style.width = "68%";
      });
    }

    const finish = () => {
      if (fill) fill.style.width = "100%";

      setTimeout(() => {
        loader.classList.add("out");

        setTimeout(() => {
          loader.remove();
        }, 700);
      }, 220);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
  }

  /* ── THEME ── */
  function initTheme() {
    const html = document.documentElement;
    const btn = document.getElementById("theme-toggle");
    const icon = btn?.querySelector(".tt-icon");

    const saved = localStorage.getItem("nx-theme") || "dark";

    html.setAttribute("data-theme", saved);

    if (icon) {
      icon.textContent = saved === "dark" ? "🌙" : "☀️";
    }

    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";

      html.setAttribute("data-theme", next);
      localStorage.setItem("nx-theme", next);

      if (icon) {
        icon.textContent = next === "dark" ? "🌙" : "☀️";
      }
    });
  }

  /* ── NAVBAR FINAL FIX ── */
  function initNavbar() {
    const nav = document.getElementById("navbar");
    const ham = document.getElementById("hamburger");
    const links = document.getElementById("nav-links");

    if (!nav || !ham || !links) return;

    /*
      Prevent duplicate listeners.
      Agar JS accidentally 2 dafa load ho jaye to hamburger pagal nahi hoga.
    */
    if (ham.dataset.navReady === "true") return;
    ham.dataset.navReady = "true";

    const openMenu = () => {
      links.classList.add("open");
      ham.classList.add("open");
      document.body.classList.add("menu-open");
      ham.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      links.classList.remove("open");
      ham.classList.remove("open");
      document.body.classList.remove("menu-open");
      ham.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      const isOpen = links.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    ham.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    links.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
      const menuIsOpen = links.classList.contains("open");

      if (
        menuIsOpen &&
        !links.contains(e.target) &&
        !ham.contains(e.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 980) {
          closeMenu();
        }
      },
      { passive: true }
    );

    window.addEventListener(
      "scroll",
      () => {
        nav.classList.toggle("scrolled", window.scrollY > 40);
      },
      { passive: true }
    );
  }

  /* ── SCROLL REVEAL ── */
  function initReveal() {
    const els = document.querySelectorAll(
      ".reveal, .reveal-l, .reveal-r, .reveal-s, .reveal-fade"
    );

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;

          entry.target.style.transitionDelay = `${index * 0.06}s`;
          entry.target.classList.add("vis");

          io.unobserve(entry.target);
        });
      },
      {
        threshold: 0.07,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    els.forEach((el) => io.observe(el));
  }

  /* ── COUNTER ── */
  function initCounters() {
    const counters = document.querySelectorAll("[data-target]");
    if (!counters.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const target = Number(el.dataset.target || 0);
          const duration = 1800;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            el.textContent = Math.floor(eased * target);

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target;
            }
          };

          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => io.observe(el));
  }

  /* ── TILT EFFECT ── */
  function initTilt() {
    const cards = document.querySelectorAll("[data-tilt]");
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
          translateY(-7px)
          rotateX(${-y * 7}deg)
          rotateY(${x * 7}deg)
        `;

        card.style.transitionDuration = "0.1s";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transitionDuration = "0.6s";
      });
    });
  }

  /* ── SMOOTH SCROLL ── */
  function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");

        if (!id || id === "#") return;

        const target = document.querySelector(id);

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }

  /* ── MODAL ── */
  function initModal() {
    window.NxModal = {
      open(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      },

      close(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.remove("open");
        document.body.style.overflow = "";
      },
    };

    document.addEventListener("click", (e) => {
      if (!e.target.classList.contains("modal-overlay")) return;

      e.target.classList.remove("open");
      document.body.style.overflow = "";
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      document.querySelectorAll(".modal-overlay.open").forEach((modal) => {
        modal.classList.remove("open");
      });

      document.body.style.overflow = "";
    });
  }

  /* ── PARALLAX HERO ── */
  function initParallax() {
    const blobs = document.querySelectorAll(".blob-parallax");
    if (!blobs.length) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener(
      "mousemove",
      (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );

    const animate = () => {
      currentX += (mouseX - currentX) * 0.04;
      currentY += (mouseY - currentY) * 0.04;

      blobs.forEach((blob, index) => {
        const depth = (index + 1) * 14;
        blob.style.transform = `
          translate(${currentX * depth}px, ${currentY * depth}px)
          translateZ(0)
        `;
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  /* ── PLATFORM BADGE ── */
  function initPlatformBadge() {
    const ua = navigator.userAgent;
    const platform = navigator.platform || "";

    let os = "Windows";

    if (/Mac/.test(platform) && !/iPhone|iPad/.test(ua)) {
      os = "macOS";
    } else if (/iPhone/.test(ua)) {
      os = "iOS";
    } else if (/iPad/.test(ua)) {
      os = "iPadOS";
    } else if (/Android/.test(ua)) {
      os = "Android";
    } else if (/Linux/.test(platform)) {
      os = "Linux";
    }

    document.querySelectorAll(".platform-badge").forEach((el) => {
      el.textContent = `Running on ${os}`;
    });
  }

  /* ── INIT ALL ── */
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initTheme();
    initNavbar();
    initReveal();
    initCounters();
    initTilt();
    initSmoothScroll();
    initModal();
    initParallax();
    initPlatformBadge();
  });
})();



 