// Taoufik Rachdi — portfolio scripts
(function () {
  "use strict";

  // Year in footer
  var year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Sticky nav border + mobile menu
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("navLinks");

  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<i class="bi bi-list"></i>';
    });
  });

  // Back to top: the header is sticky, so an anchor to it never scrolls — scroll the window instead
  document.querySelectorAll('a[href="#top"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  });

  // Reveal on scroll + active nav link
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    var navMap = {};
    links.querySelectorAll('a[href^="#"]').forEach(function (a) { navMap[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = navMap[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Object.keys(navMap).forEach(function (k) { navMap[k].classList.remove("active"); });
          a.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  } else {
    document.documentElement.classList.add("no-js");
  }


  // Experience: copper trace fills as you scroll through the timeline
  var timeline = document.querySelector(".timeline");
  if (timeline) {
    var ticking = false;
    var updateFill = function () {
      ticking = false;
      var r = timeline.getBoundingClientRect();
      var mid = window.innerHeight * 0.6;
      var pct = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      timeline.style.setProperty("--fill", (pct * 100).toFixed(1) + "%");
      timeline.querySelectorAll(".tl-item").forEach(function (li) {
        li.classList.toggle("lit", li.getBoundingClientRect().top + 30 < mid);
      });
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateFill); }
    }, { passive: true });
    updateFill();
  }

  // Datasheet numbers count up once
  var motionOK = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (motionOK) {
    document.querySelectorAll(".stat-n").forEach(function (el) {
      var m = el.textContent.match(/^(\d+)(.*)$/);
      if (!m) return;
      var target = parseInt(m[1], 10), suffix = m[2], start = null;
      el.textContent = "0" + suffix;
      setTimeout(function () {
        requestAnimationFrame(function step(t) {
          if (!start) start = t;
          var k = Math.min(1, (t - start) / 900);
          el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + suffix;
          if (k < 1) requestAnimationFrame(step);
        });
      }, 1100);
    });
  }

  // Hero console: animated ATP test sequence
  var consoleBody = document.getElementById("consoleBody");
  var steps = [
    ["Power-up 28 V DC", "PASS"],
    ["Insulation check", "PASS"],
    ["Discrete I/O loopback", "PASS"],
    ["Serial link self-test", "PASS"],
    ["Analog channels ±0.5%", "PASS"]
  ];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function line(n, label, verdict, cls) {
    var li = document.createElement("li");
    li.innerHTML = '<span><span class="step">' + n + "</span>" + label + '</span><span class="' + cls + '">' + verdict + "</span>";
    return li;
  }

  function renderStatic() {
    consoleBody.innerHTML = "";
    steps.forEach(function (s, i) { consoleBody.appendChild(line(String(i + 1).padStart(2, "0"), s[0], s[1], "ok")); });
    var sum = line("", "Sequence complete", steps.length + "/" + steps.length + " PASS", "ok");
    sum.classList.add("sum");
    consoleBody.appendChild(sum);
  }

  function runSequence() {
    consoleBody.innerHTML = "";
    var i = 0;
    (function next() {
      if (i < steps.length) {
        var n = String(i + 1).padStart(2, "0");
        var li = line(n, steps[i][0], "RUN…", "run");
        consoleBody.appendChild(li);
        var s = steps[i];
        setTimeout(function () {
          var v = li.querySelector(".run");
          v.textContent = s[1];
          v.className = "ok";
          i++;
          setTimeout(next, 260);
        }, 650);
      } else {
        var sum = line("", "Sequence complete", steps.length + "/" + steps.length + " PASS", "ok");
        sum.classList.add("sum");
        consoleBody.appendChild(sum);
        setTimeout(runSequence, 4200);
      }
    })();
  }

  if (consoleBody) { reduce ? renderStatic() : runSequence(); }

  // Contact form (Formspree)
  var form = document.getElementById("contactForm");
  var btn = document.getElementById("submitButton");
  var status = document.getElementById("formStatus");
  var btnLabel = btn.innerHTML;

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    var bad = false;
    form.querySelectorAll("[required]").forEach(function (f) {
      var invalid = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("invalid", invalid);
      if (invalid) bad = true;
    });
    if (bad) {
      status.textContent = "Please fill in your name, a valid email and a message.";
      status.classList.add("err");
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i>Sending…';

    fetch("https://formspree.io/f/xnnnkkpq", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.reset();
      status.textContent = "Message sent — thank you! I'll reply soon.";
      status.classList.add("ok");
    }).catch(function () {
      status.textContent = "Something went wrong. Please email me directly at taoufik.rachdi@enis.tn.";
      status.classList.add("err");
    }).finally(function () {
      btn.disabled = false;
      btn.innerHTML = btnLabel;
    });
  });
})();
