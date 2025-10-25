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

function navigate(page) {
  window.location.href = page;
}

function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString('tr-TR', options);
}

function toggleMenu(button) {
  const ul = button.nextElementSibling;
  const isVisible = ul.style.display === 'block';
  ul.style.display = isVisible ? 'none' : 'block';
}
function goBack() {
  window.location.href = 'index.html';
}

function printKasa() {
  console.log("Yazdırılıyor...");
}

function saveKasa() {
  console.log("Kasa kaydedildi.");
}

function closeKasa() {
  console.log("Kasa paneli kapatıldı.");
}
