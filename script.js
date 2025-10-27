// ========================================
// 0. POSTACI (APPS SCRIPT) AYARLARI
// ========================================
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxsgjfD7IrO3U0fpUvaFKxC6Ocxya4gwDPjeWQCEHDjnc8XofRvXZezW3GMEqEs2j4E/exec';
let currentUserEmail = localStorage.getItem('currentUserEmail') || 'Bilinmiyor';
let lastLoginTime = localStorage.getItem('lastLoginTime');

/**
 * Apps Script'ten veri okumak için genel yardımcı fonksiyon.
 * @param {string} action Apps Script'teki çağrılacak fonksiyon adı (Örn: 'getOrtaklar')
 * @returns {Promise<Object>} API'den gelen veriyi döndürür
 */
async function fetchData(action) {
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors', // CORS modunu etkinleştir
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: action })
        });

        if (!response.ok) {
            throw new Error(`HTTP Hata! Statü: ${response.status}`);
        }

        const result = await response.json();

        if (result.success === false) {
             throw new Error(result.message || 'API tarafından başarısız yanıt geldi.');
        }
        
        return result;

    } catch (error) {
        console.error(`Fetch Hatası - İşlem: ${action}`, error);
        // Hata durumunda kullanıcıya görsel bildirim gösterilebilir
        alert(`Veri yüklenemedi! Lütfen E-Tablo ve Apps Script bağlantısını kontrol edin. (${error.message})`);
        return { success: false, data: [] };
    }
}

/**
 * Apps Script'e veri yazmak için genel yardımcı fonksiyon.
 * @param {string} action Apps Script'teki çağrılacak fonksiyon adı (Örn: 'saveNewOrtak')
 * @param {Object} data Kaydedilecek veri
 * @returns {Promise<Object>} API'den gelen yanıtı döndürür
 */
async function sendData(action, data) {
     try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: action, data: data }) // Hem action hem de data gönder
        });

        if (!response.ok) {
            throw new Error(`HTTP Hata! Statü: ${response.status}`);
        }

        const result = await response.json();

        if (result.success === false) {
             throw new Error(result.message || 'API tarafından başarısız yanıt geldi.');
        }
        
        return result;

    } catch (error) {
        console.error(`Send Hatası - İşlem: ${action}`, error);
        alert(`Kayıt işlemi BAŞARISIZ oldu! Hata: (${error.message})`);
        return { success: false, message: 'Kayıt başarısız.' };
    }
}


/* ======================================== */
/* 1. GÜVENLİK KONTROLÜ (OTURUM KORUMA) */
/* ======================================== */
// ... (geri kalan kodlar) ...

/* ======================================== */
/* 1. GÜVENLİK KONTROLÜ (OTURUM KORUMA) */
/* ======================================== */
// Bu kod, diğer her şeyden ÖNCE çalışır.
(function() {
    // Tarayıcının hafızasında 'currentUser' diye bir kayıt var mı?
    const currentUser = localStorage.getItem('currentUser');
    // Şu an bulunduğumuz sayfanın adı ne? (örn: "index.html", "login.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; 

    if (!currentUser && currentPage !== 'login.html') {
        // 1. GİRİŞ YAPILMAMIŞ VE login.html sayfasında DEĞİLSE:
        // Kullanıcıyı login.html'e zorla yönlendir.
        console.log("Kullanıcı girişi yok, login sayfasına yönlendiriliyor...");
        window.location.href = 'login.html';
        
    } else if (currentUser && currentPage === 'login.html') {
        // 2. GİRİŞ YAPILMIŞ AMA login.html sayfasındaysa:
        // Kullanıcıyı ana sayfaya yönlendir, burada işi yok.
        console.log("Kullanıcı zaten giriş yapmış, ana sayfaya yönlendiriliyor...");
        window.location.href = 'index.html';
    }
    // 3. Diğer tüm durumlarda (Giriş yapılmış ve normal sayfada, VEYA Giriş yapılmamış ve login sayfasında)
    // normal şekilde devam et.
})();


/* ======================================== */
/* 2. KULLANICI VERİTABANI VE GLOBALLER */
/* ======================================== */
// Bu, bizim gizli olmayan şifre listemiz
const userDatabase = {
  "Okan Kotan": "Okan123",
  "Alper Taşçı": "Alper321",
  "Kübra Delisoy": "Kübra456",
  "Ünsal Ünal": "Ünsal654",
  "Ömer Yüzgeç": "Ömer789"
};

// --- Stoklar için Global Listeler ---
const birimListesiStokEkle = ['Adet', 'Kg', 'Koli', 'Lt', 'Metre', 'Paket', 'Ton'];
const ambalajListesi = ['Adet', 'Cc', 'Gr', 'Kg', 'Lt', 'Metre', 'ML', 'Ton'];
const stokTuruListesi = ['Halk Sağlığı', 'Kimyevi Gübre', 'Madeni Yağ', 'Market', 'Motorin', 'Sıvı Gübre', 'Sulama', 'Tohum', 'Toz Gübre', 'Yem', 'Zirai İlaç'];
const birimKosullari = {
    'Adet': ['1'], 'Cc': ['200','250','500'], 'Gr': ['50','80','100','400','500','750','800','1750'],
    'Kg': ['1','3','4','5','9','10','16','17.5','25','40','50','1000'],
    'Lt': ['0.1','1','3','5','8','10','17','20'], 'Metre': ['5'], 'ML': ['500'], 'Ton': ['1']
};

// --- Diğer Global Değişkenler (Tüm kodda kullanılacak) ---
let modalOrtakListesi = [];
let fisNumaralari = []; 
let selectedFileContent = null;
let excelProcessed = false;
let currentFilter = { status: 'Tümü', musteri: 'Tümü' };
/* ======================================== */
/* 3. TEMEL FONKSİYONLAR (TÜM SAYFALAR) */
/* ======================================== */

/**
 * Menü linklerinden tıklandığında sayfaya yönlendirme yapar.
 * @param {string} page Gidilecek sayfanın adı.
 */
function navigate(page) {
  window.location.href = page;
}

/**
 * Ana Menüye (index.html) döner.
 */
function goBack() {
  window.location.href = 'index.html';
}

/**
 * String JSON verisini güvenli bir şekilde parse eder (İleride API için gerekebilir).
 */
function safeJsonParse(response) {
   if (typeof response === 'string') {
       try { return JSON.parse(response); }
       catch (e) { console.error("JSON Parse Hatası:", e, "Gelen Veri:", response); return { success: false, message: "Sunucudan gelen veri formatı hatalı." }; }
   }
   return response;
}

// Loading overlay fonksiyonları
function showLoadingOverlay(message = "İşleniyor...") {
    const overlay = document.getElementById('loadingOverlay');
    const textElement = overlay ? overlay.querySelector('.loading-text') : null;
    if (overlay && textElement) { 
        textElement.textContent = message; 
        overlay.style.display = 'flex'; 
    }
}
function hideLoadingOverlay() {
     const overlay = document.getElementById('loadingOverlay');
     if (overlay) overlay.style.display = 'none';
}

/**
 * Dinamik olarak eklenmiş bir satırı ID'sine göre siler.
 * @param {string} rowId Silinecek satırın ID'si.
 */
function removeDynamicRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) { 
        row.remove(); 
    }
}

/**
 * Belirli bir select kutusunu verilen seçeneklerle doldurur.
 * @param {string} selectId Doldurulacak select elementinin ID'si.
 * @param {Array} options Seçenekler dizisi.
 */
function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return; // Element yoksa çık
    
    select.innerHTML = '<option value="">Seçiniz</option>'; // Önce temizle
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

/* ======================================== */
/* 4. GİRİŞ / ÇIKIŞ FONKSİYONLARI */
/* ======================================== */

/**
 * login.html sayfasını hazırlar (Kullanıcı listesini doldurur).
 * Bu fonksiyon en sonda DOMContentLoaded içinde çağrılacak.
 */
function initLoginPage() {
    const select = document.getElementById('loginUsername');
    if (!select) return; // Sadece login sayfasında çalış
    
    // userDatabase'deki kullanıcı adlarını (key'leri) al
    const usernames = Object.keys(userDatabase);
    
    // Select kutusunu doldur
    usernames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

/**
 * "Giriş Yap" butonuna tıklandığında çalışır (login.html).
 */
function handleLogin() {
    const u = document.getElementById('loginUsername');
    const p = document.getElementById('loginPassword');
    const e = document.getElementById('loginError');
    
    if (!u || !p || !e) return; // Gerekli elemanlar yoksa çık

    const selectedUsername = u.value;
    const enteredPassword = p.value;

    if (!selectedUsername) {
        e.textContent = "Lütfen kullanıcı adınızı seçin.";
        e.style.display = 'block';
        return;
    }
    
    if (!enteredPassword) {
        e.textContent = "Lütfen şifrenizi girin.";
        e.style.display = 'block';
        return;
    }

    // Kullanıcı adını ve şifreyi veritabanıyla (objeyle) kontrol et
    if (userDatabase[selectedUsername] && userDatabase[selectedUsername] === enteredPassword) {
        // GİRİŞ BAŞARILI
        console.log(`Kullanıcı "${selectedUsername}" başarıyla giriş yaptı.`);
        e.style.display = 'none';
        
        // Kullanıcı adını tarayıcının yerel deposuna kaydet
        localStorage.setItem('currentUser', selectedUsername);
        
        // Ana sayfaya (index.html) yönlendir
        window.location.href = 'index.html';
        
    } else {
        // GİRİŞ BAŞARISIZ
        console.warn("Hatalı şifre denemesi. Kullanıcı: " + selectedUsername);
        e.textContent = "Kullanıcı adı veya şifre hatalı.";
        e.style.display = 'block';
        p.value = ''; // Şifre alanını temizle
    }
}

/**
 * "Çıkış Yap" butonuna tıklandığında çalışır (Diğer sayfalardaki header).
 */
function handleLogout() {
    if (confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
        console.log("Kullanıcı çıkış yaptı.");
        // Kayıtlı kullanıcıyı tarayıcıdan sil
        localStorage.removeItem('currentUser');
        // Login sayfasına yönlendir
        window.location.href = 'login.html';
    }
}
/* ======================================== */
/* 5. index.html FONKSİYONLARI */
/* ======================================== */

/**
 * Kenar paneldeki tarih bilgisini günceller (index.html için).
 */
function updateDate() {
  const dateElement = document.getElementById('date');
  if(dateElement) {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateElement.textContent = now.toLocaleDateString('tr-TR', options);
  }
}

/**
 * Tıklanan menü grubunun altındaki listeyi açar veya kapatır (index.html için).
 */
function toggleMenu(button) {
  const ul = button.nextElementSibling;
  if(ul && ul.tagName === 'UL') {
      const isVisible = ul.style.display === 'block';
      ul.style.display = isVisible ? 'none' : 'block';
  }
}

/**
 * Kenar paneldeki diğer bilgileri yükler (index.html için).
 */
function loadInfoPanelData() {
  const weatherEl = document.getElementById('weather');
  const usdEl = document.getElementById('usd');
  const eurEl = document.getElementById('eur');
  const goldEl = document.getElementById('gold');
  const newsEl = document.getElementById('news');

  if(weatherEl) weatherEl.textContent = 'Yükleniyor...';
  if(usdEl) usdEl.textContent = 'Yükleniyor...';
  if(eurEl) eurEl.textContent = 'Yükleniyor...';
  if(goldEl) goldEl.textContent = 'Yükleniyor...';
  if(newsEl) newsEl.textContent = 'Haberler yükleniyor...';
  
  // TODO: API'den verileri çek (Google Sheets değil, 3. parti API'ler)
  // TODO: API'den "Çıkış Bekleyen" ve "Veresiye Kayıtları" verilerini çek (Google Sheets API)
}

/* ======================================== */
/* 6. pesin.html FONKSİYONLARI */
/* ======================================== */

/**
 * 'pesin.html' sayfasını hazırlar.
 * Para sayımı ve düzeltme için boş satırları oluşturur.
 */
function initPesinPage() {
  const banknotlar = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25];
  const paraContainer = document.getElementById("paraSayiContainer");
  const duzeltmeContainer = document.getElementById("duzeltmeContainer");

  // 1. Para Sayımı Satırlarını Oluştur
  if(paraContainer) {
      paraContainer.innerHTML = '';
      banknotlar.forEach(deger => {
        const row = document.createElement("div");
        row.className = "para-sayi-grid";
        row.innerHTML = `<input class="form-control" value="${deger.toFixed(2)}" readonly /> <input class="form-control" type="number" value="0" oninput="runAllCalculations()" /> <input class="form-control" value="0.00" readonly />`;
        paraContainer.appendChild(row);
      });
  }
  
  // 2. Düzeltme Satırlarını Oluştur (5 tane boş)
  if(duzeltmeContainer) {
      duzeltmeContainer.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const row = document.createElement("div");
        row.className = "duzeltme-grid";
        row.innerHTML = `<input class="form-control" placeholder="Açıklama..." oninput="runAllCalculations()" /> <input class="form-control" type="number" value="0" oninput="runAllCalculations()" />`;
        duzeltmeContainer.appendChild(row);
      }
  }
  
  // 3. "Satır Ekle" butonunu aktifleştir
  const btnAdd = document.getElementById("btnAddSatisRow");
  if(btnAdd) {
      btnAdd.innerHTML = '<i class="fas fa-plus"></i> Satır Ekle';
      btnAdd.disabled = false; // Artık API beklemiyoruz
  }
  
  // 4. İlk hesaplamayı çalıştır (Tüm toplamları 0.00 yapar)
  runAllCalculations();
}

/**
 * Satış kayıtları tablosuna yeni, boş bir satır ekler (pesin.html).
 */
function addSatisRow() {
    const container = document.getElementById("satisKayitlariContainer");
    if(!container) return; // Sadece pesin.html'de çalış
    
    const row = document.createElement("div");
    row.className = "satis-item-row";
    
    // TODO: Stok listesi API'den (Google Sheets) yüklenecek ve <option> olarak eklenecek
    row.innerHTML = `
        <select class="form-control" onchange="stokSecildi(this)">
          <option value="">Seç...</option>
          <option value="S1">STK001</option>
          </select>
        <select class="form-control" onchange="stokSecildi(this)">
          <option value="">Stok Adı Seç...</option>
          <option value="ÖRNEK STOK">ÖRNEK STOK</option>
          </select>
        <input class="form-control" type="number" placeholder="Miktar" oninput="runAllCalculations()" value="0" />
        <input class="form-control" type="number" placeholder="Birim Fiyat" oninput="runAllCalculations()" value="0.00" />
        <input class="form-control" value="0.00" readonly />
        <button class="btn-remove-row" onclick="removeSatisRow(this)"><i class="fas fa-trash"></i></button>`;
    container.appendChild(row);
}

/**
 * Tıklanan satış satırını siler (pesin.html).
 */
function removeSatisRow(button) {
    button.closest('.satis-item-row')?.remove();
    runAllCalculations();
}

/**
 * Stok seçildiğinde çalışır (pesin.html).
 */
function stokSecildi(selectElement) {
    console.log("Stok seçildi: " + selectElement.value);
    // TODO: API ile stok adı/kodu eşleştirme ve fiyat getirme
}

/**
 * Tüm Kasa hesaplamalarını çalıştırır (pesin.html).
 */
