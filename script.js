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
document.addEventListener("DOMContentLoaded", () => {
  const banknotlar = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25];
  const paraContainer = document.getElementById("paraSayimiRows");
  const duzeltmeContainer = document.getElementById("duzeltmeRows");
  const stokContainer = document.getElementById("stokRows");

  // Para Sayımı Satırları
  banknotlar.forEach(deger => {
    const row = document.createElement("div");
    row.className = "grid-header";
    row.innerHTML = `
      <input class="form-control" value="${deger}" readonly />
      <input class="form-control" type="number" oninput="hesaplaParaSayimi()" />
      <input class="form-control" readonly />
    `;
    paraContainer.appendChild(row);
  });

  // Düzeltme Satırları
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.className = "grid-header";
    row.innerHTML = `
      <input class="form-control" placeholder="Açıklama" />
      <input class="form-control" type="number" oninput="hesaplaDuzeltme()" />
    `;
    duzeltmeContainer.appendChild(row);
  }
});

// Para Sayımı Hesaplama
function hesaplaParaSayimi() {
  let toplam = 0;
  const rows = document.querySelectorAll("#paraSayimiRows .grid-header");
  rows.forEach(row => {
    const banknot = parseFloat(row.children[0].value);
    const adet = parseFloat(row.children[1].value) || 0;
    const satirToplam = banknot * adet;
    row.children[2].value = satirToplam.toFixed(2);
    toplam += satirToplam;
  });
  document.getElementById("paraGenelToplam").value = toplam.toFixed(2);
  document.getElementById("kasaToplam").value = toplam.toFixed(2);
}

// Kasa Durumu Hesaplama
function hesaplaKasaDurumu() {
  const toplam = parseFloat(document.getElementById("kasaToplam").value) || 0;
  const bakiye = parseFloat(document.getElementById("kasaBakiyesi").value) || 0;
  const fark = bakiye - toplam;
  document.getElementById("kasaDurum").value = fark.toFixed(2);

  const aciklama = document.getElementById("kasaAciklama");
  aciklama.innerHTML = "";
  const option = document.createElement("option");
  if (fark === 0) option.text = "Kasa hesabı tam";
  else if (fark < 0) option.text = `${Math.abs(fark).toFixed(2)} TL kasa hesabı eksik`;
  else option.text = `${fark.toFixed(2)} TL kasa hesabı fazla`;
  aciklama.appendChild(option);
}

// Düzeltme Toplamı Hesaplama
function hesaplaDuzeltme() {
  let toplam = 0;
  const rows = document.querySelectorAll("#duzeltmeRows .grid-header");
  rows.forEach(row => {
    const tutar = parseFloat(row.children[1].value) || 0;
    toplam += tutar;
  });
  document.getElementById("duzeltmeToplam").value = toplam.toFixed(2);
}

// Stok Satırı Ekleme
function addStokRow() {
  const row = document.createElement("div");
  row.className = "stok-row";
  row.innerHTML = `
    <select class="form-control">
      <option value="">Seç</option>
      <option value="STK001">STK001</option>
      <option value="STK002">STK002</option>
    </select>
    <select class="form-control">
      <option value="">Seç</option>
      <option value="Buğday">Buğday</option>
      <option value="Arpa">Arpa</option>
    </select>
    <input class="form-control" type="number" oninput="hesaplaStok()" />
    <input class="form-control" type="number" oninput="hesaplaStok()" />
    <input class="form-control" readonly />
  `;
  document.getElementById("stokRows").appendChild(row);
}

// Stok Hesaplama
function hesaplaStok() {
  let toplam = 0;
  const rows = document.querySelectorAll("#stokRows .stok-row");
  rows.forEach(row => {
    const miktar = parseFloat(row.children[2].value) || 0;
    const fiyat = parseFloat(row.children[3].value) || 0;
    const satirToplam = miktar * fiyat;
    row.children[4].value = satirToplam.toFixed(2);
    toplam += satirToplam;
  });
  document.getElementById("kasaNakit").value = toplam.toFixed(2);
  document.getElementById("nakitSatisToplam").value = toplam.toFixed(2);
}

// Butonlar
function yazdirKasa() {
  alert("Yazdırılıyor...");
}

function kaydetKasa() {
  alert("Kasa bilgileri kaydedildi.");
}

function goBack() {
  alert("Ana menüye dönülüyor...");
}
                             
