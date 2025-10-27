// ========================================
// 0. GOOGLE API AYARLARI
// ========================================

const CLIENT_ID = '74893450229-nkhr6i63650fegcitvpv8p9b1au262pd.apps.googleusercontent.com'; // BURAYA KENDİ CLIENT ID'NİZİ YAPIŞTIRIN
const API_KEY = 'AIzaSyBM0vIZ15ygxdow0CLe1dlUyFC2M_An_m4'; // Genellikle Gerekmez, OAuth yeterlidir. Şimdilik boş bırakabilirsiniz veya isterseniz GCP'den API Key oluşturabilirsiniz.
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
// Bu kapsam (scope) E-Tabloları okuma ve yazma izni verir.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// BURAYA GOOGLE E-TABLONUZUN ID'SİNİ YAPIŞTIRIN
// E-Tablonuzun URL'sindeki uzun kod: 
// docs.google.com/spreadsheets/d/ SPREADSHEET_ID_BURADA /edit
const SPREADSHEET_ID = '1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ'; 

let tokenClient; // Google Auth Token Client
let gapiInited = false; // GAPI Kütüphanesi yüklendi mi?
let gisInited = false; // GIS Kütüphanesi yüklendi mi?

// Yetkilendirme/Çıkış butonlarının ID'leri (HTML'e eklenecek)
const authButtonId = 'authorize_button';
const signoutButtonId = 'signout_button';

// --- (Diğer global değişkenleriniz burada devam edebilir) ---
// const birimListesiStokEkle = ...
// const ambalajListesi = ...
// ...



// GÜNCELLENMİŞ YÜKLEME FONKSİYONU
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainScreen = document.getElementById('mainScreen');

  // Önce yükleme animasyonunu her iki sayfada da çalıştır
  if (loadingScreen && mainScreen) {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        
        // ŞİMDİ HANGİ SAYFADA OLDUĞUMUZU KONTROL EDELİM
        if (document.querySelector('.menu-column')) {
            // Sadece index.html'de ise bunları çalıştır
            updateDate();
            loadInfoPanelData();
        } 
        else if (document.getElementById('fisNo')) {
            // Sadece cikis.html'de ise bunları çalıştır
            initCikisFisi(); 
        }

      }, 500); // 0.5s animasyon süresi
    }, 1000); // 1s bekleme süresi
  }
});

// --- Global Değişkenler (Stok Ekleme için) ---
const birimListesiStokEkle = ['Adet', 'Kg', 'Koli', 'Lt', 'Metre', 'Paket', 'Ton'];
// ambalajListesi, stokTuruListesi, birimKosullari zaten stok-guncelle için tanımlanmıştı, tekrar gerek yok.
// --- --- ---

/**
 * Menü linklerinden tıklandığında sayfaya yönlendirme yapar.
 * @param {string} page Gidilecek sayfanın adı (örn: 'pesin.html').
 */
function navigate(page) {
  // Gerçekte sayfayı yönlendirmek için bu kullanılır:
  window.location.href = page;

  // Hata ayıklama için konsola da yazabiliriz:
  // console.log(page + ' sayfasına gidiliyor...');
}

/**
 * Kenar paneldeki tarih bilgisini günceller.
 */
function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString('tr-TR', options);
}

/**
 * Tıklanan menü grubunun altındaki listeyi açar veya kapatır.
 * @param {HTMLElement} button Tıklanan buton elementi.
 */
function toggleMenu(button) {
  const ul = button.nextElementSibling; // Butondan sonraki 'ul' elementini bul
  const isVisible = ul.style.display === 'block';
  ul.style.display = isVisible ? 'none' : 'block';
}

/**
 * Kenar paneldeki diğer bilgileri (Hava, Döviz, Haberler) yükler.
 * ŞİMDİLİK BU VERİLER SABİTTİR.
 * TODO: Daha sonra bu fonksiyon API'lerden gerçek veri çekecek.
 */
function loadInfoPanelData() {
  document.getElementById('weather').textContent = 'Kayseri, 18°C';
  
  // Döviz ve Altın verileri API'den çekilene kadar yer tutucu
  document.getElementById('usd').textContent = 'Yükleniyor...';
  document.getElementById('eur').textContent = 'Yükleniyor...';
  document.getElementById('gold').textContent = 'Yükleniyor...';

  document.getElementById('news').textContent = 'Haberler yükleniyor...';

  // TODO: "Çıkış Bekleyen" ve "Veresiye Kayıtları" verileri 
  // Google Sheets API'den çekilecek.
}

/* ======================================== */
/* pesin.html için FONKSİYONLAR */
/* (Mevcut script.js dosyanızın en altına ekleyin) */
/* ======================================== */

/**
 * Ana Menüye (index.html) döner.
 */
function goBack() {
  window.location.href = 'index.html';
}

/**
 * Tüm Kasa hesaplamalarını çalıştırır.
 * (İçi daha sonra doldurulacak)
 */
function runAllCalculations() {
  console.log('Hesaplamalar çalışıyor...');
  // TODO: Para sayımı, düzeltmeler ve kasa durumu hesaplanacak.
}

/**
 * Kasa raporunu yazdırma işlemini tetikler.
 * (İçi daha sonra doldurulacak)
 */
function yazdirKasa() {
  console.log('Yazdırma işlemi başlatılıyor...');
  alert('Yazdırma fonksiyonu henüz aktif değil.');
}

/**
 * Kasa verilerini kaydetme işlemini tetikler.
 * (İçi daha sonra doldurulacak)
 */
function kaydetKasa() {
  console.log('Kaydetme işlemi başlatılıyor...');
  alert('Kaydetme fonksiyonu henüz aktif değil.');
  // TODO: Google Sheets API'ye veri gönderme işlemi burada olacak.
}

/**
 * Satış kayıtları tablosuna yeni, boş bir satır ekler.
 * (İçi daha sonra doldurulacak)
 */
function addSatisRow() {
  console.log('Yeni satış satırı ekleniyor...');
  // TODO: satisKayitlariContainer içine yeni HTML elementleri oluşturulacak.
}
/* ======================================== */
/* pesin.html - İÇERİK OLUŞTURMA KODLARI */
/* (Mevcut script.js dosyanızın en altına ekleyin) */
/* ======================================== */

// Sayfa yüklendiğinde çalışır
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'pesin.html' sayfasındaysak bu fonksiyonu çalıştır
  // (Bunu 'paraSayiContainer' ID'sinin varlığını kontrol ederek anlıyoruz)
  if (document.getElementById("paraSayiContainer")) {
    initPesinPage();
  }
});

/**
 * 'pesin.html' sayfasını hazırlar.
 * Para sayımı ve düzeltme için boş satırları oluşturur.
 */
function initPesinPage() {
  const banknotlar = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25];
  const paraContainer = document.getElementById("paraSayiContainer");
  const duzeltmeContainer = document.getElementById("duzeltmeContainer");

  // 1. Para Sayımı Satırlarını Oluştur
  paraContainer.innerHTML = ''; // İçini temizle
  banknotlar.forEach(deger => {
    const row = document.createElement("div");
    row.className = "para-sayi-grid";
    row.innerHTML = `
      <input class="form-control" value="${deger.toFixed(2)}" readonly />
      <input class="form-control" type="number" value="0" oninput="runAllCalculations()" />
      <input class="form-control" value="0.00" readonly />
    `;
    paraContainer.appendChild(row);
  });

  // 2. Düzeltme Satırlarını Oluştur (10 tane boş)
  duzeltmeContainer.innerHTML = ''; // İçini temizle
  for (let i = 0; i < 5; i++) {
    const row = document.createElement("div");
    row.className = "duzeltme-grid";
    row.innerHTML = `
      <input class="form-control" placeholder="Açıklama..." oninput="runAllCalculations()" />
      <input class="form-control" type="number" value="0" oninput="runAllCalculations()" />
    `;
    duzeltmeContainer.appendChild(row);
  }
  
  // 3. "Satır Ekle" butonunu aktifleştir
  const btnAdd = document.getElementById("btnAddSatisRow");
  if(btnAdd) {
      btnAdd.innerHTML = '<i class="fas fa-plus"></i> Satır Ekle';
      // btnAdd.disabled = false; // Artık disabled değil
  }
  
  // 4. İlk hesaplamayı çalıştır (Tüm toplamları 0.00 yapar)
  runAllCalculations();
}

/**
 * Satış kayıtları tablosuna yeni, boş bir satır ekler.
 * (Placeholder'ı gerçek kodla DEĞİŞTİRİYORUZ)
 */
function addSatisRow() {
  const container = document.getElementById("satisKayitlariContainer");
  const row = document.createElement("div");
  row.className = "satis-item-row";
  
  // TODO: <option> içindeki stoklar Google Sheets API'den çekilecek.
  // Şimdilik ekran görüntüsüne benzer sahte veriler ekledim.
  row.innerHTML = `
    <select class="form-control" onchange="stokSecildi(this)">
      <option value="">Seç...</option>
      <option value="65743">65743</option>
      <option value="312">312</option>
      <option value="102">102</option>
      <option value="14687">14687</option>
    </select>
    <select class="form-control" onchange="stokSecildi(this)">
      <option value="">Stok Adı Seç...</option>
      <option value="TARIM KREDİ YEM SİGIR BESİ - YEMİ GELİŞTİRME (PELET)">TARIM KREDİ YEM SİGIR BESİ - YEMİ GELİŞTİRME (PELET)</option>
      <option value="MOTORİN (PETROL OFİSİ)">MOTORİN (PETROL OFİSİ)</option>
      <option value="GÜBRETAŞ 10.10.10 NPK (1 LT)">GÜBRETAŞ 10.10.10 NPK (1 LT)</option>
      <option value="TARIM KREDİ YEM SİGIR SÜT YEMİ ENERJİ 19 (PELET)">TARIM KREDİ YEM SİGIR SÜT YEMİ ENERJİ 19 (PELET)</option>
    </select>
    <input class="form-control" type="number" placeholder="Miktar" oninput="runAllCalculations()" />
    <input class="form-control" type="number" placeholder="Birim Fiyat" oninput="runAllCalculations()" />
    <input class="form-control" value="0.00" readonly />
    <button class="btn-remove-row" onclick="removeSatisRow(this)"><i class="fas fa-trash"></i></button>
  `;
  container.appendChild(row);
}

/**
 * Tıklanan satırı siler ve toplamları yeniden hesaplar.
 */
function removeSatisRow(button) {
    button.parentElement.remove(); // Satırın tamamını sil
    runAllCalculations(); // Toplamları güncelle
}

/**
 * TODO: Stok seçildiğinde kod/ad eşleşmesi yapılacak
 */
function stokSecildi(selectElement) {
    console.log("Stok seçildi: " + selectElement.value);
    // TODO: Bu fonksiyon doldurulacak
}


/**
 * Tüm Kasa hesaplamalarını çalıştırır.
 * (Placeholder'ı gerçek kodla DEĞİŞTİRİYORUZ)
 */
function runAllCalculations() {
  let paraToplami = 0;
  let duzeltmeToplami = 0;
  let satisToplami = 0;

  // 1. Para Sayımı Toplamı
  const paraContainer = document.getElementById("paraSayiContainer");
  if (paraContainer) {
      const rows = paraContainer.querySelectorAll(".para-sayi-grid");
      rows.forEach(row => {
          const banknot = parseFloat(row.children[0].value) || 0;
          const adet = parseFloat(row.children[1].value) || 0;
          const toplamInput = row.children[2];
          const satirToplam = banknot * adet;
          toplamInput.value = satirToplam.toFixed(2);
          paraToplami += satirToplam;
      });
      document.getElementById("paraSayilariToplam").value = paraToplami.toFixed(2);
      document.getElementById("kasaToplami").value = paraToplami.toFixed(2);
  }

  // 2. Düzeltme Toplamı
  const duzeltmeContainer = document.getElementById("duzeltmeContainer");
  if (duzeltmeContainer) {
      const rows = duzeltmeContainer.querySelectorAll(".duzeltme-grid");
      rows.forEach(row => {
          const tutar = parseFloat(row.children[1].value) || 0;
          duzeltmeToplami += tutar;
      });
      document.getElementById("duzeltmeKayitlariToplam").value = duzeltmeToplami.toFixed(2);
  }

  // 3. Satış Toplamı
  const satisContainer = document.getElementById("satisKayitlariContainer");
  if (satisContainer) {
      const rows = satisContainer.querySelectorAll(".satis-item-row");
      rows.forEach(row => {
          const miktar = parseFloat(row.children[2].value) || 0;
          const fiyat = parseFloat(row.children[3].value) || 0;
          const toplamInput = row.children[4];
          const satirToplam = miktar * fiyat;
          toplamInput.value = satirToplam.toFixed(2);
          satisToplami += satirToplam;
      });
      
      if (document.getElementById("nakitSatisKasaDurumu")) {
          document.getElementById("nakitSatisKasaDurumu").value = satisToplami.toFixed(2);
      }
      if (document.getElementById("nakitSatisDuzeltme")) {
          document.getElementById("nakitSatisDuzeltme").value = satisToplami.toFixed(2);
      }
  }
  
  // 4. Kasa Durumu Hesapla
  const kasaBakiyesi = parseFloat(document.getElementById("kasaBakiyesi").value) || 0;
  // Kasa Durumu = Bakiye - (Para Sayımı + Düzeltmeler)
  // Bu mantık sizinkinden farklıysa burayı değiştirebiliriz.
  const durum = kasaBakiyesi - (paraToplami + duzeltmeToplami); 
  
  const kasaDurumInput = document.getElementById("kasaDurum");
  const kasaDurumAciklama = document.getElementById("kasaDurumAciklama");
  
  if (kasaDurumInput) {
      kasaDurumInput.value = durum.toFixed(2);
      
      kasaDurumAciklama.style.display = "block";
      kasaDurumAciklama.classList.remove("kasa-tam", "kasa-fazla", "kasa-eksik");
      
      if (durum === 0) {
          kasaDurumAciklama.textContent = "Kasa Hesabı Tam";
          kasaDurumAciklama.classList.add("kasa-tam");
      } else if (durum < 0) {
          kasaDurumAciklama.textContent = `${Math.abs(durum).toFixed(2)} TL Kasa Hesabı Eksik`;
          kasaDurumAciklama.classList.add("kasa-eksik");
      } else {
          kasaDurumAciklama.textContent = `${durum.toFixed(2)} TL Kasa Hesabı Fazla`;
          kasaDurumAciklama.classList.add("kasa-fazla");
      }
  }
}
/* ======================================== */
/* 8. cikis.html (Çıkış Fişi) FONKSİYONLARI */
/* ======================================== */

/**
 * Çıkış fişi sayfası yüklendiğinde ilk verileri ayarlar.
 */
function initCikisFisi() {
  // TODO: Fiş No, Tarih ve Kullanıcı API'den çekilecek
  document.getElementById('tarih').value = new Date().toLocaleDateString('tr-TR');
  document.getElementById('fisNo').value = 'CF-2025-001'; // Örnek
  document.getElementById('kullanici').value = 'Okan KotAN'; // Örnek
  
  // TODO: Ortak ve Stok listeleri API'den çekilecek
}

/**
 * Müşteri tipini (Ortak İçi / Ortak Dışı) değiştirir.
 */
function toggleCustomerType() {
  const btn = document.getElementById('customerTypeBtn');
  const ortakIci = document.getElementById('ortakIciDetails');
  const ortakDisi = document.getElementById('ortakDisiDetails');
  const newCustomerBtn = document.getElementById('newCustomerBtn');

  if (btn.classList.contains('ortak-disi')) {
    // Ortak İçi'ne geç
    btn.classList.remove('ortak-disi');
    btn.classList.add('ortak-ici');
    btn.textContent = 'Ortak İçi';
    
    ortakDisi.classList.remove('active');
    ortakIci.classList.add('active');
    
    newCustomerBtn.textContent = 'Yeni Ortak Kayıt';
    newCustomerBtn.onclick = openOrtakModal; // Onclick fonksiyonunu değiştir
  } else {
    // Ortak Dışı'na geç
    btn.classList.remove('ortak-ici');
    btn.classList.add('ortak-disi');
    btn.textContent = 'Ortak Dışı';
    
    ortakIci.classList.remove('active');
    ortakDisi.classList.add('active');
    
    newCustomerBtn.textContent = 'Yeni Ortak Dışı Kayıt';
    newCustomerBtn.onclick = openOrtakDisiModal; // Onclick fonksiyonunu değiştir
  }
}

/**
 * Stok bilgileri bölümüne yeni bir satır ekler.
 */
/**
 * Stok bilgileri bölümüne yeni bir satır ekler. (BAŞLIKSIZ)
 */
function addStockRow() {
  const container = document.getElementById('stockRowsContainer');
  const newRow = document.createElement('div');
  newRow.className = 'stock-row';
  
  // DÜZELTİLMİŞ: <span class="stock-label"> başlıkları kaldırıldı.
  // TODO: Stok listesi API'den çekilecek
  newRow.innerHTML = `
    <div>
        <select class="form-control"><option value="">Seç...</option><option value="STK001">STK001</option></select>
    </div>
    <div>
        <select class="form-control"><option value="">Seç...</option><option value="GÜBRE">GÜBRE</option></select>
    </div>
    <div>
        <input type="number" class="form-control" placeholder="0">
    </div>
    <div>
        <select class="form-control"><option value="Kg">Kg</option><option value="Ton">Ton</option><option value="Lt">Lt</option><option value="Adet">Adet</option></select>
    </div>
    <button class="remove-stock-btn" onclick="removeStockRow(this)"><i class="fas fa-trash"></i></button>
  `;
  container.appendChild(newRow);
}

