(function () {
  "use strict";
  var root = document.documentElement;
  var body = document.body;
  var P = window.PROGRAMS || [];
  var current = parseInt(body.getAttribute("data-program") || "0", 10);

  /* ---------- safe storage ---------- */
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- theme ---------- */
  var saved = get("tally:theme");
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) root.setAttribute("data-theme", "dark");
  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next); set("tally:theme", next);
  }

  /* ---------- top bar + drawer ---------- */
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  var bar = el("header", { "class": "topbar" },
    '<button class="iconbtn" id="menuBtn" aria-label="Open menu" aria-expanded="false">&#9776;</button>' +
    '<a class="brand" href="index.html">Tally Prime Lab' + (current ? " &middot; Program " + current : "") + '</a>' +
    '<span id="pct" aria-live="polite"></span>' +
    '<button class="iconbtn" id="themeBtn" aria-label="Switch light or dark theme">&#9680;</button>' +
    '<div class="bar"><div id="barFill"></div></div>');
  body.insertBefore(bar, body.firstChild);

  var overlay = el("div", { id: "overlay" });
  var drawer = el("nav", { id: "drawer", "aria-label": "Site menu" });
  var html = '<h2>Programs</h2><ul><li><a href="index.html"' + (!current ? ' class="current"' : "") + ">Home</a></li>";
  P.forEach(function (p) {
    if (p.ready) html += '<li><a href="' + p.file + '"' + (p.n === current ? ' class="current"' : "") + ">" + p.n + ". " + p.title + "</a></li>";
    else html += '<li><span class="soon">' + p.n + ". " + p.title + " (coming soon)</span></li>";
  });
  html += "</ul>";
  var steps = document.querySelectorAll(".step[id]");
  if (steps.length) {
    html += "<h2>On this page</h2><ul>";
    steps.forEach(function (s) {
      var t = s.querySelector("summary");
      var label = t ? t.getAttribute("data-title") || t.textContent.replace(/^\s*\d+\s*/, "") : s.id;
      html += '<li><a href="#' + s.id + '">' + label.trim() + "</a></li>";
    });
    html += "</ul>";
  }
  drawer.innerHTML = html;
  body.appendChild(overlay); body.appendChild(drawer);

  function openMenu(open) {
    body.classList.toggle("menu-open", open);
    document.getElementById("menuBtn").setAttribute("aria-expanded", String(open));
  }
  document.getElementById("menuBtn").addEventListener("click", function () { openMenu(!body.classList.contains("menu-open")); });
  overlay.addEventListener("click", function () { openMenu(false); });
  drawer.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      openMenu(false);
      var id = (e.target.getAttribute("href") || "").replace("#", "");
      var d = id && document.querySelector("#" + id + " details");
      if (d) d.open = true;
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") openMenu(false); });
  document.getElementById("themeBtn").addEventListener("click", toggleTheme);

  /* ---------- home page cards ---------- */
  var list = document.getElementById("program-list");
  if (list) {
    P.forEach(function (p) {
      var inner = '<span class="num"><span>' + p.n + '</span></span><div><h3>' + p.title + "</h3><p>" + p.desc + "</p>" +
        (p.ready ? "<small>" + (p.minutes || "") + (p.minutes ? " min &middot; " : "") + "Open &rarr;</small>" : "<small>Coming soon</small>") + "</div>";
      var node = p.ready ? el("a", { "class": "card", href: p.file }, inner) : el("div", { "class": "card soon" }, inner);
      list.appendChild(node);
    });
  }

  /* ---------- previous / next ---------- */
  var pager = document.getElementById("pager");
  if (pager && current) {
    var prev = null, next = null;
    P.forEach(function (p) { if (p.ready && p.n < current) prev = p; if (p.ready && p.n > current && !next) next = p; });
    pager.innerHTML =
      (prev ? '<a href="' + prev.file + '">&larr; Program ' + prev.n + "</a>" : '<span class="spacer"></span>') +
      '<a href="index.html">All programs</a>' +
      (next ? '<a href="' + next.file + '">Program ' + next.n + " &rarr;</a>" : '<span class="spacer"></span>');
  }

  /* ---------- progress (steps and checklists) ---------- */
  var boxes = document.querySelectorAll("input[data-key]");
  function refresh() {
    var total = 0, done = 0;
    boxes.forEach(function (b) {
      total++; if (b.checked) done++;
      var step = b.closest(".step");
      if (step) step.classList.toggle("done", b.checked);
    });
    var pct = total ? Math.round(done * 100 / total) : 0;
    var f = document.getElementById("barFill"), t = document.getElementById("pct");
    if (f) f.style.width = pct + "%";
    if (t) t.textContent = total ? pct + "%" : "";
  }
  boxes.forEach(function (b) {
    b.checked = get("tally:" + b.getAttribute("data-key")) === "1";
    b.addEventListener("change", function () {
      set("tally:" + b.getAttribute("data-key"), b.checked ? "1" : "0"); refresh();
      if (b.checked && b.closest(".step")) {
        var det = b.closest("details"); if (det && b.hasAttribute("data-collapse")) det.open = false;
      }
    });
  });
  refresh();

  var reset = document.getElementById("resetProgress");
  if (reset) reset.addEventListener("click", function () {
    if (!confirm("Clear all ticks on this page?")) return;
    boxes.forEach(function (b) { b.checked = false; set("tally:" + b.getAttribute("data-key"), "0"); });
    refresh();
  });

  /* ---------- open everything when printing ---------- */
  window.addEventListener("beforeprint", function () {
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  });

  /* ---------- back to top ---------- */
  var top = el("button", { id: "top", "aria-label": "Back to top" }, "&uarr;");
  body.appendChild(top);
  top.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
  window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 600); }, { passive: true });
})();
