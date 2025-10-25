// script.js

/**
 * Sayfa yüklendiğinde çalışır.
 * Yükleme ekranını gizler ve ana ekranı gösterir.
 */
window.addEventListener('load', () => {
  // 1.5 saniye sonra yükleme ekranını soluklaştır
  setTimeout(() => {
    document.getElementById('loadingScreen').style.opacity = '0';

    // Soluklaşma animasyonu bittikten (500ms) sonra
    setTimeout(() => {
      document.getElementById('loadingScreen').style.display = 'none';
      document.getElementById('mainScreen').style.display = 'block';
      
      // Ana ekran göründüğünde verileri yükle
      updateDate();
      loadInfoPanelData();
    }, 500);
  }, 1500);
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