/**
 * Bir stok satırını kaldırır.
 * @param {HTMLElement} button Tıklanan silme butonu.
 */
function removeStockRow(button) {
  button.parentElement.remove(); // Tüm .stock-row elementini sil
}

/**
 * Formu kaydetme işlemini başlatır.
 */
function saveForm() {
  // TODO: Google Sheets API'ye veri gönderme
  alert('Form Kaydediliyor... (Henüz API bağlı değil)');
}

/* === Modal (Açılır Pencere) Fonksiyonları === */

function openOrtakModal() {
  document.getElementById('yeniOrtakModal').style.display = 'flex';
}
function closeOrtakModal() {
  document.getElementById('yeniOrtakModal').style.display = 'none';
}
function saveNewOrtakFromCikis() {
  // TODO: API'ye yeni ortak kaydı
  alert('Yeni Ortak Kaydediliyor...');
  closeOrtakModal();
}

function openOrtakDisiModal() {
  document.getElementById('yeniOrtakDisiModal').style.display = 'flex';
}
function closeOrtakDisiModal() {
  document.getElementById('yeniOrtakDisiModal').style.display = 'none';
}
function saveNewOrtakDisiFromCikis() {
  // TODO: API'ye yeni ortak dışı kaydı
  alert('Yeni Ortak Dışı Kaydediliyor...');
  closeOrtakDisiModal();
}

/* ======================================== */
/* 10. tekrar.html (Fiş Tekrar) FONKSİYONLARI */
/* ======================================== */

/**
 * Seçilen fiş numarasının detaylarını yükler.
 */
function loadFisDetaylari() {
  const selectedFisNo = document.getElementById('fisNoSelect').value;
  const detayAlani = document.getElementById('fisDetaylari');
  
  if (!selectedFisNo) {
    detayAlani.value = '';
    return;
  }
  
  console.log(selectedFisNo + ' için detaylar yükleniyor...');
  // TODO: Google Sheets API'den ilgili fişin verilerini çek
  
  // Örnek veri
  detayAlani.value = `Fiş No: ${selectedFisNo}\nTarih: 27.10.2025\nMüşteri: Ahmet Yılmaz\n--------------------\n- Ürün A: 2 adet\n- Ürün B: 5 kg\n--------------------\nToplam: 150.00 TL`; 
}

/**
 * Gösterilen fiş içeriğini yazdırma işlemini başlatır.
 */
function tekrarYazdir() {
  const fisIcerigi = document.getElementById('fisDetaylari').value;
  if (!fisIcerigi) {
    alert('Yazdırılacak fiş içeriği bulunamadı.');
    return;
  }
  
  console.log('Fiş içeriği yazdırılıyor...');
  
  // TODO: Yazdırma için daha gelişmiş bir yöntem (örn: yeni pencere, özel CSS)
  // Şimdilik basit window.print() kullanalım, ancak bu tüm sayfayı yazdırır.
  // Daha iyisi, içeriği alıp yeni bir pencerede formatlayıp yazdırmak olur.
  
  // Geçici Çözüm: Sadece metni yazdırmayı dene (tarayıcı desteği değişebilir)
  const printWindow = window.open('', '_blank');
  printWindow.document.write('<pre>' + fisIcerigi + '</pre>'); // <pre> formatlamayı korur
  printWindow.document.close(); // Gerekli olabilir
  printWindow.focus(); // Gerekli olabilir
  printWindow.print();
  // printWindow.close(); // İsteğe bağlı olarak kapatılabilir
  
  alert('Yazdırma diyaloğu açılıyor...'); 
}

// Bu sayfa yüklendiğinde fiş listesini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'tekrar.html' sayfasındaysak bu fonksiyonu çalıştır
  if (document.getElementById("fisNoSelect")) {
    loadFisNumaralari();
  }
});

/**
 * Fiş numaraları listesini yükler ve select kutusunu doldurur.
 */
function loadFisNumaralari() {
  const selectElement = document.getElementById('fisNoSelect');
  selectElement.innerHTML = '<option value="">Yükleniyor...</option>'; // Mevcutları temizle
  
  console.log('Fiş numaraları yükleniyor...');
  // TODO: Google Sheets API'den fiş numaralarını çek
  
  // Örnek Veri
  setTimeout(() => { // API çağrısını simüle etmek için gecikme
    const fisler = ['CF-2025-001', 'CF-2025-002', 'CF-2025-003']; 
    selectElement.innerHTML = '<option value="">Seçiniz</option>'; // 'Yükleniyor'u temizle
    fisler.forEach(fisNo => {
      const option = document.createElement('option');
      option.value = fisNo;
      option.textContent = fisNo;
      selectElement.appendChild(option);
    });
  }, 1000); // 1 saniye bekle
}

/* ======================================== */
/* 11. iptal.html (Fiş İptal) FONKSİYONLARI */
/* ======================================== */

/**
 * İptal sebebi "Diğer" seçildiğinde özel sebep alanını gösterir/gizler.
 */
function toggleOzelSebep() {
  const sebepSelect = document.getElementById('iptalSebebiSelect');
  const ozelSebepContainer = document.getElementById('ozelSebepContainer');
  
  if (sebepSelect.value === 'Diğer') {
    ozelSebepContainer.style.display = 'block';
  } else {
    ozelSebepContainer.style.display = 'none';
    document.getElementById('ozelSebepInput').value = ''; // Gizlenince içeriği temizle
  }
}

/**
 * Fiş iptal işlemini kaydeder.
 */
