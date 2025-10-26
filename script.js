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
