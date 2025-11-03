/* =========================================================================
   DepoTech - FINAL (Login + Genel Bilgi + Sevkler + Paneller + Zirai İlaç)
   ========================================================================== */
(() => {
  "use strict";

  // ---- yardımcılar ----
  const log  = (...a) => console.log("[DT]", ...a);
  const warn = (...a) => console.warn("[DT]", ...a);
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else fn();
  };
  const $ = (id) => document.getElementById(id);
  const setText = (id, val) => { const el = $(id); if (el) el.textContent = val; };

  const safeFetchJson = async (url) => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } catch (err) {
      warn("fetch error:", url, err);
      return null;
    }
  };

  const DT = {
    version: "2025.11.03-final",

    // ---- Router ----
    autoInit() {
      const isLoginPage = location.pathname.toLowerCase().includes("login");
      if (!localStorage.getItem("logged") && !isLoginPage) {
        location.href = "login.html";
        return;
      }

      const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      log("page:", file);

      const map = {
        "index.html": DT.initIndex,
        "login.html": DT.initLogin,
        "giris.html": DT.initLogin,

        "pesin.html": DT.initPesin,
        "veresiye.html": DT.initVeresiye,
        "cikis.html": DT.initCikis,
        "cikis-kayit.html": DT.initCikisKayit,
        "kayitlar.html": DT.initKayitlar,
        "liste.html": DT.initListe,
        "stok-ekle.html": DT.initStokEkle,
        "stok-gor.html": DT.initStokGor,
        "stok-guncelle.html": DT.initStokGuncelle,
        "talep.html": DT.initTalep,
        "tekrar.html": DT.initTekrar,
        "iptal.html": DT.initIptal,
        "fiyat.html": DT.initFiyat,
        "hamaliye.html": DT.initHamaliye,
        "ortak.html": DT.initOrtak,
        "ortak-disi.html": DT.initOrtakDisi,
        "sayim.html": DT.initSayim,
      };

      const fn = map[file] || (() => {});
      try { fn(); } catch (e) { warn("Init error:", e); }
    },

    // ---- INDEX ----
    initIndex() {
      log("initIndex()");

      const overlay = $("loadingOverlay");
      if (overlay) overlay.style.display = "none";
      const loading = $("loadingScreen");
      if (loading) loading.style.display = "none";
      const main = $("mainScreen");
      if (main) main.style.display = "block";

      DT.populateGeneralInfo({ lat: 38.8483, lon: 35.86 });
      DT.populateSevkler(); // 15 Günlük sevk + veresiye + paneller
    },

    // ---- 15 Günlük Sevkler + Veresiye Tutarı + Paneller ----
    async populateSevkler() {
      const url = "https://script.google.com/macros/s/AKfycbzY7jYafKU-DuUBUqq6vj89_sLKSbCmT8c-Fen77HnxB1h7Ji7HzCZmKH8LQMZCz-04/exec";
      const data = await safeFetchJson(url);
      if (!data) return;

      // --- 15 Günlük sevkler + veresiye tutarı ---
      setText("sevkgubre",  data.gubre   ?? "—");
      setText("sevkyem",    data.yem     ?? "—");
      setText("sevktom",    data.tohum   ?? "—");
      setText("sevkmot",    data.motorin ?? "—");
      setText("sevkzrai",   data.ziraiilac ?? "—");  // ✅ Zirai ilaç eklendi
      setText("veresiyetutar", data.veresiye ?? "—");

      // --- Çıkış Bekleyen paneli ---
      if (data.cikisBekleyen) {
        setText("cikis-gubre",   data.cikisBekleyen.gubre   ?? "0");
        setText("cikis-yem",     data.cikisBekleyen.yem     ?? "0");
        setText("cikis-tohum",   data.cikisBekleyen.tohum   ?? "0");
        setText("cikis-motorin", data.cikisBekleyen.motorin ?? "0");
      }

      // --- Veresiye Kayıtları paneli ---
      if (data.veresiyePanel) {
        setText("veresiye-gubre",   data.veresiyePanel.gubre   ?? "0");
        setText("veresiye-yem",     data.veresiyePanel.yem     ?? "0");
        setText("veresiye-tohum",   data.veresiyePanel.tohum   ?? "0");
        setText("veresiye-zirai", data.veresiyePanel.ziraiilac ?? "0");
        setText("veresiye-motorin", data.veresiyePanel.motorin ?? "0");
      }
    },

    // ---- Login ----
    initLogin() {
      log("initLogin()");
      const select = $("loginUsername");
      if (!select) return;
      DT.users.forEach((u) => {
        const opt = document.createElement("option");
        opt.value = u.user;
        opt.textContent = u.user;
        select.appendChild(opt);
      });
    },

    // ---- Genel Bilgi (tarih + hava) ----
    async populateGeneralInfo({ lat = 38.8483, lon = 35.86 } = {}) {
      const elDate = $("date");
      const elWeather = $("weather");

      if (elDate) {
        const now = new Date();
        elDate.textContent = now.toLocaleString("tr-TR", {
          weekday: "long", day: "2-digit", month: "long", year: "numeric",
        });
      }

      if (elWeather) {
        const api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Europe%2FIstanbul`;
        const data = await safeFetchJson(api);
        if (data && data.current_weather) {
          const { temperature, windspeed, weathercode } = data.current_weather;
          const codeMap = {
            0:"Açık",1:"Az bulutlu",2:"Parçalı bulutlu",3:"Bulutlu",
            45:"Sis",48:"Donan sis",51:"Hafif çisenti",53:"Çisenti",
            61:"Hafif yağmur",63:"Yağmur",65:"Kuvvetli yağmur",
            71:"Hafif kar",73:"Kar",75:"Kuvvetli kar",
            80:"Sağanak",81:"Kuvvetli sağanak",82:"Şiddetli sağanak",
            95:"Gök gürültülü",99:"Kuvvetli dolu"
          };
          const desc = codeMap[weathercode] ?? "Hava bilgisi yok";
          elWeather.textContent = `${desc}, ${temperature}°C (rüzgâr ${windspeed} km/s)`;
        } else {
          elWeather.textContent = "Hava verisi alınamadı";
        }
      }
    },

    // ---- Diğer sayfa stub'ları ----
    initPesin() { log("initPesin()"); },
    initVeresiye() { log("initVeresiye()"); },
    initCikis() { log("initCikis()"); },
    initCikisKayit() { log("initCikisKayit()"); },
    initKayitlar() { log("initKayitlar()"); },
    initListe() { log("initListe()"); },
    initStokEkle() { log("initStokEkle()"); },
    initStokGor() { log("initStokGor()"); },
    initStokGuncelle() { log("initStokGuncelle()"); },
    initTalep() { log("initTalep()"); },
    initTekrar() { log("initTekrar()"); },
    initIptal() { log("initIptal()"); },
    initFiyat() { log("initFiyat()"); },
    initHamaliye() { log("initHamaliye()"); },
    initOrtak() { log("initOrtak()"); },
    initOrtakDisi() { log("initOrtakDisi()"); },
    initSayim() { log("initSayim()"); },
  };

  // ---- Sabit kullanıcı listesi ----
  DT.users = [
    { user: "okan kotan",  pass: "okan123" },
    { user: "alper taşçı", pass: "alper321" },
    { user: "kübra delisoy", pass: "kübra456" },
    { user: "ünsal ünal",  pass: "ünsal654" },
    { user: "ömer yüzgeç", pass: "ömer789" },
  ];

  // ---- Login fonksiyonu / Menü yardımcıları ----
  window.handleLogin = function () {
    const user = $("loginUsername")?.value.trim() || "";
    const pass = $("loginPassword")?.value.trim() || "";
    const err  = $("loginError");

    const ok = DT.users.find((u) => u.user === user && u.pass === pass);
    if (!ok) {
      if (err) {
        err.style.display = "block";
        err.textContent = "Hatalı kullanıcı adı veya şifre.";
      }
      return;
    }
    localStorage.setItem("logged", "1");
    location.href = "index.html";
  };

  window.navigate = (url) => { if (url) location.href = url; };
  window.toggleMenu = (btn) => {
    if (!btn) return;
    const list = btn.nextElementSibling;
    if (list) list.style.display = (list.style.display === "none" || !list.style.display) ? "block" : "none";
  };

  // ---- başlat ----
  window.DT = DT;
  onReady(() => DT.autoInit());
})();