function kaydetIptal() {
  const selectedFisNo = document.getElementById('fisNoSelect').value;
  const sebepSelect = document.getElementById('iptalSebebiSelect');
  const ozelSebepInput = document.getElementById('ozelSebepInput');
  
  if (!selectedFisNo) {
    alert('Lütfen iptal edilecek fiş numarasını seçiniz.');
    return;
  }
  
  let iptalSebebi = sebepSelect.value;
  if (iptalSebebi === '') {
     alert('Lütfen bir iptal sebebi seçiniz.');
     sebepSelect.focus();
     return; 
  }
  
  if (iptalSebebi === 'Diğer') {
    iptalSebebi = ozelSebepInput.value.trim();
    if (iptalSebebi === '') {
      alert('Lütfen "Diğer" iptal sebebini detaylı olarak yazınız.');
      ozelSebepInput.focus();
      return;
    }
  }
  
  // Onay istemek iyi bir fikir olabilir
  if (!confirm(`"${selectedFisNo}" numaralı fişi "${iptalSebebi}" sebebiyle iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      return;
  }

  console.log(`Fiş ${selectedFisNo} iptal ediliyor. Sebep: ${iptalSebebi}`);
  // TODO: Google Sheets API'ye iptal işlemini kaydet
  
  alert('Fiş başarıyla iptal edildi.');
  // İptal sonrası formu temizle veya başka bir sayfaya yönlendir
  document.getElementById('fisNoSelect').value = '';
  document.getElementById('fisDetaylari').value = '';
  document.getElementById('iptalSebebiSelect').value = '';
  toggleOzelSebep(); // Özel sebebi gizle
}


// Bu sayfa yüklendiğinde de fiş listesini çekmek lazım
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'iptal.html' sayfasındaysak fiş listesini yükle
  // (Hem select ID'si hem de iptal sebebi ID'si varsa bu sayfadayızdır)
  if (document.getElementById("fisNoSelect") && document.getElementById("iptalSebebiSelect")) {
    loadFisNumaralari(); // Fiş Tekrar ile aynı fonksiyonu kullanabiliriz
  }
});

/* NOT: loadFisDetaylari() ve loadFisNumaralari() fonksiyonları 
zaten bir önceki adımda (tekrar.html için) script.js'e eklenmişti. 
Bu sayfa da aynı fonksiyonları kullanacak.
*/

/* ======================================== */
/* 12. fiyat.html (Fiyat Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * Fiyat listesini yükler ve tabloyu doldurur.
 */
function loadPriceListData() {
  const container = document.getElementById('priceListRowsContainer');
  container.innerHTML = '<i>Yükleniyor...</i>'; // Önceki veriyi temizle
  
  console.log('Fiyat listesi verileri yükleniyor...');
  // TODO: Google Sheets API'den fiyat listesini çek
  
  // Örnek Veri
  setTimeout(() => { // API çağrısını simüle et
    const data = [
      { kod: 'STK001', ad: 'Ürün A (Kg)', satis: 15.50, maliyet: 10.00 },
      { kod: 'STK002', ad: 'Ürün B (Adet)', satis: 120.00, maliyet: 90.00 },
      { kod: 'STK003', ad: 'Hizmet C (Saat)', satis: 250.00, maliyet: 150.00 },
      // ... daha fazla satır
    ];
    
    container.innerHTML = ''; // 'Yükleniyor'u temizle
    
    if (data.length === 0) {
        container.innerHTML = '<i>Gösterilecek fiyat verisi bulunamadı.</i>';
        return;
    }

    data.forEach(item => {
      const row = document.createElement('div');
      row.className = 'price-list-row';
      
      // Satış ve maliyet değerlerini formatla (2 ondalık)
      const satisFiyati = parseFloat(item.satis || 0).toFixed(2);
      const maliyetFiyati = parseFloat(item.maliyet || 0).toFixed(2);
      
      // Kar oranını hesapla (ilk yüklemede)
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
  }, 1500); // 1.5 saniye bekle
}

/**
 * Bir satırdaki satış fiyatı veya maliyet değiştiğinde kar oranını hesaplar.
 * @param {HTMLElement} inputElement Değişiklik yapılan input.
 */
function calculateProfit(inputElement) {
    // Input'un ait olduğu satırı bul
    const row = inputElement.closest('.price-list-row');
    if (!row) return;

    // Satış fiyatını, maliyeti ve kar oranı input'unu bul
    const satisInput = row.querySelector('input:nth-child(3)');
    const maliyetInput = row.querySelector('input:nth-child(4)');
    const karOraniInput = row.querySelector('input:nth-child(5)');

    const satisFiyati = parseFloat(satisInput.value) || 0;
    const maliyetFiyati = parseFloat(maliyetInput.value) || 0;

    let karOrani = 0;
    // Maliyet 0'dan büyükse kar oranını hesapla
    if (maliyetFiyati > 0) {
        karOrani = ((satisFiyati - maliyetFiyati) / maliyetFiyati) * 100;
    }
    
    // Kar oranı input'unu güncelle (2 ondalıkla)
    karOraniInput.value = karOrani.toFixed(2);
}


/**
 * Fiyat listesindeki değişiklikleri kaydeder.
 */
function savePriceList() {
    console.log('Fiyat listesi değişiklikleri kaydediliyor...');
    const rows = document.querySelectorAll('#priceListRowsContainer .price-list-row');
    const dataToSave = [];

    rows.forEach(row => {
        const kod = row.querySelector('input:nth-child(1)').value;
        // const ad = row.querySelector('input:nth-child(2)').value; // Ada gerek yok, kod yeterli
        const satis = row.querySelector('input:nth-child(3)').value;
        const maliyet = row.querySelector('input:nth-child(4)').value;
        
        dataToSave.push({
            kod: kod,
            satis: parseFloat(satis) || 0,
            maliyet: parseFloat(maliyet) || 0
        });
    });

    console.log('Kaydedilecek Veri:', dataToSave);
    // TODO: Google Sheets API'ye 'dataToSave' dizisini gönderip güncelleme yap
    
    alert('Değişiklikler kaydediliyor... (Henüz API bağlı değil)');
}


// Bu sayfa yüklendiğinde fiyat listesini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'fiyat.html' sayfasındaysak listeyi yükle
  if (document.querySelector(".price-list-container")) {
    loadPriceListData();
  }
});

/* ======================================== */
/* 13. veresiye.html (Veresiye Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * Veresiye kayıtlarını yükler ve tabloyu doldurur.
 */
function loadVeresiyeData() {
  const tableBody = document.getElementById('veresiyeTableBody');
  tableBody.innerHTML = '<tr><td colspan="12" class="loading-text">Veresiye kayıtları yükleniyor...</td></tr>'; // Mevcutları temizle
  
  console.log('Veresiye verileri yükleniyor...');
  // TODO: Google Sheets API'den veresiye kayıtlarını çek
  
  // Örnek Veri
  setTimeout(() => { // API çağrısını simüle et
    const data = [
      { tarih: '27.10.2025', fisNo: 'VF-001', kullanici: 'Okan K.', satisTuru: 'Veresiye', musteriTipi: 'Ortak İçi', ortakNo: '123', adSoyad: 'Ali Veli', stokKodu: 'STK001', stokAdi: 'Gübre A', miktar: 500, birim: 'Kg', aciklama: 'Teslim edildi' },
      { tarih: '26.10.2025', fisNo: 'VF-002', kullanici: 'Okan K.', satisTuru: 'Veresiye', musteriTipi: 'Ortak Dışı', ortakNo: '', adSoyad: 'Ayşe Fatma', stokKodu: 'STK005', stokAdi: 'Yem B', miktar: 2, birim: 'Ton', aciklama: '' },
      // ... daha fazla satır
    ];
    
    tableBody.innerHTML = ''; // 'Yükleniyor'u temizle
    
    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="12" class="loading-text">Gösterilecek veresiye kaydı bulunamadı.</td></tr>';
      return;
    }

    data.forEach(item => {
      const row = tableBody.insertRow(); // Yeni satır ekle
      
      // Hücreleri sırayla doldur
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
      
      // İleride düzenleme/silme butonları için hücre eklenebilir
      // const actionsCell = row.insertCell();
      // actionsCell.innerHTML = '<button>Düzenle</button>'; 
    });
  }, 1500); // 1.5 saniye bekle
}

/**
 * Tabloda yapılan değişiklikleri kaydeder.
 * (Bu fonksiyon şu anki tasarımda aktif değil, ama ileride lazım olabilir)
 */
function kaydetTumDegisiklikleri() {
    console.log('Tablodaki değişiklikler kaydediliyor...');
    // TODO: Eğer tabloda düzenleme yapılacaksa, bu fonksiyon doldurulacak.
    // Şu anki tasarımda tablo sadece görüntüleme amaçlı.
    alert('Değişiklikleri Kaydet fonksiyonu henüz aktif değil.');
}


// Bu sayfa yüklendiğinde veresiye listesini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'veresiye.html' sayfasındaysak listeyi yükle
  if (document.getElementById("veresiyeTableBody")) {
    loadVeresiyeData();
  }
});

/* ======================================== */
/* 14. liste.html (Çıkış Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * Tarih filtreleme alanını gösterir/gizler.
 */
function toggleDateFilter() {
  const filterDiv = document.getElementById('dateFilter');
  if (filterDiv.style.display === 'flex') {
    filterDiv.style.display = 'none';
  } else {
    filterDiv.style.display = 'flex';
    // Açıldığında tarih inputlarına bugünü ata (opsiyonel)
    const today = new Date().toISOString().split('T')[0];
    if (!document.getElementById('startDate').value) {
        document.getElementById('startDate').value = today;
    }
     if (!document.getElementById('endDate').value) {
        document.getElementById('endDate').value = today;
    }
  }
}

/**
 * Belirtilen tarih aralığındaki verileri yükler.
 */
function fetchFilteredData() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  
  if (!startDate || !endDate) {
    alert('Lütfen başlangıç ve bitiş tarihlerini seçiniz.');
    return;
  }
  
  console.log(`Veriler ${startDate} ile ${endDate} arası için filtreleniyor...`);
  loadGenericListData({ startDate: startDate, endDate: endDate }); // Genel yükleme fonksiyonunu çağır
}

/**
 * Tüm verileri yükler (filtresiz).
 */
function fetchAllData() {
  console.log('Tüm veriler yükleniyor...');
  loadGenericListData({}); // Genel yükleme fonksiyonunu filtresiz çağır
}

/**
 * Genel liste verilerini yükler ve tabloyu doldurur.
 * @param {object} filter Filtreleme seçenekleri (örn: {startDate, endDate})
 */
function loadGenericListData(filter = {}) {
  const tableBody = document.getElementById('dataTableBody');
  if (!tableBody) return; // Yanlış sayfadaysak çık
  
  tableBody.innerHTML = '<tr><td colspan="12" class="loading-text">Liste yükleniyor...</td></tr>'; 
  
  console.log('Liste verileri yükleniyor... Filtre:', filter);
  // TODO: Google Sheets API'den Çıkış Listesi verilerini çek (filter objesini kullanarak)
  
  // Örnek Veri (veresiye ile aynı)
  setTimeout(() => { 
    const data = [
      { tarih: '27.10.2025', fisNo: 'CF-001', kullanici: 'Okan K.', satisTuru: 'Peşin', musteriTipi: 'Ortak Dışı', ortakNo: '', adSoyad: 'Deniz Can', stokKodu: 'STK002', stokAdi: 'Tohum C', miktar: 100, birim: 'Kg', aciklama: 'Ödendi' },
      { tarih: '26.10.2025', fisNo: 'CF-002', kullanici: 'Okan K.', satisTuru: 'Veresiye', musteriTipi: 'Ortak İçi', ortakNo: '456', adSoyad: 'Zeynep Su', stokKodu: 'STK001', stokAdi: 'Gübre A', miktar: 1, birim: 'Ton', aciklama: '' },
      // ... daha fazla satır
    ];

    // Örnek Filtreleme (API bunu sunucu tarafında yapmalı)
    const filteredData = data.filter(item => {
        if (filter.startDate && item.tarih) {
            // Tarih formatını YYYY-MM-DD'ye çevirip karşılaştırma (Basit örnek)
            const itemDate = item.tarih.split('.').reverse().join('-'); 
            if (itemDate < filter.startDate) return false;
        }
        if (filter.endDate && item.tarih) {
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
  }, 1000); // 1 saniye bekle
}


// Bu sayfa yüklendiğinde varsayılan olarak tüm listeyi çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'liste.html' sayfasındaysak listeyi yükle
  if (document.getElementById("dataTableBody")) {
    fetchAllData(); // Başlangıçta tüm verileri yükle
  }
});

/* ======================================== */
/* 15. giris.html (Depo Giriş) FONKSİYONLARI */
/* ======================================== */

/**
 * Müşteri tipini (Ortak İçi / Ortak Dışı) değiştirir (Giriş sayfası için).
 * @param {string} tip Seçilen tip ('ortak-ici' veya 'ortak-disi').
 * @param {HTMLElement} clickedButton Tıklanan buton.
 */
function toggleMusteriTipiGiris(tip, clickedButton) {
  const ortakIciPanel = document.getElementById('ortakIciPanel');
  const ortakDisiPanel = document.getElementById('ortakDisiPanel');
  const btnOrtakIci = document.getElementById('btnOrtakIci');
  const btnOrtakDisi = document.getElementById('btnOrtakDisi');

  // Önce tüm butonlardan 'active' sınıfını kaldır
  btnOrtakIci.classList.remove('active');
  btnOrtakDisi.classList.remove('active');
  // Tıklanan butona 'active' sınıfını ekle
  clickedButton.classList.add('active');

  if (tip === 'ortak-ici') {
    ortakIciPanel.style.display = 'block';
    ortakDisiPanel.style.display = 'none';
  } else {
    ortakIciPanel.style.display = 'none';
    ortakDisiPanel.style.display = 'block';
  }
}

/**
 * Giriş yapılacak stoklar bölümüne yeni bir satır ekler.
 */
function addStockRowGiris() {
  const container = document.getElementById('stockRowsContainer');
  const newRow = document.createElement('div');
  newRow.className = 'stock-row'; // cikis.html ile aynı class

  // TODO: Stok listesi API'den çekilecek
  newRow.innerHTML = `
      <select class="form-control">
          <option value="">Stok Kodu Seç...</option>
          <option value="STK001">STK001</option>
      </select>
      <select class="form-control">
          <option value="">Stok Adı Seç...</option>
          <option value="ÜRÜN A">ÜRÜN A</option>
      </select>
      <input type="number" class="form-control" placeholder="0">
      <select class="form-control">
          <option value="Kg">Kg</option>
          <option value="Ton">Ton</option>
          <option value="Lt">Lt</option>
          <option value="Adet">Adet</option>
      </select>
      <button class="btn-remove" onclick="removeStockRow(this)"><i class="fas fa-trash"></i></button>
  `; // Silme butonu için cikis.html'deki removeStockRow() kullanılabilir
  container.appendChild(newRow);
}


/**
 * Depo giriş kaydını kaydeder.
 */
function saveGirisKaydi() {
  console.log('Depo giriş kaydı kaydediliyor...');
  // TODO: Formdaki verileri topla (Müşteri tipi, no/ad, stok satırları)
  // TODO: Google Sheets API'ye verileri gönder
  
  alert('Giriş kaydı kaydediliyor... (Henüz API bağlı değil)');
}


// Bu sayfa yüklendiğinde ilk verileri ayarlamak için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'giris.html' sayfasındaysak
  if (document.querySelector(".entry-container")) {
    initGirisSayfasi();
  }
});

/**
 * Depo Giriş sayfasını başlatır (Tarih, Kullanıcı, Stok Listesi).
 */
function initGirisSayfasi() {
  // Tarih ve Kullanıcıyı ayarla
  document.getElementById('tarih').value = new Date().toLocaleDateString('tr-TR');
  document.getElementById('kullanici').value = 'Okan KOTAN'; // Örnek

  // Stok listesini yükle ve butonu aktifleştir
  console.log('Stok listesi yükleniyor (Giriş)...');
  // TODO: API'den stok listesini çekip select kutularına doldur
  setTimeout(() => { // API çağrısını simüle et
      const btnAddStock = document.getElementById('btnAddStock');
      btnAddStock.innerHTML = '<i class="fas fa-plus"></i> Stok Ekle';
      btnAddStock.disabled = false;
      
      // TODO: Ortak listelerini de yükle (ortakNo, ortakAdSoyad select'leri)
      
  }, 1500); // 1.5 saniye bekle
}

/* ======================================== */
/* 16. cikis-kayit.html (Depo Çıkış) FONKSİYONLARI */
/* ======================================== */

/**
 * Seçilen müşterinin bekleyen çıkış detaylarını yükler.
 */
function getDetaylar() {
  const musteriSelect = document.getElementById('musteriSelect');
  const selectedMusteri = musteriSelect.value;
  const detayTablosuDiv = document.getElementById('detaylarTablosu');
  const tableBody = document.getElementById('dataTableBody');

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
    // Örnek: Müşterinin 'Veresiye' sayfasındaki eşleşen kayıtları
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
      row.dataset.rowId = item.id; // Satırı Sheets'teki ID ile ilişkilendir
      
      const siparisMiktari = parseFloat(item.siparis || 0);
      const toplamCikan = parseFloat(item.cikan || 0);
      const kalan = siparisMiktari - toplamCikan;

      row.insertCell().textContent = item.tarih || '';
      row.insertCell().textContent = item.kod || '';
      row.insertCell().textContent = item.ad || '';
      row.insertCell().textContent = siparisMiktari; // Sipariş Miktarı
      row.insertCell().textContent = item.birim || '';
      row.insertCell().textContent = toplamCikan; // Toplam Çıkan
      row.insertCell().textContent = kalan; // Kalan
      row.cells[6].classList.add('kalan-td'); // Kalan hücresine stil ekle
      
      // Bu Sefer Çıkan Miktar input'u
      const cikanInputCell = row.insertCell();
      cikanInputCell.innerHTML = `<input type="number" class="cikan-miktar-input" placeholder="0" max="${kalan}">`;
      
      // Tamamlanmış satırları (kalan=0) pasif yap (opsiyonel)
      if (kalan <= 0) {
          row.style.opacity = "0.6";
          row.querySelector('.cikan-miktar-input').disabled = true;
          row.querySelector('.cikan-miktar-input').value = ''; 
      }
    });
  }, 1000); 
}

/**
 * Girilen çıkış miktarlarını kaydeder.
 */
function kaydetCikis() {
    const tableBody = document.getElementById('dataTableBody');
    const rows = tableBody.querySelectorAll('tr');
    const dataToSave = [];

    rows.forEach(row => {
        const rowId = row.dataset.rowId; // Sheets'teki satır ID'si
        const inputElement = row.querySelector('.cikan-miktar-input');
        
        if (inputElement && !inputElement.disabled) {
            const cikanMiktar = parseFloat(inputElement.value) || 0;
            if (cikanMiktar > 0) {
                // Kaydedilecekler listesine ekle
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
    // TODO: Google Sheets API'ye 'dataToSave' dizisini gönder.
    // API tarafında:
    // 1. İlgili satırları ID ile bul.
    // 2. 'Toplam Çıkan' sütununu güncelle (eski değer + yeni miktar).
    // 3. İsteğe bağlı: Ayrı bir 'Çıkış Hareketleri' sayfasına yeni kayıt ekle.
    
    alert('Çıkışlar kaydediliyor... (Henüz API bağlı değil)');
    
    // Başarılı kayıttan sonra tabloyu yenilemek iyi olabilir
    getDetaylar(); 
}


// Bu sayfa yüklendiğinde müşteri listesini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'cikis-kayit.html' sayfasındaysak
  if (document.getElementById("musteriSelect") && document.getElementById("detaylarTablosu")) {
    loadMusteriListesiCikis();
  }
});

/**
 * Müşteri listesini yükler (çıkış kaydı sayfası için).
 */
function loadMusteriListesiCikis() {
  const selectElement = document.getElementById('musteriSelect');
  selectElement.innerHTML = '<option value="">Yükleniyor...</option>'; 
  
  console.log('Müşteri listesi yükleniyor (Çıkış Kaydı)...');
  // TODO: Google Sheets API'den bekleyen çıkışı olan müşterilerin listesini çek
  // (Hem Ortak İçi hem Ortak Dışı olabilir)
  
  // Örnek Veri
  setTimeout(() => { 
    const musteriler = [
        { value: 'OID-123', text: 'Ali Veli (Ortak İçi - 123)' },
        { value: 'OD-Ayse', text: 'Ayşe Fatma (Ortak Dışı)' },
        { value: 'OID-456', text: 'Zeynep Su (Ortak İçi - 456)' }
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

/* ======================================== */
/* 17. kayitlar.html (Kayıt Görüntüle) FONKSİYONLARI */
/* ======================================== */

let currentFilter = { status: 'Tümü', musteri: 'Tümü' }; // Mevcut filtre durumunu sakla

/**
 * Tabloya filtre uygular ve verileri yeniden yükler.
 * @param {string|null} status Durum filtresi ('Tümü', 'Devam Ediyor', 'Tamamlandı'). null ise değişmez.
 * @param {HTMLElement} element Filtreyi tetikleyen element (buton veya select).
 */
function applyFilter(status, element) {
  if (element.tagName === 'BUTTON') {
      // Durum filtresi butonu tıklandı
      currentFilter.status = status;
      // Aktif butonu güncelle
      document.querySelectorAll('.filter-bar .btn-filter').forEach(btn => btn.classList.remove('active'));
      element.classList.add('active');
  } else if (element.tagName === 'SELECT') {
      // Müşteri filtresi değişti
      currentFilter.musteri = element.value;
  }
  
  // Verileri yeni filtreyle yükle
  loadKayitlarData(currentFilter);
}

/**
 * Depo Kayıtlarını yükler ve tabloyu doldurur.
 * @param {object} filter Filtreleme seçenekleri (örn: {status, musteri})
 */
function loadKayitlarData(filter = { status: 'Tümü', musteri: 'Tümü' }) {
  const tableBody = document.getElementById('dataTableBody');
  if (!tableBody) return; // Yanlış sayfadaysak çık
  
  tableBody.innerHTML = `<tr><td colspan="13" class="loading-text">Kayıtlar yükleniyor (${filter.status}, ${filter.musteri})...</td></tr>`; 
  
  console.log('Kayıtlar yükleniyor... Filtre:', filter);
  // TODO: Google Sheets API'den Depo Kayıtları verilerini çek (filter objesini kullanarak)
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { id: 'kayit1', tarih: '27.10.2025', kullanici: 'Okan K.', ortakNo: '123', adSoyad: 'Ali Veli', kod: 'STK001', ad: 'Gübre A', alinan: 500, birim: 'Kg', sonCikan: '50 Kg (27.10)', toplamCikan: 250, kalan: 250, durum: 'Devam Ediyor' },
      { id: 'kayit2', tarih: '26.10.2025', kullanici: 'Okan K.', ortakNo: '', adSoyad: 'Ayşe Fatma', kod: 'STK005', ad: 'Yem B', alinan: 2, birim: 'Ton', sonCikan: '2 Ton (26.10)', toplamCikan: 2, kalan: 0, durum: 'Tamamlandı' },
      { id: 'kayit3', tarih: '25.10.2025', kullanici: 'Diğer', ortakNo: '456', adSoyad: 'Zeynep Su', kod: 'STK001', ad: 'Gübre A', alinan: 100, birim: 'Kg', sonCikan: '100 Kg (25.10)', toplamCikan: 100, kalan: 0, durum: 'Tamamlandı' },
      { id: 'kayit4', tarih: '28.10.2025', kullanici: 'Okan K.', ortakNo: '', adSoyad: 'Deniz Can', kod: 'STK002', ad: 'Tohum C', alinan: 100, birim: 'Kg', sonCikan: '', toplamCikan: 0, kalan: 100, durum: 'Devam Ediyor' }
    ];

    // Örnek Filtreleme (API bunu sunucu tarafında yapmalı)
    const filteredData = data.filter(item => {
        // Durum filtresi
        if (filter.status !== 'Tümü' && item.durum !== filter.status) {
            return false;
        }
        // Müşteri filtresi (AdSoyad veya OrtakNo ile eşleşme - basit örnek)
        if (filter.musteri !== 'Tümü' && item.adSoyad !== filter.musteri && item.ortakNo !== filter.musteri) {
             // Gerçekte daha karmaşık eşleştirme gerekebilir (value'lar ID olabilir)
             return false;
        }
        return true;
    });
    
    tableBody.innerHTML = ''; 
    
    if (filteredData.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="13" class="loading-text">Belirtilen kriterlere uygun kayıt bulunamadı.</td></tr>';
      return;
    }

    filteredData.forEach(item => {
      const row = tableBody.insertRow(); 
      row.dataset.recordId = item.id; // Kayıt ID'sini satıra ekle
      
      row.insertCell().textContent = item.tarih || '';
      row.insertCell().textContent = item.kullanici || '';
      row.insertCell().textContent = item.ortakNo || '';
      row.insertCell().textContent = item.adSoyad || '';
      row.insertCell().textContent = item.kod || '';
      row.insertCell().textContent = item.ad || '';
      row.insertCell().textContent = item.alinan || '';
      row.insertCell().textContent = item.birim || '';
      row.insertCell().textContent = item.sonCikan || '';
      row.insertCell().textContent = item.toplamCikan || '0';
      row.insertCell().textContent = item.kalan || '0';
      
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
      } else {
           islemCell.innerHTML = ''; // Tamamlanmışsa boş
      }
    });
  }, 1000); 
}

/**
 * Bir depo kaydını iptal etme işlemini başlatır.
 * @param {string} recordId İptal edilecek kaydın ID'si.
 * @param {string} musteriAdi Onay mesajı için müşteri adı.
 * @param {string} stokAdi Onay mesajı için stok adı.
 */
function cancelRecord(recordId, musteriAdi, stokAdi) {
    if (!confirm(`"${musteriAdi}" müşterisinin "${stokAdi}" kaydını iptal etmek istediğinizden emin misiniz? Bu işlem ilişkili çıkışları etkileyebilir ve geri alınamaz!`)) {
        return;
    }
    
    console.log(`Kayıt ${recordId} iptal ediliyor...`);
    // TODO: Google Sheets API'ye iptal isteği gönder
    // API tarafında:
    // 1. Kaydı bul (ID ile).
    // 2. Durumunu 'İptal Edildi' yap veya satırı sil/arşivle.
    // 3. İlişkili çıkış kayıtlarını (varsa) güncelle/işaretle.
    
    alert(`Kayıt ${recordId} iptal ediliyor... (Henüz API bağlı değil)`);
    
    // Başarılı iptal sonrası tabloyu yenile
    loadKayitlarData(currentFilter);
}


/**
 * Müşteri listesini yükler (filtre için).
 */
function loadMusteriFiltreListesi() {
  const selectElement = document.getElementById('musteriFiltre');
  // <option value="Tümü"> korunsun
  
  console.log('Müşteri filtre listesi yükleniyor...');
  // TODO: Google Sheets API'den tüm müşterilerin (Ortak+OrtakDışı) listesini çek
  
  // Örnek Veri
  setTimeout(() => { 
    const musteriler = [
        { value: 'Ali Veli', text: 'Ali Veli' },
        { value: 'Ayşe Fatma', text: 'Ayşe Fatma' },
        { value: 'Zeynep Su', text: 'Zeynep Su' },
        { value: 'Deniz Can', text: 'Deniz Can' }
    ]; 
    musteriler.forEach(musteri => {
      const option = document.createElement('option');
      option.value = musteri.value; // Veya müşteri ID'si
      option.textContent = musteri.text;
      selectElement.appendChild(option);
    });
  }, 500); // Filtre daha hızlı yüklenebilir
}


// Bu sayfa yüklendiğinde varsayılan olarak tüm listeyi ve filtreyi çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'kayitlar.html' sayfasındaysak
  if (document.querySelector(".records-table-container")) {
    loadKayitlarData(currentFilter); // Başlangıçta tüm verileri yükle
    loadMusteriFiltreListesi(); // Müşteri filtresini doldur
  }
});

/* ======================================== */
/* 18. stok-gor.html (Stok Görüntüle) FONKSİYONLARI */
/* ======================================== */

/**
 * Stok listesi verilerini yükler ve tabloyu doldurur.
 */
function loadStokListData() {
  const tableBody = document.getElementById('stokTableBody');
  if (!tableBody) return; // Yanlış sayfadaysak çık
  
  tableBody.innerHTML = '<tr><td colspan="6" class="loading-text">Stok verileri yükleniyor...</td></tr>'; 
  
  console.log('Stok listesi yükleniyor...');
  // TODO: Google Sheets API'den 'Stok Kartları' sayfasındaki verileri çek
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { kod: 'STK001', ad: 'Gübre A - DAP 18-46-0', birim: 'Kg', ham_amb: '50', ham_birim: 'Kg', tur: 'Gübre' },
      { kod: 'STK002', ad: 'Tohum C - Buğday Sertifikalı', birim: 'Kg', ham_amb: '1000', ham_birim: 'Kg', tur: 'Tohum' },
      { kod: 'STK005', ad: 'Yem B - Süt Yemi 19 Protein', birim: 'Ton', ham_amb: '1', ham_birim: 'Ton', tur: 'Yem' },
      { kod: 'MTR001', ad: 'Motorin (Petrol Ofisi)', birim: 'Lt', ham_amb: '1', ham_birim: 'Lt', tur: 'Akaryakıt' },
      // ... daha fazla satır
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
  }, 1000); // 1 saniye bekle
}


// Bu sayfa yüklendiğinde stok listesini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'stok-gor.html' sayfasındaysak listeyi yükle
  if (document.getElementById("stokTableBody")) {
    loadStokListData(); 
  }
});

/* ======================================== */
/* 19. stok-guncelle.html (Stok Güncelle) FONKSİYONLARI */
/* ======================================== */

// --- Global Değişkenler (Stok Güncelleme için) ---
const ambalajListesi = ['Adet', 'Cc', 'Gr', 'Kg', 'Lt', 'Metre', 'ML', 'Ton'];
const stokTuruListesi = ['Halk Sağlığı', 'Kimyevi Gübre', 'Madeni Yağ', 'Market', 'Motorin', 'Sıvı Gübre', 'Sulama', 'Tohum', 'Toz Gübre', 'Yem', 'Zirai İlaç'];
// Hamaliye Birimi koşulları
const birimKosullari = {
    'Adet': ['1'], 'Cc': ['200','250','500'], 'Gr': ['50','80','100','400','500','750','800','1750'],
    'Kg': ['1','3','4','5','9','10','16','17.5','25','40','50','1000'],
    'Lt': ['0.1','1','3','5','8','10','17','20'], 'Metre': ['5'], 'ML': ['500'], 'Ton': ['1']
};
// --- --- ---


/**
 * Stok verilerini yükler ve düzenlenebilir tabloyu oluşturur.
 */
function loadStokYonetimData() {
  const tableBody = document.getElementById('stokTableBody');
  if (!tableBody) return; // Yanlış sayfadaysak çık
  
  tableBody.innerHTML = '<tr><td colspan="6" class="loading-text">Stok verileri yükleniyor...</td></tr>'; 
  
  console.log('Stok Yönetim verileri yükleniyor...');
  // TODO: Google Sheets API'den 'Stok Kartları' sayfasındaki verileri çek
  
  // Örnek Veri (stok-gor ile aynı)
  setTimeout(() => { 
    const data = [
      { kod: 'STK001', ad: 'Gübre A - DAP 18-46-0', birim: 'Kg', ham_amb: 'Kg', ham_birim: '50', tur: 'Kimyevi Gübre' },
      { kod: 'STK002', ad: 'Tohum C - Buğday Sertifikalı', birim: 'Kg', ham_amb: 'Kg', ham_birim: '1000', tur: 'Tohum' },
      { kod: 'STK005', ad: 'Yem B - Süt Yemi 19 Protein', birim: 'Ton', ham_amb: 'Ton', ham_birim: '1', tur: 'Yem' },
      { kod: 'MTR001', ad: 'Motorin (Petrol Ofisi)', birim: 'Lt', ham_amb: '', ham_birim: '', tur: 'Akaryakıt' },
    ];
    
    renderEditableTable(data); // Düzenlenebilir tabloyu çiz
    
  }, 1000); // 1 saniye bekle
}

/**
 * Verilen stok verileriyle düzenlenebilir tabloyu oluşturur.
 * @param {Array} data Stok verileri dizisi.
 */
function renderEditableTable(data) {
    const tableBody = document.getElementById('stokTableBody');
    tableBody.innerHTML = ''; // Temizle
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="loading-text">Stok verisi bulunamadı.</td></tr>';
      return;
    }

    data.forEach(item => {
        const stokKodu = item.kod || '';
        const row = document.createElement('tr');
        row.id = `row-${stokKodu}`;
        
        // Sabit hücreler (Kod, Ad, Birim)
        row.innerHTML = `<td>${stokKodu}</td><td>${item.ad || ''}</td><td>${item.birim || ''}</td>`;

        // Dinamik Select Kutuları (Ambalaj, Birim, Tür)
        const ambalajTd = document.createElement('td');
        ambalajTd.innerHTML = createSelect(`ambalaj-${stokKodu}`, ambalajListesi, item.ham_amb || '', 
                                           `kaydetDegisiklik('${stokKodu}', 'Hamaliye Ambalajı', this)`);
        
        const birimTd = document.createElement('td');
        // Başlangıçta doğru birim listesini yükle
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
 * Verilen seçeneklerle bir select (dropdown) HTML'i oluşturur.
 * @param {string} id Select elementinin ID'si.
 * @param {Array} options Seçenekler dizisi.
 * @param {string} selectedValue Seçili olan değer.
 * @param {string} onChangeFunction Değişiklik olduğunda çağrılacak JS fonksiyonu (string olarak).
 * @returns {string} Oluşturulan select HTML'i.
 */
function createSelect(id, options, selectedValue, onChangeFunction) {
    let optionsHtml = '<option value="">Seçiniz</option>';
    options.forEach(opt => {
        // Değerleri string'e çevirerek karşılaştır (örn: 1 vs "1")
        const selected = (String(opt) === String(selectedValue)) ? 'selected' : '';
        optionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
    });
    return `<select id="${id}" class="form-select" onchange="${onChangeFunction}">${optionsHtml}</select>`;
}
 
/**
 * Hamaliye Ambalajı değiştiğinde Hamaliye Birimi listesini günceller.
 * @param {string} stokKodu İlgili stok kodu.
 * @param {string} yeniAmbalaj Seçilen yeni ambalaj değeri.
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
 * Stok verisindeki bir değişikliği kaydeder (API çağrısı yapar).
 * @param {string} stokKodu Değiştirilen stok kodu.
 * @param {string} sutunAdi Değiştirilen sütunun adı (Sheets'teki başlık).
 * @param {HTMLElement} element Değişikliği tetikleyen select elementi.
 */
function kaydetDegisiklik(stokKodu, sutunAdi, element) {
    const yeniDeger = element.value;
    const row = document.getElementById(`row-${stokKodu}`);
    
    // Eğer Ambalaj değiştiyse, Birim listesini güncelle ve Birim hücresini sunucuda sıfırla
    if (sutunAdi === 'Hamaliye Ambalajı') {
        guncelleBirimListesi(stokKodu, yeniDeger);
        // Birim hücresini de sunucuda boş olarak güncellemek için ayrı bir API çağrısı yap
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
        
        // Başarısız olursa eski değere geri döndür (opsiyonel)
        // if (!success) { element.value = eskiDeger; } 
    }, 750); // 0.75 saniye bekle
    // --- --- ---
}

/**
 * Bir tablo satırını geçici olarak vurgular (başarılı/başarısız).
 * @param {HTMLElement} row Vurgulanacak tablo satırı (TR elementi).
 * @param {boolean} success Başarılı ise true, değilse false.
 */
function highlightRow(row, success) {
    if (!row) return;
    row.classList.add(success ? 'row-success' : 'row-fail');
    setTimeout(() => {
        row.classList.remove('row-success', 'row-fail');
    }, 1500); // 1.5 saniye sonra vurguyu kaldır
}
 
/**
 * Ekranın sağ üst köşesinde bir bildirim gösterir.
 * @param {string} message Gösterilecek mesaj.
 * @param {boolean} success Başarı bildirimi mi (yeşil), hata mı (kırmızı).
 */
function showNotification(message, success) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'notification'; // Önceki sınıfları sıfırla
    notification.classList.add(success ? 'success' : 'error');
    notification.style.display = 'block';
    
    // 3 saniye sonra bildirimi gizle
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Bu sayfa yüklendiğinde stok listesini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'stok-guncelle.html' sayfasındaysak (notification ID'si varsa)
  if (document.getElementById("notification")) {
    loadStokYonetimData(); 
  }
});

/* ======================================== */
/* 20. stok-ekle.html (Yeni Stok Ekle) FONKSİYONLARI */
/* ======================================== */

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

/**
 * Hamaliye Ambalajı değiştiğinde Hamaliye Birimi listesini günceller (Stok Ekle sayfası için).
 * @param {string} yeniAmbalaj Seçilen yeni ambalaj değeri.
 */
function guncelleBirimListesiStokEkle(yeniAmbalaj) {
    const birimSelect = document.getElementById('hamaliyeBirim');
    if (!birimSelect) return; // Element yoksa çık
    
    // birimKosullari global değişkenini kullan (stok-guncelle'den)
    const yeniBirimler = birimKosullari[yeniAmbalaj] || []; 
    birimSelect.innerHTML = '<option value="">Seçiniz</option>'; // Temizle
    
    yeniBirimler.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        birimSelect.appendChild(option);
    });
}

/**
 * Yeni stok kaydını kaydeder.
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
    
    // Zorunlu alan kontrolü
    if (!stokData.kod || !stokData.ad) {
        alert("Stok Kodu ve Stok Adı alanları zorunludur.");
        return;
    }
    
    console.log('Yeni Stok Kaydediliyor:', stokData);
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    // TODO: Google Sheets API'ye yeni stok verisini gönder
    // API Çağrısı: addNewStok(stokData);
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => { 
        const success = Math.random() > 0.1; // %90 başarılı olsun
        const message = success ? `Stok "${stokData.kod}" başarıyla eklendi.` : `Hata: Stok "${stokData.kod}" eklenemedi!`;
        
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        alert(message); // Basit alert ile bildirim
        
        if (success) {
            // Formu sıfırla
            const form = document.getElementById('stokEkleForm');
            if (form) form.reset();
            // Hamaliye Birimi listesini de sıfırla
            guncelleBirimListesiStokEkle(''); 
        }
    }, 1000); // 1 saniye bekle
    // --- --- ---
}


// Bu sayfa yüklendiğinde select kutularını doldurmak için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'stok-ekle.html' sayfasındaysak (form ID'si varsa)
  if (document.getElementById("stokEkleForm")) {
    initStokEkleSayfasi();
  }
});

/**
 * Yeni Stok Ekle sayfasını başlatır (Select kutularını doldurur).
 */
function initStokEkleSayfasi() {
    // Global listeleri kullanarak select'leri doldur
    populateSelect('birim', birimListesiStokEkle);
    populateSelect('stokTuru', stokTuruListesi); // stok-guncelle'den gelen global liste
    populateSelect('hamaliyeAmbalaj', ambalajListesi); // stok-guncelle'den gelen global liste
    
    // Başlangıçta Hamaliye Birimi'ni boşalt/güncelle
    guncelleBirimListesiStokEkle(''); 
}

/* ======================================== */
/* 21. ortak.html (Ortak Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * Yeni ortak kaydı modal penceresini açar.
 */
function openModal() {
  const modal = document.getElementById('yeniKayitModal');
  if (modal) {
      // Formu temizle (varsa eski veriler kalmasın)
      const form = document.getElementById('yeniOrtakForm');
      if (form) form.reset();
      
      modal.style.display = 'flex';
  }
}

/**
 * Yeni ortak kaydı modal penceresini kapatır.
 */
function closeModal() {
  const modal = document.getElementById('yeniKayitModal');
  if (modal) {
      modal.style.display = 'none';
  }
}

/**
 * Yeni ortak kaydını kaydeder.
 */
function saveNewOrtak() {
  const ortakData = {
      no: document.getElementById('ortakNumarasi').value.trim(),
      tckn: document.getElementById('tckn').value.trim(),
      adSoyad: document.getElementById('adSoyadi').value.trim(),
      telefon: document.getElementById('telefon').value.trim(),
      mahalle: document.getElementById('mahalle').value.trim()
  };

  // Zorunlu alan kontrolü
  if (!ortakData.no || !ortakData.adSoyad) {
    alert("Ortak Numarası ve Adı Soyadı alanları zorunludur.");
    return;
  }

  console.log('Yeni Ortak Kaydediliyor:', ortakData);
  
  // TODO: Google Sheets API'ye yeni ortak verisini gönder
  // API Çağrısı: addNewPartner(ortakData);
  
  // --- Örnek API Yanıt Simülasyonu ---
  setTimeout(() => { 
    const success = Math.random() > 0.1; 
    const message = success ? `Ortak "${ortakData.adSoyad}" başarıyla eklendi.` : `Hata: Ortak eklenemedi!`;
    
    alert(message); // Basit alert ile bildirim
    
    if (success) {
      closeModal(); // Modalı kapat
      loadOrtakListesi(); // Listeyi yenile
    }
  }, 1000); 
  // --- --- ---
}

/**
 * Ortak listesini yükler ve tabloyu doldurur.
 */
function loadOrtakListesi() {
  const tableBody = document.getElementById('dataTableBody');
  if (!tableBody) return; // Yanlış sayfadaysak çık
  
  tableBody.innerHTML = '<tr><td colspan="5" class="loading-text">Ortak listesi yükleniyor...</td></tr>'; 
  
  console.log('Ortak listesi yükleniyor...');
  // TODO: Google Sheets API'den 'Ortaklar' sayfasındaki verileri çek
  
  // Örnek Veri
  setTimeout(() => { 
    const data = [
      { no: '123', tckn: '111...', adSoyad: 'Ali Veli', telefon: '555...', mahalle: 'Merkez' },
      { no: '456', tckn: '222...', adSoyad: 'Zeynep Su', telefon: '544...', mahalle: 'Yeni Mah.' },
      { no: '789', tckn: '333...', adSoyad: 'Hasan Kara', telefon: '533...', mahalle: 'Köy' },
    ];
    
    tableBody.innerHTML = ''; 
    
    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="loading-text">Gösterilecek ortak kaydı bulunamadı.</td></tr>';
      return;
    }

    data.forEach(item => {
      const row = tableBody.insertRow(); 
      row.insertCell().textContent = item.no || '';
      row.insertCell().textContent = item.tckn || '';
      row.insertCell().textContent = item.adSoyad || '';
      row.insertCell().textContent = item.telefon || '';
      row.insertCell().textContent = item.mahalle || '';
    });
  }, 1000); // 1 saniye bekle
}


// Bu sayfa yüklendiğinde ortak listesini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'ortak.html' sayfasındaysak (hem tablo hem modal varsa)
  if (document.getElementById("dataTableBody") && document.getElementById("yeniKayitModal")) {
    loadOrtakListesi(); 
  }
});

/* ======================================== */
/* 22. ortak-disi.html (Ortak Dışı Listesi) FONKSİYONLARI */
/* ======================================== */

/**
 * Yeni ortak dışı kaydı modal penceresini açar.
 */
function openModalOrtakDisi() {
  const modal = document.getElementById('yeniKayitModalOrtakDisi');
  if (modal) {
      const form = document.getElementById('yeniOrtakDisiForm');
      if (form) form.reset();
      modal.style.display = 'flex';
  }
}

/**
 * Yeni ortak dışı kaydı modal penceresini kapatır.
 */
function closeModalOrtakDisi() {
  const modal = document.getElementById('yeniKayitModalOrtakDisi');
  if (modal) {
      modal.style.display = 'none';
  }
}

/**
 * Yeni ortak dışı kaydını kaydeder.
 */
function saveNewOrtakDisi() {
  const ortakDisiData = {
      adSoyad: document.getElementById('odAdSoyadi').value.trim(),
      telefon: document.getElementById('odTelefon').value.trim()
  };

  // Zorunlu alan kontrolü
  if (!ortakDisiData.adSoyad || !ortakDisiData.telefon) {
    alert("Adı Soyadı ve Telefon Numarası alanları zorunludur.");
    return;
  }

  console.log('Yeni Ortak Dışı Kaydediliyor:', ortakDisiData);
  
  // TODO: Google Sheets API'ye yeni ortak dışı verisini gönder
  // API Çağrısı: addNewExternalPartner(ortakDisiData);
  
  // --- Örnek API Yanıt Simülasyonu ---
  setTimeout(() => { 
    const success = Math.random() > 0.1; 
    const message = success ? `Ortak Dışı "${ortakDisiData.adSoyad}" başarıyla eklendi.` : `Hata: Ortak Dışı eklenemedi!`;
    
    alert(message); 
    
    if (success) {
      closeModalOrtakDisi(); 
      loadOrtakDisiListesi(); // Listeyi yenile
    }
  }, 1000); 
  // --- --- ---
}

/**
 * Ortak Dışı listesini yükler ve tabloyu doldurur.
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
      { adSoyad: 'Mehmet Öztürk', telefon: '505...' },
    ];
    
    tableBody.innerHTML = ''; 
    
    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="2" class="loading-text">Gösterilecek ortak dışı kayıt bulunamadı.</td></tr>';
      return;
    }

    data.forEach(item => {
      const row = tableBody.insertRow(); 
      row.insertCell().textContent = item.adSoyad || '';
      row.insertCell().textContent = item.telefon || '';
    });
  }, 1000); // 1 saniye bekle
}


// Bu sayfa yüklendiğinde ortak dışı listesini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'ortak-disi.html' sayfasındaysak (modal ID'si varsa)
  if (document.getElementById("yeniKayitModalOrtakDisi")) {
    loadOrtakDisiListesi(); 
  }
});

/* ======================================== */
/* 22. ortak-disi.html (Ortak Dışı Listesi) FONKSİYONLARI (Güncellenmiş) */
/* ======================================== */

/**
 * Yeni ortak dışı kaydı modal penceresini açar.
 */
function openModalOrtakDisi() {
  const modal = document.getElementById('yeniKayitModalOrtakDisi');
  if (modal) {
      const form = document.getElementById('yeniOrtakDisiForm');
      if (form) form.reset(); // Formu temizle
      modal.style.display = 'flex';
  }
}

/**
 * Yeni ortak dışı kaydı modal penceresini kapatır.
 */
function closeModalOrtakDisi() {
  const modal = document.getElementById('yeniKayitModalOrtakDisi');
  if (modal) {
      modal.style.display = 'none';
  }
}

/**
 * Yeni ortak dışı kaydını kaydeder.
 */
function saveNewOrtakDisi() {
  const adSoyadInput = document.getElementById('odAdSoyadi');
  const telefonInput = document.getElementById('odTelefon');
  
  const ortakDisiData = {
      adSoyad: adSoyadInput ? adSoyadInput.value.trim() : '',
      telefon: telefonInput ? telefonInput.value.trim() : ''
  };

  // Zorunlu alan kontrolü
  if (!ortakDisiData.adSoyad || !ortakDisiData.telefon) {
    alert("Adı Soyadı ve Telefon Numarası alanları zorunludur.");
    return;
  }

  console.log('Yeni Ortak Dışı Kaydediliyor:', ortakDisiData);
  const tableBody = document.getElementById('dataTableBody');
  if(tableBody) tableBody.innerHTML = '<tr><td colspan="2" class="loading-text">Kaydediliyor...</td></tr>';
  
  // Modal kapatılır (isteğe bağlı, API yanıtını bekleyebilir)
  // closeModalOrtakDisi(); 

  // TODO: Google Sheets API'ye yeni ortak dışı verisini gönder
  // API Çağrısı: addNewExternalPartner(ortakDisiData);
  
  // --- Örnek API Yanıt Simülasyonu ---
  setTimeout(() => { 
    const success = Math.random() > 0.1; 
    const message = success ? `Ortak Dışı "${ortakDisiData.adSoyad}" başarıyla eklendi.` : `Hata: Ortak Dışı eklenemedi!`;
    
    alert(message); 
    
    if (success) {
      closeModalOrtakDisi(); // Başarılıysa modalı kapat
    }
    loadOrtakDisiListesi(); // Listeyi her durumda yenile (başarılı veya başarısız)

  }, 1000); 
  // --- --- ---
}

/**
 * Ortak Dışı listesini yükler ve tabloyu doldurur.
 */
function loadOrtakDisiListesi() {
  const tableBody = document.getElementById('dataTableBody');
  // Sadece ortak-disi.html'de olduğumuzdan emin olmak için ekstra kontrol
  const container = document.querySelector('.partner-ext-list-container'); 
  if (!tableBody || !container) return; 
  
  tableBody.innerHTML = '<tr><td colspan="2" class="loading-text">Ortak Dışı listesi yükleniyor...</td></tr>'; 
  
  console.log('Ortak Dışı listesi yükleniyor...');
  // TODO: Google Sheets API'den 'Ortak Dışı' sayfasındaki verileri çek
  // API Çağrısı: getExternalPartnersList();
  
  // Örnek Veri
  setTimeout(() => { 
    // const data = [ { adSoyad: 'Ayşe Fatma', telefon: '544...' }, ... ]; // API'den gelen veri
     const data = [
      { adSoyad: 'Ayşe Fatma', telefon: '544...' },
      { adSoyad: 'Deniz Can', telefon: '532...' },
      { adSoyad: 'Mehmet Öztürk', telefon: '505...' },
    ];
    
    tableBody.innerHTML = ''; // Temizle
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="2" class="loading-text">Gösterilecek ortak dışı kayıt bulunamadı.</td></tr>';
      return;
    }

    data.forEach(item => {
      const row = tableBody.insertRow(); 
      row.insertCell().textContent = item.adSoyad || '';
      row.insertCell().textContent = item.telefon || '';
    });
  }, 1000); // 1 saniye bekle
}


// Bu sayfa yüklendiğinde ortak dışı listesini çekmek için
// (Bu event listener zaten bir önceki adımda eklenmişti, tekrar eklemeye gerek yok)
/*
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("yeniKayitModalOrtakDisi")) {
    loadOrtakDisiListesi(); 
  }
});
*/

// safeJsonParse fonksiyonu (Eğer script.js'de henüz yoksa ekleyin)
/**
 * String JSON verisini güvenli bir şekilde parse eder.
 * @param {*} response Parse edilecek veri (string veya obje olabilir).
 * @returns {object} Parse edilmiş obje veya hata objesi.
 */
function safeJsonParse(response) {
   if (typeof response === 'string') {
       try { return JSON.parse(response); } 
       catch (e) { 
           console.error("JSON Parse Hatası:", e, "Gelen Veri:", response);
           return { success: false, message: "Sunucudan gelen veri formatı hatalı." }; 
       }
   }
   // Zaten obje ise direkt döndür
   return response; 
}

/* ======================================== */
/* 23. sayim.html (Stok Sayım) FONKSİYONLARI */
/* ======================================== */

let selectedFileContent = null; // Yüklenen Excel içeriğini tutar
let excelProcessed = false;     // Excel'in işlenip işlenmediğini belirtir

/**
 * Dosya seçildiğinde Excel dosyasını okur ve işler.
 * @param {Event} event Dosya seçim eventi.
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    const statusDisplay = document.getElementById('excelStatus');
    const startButton = document.getElementById('startButton');
    selectedFileContent = null;
    excelProcessed = false;
    if (statusDisplay) statusDisplay.textContent = '';
    if (startButton) startButton.disabled = true; 
    
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
 * Okunan Excel dosyasını işler ve verileri API'ye gönderir.
 */
function processExcelFile() {
    if (!selectedFileContent) return;
    const statusDisplay = document.getElementById('excelStatus');
    if (statusDisplay) statusDisplay.textContent = "Excel işleniyor...";
    
    try {
        // XLSX kütüphanesi ile Excel'i oku
        const workbook = XLSX.read(selectedFileContent, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // Tüm satırları JSON olarak al (başlık satırı dahil değil)
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null, range: 1 }); 
        
        let extractedData = [];
        // Satırları gez, E sütunu (index 4) doluysa veriyi al
        sheetData.forEach(row => {
            const valueE = row[4]; // E Sütunu (Miktar)
            // Sadece E sütunu dolu ve sayısal bir değerse al (veya 0 ise de al)
            if (valueE !== null && valueE !== undefined && (valueE === 0 || !isNaN(parseFloat(valueE)))) {
                extractedData.push([
                    row[0] || '', // A Sütunu (Stok Kodu)
                    row[1] || '', // B Sütunu (Stok Adı) - Opsiyonel, sadece kodu gönderebiliriz
                    parseFloat(valueE) // E Sütunu (Miktar) - Sayı olarak
                ]);
            }
        });
        
        if (extractedData.length === 0) {
           if (statusDisplay) statusDisplay.textContent = "Excel'de geçerli (E sütunu dolu) satır bulunamadı."; 
           resetFileInput();
           return;
        }

        console.log("Excel'den çıkarılan veri:", extractedData);
        if (statusDisplay) statusDisplay.textContent = `${extractedData.length} satır bulundu, sunucuya gönderiliyor...`;

        // TODO: Google Sheets API'ye 'extractedData' dizisini gönder
        // API Çağrısı: processExcelData(extractedData);
        // API tarafında: Bu veriler geçici bir sayfaya (örn: 'ExcelSayim') yazılabilir.

        // --- Örnek API Yanıt Simülasyonu ---
        setTimeout(() => {
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
        if (statusDisplay) statusDisplay.textContent = "Excel işleme hatası: " + error.message;
        resetFileInput();
    } 
}

/**
 * Dosya inputunu sıfırlar.
 */
function resetFileInput() {
    selectedFileContent = null;
    excelProcessed = false;
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = null; // Seçili dosyayı temizle
    const startButton = document.getElementById('startButton');
     if (startButton) startButton.disabled = true; // Başlat butonunu pasifleştir
}

/**
 * Seçilen filtreye göre stok sayım verilerini çeker ve tabloyu oluşturur.
 */
function sayimaBasla() {
    const filterSelect = document.getElementById('stokTuruFiltre');
    const filterValue = filterSelect ? filterSelect.value : 'Tümü';
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = `<tr><td colspan="9" class="loading-text">"${filterValue}" için sayım verileri yükleniyor...</td></tr>`;
    
    console.log(`Sayım başlatılıyor... Filtre: ${filterValue}, Excel İşlendi mi: ${excelProcessed}`);
    
    // TODO: Google Sheets API'den stok sayım verilerini çek
    // API Çağrısı: getStokSayimData(filterValue, excelProcessed); 
    // API tarafında:
    // 1. Gerekirse 'Stok Kartları'nı filtrele.
    // 2. Her stok için 'Veresiye', 'PesinKK', 'Cikacak' miktarlarını hesapla.
    // 3. Eğer excelProcessed=true ise, 'ExcelSayim' sayfasından Miktar (Excel)'i al.
    // 4. Tüm verileri birleştirip geri gönder.
    
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
 * Stok sayım verileriyle tabloyu oluşturur.
 * @param {Array} data Stok sayım verileri dizisi.
 */
function renderSayimTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = ''; // Temizle
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="9" class="loading-text">Bu kriterlere uygun stok bulunamadı.</td></tr>';
      return;
    }
    
    data.forEach(item => {
        const row = tableBody.insertRow();
        // Orijinal satır numarasını (Sheets'teki) sakla
        row.dataset.originalRow = item.originalRow; 
        
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
 * Bir satırdaki Kalan ve Durum değerlerini yeniden hesaplar.
 * @param {HTMLTableRowElement} trElement Hesaplama yapılacak TR elementi.
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
        
        // Kalan = (Mevcut Depo + Veresiye + Peşin/KK) - Çıkacak - Excel Miktarı
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
 * "Mevcut" sütunundaki değişikliği kaydeder (API çağrısı yapar).
 * @param {number} rowNum Değiştirilen satırın Sheets'teki numarası.
 * @param {string} colName Değiştirilen sütun adı ('D').
 * @param {string} newValue Yeni değer.
 */
function saveCellChange(rowNum, colName, newValue) {
   if (colName === 'D' && rowNum) { // Sadece D sütunu ve satır numarası varsa
        console.log(`Kaydediliyor: Satır=${rowNum}, Sütun=${colName}, Değer=${newValue}`);
        // TODO: Google Sheets API'ye güncelleme isteği gönder
        // API Çağrısı: updateSayimCell(rowNum, colName, newValue);
        
        // --- Örnek API Yanıt Simülasyonu ---
         setTimeout(() => {
            console.log(`Satır ${rowNum} güncellendi (simülasyon).`);
            // Başarı/hata bildirimi veya satır vurgulama eklenebilir
         }, 500);
        // --- --- ---
   }
}
 
/**
 * Tablodaki mevcut verilerle bir PDF oluşturur ve açar.
 */
function yazdirGuncelListeyi() {
    const tableBody = document.getElementById('dataTableBody');
    const rows = tableBody ? tableBody.querySelectorAll('tr') : [];
    
    if (rows.length === 0 || rows[0].cells.length <= 1) { // Veri yoksa veya sadece 'yükleniyor' mesajı varsa
        alert("Yazdırılacak veri bulunamadı. Lütfen önce 'Sayıma Başla' butonuna tıklayın.");
        return;
    }
    
    const loading = document.getElementById('loadingOverlay');
    const loadingText = loading ? loading.querySelector('.loading-text') : null;
    if (loading && loadingText) {
        loadingText.textContent = "PDF Oluşturuluyor...";
        loading.style.display = 'flex';
    }

    // Başlıkları al
    const headers = [
        "Stok Kodu", "Stok Adı", "Miktar (Excel)", "Mevcut", 
        "Veresiye", "Peşin/K.Kartı", "Çıkacak", "Kalan", "Durum"
    ];
    let dataToPrint = [headers];

    // Görünen satır verilerini topla
    rows.forEach(row => {
        // Hücrelerin varlığını kontrol et
        const mevcutInput = row.querySelector('.mevcut-input');
        if (row.cells.length < 9 || !mevcutInput) return; // Eksik hücreli satırı atla

        const rowData = [
            row.cells[0].textContent, // Stok Kodu
            row.cells[1].textContent, // Stok Adı
            row.cells[2].textContent, // Miktar (Excel)
            mevcutInput.value,        // Mevcut (Güncel değer)
            row.cells[4].textContent, // Veresiye
            row.cells[5].textContent, // Peşin/KK
            row.cells[6].textContent, // Çıkacak
            row.cells[7].textContent, // Kalan
            row.cells[8].textContent  // Durum
        ];
        dataToPrint.push(rowData);
    });

    console.log("PDF için gönderilecek veri:", dataToPrint);

    // TODO: Google Sheets API'ye PDF oluşturma isteği gönder
    // API Çağrısı: createSayimPdf(dataToPrint);
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        const success = Math.random() > 0.1;
        if (success) {
            // Başarılıysa, PDF URL'sini yeni sekmede aç (Örnek URL)
            const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"; 
            window.open(pdfUrl, '_blank');
        } else {
            alert("PDF oluşturulamadı!");
        }
    }, 2000); // 2 saniye bekle
    // --- --- ---
}


// Bu sayfa yüklendiğinde stok türü filtresini doldurmak için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'sayim.html' sayfasındaysak
  if (document.getElementById("resultsTable")) {
    loadStokTurleriFiltre();
  }
});

/**
 * Stok türleri listesini yükler ve filtre select kutusunu doldurur.
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
        
        // Mevcut seçenekleri temizle (ilk seçenek hariç)
        while (select.options.length > 1) {
            select.remove(1);
        }

        stokTurleri.forEach(tur => {
            const option = document.createElement('option');
            option.value = tur;
            option.textContent = tur;
            select.appendChild(option);
        });
        
        select.disabled = false; // Select'i aktifleştir
        const startButton = document.getElementById('startButton');
        if (startButton) startButton.disabled = false; // Başlat butonunu da aktifleştir

    }, 500); // Filtre hızlı yüklenebilir
}

/* ======================================== */
/* 24. talep.html (Talep Takibi) FONKSİYONLARI */
/* ======================================== */

// --- Global Değişkenler (Talep Takibi için) ---
let modalOrtakListesi = []; // Yeni talep modalı için ortak listesi
let currentUserEmail = '';    // Giriş yapan kullanıcı
// --- --- ---


/**
 * Sekmeler arasında geçiş yapar.
 * @param {string} tabName Gösterilecek sekmenin adı ('goruntule' veya 'islem').
 */
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const activeTab = document.getElementById(tabName + 'Tab');
    const activeButton = document.getElementById(tabName === 'goruntule' ? 'btnGoruntule' : 'btnIslem');
    
    if (activeTab) activeTab.classList.add('active');
    if (activeButton) activeButton.classList.add('active');
    
    // Aktif sekmeye göre ilgili veriyi yükle
    if (tabName === 'goruntule') {
        fetchTalepler();
    } else {
        const islemTuruSelect = document.getElementById('islemTuru');
        handleIslemChange(islemTuruSelect ? islemTuruSelect.value : ''); // Seçili işleme göre içeriği yükle
    }
}

/**
 * Filtrelere göre talep listesini yükler.
 */
function fetchTalepler() {
    const durumFiltre = document.getElementById('durumFiltre');
    const grupFiltre = document.getElementById('grupFiltre');
    const durum = durumFiltre ? durumFiltre.value : 'Tümü';
    const grup = grupFiltre ? grupFiltre.value : 'Tümü';
    const container = document.getElementById('goruntuleContainer');
    
    if (!container) return; // Eğer element yoksa çık
    
    container.innerHTML = '<div class="loading-text">Talepler yükleniyor...</div>';
    
    console.log(`Talepler yükleniyor... Durum: ${durum}, Grup: ${grup}`);
    // TODO: Google Sheets API'den Talep Listesini çek (filtrelerle)
    // API Çağrısı: getTalepListesi(durum, grup);
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => {
        const data = [
             { originalRow: 1, data: ['2025-10-27', 'user@example.com', '123', 'Ali Veli', '555...', 'Gübre', 'Üre Gübresi', '500 Kg', 'Talep Oluşturuldu', 'Acil lazım'] },
             { originalRow: 2, data: ['2025-10-26', 'user@example.com', '', 'Ayşe Fatma', '544...', 'Tohum', 'Buğday Tohumu', '1 Ton', 'Sipariş Edildi', 'Bekleniyor'] },
             { originalRow: 3, data: ['2025-10-25', 'other@example.com', '456', 'Zeynep Su', '533...', 'Yem', 'Süt Yemi', '2 Ton', 'Satışı Tamamlandı', 'Teslim edildi'] },
        ];
        
        // Örnek Filtreleme (API yapmalı)
        const filteredData = data.filter(item => {
           const row = item.data;
           if(durum !== 'Tümü' && row[8] !== durum) return false;
           if(grup !== 'Tümü' && row[5] !== grup) return false;
           return true; 
        });

        let tableHtml = '<table><thead><tr><th>Tarih</th><th>Kullanıcı</th><th>Ortak No</th><th>Adı Soyadı</th><th>Telefon</th><th>Ürün Grubu</th><th>Ürün Adı</th><th>Miktar</th><th>Durum</th><th>Açıklama</th></tr></thead><tbody>';
        if (filteredData.length > 0) {
            filteredData.forEach(item => {
                const rowData = item.data;
                // Tarihi formatla
                const tarih = rowData[0] ? new Date(rowData[0]).toLocaleDateString('tr-TR') : ''; 
                tableHtml += `<tr><td>${tarih}</td><td>${rowData[1]||''}</td><td>${rowData[2]||''}</td><td>${rowData[3]||''}</td><td>${rowData[4]||''}</td><td>${rowData[5]||''}</td><td>${rowData[6]||''}</td><td>${rowData[7]||''}</td><td>${rowData[8]||''}</td><td>${rowData[9]||''}</td></tr>`;
            });
        } else {
            tableHtml += '<tr><td colspan="10" class="loading-text">Bu kriterlere uygun talep bulunamadı.</td></tr>';
        }
        tableHtml += '</tbody></table>';
        container.innerHTML = tableHtml;
    }, 1000);
    // --- --- ---
}

/**
 * "İşlem" sekmesinde seçilen türe göre içeriği ayarlar.
 * @param {string} islem Seçilen işlem ('ekle' veya 'guncelle').
 */
function handleIslemChange(islem) {
    const container = document.getElementById('islemContainer');
    if (!container) return;
    container.innerHTML = ''; // Önce temizle
    
    if (islem === 'ekle') {
        container.innerHTML = `<div style="text-align:center; padding-top: 30px;">
                                <button class="btn btn-primary" style="padding:15px 30px; font-size:16px;" onclick="openTalepModal()">
                                    <i class="fas fa-plus"></i> Yeni Talep Girişi Yap
                                </button>
                               </div>`;
    } else if (islem === 'guncelle') {
        fetchUpdatableTalepler(); // Güncellenecek talepleri listele
    } else {
         container.innerHTML = '<div class="loading-text" style="padding-top: 30px;">Lütfen bir işlem türü seçiniz.</div>';
    }
}
 
/**
 * Yeni talep giriş modalını açar ve hazırlar.
 */
function openTalepModal() {
    const modal = document.getElementById('yeniTalepModal');
    const form = document.getElementById('yeniTalepForm');
    if (!modal || !form) return;
    
    // Modal içeriğini dinamik olarak oluştur (her açıldığında sıfırlansın)
    form.innerHTML = `
        <div class="modal-grid">
            <div><label>Tarih</label><input type="text" id="modalTarih" class="form-control" readonly></div>
            <div><label>Kullanıcı</label><input type="text" id="modalKullanici" class="form-control" readonly></div>
        </div>
        
        <div style="margin: 15px 0; text-align:center;">
            <button type="button" class="btn btn-sm" id="btnModalOrtakIci" onclick="modalToggleMusteriTipi('ortak-ici')">Ortak İçi</button> 
            <button type="button" class="btn btn-sm" id="btnModalOrtakDisi" onclick="modalToggleMusteriTipi('ortak-disi')">Ortak Dışı</button>
        </div>
        
        <div id="modalOrtakIciPanel" style="display:none;">
            <div class="modal-grid">
                <div><label>Ortak No</label><select id="modalOrtakNo" class="form-select"></select></div>
                <div><label>Adı Soyadı</label><select id="modalOrtakAdSoyad" class="form-select"></select></div>
                <div style="grid-column: 1 / -1;"><label>Telefon</label><input type="text" id="modalOrtakTelefon" class="form-control" readonly></div>
            </div>
        </div>
        
        <div id="modalOrtakDisiPanel" style="display:none;">
            <div class="modal-grid">
                <div><label>Adı Soyadı</label><input type="text" id="modalOdAdSoyad" class="form-control"></div>
                <div><label>Telefon</label><input type="text" id="modalOdTelefon" class="form-control"></div>
            </div>
        </div>
        
        <div style="border-top:1px solid #eee; margin-top:20px; padding-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                <h4>Ürünler</h4>
                <button type="button" class="btn-sm btn-primary" onclick="addUrunRow()"><i class="fas fa-plus"></i> Ürün Ekle</button>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 2fr 1fr auto; gap:10px; font-weight:bold; font-size:12px; padding-bottom:5px; border-bottom:1px solid #ccc; margin-bottom: 10px;">
                <label>Ürün Grubu</label><label>Ürün Adı</label><label>Miktar</label><span></span>
            </div>
            <div id="modalUrunlerContainer"></div>
        </div>
        
        <div class="modal-actions">
            <button type="button" class="btn btn-secondary" onclick="closeTalepModal()">İptal</button>
            <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Kaydet</button>
        </div>
    `;
    
    // Tarih ve kullanıcıyı ayarla
    const tarihInput = document.getElementById('modalTarih');
    if(tarihInput) tarihInput.value = new Date().toLocaleDateString('tr-TR');
    const kullaniciInput = document.getElementById('modalKullanici');
    if(kullaniciInput) kullaniciInput.value = currentUserEmail || 'Bilinmiyor'; // Global değişkenden al
    
    // Varsayılan olarak Ortak İçi seçili gelsin
    modalToggleMusteriTipi('ortak-ici'); 
    // İlk ürün satırını ekle
    addUrunRow(); 

    // Ortak listesini yükle (eğer daha önce yüklenmediyse)
    if (modalOrtakListesi.length === 0) {
        console.log("Modal için ortak listesi yükleniyor...");
        // TODO: API Çağrısı: getOrtakListesi(); (Ortak No, AdSoyad, Telefon içeren)
        // --- Simülasyon ---
        setTimeout(() => {
            modalOrtakListesi = [
                { numara: '123', adsoyad: 'Ali Veli', telefon: '555...' },
                { numara: '456', adsoyad: 'Zeynep Su', telefon: '533...' },
            ];
            populateModalOrtakDropdowns();
        }, 500);
        // --- --- ---
    } else {
        populateModalOrtakDropdowns(); // Liste zaten varsa doldur
    }
    
    if(modal) modal.style.display = 'flex'; // Modalı göster
}

/**
 * Yeni talep modalını kapatır.
 */
function closeTalepModal() { 
    const modal = document.getElementById('yeniTalepModal');
    if (modal) modal.style.display = 'none'; 
}

/**
 * Modal içinde müşteri tipini değiştirir (Ortak İçi / Ortak Dışı).
 * @param {string} tip Seçilen tip.
 */
function modalToggleMusteriTipi(tip) {
    const btnIci = document.getElementById('btnModalOrtakIci');
    const btnDisi = document.getElementById('btnModalOrtakDisi');
    const panelIci = document.getElementById('modalOrtakIciPanel');
    const panelDisi = document.getElementById('modalOrtakDisiPanel');

    if(btnIci) btnIci.style.backgroundColor = (tip==='ortak-ici' ? 'var(--tkk-green)' : '#6c757d');
    if(btnDisi) btnDisi.style.backgroundColor = (tip==='ortak-disi' ? 'var(--tkk-green)' : '#6c757d');
    if(panelIci) panelIci.style.display = (tip==='ortak-ici' ? 'block' : 'none');
    if(panelDisi) panelDisi.style.display = (tip==='ortak-disi' ? 'block' : 'none');
}

/**
 * Modal içindeki Ortak No ve Ad Soyad select kutularını doldurur.
 */
function populateModalOrtakDropdowns() {
    const noSelect = document.getElementById('modalOrtakNo');
    const adSelect = document.getElementById('modalOrtakAdSoyad');
    if (!noSelect || !adSelect) return;
    
    noSelect.innerHTML = '<option value="">Numara Seç...</option>';
    adSelect.innerHTML = '<option value="">Ad Soyad Seç...</option>';
    
    modalOrtakListesi.forEach((ortak, index) => {
        noSelect.add(new Option(ortak.numara, index));
        adSelect.add(new Option(ortak.adsoyad, index));
    });
    
    // Seçim değiştiğinde diğerini ve telefonu güncelle
    noSelect.onchange = () => updateModalOrtakDetails(noSelect.value);
    adSelect.onchange = () => updateModalOrtakDetails(adSelect.value);
}

/**
 * Modal içinde ortak seçildiğinde diğer select'i ve telefon numarasını günceller.
 * @param {string} selectedIndex Seçilen ortağın `modalOrtakListesi` içindeki index'i.
 */
function updateModalOrtakDetails(selectedIndex) {
    if(selectedIndex === "") { // "Seçiniz" seçildiyse
         document.getElementById('modalOrtakNo').value = "";
         document.getElementById('modalOrtakAdSoyad').value = "";
         document.getElementById('modalOrtakTelefon').value = "";
         return;
    }
    const ortak = modalOrtakListesi[selectedIndex];
    if (ortak) {
        document.getElementById('modalOrtakNo').value = selectedIndex;
        document.getElementById('modalOrtakAdSoyad').value = selectedIndex;
        document.getElementById('modalOrtakTelefon').value = ortak.telefon || '';
    }
}

/**
 * Modal içine yeni bir ürün satırı ekler.
 */
function addUrunRow() {
    const container = document.getElementById('modalUrunlerContainer');
    if (!container) return;
    
    const urunRow = document.createElement('div');
    const rowId = 'urunRow-' + Date.now(); // Benzersiz ID
    urunRow.id = rowId;
    urunRow.className = 'urun-row'; // CSS için class
    
    const urunGruplari = ['Gübre', 'Tohum', 'Motorin', 'Zirai İlaç', 'Yem', 'Diğer'];
    let optionsHtml = urunGruplari.map(g => `<option value="${g}">${g}</option>`).join('');
    
    urunRow.innerHTML = `
        <select class="form-select urun-grup"><option value="">Grup Seç...</option>${optionsHtml}</select>
        <input type="text" class="form-control urun-ad" placeholder="Ürün Adı...">
        <input type="text" class="form-control urun-miktar" placeholder="Miktar + Birim...">
        <button type="button" class="btn-sm btn-secondary" style="background-color:#dc3545;" onclick="removeDynamicRow('${rowId}')">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(urunRow);
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
 * Yeni talep formundaki verileri toplar ve kaydeder.
 */
function saveNewTalep() {
    const talepData = {
        tarih: document.getElementById('modalTarih')?.value,
        kullanici: document.getElementById('modalKullanici')?.value,
        musteriTipi: document.getElementById('modalOrtakIciPanel')?.style.display === 'block' ? 'Ortak İçi' : 'Ortak Dışı',
        ortakBilgileri: {},
        urunler: [],
        durum: 'Talep Oluşturuldu' // Varsayılan durum
    };

    // Müşteri bilgilerini al
    if (talepData.musteriTipi === 'Ortak İçi') {
        const selectedIndex = document.getElementById('modalOrtakNo')?.value;
        if(!selectedIndex || selectedIndex === "") { alert("Lütfen ortak seçiniz."); return; }
        const ortak = modalOrtakListesi[selectedIndex];
        talepData.ortakBilgileri = { numara: ortak.numara, adsoyad: ortak.adsoyad, telefon: ortak.telefon };
    } else {
        talepData.ortakBilgileri = { 
            adsoyad: document.getElementById('modalOdAdSoyad')?.value.trim(), 
            telefon: document.getElementById('modalOdTelefon')?.value.trim() 
        };
        if(!talepData.ortakBilgileri.adsoyad) { alert("Lütfen ortak dışı müşteri adını soyadını giriniz."); return; }
        // Ortak dışı için numara boş olabilir
        talepData.ortakBilgileri.numara = ''; 
    }

    // Ürün bilgilerini topla
    const urunRows = document.querySelectorAll('#modalUrunlerContainer .urun-row');
    urunRows.forEach(row => {
        const grup = row.querySelector('.urun-grup')?.value;
        const ad = row.querySelector('.urun-ad')?.value.trim();
        const miktar = row.querySelector('.urun-miktar')?.value.trim();
        // Sadece tüm alanları doluysa ekle
        if (grup && ad && miktar) { 
            talepData.urunler.push({ grup, ad, miktar }); 
        }
    });

    if (talepData.urunler.length === 0) { 
        alert("Lütfen en az bir geçerli ürün bilgisi giriniz (Grup, Ad, Miktar dolu olmalı)."); 
        return; 
    }

    console.log('Yeni Talep Kaydediliyor:', talepData);
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    // TODO: Google Sheets API'ye yeni talep verisini gönder
    // API Çağrısı: addNewTalep(talepData);
    // API tarafında: Bu veriler 'Talepler' sayfasına eklenecek.
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => { 
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        const success = Math.random() > 0.1; 
        const message = success ? `Talep başarıyla oluşturuldu.` : `Hata: Talep oluşturulamadı!`;
        alert(message);
        if (success) {
            closeTalepModal();
            // Eğer Görüntüle sekmesi aktifse listeyi yenile
            if(document.getElementById('btnGoruntule')?.classList.contains('active')) {
                fetchTalepler();
            }
        }
    }, 1500); 
    // --- --- ---
}
 
/**
 * "İşlem" sekmesinde, güncellenebilecek talepleri listeler.
 */
function fetchUpdatableTalepler() {
    const container = document.getElementById('islemContainer');
    if (!container) return;
    container.innerHTML = '<div class="loading-text">Güncellenecek talepler yükleniyor...</div>';
    
    console.log("Güncellenecek talepler yükleniyor...");
    // TODO: Google Sheets API'den sadece durumu güncellenebilir olan talepleri çek
    // API Çağrısı: getUpdatableTalepler(); (Belki sadece 'Talep Oluşturuldu' ve 'Sipariş Edildi' durumundakiler)
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => {
        const data = [
            { originalRow: 1, data: ['2025-10-27', 'user@example.com', '123', 'Ali Veli', '555...', 'Gübre', 'Üre Gübresi', '500 Kg', 'Talep Oluşturuldu', 'Acil lazım'] },
            { originalRow: 2, data: ['2025-10-26', 'user@example.com', '', 'Ayşe Fatma', '544...', 'Tohum', 'Buğday Tohumu', '1 Ton', 'Sipariş Edildi', 'Bekleniyor'] },
        ];
        
        let tableHtml = '<table><thead><tr><th>Tarih</th><th>Adı Soyadı</th><th>Ürün Adı</th><th>Mevcut Durum</th><th>Yeni Açıklama</th><th>İşlem</th></tr></thead><tbody>';
        if (data.length > 0) {
            data.forEach(item => {
                const rowData = item.data;
                const rowId = item.originalRow; // Sheets'teki satır numarası
                const tarih = rowData[0] ? new Date(rowData[0]).toLocaleDateString('tr-TR') : ''; 
                tableHtml += `<tr id="update-row-${rowId}">
                    <td>${tarih}</td>
                    <td>${rowData[3] || ''}</td>
                    <td>${rowData[6] || ''}</td>
                    <td class="durum-hucre">${rowData[8] || ''}</td>
                    <td class="aciklama-hucre">${rowData[9] || ''}</td>
                    <td><button class="btn-sm btn-orange" onclick="toggleUpdateRow(${rowId})">Güncelle</button></td>
                </tr>`;
             });
        } else {
            tableHtml += '<tr><td colspan="6" class="loading-text">Güncellenecek aktif talep bulunamadı.</td></tr>';
        }
        tableHtml += '</tbody></table>';
        container.innerHTML = tableHtml;
    }, 1000);
    // --- --- ---
}

/**
 * Güncelleme satırını düzenleme moduna geçirir.
 * @param {number} rowId Düzenlenecek satırın ID'si (Sheets'teki satır no).
 */
function toggleUpdateRow(rowId) {
    const row = document.getElementById(`update-row-${rowId}`);
    if (!row) return;
    
    const durumCell = row.querySelector('.durum-hucre');
    const aciklamaCell = row.querySelector('.aciklama-hucre');
    const button = row.querySelector('button');
    
    // Eğer zaten düzenleme modundaysa (input varsa) geri dön
    if (durumCell.querySelector('select')) return; 

    const mevcutDurum = durumCell.textContent;
    const mevcutAciklama = aciklamaCell.textContent;

    // Güncellenebilecek durumlar (Mevcut durumu hariç tut)
    const durumOptions = ['Talep Oluşturuldu', 'Sipariş Edildi', 'Tedarik Edilemiyor', 'İptal Edildi'];
    let selectHtml = `<select class="form-select-sm">`; // Daha küçük select
    // Önce mevcut durumu ekle (seçili olarak)
    selectHtml += `<option value="${mevcutDurum}">${mevcutDurum}</option>`;
    // Sonra diğer seçenekleri ekle
    durumOptions.filter(o => o !== mevcutDurum).forEach(o => selectHtml += `<option value="${o}">${o}</option>`);
    selectHtml += `</select>`;

    durumCell.innerHTML = selectHtml;
    aciklamaCell.innerHTML = `<input type="text" class="form-control-sm" value="${mevcutAciklama}" placeholder="Yeni açıklama...">`; // Daha küçük input
    
    // Butonu "Kaydet" yap
    button.textContent = "Kaydet";
    button.classList.remove('btn-orange');
    button.classList.add('btn-primary');
    button.setAttribute('onclick', `saveUpdateRow(${rowId})`);
}

/**
 * Güncellenen talep durumunu ve açıklamasını kaydeder.
 * @param {number} rowId Güncellenen satırın ID'si (Sheets'teki satır no).
 */
function saveUpdateRow(rowId) {
    const row = document.getElementById(`update-row-${rowId}`);
    if (!row) return;
    
    const durumSelect = row.querySelector('select');
    const aciklamaInput = row.querySelector('input');
    const button = row.querySelector('button');
    
    const yeniDurum = durumSelect ? durumSelect.value : '';
    const yeniAciklama = aciklamaInput ? aciklamaInput.value.trim() : '';

    // Açıklama boşsa veya sadece durum değiştiyse bile zorunlu kılalım
    if (yeniAciklama === '') {
        alert("Durum değişikliği için açıklama girmek zorunludur.");
        aciklamaInput.focus();
        return;
    }

    console.log(`Talep güncelleniyor: Satır=${rowId}, Durum=${yeniDurum}, Açıklama=${yeniAciklama}`);
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    // TODO: Google Sheets API'ye güncelleme isteği gönder
    // API Çağrısı: updateTalep(rowId, yeniDurum, yeniAciklama);
    // API tarafında: İlgili satırın Durum ve Açıklama sütunları güncellenecek.
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => { 
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        const success = Math.random() > 0.1; 
        const message = success ? `Talep başarıyla güncellendi.` : `Hata: Talep güncellenemedi!`;
        alert(message);
        if (success) {
            // Başarılıysa, satırı tekrar normal görünüme çevir (veya listeyi yenile)
            fetchUpdatableTalepler(); 
        } else {
             // Başarısızsa, belki düzenleme modunda bırakmak daha iyi?
             // Veya eski haline döndür:
             /*
             durumCell.innerHTML = mevcutDurum; 
             aciklamaCell.innerHTML = mevcutAciklama;
             button.textContent = "Güncelle";
             button.classList.remove('btn-primary');
             button.classList.add('btn-orange');
             button.setAttribute('onclick', `toggleUpdateRow(${rowId})`);
             */
        }
    }, 1500); 
    // --- --- ---
}