function runAllCalculations() {
    let paraToplami = 0, duzeltmeToplami = 0, satisToplami = 0;
    
    // 1. Para Sayımı Toplamı
    document.querySelectorAll("#paraSayiContainer .para-sayi-grid").forEach(row => {
        const banknot = parseFloat(row.children[0]?.value || 0);
        const adet = parseFloat(row.children[1]?.value || 0);
        const toplamInput = row.children[2];
        const satirToplam = banknot * adet;
        if(toplamInput) toplamInput.value = satirToplam.toFixed(2);
        paraToplami += satirToplam;
    });
    const paraToplamEl = document.getElementById("paraSayilariToplam");
    const kasaToplamEl = document.getElementById("kasaToplami");
    if(paraToplamEl) paraToplamEl.value = paraToplami.toFixed(2);
    if(kasaToplamEl) kasaToplamEl.value = paraToplami.toFixed(2);

    // 2. Düzeltme Toplamı
    document.querySelectorAll("#duzeltmeContainer .duzeltme-grid").forEach(row => {
        const tutar = parseFloat(row.children[1]?.value || 0);
        duzeltmeToplami += tutar;
    });
    const duzeltmeToplamEl = document.getElementById("duzeltmeKayitlariToplam");
    if(duzeltmeToplamEl) duzeltmeToplamEl.value = duzeltmeToplami.toFixed(2);

    // 3. Satış Toplamı
    document.querySelectorAll("#satisKayitlariContainer .satis-item-row").forEach(row => {
        const miktar = parseFloat(row.children[2]?.value || 0);
        const fiyat = parseFloat(row.children[3]?.value || 0);
        const toplamInput = row.children[4];
        const satirToplam = miktar * fiyat;
        if(toplamInput) toplamInput.value = satirToplam.toFixed(2);
        satisToplami += satirToplam;
    });
    const nakitSatisKasaEl = document.getElementById("nakitSatisKasaDurumu");
    const nakitSatisDuzeltmeEl = document.getElementById("nakitSatisDuzeltme");
    if(nakitSatisKasaEl) nakitSatisKasaEl.value = satisToplami.toFixed(2);
    if(nakitSatisDuzeltmeEl) nakitSatisDuzeltmeEl.value = satisToplami.toFixed(2);
    
    // 4. Kasa Durumu Hesapla
    const kasaBakiyeEl = document.getElementById("kasaBakiyesi");
    if (!kasaBakiyeEl) return; // pesin.html'de değilsek devam etme
    
    const kasaBakiyesi = parseFloat(kasaBakiyeEl.value || 0);
    const durum = kasaBakiyesi - (paraToplami + duzeltmeToplami);
    
    const kasaDurumInput = document.getElementById("kasaDurum");
    const kasaDurumAciklama = document.getElementById("kasaDurumAciklama");
    
    if (kasaDurumInput && kasaDurumAciklama) {
        kasaDurumInput.value = durum.toFixed(2);
        kasaDurumAciklama.style.display = "block";
        kasaDurumAciklama.className = 'kasa-durum-aciklama'; // Reset class
        
        if (durum === 0) { 
            kasaDurumAciklama.textContent = "Kasa Hesabı Tam"; 
            kasaDurumAciklama.classList.add("kasa-tam"); 
        } else if (durum < 0) { 
            kasaDurumAciklama.textContent = `${Math.abs(durum).toFixed(2)} TL Kasa Hesabı Eksik`; 
            kasaDurumAciklama.classList.add("kasa-eksik"); 
        } else { 
            kasaDurumAciklama.textContent = `${Math.abs(durum).toFixed(2)} TL Kasa Hesabı Fazla`; 
            kasaDurumAciklama.classList.add("kasa-fazla"); 
        }
    }
}

/**
 * Kasa raporunu yazdırma işlemini tetikler (pesin.html).
 */
function yazdirKasa() { 
    alert('Yazdırma fonksiyonu henüz aktif değil.'); 
    // TODO: Yazdırma içeriğini hazırla
}

/**
 * Kasa verilerini kaydetme işlemini tetikler (pesin.html).
 */
function kaydetKasa() { 
    alert('Kaydetme fonksiyonu henüz aktif değil.'); 
    // TODO: API'ye veri gönder
}

/* ======================================== */
/* 7. cikis.html FONKSİYONLARI */
/* ======================================== */

/**
 * 'cikis.html' sayfasını hazırlar.
 * Kullanıcı adını ve tarih/fiş no'yu (simüle) ayarlar.
 */
function initCikisFisi() {
    const currentUser = localStorage.getItem('currentUser');
    const tarihEl = document.getElementById('tarih');
    const fisNoEl = document.getElementById('fisNo');
    const kullaniciEl = document.getElementById('kullanici');
    
    if(tarihEl) tarihEl.value = new Date().toLocaleDateString('tr-TR');
    if(fisNoEl) fisNoEl.value = 'CF-XXXX-XXX'; // TODO: API'den gerçek fiş no alınacak
    if(kullaniciEl) kullaniciEl.value = currentUser || 'Bilinmiyor'; // Oturumdan kullanıcı adını al
    
    // TODO: API'den Ortak ve Stok listelerini çekip select kutularını doldur
    console.log("Çıkış fişi ortak ve stok listeleri yükleniyor... (API Bekleniyor)");
}

/**
 * Müşteri tipini (Ortak İçi / Ortak Dışı) değiştirir (cikis.html).
 */
function toggleCustomerType() {
    const btn = document.getElementById('customerTypeBtn');
    const ortakIci = document.getElementById('ortakIciDetails');
    const ortakDisi = document.getElementById('ortakDisiDetails');
    const newCustomerBtn = document.getElementById('newCustomerBtn');
    
    if (!btn || !ortakIci || !ortakDisi || !newCustomerBtn) return;

    const isOI = btn.classList.contains('ortak-ici'); // Mevcut durum "Ortak İçi" mi?
    
    if (isOI) { 
        // Ortak İçi'den Ortak Dışı'na geç
        btn.classList.remove('ortak-ici');
        btn.classList.add('ortak-disi');
        btn.textContent = 'Ortak Dışı';
        ortakIci.classList.remove('active');
        ortakDisi.classList.add('active');
        newCustomerBtn.innerHTML = '<i class="fas fa-plus"></i> Yeni Ortak Dışı Kayıt';
        newCustomerBtn.onclick = openOrtakDisiModal; // Fonksiyonu değiştir
    } else { 
        // Ortak Dışı'dan Ortak İçi'ne geç
        btn.classList.remove('ortak-disi');
        btn.classList.add('ortak-ici');
        btn.textContent = 'Ortak İçi';
        ortakDisi.classList.remove('active');
        ortakIci.classList.add('active');
        newCustomerBtn.innerHTML = '<i class="fas fa-plus"></i> Yeni Ortak Kayıt';
        newCustomerBtn.onclick = openOrtakModal; // Fonksiyonu değiştir
    }
}

/**
 * Stok bilgileri bölümüne yeni bir satır ekler (cikis.html).
 * Not: Bu fonksiyon 'addStockRowGiris' ile çakışmaması için
 * sadece 'stockRowsContainer' ID'li element varsa çalışır.
 */
function addStockRow() {
  const container = document.getElementById('stockRowsContainer');
  if (!container) return; // Sadece cikis.html'de çalışsın
  
  const newRow = document.createElement('div');
  newRow.className = 'stock-row';
  
  // TODO: Stok listesi API'den yüklenecek
  newRow.innerHTML = `
    <div>
        <select class="form-control" onchange="stokSecildi(this)">
            <option value="">Kod Seç...</option>
            <option value="S1">S1</option>
        </select>
    </div>
    <div>
        <select class="form-control" onchange="stokSecildi(this)">
            <option value="">Ad Seç...</option>
            <option value="Ürün A">Ürün A</option>
        </select>
    </div>
    <div>
        <input type="number" class="form-control" placeholder="0" value="0">
    </div>
    <div>
        <select class="form-control">
            <option value="Kg">Kg</option><option value="Ton">Ton</option><option value="Lt">Lt</option><option value="Adet">Adet</option>
        </select>
    </div>
    <button class="remove-stock-btn" onclick="removeStockRow(this)"><i class="fas fa-trash"></i></button>
  `;
  container.appendChild(newRow);
}

/**
 * Bir stok satırını kaldırır (hem cikis.html hem giris.html'de kullanılır).
 * @param {HTMLElement} button Tıklanan silme butonu.
 */
function removeStockRow(button) {
    button.closest('.stock-row')?.remove(); 
}

/**
 * Çıkış fişi formunu kaydetme işlemini başlatır (cikis.html).
 */
function saveForm() {
  // TODO: Google Sheets API'ye veri gönderme
  alert('Form Kaydediliyor... (Henüz API bağlı değil)');
}

/* === cikis.html - Modal Fonksiyonları === */

function openOrtakModal() {
  const modal = document.getElementById('yeniOrtakModal');
  if(modal) {
      modal.querySelector('form')?.reset(); // Formu temizle
      modal.style.display = 'flex';
  }
}
function closeOrtakModal() {
  const modal = document.getElementById('yeniOrtakModal');
  if(modal) modal.style.display = 'none';
}
function saveNewOrtakFromCikis() {
  // TODO: API'ye yeni ortak kaydı
  alert('Yeni Ortak Kaydediliyor... (API Yok)');
  closeOrtakModal();
}

function openOrtakDisiModal() {
   const modal = document.getElementById('yeniOrtakDisiModal');
   if(modal) {
       modal.querySelector('form')?.reset(); // Formu temizle
       modal.style.display = 'flex';
   }
}
function closeOrtakDisiModal() {
   const modal = document.getElementById('yeniOrtakDisiModal');
   if(modal) modal.style.display = 'none';
}
function saveNewOrtakDisiFromCikis() {
  // TODO: API'ye yeni ortak dışı kaydı
  alert('Yeni Ortak Dışı Kaydediliyor... (API Yok)');
  closeOrtakDisiModal();
}

/* ======================================== */
/* 8. tekrar.html & iptal.html FONKSİYONLARI */
/* ======================================== */

/**
 * 'tekrar.html' veya 'iptal.html' için fiş listesini yükler.
 */
function loadFisNumaralari() {
  const selectElement = document.getElementById('fisNoSelect');
  if(!selectElement) return; // İlgili sayfada değilsek çık
  
  selectElement.innerHTML = '<option value="">Yükleniyor...</option>'; 
  
  console.log('Fiş numaraları yükleniyor...');
  // TODO: Google Sheets API'den fiş numaralarını çek (örn: 'Satislar' sayfasından)
  
  // Örnek Veri
  setTimeout(() => { // API çağrısını simüle et
    const fisler = ['CF-2025-001', 'CF-2025-002', 'VF-001']; 
    selectElement.innerHTML = '<option value="">-- Fiş Seçiniz --</option>'; 
    fisler.forEach(fisNo => {
      const option = document.createElement('option');
      option.value = fisNo;
      option.textContent = fisNo;
      selectElement.appendChild(option);
    });
  }, 1000); // 1 saniye bekle
}

/**
 * Seçilen fiş numarasının detaylarını textarea'ya yükler.
 */
function loadFisDetaylari() {
  const selectedFisNo = document.getElementById('fisNoSelect')?.value;
  const detayAlani = document.getElementById('fisDetaylari');
  if (!detayAlani || !selectedFisNo) {
    if(detayAlani) detayAlani.value = '';
    return;
  }
  
  detayAlani.value = 'Yükleniyor...';
  console.log(selectedFisNo + ' için detaylar yükleniyor...');
  // TODO: Google Sheets API'den ilgili fişin verilerini çek
  
  // Örnek veri
  setTimeout(() => {
     detayAlani.value = `Fiş No: ${selectedFisNo}\nTarih: 27.10.2025\nMüşteri: Ahmet Yılmaz\n--------------------\n- Ürün A: 2 adet\n- Ürün B: 5 kg\n--------------------\nToplam: 150.00 TL`;
  }, 500);
}

/**
 * 'tekrar.html' - Fiş içeriğini yazdırma işlemini başlatır.
 */
function tekrarYazdir() {
  const fisIcerigi = document.getElementById('fisDetaylari')?.value;
  if (!fisIcerigi || fisIcerigi === 'Yükleniyor...') {
    alert('Yazdırılacak fiş içeriği bulunamadı veya yüklenmedi.');
    return;
  }
  
  console.log('Fiş içeriği yazdırılıyor...');
  try {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<pre>' + fisIcerigi + '</pre>'); // <pre> formatlamayı korur
      printWindow.document.close(); 
      printWindow.focus(); 
      printWindow.print();
  } catch (e) {
      console.error("Yazdırma hatası:", e);
      alert("Yazdırma penceresi açılamadı. Tarayıcınızın pop-up engelleyicisini kontrol edin.");
  }
}

/**
 * 'iptal.html' - İptal sebebi "Diğer" seçildiğinde özel sebep alanını gösterir/gizler.
 */
function toggleOzelSebep() {
  const sebepSelect = document.getElementById('iptalSebebiSelect');
  const ozelSebepContainer = document.getElementById('ozelSebepContainer');
  const ozelInput = document.getElementById('ozelSebepInput');
  
  if (!sebepSelect || !ozelSebepContainer || !ozelInput) return; // Sadece iptal.html'de çalış
  
  const showOzel = sebepSelect.value === 'Diğer';
  ozelSebepContainer.style.display = showOzel ? 'block' : 'none';
  if (!showOzel) ozelInput.value = ''; // Gizlenince içeriği temizle
}

/**
 * 'iptal.html' - Fiş iptal işlemini kaydeder.
 */
