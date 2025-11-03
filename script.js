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
      DT.populateCikisBekleyen();
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
      if (data.veresiye) {
  // Veresiye tutar TL olarak gelir
  setText("veresiyetutar", data.veresiye);
} else {
  setText("veresiyetutar", "0,00 TL");
}

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

populateCikisBekleyen: async function() {
  const url = "https://script.google.com/macros/s/AKfycbzY7jYafKU-DuUBUqq6vj89_sLKSbCmT8c-Fen77HnxB1h7Ji7HzCZmKH8LQMZCz-04/exec?type=cikisBekleyen";
  const data = await safeFetchJson(url);
  if (!data || !data.cikisBekleyen) return;

  const p = data.cikisBekleyen;
  setText("cikis-gubre", p.gubre ?? "0");
  setText("cikis-yem", p.yem ?? "0");
  setText("cikis-tohum", p.tohum ?? "0");
  setText("cikis-motorin", p.motorin ?? "0");
  setText("cikis-ziraiilac", p.ziraiIlac ?? "0");
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

// === Peşin Satış Modülü ===
DT.pesin = (function(){
  const API = "https://script.google.com/macros/s/AKfycbzY7jYafKU-DuUBUqq6vj89_sLKSbCmT8c-Fen77HnxB1h7Ji7HzCZmKH8LQMZCz-04/exec";

  // UI
  const rowContainer = () => document.getElementById("satisKayitlariContainer");
  const addRowBtn    = () => document.getElementById("btnAddSatisRow");

  // Kaynak listeler
  let STOCK_CODES = []; // Stok Listesi!A
  let STOCK_NAMES = []; // Stok Listesi!B

  // Ekrandaki satır state’i
  const state = {
    rows: [] // {el, codeSel, nameSel, qtyInp, priceInp, totalInp}
  };

  // --- Helpers ---
  const fmt = (n) => {
    const v = Number(n)||0;
    return v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  async function getJSON(url){
    try{
      const r = await fetch(url, {cache:"no-store"});
      if (!r.ok) throw new Error("HTTP "+r.status);
      return await r.json();
    }catch(e){ console.warn("[DT][pesin] fetch", e); return null; }
  }

  // Kod -> Ad & Fiyat
  async function autofillByCode(row){
    const code = row.codeSel.value || "";
    if (!code) return;

    // Adı doldur (Stok Listesi)
    const idx = STOCK_CODES.indexOf(code);
    if (idx >= 0) row.nameSel.value = STOCK_NAMES[idx] || "";

    // Fiyatı doldur
    const j = await getJSON(`${API}?action=findPriceByCode&code=${encodeURIComponent(code)}`);
    const price = j?.price ?? "";
    row.priceInp.value = price !== "" ? Number(price) : "";
    recalcRow(row);
  }

  // Ad -> Kod & Fiyat
  async function autofillByName(row){
    const name = row.nameSel.value || "";
    if (!name) return;

    const idx = STOCK_NAMES.indexOf(name);
    if (idx >= 0) row.codeSel.value = STOCK_CODES[idx] || "";

    await autofillByCode(row);
  }

  // Toplam = qty × price
  function recalcRow(row){
    const q = Number(row.qtyInp.value || "0");
    const p = Number(row.priceInp.value || "0");
    const t = q * p;
    row.totalInp.value = fmt(t);
  }

  // Fiyat değiştiğinde Fiyat Listesi’ni güncelle
  async function pushPriceToSheet(row){
    const code = row.codeSel.value || "";
    if (!code) return;
    const price = Number(row.priceInp.value || "0");
    await getJSON(`${API}?action=updatePriceByCode&code=${encodeURIComponent(code)}&price=${encodeURIComponent(price)}`);
  }

  // Satır DOM’u oluştur
  function createRowDom(initial = {code:"", name:"", qty:"", price:"", total:""}){
    const wrap = document.createElement("div");
    wrap.className = "satis-row";
    wrap.style.display = "grid";
    wrap.style.gridTemplateColumns = "1.2fr 2fr 1fr 1.2fr 1.2fr 40px";
    wrap.style.gap = "8px";
    wrap.style.alignItems = "center";
    wrap.style.padding = "6px 0";

    // Stok Kodu (select)
    const codeSel = document.createElement("select");
    codeSel.className = "form-control";
    codeSel.innerHTML = `<option value="">Seçiniz…</option>` + STOCK_CODES.map(v=>`<option>${v}</option>`).join('');
    codeSel.value = initial.code || "";

    // Stok Adı (select)
    const nameSel = document.createElement("select");
    nameSel.className = "form-control";
    nameSel.innerHTML = `<option value="">Seçiniz…</option>` + STOCK_NAMES.map(v=>`<option>${v}</option>`).join('');
    nameSel.value = initial.name || "";

    // Miktar (input number)
    const qtyInp = document.createElement("input");
    qtyInp.type = "number";
    qtyInp.step = "any";
    qtyInp.className = "form-control";
    qtyInp.value = initial.qty ?? "";

    // Birim Fiyat (input number, güncellenebilir)
    const priceInp = document.createElement("input");
    priceInp.type = "number";
    priceInp.step = "any";
    priceInp.className = "form-control";
    priceInp.value = initial.price ?? "";

    // Toplam (readonly)
    const totalInp = document.createElement("input");
    totalInp.readOnly = true;
    totalInp.className = "form-control";
    totalInp.value = initial.total !== undefined && initial.total !== "" ? fmt(initial.total) : "";

    // Sil butonu
    const delBtn = document.createElement("button");
    delBtn.className = "btn";
    delBtn.innerHTML = "✖";
    delBtn.title = "Satırı sil";

    wrap.appendChild(codeSel);
    wrap.appendChild(nameSel);
    wrap.appendChild(qtyInp);
    wrap.appendChild(priceInp);
    wrap.appendChild(totalInp);
    wrap.appendChild(delBtn);

    const row = { el:wrap, codeSel, nameSel, qtyInp, priceInp, totalInp };
    // Eventler
    codeSel.addEventListener("change", ()=>autofillByCode(row));
    nameSel.addEventListener("change", ()=>autofillByName(row));
    qtyInp.addEventListener("input", ()=>recalcRow(row));
    priceInp.addEventListener("input", ()=>{ recalcRow(row); });
    priceInp.addEventListener("change", ()=>pushPriceToSheet(row));
    delBtn.addEventListener("click", ()=>{
      wrap.remove();
      const i = state.rows.indexOf(row);
      if (i>=0) state.rows.splice(i,1);
    });

    // İlk hesap
    recalcRow(row);
    return row;
  }

  function addRow(initial){
    const row = createRowDom(initial);
    state.rows.push(row);
    rowContainer()?.appendChild(row.el);
  }

  // Kaydet (satırlar) — A,B,G,H,I blok olarak yazar
  async function saveRows(){
    const payload = state.rows.map(r=>{
      const code  = r.codeSel.value || "";
      const name  = r.nameSel.value || "";
      const qty   = Number(r.qtyInp.value || "0");
      const price = Number(r.priceInp.value || "0");
      const total = qty * price;
      return { code, name, qty, price, total };
    });
    const url = `${API}?action=setPesinRows&rows=${encodeURIComponent(JSON.stringify(payload))}`;
    const j = await getJSON(url);
    if (j?.success){
      alert(`Satırlar kaydedildi (${j.rows}).`);
    } else {
      alert("Kaydet hatası!");
    }
  }

  // Başlangıç: dropdown verileri ve mevcut satırları yükle
  async function init(){
    // 1) Stok listeleri
    const s = await getJSON(`${API}?action=getStockLists`);
    STOCK_CODES = s?.codes || [];
    STOCK_NAMES = s?.names || [];

    // 2) Mevcut satırları çek ve bas
    const r = await getJSON(`${API}?action=getPesinRows`);
    const rows = r?.rows || [];
    rows.forEach(obj => addRow(obj));

    // 3) “Satır Ekle” butonu
    addRowBtn()?.addEventListener("click", ()=> addRow({}));

    // 4) Dışarıya kaydet fonksiyonu aç (istersen butona bağlarız)
    window.savePesinRows = saveRows;
  }

  return { init, addRow, saveRows };
})();

// Router tarafında:
DT.initPesin = function(){
  console.log("[DT] initPesin()");
  DT.pesin.init();
};