// Bu sayfa yüklendiğinde varsayılan olarak Görüntüle sekmesini yükle
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'talep.html' sayfasındaysak
  if (document.getElementById("goruntuleTab") && document.getElementById("islemTab")) {
      // Başlangıçta Görüntüle sekmesini yükle
      fetchTalepler(); 
      
      // Kullanıcı email'ini al (modal için)
      console.log("Kullanıcı email'i alınıyor...");
      // TODO: API Çağrısı: getUserEmail();
       setTimeout(()=> { currentUserEmail = 'ornek@kullanici.com'; console.log("Email:", currentUserEmail); }, 200);
  }
});
/* ======================================== */
/* 25. hamaliye.html (Hamaliye Hesaplama) FONKSİYONLARI */
/* ======================================== */

// --- Global Değişken (Hamaliye için) ---
let fisNumaralari = []; // Hamaliye hesaplamasında kullanılacak fiş listesi
// --- --- ---


/**
 * Hamaliye fiyatlarını düzenleme moduna geçirir veya kaydeder.
 * @param {HTMLElement} button Tıklanan Güncelle/Kaydet butonu.
 */
function togglePriceEdit(button) {
    const inputs = {
        yem: document.getElementById('yemFiyati'),
        gubre: document.getElementById('gubreFiyati'),
        diger: document.getElementById('digerFiyati')
    };
    const inputElements = Object.values(inputs); // Input elementlerinin dizisi

    if (button.dataset.state === 'view') {
        // Düzenleme moduna geç
        inputElements.forEach(input => {
            if(input) {
                // " TL" ekini ve boşlukları kaldırıp sayıya çevir
                input.value = parseFloat(String(input.value).replace('TL', '').trim()) || 0; 
                input.readOnly = false;
                input.type = 'number'; // Sayısal girişe izin ver
                input.step = '0.01';   // Ondalıklı girişe izin ver
            }
        });
        button.textContent = 'Kaydet';
        button.classList.remove('btn-guncelle'); 
        button.classList.add('btn-kaydet');
        button.dataset.state = 'edit';
        if(inputs.yem) inputs.yem.focus(); // İlk inputa odaklan
        
    } else {
        // Kaydetme moduna geç
        const prices = { 
            yem: parseFloat(inputs.yem?.value || 0), 
            gubre: parseFloat(inputs.gubre?.value || 0), 
            diger: parseFloat(inputs.diger?.value || 0) 
        };
        
        console.log("Hamaliye fiyatları güncelleniyor:", prices);
        // TODO: API Çağrısı: updateHamaliyePrices(prices);
        
        // --- Simülasyon ---
        showLoadingOverlay("Fiyatlar Kaydediliyor...");
        setTimeout(() => {
            hideLoadingOverlay();
            const success = true; // Simülasyon: Başarılı
            const message = success ? "Fiyatlar başarıyla güncellendi." : "Fiyatlar güncellenemedi!";
            alert(message); // Basit bildirim

            if (success) {
                inputElements.forEach(input => {
                    if(input) {
                        // Sayıyı TL formatına çevir
                        input.value = (parseFloat(input.value) || 0).toFixed(2) + " TL"; 
                        input.readOnly = true;
                        input.type = 'text'; // Tekrar metin yap
                    }
                });
                button.textContent = 'Güncelle';
                button.classList.remove('btn-kaydet'); 
                button.classList.add('btn-guncelle');
                button.dataset.state = 'view';
                hesaplaTumToplamlari(); // Kayıttan sonra toplamları yeniden hesapla
            }
        }, 1000);
        // --- --- ---
    }
}
 
