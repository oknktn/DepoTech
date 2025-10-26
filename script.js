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