function kaydetIptal() {
  const fisSelect = document.getElementById('fisNoSelect');
  const sebepSelect = document.getElementById('iptalSebebiSelect');
  const ozelInput = document.getElementById('ozelSebepInput');
  
  if (!fisSelect || !sebepSelect || !ozelInput) return; // Sadece iptal.html'de çalış

  const selectedFisNo = fisSelect.value;
  let iptalSebebi = sebepSelect.value;
  
  if (!selectedFisNo) {
    alert('Lütfen iptal edilecek fiş numarasını seçiniz.');
    return;
  }
  if (iptalSebebi === '') {
     alert('Lütfen bir iptal sebebi seçiniz.');
     sebepSelect.focus();
     return; 
  }
  
  if (iptalSebebi === 'Diğer') {
    iptalSebebi = ozelInput.value.trim();
    if (iptalSebebi === '') {
      alert('Lütfen "Diğer" iptal sebebini detaylı olarak yazınız.');
      ozelInput.focus();
      return;
    }
  }
  
  if (!confirm(`"${selectedFisNo}" numaralı fişi "${iptalSebebi}" sebebiyle iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      return;
  }

  console.log(`Fiş ${selectedFisNo} iptal ediliyor. Sebep: ${iptalSebebi}`);
  showLoadingOverlay("İptal Ediliyor...");
  
  // TODO: Google Sheets API'ye iptal işlemini kaydet
  
  setTimeout(() => { // Simülasyon
      hideLoadingOverlay();
      alert('Fiş başarıyla iptal edildi (Simülasyon).');
      // Formu temizle
      fisSelect.value = '';
      document.getElementById('fisDetaylari').value = '';
      sebepSelect.value = '';
      toggleOzelSebep(); 
      loadFisNumaralari(); // Fiş listesini yenile (iptal edilen çıkmalı)
  }, 1500);
}
/* ======================================== */
/* 9. fiyat.html (Fiyat Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * Fiyat listesini yükler ve tabloyu doldurur.
 */
function loadPriceListData() {
  const container = document.getElementById('priceListRowsContainer');
  if(!container) return; // Sadece fiyat.html'de çalış
  
  container.innerHTML = '<i>Yükleniyor...</i>'; 
  
  console.log('Fiyat listesi verileri yükleniyor...');
  // TODO: Google Sheets API'den fiyat listesini çek (örn: 'FiyatListesi' sayfasından)
  
  // Örnek Veri
  setTimeout(() => { // API simülasyonu
    const data = [
      { kod: 'STK001', ad: 'Ürün A (Kg)', satis: 15.50, maliyet: 10.00 },
      { kod: 'STK002', ad: 'Ürün B (Adet)', satis: 120.00, maliyet: 90.00 },
      { kod: 'STK003', ad: 'Hizmet C (Saat)', satis: 250.00, maliyet: 150.00 },
    ];
    
    container.innerHTML = ''; 
    if (data.length === 0) {
        container.innerHTML = '<i>Gösterilecek fiyat verisi bulunamadı.</i>';
        return;
    }

    data.forEach(item => {
      const row = document.createElement('div');
      row.className = 'price-list-row';
      
      const satisFiyati = parseFloat(item.satis || 0).toFixed(2);
      const maliyetFiyati = parseFloat(item.maliyet || 0).toFixed(2);
      
      let karOrani = 0;
      if (parseFloat(maliyetFiyati) > 0) {
        karOrani = ((parseFloat(satisFiyati) - parseFloat(maliyetFiyati)) / parseFloat(maliyetFiyati)) * 100;
      }
      const karOraniFormatted = karOrani.toFixed(2);

      row.innerHTML = `
        <input type="text" class="form-control" value="${item.kod || ''}" readonly>
        <input type="text" class="form-control" value="${item.ad || ''}" readonly>
        <input type="number" step="0.01" class="form-control price-input" value="${satisFiyati}" oninput="calculateProfit(this)">
        <input type="number" step="0.01" class="form-control price-input" value="${maliyetFiyati}" oninput="calculateProfit(this)">
        <input type="text" class="form-control profit-margin" value="${karOraniFormatted}" readonly>
      `;
      container.appendChild(row);
    });
  }, 1500); 
}

/**
 * Bir satırdaki satış fiyatı veya maliyet değiştiğinde kar oranını hesaplar.
 * @param {HTMLElement} inputElement Değişiklik yapılan input.
 */
function calculateProfit(inputElement) {
    const row = inputElement.closest('.price-list-row');
    if (!row) return;

    const satisInput = row.querySelector('input:nth-child(3)');
    const maliyetInput = row.querySelector('input:nth-child(4)');
    const karOraniInput = row.querySelector('input:nth-child(5)');
    if (!satisInput || !maliyetInput || !karOraniInput) return;

    const satisFiyati = parseFloat(satisInput.value) || 0;
    const maliyetFiyati = parseFloat(maliyetInput.value) || 0;

    let karOrani = 0;
    if (maliyetFiyati > 0) {
        karOrani = ((satisFiyati - maliyetFiyati) / maliyetFiyati) * 100;
    }
    
    karOraniInput.value = karOrani.toFixed(2);
}


/**
 * Fiyat listesindeki değişiklikleri kaydeder.
 */
function savePriceList() {
    console.log('Fiyat listesi değişiklikleri kaydediliyor...');
    const rows = document.querySelectorAll('#priceListRowsContainer .price-list-row');
    const dataToSave = Array.from(rows).map(row => ({
        kod: row.querySelector('input:nth-child(1)')?.value,
        satis: parseFloat(row.querySelector('input:nth-child(3)')?.value || 0),
        maliyet: parseFloat(row.querySelector('input:nth-child(4)')?.value || 0)
    }));

    console.log('Kaydedilecek Veri:', dataToSave);
    showLoadingOverlay("Kaydediliyor...");
    
    // TODO: Google Sheets API'ye 'dataToSave' dizisini gönderip güncelleme yap
    // (Örn: `updateSheetData` kullanarak)
    
    setTimeout(() => { // Simülasyon
        hideLoadingOverlay();
        alert('Değişiklikler kaydedildi (Simülasyon).');
    }, 1500);
}

/* ======================================== */
/* 10. veresiye.html FONKSİYONLARI */
/* ======================================== */

/**
 * Veresiye kayıtlarını yükler ve tabloyu doldurur.
 */
function loadVeresiyeData() {
  const tableBody = document.getElementById('veresiyeTableBody');
  if (!tableBody) return; // Sadece veresiye.html'de çalış
  
  tableBody.innerHTML = '<tr><td colspan="12" class="loading-text">Veresiye kayıtları yükleniyor...</td></tr>';
  
  console.log('Veresiye verileri yükleniyor...');
  // TODO: Google Sheets API'den veresiye kayıtlarını çek (örn: 'VeresiyeKayitlari' sayfasından)
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { tarih: '27.10.2025', fisNo: 'VF-001', kullanici: 'Okan K.', satisTuru: 'Veresiye', musteriTipi: 'Ortak İçi', ortakNo: '123', adSoyad: 'Ali Veli', stokKodu: 'STK001', stokAdi: 'Gübre A', miktar: 500, birim: 'Kg', aciklama: 'Teslim edildi' },
      { tarih: '26.10.2025', fisNo: 'VF-002', kullanici: 'Okan K.', satisTuru: 'Veresiye', musteriTipi: 'Ortak Dışı', ortakNo: '', adSoyad: 'Ayşe Fatma', stokKodu: 'STK005', stokAdi: 'Yem B', miktar: 2, birim: 'Ton', aciklama: '' },
    ];
    
    tableBody.innerHTML = ''; 
    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="12" class="loading-text">Gösterilecek veresiye kaydı bulunamadı.</td></tr>';
      return;
    }

    data.forEach(item => {
      const row = tableBody.insertRow(); 
      row.insertCell().textContent = item.tarih || '';
      row.insertCell().textContent = item.fisNo || '';
      row.insertCell().textContent = item.kullanici || '';
      row.insertCell().textContent = item.satisTuru || '';
      row.insertCell().textContent = item.musteriTipi || '';
      row.insertCell().textContent = item.ortakNo || '';
      row.insertCell().textContent = item.adSoyad || '';
      row.insertCell().textContent = item.stokKodu || '';
      row.insertCell().textContent = item.stokAdi || '';
      row.insertCell().textContent = item.miktar || '';
      row.insertCell().textContent = item.birim || '';
      row.insertCell().textContent = item.aciklama || '';
    });
  }, 1500); 
}

/**
 * veresiye.html'deki "Değişiklikleri Kaydet" butonu (şu an pasif)
 */
function kaydetTumDegisiklikleri() {
    console.log('Tablodaki değişiklikler kaydediliyor...');
    alert('Bu özellik henüz aktif değil.');
}


/* ======================================== */
/* 11. liste.html (Çıkış Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * Tarih filtreleme alanını gösterir/gizler (liste.html).
 */
function toggleDateFilter() {
  const filterDiv = document.getElementById('dateFilter');
  if (!filterDiv) return;
  
  const isVisible = filterDiv.style.display === 'flex';
  filterDiv.style.display = isVisible ? 'none' : 'flex';
  
  if (!isVisible) {
    const today = new Date().toISOString().split('T')[0];
    const startEl = document.getElementById('startDate');
    const endEl = document.getElementById('endDate');
    if (startEl && !startEl.value) startEl.value = today;
    if (endEl && !endEl.value) endEl.value = today;
  }
}

/**
 * Belirtilen tarih aralığındaki verileri yükler (liste.html).
 */
function fetchFilteredData() {
  const startDate = document.getElementById('startDate')?.value;
  const endDate = document.getElementById('endDate')?.value;
  
  if (!startDate || !endDate) {
    alert('Lütfen başlangıç ve bitiş tarihlerini seçiniz.');
    return;
  }
  
  console.log(`Veriler ${startDate} ile ${endDate} arası için filtreleniyor...`);
  loadGenericListData({ startDate: startDate, endDate: endDate }); // Genel yükleme fonksiyonunu çağır
}

/**
 * Tüm verileri yükler (filtresiz) (liste.html).
 */
function fetchAllData() {
  console.log('Tüm veriler yükleniyor...');
  loadGenericListData({}); // Genel yükleme fonksiyonunu filtresiz çağır
}

/**
 * Genel çıkış listesi verilerini yükler ve tabloyu doldurur (liste.html).
 * @param {object} filter Filtreleme seçenekleri (örn: {startDate, endDate})
 */
function loadGenericListData(filter = {}) {
  const tableBody = document.getElementById('dataTableBody');
  // Sadece liste.html'de olduğumuzdan emin olalım
  if (!tableBody || !document.querySelector('.list-table-container')) return; 
  
  tableBody.innerHTML = '<tr><td colspan="12" class="loading-text">Liste yükleniyor...</td></tr>'; 
  
  console.log('Liste verileri yükleniyor... Filtre:', filter);
  // TODO: Google Sheets API'den Çıkış Listesi verilerini çek (filter objesini kullanarak)
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { tarih: '27.10.2025', fisNo: 'CF-001', kullanici: 'Okan K.', satisTuru: 'Peşin', musteriTipi: 'Ortak Dışı', ortakNo: '', adSoyad: 'Deniz Can', stokKodu: 'STK002', stokAdi: 'Tohum C', miktar: 100, birim: 'Kg', aciklama: 'Ödendi' },
      { tarih: '26.10.2025', fisNo: 'CF-002', kullanici: 'Okan K.', satisTuru: 'Veresiye', musteriTipi: 'Ortak İçi', ortakNo: '456', adSoyad: 'Zeynep Su', stokKodu: 'STK001', stokAdi: 'Gübre A', miktar: 1, birim: 'Ton', aciklama: '' },
    ];

    // Örnek Filtreleme (API bunu sunucu tarafında yapmalı)
    const filteredData = data.filter(item => {
        if (filter.startDate) {
            const itemDate = item.tarih.split('.').reverse().join('-'); // TR'den ISO'ya basit çevrim
            if (itemDate < filter.startDate) return false;
        }
        if (filter.endDate) {
             const itemDate = item.tarih.split('.').reverse().join('-'); 
             if (itemDate > filter.endDate) return false;
        }
        return true;
    });
    
    tableBody.innerHTML = ''; 
    if (filteredData.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="12" class="loading-text">Belirtilen kriterlere uygun kayıt bulunamadı.</td></tr>';
      return;
    }

    filteredData.forEach(item => {
      const row = tableBody.insertRow(); 
      row.insertCell().textContent = item.tarih || '';
      row.insertCell().textContent = item.fisNo || '';
      row.insertCell().textContent = item.kullanici || '';
      row.insertCell().textContent = item.satisTuru || '';
      row.insertCell().textContent = item.musteriTipi || '';
      row.insertCell().textContent = item.ortakNo || '';
      row.insertCell().textContent = item.adSoyad || '';
      row.insertCell().textContent = item.stokKodu || '';
      row.insertCell().textContent = item.stokAdi || '';
      row.insertCell().textContent = item.miktar || '';
      row.insertCell().textContent = item.birim || '';
      row.insertCell().textContent = item.aciklama || '';
    });
  }, 1000); 
}
/* ======================================== */
/* 12. giris.html (Depo Giriş) FONKSİYONLARI */
/* ======================================== */

/**
 * 'giris.html' sayfasını hazırlar.
 * Kullanıcı adını ve tarihi ayarlar.
 */
function initGirisSayfasi() {
    const currentUser = localStorage.getItem('currentUser');
    const tarihEl = document.getElementById('tarih');
    const kullaniciEl = document.getElementById('kullanici');
    
    if(tarihEl) tarihEl.value = new Date().toLocaleDateString('tr-TR');
    if(kullaniciEl) kullaniciEl.value = currentUser || 'Bilinmiyor';
    
    console.log('Giriş sayfası stok ve ortak listeleri yükleniyor... (API Bekleniyor)');
    // TODO: API'den Ortak ve Stok listelerini çek
    
    // Simülasyon: Butonu aktifleştir
    setTimeout(() => {
        const btnAddStock = document.getElementById('btnAddStock');
        if(btnAddStock) {
            btnAddStock.innerHTML = '<i class="fas fa-plus"></i> Stok Ekle';
            btnAddStock.disabled = false;
        }
    }, 1500); 
}

/**
 * Müşteri tipini (Ortak İçi / Ortak Dışı) değiştirir (giris.html).
 */
function toggleMusteriTipiGiris(tip, clickedButton) {
    const ortakIciPanel = document.getElementById('ortakIciPanel');
    const ortakDisiPanel = document.getElementById('ortakDisiPanel');
    const btnOrtakIci = document.getElementById('btnOrtakIci');
    const btnOrtakDisi = document.getElementById('btnOrtakDisi');
    
    if (!ortakIciPanel || !ortakDisiPanel || !btnOrtakIci || !btnOrtakDisi) return;

    btnOrtakIci.classList.remove('active');
    btnOrtakDisi.classList.remove('active');
    clickedButton.classList.add('active'); // Tıklanan butonu aktifleştir

    ortakIciPanel.style.display = (tip === 'ortak-ici') ? 'block' : 'none';
    ortakDisiPanel.style.display = (tip === 'ortak-disi') ? 'block' : 'none';
}

/**
 * Giriş yapılacak stoklar bölümüne yeni bir satır ekler (giris.html).
 */
function addStockRowGiris() {
  const container = document.getElementById('stockRowsContainer');
  if (!container || !document.querySelector('.entry-container')) return; // Sadece giris.html'de çalışsın
  
  const newRow = document.createElement('div');
  newRow.className = 'stock-row'; 
  
  // TODO: Stok listesi API'den yüklenecek
  newRow.innerHTML = `
      <select class="form-control">
          <option value="">Stok Kodu Seç...</option>
          <option value="S1">S1</option>
      </select>
      <select class="form-control">
          <option value="">Stok Adı Seç...</option>
          <option value="Ürün A">Ürün A</option>
      </select>
      <input type="number" class="form-control" placeholder="0">
      <select class="form-control">
          <option value="Kg">Kg</option>
          <option value="Ton">Ton</option>
          <option value="Lt">Lt</option>
          <option value="Adet">Adet</option>
      </select>
      <button class="btn-remove" onclick="removeStockRow(this)"><i class="fas fa-trash"></i></button>
  `; 
  container.appendChild(newRow);
}

/**
 * Depo giriş kaydını kaydeder (giris.html).
 */
function saveGirisKaydi() {
  console.log('Depo giriş kaydı kaydediliyor...');
  // TODO: Formdaki verileri topla (Müşteri tipi, no/ad, stok satırları)
  // TODO: Google Sheets API'ye verileri gönder
  alert('Giriş kaydı kaydediliyor... (Henüz API bağlı değil)');
}


/* ======================================== */
/* 13. cikis-kayit.html (Depo Çıkış) FONKSİYONLARI */
/* ======================================== */

/**
 * 'cikis-kayit.html' - Müşteri listesini yükler.
 */
function loadMusteriListesiCikis() {
  const selectElement = document.getElementById('musteriSelect');
  if(!selectElement) return; // Sadece cikis-kayit.html'de çalış
  
  selectElement.innerHTML = '<option value="">Yükleniyor...</option>'; 
  console.log('Müşteri listesi yükleniyor (Çıkış Kaydı)...');
  
  // TODO: Google Sheets API'den bekleyen çıkışı olan müşterilerin listesini çek
  // (Hem Ortak İçi hem Ortak Dışı olabilir)
  
  // Örnek Veri
  setTimeout(() => { 
    const musteriler = [
        { value: 'ID1', text: 'Ali Veli (Ortak İçi - 123)' },
        { value: 'ID2', text: 'Ayşe Fatma (Ortak Dışı)' },
        { value: 'ID3', text: 'Zeynep Su (Ortak İçi - 456)' }
    ]; 
    selectElement.innerHTML = '<option value="">-- Müşteri Seçiniz --</option>'; 
    musteriler.forEach(musteri => {
      const option = document.createElement('option');
      option.value = musteri.value; // Belki müşteri ID'si veya AdSoyad olabilir
      option.textContent = musteri.text;
      selectElement.appendChild(option);
    });
  }, 1000); 
}

/**
 * 'cikis-kayit.html' - Seçilen müşterinin bekleyen çıkış detaylarını yükler.
 */
function getDetaylar() {
  const musteriSelect = document.getElementById('musteriSelect');
  const selectedMusteri = musteriSelect?.value;
  const detayTablosuDiv = document.getElementById('detaylarTablosu');
  const tableBody = document.getElementById('dataTableBody');

  if (!musteriSelect || !detayTablosuDiv || !tableBody) return; // İlgili sayfada değilsek çık

  if (!selectedMusteri) {
    detayTablosuDiv.style.display = 'none'; // Müşteri seçili değilse tabloyu gizle
    tableBody.innerHTML = ''; // İçeriği temizle
    return;
  }
  
  detayTablosuDiv.style.display = 'block'; // Tabloyu göster
  tableBody.innerHTML = '<tr><td colspan="8" class="loading-text">Müşteri detayları yükleniyor...</td></tr>'; 
  
  console.log(`Müşteri ${selectedMusteri} için çıkış detayları yükleniyor...`);
  // TODO: Google Sheets API'den seçilen müşterinin bekleyen siparişlerini çek
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { id: 'satir1', tarih: '27.10.2025', kod: 'STK001', ad: 'Gübre A', siparis: 500, birim: 'Kg', cikan: 200 },
      { id: 'satir2', tarih: '26.10.2025', kod: 'STK005', ad: 'Yem B', siparis: 2, birim: 'Ton', cikan: 0 },
      { id: 'satir3', tarih: '25.10.2025', kod: 'STK001', ad: 'Gübre A', siparis: 100, birim: 'Kg', cikan: 100 }, // Bu tamamlanmış
    ];
    
    tableBody.innerHTML = ''; 
    
    const relevantData = data.filter(item => (item.siparis || 0) > (item.cikan || 0)); // Sadece kalanı olanları göster

    if (relevantData.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="8" class="loading-text">Seçilen müşteri için bekleyen çıkış kaydı bulunamadı.</td></tr>';
      return;
    }

    relevantData.forEach(item => {
      const row = tableBody.insertRow();
      row.dataset.rowId = item.id; // Satırı Sheets'teki ID veya satır no ile ilişkilendir
      
      const siparisMiktari = parseFloat(item.siparis || 0);
      const toplamCikan = parseFloat(item.cikan || 0);
      const kalan = siparisMiktari - toplamCikan;

      row.insertCell().textContent = item.tarih || '';
      row.insertCell().textContent = item.kod || '';
      row.insertCell().textContent = item.ad || '';
      row.insertCell().textContent = siparisMiktari; 
      row.insertCell().textContent = item.birim || '';
      row.insertCell().textContent = toplamCikan; 
      row.insertCell().textContent = kalan; 
      row.cells[6].classList.add('kalan-td'); 
      
      const cikanInputCell = row.insertCell();
      cikanInputCell.innerHTML = `<input type="number" class="cikan-miktar-input" placeholder="0" max="${kalan}">`;
      
      if (kalan <= 0) {
          row.style.opacity = "0.6";
          row.querySelector('.cikan-miktar-input').disabled = true;
      }
    });
  }, 1000); 
}

/**
 * 'cikis-kayit.html' - Girilen çıkış miktarlarını kaydeder.
 */
function kaydetCikis() {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr[data-row-id]'); // Sadece veri satırlarını al
    const dataToSave = [];

    rows.forEach(row => {
        const rowId = row.dataset.rowId; 
        const inputElement = row.querySelector('.cikan-miktar-input');
        
        if (inputElement && !inputElement.disabled) {
            const cikanMiktar = parseFloat(inputElement.value) || 0;
            if (cikanMiktar > 0) {
                dataToSave.push({
                    id: rowId, // Hangi satırın güncelleneceği
                    miktar: cikanMiktar // Ne kadar çıkış yapıldığı
                });
            }
        }
    });

    if (dataToSave.length === 0) {
        alert('Kaydedilecek bir çıkış miktarı girilmedi.');
        return;
    }

    console.log('Kaydedilecek Çıkışlar:', dataToSave);
    showLoadingOverlay("Çıkışlar Kaydediliyor...");
    
    // TODO: Google Sheets API'ye 'dataToSave' dizisini gönder.
    // API tarafında: 'VeresiyeKayitlari' sayfasında ilgili satırları ID ile bul
    // ve 'Toplam Çıkan' sütununu güncelle (eski değer + yeni miktar).
    
    setTimeout(() => { // Simülasyon
        hideLoadingOverlay();
        alert('Çıkışlar kaydedildi (Simülasyon).');
        getDetaylar(); // Tabloyu yenile
    }, 1500);
}


/* ======================================== */
/* 14. kayitlar.html (Kayıt Görüntüle) FONKSİYONLARI */
/* ======================================== */

/**
 * 'kayitlar.html' - Filtre butonlarına basıldığında veya select değiştiğinde çalışır.
 */
function applyFilter(status, element) {
  if (element.tagName === 'BUTTON') {
      currentFilter.status = status;
      // Aktif butonu güncelle
      document.querySelectorAll('.filter-bar .btn-filter').forEach(btn => btn.classList.remove('active'));
      element.classList.add('active');
  } else if (element.tagName === 'SELECT') {
      currentFilter.musteri = element.value;
  }
  // Verileri yeni filtreyle yükle
  loadKayitlarData(currentFilter);
}

/**
 * 'kayitlar.html' - Depo Kayıtlarını yükler ve tabloyu doldurur.
 */
function loadKayitlarData(filter = { status: 'Tümü', musteri: 'Tümü' }) {
  const tableBody = document.getElementById('dataTableBody');
  if (!tableBody || !document.querySelector('.records-table-container')) return; // Sadece kayitlar.html'de çalış
  
  tableBody.innerHTML = `<tr><td colspan="13" class="loading-text">Kayıtlar yükleniyor (${filter.status}, ${filter.musteri})...</td></tr>`; 
  
  console.log('Kayıtlar yükleniyor... Filtre:', filter);
  // TODO: Google Sheets API'den Depo Kayıtları verilerini çek (filter objesini kullanarak)
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { id: 'kayit1', tarih: '27.10.2025', kullanici: 'Okan K.', ortakNo: '123', adSoyad: 'Ali Veli', kod: 'STK001', ad: 'Gübre A', alinan: 500, birim: 'Kg', sonCikan: '50 Kg (27.10)', toplamCikan: 250, kalan: 250, durum: 'Devam Ediyor' },
      { id: 'kayit2', tarih: '26.10.2025', kullanici: 'Okan K.', ortakNo: '', adSoyad: 'Ayşe Fatma', kod: 'STK005', ad: 'Yem B', alinan: 2, birim: 'Ton', sonCikan: '2 Ton (26.10)', toplamCikan: 2, kalan: 0, durum: 'Tamamlandı' },
      { id: 'kayit4', tarih: '28.10.2025', kullanici: 'Okan K.', ortakNo: '', adSoyad: 'Deniz Can', kod: 'STK002', ad: 'Tohum C', alinan: 100, birim: 'Kg', sonCikan: '', toplamCikan: 0, kalan: 100, durum: 'Devam Ediyor' }
    ];

    // Örnek Filtreleme (API bunu sunucu tarafında yapmalı)
    const filteredData = data.filter(item => {
        return (filter.status === 'Tümü' || item.durum === filter.status) &&
               (filter.musteri === 'Tümü' || item.adSoyad === filter.musteri || item.ortakNo === filter.musteri);
    });
    
    tableBody.innerHTML = ''; 
    if (filteredData.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="13" class="loading-text">Belirtilen kriterlere uygun kayıt bulunamadı.</td></tr>';
      return;
    }

    filteredData.forEach(item => {
      const row = tableBody.insertRow(); 
      row.dataset.recordId = item.id; // Kayıt ID'sini satıra ekle
      row.innerHTML = `
          <td>${item.tarih || ''}</td>
          <td>${item.kullanici || ''}</td>
          <td>${item.ortakNo || ''}</td>
          <td>${item.adSoyad || ''}</td>
          <td>${item.kod || ''}</td>
          <td>${item.ad || ''}</td>
          <td>${item.alinan || ''}</td>
          <td>${item.birim || ''}</td>
          <td>${item.sonCikan || ''}</td>
          <td>${item.toplamCikan || '0'}</td>
          <td>${item.kalan || '0'}</td>`;
      // Durum hücresi ve stili
      const durumCell = row.insertCell();
      durumCell.textContent = item.durum || '';
      if (item.durum === 'Devam Ediyor') durumCell.classList.add('status-devam');
      else if (item.durum === 'Tamamlandı') durumCell.classList.add('status-tamam');
      
      // İşlem hücresi (İptal butonu)
      const islemCell = row.insertCell();
      if (item.durum !== 'Tamamlandı') { // Sadece tamamlanmamışlar iptal edilebilir
           islemCell.innerHTML = `<button class="btn-cancel" onclick="cancelRecord('${item.id}', '${item.adSoyad}', '${item.ad}')">
                                      <i class="fas fa-times"></i> İptal
                                  </button>`;
      }
    });
  }, 1000); 
}

/**
 * 'kayitlar.html' - Bir depo kaydını iptal etme işlemini başlatır.
 */
function cancelRecord(recordId, musteriAdi, stokAdi) {
    if (!confirm(`"${musteriAdi}" müşterisinin "${stokAdi}" kaydını iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
        return;
    }
    
    console.log(`Kayıt ${recordId} iptal ediliyor...`);
    showLoadingOverlay("Kayıt İptal Ediliyor...");
    
    // TODO: Google Sheets API'ye iptal isteği gönder
    
    setTimeout(() => { // Simülasyon
        hideLoadingOverlay();
        alert(`Kayıt ${recordId} iptal edildi (Simülasyon).`);
        loadKayitlarData(currentFilter); // Tabloyu yenile
    }, 1500);
}

/**
 * 'kayitlar.html' - Müşteri listesini yükler (filtre için).
 */
function loadMusteriFiltreListesi() {
  const selectElement = document.getElementById('musteriFiltre');
  if(!selectElement) return;
  
  console.log('Müşteri filtre listesi yükleniyor...');
  // TODO: Google Sheets API'den tüm müşterilerin (Ortak+OrtakDışı) listesini çek
  
  // Örnek Veri
  setTimeout(() => { 
    const musteriler = [
        { value: 'Ali Veli', text: 'Ali Veli' },
        { value: 'Ayşe Fatma', text: 'Ayşe Fatma' },
        { value: 'Deniz Can', text: 'Deniz Can' }
    ]; 
    // Yükleniyor'u temizle (ilk seçenek hariç)
    while (selectElement.options.length > 1) selectElement.remove(1);
    
    musteriler.forEach(musteri => {
      const option = document.createElement('option');
      option.value = musteri.value; // Veya müşteri ID'si
      option.textContent = musteri.text;
      selectElement.appendChild(option);
    });
  }, 500); 
}
/* ======================================== */
/* 15. stok-gor.html (Stok Görüntüle) FONKSİYONLARI */
/* ======================================== */

/**
 * 'stok-gor.html' - Stok listesi verilerini yükler ve tabloyu doldurur.
 */
function loadStokListData() {
    const tableBody = document.getElementById('stokTableBody');
    // Sadece stok-gor.html'de çalışsın (doğru konteyner class'ı ile)
    if (!tableBody || !document.querySelector('.stock-view-container')) return; 
    
    tableBody.innerHTML = '<tr><td colspan="6" class="loading-text">Stok verileri yükleniyor...</td></tr>'; 
    
    console.log('Stok listesi yükleniyor...');
    // TODO: Google Sheets API'den 'Stok Kartları' sayfasındaki verileri çek
    
    // Örnek Veri
    setTimeout(() => { 
        const data = [
            { kod: 'STK001', ad: 'Gübre A - DAP 18-46-0', birim: 'Kg', ham_amb: '50', ham_birim: 'Kg', tur: 'Gübre' },
            { kod: 'STK002', ad: 'Tohum C - Buğday Sertifikalı', birim: 'Kg', ham_amb: '1000', ham_birim: 'Kg', tur: 'Tohum' },
            { kod: 'STK005', ad: 'Yem B - Süt Yemi 19 Protein', birim: 'Ton', ham_amb: '1', ham_birim: 'Ton', tur: 'Yem' },
        ];
        
        tableBody.innerHTML = ''; 
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="loading-text">Gösterilecek stok kaydı bulunamadı.</td></tr>';
            return;
        }

        data.forEach(item => {
            const row = tableBody.insertRow(); 
            row.insertCell().textContent = item.kod || '';
            row.insertCell().textContent = item.ad || '';
            row.insertCell().textContent = item.birim || '';
            row.insertCell().textContent = item.ham_amb || '';
            row.insertCell().textContent = item.ham_birim || '';
            row.insertCell().textContent = item.tur || '';
        });
    }, 1000); 
}

