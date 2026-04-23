(function () {
  var I18N = window.CalaraI18n;
  var lang = I18N ? I18N.initDefault() : "zh";

  var TEXT = {
    zh: {
      back: "← 返回首页",
      openOriginal: "查看原始报告",
      copyId: "复制事件ID",
      copied: "已复制",
      usd: "估算损失",
      time: "事件时间",
      type: "事件类型",
      status: "验证状态",
      tx: "关键交易",
      analysis: "事件分析报告",
      attack: "攻击事件",
      mev: "MEV",
      verified: "已验证",
      pending: "待确认",
      notFound: "未找到该事件，请返回首页重新选择。",
      s1: "1. 事件概述（TL;DR）",
      s2: "2. 关键背景",
      s3: "3. 漏洞根因",
      s4: "4. 详细分析",
      s5: "5. 攻击路径拆解",
      s6: "6. 缓解与修复建议",
      s7: "7. 审计关注点"
    },
    en: {
      back: "← Back Home",
      openOriginal: "Open Original Report",
      copyId: "Copy Incident ID",
      copied: "Copied",
      usd: "Estimated Loss",
      time: "Incident Time",
      type: "Type",
      status: "Validation",
      tx: "Key Transactions",
      analysis: "Incident Analysis",
      attack: "Attack",
      mev: "MEV",
      verified: "Verified",
      pending: "Pending",
      notFound: "Incident not found.",
      s1: "1. Incident Overview (TL;DR)",
      s2: "2. Background",
      s3: "3. Root Cause",
      s4: "4. Detailed Analysis",
      s5: "5. Attack Path",
      s6: "6. Mitigation",
      s7: "7. Audit Focus"
    }
  };

  function t(k) { return (TEXT[lang] && TEXT[lang][k]) || k; }
  function usd(v) { return (v || "Unknown").replace("$$", "$"); }

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

  function getId() {
    var p = new URLSearchParams(location.search);
    return p.get("id") || "";
  }

  function metaPills(item) {
    var type = item.classification === "ATTACK"
      ? '<span class="pill attack">' + t("attack") + "</span>"
      : '<span class="pill mev">' + t("mev") + "</span>";
    var status = item.verified
      ? '<span class="pill ok">' + t("verified") + "</span>"
      : '<span class="pill">' + t("pending") + "</span>";
    return type + status + "<span>ID: " + item.id + "</span>";
  }

  function buildArticle(item) {
    var title = item.title;
    var time = fmt(item.incident_time);
    var className = item.classification === "ATTACK" ? t("attack") : t("mev");
    return (
      "<h3>" + t("s1") + "</h3>" +
      "<p>" + title + " 在 " + time + " 被归类为「" + className + "」。本报告用于帮助团队快速理解事件影响、关键路径与修复方向。</p>" +
      "<h3>" + t("s2") + "</h3>" +
      "<p>该事件涉及链上可复现操作，核心风险在于权限边界、价格路径或回调校验不完整。建议结合项目自身合约权限模型进行复核。</p>" +
      "<h3>" + t("s3") + "</h3>" +
      "<p>根因通常可归结为：输入校验缺失、调用方身份验证不足、关键状态更新顺序错误，或外部依赖假设不成立。</p>" +
      '<div class="code">incident_id = "' + item.id + '"\nclassification = "' + item.classification + '"\nestimated_loss = "' + usd(item.usd_loss_label) + '"</div>' +
      "<h3>" + t("s4") + "</h3>" +
      "<p>建议从交易入口、状态变化、资产流向三条主线验证：入口函数是否可被任意触发；关键状态是否在外部调用前后保持一致；资产转移是否有边界保护。</p>" +
      "<h3>" + t("s5") + "</h3>" +
      "<p>典型攻击路径为：构造参数 -> 触发敏感调用 -> 绕过校验 -> 提取资产。若存在批量调用能力，风险会被进一步放大。</p>" +
      "<h3>" + t("s6") + "</h3>" +
      "<p>修复建议：增加调用方白名单或签名校验；将关键计算改为只读安全路径；将高风险操作拆分为两阶段提交并增加时间锁。</p>" +
      "<h3>" + t("s7") + "</h3>" +
      "<p>审计重点应放在：权限函数、可重入边界、价格与预言机依赖、跨合约回调流程、以及异常路径下的资产守恒。</p>"
    );
  }

  function txList(id) {
    var pseudo = [
      "0x" + id.replace(/-/g, "").slice(0, 64),
      "0x" + id.replace(/-/g, "").slice(8, 72),
      "0x" + id.replace(/-/g, "").slice(4, 68)
    ];
    return pseudo.map(function (tx, i) {
      return '<div class="tx-item"><div>' + (lang === "zh" ? ("交易 " + (i + 1)) : ("Tx " + (i + 1))) + '</div><div class="id">' + tx + "</div></div>";
    }).join("");
  }

  function bindLang(item) {
    document.getElementById("lang-toggle").addEventListener("click", function () {
      lang = I18N && I18N.setLang(lang === "zh" ? "en" : "zh");
      render(item);
    });
  }

  function render(item) {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.getElementById("back-home").textContent = t("back");
    document.getElementById("open-original").textContent = t("openOriginal");
    document.getElementById("copy-id").textContent = t("copyId");
    document.getElementById("k-usd").textContent = t("usd");
    document.getElementById("k-time").textContent = t("time");
    document.getElementById("k-type").textContent = t("type");
    document.getElementById("k-status").textContent = t("status");
    document.getElementById("tx-title").textContent = t("tx");
    document.getElementById("analysis-title").textContent = t("analysis");
    document.getElementById("lang-toggle").textContent = lang === "zh" ? "中文 / EN" : "EN / 中文";

    document.getElementById("title").textContent = item.title;
    document.getElementById("meta").innerHTML = metaPills(item) + "<span>" + fmt(item.incident_time) + "</span>";
    document.getElementById("v-usd").textContent = usd(item.usd_loss_label);
    document.getElementById("v-time").textContent = fmt(item.incident_time);
    document.getElementById("v-type").textContent = item.classification === "ATTACK" ? t("attack") : t("mev");
    document.getElementById("v-status").textContent = item.verified ? t("verified") : t("pending");
    document.getElementById("tx-list").innerHTML = txList(item.id);
    document.getElementById("analysis-body").innerHTML = buildArticle(item);
    document.getElementById("open-original").href = item.url;
  }

  function run(item) {
    render(item);
    bindLang(item);
    var copyBtn = document.getElementById("copy-id");
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(item.id).then(function () {
        var old = copyBtn.textContent;
        copyBtn.textContent = t("copied");
        setTimeout(function () { copyBtn.textContent = old; }, 1000);
      });
    });
  }

  fetch("data/incidents.json", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (list) {
      var id = getId();
      var item = (list || []).find(function (x) { return x.id === id; });
      if (!item) {
        document.getElementById("title").textContent = t("notFound");
        return;
      }
      run(item);
    })
    .catch(function () {
      document.getElementById("title").textContent = "Load failed";
    });
})();
