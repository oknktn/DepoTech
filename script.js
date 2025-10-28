/* =========================================================================
   DepoTech - CLEAN BASE JS (v1)
   Amaç: Tertemiz başlangıç. Tüm sayfalara no-op init stub’ları.
   Sonraki adımlar: pesin.html entegrasyonu (Sheets okuma/yazma) vb.
   ========================================================================== */

(() => {
  "use strict";

  // --- Küçük yardımcılar ---
  const log = (...args) => console.log("[DT]", ...args);
  const warn = (...args) => console.warn("[DT]", ...args);
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  // --- Global namespace (tek yerden erişim) ---
  const DT = {
    version: "clean-base-1",
    noop: () => {},
    util: { log, warn },

    /**
     * Sayfa bazlı init router.
     * Dosya adına göre ilgili init fonksiyonunu çağırır.
     */
    autoInit() {
      const path = (location.pathname || "").toLowerCase();
      const file = path.split("/").pop() || "index.html";
      log("page:", file);

      // HTML dosya adına göre init eşlemesi
      const map = {
        "index.html": DT.initIndex,
        "login.html": DT.initLogin,
        "giris.html": DT.initLogin, // bazı projelerde login=giris
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

      const initFn = map[file] || DT.noop;
      try {
        initFn();
      } catch (err) {
        warn("Init error:", err);
      }
    },

    // --- Sabit kullanıcı listesi ---
DT.users = [
  { user: "okan kotan", pass: "okan123" },
  { user: "alper taşçı", pass: "alper321" },
  { user: "kübra delisoy", pass: "kübra456" },
  { user: "ünsal ünal", pass: "ünsal654" },
  { user: "ömer yüzgeç", pass: "ömer789" },
];

// --- Login sayfasını başlat ---
DT.initLogin = function() {
  log("initLogin()");

  const select = document.getElementById("loginUsername");
  if (!select) return;

  // Kullanıcı listesini select'e doldur
  DT.users.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.user;
    opt.textContent = u.user;
    select.appendChild(opt);
  });
};

// --- Login işlem fonksiyonu ---
window.handleLogin = function () {
  const user = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();
  const errorDiv = document.getElementById("loginError");

  const found = DT.users.find(u => u.user === user && u.pass === pass);

  if (!found) {
    errorDiv.style.display = "block";
    errorDiv.textContent = "Hatalı kullanıcı adı veya şifre.";
    return;
  }

  // Giriş başarılı → index'e yönlendir
  window.location.href = "index.html";
};


    initIndex() {
  log("initIndex()");

  // Yükleme ekranlarını gizle
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.style.display = "none";

  const loading = document.getElementById("loadingScreen");
  if (loading) loading.style.display = "none";

  // Ana ekranı göster
  const main = document.getElementById("mainScreen");
  if (main) main.style.display = "block";
},


    // buradan sonrası modül modül gerçek işlemler için doldurulacak:
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

    // --- İLERİDE KULLANILACAK API KATMANI İSKELETİ ---
    api: {
      /**
       * Apps Script tarafındaki Code.gs ile konuşmak için iskelet.
       * Sonraki adımda doldurulacak (pesin.html akışında).
       */
      async call(action, payload = {}) {
        // Not: Bu tabanda hiçbir network çağrısı yok. Sıfırdan tertemiz.
        // Sonraki adımda fetch/google.script.run ekleyeceğiz.
        log("api.call (stub)", action, payload);
        return null;
      },
    },
  };

  // pencereye aç (debug için)
  window.DT = DT;

  // sayfa hazır olunca otomatik init
  onReady(() => DT.autoInit());
})();