/* ======================================== */
/* 16. stok-guncelle.html (Stok Güncelle) FONKSİYONLARI */
/* ======================================== */

/**
 * 'stok-guncelle.html' - Stok verilerini yükler ve düzenlenebilir tabloyu oluşturur.
 */
function loadStokYonetimData() {
  const tableBody = document.getElementById('stokTableBody');
  // Sadece stok-guncelle.html'de çalışsın (doğru konteyner class'ı ile)
  if (!tableBody || !document.querySelector('.stock-update-container')) return; 
  
  tableBody.innerHTML = '<tr><td colspan="6" class="loading-text">Stok yönetim verileri yükleniyor...</td></tr>'; 
  
  console.log('Stok Yönetim verileri yükleniyor...');
  // TODO: Google Sheets API'den 'Stok Kartları' sayfasındaki verileri çek
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { kod: 'STK001', ad: 'Gübre A - DAP 18-46-0', birim: 'Kg', ham_amb: 'Kg', ham_birim: '50', tur: 'Kimyevi Gübre' },
      { kod: 'STK002', ad: 'Tohum C - Buğday Sertifikalı', birim: 'Kg', ham_amb: 'Kg', ham_birim: '1000', tur: 'Tohum' },
      { kod: 'STK005', ad: 'Yem B - Süt Yemi 19 Protein', birim: 'Ton', ham_amb: 'Ton', ham_birim: '1', tur: 'Yem' },
    ];
    
    renderEditableTable(data); // Düzenlenebilir tabloyu çiz
    
  }, 1000); 
}

/**
 * 'stok-guncelle.html' - Verilen stok verileriyle düzenlenebilir tabloyu oluşturur.
 * @param {Array} data Stok verileri dizisi.
 */
function renderEditableTable(data) {
    const tableBody = document.getElementById('stokTableBody');
    if(!tableBody) return; // Güvenlik kontrolü
    
    tableBody.innerHTML = ''; // Temizle
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="loading-text">Stok verisi bulunamadı.</td></tr>';
      return;
    }

    data.forEach(item => {
        const stokKodu = item.kod || '';
        const row = document.createElement('tr'); // <tr> olarak oluştur
        row.id = `row-${stokKodu}`;
        
        // Sabit hücreler (Kod, Ad, Birim)
        row.innerHTML = `<td>${stokKodu}</td><td>${item.ad || ''}</td><td>${item.birim || ''}</td>`;

        // Dinamik Select Kutuları (Ambalaj, Birim, Tür)
        const ambalajTd = document.createElement('td');
        ambalajTd.innerHTML = createSelect(`ambalaj-${stokKodu}`, ambalajListesi, item.ham_amb || '', 
                                           `kaydetDegisiklik('${stokKodu}', 'Hamaliye Ambalajı', this)`);
        
        const birimTd = document.createElement('td');
        const gecerliBirimler = birimKosullari[item.ham_amb || ''] || []; 
        birimTd.innerHTML = createSelect(`birim-${stokKodu}`, gecerliBirimler, item.ham_birim || '', 
                                         `kaydetDegisiklik('${stokKodu}', 'Hamaliye Birimi', this)`);

        const turTd = document.createElement('td');
        turTd.innerHTML = createSelect(`tur-${stokKodu}`, stokTuruListesi, item.tur || '', 
                                       `kaydetDegisiklik('${stokKodu}', 'Stok Türü', this)`);

        row.appendChild(ambalajTd);
        row.appendChild(birimTd);
        row.appendChild(turTd);
        tableBody.appendChild(row);
    });
}