/**
 * Yeni bir fiş satırı (select kutusu) ekler.
 */
function addFisRow() {
    const container = document.getElementById('fisRowsContainer');
    if (!container) return;

    const rowId = 'fisRow-' + Date.now();
    const fisRowContainer = document.createElement('div');
    fisRowContainer.id = rowId; 
    fisRowContainer.className = 'fis-row-container';
    
    // Fiş numarası seçeneklerini oluştur
    let optionsHtml = fisNumaralari.map(fis => `<option value="${fis.no}">${fis.no} (${fis.tarih})</option>`).join('');
    
    const content = `
        <div class="fis-grid-layout" data-row-id="${rowId}">
            <select class="fis-select" onchange="fetchFisDetails(this, '${rowId}')">
                <option value="">Fiş Seçiniz...</option>
                ${optionsHtml}
            </select>
            <div></div><div></div><div></div><div></div><div></div><div></div>
             <button class="btn-remove-item" onclick="removeFisContainer('${rowId}')"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="fis-items-details" style="display: none;"></div> 
    `; // itemsContainer başlangıçta gizli
    fisRowContainer.innerHTML = content;
    container.appendChild(fisRowContainer);
}

/**
 * Tüm fiş satırı konteynerını siler.
 * @param {string} rowId Silinecek konteynerın ID'si.
 */
