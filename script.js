
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

    // --- SAYFA STUB’LARI (hepsi boş; hiçbir şey yapmaz, hata çıkarmaz) ---
    initIndex() {
      // index mevcut haliyle çalışacak. Buraya müdahale yok.
      log("initIndex()");
    },
    initLogin() {
      // login mevcut haliyle çalışacak. Buraya müdahale yok.
      log("initLogin()");
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