/**
 * 'stok-guncelle.html' - Select (dropdown) HTML'i oluşturur.
 */
function createSelect(id, options, selectedValue, onChangeFunction) {
    let optionsHtml = '<option value="">Seçiniz</option>';
    options.forEach(opt => {
        const selected = (String(opt) === String(selectedValue)) ? 'selected' : '';
        optionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
    });
    return `<select id="${id}" class="form-select" onchange="${onChangeFunction}">${optionsHtml}</select>`;
}
 
/**
 * 'stok-guncelle.html' - Ambalaj değiştiğinde Birim listesini günceller.
 */
function guncelleBirimListesi(stokKodu, yeniAmbalaj) {
    const birimSelect = document.getElementById(`birim-${stokKodu}`);
    if (!birimSelect) return;
    
    const yeniBirimler = birimKosullari[yeniAmbalaj] || [];
    birimSelect.innerHTML = ''; // Temizle
    
    let optionsHtml = '<option value="">Seçiniz</option>';
    yeniBirimler.forEach(opt => {
        optionsHtml += `<option value="${opt}">${opt}</option>`;
    });
    birimSelect.innerHTML = optionsHtml;
}

/**
 * 'stok-guncelle.html' - Stok verisindeki bir değişikliği kaydeder.
 */
function kaydetDegisiklik(stokKodu, sutunAdi, element) {
    const yeniDeger = element.value;
    const row = document.getElementById(`row-${stokKodu}`);
    
    if (sutunAdi === 'Hamaliye Ambalajı') {
        guncelleBirimListesi(stokKodu, yeniDeger);
        console.log(`Birim listesi güncellendi ${stokKodu} için. Sunucuda 'Hamaliye Birimi' sıfırlanıyor...`);
        // TODO: API ÇAĞRISI - updateStokVerisi(stokKodu, 'Hamaliye Birimi', ''); 
    }

    console.log(`Kaydediliyor: Stok=${stokKodu}, Sütun=${sutunAdi}, Değer=${yeniDeger}`);
    showNotification('Kaydediliyor...', true); // Geçici bildirim
    
    // TODO: Google Sheets API'ye güncelleme isteği gönder
    // API Çağrısı: updateStokVerisi(stokKodu, sutunAdi, yeniDeger);
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => { 
        const success = Math.random() > 0.2; // %80 başarılı olsun
        const message = success ? `${stokKodu} ${sutunAdi} güncellendi.` : `Hata: ${stokKodu} güncellenemedi!`;
        showNotification(message, success);
        highlightRow(row, success);
    }, 750); 
}

/**
 * 'stok-guncelle.html' - Bir tablo satırını geçici olarak vurgular.
 */
function highlightRow(row, success) {
    if (!row) return;
    row.classList.add(success ? 'row-success' : 'row-fail');
    setTimeout(() => {
        row.classList.remove('row-success', 'row-fail');
    }, 1500);
}
 
/**
 * 'stok-guncelle.html' - Ekranın sağ üst köşesinde bir bildirim gösterir.
 */
function showNotification(message, success) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'notification'; // Önceki sınıfları sıfırla
    notification.classList.add(success ? 'success' : 'error');
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

/* ======================================== */
/* 17. stok-ekle.html (Yeni Stok Ekle) FONKSİYONLARI */
/* ======================================== */

/**
 * 'stok-ekle.html' - Sayfayı hazırlar (Select kutularını doldurur).
 */
function initStokEkleSayfasi() {
    // Global listeleri kullanarak select'leri doldur
    populateSelect('birim', birimListesiStokEkle);
    populateSelect('stokTuru', stokTuruListesi);
    populateSelect('hamaliyeAmbalaj', ambalajListesi);
    
    // Başlangıçta Hamaliye Birimi'ni boşalt/güncelle
    guncelleBirimListesiStokEkle(''); 
}

/**
 * 'stok-ekle.html' - Hamaliye Ambalajı değiştiğinde Birim listesini günceller.
 */
function guncelleBirimListesiStokEkle(yeniAmbalaj) {
    const birimSelect = document.getElementById('hamaliyeBirim');
    if (!birimSelect) return; 
    
    const yeniBirimler = birimKosullari[yeniAmbalaj] || []; 
    birimSelect.innerHTML = '<option value="">Seçiniz</option>'; // Temizle
    
    yeniBirimler.forEach(opt => {
        birimSelect.add(new Option(opt, opt));
    });
}

/**
 * 'stok-ekle.html' - Yeni stok kaydını kaydeder.
 */
function saveNewStok() {
    const stokData = {
        kod: document.getElementById('stokKodu').value.trim(),
        ad: document.getElementById('stokAdi').value.trim(),
        birim: document.getElementById('birim').value,
        hamaliyeAmbalaj: document.getElementById('hamaliyeAmbalaj').value,
        hamaliyeBirim: document.getElementById('hamaliyeBirim').value,
        stokTuru: document.getElementById('stokTuru').value
    };
    
    if (!stokData.kod || !stokData.ad) {
        alert("Stok Kodu ve Stok Adı alanları zorunludur.");
        return;
    }
    
    console.log('Yeni Stok Kaydediliyor:', stokData);
    showLoadingOverlay("Kaydediliyor...");
    
    // TODO: Google Sheets API'ye yeni stok verisini gönder
    // API Çağrısı: addNewStok(stokData);
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => { 
        hideLoadingOverlay();
        const success = Math.random() > 0.1; 
        const message = success ? `Stok "${stokData.kod}" başarıyla eklendi.` : `Hata: Stok "${stokData.kod}" eklenemedi!`;
        alert(message); 
        
        if (success) {
            document.getElementById('stokEkleForm')?.reset();
            guncelleBirimListesiStokEkle(''); 
        }
    }, 1000); 
}
/* ======================================== */
/* 18. ortak.html (Ortak Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * 'ortak.html' - Yeni ortak kaydı modal penceresini açar.
 */
function openModal() {
  const modal = document.getElementById('yeniKayitModal');
  if (modal) {
      modal.querySelector('form')?.reset(); // Formu temizle
      modal.style.display = 'flex';
  }
}

/**
 * 'ortak.html' - Yeni ortak kaydı modal penceresini kapatır.
 */
function closeModal() {
  const modal = document.getElementById('yeniKayitModal');
  if (modal) {
      modal.style.display = 'none';
  }
}

/**
 * 'ortak.html' - Yeni ortak kaydını kaydeder.
 */
function saveNewOrtak() {
  const ortakData = {
      no: document.getElementById('ortakNumarasi')?.value.trim(),
      tckn: document.getElementById('tckn')?.value.trim(),
      adSoyad: document.getElementById('adSoyadi')?.value.trim(),
      telefon: document.getElementById('telefon')?.value.trim(),
      mahalle: document.getElementById('mahalle')?.value.trim()
  };

  if (!ortakData.no || !ortakData.adSoyad) {
    alert("Ortak Numarası ve Adı Soyadı alanları zorunludur.");
    return;
  }

  console.log('Yeni Ortak Kaydediliyor:', ortakData);
  showLoadingOverlay("Kaydediliyor...");
  
  // TODO: Google Sheets API'ye yeni ortak verisini gönder
  // API Çağrısı: addNewPartner(ortakData);
  
  // --- Örnek API Yanıt Simülasyonu ---
  setTimeout(() => { 
    hideLoadingOverlay();
    const success = Math.random() > 0.1; 
    const message = success ? `Ortak "${ortakData.adSoyad}" başarıyla eklendi.` : `Hata: Ortak eklenemedi!`;
    alert(message); 
    
    if (success) {
      closeModal(); // Modalı kapat
      loadOrtakListesi(); // Listeyi yenile
    }
  }, 1000); 
}

/* ======================================== */
/*  ortak.html (Ortak Listesi)  API ENTEGRESİ */
/* ======================================== */

/**
 * 'ortak.html' - Ortak listesini yükler ve tabloyu doldurur.
 */
async function loadOrtakListesi() {
  const tableBody = document.getElementById('dataTableBody');
  if (!tableBody || !document.querySelector('.partner-list-container')) return; 
  
  // Tabloyu temizle ve yükleme mesajını göster
  tableBody.innerHTML = '<tr><td colspan="5" class="loading-text">Ortak listesi yükleniyor...</td></tr>'; 
  
  try {
    // Apps Script'teki 'getOrtaklar' fonksiyonunu çağır (Bölüm 8'de eklediğimiz)
    const response = await fetchData('getOrtaklar');
    const data = response.data; // Apps Script'ten gelen veri dizisi
    
    tableBody.innerHTML = ''; // Yükleniyor'u temizle
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="loading-text">Gösterilecek ortak kaydı bulunamadı.</td></tr>';
      return;
    }

    // Gelen veriyi tabloya ekle (Verinin Sheets'te sırasıyla No, TCKN, Ad, Tel, Mahalle olduğu varsayımıyla)
    data.forEach(item => {
      const row = tableBody.insertRow(); 
      row.innerHTML = `
          <td>${item[0] || ''}</td>  <td>${item[1] || ''}</td>  <td>${item[2] || ''}</td>  <td>${item[3] || ''}</td>  <td>${item[4] || ''}</td>  `;
    });

  } catch (error) {
    console.error("Ortak Listesi Yükleme Hatası:", error);
    tableBody.innerHTML = '<tr><td colspan="5" class="loading-text" style="color: red;">Veriler yüklenemedi. Konsolu kontrol edin.</td></tr>';
  }
}

// ... (Diğer modal fonksiyonları aşağıda kalmaya devam etmeli: openModal, closeModal, saveNewOrtak) ...

/* ======================================== */
/* 19. ortak-disi.html (Ortak Dışı Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * 'ortak-disi.html' - Yeni ortak dışı kaydı modal penceresini açar.
 */
function openModalOrtakDisi() {
  const modal = document.getElementById('yeniKayitModalOrtakDisi');
  if (modal) {
      modal.querySelector('form')?.reset();
      modal.style.display = 'flex';
  }
}

/**
 * 'ortak-disi.html' - Yeni ortak dışı kaydı modal penceresini kapatır.
 */
function closeModalOrtakDisi() {
  const modal = document.getElementById('yeniKayitModalOrtakDisi');
  if (modal) {
      modal.style.display = 'none';
  }
}

/**
 * 'ortak-disi.html' - Yeni ortak dışı kaydını kaydeder.
 */
function saveNewOrtakDisi() {
  const adSoyadInput = document.getElementById('odAdSoyadi');
  const telefonInput = document.getElementById('odTelefon');
  
  const ortakDisiData = {
      adSoyad: adSoyadInput?.value.trim(),
      telefon: telefonInput?.value.trim()
  };

  if (!ortakDisiData.adSoyad || !ortakDisiData.telefon) {
    alert("Adı Soyadı ve Telefon Numarası alanları zorunludur.");
    return;
  }

  console.log('Yeni Ortak Dışı Kaydediliyor:', ortakDisiData);
  const tableBody = document.getElementById('dataTableBody');
  if(tableBody) tableBody.innerHTML = '<tr><td colspan="2" class="loading-text">Kaydediliyor...</td></tr>';
  
  // TODO: Google Sheets API'ye yeni ortak dışı verisini gönder
  // API Çağrısı: addNewExternalPartner(ortakDisiData);
  
  // --- Örnek API Yanıt Simülasyonu ---
  setTimeout(() => { 
    const success = Math.random() > 0.1; 
    const message = success ? `Ortak Dışı "${ortakDisiData.adSoyad}" başarıyla eklendi.` : `Hata: Ortak Dışı eklenemedi!`;
    
    alert(message); 
    
    if (success) {
      closeModalOrtakDisi(); 
    }
    loadOrtakDisiListesi(); // Listeyi her durumda yenile
  }, 1000); 
}

/**
 * 'ortak-disi.html' - Ortak Dışı listesini yükler ve tabloyu doldurur.
 */
function loadOrtakDisiListesi() {
  const tableBody = document.getElementById('dataTableBody');
  // Sadece ortak-disi.html'de olduğumuzdan emin olmak için ekstra kontrol
  const container = document.querySelector('.partner-ext-list-container'); 
  if (!tableBody || !container) return; 
  
  tableBody.innerHTML = '<tr><td colspan="2" class="loading-text">Ortak Dışı listesi yükleniyor...</td></tr>'; 
  
  console.log('Ortak Dışı listesi yükleniyor...');
  // TODO: Google Sheets API'den 'Ortak Dışı' sayfasındaki verileri çek
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { adSoyad: 'Ayşe Fatma', telefon: '544...' },
      { adSoyad: 'Deniz Can', telefon: '532...' },
    ];
    
    tableBody.innerHTML = ''; 
    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="2" class="loading-text">Gösterilecek ortak dışı kayıt bulunamadı.</td></tr>';
      return;
    }

    data.forEach(item => {
      const row = tableBody.insertRow(); 
      row.innerHTML = `
          <td>${item.adSoyad || ''}</td>
          <td>${item.telefon || ''}</td>`;
    });
  }, 1000); 
}
/* ======================================== */
/* 20. sayim.html (Stok Sayım) FONKSİYONLARI */
/* ======================================== */

/**
 * 'sayim.html' - Dosya seçildiğinde Excel dosyasını okur ve işler.
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    const statusDisplay = document.getElementById('excelStatus');
    const startButton = document.getElementById('startButton');
    selectedFileContent = null;
    excelProcessed = false;
    
    if (statusDisplay) statusDisplay.textContent = '';
    if (startButton) startButton.disabled = true; // Yeni dosya seçildiğinde sayımı pasifleştir
    
    if (file) {
        if (statusDisplay) statusDisplay.textContent = `Okunuyor: ${file.name}`;
        const reader = new FileReader();
        
        reader.onload = function(e) {
            selectedFileContent = e.target.result;
            processExcelFile(); // Okuma bitince dosyayı işle
        };
        reader.onerror = () => { if (statusDisplay) statusDisplay.textContent = "Dosya okuma hatası!"; }
        
        reader.readAsArrayBuffer(file);
    }
}

/**
 * 'sayim.html' - Okunan Excel dosyasını işler ve verileri API'ye gönderir.
 */
function processExcelFile() {
    const statusDisplay = document.getElementById('excelStatus');
    if (!selectedFileContent) return;
    if(statusDisplay) statusDisplay.textContent = "Excel işleniyor...";
    
    try {
        const workbook = XLSX.read(selectedFileContent, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null, range: 1 }); // 1. satırdan başla (başlıkları atla)
        
        let extractedData = [];
        sheetData.forEach(row => {
            const valueE = row[4]; // E Sütunu (Miktar)
            // Sadece E sütunu dolu ve sayısal bir değerse al
            if (valueE !== null && valueE !== undefined && (valueE === 0 || !isNaN(parseFloat(valueE)))) {
                extractedData.push([
                    row[0] || '', // A Sütunu (Stok Kodu)
                    row[1] || '', // B Sütunu (Stok Adı)
                    parseFloat(valueE) // E Sütunu (Miktar)
                ]);
            }
        });
        
        if (extractedData.length === 0) {
           if(statusDisplay) statusDisplay.textContent = "Excel'de geçerli (E sütunu dolu) satır bulunamadı."; 
           resetFileInput();
           return;
        }

        console.log("Excel'den çıkarılan veri:", extractedData);
        if(statusDisplay) statusDisplay.textContent = `${extractedData.length} satır bulundu, sunucuya gönderiliyor...`;

        // TODO: Google Sheets API'ye 'extractedData' dizisini gönder
        // API Çağrısı: processExcelData(extractedData);
        // API tarafında: Bu veriler geçici bir sayfaya (örn: 'ExcelSayim') yazılmalı.
        
        // --- Örnek API Yanıt Simülasyonu ---
        showLoadingOverlay("Excel Verisi İşleniyor...");
        setTimeout(() => {
            hideLoadingOverlay();
            const success = Math.random() > 0.1;
            const message = success ? `${extractedData.length} satır başarıyla işlendi.` : "Excel verisi işlenirken hata oluştu!";
            if (statusDisplay) statusDisplay.textContent = message;
            
            if (success) {
                excelProcessed = true; // Excel işlendi olarak işaretle
                const startButton = document.getElementById('startButton');
                if (startButton) startButton.disabled = false; // Sayıma başla butonunu aktifleştir
                sayimaBasla(); // Otomatik olarak sayımı başlat
            } else {
                 resetFileInput(); // Başarısızsa inputu sıfırla
            }
        }, 1500);
        // --- --- ---

    } catch (error) {
        if(statusDisplay) statusDisplay.textContent = "Excel işleme hatası: " + error.message;
        resetFileInput();
    } 
}