function removeFisContainer(rowId) {
    const container = document.getElementById(rowId);
    if (container) {
        container.remove();
        hesaplaTumToplamlari(); // Sildikten sonra toplamları yeniden hesapla
    }
}


/**
 * Seçilen fişin detaylarını (ürünlerini) yükler ve gösterir.
 * @param {HTMLSelectElement} selectElement Fiş seçimi yapılan select kutusu.
 * @param {string} rowId İlgili fiş satırı konteynerının ID'si.
 */
function fetchFisDetails(selectElement, rowId) {
    const fisNo = selectElement.value;
    const container = document.getElementById(rowId);
    const itemsContainer = container ? container.querySelector('.fis-items-details') : null;
    const removeButtonCell = selectElement.parentElement.querySelector('button')?.parentElement; // Sil butonunun hücresi
    
    if (!itemsContainer) return;
    
    // Önceki detayları temizle ve gizle
    itemsContainer.innerHTML = '';
    itemsContainer.style.display = 'none'; 
    if(removeButtonCell) removeButtonCell.style.visibility = 'visible'; // Sil butonunu görünür yap

    if (!fisNo) { // "-- Seçiniz --" seçildiyse
        hesaplaTumToplamlari(); 
        return; 
    }

    itemsContainer.innerHTML = '<div style="padding:10px; font-style: italic; text-align: center;">Ürün detayları yükleniyor...</div>';
    itemsContainer.style.display = 'block'; // Yükleniyor mesajını göster
    if(removeButtonCell) removeButtonCell.style.visibility = 'hidden'; // Detay yüklenirken sil butonunu gizle
    
    console.log(`Fiş detayları yükleniyor: ${fisNo}`);
    // TODO: API Çağrısı: getDetailsForFis(fisNo);
    // API şunları dönmeli: { success: true, data: [ {stokKodu, stokAdi, miktar, birim, stokTuru, eSutunuDegeri}, ... ] }
    
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
                // Hamaliye hesaplamasında kullanılan E sütunu değerini sakla
                itemRow.dataset.eSutunu = item.eSutunuDegeri || 0; 
                
                itemRow.innerHTML = `
                    <div></div> <div style="text-align: center;"><input type="checkbox" onchange="handleCiftTekChange(this)"></div>
                    <div>${item.stokKodu || ''}</div>
                    <div>${item.stokAdi || ''}</div>
                    <div class="item-miktar" data-original-miktar="${item.miktar || 0}">${item.miktar || 0}</div>
                    <div>${item.stokTuru || ''}</div>
                    <div class="item-toplam">0.00</div> <button class="btn-remove-item" onclick="removeItemRow(this)"><i class="fas fa-trash-alt"></i></button>
                `;
                itemsContainer.appendChild(itemRow);
            });
        } else {
             itemsContainer.innerHTML = '<div style="padding:10px; color: red; text-align: center;">Bu fiş için detay bulunamadı veya yüklenemedi.</div>';
        }
        if(removeButtonCell) removeButtonCell.style.visibility = 'visible'; // Sil butonunu tekrar görünür yap
        hesaplaTumToplamlari(); // Detaylar yüklenince toplamları hesapla
    }, 800);
    // --- --- ---
}

