/* VOIZEX — motion & interaction */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- nav background on scroll --- */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* --- reveal on scroll --- */
  var revealables = document.querySelectorAll(".reveal, .reveal-line");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /* --- number count-up --- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (String(target).split(".")[1] || "").length;
    var t0 = null;
    var dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && !reduced) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* --- gentle parallax on hero / image breaks --- */
  var pxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (pxEls.length && !reduced) {
    var ticking = false;
    function parallax() {
      pxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        var box = (el.tagName === "IMG" ? el.parentElement : el).getBoundingClientRect();
        if (box.bottom < 0 || box.top > window.innerHeight) return;
        var center = box.top + box.height / 2 - window.innerHeight / 2;
        var img = el.tagName === "IMG" ? el : el.querySelector("img");
        if (img) img.style.transform = "scale(1.12) translateY(" + (-center * speed * 0.12) + "px)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }
})();