/**
 * 'sayim.html' - Dosya inputunu sıfırlar.
 */
function resetFileInput() {
    selectedFileContent = null;
    excelProcessed = false;
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = null; // Seçili dosyayı temizle
    const startButton = document.getElementById('startButton');
     if (startButton) startButton.disabled = true; // Başlat butonunu pasifleştir (Filtre seçeneği hariç)
     
     // Filtre seçeneği hala aktif olabilir, o yüzden filtreyi kontrol et
     const filterSelect = document.getElementById('stokTuruFiltre');
     if (filterSelect && filterSelect.value !== 'Tümü' && startButton) {
         startButton.disabled = false;
     }
}

/**
 * 'sayim.html' - Seçilen filtreye göre stok sayım verilerini çeker ve tabloyu oluşturur.
 */
function sayimaBasla() {
    const filterSelect = document.getElementById('stokTuruFiltre');
    const filterValue = filterSelect ? filterSelect.value : 'Tümü';
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody || !document.getElementById('resultsTable')) return; // Sadece sayim.html'de
    
    tableBody.innerHTML = `<tr><td colspan="9" class="loading-text">"${filterValue}" için sayım verileri yükleniyor...</td></tr>`;
    
    console.log(`Sayım başlatılıyor... Filtre: ${filterValue}, Excel İşlendi mi: ${excelProcessed}`);
    
    // TODO: Google Sheets API'den stok sayım verilerini çek
    // API Çağrısı: getStokSayimData(filterValue, excelProcessed); 
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => {
        const data = [
            { originalRow: 2, stokKodu: 'STK001', stokAdi: 'Gübre A', miktarExcel: excelProcessed ? 150 : 0, mevcut: 200, veresiye: 50, pesinKK: 10, cikacak: 30 },
            { originalRow: 3, stokKodu: 'STK002', stokAdi: 'Tohum C', miktarExcel: excelProcessed ? 80 : 0, mevcut: 100, veresiye: 0, pesinKK: 0, cikacak: 10 },
            { originalRow: 5, stokKodu: 'STK005', stokAdi: 'Yem B', miktarExcel: excelProcessed ? 1.5 : 0, mevcut: 2, veresiye: 0, pesinKK: 0, cikacak: 0.5 },
        ];
        renderSayimTable(data); // Tabloyu çiz
    }, 1000);
    // --- --- ---
}

/**
 * 'sayim.html' - Stok sayım verileriyle tabloyu oluşturur.
 */
function renderSayimTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    if(!tableBody || !document.getElementById('resultsTable')) return;
    
    tableBody.innerHTML = ''; // Temizle
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="9" class="loading-text">Bu kriterlere uygun stok bulunamadı.</td></tr>';
      return;
    }
    
    data.forEach(item => {
        const row = tableBody.insertRow();
        row.dataset.originalRow = item.originalRow; // Sheets'teki satır numarasını sakla
        
        row.innerHTML = `
            <td class="read-only-cell">${item.stokKodu || ''}</td>
            <td class="read-only-cell">${item.stokAdi || ''}</td>
            <td class="read-only-cell miktar-excel-cell">${item.miktarExcel || 0}</td>
            <td><input type="number" value="${item.mevcut || 0}" class="editable-input mevcut-input" oninput="recalculateRow(this.closest('tr'))" onblur="saveCellChange(${item.originalRow}, 'D', this.value)"></td>
            <td class="read-only-cell veresiye-cell">${item.veresiye || 0}</td>
            <td class="read-only-cell pesinKK-cell">${item.pesinKK || 0}</td>
            <td class="read-only-cell cikacak-cell">${item.cikacak || 0}</td>
            <td class="kalan-cell"></td> <td class="durum-cell"></td> `;
        recalculateRow(row); // Kalan ve Durumu hesapla
    });
}
 
/**
 * 'sayim.html' - Bir satırdaki Kalan ve Durum değerlerini yeniden hesaplar.
 */
function recalculateRow(trElement) {
    if (!trElement) return;
    try {
        const miktarExcel = parseFloat(trElement.querySelector('.miktar-excel-cell')?.textContent || 0);
        const mevcutInput = trElement.querySelector('.mevcut-input');
        const mevcut = parseFloat(mevcutInput?.value || 0);
        const veresiye = parseFloat(trElement.querySelector('.veresiye-cell')?.textContent || 0); 
        const pesinKK = parseFloat(trElement.querySelector('.pesinKK-cell')?.textContent || 0); 
        const cikacak = parseFloat(trElement.querySelector('.cikacak-cell')?.textContent || 0);
        
        const kalan = (mevcut + veresiye + pesinKK) - cikacak - miktarExcel;
        
        const kalanCell = trElement.querySelector('.kalan-cell');
        const durumCell = trElement.querySelector('.durum-cell');
        
        if (kalanCell) kalanCell.textContent = kalan.toFixed(2); 
        
        if (durumCell) {
            durumCell.className = 'durum-cell'; // Önceki sınıfları temizle
            if (kalan === 0) {
                durumCell.textContent = "Stok Tam"; durumCell.classList.add('status-tam');
            } else if (kalan < 0) {
                durumCell.textContent = "Stok Noksan"; durumCell.classList.add('status-noksan');
            } else {
                durumCell.textContent = "Stok Fazla"; durumCell.classList.add('status-fazla');
            }
        }
    } catch (e) {
        console.error("Hesaplama hatası:", e, "Satır:", trElement);
    }
}
 
/**
 * 'sayim.html' - "Mevcut" sütunundaki değişikliği kaydeder.
 */
function saveCellChange(rowNum, colName, newValue) {
   if (colName === 'D' && rowNum) { // Sadece D sütunu (Mevcut) ve satır numarası varsa
        console.log(`Kaydediliyor: Satır=${rowNum}, Sütun=${colName}, Değer=${newValue}`);
        // TODO: Google Sheets API'ye güncelleme isteği gönder
        // API Çağrısı: updateSayimCell(rowNum, colName, newValue);
        
        // --- Örnek API Yanıt Simülasyonu ---
         setTimeout(() => {
            console.log(`Satır ${rowNum} güncellendi (simülasyon).`);
            // Başarı/hata bildirimi veya satır vurgulama eklenebilir
         }, 500);
   }
}
 
/**
 * 'sayim.html' - Tablodaki mevcut verilerle bir PDF oluşturur.
 */
function yazdirGuncelListeyi() {
    const tableBody = document.getElementById('dataTableBody');
    const rows = tableBody ? tableBody.querySelectorAll('tr') : [];
    
    if (rows.length === 0 || rows[0].cells.length <= 1) { // Veri yoksa veya sadece 'yükleniyor' mesajı varsa
        alert("Yazdırılacak veri bulunamadı. Lütfen önce 'Sayıma Başla' butonuna tıklayın.");
        return;
    }
    
    showLoadingOverlay("PDF Oluşturuluyor...");

    const headers = [ "Stok Kodu", "Stok Adı", "Miktar (Excel)", "Mevcut", "Veresiye", "Peşin/K.Kartı", "Çıkacak", "Kalan", "Durum" ];
    let dataToPrint = [headers];

    rows.forEach(row => {
        const mevcutInput = row.querySelector('.mevcut-input');
        if (row.cells.length < 9 || !mevcutInput) return; // Başlık değilse veya eksikse atla

        const rowData = [
            row.cells[0].textContent, row.cells[1].textContent, row.cells[2].textContent,
            mevcutInput.value, // Input'taki güncel değer
            row.cells[4].textContent, row.cells[5].textContent, row.cells[6].textContent,
            row.cells[7].textContent, row.cells[8].textContent
        ];
        dataToPrint.push(rowData);
    });

    console.log("PDF için gönderilecek veri:", dataToPrint);
    
    // TODO: Google Sheets API'ye PDF oluşturma isteği gönder
    // API Çağrısı: createSayimPdf(dataToPrint);
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => {
        hideLoadingOverlay();
        const success = Math.random() > 0.1;
        if (success) {
            const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"; 
            window.open(pdfUrl, '_blank');
        } else {
            alert("PDF oluşturulamadı!");
        }
    }, 2000);
}

/**
 * 'sayim.html' - Stok türleri listesini yükler ve filtreyi doldurur.
 */
function loadStokTurleriFiltre() {
    const select = document.getElementById('stokTuruFiltre');
    if (!select) return;

    console.log('Stok türleri yükleniyor (Filtre)...');
    // TODO: Google Sheets API'den stok türlerini çek
    // API Çağrısı: getStokTurleri();

    // Örnek Veri
    setTimeout(() => {
        const stokTurleri = ['Gübre', 'Tohum', 'Yem', 'Akaryakıt']; // API'den gelen liste
        
        while (select.options.length > 1) { select.remove(1); } // Temizle
        stokTurleri.forEach(tur => select.add(new Option(tur, tur)));
        
        select.disabled = false; 
        const startButton = document.getElementById('startButton');
        if (startButton) startButton.disabled = false; // Filtre varken de başlatılabilir

    }, 500); 
}

/* ======================================== */
/* 21. talep.html (Talep Takibi) FONKSİYONLARI */
/* ======================================== */

/**
 * 'talep.html' - Sekmeler arasında geçiş yapar.
 */
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const at = document.getElementById(tabName + 'Tab');
    const ab = document.getElementById(tabName==='goruntule'?'btnGoruntule':'btnIslem');
    
    if(at) at.classList.add('active');
    if(ab) ab.classList.add('active');
    
    if (tabName === 'goruntule') {
        fetchTalepler();
    } else {
        const is = document.getElementById('islemTuru');
        handleIslemChange(is ? is.value : '');
    }
}

/**
 * 'talep.html' - Filtrelere göre talep listesini yükler.
 */
function fetchTalepler() {
    const dF = document.getElementById('durumFiltre'); const gF = document.getElementById('grupFiltre');
    const d = dF?dF.value:'Tümü'; const g = gF?gF.value:'Tümü';
    const c = document.getElementById('goruntuleContainer'); if(!c) return;
    
    c.innerHTML = '<div class="loading-text">Talepler yükleniyor...</div>';
    console.log(`Talepler: ${d}, ${g}`); // TODO: API
    
    setTimeout(() => {
        const data = [ { oR: 1, d: ['2025-10-27', 'Okan K.', '1', 'AV', '555', 'Gübre', 'Üre', '500 Kg', 'Talep', 'Acil'] }, { oR: 2, d: ['2025-10-26', 'Alper T.', '', 'AF', '544', 'Tohum', 'Buğday', '1 Ton', 'Sipariş', 'Bekleniyor'] } ];
        const fd = data.filter(i => (d==='Tümü'||i.d[8]===d) && (g==='Tümü'||i.d[5]===g)); // Simüle filtreleme
        
        let th = '<table><thead><tr><th>Tarih</th><th>Kullanıcı</th><th>Ortak No</th><th>Adı Soyadı</th><th>Telefon</th><th>Grup</th><th>Ürün</th><th>Miktar</th><th>Durum</th><th>Açıklama</th></tr></thead><tbody>';
        if (fd.length > 0) {
            fd.forEach(i => { const rd = i.data; const t = rd[0] ? new Date(rd[0]).toLocaleDateString('tr-TR') : ''; th += `<tr><td>${t}</td><td>${rd[1]||''}</td><td>${rd[2]||''}</td><td>${rd[3]||''}</td><td>${rd[4]||''}</td><td>${rd[5]||''}</td><td>${rd[6]||''}</td><td>${rd[7]||''}</td><td>${rd[8]||''}</td><td>${rd[9]||''}</td></tr>`; });
        } else {
            th += '<tr><td colspan="10" class="loading-text">Bu kriterlere uygun talep bulunamadı.</td></tr>';
        }
        th += '</tbody></table>';
        c.innerHTML = th;
    }, 1000);
}

/**
 * 'talep.html' - "İşlem" sekmesinde seçilen türe göre içeriği ayarlar.
 */
function handleIslemChange(islem) {
    const c = document.getElementById('islemContainer'); if (!c) return; c.innerHTML = '';
    if (islem === 'ekle') { c.innerHTML = `<div style="text-align:center; padding-top: 30px;"><button class="btn btn-primary" style="padding:15px 30px; font-size:16px;" onclick="openTalepModal()"><i class="fas fa-plus"></i> Yeni Talep</button></div>`; }
    else if (islem === 'guncelle') { fetchUpdatableTalepler(); }
    else { c.innerHTML = '<div class="loading-text" style="padding-top: 30px;">İşlem seçin.</div>'; }
}

/**
 * 'talep.html' - Yeni talep giriş modalını açar ve hazırlar.
 */