/**
 * Bir ürün satırını fiş detaylarından kaldırır.
 * @param {HTMLElement} buttonElement Tıklanan silme butonu.
 */
function removeItemRow(buttonElement) {
    const itemRow = buttonElement.closest('.fis-item-row');
    const itemsContainer = itemRow ? itemRow.parentElement : null;
    const fisContainer = itemsContainer ? itemsContainer.closest('.fis-row-container') : null;

    if (itemRow) {
        itemRow.remove();
        // Eğer bu son ürün satırıysa ve konteyner boşaldıysa, tüm fiş konteynerını sil
        if (itemsContainer && itemsContainer.children.length === 0 && fisContainer) {
             removeFisContainer(fisContainer.id); // Konteynerı tamamen sil
        } else {
             hesaplaTumToplamlari(); // Sadece toplamları yeniden hesapla
        }
    }
}

/**
 * Çift/Tek checkbox'ı değiştiğinde ürün miktarını günceller.
 * @param {HTMLInputElement} checkbox Değişiklik yapılan checkbox.
 */
function handleCiftTekChange(checkbox) {
    const itemRow = checkbox.closest('.fis-item-row');
    if (!itemRow) return;
    
    const miktarCell = itemRow.querySelector('.item-miktar');
    if (!miktarCell) return;

    const originalMiktar = parseFloat(miktarCell.dataset.originalMiktar || 0);
    
    // Miktarı güncelle (Çift ise x2, değilse orijinal)
    miktarCell.textContent = checkbox.checked ? (originalMiktar * 2) : originalMiktar;
    
    hesaplaTumToplamlari(); // Toplamları yeniden hesapla
}
 
/**
 * Tüm fişlerdeki ürünlere göre genel hamaliye toplamlarını hesaplar.
 */
function hesaplaTumToplamlari() {
    let toplamYemTon = 0, toplamGubreTon = 0, toplamDigerLtAd = 0;
    
    // Fiyatları al (Güncelleme modunda değilse " TL" ekini kaldır)
    const fiyatState = document.getElementById('btnToggleUpdate')?.dataset.state || 'view';
    const yemFiyati = parseFloat(String(document.getElementById('yemFiyati')?.value || '0').replace('TL','').trim()) || 0;
    const gubreFiyati = parseFloat(String(document.getElementById('gubreFiyati')?.value || '0').replace('TL','').trim()) || 0;
    const digerFiyati = parseFloat(String(document.getElementById('digerFiyati')?.value || '0').replace('TL','').trim()) || 0;

    // Tüm ürün satırlarını gez
    document.querySelectorAll('.fis-item-row').forEach(row => {
        const miktarCell = row.querySelector('.item-miktar');
        const stokTuruCell = row.querySelector('div:nth-child(6)'); // Stok Türü hücresi
        const eSutunuDegeri = parseFloat(row.dataset.eSutunu || 0); // Saklanan E sütunu değeri
        const toplamCell = row.querySelector('.item-toplam');
        
        if (!miktarCell || !stokTuruCell || !toplamCell) return; // Gerekli hücreler yoksa atla
        
        const miktar = parseFloat(miktarCell.textContent || 0);
        const stokTuru = stokTuruCell.textContent.trim();
        let satirHamaliyeMiktari = 0; // Bu satırın hamaliye tonaj/lt/adet karşılığı
        
        // Hamaliye hesaplama mantığı (Apps Script'teki ile aynı)
        if (['Motorin', 'Halk Sağlığı', 'Market'].includes(stokTuru)) {
            toplamCell.textContent = 'Hamaliye Yok'; 
            satirHamaliyeMiktari = 0;
        } else if (stokTuru === 'Kimyevi Gübre') {
            satirHamaliyeMiktari = miktar / 1000; // Kg'ı Tona çevir
            toplamGubreTon += satirHamaliyeMiktari;
            toplamCell.textContent = (satirHamaliyeMiktari * gubreFiyati).toFixed(2); // Tutar
        } else if (stokTuru === 'Toz Gübre') {
            satirHamaliyeMiktari = (miktar * eSutunuDegeri) / 1000; // Kg'ı Tona çevir
            toplamGubreTon += satirHamaliyeMiktari;
             toplamCell.textContent = (satirHamaliyeMiktari * gubreFiyati).toFixed(2); // Tutar
        } else if (['Sıvı Gübre', 'Zirai İlaç', 'Madeni Yağ', 'Sulama'].includes(stokTuru)) {
            satirHamaliyeMiktari = miktar * eSutunuDegeri; // Lt/Adet
            toplamDigerLtAd += satirHamaliyeMiktari;
            toplamCell.textContent = (satirHamaliyeMiktari * digerFiyati).toFixed(2); // Tutar
        } else if (['Yem', 'Tohum'].includes(stokTuru)) {
            satirHamaliyeMiktari = miktar / 1000; // Kg'ı Tona çevir
            toplamYemTon += satirHamaliyeMiktari;
            toplamCell.textContent = (satirHamaliyeMiktari * yemFiyati).toFixed(2); // Tutar
        } else {
             toplamCell.textContent = 'Hesaplanamadı'; // Bilinmeyen tür
        }
    });

    // Toplamları formatlayarak inputlara yaz
    const toplamYemInput = document.getElementById('toplamYem');
    const toplamGubreInput = document.getElementById('toplamGubre');
    const toplamDigerInput = document.getElementById('toplamDiger');
    const genelTonajInput = document.getElementById('genelTonaj');
    const genelTutarInput = document.getElementById('genelTutar');

    if(toplamYemInput) toplamYemInput.value = toplamYemTon.toFixed(3) + " Ton";
    if(toplamGubreInput) toplamGubreInput.value = toplamGubreTon.toFixed(3) + " Ton"; // 3 ondalık daha iyi olabilir
    if(toplamDigerInput) toplamDigerInput.value = toplamDigerLtAd.toFixed(2) + " Lt/Ad";

    // Genel Toplamları Hesapla
    const genelTutar = (toplamYemTon * yemFiyati) + (toplamGubreTon * gubreFiyati) + (toplamDigerLtAd * digerFiyati);
    // Genel Tonaj (Diğerleri Lt/Ad olduğu için tonaja direkt katılmaz, belki birim dönüşümü gerekir?)
    // Şimdilik sadece Yem ve Gübre tonajını toplayalım:
    const genelTonaj = toplamYemTon + toplamGubreTon; 

    if(genelTutarInput) genelTutarInput.value = genelTutar.toFixed(2) + " TL";
    if(genelTonajInput) genelTonajInput.value = genelTonaj.toFixed(3) + " Ton";
}


/**
 * Hesaplanan hamaliye verilerini kaydeder ve PDF oluşturur.
 */
