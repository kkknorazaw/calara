(function () {
  var I18N = window.CalaraI18n;
  var lang = I18N ? I18N.initDefault() : "zh";

  var TEXT = {
    zh: {
      navPricing: "定价",
      navResearch: "研究",
      navLicense: "授权",
      heroTitle: "每一笔攻击，都需要被看见并被解释。",
      heroDesc: "面向安全团队与项目方的事故情报首页。你可以直接搜索事件、按类型筛选，并快速进入完整报告页。",
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
      langBtn: "中文 / EN"
    },
    en: {
      navPricing: "Pricing",
      navResearch: "Research",
      navLicense: "License",
      heroTitle: "Every exploit should be seen and explained.",
      heroDesc: "An incident intelligence dashboard for security teams. Search, filter, and open full reports in one click.",
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
      langBtn: "EN / 中文"
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
    navLicense: document.getElementById("nav-license")
  };

  function t(key) {
    return (TEXT[lang] && TEXT[lang][key]) || key;
  }

  function normalizeUsd(v) {
    if (!v) return "Unknown";
    return String(v).replace("$$", "$");
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
    document.querySelector(".foot").innerHTML = t("foot") + '<span id="last-updated">' + latest + "</span>" + t("footTail");
    refs.updated = document.getElementById("last-updated");
  }

  function render() {
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
      })
      .catch(function (err) {
        refs.list.innerHTML = '<div class="empty">Data error: ' + err.message + "</div>";
      });
  }

  paintStaticText();
  bindEvents();
  loadData();
})();
