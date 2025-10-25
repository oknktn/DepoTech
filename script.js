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
