// Sayfa yüklenince yükleme ekranını kaldır ve ana ekranı göster
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loadingScreen').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('loadingScreen').style.display = 'none';
      document.getElementById('mainScreen').style.display = 'block';
      updateDate();
    }, 500);
  }, 1500);
});

// Sayfa yönlendirme fonksiyonu
function navigate(page) {
  window.location.href = page;
}

// Tarihi otomatik olarak güncelle
function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString('tr-TR', options);
}