function openTalepModal() {
    const m = document.getElementById('yeniTalepModal'); const f = document.getElementById('yeniTalepForm'); if (!m || !f) return;
    f.innerHTML = `
        <div class=modal-grid>
            <div><label>Tarih</label><input id=modalTarih class=form-control readonly></div>
            <div><label>Kullanıcı</label><input id=modalKullanici class=form-control readonly></div>
        </div>
        <div style="margin:15px 0; text-align:center;">
            <button type=button class="btn btn-sm" id=btnModalOrtakIci onclick="modalToggleMusteriTipi('ortak-ici')">Ortak İçi</button> 
            <button type=button class="btn btn-sm" id=btnModalOrtakDisi onclick="modalToggleMusteriTipi('ortak-disi')">Ortak Dışı</button>
        </div>
        <div id=modalOrtakIciPanel style="display:none;">
            <div class=modal-grid>
                <div><label>Ortak No</label><select id=modalOrtakNo class=form-select></select></div>
                <div><label>Adı Soyadı</label><select id=modalOrtakAdSoyad class=form-select></select></div>
                <div style="grid-column:1/-1;"><label>Telefon</label><input id=modalOrtakTelefon class=form-control readonly></div>
            </div>
        </div>
        <div id=modalOrtakDisiPanel style="display:none;">
            <div class=modal-grid>
                <div><label>Adı Soyadı</label><input id=modalOdAdSoyad class=form-control></div>
                <div><label>Telefon</label><input id=modalOdTelefon class=form-control></div>
            </div>
        </div>
        <div style="border-top:1px solid #eee; margin-top:20px; padding-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4>Ürünler</h4>
                <button type=button class="btn-sm btn-primary" onclick="addUrunRow()"><i class="fas fa-plus"></i> Ekle</button>
            </div>
            <div style="display:grid; grid-template-columns:1fr 2fr 1fr auto; gap:10px; font-weight:bold; font-size:12px; padding-bottom:5px; border-bottom:1px solid #ccc; margin-bottom:10px;">
                <label>Grup</label><label>Ürün Adı</label><label>Miktar</label><span></span>
            </div>
            <div id=modalUrunlerContainer></div>
        </div>
        <div class=modal-actions>
            <button type=button class="btn btn-secondary" onclick="closeTalepModal()">İptal</button>
            <button type=submit class="btn btn-primary"><i class="fas fa-save"></i> Kaydet</button>
        </div>`;
    
    const t = document.getElementById('modalTarih'); if(t) t.value = new Date().toLocaleDateString('tr-TR');
    const k = document.getElementById('modalKullanici'); if(k) k.value = currentUserEmail || 'Bilinmiyor'; // Global'den al
    
    modalToggleMusteriTipi('ortak-ici'); // Varsayılan
    addUrunRow(); // İlk boş satır
    
    if (modalOrtakListesi.length === 0) {
        console.log("Modal ortak listesi yükleniyor..."); 
        // TODO: API Çağrısı: getOrtakListesi();
        setTimeout(() => { 
            modalOrtakListesi = [ { numara: '1', adsoyad: 'AV', telefon: '555' }, { numara: '2', adsoyad: 'ZS', telefon: '533' } ]; 
            populateModalOrtakDropdowns(); 
        }, 500);
    } else {
        populateModalOrtakDropdowns();
    }
    if(m) m.style.display = 'flex';
}
function closeTalepModal() { const m = document.getElementById('yeniTalepModal'); if (m) m.style.display = 'none'; }
function modalToggleMusteriTipi(tip) {
    const bI=document.getElementById('btnModalOrtakIci'); const bD=document.getElementById('btnModalOrtakDisi'); const pI=document.getElementById('modalOrtakIciPanel'); const pD=document.getElementById('modalOrtakDisiPanel');
    // TODO: style.backgroundColor yerine classList.add/remove('active') kullanmak daha iyi
    if(bI) bI.style.backgroundColor = (tip==='ortak-ici' ? 'var(--light-green)' : '#6c757d'); 
    if(bD) bD.style.backgroundColor = (tip==='ortak-disi' ? 'var(--light-green)' : '#6c757d'); 
    if(pI) pI.style.display = (tip==='ortak-ici' ? 'block' : 'none'); 
    if(pD) pD.style.display = (tip==='ortak-disi' ? 'block' : 'none');
}
function populateModalOrtakDropdowns() {
    const nS=document.getElementById('modalOrtakNo'); const aS=document.getElementById('modalOrtakAdSoyad'); if(!nS||!aS) return; 
    nS.innerHTML = '<option value="">No Seç...</option>'; aS.innerHTML = '<option value="">Ad Seç...</option>';
    modalOrtakListesi.forEach((o, i) => { nS.add(new Option(o.numara, i)); aS.add(new Option(o.adsoyad, i)); });
    nS.onchange = () => updateModalOrtakDetails(nS.value); aS.onchange = () => updateModalOrtakDetails(aS.value);
}
function updateModalOrtakDetails(index) {
    const n=document.getElementById('modalOrtakNo'); const a=document.getElementById('modalOrtakAdSoyad'); const t=document.getElementById('modalOrtakTelefon'); if(index===""){if(n)n.value=""; if(a)a.value=""; if(t)t.value=""; return;}
    const o = modalOrtakListesi[index]; if (o) { if(n)n.value=index; if(a)a.value=index; if(t)t.value=o.telefon||''; }
}
function addUrunRow() {
    const c = document.getElementById('modalUrunlerContainer'); if (!c) return; const r = document.createElement('div'); const rId = 'urunRow-' + Date.now(); r.id = rId; r.className = 'urun-row';
    const g = ['Gübre', 'Tohum', 'Motorin', 'Zirai İlaç', 'Yem', 'Diğer']; let o = g.map(g => `<option value="${g}">${g}</option>`).join('');
    r.innerHTML = `<select class="form-select urun-grup"><option value="">Grup Seç...</option>${o}</select><input type="text" class="form-control urun-ad" placeholder="Ürün Adı..."><input type="text" class="form-control urun-miktar" placeholder="Miktar + Birim..."><button type="button" class="btn-sm btn-secondary" style="background-color:#dc3545;" onclick="removeDynamicRow('${rId}')"><i class="fas fa-trash"></i></button>`;
    c.appendChild(r);
}
function saveNewTalep() {
    const d = { tarih: document.getElementById('modalTarih')?.value, kullanici: document.getElementById('modalKullanici')?.value, musteriTipi: document.getElementById('modalOrtakIciPanel')?.style.display === 'block' ? 'Ortak İçi' : 'Ortak Dışı', ortakBilgileri: {}, urunler: [], durum: 'Talep Oluşturuldu' };
    if (d.musteriTipi === 'Ortak İçi') { const i = document.getElementById('modalOrtakNo')?.value; if(!i||i==="") { alert("Ortak seçin."); return; } const o = modalOrtakListesi[i]; d.ortakBilgileri = { numara: o.numara, adsoyad: o.adsoyad, telefon: o.telefon }; }
    else { d.ortakBilgileri = { adsoyad: document.getElementById('modalOdAdSoyad')?.value.trim(), telefon: document.getElementById('modalOdTelefon')?.value.trim() }; if(!d.ortakBilgileri.adsoyad) { alert("Ad soyad girin."); return; } d.ortakBilgileri.numara = ''; }
    document.querySelectorAll('#modalUrunlerContainer .urun-row').forEach(r => { const g = r.querySelector('.urun-grup')?.value; const a = r.querySelector('.urun-ad')?.value.trim(); const m = r.querySelector('.urun-miktar')?.value.trim(); if (g && a && m) { d.urunler.push({ grup:g, ad:a, miktar:m }); } });
    if (d.urunler.length === 0) { alert("En az bir ürün girin."); return; }
    console.log('Yeni Talep Kaydediliyor:', d); showLoadingOverlay("Talep Kaydediliyor...");
    // TODO: API
    setTimeout(() => { hideLoadingOverlay(); const s = Math.random() > 0.1; alert(s ? `Talep oluşturuldu.` : `Hata!`); if (s) { closeTalepModal(); if(document.getElementById('btnGoruntule')?.classList.contains('active')) fetchTalepler(); } }, 1500);
}
function fetchUpdatableTalepler() {
    const c = document.getElementById('islemContainer'); if (!c) return; c.innerHTML = '<div class="loading-text">Yükleniyor...</div>'; console.log("Güncellenecek talepler yükleniyor..."); // TODO: API
    setTimeout(() => { const d = [ { oR: 1, data: ['2025-10-27', 'u@e.c', '1', 'AV', '555', 'Gübre', 'Üre', '500 Kg', 'Talep', 'Acil'] }, { oR: 2, data: ['2025-10-26', 'u@e.c', '', 'AF', '544', 'Tohum', 'Buğday', '1 Ton', 'Sipariş', 'Bekleniyor'] } ]; let th = '<table><thead><tr><th>Tarih</th><th>Adı Soyadı</th><th>Ürün</th><th>Durum</th><th>Açıklama</th><th>İşlem</th></tr></thead><tbody>'; if (d.length > 0) { d.forEach(i => { const rd = i.data; const rId = i.oR; const t = rd[0] ? new Date(rd[0]).toLocaleDateString('tr-TR') : ''; th += `<tr id="update-row-${rId}"><td>${t}</td><td>${rd[3]||''}</td><td>${rd[6]||''}</td><td class="durum-hucre">${rd[8]||''}</td><td class="aciklama-hucre">${rd[9]||''}</td><td><button class="btn-sm btn-orange" onclick="toggleUpdateRow(${rId})">Güncelle</button></td></tr>`; }); } else { th += '<tr><td colspan=6>Güncellenecek talep yok.</td></tr>'; } th += '</tbody></table>'; c.innerHTML = th; }, 1000);
}
function toggleUpdateRow(rowId) {
    const r = document.getElementById(`update-row-${rowId}`); if (!r) return; const dC = r.querySelector('.durum-hucre'); const aC = r.querySelector('.aciklama-hucre'); const b = r.querySelector('button'); if (dC.querySelector('select')) return;
    const mD = dC.textContent; const mA = aC.textContent; const o = ['Talep Oluşturuldu', 'Sipariş Edildi', 'Tedarik Edilemiyor', 'İptal Edildi']; let sH = `<select class="form-select-sm"><option value="${mD}">${mD}</option>`; o.filter(op => op !== mD).forEach(op => sH += `<option value="${op}">${op}</option>`); sH += `</select>`;
    dC.innerHTML = sH; aC.innerHTML = `<input type="text" class="form-control-sm" value="${mA}" placeholder="Yeni açıklama...">`;
    b.textContent = "Kaydet"; b.classList.remove('btn-orange'); b.classList.add('btn-primary'); b.setAttribute('onclick', `saveUpdateRow(${rowId})`);
}
function saveUpdateRow(rowId) {
    const r = document.getElementById(`update-row-${rowId}`); if (!r) return; const s = r.querySelector('select'); const i = r.querySelector('input'); const yD = s ? s.value : ''; const yA = i ? i.value.trim() : '';
    if (yA === '') { alert("Açıklama girmek zorunludur."); i.focus(); return; }
    console.log(`Güncelleniyor: R${rowId}, D=${yD}, A=${yA}`); showLoadingOverlay("Güncelleniyor...");
    // TODO: API
    setTimeout(() => { hideLoadingOverlay(); const s = Math.random() > 0.1; alert(s ? `Talep güncellendi.` : `Hata!`); if (s) { fetchUpdatableTalepler(); } }, 1500);
}
/* ======================================== */
/* 22. hamaliye.html (Hamaliye Hesaplama) FONKSİYONLARI */
/* ======================================== */

/**
 * 'hamaliye.html' - Sayfayı hazırlar, başlığı ve fiyatları ayarlar.
 */
function initHamaliyeSayfasi() {
    // Sayfa başlığını ayarla
    const pageTitle = document.getElementById('pageTitle');
    if(pageTitle) pageTitle.textContent = `${new Date().toLocaleDateString('tr-TR')} - TARİHLİ HAMALİYE ÖDEMESİ`;

    console.log("Hamaliye fiyatları yükleniyor...");
    // TODO: API Çağrısı: getHamaliyeInitialData(); -> { yem: 50, gubre: 60, diger: 0.5 }
    // --- Simülasyon ---
    setTimeout(() => {
        const data = { yem: 50.00, gubre: 60.00, diger: 0.50 }; // Örnek fiyatlar
        const yemInput = document.getElementById('yemFiyati');
        const gubreInput = document.getElementById('gubreFiyati');
        const digerInput = document.getElementById('digerFiyati');
        if (yemInput) yemInput.value = (data.yem || 0).toFixed(2); // TL ekini kaldırdık, düzenleme kolaylığı için
        if (gubreInput) gubreInput.value = (data.gubre || 0).toFixed(2);
        if (digerInput) digerInput.value = (data.diger || 0).toFixed(2);
        // Fiyatları inputlara "number" olarak atadığımız için togglePriceEdit'i düzenlememiz gerekebilir
        // Şimdilik böyle kalsın, togglePriceEdit bunu yönetecek.
        // Veya " TL" ekini geri ekleyelim:
        // if (yemInput) yemInput.value = (data.yem || 0).toFixed(2) + " TL";
        // if (gubreInput) gubreInput.value = (data.gubre || 0).toFixed(2) + " TL";
        // if (digerInput) digerInput.value = (data.diger || 0).toFixed(2) + " TL";
        
        hesaplaTumToplamlari(); // Başlangıç toplamlarını hesapla
    }, 300);
    // --- --- ---
    
    console.log("Fiş numaraları yükleniyor (Hamaliye)...");
    // TODO: API Çağrısı: getFisNumaralariForHamaliye(); -> [ {no: 'CF-001', tarih: '27.10'}, ... ]
    // --- Simülasyon ---
    setTimeout(() => {
        fisNumaralari = [ {no: 'CF-001', tarih: '27.10'}, {no: 'CF-002', tarih: '26.10'}, {no: 'VF-001', tarih: '27.10'} ]; // Global değişkene ata
        const btnAddFis = document.getElementById('btnAddFis');
        if(btnAddFis) {
            btnAddFis.innerHTML = '<i class="fas fa-plus-circle"></i> FİŞ EKLE';
            btnAddFis.disabled = false;
        }
    }, 700);
}

/**
 * 'hamaliye.html' - Hamaliye fiyatlarını düzenleme moduna geçirir veya kaydeder.
 */
function togglePriceEdit(button) {
    const inputs = {
        yem: document.getElementById('yemFiyati'),
        gubre: document.getElementById('gubreFiyati'),
        diger: document.getElementById('digerFiyati')
    };
    const inputElements = Object.values(inputs);

    if (button.dataset.state === 'view') {
        // Düzenleme moduna geç
        inputElements.forEach(input => {
            if(input) {
                input.value = parseFloat(String(input.value).replace('TL', '').trim()) || 0; 
                input.readOnly = false;
                input.type = 'number'; 
                input.step = '0.01'; 
            }
        });
        button.textContent = 'Kaydet';
        button.classList.remove('btn-guncelle'); 
        button.classList.add('btn-kaydet');
        button.dataset.state = 'edit';
        if(inputs.yem) inputs.yem.focus();
    } else {
        // Kaydetme moduna geç
        const prices = { 
            yem: parseFloat(inputs.yem?.value || 0), 
            gubre: parseFloat(inputs.gubre?.value || 0), 
            diger: parseFloat(inputs.diger?.value || 0) 
        };
        
        console.log("Hamaliye fiyatları güncelleniyor:", prices);
        showLoadingOverlay("Fiyatlar Kaydediliyor..."); 
        
        // TODO: API Çağrısı: updateHamaliyePrices(prices);
        
        // --- Simülasyon ---
        setTimeout(() => {
            hideLoadingOverlay();
            const success = true; 
            alert(success ? "Fiyatlar başarıyla güncellendi." : "Fiyatlar güncellenemedi!");

            if (success) {
                inputElements.forEach(input => {
                    if(input) {
                        // Not: " TL" ekini geri eklemiyoruz, hesaplama fonksiyonu sayısal değeri okuyacak
                        input.value = (parseFloat(input.value) || 0).toFixed(2); 
                        input.readOnly = true;
                        // input.type = 'text'; // Tekrar text yapabiliriz, ancak number kalması da sorun değil
                    }
                });
                button.textContent = 'Güncelle';
                button.classList.remove('btn-kaydet'); 
                button.classList.add('btn-guncelle');
                button.dataset.state = 'view';
                hesaplaTumToplamlari(); // Toplamları yeniden hesapla
            }
        }, 1000);
    }
}

/**
 * 'hamaliye.html' - Yeni bir fiş satırı (select kutusu) ekler.
 */
function addFisRow() {
    const container = document.getElementById('fisRowsContainer');
    if (!container) return;

    const rowId = 'fisRow-' + Date.now();
    const fisRowContainer = document.createElement('div');
    fisRowContainer.id = rowId; 
    fisRowContainer.className = 'fis-row-container';
    
    let optionsHtml = fisNumaralari.map(fis => `<option value="${fis.no}">${fis.no} (${fis.tarih})</option>`).join('');
    
    const content = `
        <div class="fis-grid-layout" data-row-id="${rowId}">
            <select class="fis-select" onchange="fetchFisDetails(this, '${rowId}')">
                <option value="">Fiş Seçiniz...</option>
                ${optionsHtml}
            </select>
            <div></div><div></div><div></div><div></div><div></div><div></div>
            <button class="btn-remove-item" onclick="removeFisContainer('${rowId}')" title="Tüm fişi kaldır"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="fis-items-details" style="display: none;"></div> 
    `;
    fisRowContainer.innerHTML = content;
    container.appendChild(fisRowContainer);
}

/**
 * 'hamaliye.html' - Tüm fiş satırı konteynerını siler.
 */
function removeFisContainer(rowId) {
    const container = document.getElementById(rowId);
    if (container) {
        container.remove();
        hesaplaTumToplamlari(); // Toplamları yeniden hesapla
    }
}

/**
 * 'hamaliye.html' - Seçilen fişin detaylarını (ürünlerini) yükler.
 */
