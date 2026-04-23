(function () {
  const state = {
    incidents: [],
    filtered: [],
    query: "",
    type: "all",
    page: 1,
    pageSize: 12
  };

  const refs = {
    total: document.getElementById("stat-total"),
    attacks: document.getElementById("stat-attack"),
    mev: document.getElementById("stat-mev"),
    updated: document.getElementById("last-updated"),
    query: document.getElementById("search"),
    list: document.getElementById("incident-list"),
    pagerInfo: document.getElementById("pager-info"),
    prevBtn: document.getElementById("prev-page"),
    nextBtn: document.getElementById("next-page"),
    tabs: Array.from(document.querySelectorAll(".tab"))
  };

  function normalizeUsd(v) {
    if (!v) return "Unknown";
    return v.replace("$$", "$");
  }

  function formatTime(iso) {
    if (!iso) return "Unknown";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(d);
  }

  function applyFilter() {
    const q = state.query.trim().toLowerCase();
    state.filtered = state.incidents.filter((item) => {
      const typePass = state.type === "all" || item.classification === state.type;
      if (!typePass) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        normalizeUsd(item.usd_loss_label).toLowerCase().includes(q)
      );
    });
    state.page = 1;
    render();
  }

  function renderStats() {
    const total = state.incidents.length;
    const attacks = state.incidents.filter((x) => x.classification === "ATTACK").length;
    const mev = state.incidents.filter((x) => x.classification === "NON_ATTACK_MEV").length;
    const latest = state.incidents[0] ? formatTime(state.incidents[0].incident_time) : "-";
    refs.total.textContent = String(total);
    refs.attacks.textContent = String(attacks);
    refs.mev.textContent = String(mev);
    refs.updated.textContent = latest;
  }

  function typeTag(item) {
    if (item.classification === "ATTACK") {
      return '<span class="pill attack">攻击事件</span>';
    }
    return '<span class="pill mev">MEV</span>';
  }

  function verifyTag(item) {
    return item.verified
      ? '<span class="pill ok">已验证</span>'
      : '<span class="pill warn">待确认</span>';
  }

  function render() {
    const total = state.filtered.length;
    const start = (state.page - 1) * state.pageSize;
    const pageItems = state.filtered.slice(start, start + state.pageSize);
    const end = Math.min(start + state.pageSize, total);

    if (pageItems.length === 0) {
      refs.list.innerHTML = '<div class="empty">没有匹配结果，请尝试其他关键词。</div>';
    } else {
      refs.list.innerHTML = pageItems
        .map((item) => {
          const usd = normalizeUsd(item.usd_loss_label);
          const caption = item.usd_loss_caption || "暂无说明";
          return `
          <article class="item">
            <div class="item-title">${item.title}</div>
            <div class="meta">
              ${typeTag(item)}
              ${verifyTag(item)}
              <span>${formatTime(item.incident_time)}</span>
              <span>ID: ${item.id.slice(0, 8)}...</span>
            </div>
            <div class="row">
              <div>
                <div class="usd">${usd}</div>
                <div class="meta">${caption}</div>
              </div>
              <a href="${item.url}" class="btn">查看报告</a>
            </div>
          </article>`;
        })
        .join("");
    }

    refs.pagerInfo.textContent = total === 0 ? "0 / 0" : `${start + 1}-${end} / ${total}`;
    refs.prevBtn.disabled = state.page <= 1;
    refs.nextBtn.disabled = end >= total;
  }

  async function loadData() {
    const res = await fetch("data/incidents.json", { cache: "no-store" });
    if (!res.ok) throw new Error("failed to load incidents.json");
    const data = await res.json();
    state.incidents = Array.isArray(data) ? data : [];
    renderStats();
    applyFilter();
  }

  function bindEvents() {
    refs.query.addEventListener("input", (e) => {
      state.query = e.target.value;
      applyFilter();
    });

    refs.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        refs.tabs.forEach((x) => x.classList.remove("active"));
        tab.classList.add("active");
        state.type = tab.dataset.type;
        applyFilter();
      });
    });

    refs.prevBtn.addEventListener("click", () => {
      if (state.page <= 1) return;
      state.page -= 1;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    refs.nextBtn.addEventListener("click", () => {
      const maxPage = Math.ceil(state.filtered.length / state.pageSize);
      if (state.page >= maxPage) return;
      state.page += 1;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  bindEvents();
  loadData().catch((err) => {
    refs.list.innerHTML = `<div class="empty">首页数据加载失败：${err.message}</div>`;
  });
})();
