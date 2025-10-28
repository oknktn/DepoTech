/* =========================================================================
   DepoTech - CLEAN BASE + LOGIN (v2)
   ========================================================================== */
(() => {
  "use strict";

  const log = (...args) => console.log("[DT]", ...args);
  const warn = (...args) => console.warn("[DT]", ...args);
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else fn();
  };

  const DT = {
    version: "v2",

    autoInit() {
      const path = (location.pathname || "").toLowerCase();
      const file = path.split("/").pop() || "index.html";
      log("page:", file);
      const map = {
        "index.html": DT.initIndex,
        "login.html": DT.initLogin,
        "giris.html": DT.initLogin,
      };
      const fn = map[file] || (()=>{});
      try { fn(); } catch(e){ warn(e); }
    },

    initIndex() {
      log("initIndex()");
      const overlay = document.getElementById("loadingOverlay");
      if (overlay) overlay.style.display = "none";
      const loading = document.getElementById("loadingScreen");
      if (loading) loading.style.display = "none";
      const main = document.getElementById("mainScreen");
      if (main) main.style.display = "block";
    }
  };

  /* --- SABİT KULLANICI LİSTESİ --- */
  DT.users = [
    { user: "okan kotan", pass: "okan123" },
    { user: "alper taşçı", pass: "alper321" },
    { user: "kübra delisoy", pass: "kübra456" },
    { user: "ünsal ünal", pass: "ünsal654" },
    { user: "ömer yüzgeç", pass: "ömer789" },
  ];

  /* --- LOGIN INIT --- */
  DT.initLogin = function () {
    log("initLogin()");
    const select = document.getElementById("loginUsername");
    if (!select) return;
    DT.users.forEach(u=>{
      const opt=document.createElement("option");
      opt.value=u.user;
      opt.textContent=u.user;
      select.appendChild(opt);
    });
  };

  /* --- LOGIN HANDLER --- */
  window.handleLogin = function(){
    const user = document.getElementById("loginUsername").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const err  = document.getElementById("loginError");

    const ok = DT.users.find(u => u.user===user && u.pass===pass);
    if(!ok){
      err.style.display="block";
      err.textContent="Hatalı kullanıcı adı veya şifre.";
      return;
    }
    window.location.href="index.html";
  };

  window.DT = DT;
  onReady(()=>DT.autoInit());
})();
