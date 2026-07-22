/* VOIZEX v3 — motion & interaction */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── nav solid on scroll ─────────────────────── */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    nav.classList.toggle("is-solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ── reveal on scroll ────────────────────────── */
  var targets = document.querySelectorAll(".reveal, .reveal-img");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* ── glitch: wrap digits already baked into copy ─ */
  document.querySelectorAll("[data-glitch-hold]").forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/[0-9]/g, function (d) {
      return '<span class="gx">' + d + "</span>";
    });
  });

  /* ── glitch: cycling letter swap (hero) ──────── */
  var GLYPHS = "01479X#%&$@";
  document.querySelectorAll("[data-glitch]").forEach(function (el) {
    var text = el.textContent;
    el.innerHTML = "";
    var spans = [];
    text.split("").forEach(function (ch) {
      var s = document.createElement("span");
      s.textContent = ch;
      el.appendChild(s);
      if (/[a-zA-Z]/.test(ch)) spans.push(s);
    });
    if (reduced || !spans.length) return;
    setInterval(function () {
      var s = spans[Math.floor(Math.random() * spans.length)];
      var orig = s.textContent;
      s.classList.add("gx");
      s.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      setTimeout(function () {
        s.classList.remove("gx");
        s.textContent = orig;
      }, 260);
    }, 1400);
  });

  /* ── mantra: light lines up as they pass center ─ */
  var mantraLines = document.querySelectorAll("[data-mantra] p");
  if (mantraLines.length) {
    if (reduced) {
      mantraLines.forEach(function (p) { p.classList.add("is-lit"); });
    } else {
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          e.target.classList.toggle("is-lit", e.isIntersecting);
        });
      }, { rootMargin: "-38% 0px -38% 0px" });
      mantraLines.forEach(function (p) { mio.observe(p); });
    }
  }

  /* ── stat count-up ───────────────────────────── */
  var stats = document.querySelectorAll(".stat-value[data-count]");
  if ("IntersectionObserver" in window && !reduced) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        sio.unobserve(e.target);
        var el = e.target;
        var end = parseFloat(el.dataset.count);
        var decimals = (el.dataset.count.split(".")[1] || "").length;
        var textNode = el.firstChild; /* number precedes any <i> suffix */
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1100, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          textNode.nodeValue = (end * eased).toFixed(decimals);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (s) { sio.observe(s); });
  }
})();