function fetchFisDetails(selectElement, rowId) {
    const fisNo = selectElement.value;
    const container = document.getElementById(rowId);
    const itemsContainer = container ? container.querySelector('.fis-items-details') : null;
    const removeButtonCell = selectElement.parentElement.querySelector('button')?.parentElement; 
    
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = '';
    itemsContainer.style.display = 'none'; 
    if(removeButtonCell) removeButtonCell.style.visibility = 'visible';

    if (!fisNo) { // "-- Seçiniz --" seçildiyse
        hesaplaTumToplamlari(); 
        return; 
    }

    itemsContainer.innerHTML = '<div style="padding:10px; text-align: center; font-style: italic;">Ürün detayları yükleniyor...</div>';
    itemsContainer.style.display = 'block'; 
    if(removeButtonCell) removeButtonCell.style.visibility = 'hidden'; // Detay yüklenirken sil butonunu gizle
    
    console.log(`Fiş detayları yükleniyor: ${fisNo}`);
    // TODO: API Çağrısı: getDetailsForFis(fisNo);
    // Dönen veri: { success: true, data: [ {stokKodu, stokAdi, miktar, birim, stokTuru, eSutunuDegeri}, ... ] }
    
    // --- Simülasyon ---
    setTimeout(() => {
        const success = true; 
        const data = [
             { stokKodu: 'STK001', stokAdi: 'Gübre A - DAP', miktar: 50, birim: 'Kg', stokTuru: 'Kimyevi Gübre', eSutunuDegeri: 50 },
             { stokKodu: 'STK005', stokAdi: 'Yem B - Süt', miktar: 1000, birim: 'Kg', stokTuru: 'Yem', eSutunuDegeri: 50 },
             { stokKodu: 'MTR001', stokAdi: 'Motorin', miktar: 200, birim: 'Lt', stokTuru: 'Motorin', eSutunuDegeri: 1 },
        ];
        
        itemsContainer.innerHTML = ''; // Temizle
        if (success && data.length > 0) {
            data.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'fis-grid-layout fis-item-row';
                itemRow.dataset.eSutunu = item.eSutunuDegeri || 0; 
                itemRow.dataset.stokTuru = item.stokTuru || ''; // Stok türünü de sakla
                
                itemRow.innerHTML = `
                    <div></div> <div style="text-align: center;"><input type="checkbox" onchange="handleCiftTekChange(this)"></div>
                    <div>${item.stokKodu || ''}</div>
                    <div>${item.stokAdi || ''}</div>
                    <div class="item-miktar" data-original-miktar="${item.miktar || 0}">${item.miktar || 0}</div>
                    <div>${item.stokTuru || ''}</div>
                    <div class="item-toplam">0.00</div> <button class="btn-remove-item" onclick="removeItemRow(this)" title="Bu ürünü kaldır"><i class="fas fa-trash-alt"></i></button>
                `;
                itemsContainer.appendChild(itemRow);
            });
        } else {
             itemsContainer.innerHTML = '<div style="padding:10px; color: red; text-align: center;">Bu fiş için detay bulunamadı veya yüklenemedi.</div>';
        }
        if(removeButtonCell) removeButtonCell.style.visibility = 'visible'; // Sil butonunu tekrar görünür yap
        hesaplaTumToplamlari(); // Detaylar yüklenince toplamları hesapla
    }, 800);
}

/**
 * 'hamaliye.html' - Bir ürün satırını fiş detaylarından kaldırır.
 */
function removeItemRow(buttonElement) {
    const itemRow = buttonElement.closest('.fis-item-row');
    const itemsContainer = itemRow ? itemRow.parentElement : null;
    const fisContainer = itemsContainer ? itemsContainer.closest('.fis-row-container') : null;

    if (itemRow) {
        itemRow.remove();
        // Eğer bu son ürün satırıysa, tüm fiş konteynerını sil
        if (itemsContainer && itemsContainer.children.length === 0 && fisContainer) {
             removeFisContainer(fisContainer.id); 
        } else {
             hesaplaTumToplamlari(); // Sadece toplamları yeniden hesapla
        }
    }
}

/**
 * 'hamaliye.html' - Çift/Tek checkbox'ı değiştiğinde ürün miktarını günceller.
 */
function handleCiftTekChange(checkbox) {
    const itemRow = checkbox.closest('.fis-item-row');
    if (!itemRow) return;
    const miktarCell = itemRow.querySelector('.item-miktar');
    if (!miktarCell) return;

    const originalMiktar = parseFloat(miktarCell.dataset.originalMiktar || 0);
    miktarCell.textContent = checkbox.checked ? (originalMiktar * 2) : originalMiktar;
    
    hesaplaTumToplamlari(); // Toplamları yeniden hesapla
}
 
/**
 * 'hamaliye.html' - Tüm fişlerdeki ürünlere göre genel hamaliye toplamlarını hesaplar.
 */
function hesaplaTumToplamlari() {
    let toplamYemTon = 0, toplamGubreTon = 0, toplamDigerLtAd = 0;
    
    // Fiyatları al (Güncelleme modunda olsa bile sayısal değeri al)
    const yemFiyati = parseFloat(String(document.getElementById('yemFiyati')?.value || '0').replace('TL','').trim()) || 0;
    const gubreFiyati = parseFloat(String(document.getElementById('gubreFiyati')?.value || '0').replace('TL','').trim()) || 0;
    const digerFiyati = parseFloat(String(document.getElementById('digerFiyati')?.value || '0').replace('TL','').trim()) || 0;

    document.querySelectorAll('.fis-item-row').forEach(row => {
        const miktarCell = row.querySelector('.item-miktar');
        const stokTuru = row.dataset.stokTuru || ''; // dataset'ten oku
        const eSutunuDegeri = parseFloat(row.dataset.eSutunu || 0);
        const toplamCell = row.querySelector('.item-toplam');
        
        if (!miktarCell || !stokTuru || !toplamCell) return;
        
        const miktar = parseFloat(miktarCell.textContent || 0);
        let satirHamaliyeMiktari = 0;
        let satirTutar = 0;
        
        if (['Motorin', 'Halk Sağlığı', 'Market'].includes(stokTuru)) {
            toplamCell.textContent = '0.00 TL'; 
            satirHamaliyeMiktari = 0;
        } else if (stokTuru === 'Kimyevi Gübre') {
            satirHamaliyeMiktari = miktar / 1000; // Kg->Ton
            toplamGubreTon += satirHamaliyeMiktari;
            satirTutar = satirHamaliyeMiktari * gubreFiyati;
            toplamCell.textContent = satirTutar.toFixed(2) + " TL";
        } else if (stokTuru === 'Toz Gübre') {
            satirHamaliyeMiktari = (miktar * eSutunuDegeri) / 1000; // Kg->Ton
            toplamGubreTon += satirHamaliyeMiktari;
            satirTutar = satirHamaliyeMiktari * gubreFiyati;
            toplamCell.textContent = satirTutar.toFixed(2) + " TL";
        } else if (['Sıvı Gübre', 'Zirai İlaç', 'Madeni Yağ', 'Sulama'].includes(stokTuru)) {
            satirHamaliyeMiktari = miktar * eSutunuDegeri; // Lt/Adet
            toplamDigerLtAd += satirHamaliyeMiktari;
            satirTutar = satirHamaliyeMiktari * digerFiyati;
            toplamCell.textContent = satirTutar.toFixed(2) + " TL";
        } else if (['Yem', 'Tohum'].includes(stokTuru)) {
            satirHamaliyeMiktari = miktar / 1000; // Kg->Ton
            toplamYemTon += satirHamaliyeMiktari;
            satirTutar = satirHamaliyeMiktari * yemFiyati;
            toplamCell.textContent = satirTutar.toFixed(2) + " TL";
        } else {
             toplamCell.textContent = 'HATA'; 
        }
    });

    // Toplamları formatlayarak inputlara yaz
    const toplamYemInput = document.getElementById('toplamYem');
    const toplamGubreInput = document.getElementById('toplamGubre');
    const toplamDigerInput = document.getElementById('toplamDiger');
    const genelTonajInput = document.getElementById('genelTonaj');
    const genelTutarInput = document.getElementById('genelTutar');

    if(toplamYemInput) toplamYemInput.value = toplamYemTon.toFixed(3) + " Ton";
    if(toplamGubreInput) toplamGubreInput.value = toplamGubreTon.toFixed(3) + " Ton";
    if(toplamDigerInput) toplamDigerInput.value = toplamDigerLtAd.toFixed(2) + " Lt/Ad";

    const genelTutar = (toplamYemTon * yemFiyati) + (toplamGubreTon * gubreFiyati) + (toplamDigerLtAd * digerFiyati);
    const genelTonaj = toplamYemTon + toplamGubreTon; // Sadece Ton olanları topla

    if(genelTutarInput) genelTutarInput.value = genelTutar.toFixed(2) + " TL";
    if(genelTonajInput) genelTonajInput.value = genelTonaj.toFixed(3) + " Ton";
}

/**
 * 'hamaliye.html' - Hesaplanan hamaliye verilerini kaydeder ve PDF oluşturur.
 */
function kaydetHesaplama() {
    if (!confirm("Tüm hesaplamayı sayfaya kaydetmek ve yazdırmak istediğinizden emin misiniz? Varsa önceki kayıtlar silinecektir.")) return;

    const hesaplamaData = {
        baslik: document.getElementById('pageTitle')?.textContent || 'Hamaliye Hesaplama',
        genelToplamlar: {
            yem_ton: document.getElementById('toplamYem')?.value,
            gubre_ton: document.getElementById('toplamGubre')?.value,
            diger_ltad: document.getElementById('toplamDiger')?.value,
            tutar_tl: document.getElementById('genelTutar')?.value
        },
        fisDetaylari: []
    };

    document.querySelectorAll('.fis-item-row').forEach(row => {
        const container = row.closest('.fis-row-container');
        const fisSelect = container ? container.querySelector('.fis-select') : null;
        const fisNo = fisSelect ? fisSelect.value : '';
        if (!fisNo) return; 

        const checkbox = row.querySelector('input[type="checkbox"]');
        const miktarCell = row.querySelector('.item-miktar');
        const toplamCell = row.querySelector('.item-toplam');

        hesaplamaData.fisDetaylari.push({
            fisNo: fisNo,
            stokKodu: row.cells[2]?.textContent || '',
            stokAdi: row.cells[3]?.textContent || '',
            miktar: parseFloat(miktarCell?.textContent || 0),
            orjinalMiktar: parseFloat(miktarCell?.dataset.originalMiktar || 0),
            isCift: checkbox ? checkbox.checked : false,
            stokTuru: row.dataset.stokTuru || '',
            hesaplananTutar: parseFloat(toplamCell?.textContent || 0) || 0,
            eSutunu: parseFloat(row.dataset.eSutunu || 0)
        });
    });
    
    if (hesaplamaData.fisDetaylari.length === 0) {
        alert("Kaydedilecek fiş detayı bulunamadı.");
        return;
    }

    console.log("Kaydedilecek Hamaliye Verisi:", hesaplamaData);
    showLoadingOverlay("Kaydediliyor ve PDF Oluşturuluyor...");
    
    // TODO: Google Sheets API'ye hesaplama verisini gönder
    // API Çağrısı: kaydetHamaliyeHesaplamasi(hesaplamaData);
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => { 
        hideLoadingOverlay();
        const success = Math.random() > 0.1; 
        const pdfUrl = success ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" : null;
        const message = success ? `Hesaplama başarıyla kaydedildi.` : `Hata: Hesaplama kaydedilemedi!`;
        
        alert(message);
        
        if (success && pdfUrl) {
            window.open(pdfUrl, '_blank');
            document.getElementById('fisRowsContainer').innerHTML = '';
            hesaplaTumToplamlari(); // Toplamları sıfırla
        }
    }, 2500); 
}


/* ======================================== */
/* 23. DOMContentLoaded (Genel Sayfa Yükleyici) */
/* ======================================== */

/**
 * Mevcut sayfaya göre çalıştırılacak ana veri yükleme fonksiyonunu döndürür.
 * Bu fonksiyon, API çağrısı GEREKTİREN fonksiyonları listeler.
 */
function getCurrentPageLoadFunction() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    
    if (path === 'index.html') return loadInfoPanelData; 
    else if (path === 'pesin.html') return initPesinPage; // initPesinPage içinde API çağrıları olacak
    else if (path === 'cikis.html') return initCikisFisi;
    else if (path === 'tekrar.html') return loadFisNumaralari;
    else if (path === 'iptal.html') return loadFisNumaralari;
    else if (path === 'fiyat.html') return loadPriceListData;
    else if (path === 'veresiye.html') return loadVeresiyeData;
    else if (path === 'liste.html') return fetchAllData;
    else if (path === 'giris.html') return initGirisSayfasi;
    else if (path === 'cikis-kayit.html') return loadMusteriListesiCikis;
    else if (path === 'kayitlar.html') return () => { loadKayitlarData(currentFilter); loadMusteriFiltreListesi(); };
    else if (path === 'stok-gor.html') return loadStokListData;
    else if (path === 'stok-guncelle.html') return loadStokYonetimData;
    else if (path === 'stok-ekle.html') return initStokEkleSayfasi;
    else if (path === 'ortak.html') return loadOrtakListesi;
    else if (path === 'ortak-disi.html') return loadOrtakDisiListesi;
    else if (path === 'sayim.html') return loadStokTurleriFiltre;
    else if (path === 'talep.html') return fetchTalepler; // Varsayılan sekme
    else if (path === 'hamaliye.html') return initHamaliyeSayfasi;
    
    return null; // login.html veya bilinmeyen sayfa
}

/**
 * Sayfa yüklendiğinde (DOMContentLoaded) çalışır.
 */
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const header = document.querySelector('.header');
    
    if (currentPage === 'login.html') {
        // --- LOGIN SAYFASI ---
        // 1. Kullanıcı listesini doldur
        initLoginPage();
        // 2. index.html'den kalan loadingScreen'i gizle (eğer varsa)
        const ls = document.getElementById('loadingScreen');
        if(ls) ls.style.display = 'none';
        
    } else {
        // --- DİĞER TÜM SAYFALAR (Giriş yapılmış olmalı) ---
        const currentUser = localStorage.getItem('currentUser');
        
        // 1. Header'a "Hoşgeldin" ve "Çıkış Yap" butonunu ekle
        if (header && currentUser) {
            let authDiv = header.querySelector('.auth-buttons, .header-user-info'); // Eski class'ı da ara
            if (!authDiv) {
                authDiv = document.createElement('div');
                const rightPlaceholder = header.querySelector('div[style*="width"]');
                if (rightPlaceholder) {
                    header.replaceChild(authDiv, rightPlaceholder);
                } else {
                    header.appendChild(authDiv);
                }
            }
            authDiv.className = 'header-user-info'; // Doğru class'ı ayarla
            authDiv.innerHTML = `
                <span class="welcome-message">Hoşgeldin, ${currentUser}</span>
                <button onclick="handleLogout()" class="header-button logout-button" title="Oturumu Kapat">
                    <i class="fas fa-sign-out-alt"></i> Çıkış Yap
                </button>
            `;
        }
        
        // 2. Sayfaya özel API gerektiren yükleme fonksiyonunu çalıştır
        // (Artık Google API'ye bağlı değiliz, ama simülasyonları çalıştırabiliriz)
        const loadFunction = getCurrentPageLoadFunction();
        if (loadFunction) {
            console.log("Sayfaya özel yükleme fonksiyonu çalıştırılıyor:", loadFunction.name || 'kayitlarYukleyici');
            try {
                loadFunction();
            } catch (e) {
                console.error("Sayfa yükleme fonksiyonunda hata:", e);
            }
        }
        
        // 3. index.html'e özel API gerektirmeyen fonksiyonları çalıştır
        if (currentPage === 'index.html' || currentPage === '') {
             updateDate();
        }
        
        // 4. index.html'in 'load' event'indeki fonksiyonlar (artık Google API yok)
        const loadingScreen = document.getElementById('loadingScreen');
        const mainScreen = document.getElementById('mainScreen');
        if (loadingScreen && mainScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    mainScreen.style.display = 'block';
                }, 500);
            }, 1000); 
        }
    }
});
