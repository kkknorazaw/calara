(function () {
  var I18N = window.CalaraI18n;
  var lang = I18N ? I18N.initDefault() : "zh";

  var TEXT = {
    zh: {
      navPricing: "定价",
      navResearch: "研究",
      navLicense: "授权",
      heroTitle: "每一次攻击，都会改变你的风险敞口。",
      heroDesc: "基于已收录事件构建情报首页，支持检索、筛选、报告浏览与可视化统计。",
      statTotal: "已收录事件",
      statAttack: "攻击事件",
      statMev: "MEV 事件",
      search: "搜索标题、ID、损失金额...",
      tabAll: "全部",
      tabAttack: "攻击",
      tabMev: "MEV",
      view: "查看报告",
      verified: "已验证",
      pending: "待确认",
      attackTag: "攻击事件",
      mevTag: "MEV",
      noResult: "没有匹配结果，请尝试其他关键词。",
      prev: "上一页",
      next: "下一页",
      foot: "最近更新时间：",
      footTail: " · 数据来自当前静态归档",
      langBtn: "中文 / EN",
      bubbleTitle: "实时事件气泡统计",
      bubbleSubtitle: "依据收录攻击事件按时间与损失规模可视化分布",
      bubbleLegendAttack: "攻击",
      bubbleLegendMev: "MEV",
      bubbleFootLeft: "数据点：",
      bubbleFootRight: "单位：USD 估算",
      bubbleAxisRecent: "最近",
      bubbleAxisPast: "较早"
    },
    en: {
      navPricing: "Pricing",
      navResearch: "Research",
      navLicense: "License",
      heroTitle: "Every exploit changes your risk surface.",
      heroDesc: "Incident intelligence homepage with search, filters, report view and bubble analytics.",
      statTotal: "Total Incidents",
      statAttack: "Attack",
      statMev: "MEV",
      search: "Search title, id, loss...",
      tabAll: "All",
      tabAttack: "Attack",
      tabMev: "MEV",
      view: "View Report",
      verified: "Verified",
      pending: "Pending",
      attackTag: "Attack",
      mevTag: "MEV",
      noResult: "No matching results.",
      prev: "Prev",
      next: "Next",
      foot: "Last updated: ",
      footTail: " · source: static archive",
      langBtn: "EN / 中文",
      bubbleTitle: "Realtime Bubble Statistics",
      bubbleSubtitle: "Visualizing incident distribution by time and estimated loss",
      bubbleLegendAttack: "Attack",
      bubbleLegendMev: "MEV",
      bubbleFootLeft: "Points: ",
      bubbleFootRight: "Unit: USD estimate",
      bubbleAxisRecent: "Recent",
      bubbleAxisPast: "Past"
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
    raf: 0,
    frame: 0
  };

  var refs = {
    total: document.getElementById("stat-total"),
    attacks: document.getElementById("stat-attack"),
    mev: document.getElementById("stat-mev"),
    updated: document.getElementById("last-updated"),
    query: document.getElementById("search"),
    list: document.getElementById("incident-list"),
    pagerInfo: document.getElementById("pager-info"),
    prevBtn: document.getElementById("prev-page"),
    nextBtn: document.getElementById("next-page"),
    tabs: Array.prototype.slice.call(document.querySelectorAll(".tab")),
    langBtn: document.getElementById("lang-toggle"),
    navPricing: document.getElementById("nav-pricing"),
    navResearch: document.getElementById("nav-research"),
    navLicense: document.getElementById("nav-license"),
    bubbleTitle: document.getElementById("bubble-title"),
    bubbleSubtitle: document.getElementById("bubble-subtitle"),
    legendAttack: document.getElementById("legend-attack"),
    legendMev: document.getElementById("legend-mev"),
    bubbleFootLeft: document.getElementById("chart-foot-left"),
    bubbleFootRight: document.getElementById("chart-foot-right")
  };

  function t(key) {
    return (TEXT[lang] && TEXT[lang][key]) || key;
  }

  function normalizeUsd(v) {
    if (!v) return "Unknown";
    return String(v).replace("$$", "$");
  }

  function parseUsdToNumber(label) {
    if (!label) return 0;
    var s = String(label).replace(/\$/g, "").replace(/,/g, "").trim().toUpperCase();
    if (s === "-" || s === "UNKNOWN" || s === "N/A") return 0;
    var mult = 1;
    if (s.endsWith("K")) { mult = 1000; s = s.slice(0, -1); }
    else if (s.endsWith("M")) { mult = 1000000; s = s.slice(0, -1); }
    else if (s.endsWith("B")) { mult = 1000000000; s = s.slice(0, -1); }
    var n = parseFloat(s);
    if (Number.isNaN(n)) return 0;
    return n * mult;
  }

  function formatTime(iso) {
    if (!iso) return "Unknown";
    var d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(d);
  }

  function paintStaticText() {
    refs.navPricing.textContent = t("navPricing");
    refs.navResearch.textContent = t("navResearch");
    refs.navLicense.textContent = t("navLicense");
    document.querySelector(".hero h1").textContent = t("heroTitle");
    document.querySelector(".hero p").textContent = t("heroDesc");
    document.querySelectorAll(".stat .label")[0].textContent = t("statTotal");
    document.querySelectorAll(".stat .label")[1].textContent = t("statAttack");
    document.querySelectorAll(".stat .label")[2].textContent = t("statMev");
    refs.query.placeholder = t("search");
    refs.tabs[0].textContent = t("tabAll");
    refs.tabs[1].textContent = t("tabAttack");
    refs.tabs[2].textContent = t("tabMev");
    refs.prevBtn.textContent = t("prev");
    refs.nextBtn.textContent = t("next");
    refs.langBtn.textContent = t("langBtn");
    refs.bubbleTitle.textContent = t("bubbleTitle");
    refs.bubbleSubtitle.textContent = t("bubbleSubtitle");
    refs.legendAttack.textContent = t("bubbleLegendAttack");
    refs.legendMev.textContent = t("bubbleLegendMev");
    refs.bubbleFootRight.textContent = t("bubbleFootRight");
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
    render();
  }

  function renderStats() {
    var total = state.incidents.length;
    var attacks = state.incidents.filter(function (x) { return x.classification === "ATTACK"; }).length;
    var mev = state.incidents.filter(function (x) { return x.classification === "NON_ATTACK_MEV"; }).length;
    var latest = state.incidents[0] ? formatTime(state.incidents[0].incident_time) : "-";
    refs.total.textContent = String(total);
    refs.attacks.textContent = String(attacks);
    refs.mev.textContent = String(mev);
    refs.updated.textContent = latest;
    refs.bubbleFootLeft.textContent = t("bubbleFootLeft") + total;
    document.querySelector(".foot").innerHTML = t("foot") + '<span id="last-updated">' + latest + "</span>" + t("footTail");
    refs.updated = document.getElementById("last-updated");
  }

  function renderList() {
    var total = state.filtered.length;
    var start = (state.page - 1) * state.pageSize;
    var pageItems = state.filtered.slice(start, start + state.pageSize);
    var end = Math.min(start + state.pageSize, total);

    if (pageItems.length === 0) {
      refs.list.innerHTML = '<div class="empty">' + t("noResult") + "</div>";
    } else {
      refs.list.innerHTML = pageItems
        .map(function (item) {
          var usd = normalizeUsd(item.usd_loss_label);
          var caption = item.usd_loss_caption || "N/A";
          var typeHtml = item.classification === "ATTACK"
            ? '<span class="pill attack">' + t("attackTag") + "</span>"
            : '<span class="pill mev">' + t("mevTag") + "</span>";
          var verifyHtml = item.verified
            ? '<span class="pill ok">' + t("verified") + "</span>"
            : '<span class="pill warn">' + t("pending") + "</span>";
          return (
            '<article class="item">' +
            '<div class="item-title">' + item.title + "</div>" +
            '<div class="meta">' + typeHtml + verifyHtml + "<span>" + formatTime(item.incident_time) + "</span><span>ID: " + item.id.slice(0, 8) + "...</span></div>" +
            '<div class="row"><div><div class="usd">' + usd + "</div><div class=\"meta\">" + caption + "</div></div>" +
            '<a href="report.html?id=' + encodeURIComponent(item.id) + '" class="btn">' + t("view") + "</a></div>" +
            "</article>"
          );
        })
        .join("");
    }

    refs.pagerInfo.textContent = total === 0 ? "0 / 0" : (start + 1) + "-" + end + " / " + total;
    refs.prevBtn.disabled = state.page <= 1;
    refs.nextBtn.disabled = end >= total;
  }

  function seededNoise(id) {
    var h = 0;
    for (var i = 0; i < id.length; i += 1) h = (h * 33 + id.charCodeAt(i)) >>> 0;
    return (h % 1000) / 1000;
  }

  function buildChartPoints() {
    var minTs = Infinity;
    var maxTs = -Infinity;
    state.incidents.forEach(function (x) {
      var ts = new Date(x.incident_time).getTime();
      if (!Number.isNaN(ts)) {
        if (ts < minTs) minTs = ts;
        if (ts > maxTs) maxTs = ts;
      }
    });
    if (!Number.isFinite(minTs) || !Number.isFinite(maxTs) || minTs === maxTs) {
      minTs = Date.now() - 86400000;
      maxTs = Date.now();
    }

    chart.points = state.incidents.map(function (item, idx) {
      var ts = new Date(item.incident_time).getTime();
      if (Number.isNaN(ts)) ts = minTs;
      var loss = parseUsdToNumber(item.usd_loss_label);
      var amount = Math.max(0, loss);
      var size = 4 + Math.min(28, Math.log10(amount + 10) * 4.3);
      var n = seededNoise(item.id);
      return {
        id: item.id,
        title: item.title,
        ts: ts,
        t: (ts - minTs) / (maxTs - minTs),
        y: 0.15 + n * 0.75,
        r: size,
        type: item.classification,
        phase: idx * 0.37 + n * 4
      };
    });
  }

  function resizeCanvas() {
    if (!chart.canvas) return;
    var rect = chart.canvas.getBoundingClientRect();
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    chart.canvas.width = Math.floor(rect.width * dpr);
    chart.canvas.height = Math.floor(rect.height * dpr);
    chart.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawChart() {
    if (!chart.ctx || !chart.canvas) return;
    chart.frame += 1;
    var ctx = chart.ctx;
    var w = chart.canvas.clientWidth;
    var h = chart.canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);

    var pad = { l: 30, r: 18, t: 16, b: 28 };
    var ww = w - pad.l - pad.r;
    var hh = h - pad.t - pad.b;

    ctx.strokeStyle = "#e4ebf6";
    ctx.lineWidth = 1;
    for (var gy = 0; gy <= 4; gy += 1) {
      var yy = pad.t + (hh / 4) * gy;
      ctx.beginPath();
      ctx.moveTo(pad.l, yy);
      ctx.lineTo(w - pad.r, yy);
      ctx.stroke();
    }

    ctx.fillStyle = "#74839b";
    ctx.font = "12px Segoe UI, sans-serif";
    ctx.fillText(t("bubbleAxisPast"), pad.l, h - 8);
    var recentWidth = ctx.measureText(t("bubbleAxisRecent")).width;
    ctx.fillText(t("bubbleAxisRecent"), w - pad.r - recentWidth, h - 8);

    chart.points.forEach(function (p) {
      var x = pad.l + p.t * ww;
      var drift = Math.sin(chart.frame * 0.025 + p.phase) * 5;
      var y = pad.t + (1 - p.y) * hh + drift;
      var color = p.type === "ATTACK" ? "rgba(231, 96, 96, 0.35)" : "rgba(70, 153, 233, 0.35)";
      var stroke = p.type === "ATTACK" ? "rgba(215, 77, 77, 0.8)" : "rgba(53, 133, 214, 0.85)";
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    chart.raf = requestAnimationFrame(drawChart);
  }

  function initChart() {
    chart.canvas = document.getElementById("bubble-canvas");
    if (!chart.canvas) return;
    chart.ctx = chart.canvas.getContext("2d");
    resizeCanvas();
    buildChartPoints();
    if (chart.raf) cancelAnimationFrame(chart.raf);
    drawChart();
  }

  function render() {
    renderList();
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
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    refs.nextBtn.addEventListener("click", function () {
      var maxPage = Math.ceil(state.filtered.length / state.pageSize);
      if (state.page >= maxPage) return;
      state.page += 1;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    refs.langBtn.addEventListener("click", function () {
      lang = I18N && I18N.setLang(lang === "zh" ? "en" : "zh");
      paintStaticText();
      renderStats();
      render();
    });

    window.addEventListener("resize", function () {
      resizeCanvas();
    });
  }

  function loadData() {
    return fetch("data/incidents.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("failed to load incidents");
        return res.json();
      })
      .then(function (data) {
        state.incidents = Array.isArray(data) ? data : [];
        renderStats();
        applyFilter();
        initChart();
      })
      .catch(function (err) {
        refs.list.innerHTML = '<div class="empty">Data error: ' + err.message + "</div>";
      });
  }

  paintStaticText();
  bindEvents();
  loadData();
})();
