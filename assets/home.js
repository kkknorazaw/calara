(function () {
  var I18N = window.CalaraI18n;
  var lang = I18N ? I18N.initDefault() : "zh";

  var TEXT = {
    zh: {
      brand: "克拉拉",
      navDashboard: "仪表板",
      navPricing: "定价",
      navResearch: "研究",
      signin: "使用 X 登录",
      heroBadge: "实时 DeFi 漏洞利用情报",
      heroTitle: "每一次 DeFi 黑客\n攻击都会改变\n你的风险敞口。",
      heroSubtitle: "Clara 将实时事件转化为可复现的技术证据：根本原因分析、漏洞利用 PoC 和跟踪上下文，供团队跟踪可重复的故障模式。",
      ctaLatest: "最新事件",
      ctaX: "X 的免费分析",
      b1Title: "根本原因",
      b1Text: "基于合约行为的故障条件编排和因果。",
      b2Title: "POC 验证",
      b2Text: "复事件链路的可复现漏洞利用代码。",
      chartTitle: "美元潜在影响总览",
      chartSubtitle: "已知攻击造成总损失超过 1 万美元，按美元估算汇总，并按事件年份排列。",
      tag1: "336 条线索点",
      tag2: "已统计并进行中",
      bottomLeft: "追踪到 572 起事件",
      bottomRight: "40 个洞链路信号",
      search: "按协议、受害者或交易哈希搜索...",
      tabAll: "全部",
      tabAttack: "攻击",
      tabMev: "MEV",
      view: "查看报告",
      verified: "已验证",
      pending: "待确认",
      attackTag: "攻击事件",
      mevTag: "MEV",
      prev: "上一页",
      next: "下一页",
      noResult: "没有匹配结果，请尝试其他关键词。",
      langBtn: "中文 / EN",
      updated: "最近更新时间：",
      y1: "$1B",
      y2: "$100M",
      y3: "$10M",
      y4: "$1M",
      y5: "$100K",
      y6: "$10K"
    },
    en: {
      brand: "CALARA",
      navDashboard: "Dashboard",
      navPricing: "Pricing",
      navResearch: "Research",
      signin: "Sign in with X",
      heroBadge: "Realtime DeFi Exploit Intelligence",
      heroTitle: "Every DeFi hack\nchanges\nyour risk surface.",
      heroSubtitle: "Clara turns live incidents into reproducible technical evidence: root cause analysis, exploit PoCs, and trace context.",
      ctaLatest: "Latest Incidents",
      ctaX: "Free X Analysis",
      b1Title: "Root Cause",
      b1Text: "Causal mapping from contract behavior and failure conditions.",
      b2Title: "POC Validation",
      b2Text: "Reproducible exploit code for incident chains.",
      chartTitle: "Potential USD Impact",
      chartSubtitle: "Known attacks over $10K estimated loss, distributed by incident year.",
      tag1: "336 signal points",
      tag2: "tracked and in-progress",
      bottomLeft: "Tracking 572 incidents",
      bottomRight: "40 exploit-path signals",
      search: "Search protocol, victim, or tx hash...",
      tabAll: "All",
      tabAttack: "Attack",
      tabMev: "MEV",
      view: "View Report",
      verified: "Verified",
      pending: "Pending",
      attackTag: "Attack",
      mevTag: "MEV",
      prev: "Prev",
      next: "Next",
      noResult: "No matching result.",
      langBtn: "EN / 中文",
      updated: "Last updated: ",
      y1: "$1B",
      y2: "$100M",
      y3: "$10M",
      y4: "$1M",
      y5: "$100K",
      y6: "$10K"
    }
  };

  var state = {
    incidents: [],
    filtered: [],
    query: "",
    type: "all",
    page: 1,
    pageSize: 12
  };

  var chart = {
    canvas: null,
    ctx: null,
    points: [],
    minYear: 2020,
    maxYear: 2026,
    frame: 0,
    raf: 0
  };

  var refs = {
    brand: document.getElementById("brand-name"),
    navDashboard: document.getElementById("nav-dashboard"),
    navPricing: document.getElementById("nav-pricing"),
    navResearch: document.getElementById("nav-research"),
    signin: document.getElementById("signin-btn"),
    badge: document.getElementById("hero-badge"),
    heroTitle: document.getElementById("hero-title"),
    heroSubtitle: document.getElementById("hero-subtitle"),
    ctaLatest: document.getElementById("cta-latest"),
    ctaX: document.getElementById("cta-x"),
    b1Title: document.getElementById("b1-title"),
    b1Text: document.getElementById("b1-text"),
    b2Title: document.getElementById("b2-title"),
    b2Text: document.getElementById("b2-text"),
    chartTitle: document.getElementById("chart-title"),
    chartSubtitle: document.getElementById("chart-subtitle"),
    chartTag1: document.getElementById("chart-tag1"),
    chartTag2: document.getElementById("chart-tag2"),
    chartBottomLeft: document.getElementById("chart-bottom-left"),
    chartBottomRight: document.getElementById("chart-bottom-right"),
    query: document.getElementById("search"),
    tabs: Array.prototype.slice.call(document.querySelectorAll(".tab")),
    list: document.getElementById("incident-list"),
    pagerInfo: document.getElementById("pager-info"),
    prevBtn: document.getElementById("prev-page"),
    nextBtn: document.getElementById("next-page"),
    updatedLabel: document.getElementById("foot-updated-label"),
    updated: document.getElementById("last-updated"),
    langBtn: document.getElementById("lang-toggle")
  };

  function t(k) {
    return (TEXT[lang] && TEXT[lang][k]) || k;
  }

  function normalizeUsd(v) {
    if (!v) return "Unknown";
    return String(v).replace("$$", "$");
  }

  function parseUsd(v) {
    if (!v) return 0;
    var s = String(v).replace(/\$/g, "").replace(/,/g, "").trim().toUpperCase();
    if (!s || s === "-" || s === "UNKNOWN") return 0;
    var m = 1;
    if (s.endsWith("K")) { m = 1e3; s = s.slice(0, -1); }
    else if (s.endsWith("M")) { m = 1e6; s = s.slice(0, -1); }
    else if (s.endsWith("B")) { m = 1e9; s = s.slice(0, -1); }
    var n = parseFloat(s);
    return Number.isNaN(n) ? 0 : n * m;
  }

  function fmt(iso) {
    var d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso || "-";
    return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(d);
  }

  function paintText() {
    refs.brand.textContent = t("brand");
    refs.navDashboard.textContent = t("navDashboard");
    refs.navPricing.textContent = t("navPricing");
    refs.navResearch.textContent = t("navResearch");
    refs.signin.textContent = t("signin");
    refs.badge.textContent = t("heroBadge");
    refs.heroTitle.innerHTML = t("heroTitle").replace(/\n/g, "<br>");
    refs.heroSubtitle.textContent = t("heroSubtitle");
    refs.ctaLatest.textContent = t("ctaLatest");
    refs.ctaX.textContent = t("ctaX");
    refs.b1Title.textContent = t("b1Title");
    refs.b1Text.textContent = t("b1Text");
    refs.b2Title.textContent = t("b2Title");
    refs.b2Text.textContent = t("b2Text");
    refs.chartTitle.textContent = t("chartTitle");
    refs.chartSubtitle.textContent = t("chartSubtitle");
    refs.chartTag1.textContent = t("tag1");
    refs.chartTag2.textContent = t("tag2");
    refs.chartBottomLeft.textContent = t("bottomLeft");
    refs.chartBottomRight.textContent = t("bottomRight");
    refs.query.placeholder = t("search");
    refs.tabs[0].textContent = t("tabAll");
    refs.tabs[1].textContent = t("tabAttack");
    refs.tabs[2].textContent = t("tabMev");
    refs.prevBtn.textContent = t("prev");
    refs.nextBtn.textContent = t("next");
    refs.langBtn.textContent = t("langBtn");
    refs.updatedLabel.textContent = t("updated");
  }

  function updateUpdatedTime() {
    if (!state.incidents.length) {
      refs.updated.textContent = "-";
      return;
    }
    refs.updated.textContent = fmt(state.incidents[0].incident_time);
  }

  function applyFilter() {
    var q = state.query.trim().toLowerCase();
    state.filtered = state.incidents.filter(function (item) {
      var typePass = state.type === "all" || item.classification === state.type;
      if (!typePass) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().indexOf(q) >= 0 ||
        item.id.toLowerCase().indexOf(q) >= 0 ||
        normalizeUsd(item.usd_loss_label).toLowerCase().indexOf(q) >= 0
      );
    });
    state.page = 1;
    renderList();
  }

  function renderList() {
    var total = state.filtered.length;
    var start = (state.page - 1) * state.pageSize;
    var pageItems = state.filtered.slice(start, start + state.pageSize);
    var end = Math.min(start + state.pageSize, total);

    if (!pageItems.length) {
      refs.list.innerHTML = '<div class="empty">' + t("noResult") + "</div>";
    } else {
      refs.list.innerHTML = pageItems.map(function (item) {
        var type = item.classification === "ATTACK"
          ? '<span class="pill attack">' + t("attackTag") + "</span>"
          : '<span class="pill mev">' + t("mevTag") + "</span>";
        var status = item.verified
          ? '<span class="pill ok">' + t("verified") + "</span>"
          : '<span class="pill warn">' + t("pending") + "</span>";
        return (
          '<article class="item">' +
          '<div class="item-title">' + item.title + "</div>" +
          '<div class="meta">' + type + status + '<span>' + fmt(item.incident_time) + '</span><span>ID: ' + item.id.slice(0, 8) + "...</span></div>" +
          '<div class="row"><div><div class="usd">' + normalizeUsd(item.usd_loss_label) + '</div><div class="meta">' + (item.usd_loss_caption || "N/A") + '</div></div>' +
          '<a class="btn" href="report.html?id=' + encodeURIComponent(item.id) + '">' + t("view") + "</a></div>" +
          "</article>"
        );
      }).join("");
    }

    refs.pagerInfo.textContent = total ? (start + 1) + "-" + end + " / " + total : "0 / 0";
    refs.prevBtn.disabled = state.page <= 1;
    refs.nextBtn.disabled = end >= total;
  }

  function buildChartData() {
    var years = state.incidents.map(function (x) { return new Date(x.incident_time).getUTCFullYear(); })
      .filter(function (y) { return Number.isFinite(y); });
    chart.minYear = years.length ? Math.min.apply(null, years) : 2020;
    chart.maxYear = years.length ? Math.max.apply(null, years) : 2026;
    if (chart.maxYear - chart.minYear < 4) chart.minYear = chart.maxYear - 4;

    chart.points = state.incidents.map(function (item, idx) {
      var ts = new Date(item.incident_time).getTime();
      var y = new Date(item.incident_time).getUTCFullYear() + (new Date(item.incident_time).getUTCMonth() / 12);
      if (!Number.isFinite(y)) y = chart.minYear;
      var usd = Math.max(10000, parseUsd(item.usd_loss_label));
      var log = Math.log10(usd);
      var amp = 0.7 + ((idx * 13) % 17) / 20;
      return {
        id: item.id,
        title: item.title,
        usd: usd,
        y: y,
        log: log,
        r: Math.max(4, Math.min(26, (log - 3) * 2.7)),
        phase: idx * 0.33,
        amp: amp,
        ts: ts
      };
    });
  }

  function resizeChart() {
    var canvas = chart.canvas;
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    chart.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawChart() {
    if (!chart.ctx) return;
    chart.frame += 1;
    var ctx = chart.ctx;
    var w = chart.canvas.clientWidth;
    var h = chart.canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    var pad = { l: 74, r: 26, t: 20, b: 42 };
    var cw = w - pad.l - pad.r;
    var ch = h - pad.t - pad.b;

    var yTicks = [9, 8, 7, 6, 5, 4];
    var yLabels = [t("y1"), t("y2"), t("y3"), t("y4"), t("y5"), t("y6")];
    ctx.strokeStyle = "#e9edf3";
    ctx.fillStyle = "#8b97ab";
    ctx.font = "11px Segoe UI, sans-serif";
    yTicks.forEach(function (log, i) {
      var y = pad.t + ((9 - log) / 5) * ch;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
      ctx.fillText(yLabels[i], 16, y + 4);
    });

    ctx.strokeStyle = "#eef2f7";
    for (var yr = chart.minYear; yr <= chart.maxYear; yr += 1) {
      var x = pad.l + ((yr - chart.minYear) / (chart.maxYear - chart.minYear)) * cw;
      ctx.beginPath();
      ctx.moveTo(x, pad.t);
      ctx.lineTo(x, h - pad.b);
      ctx.stroke();
      ctx.fillStyle = "#a0aabc";
      ctx.fillText(String(yr), x - 10, h - 14);
    }

    var maxPoint = null;
    chart.points.forEach(function (p) {
      if (!maxPoint || p.usd > maxPoint.usd) maxPoint = p;
    });

    chart.points.forEach(function (p, idx) {
      var xx = pad.l + ((p.y - chart.minYear) / (chart.maxYear - chart.minYear)) * cw;
      var yyBase = pad.t + ((9 - Math.max(4, Math.min(9, p.log))) / 5) * ch;
      var drift = Math.sin(chart.frame * 0.03 + p.phase) * p.amp;
      var yy = yyBase + drift;

      var alpha = 0.18 + ((idx * 7) % 10) / 70;
      ctx.beginPath();
      ctx.fillStyle = "rgba(234,106,106," + alpha.toFixed(3) + ")";
      ctx.strokeStyle = "rgba(226,99,99,0.62)";
      ctx.lineWidth = 1;
      ctx.arc(xx, yy, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (maxPoint && p.id === maxPoint.id) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(233,96,96,0.25)";
        ctx.strokeStyle = "rgba(224,83,83,0.8)";
        ctx.arc(xx, yy, p.r + 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        var label = "$" + (p.usd >= 1e9 ? (p.usd / 1e9).toFixed(1) + "B" : (p.usd / 1e6).toFixed(1) + "M");
        ctx.fillStyle = "#b53838";
        ctx.font = "700 12px Segoe UI, sans-serif";
        ctx.fillText(label, xx - 18, yy + 4);
      }
    });

    chart.raf = requestAnimationFrame(drawChart);
  }

  function initChart() {
    chart.canvas = document.getElementById("bubble-canvas");
    if (!chart.canvas) return;
    chart.ctx = chart.canvas.getContext("2d");
    resizeChart();
    buildChartData();
    if (chart.raf) cancelAnimationFrame(chart.raf);
    drawChart();
  }

  function bindEvents() {
    refs.query.addEventListener("input", function (e) {
      state.query = e.target.value;
      applyFilter();
    });

    refs.tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        refs.tabs.forEach(function (x) { x.classList.remove("active"); });
        tab.classList.add("active");
        state.type = tab.getAttribute("data-type");
        applyFilter();
      });
    });

    refs.prevBtn.addEventListener("click", function () {
      if (state.page <= 1) return;
      state.page -= 1;
      renderList();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    refs.nextBtn.addEventListener("click", function () {
      var maxPage = Math.ceil(state.filtered.length / state.pageSize);
      if (state.page >= maxPage) return;
      state.page += 1;
      renderList();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    refs.langBtn.addEventListener("click", function () {
      lang = I18N && I18N.setLang(lang === "zh" ? "en" : "zh");
      paintText();
      updateUpdatedTime();
      renderList();
    });

    window.addEventListener("resize", function () {
      resizeChart();
    });
  }

  function loadData() {
    fetch("data/incidents.json", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        state.incidents = Array.isArray(data) ? data : [];
        updateUpdatedTime();
        applyFilter();
        initChart();
      })
      .catch(function (e) {
        refs.list.innerHTML = '<div class="empty">Data error: ' + e.message + "</div>";
      });
  }

  paintText();
  bindEvents();
  loadData();
})();
