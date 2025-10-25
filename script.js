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

const banknotes = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25];
const moneyContainer = document.getElementById("moneyRowsContainer");
const adjustmentContainer = document.getElementById("adjustmentRowsContainer");
const stokContainer = document.getElementById("stokRowsContainer");

banknotes.forEach(value => {
  const row = document.createElement("div");
  row.className = "money-grid";
  row.innerHTML = `
    <div><input class="form-control" value="${value}" readonly /></div>
    <div><input class="form-control" type="number" oninput="calculateMoney()" /></div>
    <div><input class="form-control" readonly /></div>
  `;
  moneyContainer.appendChild(row);
});

for (let i = 0; i < 10; i++) {
  const row = document.createElement("div");
  row.className = "adjustment-grid";
  row.innerHTML = `
    <div><input class="form-control" /></div>
    <div><input class="form-control" type="number" oninput="calculateAdjustments()" /></div>
  `;
  adjustmentContainer.appendChild(row);
}

function calculateMoney() {
  let total = 0;
  [...moneyContainer.children].forEach(row => {
    const adet = row.children[1].children[0].value;
    const banknot = row.children[0].children[0].value;
    const toplam = row.children[2].children[0];
    const result = adet * banknot;
    toplam.value = result.toFixed(2);
    total += result;
  });
  document.getElementById("moneyTotal").value = total.toFixed(2);
  document.getElementById("kasaToplam").value = total.toFixed(2);
}

function updateKasaDurumu() {
  const toplam = parseFloat(document.getElementById("kasaToplam").value) || 0;
  const bakiye = parseFloat(document.getElementById("kasaBakiyesi").value) || 0;
  const durum = bakiye - toplam;
  document.getElementById("kasaDurum").value = durum.toFixed(2);
  const aciklama = document.getElementById("kasaAciklama");
  if (durum === 0) aciklama.value = "Kasa hesabı tam";
  else if (durum < 0) aciklama.value = `${Math.abs(durum).toFixed(2)} TL kasa hesabı eksik`;
  else aciklama.value = `${durum.toFixed(2)} TL kasa hesabı fazla`;
}

function calculateAdjustments() {
  let total = 0;
  [...adjustmentContainer.children].forEach(row => {
    const tutar = parseFloat(row.children[1].children[0].
