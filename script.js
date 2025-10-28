/* =========================================================================
   DepoTech - CLEAN BASE + LOGIN + GENEL BİLGİLER (Final)
   ========================================================================== */
(() => {
  "use strict";

  // --- Yardımcılar ---
  const log = (...args) => console.log("[DT]", ...args);
  const warn = (...args) => console.warn("[DT]", ...args);
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else fn();
  };

  // --- Global ad alanı ---
  const DT = {
    version: "2025.10.29-final",

    // Sayfa başlatıcı (router)
    autoInit() {
      // ---- LOGIN ZORUNLULUĞU KONTROLÜ ----
      const isLoginPage = location.pathname.toLowerCase().includes("login");
      if (!localStorage.getItem("logged") && !isLoginPage) {
        location.href = "login.html";
        return;
      }

      const path = (location.pathname || "").toLowerCase();
      const file = path.split("/").pop() || "index.html";
      log("page:", file);

      const map = {
        "index.html": DT.initIndex,
        "login.html": DT.initLogin,
        "giris.html": DT.initLogin,

        // Diğer sayfalar için şimdilik stub (hata vermesin)
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

      // Loader'ı kapat
      const overlay = document.getElementById("loadingOverlay");
      if (overlay) overlay.style.display = "none";
      const loading = document.getElementById("loadingScreen");
      if (loading) loading.style.display = "none";
      const main = document.getElementById("mainScreen");
      if (main) main.style.display = "block";

      // Genel bilgileri doldur
      DT.populateGeneralInfo({
        lat: 38.8483,    // Bünyan
        lon: 35.86,
        newsApiKey: null // TODO: Haber API eklenecek: https://newsdata.io ...
      });
    },

    // ---- LOGIN ----
    initLogin() {
      log("initLogin()");
      const select = document.getElementById("loginUsername");
      if (!select) return;

      // Kullanıcı listesini select'e doldur
      DT.users.forEach((u) => {
        const opt = document.createElement("option");
        opt.value = u.user;
        opt.textContent = u.user;
        select.appendChild(opt);
      });
    },

    // ---- GENEL BİLGİLER (Tarih, Hava, USD/EUR, Gram Altın) ----
    async populateGeneralInfo(opts = {}) {
      const lat = opts.lat ?? 38.8483;
      const lon = opts.lon ?? 35.86;
      const newsApiKey = opts.newsApiKey ?? null; // şimdilik kullanılmıyor (TODO)

      const elDate = document.getElementById("date");
      const elWeather = document.getElementById("weather");
      const elUSD = document.getElementById("usd");
      const elEUR = document.getElementById("eur");
      const elGold = document.getElementById("gold");
      const elNews = document.getElementById("news");

      // 1) Tarih
      if (elDate) {
        const now = new Date();
        elDate.textContent = now.toLocaleString("tr-TR", {
          weekday: "long", day: "2-digit", month: "long", year: "numeric"
        });
      }

      // Güvenli fetch JSON
      const safeFetchJson = async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error("HTTP " + res.status);
          return await res.json();
        } catch (err) {
          console.warn("[DT] fetch error:", url, err);
          return null;
        }
      };

      // 2) Hava durumu (Open-Meteo)
      (async () => {
        const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Europe%2FIstanbul`;
        const data = await safeFetchJson(omUrl);
        if (data && data.current_weather) {
          const { temperature, windspeed, weathercode } = data.current_weather;
          const codeMap = {
            0: "Açık", 1: "Parçalı az bulutlu", 2: "Parçalı çok bulutlu", 3: "Bulutlu",
            45: "Sis", 48: "Donan sis", 51: "Hafif çisenti", 53: "Çisenti", 55: "Kuvvetli çisenti",
            61: "Hafif yağmur", 63: "Yağmur", 65: "Kuvvetli yağmur",
            71: "Hafif kar", 73: "Kar", 75: "Kuvvetli kar",
            80: "Sağanak", 81: "Kuvvetli sağanak", 82: "Şiddetli sağanak",
            95: "Gök gürültülü sağanak", 96: "Dolu ihtimali", 99: "Kuvvetli dolu"
          };
          const desc = codeMap[weathercode] ?? "Hava bilgisi";
          if (elWeather) elWeather.textContent = `${desc}, ${temperature}°C (rüzgâr ${windspeed} km/s)`;
        } else {
          if (elWeather) elWeather.textContent = "Hava verisi alınamadı";
        }
      })();

      // 3) Döviz ve Gram Altın  (exchangerate.host)
(async () => {

  // USD → TRY
  const usd = await safeFetchJson(`https://api.exchangerate.host/latest?base=USD&symbols=TRY`);
  if (usd && usd.rates && usd.rates.TRY) {
    elUSD.textContent = usd.rates.TRY.toLocaleString("tr-TR",{maximumFractionDigits:2}) + " TL";
  } else {
    elUSD.textContent = "—";
  }

  // EUR → TRY
  const eur = await safeFetchJson(`https://api.exchangerate.host/latest?base=EUR&symbols=TRY`);
  if (eur && eur.rates && eur.rates.TRY) {
    elEUR.textContent = eur.rates.TRY.toLocaleString("tr-TR",{maximumFractionDigits:2}) + " TL";
  } else {
    elEUR.textContent = "—";
  }

  // ALTIN (XAU → TRY → GRAM)
  const xau = await safeFetchJson(`https://api.exchangerate.host/latest?base=XAU&symbols=TRY`);
  if (xau && xau.rates && xau.rates.TRY) {
    const ounceTry = xau.rates.TRY;
    const gram = ounceTry / 31.1034768;
    elGold.textContent = gram.toLocaleString("tr-TR",{maximumFractionDigits:2}) + " TL";
  } else {
    elGold.textContent = "—";
  }

})();



      // 4) HABERLER (TODO)
      // TODO: Haber API eklenecek: https://newsdata.io ...
      if (elNews && newsApiKey == null) {
        // Şimdilik kullanıcıya bilgi verelim:
        elNews.textContent = "Haberler için ücretsiz API anahtarı eklenecek.";
      }
    },

    // ---- STUBLAR (ileri aşamada doldurulacak) ----
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

  // --- Sabit kullanıcı listesi (login) ---
  DT.users = [
    { user: "okan kotan", pass: "okan123" },
    { user: "alper taşçı", pass: "alper321" },
    { user: "kübra delisoy", pass: "kübra456" },
    { user: "ünsal ünal", pass: "ünsal654" },
    { user: "ömer yüzgeç", pass: "ömer789" },
  ];

  // --- Login butonu handler'ı ---
  window.handleLogin = function () {
    const user = document.getElementById("loginUsername")?.value.trim() || "";
    const pass = document.getElementById("loginPassword")?.value.trim() || "";
    const err = document.getElementById("loginError");

    const ok = DT.users.find((u) => u.user === user && u.pass === pass);
    if (!ok) {
      if (err) {
        err.style.display = "block";
        err.textContent = "Hatalı kullanıcı adı veya şifre.";
      }
      return;
    }
    // Giriş başarılı
    try { localStorage.setItem("logged", "1"); } catch {}
    location.href = "index.html";
  };

  // --- Index menüsü için yardımcılar (onclick kullanılıyor) ---
  window.navigate = function (url) {
    if (!url) return;
    location.href = url;
  };

  window.toggleMenu = function (btn) {
    if (!btn) return;
    const list = btn.nextElementSibling;
    if (!list) return;
    list.style.display = (list.style.display === "none" || !list.style.display) ? "block" : "none";
  };

  // Debug için erişim
  window.DT = DT;

  // Başlat
  onReady(() => DT.autoInit());
})();