function kaydetHesaplama() {
    if (!confirm("Tüm hesaplamayı sayfaya kaydetmek ve yazdırmak istediğinizden emin misiniz? Varsa önceki kayıtlar silinecektir.")) return;

    const hesaplamaData = {
        baslik: document.getElementById('pageTitle')?.textContent || 'Hamaliye Hesaplama',
        genelToplamlar: {
            yem_ton: parseFloat(document.getElementById('toplamYem')?.value) || 0,
            gubre_ton: parseFloat(document.getElementById('toplamGubre')?.value) || 0,
            diger_ltad: parseFloat(document.getElementById('toplamDiger')?.value) || 0,
            tutar_tl: parseFloat(document.getElementById('genelTutar')?.value) || 0
        },
        fisDetaylari: [] // Kaydedilecek detaylı liste
    };

    // Tüm ürün satırlarını gezerek detayları topla
    document.querySelectorAll('.fis-item-row').forEach(row => {
        const container = row.closest('.fis-row-container');
        const fisSelect = container ? container.querySelector('.fis-select') : null;
        const fisNo = fisSelect ? fisSelect.value : '';
        if (!fisNo) return; // Fiş numarası yoksa atla

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
            stokTuru: row.cells[5]?.textContent || '',
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
    // API tarafında:
    // 1. Veriyi 'HamaliyeKayit' sayfasına yaz.
    // 2. Bu veriden bir PDF oluştur ve URL'sini döndür.
    
    // --- Örnek API Yanıt Simülasyonu ---
    setTimeout(() => { 
        hideLoadingOverlay();
        const success = Math.random() > 0.1; 
        const pdfUrl = success ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" : null;
        const message = success ? `Hesaplama başarıyla kaydedildi.` : `Hata: Hesaplama kaydedilemedi!`;
        
        alert(message);
        
        if (success && pdfUrl) {
            // PDF'i yeni sekmede aç
            window.open(pdfUrl, '_blank');
            // Sayfayı yenile (isteğe bağlı, belki temizlemek yeterli?)
            // location.reload(); 
            // Veya sadece fiş listesini temizle
            document.getElementById('fisRowsContainer').innerHTML = '';
            hesaplaTumToplamlari(); // Toplamları sıfırla
        }
    }, 2500); // 2.5 saniye bekle
    // --- --- ---
}

// Loading overlay fonksiyonları (Eğer yoksa ekleyin)
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


// Bu sayfa yüklendiğinde başlangıç verilerini çekmek için
document.addEventListener("DOMContentLoaded", () => {
  // Sadece 'hamaliye.html' sayfasındaysak
  if (document.querySelector(".hamaliye-container")) {
    initHamaliyeSayfasi();
  }
});

/**
 * Hamaliye Hesaplama sayfasını başlatır.
 */
function initHamaliyeSayfasi() {
    // Sayfa başlığını ayarla
    const pageTitle = document.getElementById('pageTitle');
    if(pageTitle) pageTitle.textContent = `${new Date().toLocaleDateString('tr-TR')} - TARİHLİ HAMALİYE ÖDEMESİ`;

    // Hamaliye fiyatlarını yükle
    console.log("Hamaliye fiyatları yükleniyor...");
    // TODO: API Çağrısı: getHamaliyeInitialData(); -> { success: true, data: { yem: 50, gubre: 60, diger: 0.5 } }
    // --- Simülasyon ---
    setTimeout(() => {
        const data = { yem: 50.00, gubre: 60.00, diger: 0.50 }; // Örnek fiyatlar
        const yemInput = document.getElementById('yemFiyati');
        const gubreInput = document.getElementById('gubreFiyati');
        const digerInput = document.getElementById('digerFiyati');
        if (yemInput) yemInput.value = (data.yem || 0).toFixed(2) + " TL";
        if (gubreInput) gubreInput.value = (data.gubre || 0).toFixed(2) + " TL";
        if (digerInput) digerInput.value = (data.diger || 0).toFixed(2) + " TL";
        hesaplaTumToplamlari(); // Başlangıç toplamlarını hesapla (0 olmalı)
    }, 300);
    // --- --- ---
    
    // Fiş numaraları listesini yükle
    console.log("Fiş numaraları yükleniyor (Hamaliye)...");
    // TODO: API Çağrısı: getFisNumaralariForHamaliye(); -> { success: true, data: [ {no: 'CF-001', tarih: '27.10'}, ... ] }
     // --- Simülasyon ---
    setTimeout(() => {
         fisNumaralari = [ {no: 'CF-001', tarih: '27.10'}, {no: 'CF-002', tarih: '26.10'}, {no: 'VF-001', tarih: '27.10'} ]; // Global değişkene ata
         const btnAddFis = document.getElementById('btnAddFis');
         if(btnAddFis) {
             btnAddFis.innerHTML = '<i class="fas fa-plus-circle"></i> HESAPLAMAYA FİŞ EKLE';
             btnAddFis.disabled = false;
         }
    }, 700);
     // --- --- ---
}

/* ======================================== */
/* GOOGLE API KİMLİK DOĞRULAMA VE ÇAĞRI FONKSİYONLARI */
/* ======================================== */

/**
 * GAPI istemci kütüphanesi yüklendiğinde HTML'deki onload tarafından çağrılır.
 */
function handleGapiLoad() {
    gapi.load('client', initializeGapiClient); // GAPI client'ı yükle ve başlat
}

/**
 * GIS (Google Identity Services) kütüphanesi yüklendiğinde HTML'deki onload tarafından çağrılır.
 */
function handleGisLoad() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID, // Dosyanın başındaki CLIENT_ID değişkenini kullanır
        scope: SCOPES,       // Dosyanın başındaki SCOPES değişkenini kullanır
        callback: '',       // Geri arama handleAuthClick içinde dinamik olarak ayarlanacak
    });
    gisInited = true;
    checkApiInitComplete(); // API'lerin hazır olup olmadığını kontrol et
}

/**
 * GAPI istemcisini başlatır (handleGapiLoad tarafından çağrılır).
 */
async function initializeGapiClient() {
    try {
        await gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS, // Dosyanın başındaki DISCOVERY_DOCS'u kullanır
        });
        gapiInited = true;
        checkApiInitComplete(); // API'lerin hazır olup olmadığını kontrol et
        console.log("GAPI Client Başlatıldı.");
    } catch (err) {
        console.error("GAPI Client Başlatma Hatası:", err);
        alert("Google API bağlantısında hata oluştu. Sayfayı yenileyin veya daha sonra tekrar deneyin.");
    }
}

/**
 * Hem GAPI hem de GIS yüklendiğinde butonları gösterir/gizler.
 */
function checkApiInitComplete() {
    // Sadece iki kütüphane de hazırsa devam et
    if (gapiInited && gisInited) {
        console.log("API Kütüphaneleri Hazır.");
        const authButton = document.getElementById(authButtonId); // authButtonId global değişkenden gelir
        const signoutButton = document.getElementById(signoutButtonId); // signoutButtonId global değişkenden gelir

        // Başlangıçta Giriş Yap butonunu göster, Çıkış Yap butonunu gizle
        if (authButton) {
            authButton.style.visibility = 'visible';
            authButton.style.display = 'block';
        }
         if(signoutButton) {
            signoutButton.style.display = 'none';
         }
         // Başlangıçta API'ye bağlı butonları pasifleştir
         enableApiButtons(false);
    }
}

/**
 * Kullanıcı "Giriş Yap" butonuna tıkladığında API erişimi için izin ister.
 */
function handleAuthClick() {
  if (!gisInited || !tokenClient) {
      alert("Google kimlik doğrulama kütüphanesi henüz yüklenmedi. Lütfen biraz bekleyip tekrar deneyin.");
      return;
  }
  // Token alındığında veya hata oluştuğunda çalışacak fonksiyonu ayarla
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      console.error("Yetkilendirme Hatası:", resp);
      alert("Google Hesabınızla oturum açma veya izin verme sırasında bir hata oluştu: " + resp.error);
      updateSigninStatus(false);
      throw (resp);
    }

    // Başarılı token alındı, GAPI'ye set et
    gapi.client.setToken(resp);
    console.log("Giriş Yapıldı ve Token Alındı.");

    // Giriş yapıldıktan sonra arayüzü güncelle
    updateSigninStatus(true);

    // GİRİŞ YAPILDIKTAN SONRA YAPILACAK İLK İŞLEM: Sayfaya özel veriyi yükle
    const currentPageLoader = getCurrentPageLoadFunction();
    if(currentPageLoader) {
        console.log("Sayfaya özel veri yükleme fonksiyonu çalıştırılıyor:", currentPageLoader.name);
        try {
            // Veri yükleme fonksiyonlarını `async` yapmadığımız için `await` kullanamayız.
            // Sadece çağıralım. Fonksiyonlar kendi içinde loading state yönetmeli.
            currentPageLoader();
        } catch(loadError) {
            console.error("Veri yükleme fonksiyonunda hata:", loadError);
            alert("Veriler yüklenirken bir hata oluştu.");
        }
    } else {
        console.warn("Giriş sonrası çalıştırılacak özel bir fonksiyon bulunamadı.");
    }
  };

   tokenClient.requestAccessToken({prompt: 'consent'}); // İzin ekranını göster
}

/**
 * Kullanıcı "Çıkış Yap" butonuna tıkladığında oturumu kapatır.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token, () => {
      gapi.client.setToken(null); // GAPI'deki token'ı temizle (null olarak ayarla)
      console.log("Oturum Kapatıldı.");
      updateSigninStatus(false); // Arayüzü güncelle
      clearPageData(); // Sayfa içeriğini temizle
    });
  } else {
      console.log("Zaten oturum kapalı.");
      updateSigninStatus(false);
  }
}

/**
 * Giriş/Çıkış durumuna göre butonların görünürlüğünü ayarlar.
 */
function updateSigninStatus(isSignedIn) {
    const authButton = document.getElementById(authButtonId);
    const signoutButton = document.getElementById(signoutButtonId);

    if (isSignedIn) {
        if(authButton) authButton.style.display = 'none';
        if(signoutButton) signoutButton.style.display = 'block';
        enableApiButtons(true);
    } else {
        if(authButton) authButton.style.display = 'block';
        if(signoutButton) signoutButton.style.display = 'none';
        enableApiButtons(false);
    }
}

/**
 * API çağrısı yapan butonları etkinleştirir veya pasifleştirir.
 */
function enableApiButtons(enable) {
    // Kaydet, Başlat, Ekle vb. butonları bul
    const actionButtons = document.querySelectorAll(
        '.btn-save, button[type="submit"], .btn-start, .btn-add-fis, .btn-add-stock, .save-button, .btn-toplam-kaydet, .btn-guncelle, .btn-kaydet, .filter-button, #btnToggleUpdate'
        );
    actionButtons.forEach(btn => {
        // 'Kaydet & Yazdır' butonu hamaliye sayfasında hep aktif kalabilir (yazdırma için)
        // veya sadece yazdır butonu ayrı yapılır. Şimdilik hepsini kontrol edelim.
        if (!btn.classList.contains('print-button') && !btn.classList.contains('back-button')) { // Yazdır ve Geri butonları hariç
             btn.disabled = !enable;
        }
    });

    // Düzenlenebilir input/select'leri bul
    const editableElements = document.querySelectorAll(
        '.editable-input, .stock-update-container .form-select, .price-list-container .price-input, .hamaliye-container .price-input, .cikan-miktar-input'
    );
    editableElements.forEach(el => el.disabled = !enable);

    // Filtreleme select'leri (giriş yapınca aktif olsun)
    const filterSelects = document.querySelectorAll('.filter-select, #stokTuruFiltre');
    filterSelects.forEach(sel => sel.disabled = !enable);

    console.log(`API butonları ${enable ? 'etkinleştirildi' : 'pasifleştirildi'}.`);
}

/**
 * Çıkış yapıldığında sayfa içeriğini temizler.
 */
function clearPageData() {
    const tableBodies = document.querySelectorAll('#dataTableBody, #stokTableBody, #veresiyeTableBody');
    const rowsContainers = document.querySelectorAll('#priceListRowsContainer, #stockRowsContainer, #fisRowsContainer, #modalUrunlerContainer, #goruntuleContainer, #islemContainer'); // Talep tablosu için container'ları da ekle

    const loginMessage = `<tr><td colspan="15" class="loading-text initial-message">Verileri görmek için lütfen Google hesabınızla giriş yapın.</td></tr>`;
    const loginMessageDiv = `<div class="loading-text initial-message">Verileri görmek için lütfen Google hesabınızla giriş yapın.</div>`;

    tableBodies.forEach(tbody => { if(tbody) tbody.innerHTML = loginMessage; });
    rowsContainers.forEach(div => { if(div) div.innerHTML = loginMessageDiv; });

    // Özel temizlemeler
    const fisDetayAlani = document.getElementById('fisDetaylari');
    if (fisDetayAlani) fisDetayAlani.value = '';
    // Diğer formları da sıfırlayabiliriz
}

/**
 * Mevcut sayfaya göre çalıştırılacak ana veri yükleme fonksiyonunu döndürür.
 */
function getCurrentPageLoadFunction() {
    if (document.querySelector('.menu-column')) return null; // Ana sayfa özel yükleme gerektirmez
    else if (document.getElementById("paraSayiContainer")) return initPesinPage; // pesin.html (API'den fiyat vs. alacaksa burası değişir)
    else if (document.getElementById('fisNo') && document.getElementById('customerTypeBtn')) return initCikisFisi; // cikis.html
    else if (document.querySelector(".reprint-container")) return loadFisNumaralari; // tekrar.html
    else if (document.querySelector(".cancel-container")) return loadFisNumaralari; // iptal.html
    else if (document.querySelector(".price-list-container")) return loadPriceListData; // fiyat.html
    else if (document.getElementById("veresiyeTableBody")) return loadVeresiyeData; // veresiye.html
    else if (document.querySelector(".list-table-container")) return fetchAllData; // liste.html
    else if (document.querySelector(".entry-container")) return initGirisSayfasi; // giris.html
    else if (document.getElementById("musteriSelect") && document.getElementById("detaylarTablosu")) return loadMusteriListesiCikis; // cikis-kayit.html
    else if (document.querySelector(".records-table-container")) return () => { loadKayitlarData(currentFilter); loadMusteriFiltreListesi(); }; // kayitlar.html
    else if (document.querySelector(".stock-view-container")) return loadStokListData; // stok-gor.html
    else if (document.querySelector(".stock-update-container")) return loadStokYonetimData; // stok-guncelle.html
    else if (document.getElementById("stokEkleForm")) return initStokEkleSayfasi; // stok-ekle.html
    else if (document.querySelector(".partner-list-container") && document.getElementById("yeniKayitModal")) return loadOrtakListesi; // ortak.html
    else if (document.querySelector(".partner-ext-list-container")) return loadOrtakDisiListesi; // ortak-disi.html
    else if (document.getElementById("resultsTable")) return loadStokTurleriFiltre; // sayim.html
    else if (document.getElementById("goruntuleTab") && document.getElementById("islemTab")) return fetchTalepler; // talep.html
    else if (document.querySelector(".hamaliye-container")) return initHamaliyeSayfasi; // hamaliye.html
    return null;
}

// ========================================
// API Çağrı Fonksiyonları (GENEL ÖRNEKLER)
// ========================================
/**
 * Belirli bir aralıktaki verileri okur.
 */
async function readSheetData(range) {
    if (!gapi.client?.sheets) { throw new Error("Google Sheets API istemcisi yüklenmedi."); }
    try {
        console.log(`Okunuyor: ${range}`);
        showLoadingOverlay("Veriler Okunuyor..."); // Yükleme göstergesi
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID, range: range,
        });
        hideLoadingOverlay(); // Yüklemeyi gizle
        console.log("Okunan Veri:", response.result.values);
        return response.result.values || [];
    } catch (err) {
        hideLoadingOverlay();
        console.error("Okuma Hatası:", err);
        alert(`Veri okunurken hata: ${err.result?.error?.message || err.message}`);
        throw err;
    }
}
/**
 * Bir sayfanın sonuna yeni satırlar ekler.
 */
async function appendSheetData(range, values) {
     if (!gapi.client?.sheets) { throw new Error("Google Sheets API istemcisi yüklenmedi."); }
    try {
        console.log(`Ekleniyor: ${range}, Veri:`, values);
        showLoadingOverlay("Veriler Ekleniyor...");
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID, range: range, valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS', resource: { values: values }
        });
        hideLoadingOverlay();
        console.log("Ekleme Yanıtı:", response.result);
        return response.result;
    } catch (err) {
        hideLoadingOverlay();
        console.error("Ekleme Hatası:", err);
        alert(`Veri eklenirken hata: ${err.result?.error?.message || err.message}`);
        throw err;
    }
}
/**
 * Belirli bir aralıktaki hücreleri günceller.
 */
async function updateSheetData(range, values) {
    if (!gapi.client?.sheets) { throw new Error("Google Sheets API istemcisi yüklenmedi."); }
    try {
        console.log(`Güncelleniyor: ${range}, Veri:`, values);
        showLoadingOverlay("Veriler Güncelleniyor...");
        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID, range: range, valueInputOption: 'USER_ENTERED',
            resource: { values: values }
        });
        hideLoadingOverlay();
        console.log("Güncelleme Yanıtı:", response.result);
        return response.result;
    } catch (err) {
        hideLoadingOverlay();
        console.error("Güncelleme Hatası:", err);
        alert(`Veri güncellenirken hata: ${err.result?.error?.message || err.message}`);
        throw err;
    }
}

// ========================================
// DOMContentLoaded - SAYFA YÜKLENİNCE ÇALIŞAN KONTROLLER (SON HALİ - DÜZELTİLDİ)
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    // API istemcileri HTML'deki onload ile yüklenecek (handleGapiLoad, handleGisLoad)

    // Giriş/Çıkış butonlarını HTML'e ekle (header'a)
    const header = document.querySelector('.header');
    if (header) {
        let authDiv = header.querySelector('.auth-buttons');
        if (!authDiv) {
            authDiv = document.createElement('div');
            authDiv.className = 'auth-buttons';
            // Butonları başlığın sağına ekle (sağdaki boş div yerine)
             const rightPlaceholder = header.querySelector('div[style*="width"]');
             if(rightPlaceholder) {
                 header.replaceChild(authDiv, rightPlaceholder);
             } else {
                 header.appendChild(authDiv); // Bulamazsa sona ekle
             }
        }
        
        // Buton HTML'ini oluştur
        authDiv.innerHTML = `
            <button id="${authButtonId}" onclick="handleAuthClick()" style="visibility:hidden;" class="header-button"><i class="fab fa-google"></i> Google ile Giriş Yap</button>
            <button id="${signoutButtonId}" onclick="handleSignoutClick()" style="display:none;" class="header-button"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</button>
        `;
        
        // ================================================================
        // ==== DEĞİŞİKLİK BURADA: ====
        // Butonları HTML'e ekledikten hemen sonra API'nin hazır olup 
        // olmadığını tekrar kontrol et. Eğer hazırsa, butonları görünür yap.
        checkApiInitComplete();
        // ================================================================

        // Not: `visibility:hidden` butonu başlangıçta gizler...
    }
    
    // Sayfaya özel başlangıç fonksiyonunu bul
    const initialLoadFunction = getCurrentPageLoadFunction();
    if(initialLoadFunction) {
        console.log("Sayfa başlangıç fonksiyonu bulundu (DOM Ready):", initialLoadFunction.name);
        
        // Hangi sayfada olduğumuzu belirleyip API gerektirmeyen ilk ayarları yapalım:
        if (document.getElementById("stokEkleForm")) { 
            initStokEkleSayfasi(); 
        }
        else if (document.querySelector(".hamaliye-container")) { 
            initHamaliyeSayfasi(); 
        }
        // Diğer tüm API gerektiren yüklemeler (loadOrtakListesi, fetchTalepler vb.)
        // artık 'handleAuthClick' fonksiyonu içinde, kullanıcı giriş yaptıktan 
        // sonra otomatik olarak çağrılacak.
    }
});
