(function () {
  var fallback = "zh";

  function normalize(lang) {
    return lang === "en" ? "en" : "zh";
  }

  function getLang() {
    return fallback;
  }

  function setLang(lang) {
    var v = normalize(lang);
    document.documentElement.lang = v === "zh" ? "zh-CN" : "en";
    return v;
  }

  function initDefault() {
    return setLang(getLang());
  }

  window.CalaraI18n = {
    getLang: getLang,
    setLang: setLang,
    initDefault: initDefault
  };
})();
