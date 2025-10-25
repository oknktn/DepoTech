function doGet(e) {

var page = e.parameter.page;

var htmlFile;

if (page === 'cikisformu') {

htmlFile = 'ÇıkışFormu';

} else if (page === 'fistekrari') {

htmlFile = 'FisTekrari';

} else if (page === 'fisiptali') {

htmlFile = 'FisIptali';

} else if (page === 'stokgoruntule') {

htmlFile = 'StokGoruntule';

} else if (page === 'stokguncelle') {

htmlFile = 'StokGuncelle';         

} else if (page === 'stokekle') { 

htmlFile = 'StokEkle';         

} else if (page === 'veresiyeyonetim') { 

htmlFile = 'VeresiyeYonetim';         

} else if (page === 'listegoruntule') { 

htmlFile = 'ListeGoruntule';          

} else if (page === 'ortaklistesi') { 

htmlFile = 'OrtakListesi';         

} else if (page === 'ortakdisilistesi') { 

htmlFile = 'OrtakDisiListesi';

} else if (page === 'depogiris') {

htmlFile = 'DepoGiris';

} else if (page === 'depocikis') {

htmlFile = 'DepoCikis';

} else if (page === 'depokayitlarigoruntule') {

htmlFile = 'DepoKayitlariniGoruntule';

} else if (page === 'hamaliyehesaplama') {

htmlFile = 'HamaliyeHesaplama';

} else if (page === 'taleptakibi') {

htmlFile = 'TalepTakibi';

} else if (page === 'stoksayim') {

htmlFile = 'StokSayim';

} else if (page === 'pesinsatis') {

htmlFile = 'PesinSatis';         

} else {

htmlFile = 'DepoTech';

}

// ... fonksiyonun geri kalanı aynı ...

try {

var output = HtmlService.createHtmlOutputFromFile(htmlFile)

  .setTitle('DepoTech')

  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

return output;

} catch (error) {

console.error('Hata:', error);

return HtmlService.createHtmlOutput('<h1>Hata</h1><p>' + error.toString() + '</p>');

}

}

function include(filename) {

return HtmlService.createHtmlOutputFromFile(filename).getContent();

}

function getCikisFormuUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=cikisformu';

}

/// Lütfen getAnaMenuUrl fonksiyonunun bu basit halde olduğundan emin olun.

function getAnaMenuUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl;

}

function getFisNo() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkış Listesi');

var currentFisNo = sheet.getRange('B1').getValue();



// Eğer fiş no yoksa veya 0'sa, 1'den başlat

if (!currentFisNo || currentFisNo === 0) {

  currentFisNo = 1;

  sheet.getRange('B1').setValue(currentFisNo);

}



return JSON.stringify({

  success: true,

  fisNo: currentFisNo

});

} catch (error) {

return JSON.stringify({

  success: false,

  error: error.toString()

});

}

}

function getUserEmail() {

try {

var email = Session.getActiveUser().getEmail();



return JSON.stringify({

  success: true,

  email: email

});

} catch (error) {

return JSON.stringify({

  success: false,

  error: error.toString()

});

}

}

function getOrtakListesi() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Ortak Listesi');

var lastRow = sheet.getLastRow();



if (lastRow < 2) {

  return JSON.stringify({

    success: true,

    data: []

  });

}



var data = sheet.getRange('A2:D' + lastRow).getValues();



var ortakListesi = data.filter(function(row) {

  return row[0] !== '';

}).map(function(row) {

  return {

    numara: row[0] || '',

    adsoyad: row[2] || '',

    telefon: row[3] || ''

  };

});



return JSON.stringify({

  success: true,

  data: ortakListesi

});

} catch (error) {

return JSON.stringify({

  success: false,

  error: error.toString()

});

}

}

function getStokListesi() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Stok Listesi');

var lastRow = sheet.getLastRow();



if (lastRow < 2) {

  return JSON.stringify({

    success: true,

    data: []

  });

}



var data = sheet.getRange('A2:C' + lastRow).getValues();



var stokListesi = data.filter(function(row) {

  return row[0] !== '';

}).map(function(row) {

  return {

    kod: row[0] || '',

    ad: row[1] || '',

    birim: row[2] || ''

  };

});



return JSON.stringify({

  success: true,

  data: stokListesi

});

} catch (error) {

return JSON.stringify({

  success: false,

  error: error.toString()

});

}

}

// Ortak Dışı Listesini Getir

function getOrtakDisiListesi() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Ortak Dışı Listesi');

var lastRow = sheet.getLastRow();



if (lastRow < 2) {

  return JSON.stringify({

    success: true,

    data: []

  });

}



var data = sheet.getRange('A2:B' + lastRow).getValues();



var ortakDisiListesi = data.filter(function(row) {

  return row[0] !== '';

}).map(function(row) {

  return {

    adsoyad: row[0] || '',

    telefon: row[1] || ''

  };

});



return JSON.stringify({

  success: true,

  data: ortakDisiListesi

});

} catch (error) {

return JSON.stringify({

  success: false,

  error: error.toString()

});

}

}

function doPost(e) {

try {

var data = JSON.parse(e.postData.contents);



if (data.action === 'saveForm') {

  return saveForm(data.data);

}



return ContentService.createTextOutput(JSON.stringify({

  success: false,

  error: 'Invalid action'

})).setMimeType(ContentService.MimeType.JSON);

} catch (error) {

return ContentService.createTextOutput(JSON.stringify({

  success: false,

  error: error.toString()

})).setMimeType(ContentService.MimeType.JSON);

}

}

function saveForm(formData) {

try {

var ss = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ');

var sheet = ss.getSheetByName('Çıkış Listesi');



// Yeni satır için verileri hazırla

var rowData = [

  formData.tarih || '',

  formData.fisNo || '',

  formData.kullanici || '',

  formData.satisTuru || '',

  formData.musteriTipi || '',

  formData.musteriBilgileri.ortakNo || formData.musteriBilgileri.ortakDisiAdSoyad || '',

  formData.musteriBilgileri.ortakAdSoyad || formData.musteriBilgileri.ortakDisiTelefon || '',

  JSON.stringify(formData.stoklar || [])

];



// Veriyi sheets'e ekle

sheet.appendRow(rowData);



// Fiş numarasını güncelle

var currentFisNo = parseInt(sheet.getRange('B1').getValue()) || 0;

sheet.getRange('B1').setValue(currentFisNo + 1);



return ContentService.createTextOutput(JSON.stringify({

  success: true,

  message: 'Form saved successfully'

})).setMimeType(ContentService.MimeType.JSON);

} catch (error) {

return ContentService.createTextOutput(JSON.stringify({

  success: false,

  error: error.toString()

})).setMimeType(ContentService.MimeType.JSON);

}

}

function saveToFisSayfasi(data) {

try {

console.log('Fiş sayfasına kayıt başlatılıyor:', data);



const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fiş');

if (!sheet) {

  throw new Error('Fiş sayfası bulunamadı');

}



// TEMEL BİLGİLER

// Tarih - H3:I3 birleştirilmiş

if (sheet.getRange('H3:I3').isPartOfMerge()) {

  sheet.getRange('H3:I3').breakApart();

}

sheet.getRange('H3:I3').merge().setValue(data.tarih);



// Fiş No - H4:I4 birleştirilmiş

if (sheet.getRange('H4:I4').isPartOfMerge()) {

  sheet.getRange('H4:I4').breakApart();

}

sheet.getRange('H4:I4').merge().setValue(data.fisNo);



// Satış Türü - H5:I5 birleştirilmiş

if (sheet.getRange('H5:I5').isPartOfMerge()) {

  sheet.getRange('H5:I5').breakApart();

}

sheet.getRange('H5:I5').merge().setValue(data.satisTuru);



// MÜŞTERİ BİLGİLERİ

if (data.customerType === 'ortak-ici') {

  // Ortak İçi

  // Ortak No - D3:G3 birleştirilmiş

  if (sheet.getRange('D3:G3').isPartOfMerge()) {

    sheet.getRange('D3:G3').breakApart();

  }

  sheet.getRange('D3:G3').merge().setValue(data.ortakBilgileri.ortakNo);

  

  // Ortak Ad Soyad - D4:G4 birleştirilmiş

  if (sheet.getRange('D4:G4').isPartOfMerge()) {

    sheet.getRange('D4:G4').breakApart();

  }

  sheet.getRange('D4:G4').merge().setValue(data.ortakBilgileri.ortakAdSoyad);

  

  // Ortak Telefon - D5:G5 birleştirilmiş

  if (sheet.getRange('D5:G5').isPartOfMerge()) {

    sheet.getRange('D5:G5').breakApart();

  }

  sheet.getRange('D5:G5').merge().setValue(data.ortakBilgileri.ortakTelefon);

} else {

  // Ortak Dışı

  // "Ortak Dışı" - D3:G3 birleştirilmiş

  if (sheet.getRange('D3:G3').isPartOfMerge()) {

    sheet.getRange('D3:G3').breakApart();

  }

  sheet.getRange('D3:G3').merge().setValue('Ortak Dışı');

  

  // Ad Soyad - D4:G4 birleştirilmiş

  if (sheet.getRange('D4:G4').isPartOfMerge()) {

    sheet.getRange('D4:G4').breakApart();

  }

  sheet.getRange('D4:G4').merge().setValue(data.ortakBilgileri.ortakDisiAdSoyad);

  

  // Telefon - D5:G5 birleştirilmiş

  if (sheet.getRange('D5:G5').isPartOfMerge()) {

    sheet.getRange('D5:G5').breakApart();

  }

  sheet.getRange('D5:G5').merge().setValue(data.ortakBilgileri.ortakDisiTelefon);

}



// AÇIKLAMA

if (data.aciklama) {

  // C6:I7 birleştirilmiş

  if (sheet.getRange('C6:I7').isPartOfMerge()) {

    sheet.getRange('C6:I7').breakApart();

  }

  sheet.getRange('C6:I7').merge().setValue(data.aciklama);

}



// STOK BİLGİLERİ

// B10'dan başlayarak stokları yaz

let startRow = 10;



data.stoklar.forEach((stok, index) => {

  const currentRow = startRow + index;

  

  // Stok Adı - B:G birleştirilmiş (B10:G10, B11:G11, vb.)

  const stokAdRange = `B${currentRow}:G${currentRow}`;

  if (sheet.getRange(stokAdRange).isPartOfMerge()) {

    sheet.getRange(stokAdRange).breakApart();

  }

  sheet.getRange(stokAdRange).merge().setValue(stok.stokAdi);

  

  // Miktar - H sütunu (H10, H11, vb.)

  sheet.getRange(`H${currentRow}`).setValue(stok.miktar);

  

  // Birim - I sütunu (I10, I11, vb.)

  sheet.getRange(`I${currentRow}`).setValue(stok.birim);

});



console.log('Fiş sayfasına kayıt tamamlandı');



return JSON.stringify({

  success: true,

  message: 'Fiş başarıyla kaydedildi'

});

} catch (error) {

console.error('Fiş kaydı hatası:', error);

return JSON.stringify({

  success: false,

  message: error.toString()

});

}

}

function saveToCikisListesi(data) {

try {

console.log('Çıkış Listesi sayfasına kayıt başlatılıyor:', data);



const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Çıkış Listesi');

if (!sheet) {

  throw new Error('Çıkış Listesi sayfası bulunamadı');

}



// Son satırı bul

const lastRow = sheet.getLastRow();

const startRow = lastRow > 0 ? lastRow + 1 : 2;



// Müşteri tipini belirle

const musteriTipi = data.customerType === 'ortak-ici' ? 'Ortak İçi' : 'Ortak Dışı';



// Ortak bilgilerini hazırla

const ortakNo = data.customerType === 'ortak-ici' ? data.ortakBilgileri.ortakNo : '';

const adSoyad = data.customerType === 'ortak-ici' ? data.ortakBilgileri.ortakAdSoyad : data.ortakBilgileri.ortakDisiAdSoyad;



// Her stok kalemi için ayrı satır oluştur

const rowData = [];



data.stoklar.forEach((stok, index) => {

  const row = [

    data.tarih,                          // A sütunu - Tarih

    data.fisNo,                          // B sütunu - Fiş No

    data.kullanici,                      // C sütunu - Kullanıcı

    data.satisTuru,                      // D sütunu - Satış Türü

    musteriTipi,                         // E sütunu - Ortak İçi/Dışı

    ortakNo,                             // F sütunu - Ortak No

    adSoyad,                             // G sütunu - Ad Soyad

    stok.stokKodu,                       // H sütunu - Stok Kodu

    stok.stokAdi,                        // I sütunu - Stok Adı

    stok.miktar,                         // J sütunu - Miktar

    stok.birim,                          // K sütunu - Birim

    data.aciklama || ''                  // L sütunu - Açıklama

  ];

  

  rowData.push(row);

});



// Verileri sayfaya yaz

if (rowData.length > 0) {

  sheet.getRange(startRow, 1, rowData.length, rowData[0].length).setValues(rowData);

}



// Fiş numarasını güncelle (B1 hücresinde)

const currentFisNo = parseInt(sheet.getRange('B1').getValue()) || 0;

sheet.getRange('B1').setValue(parseInt(data.fisNo) + 1);



console.log('Çıkış Listesi sayfasına kayıt tamamlandı: ' + rowData.length + ' satır eklendi');



return JSON.stringify({

  success: true,

  message: 'Çıkış Listesi başarıyla kaydedildi',

  addedRows: rowData.length

});

} catch (error) {

console.error('Çıkış Listesi kaydı hatası:', error);

return JSON.stringify({

  success: false,

  message: error.toString()

});

}

}

// Yeni ortak dışı kayıt ekle

function saveOrtakDisi(adSoyad, telefon) {

try {

var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ortak Dışı Listesi');

if (!sheet) {

  return JSON.stringify({

    success: false,

    message: 'Ortak Dışı Listesi sayfası bulunamadı'

  });

}



// Aynı isimde kayıt var mı kontrol et

var data = sheet.getRange('A2:A' + sheet.getLastRow()).getValues();

var exists = false;



for (var i = 0; i < data.length; i++) {

  if (data[i][0] && data[i][0].toString().trim().toLowerCase() === adSoyad.toLowerCase()) {

    exists = true;

    break;

  }

}



if (exists) {

  return JSON.stringify({

    success: false,

    message: 'Bu isimde zaten bir kayıt bulunuyor'

  });

}



// Yeni kaydı ekle

var lastRow = sheet.getLastRow() + 1;

sheet.getRange(lastRow, 1).setValue(adSoyad);

sheet.getRange(lastRow, 2).setValue(telefon || '');



console.log('Yeni ortak dışı kaydı eklendi: ' + adSoyad);



return JSON.stringify({

  success: true,

  message: 'Kayıt başarıyla eklendi'

});

} catch (error) {

console.error('Ortak dışı kayıt eklenirken hata:', error);

return JSON.stringify({

  success: false,

  message: error.toString()

});

}

}

// Yeni Ortak Kaydet

function saveNewOrtak() {

try {

return JSON.stringify({

  success: false,

  message: 'Yeni ortak kaydetme özelliği henüz implemente edilmedi'

});

} catch (error) {

return JSON.stringify({

  success: false,

  message: error.toString()

});

}

}

// Sadece PDF URL'si oluştur

function createSimplePDF() {

try {

console.log('PDF URL oluşturuluyor...');



const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

const sheet = spreadsheet.getSheetByName('Fiş');



if (!sheet) {

  throw new Error('Fiş sayfası bulunamadı');

}



// Dinamik yazdırma alanını bul

const rangeResult = JSON.parse(findPrintRange());

if (!rangeResult.success) {

  throw new Error('Yazdırma alanı bulunamadı');

}



const printRange = rangeResult.printRange;

const sheetId = sheet.getSheetId();

const spreadsheetId = spreadsheet.getId();



console.log('PDF için yazdırma alanı:', printRange);



// Termal yazıcı için PDF export URL'si - MİNİMUM KENAR BOŞLUKLU

const pdfUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?` +

           `format=pdf&` +

           `gid=${sheetId}&` +

           `range=${encodeURIComponent(printRange)}&` +

           `size=7&` + // A7 boyutu (80mm termal fiş)

           `portrait=true&` + // DİKEY MOD

           `fitw=true&` + // Genişliğe sığdır

           `scale=2&` + // ✅ HIZ için eklendi - kenar boşlukları etkilenmez

           `gridlines=false&` +

           `printtitle=false&` +

           `sheetnames=false&` +

           `pagenumbers=false&` +

           `horizontal_alignment=CENTER&` +

           `vertical_alignment=TOP&` +

           `top_margin=0.01&` + // Kenar boşlukları AYNI

           `bottom_margin=0.01&` + // Kenar boşlukları AYNI

           `left_margin=0.01&` + // Kenar boşlukları AYNI

           `right_margin=0.01`; // Kenar boşlukları AYNI



console.log('PDF URL oluşturuldu:', pdfUrl);



return JSON.stringify({

  success: true,

  pdfUrl: pdfUrl,

  printRange: printRange,

  message: 'PDF URL başarıyla oluşturuldu'

});

} catch (error) {

console.error('PDF URL oluşturma hatası:', error);

return JSON.stringify({

  success: false,

  message: error.toString()

});

}

}

// Dinamik yazdırma alanını bul

function findPrintRange() {

try {

console.log('Dinamik yazdırma alanı bulunuyor...');



const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fiş');

if (!sheet) {

  throw new Error('Fiş sayfası bulunamadı');

}



// I10:I30 aralığında son dolu satırı bul

const dataRange = sheet.getRange('I10:I30');

const data = dataRange.getValues();



let lastDataRow = 9; // Minimum B2:I9



for (let i = data.length - 1; i >= 0; i--) {

  if (data[i][0] && data[i][0].toString().trim() !== '') {

    lastDataRow = i + 10; // I10'dan başladığı için +10

    break;

  }

}



// Yazdırma alanını oluştur: B2:I[lastDataRow]

const printRange = `B2:I${lastDataRow}`;

console.log('Yazdırma alanı:', printRange, 'Son satır:', lastDataRow);



return JSON.stringify({

  success: true,

  printRange: printRange,

  lastRow: lastDataRow

});

} catch (error) {

console.error('Yazdırma alanı bulma hatası:', error);

return JSON.stringify({

  success: false,

  message: error.toString()

});

}

}

// Sadece B10:I30 aralığının içeriğini temizle

function clearFisContentOnly() {

try {

console.log('B10:I30 aralığı temizleniyor...');



const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fiş');

if (!sheet) {

  throw new Error('Fiş sayfası bulunamadı');

}



// SADECE B10:I30 aralığının İÇERİĞİNİ temizle

const rangeToClear = 'B10:I30';

sheet.getRange(rangeToClear).clearContent();



console.log('B10:I30 aralığı başarıyla temizlendi');



return JSON.stringify({

  success: true,

  message: 'Fiş içeriği temizlendi'

});

} catch (error) {

console.error('Fiş temizleme hatası:', error);

return JSON.stringify({

  success: false,

  message: error.toString()

});

}

}

// YENİ EKLENECEK FONKSİYONLAR

/**

'Çıkış Listesi' sayfasındaki tüm benzersiz fiş numaralarını

büyükten küçüğe sıralı olarak getirir.


*/

function getFisNumaralari() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkış Listesi');

var lastRow = sheet.getLastRow();

if (lastRow < 2) {

  return JSON.stringify({ success: true, data: [] });

}



var fisNoRange = sheet.getRange('B2:B' + lastRow).getValues();



// Fiş nolarını al, boş olanları filtrele ve benzersiz yap

var fisNolari = fisNoRange.flat().filter(String);

var uniqueFisNolari = [...new Set(fisNolari)];



// Sayısal olarak büyükten küçüğe sırala

uniqueFisNolari.sort(function(a, b) { return b - a; });



return JSON.stringify({ success: true, data: uniqueFisNolari });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Belirtilen fiş numarasına ait tüm kalemlerin detaylarını

'Çıkış Listesi' sayfasından getirir.


*/

function getFisDetaylari(fisNo) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkış Listesi');

var data = sheet.getDataRange().getValues();



// Başlık satırını atla (i=1'den başla)

var fisDetaylari = [];

var genelBilgiler = {};

var ilkSatirBulundu = false;



for (var i = 1; i < data.length; i++) {

  if (data[i][1].toString() == fisNo) { // Fiş No B sütununda (index 1)

    

    // Fişin genel bilgilerini sadece ilk satırdan al

    if (!ilkSatirBulundu) {

      genelBilgiler = {

        tarih: data[i][0],      // A Sütunu

        fisNo: data[i][1],      // B Sütunu

        kullanici: data[i][2],  // C Sütunu

        satisTuru: data[i][3],  // D Sütunu

        musteriTipi: data[i][4], // E Sütunu

        ortakNo: data[i][5],    // F Sütunu

        adSoyad: data[i][6],    // G Sütunu

        aciklama: data[i][11]   // L Sütunu

      };

      ilkSatirBulundu = true;

    }



    // Stok kalemlerini ekle

    fisDetaylari.push({

      stokKodu: data[i][7],   // H Sütunu

      stokAdi: data[i][8],    // I Sütunu

      miktar: data[i][9],     // J Sütunu

      birim: data[i][10]      // K Sütunu

    });

  }

}



return JSON.stringify({ 

    success: true, 

    genelBilgiler: genelBilgiler,

    stoklar: fisDetaylari 

});

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Seçilen fişin verilerini 'Fiş' sayfasına yazar ve PDF URL'si oluşturur.

TARİH FORMATI DÜZELTİLDİ


*/

function tekrarYazdirFis(fisNo) {

try {

var fisDetaylariResult = JSON.parse(getFisDetaylari(fisNo));

if (!fisDetaylariResult.success) {

  throw new Error("Fiş detayları alınamadı: " + fisDetaylariResult.message);

}



var data = fisDetaylariResult;

var ss = SpreadsheetApp.getActiveSpreadsheet();

var fisSheet = ss.getSheetByName('Fiş');



// 1. Fiş sayfasını temizle

fisSheet.getRange('D3:G5').clearContent(); // Müşteri Bilgileri

fisSheet.getRange('H3:I5').clearContent(); // Temel Bilgiler

fisSheet.getRange('C6:I7').clearContent(); // Açıklama

fisSheet.getRange('B10:I30').clearContent(); // Stoklar



// 2. Yeni verileri 'Fiş' sayfasına yaz



// --- DEĞİŞİKLİK BURADA BAŞLIYOR ---

// Tarih objesini al ve istediğimiz formata çevir (gg.aa.yyyy)

var tarihObjesi = new Date(data.genelBilgiler.tarih);

var formatliTarih = Utilities.formatDate(tarihObjesi, ss.getSpreadsheetTimeZone(), "dd.MM.yyyy");

// --- DEĞİŞİKLİK BURADA BİTİYOR ---



// Temel Bilgiler

fisSheet.getRange('H3:I3').merge().setValue(formatliTarih); // Değiştirilen satır

fisSheet.getRange('H4:I4').merge().setValue(data.genelBilgiler.fisNo);

fisSheet.getRange('H5:I5').merge().setValue(data.genelBilgiler.satisTuru);



// Müşteri Bilgileri

if (data.genelBilgiler.musteriTipi === 'Ortak İçi') {

  fisSheet.getRange('D3:G3').merge().setValue(data.genelBilgiler.ortakNo);

  fisSheet.getRange('D4:G4').merge().setValue(data.genelBilgiler.adSoyad);

} else {

  fisSheet.getRange('D3:G3').merge().setValue('Ortak Dışı');

  fisSheet.getRange('D4:G4').merge().setValue(data.genelBilgiler.adSoyad);

}

fisSheet.getRange('D5:G5').clearContent();



// Açıklama

fisSheet.getRange('C6:I7').merge().setValue(data.genelBilgiler.aciklama);



// Stok Bilgileri

var startRow = 10;

data.stoklar.forEach(function(stok, index) {

  var currentRow = startRow + index;

  fisSheet.getRange('B' + currentRow + ':G' + currentRow).merge().setValue(stok.stokAdi);

  fisSheet.getRange('H' + currentRow).setValue(stok.miktar);

  fisSheet.getRange('I' + currentRow).setValue(stok.birim);

});



// 3. PDF URL'si oluştur

return createSimplePDF();

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

// .gs dosyanızın herhangi bir yerine ekleyin

function getFisTekrariUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=fistekrari';

}

// YENİ EKLENECEK FİŞ İPTAL FONKSİYONU

/**

Belirtilen fiş numarasına ait tüm satırları 'Çıkış Listesi' sayfasında iptal olarak işaretler.

Satırları siyaha boyar, yazı rengini beyaz yapar, D sütununa 'İptal' yazar

ve L sütununa iptal sebebini ekler.

@param {string} fisNo İptal edilecek fiş numarası.

@param {string} iptalSebebi Kullanıcının girdiği iptal sebebi.

@returns {string} JSON formatında başarı veya hata mesajı.


*/

// iptalEtFis fonksiyonunun tamamını bununla değiştirin

function iptalEtFis(fisNo, iptalSebebi) {

try {

var ss = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ');

var sheet = ss.getSheetByName('Çıkış Listesi');

var data = sheet.getDataRange().getValues();



var guncellenecekSatirlar = [];



for (var i = 1; i < data.length; i++) {

  if (data[i][1].toString() == fisNo) {

    guncellenecekSatirlar.push(i + 1);

  }

}



if (guncellenecekSatirlar.length === 0) {

  throw new Error('Belirtilen fiş numarası bulunamadı: ' + fisNo);

}



guncellenecekSatirlar.forEach(function(rowNum) {

  var rowRange = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn());

  rowRange.setBackground('#000000');

  rowRange.setFontColor('#ffffff');

  sheet.getRange(rowNum, 4).setValue('İptal');

  sheet.getRange(rowNum, 12).setValue(iptalSebebi);

});



// --- EN ÖNEMLİ DEĞİŞİKLİK BURADA ---

// Başarı mesajına ana menü URL'sini de ekliyoruz.

return JSON.stringify({

  success: true,

  message: fisNo + ' numaralı fiş (' + guncellenecekSatirlar.length + ' satır) başarıyla iptal edildi.',

  anaMenuUrl: ScriptApp.getService().getUrl() // Ana menü URL'sini cevaba ekle

});

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

function getFisIptaliUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=fisiptali';

}

// YENİ EKLENECEK STOK GÖRÜNTÜLEME FONKSİYONLARI

/**

'Stok Listesi' sayfasındaki A2:F aralığındaki tüm verileri getirir.


*/

function getStokVerileri() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Stok Listesi');

var lastRow = sheet.getLastRow();



// Eğer başlık dışında veri yoksa, boş bir dizi döndür.

if (lastRow < 2) {

  return JSON.stringify({ success: true, data: [] });

}



// A2'den başlayarak F sütununun son dolu satırına kadar olan veriyi al.

var range = sheet.getRange('A2:F' + lastRow);

var values = range.getValues();



return JSON.stringify({ success: true, data: values });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Stok Görüntüleme sayfasının URL'sini oluşturur.


*/

function getStokGoruntuleUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=stokgoruntule';

}

// YENİ EKLENECEK STOK GÜNCELLEME FONKSİYONLARI

/**

Stok Listesi'ndeki belirli bir hücreyi günceller.

@param {string} stokKodu Güncellenecek satırı bulmak için kullanılan benzersiz stok kodu (A Sütunu).

@param {string} sutunAdi Güncellenecek sütunun başlığı ('Hamaliye Ambalajı', 'Hamaliye Birimi', 'Stok Türü').

@param {string} yeniDeger Hücreye yazılacak yeni değer.

@returns {string} JSON formatında başarı veya hata mesajı.


*/

function updateStokVerisi(stokKodu, sutunAdi, yeniDeger) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Stok Listesi');

var data = sheet.getRange("A:A").getValues(); // Sadece A sütununu alarak hız kazan

var satirNumarasi = -1;



// Stok koduna göre doğru satırı bul

for (var i = 0; i < data.length; i++) {

  if (data[i][0].toString() == stokKodu) {

    satirNumarasi = i + 1; // Satır indeksi değil, gerçek satır numarası

    break;

  }

}



if (satirNumarasi === -1) {

  throw new Error("'" + stokKodu + "' kodlu stok bulunamadı.");

}



// Sütun adına göre doğru sütun numarasını belirle

var sutunNumarasi;

switch (sutunAdi) {

  case 'Hamaliye Ambalajı':

    sutunNumarasi = 4; // D Sütunu

    break;

  case 'Hamaliye Birimi':

    sutunNumarasi = 5; // E Sütunu

    break;

  case 'Stok Türü':

    sutunNumarasi = 6; // F Sütunu

    break;

  default:

    throw new Error("Geçersiz sütun adı: " + sutunAdi);

}



// Belirtilen hücreyi güncelle

sheet.getRange(satirNumarasi, sutunNumarasi).setValue(yeniDeger);



return JSON.stringify({ success: true, message: stokKodu + " güncellendi." });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Stok Güncelleme sayfasının URL'sini oluşturur.


*/

function getStokGuncelleUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=stokguncelle';

}

// YENİ EKLENECEK STOK EKLEME FONKSİYONLARI

/**

Yeni bir stok kalemini 'Stok Listesi' sayfasına ekler.

@param {object} stokData Formdan gelen stok bilgilerini içeren nesne.

@returns {string} JSON formatında başarı veya hata mesajı.


*/

function addNewStok(stokData) {

try {

// Gerekli alanların dolu olup olmadığını sunucu tarafında da kontrol et

if (!stokData.kod || !stokData.ad) {

  throw new Error("Stok Kodu ve Stok Adı alanları boş bırakılamaz.");

}



var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Stok Listesi');



// Yeni satır verisini doğru sırada bir dizi olarak hazırla

var newRow = [

  stokData.kod,             // A Sütunu: Stok Kodu

  stokData.ad,              // B Sütunu: Stok Adı

  stokData.birim,           // C Sütunu: Birim

  stokData.hamaliyeAmbalaj, // D Sütunu: Hamaliye Ambalajı

  stokData.hamaliyeBirim,   // E Sütunu: Hamaliye Birimi

  stokData.stokTuru         // F Sütunu: Stok Türü

];



// Veriyi sayfanın sonuna ekle

sheet.appendRow(newRow);



return JSON.stringify({ success: true, message: "'" + stokData.ad + "' başarıyla stok listesine eklendi." });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Stok Ekleme sayfasının URL'sini oluşturur.


*/

function getStokEkleUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=stokekle';

}

// YENİ EKLENECEK VERESİYE YÖNETİM FONKSİYONLARI

/**

'Çıkış Listesi' sayfasından sadece D sütununda "Veresiye" yazan satırları getirir.

Güncelleme işlemi için orijinal satır numarasını da veriye ekler.


*/

function getVeresiyeListesi() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkış Listesi');

var tumVeriler = sheet.getDataRange().getValues();

var veresiyeKayitlari = [];



// Başlık satırını atla (i=1'den başla)

for (var i = 1; i < tumVeriler.length; i++) {

  // D sütunu (index 3) "Veresiye" ise

  if (tumVeriler[i][3] === 'Veresiye') {

    veresiyeKayitlari.push({

      originalRow: i + 1, // Güncelleme için gerçek satır numarası

      data: tumVeriler[i] // O satırın tüm verisi

    });

  }

}



return JSON.stringify({ success: true, data: veresiyeKayitlari });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Veresiye Yönetim sayfasının URL'sini oluşturur.


*/

function getVeresiyeYonetimUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=veresiyeyonetim';

}

// YENİ TOPLU GÜNCELLEME FONKSİYONU

// Kod.gs dosyanızdaki updateMultipleVeresiyeKayitlari fonksiyonunu bununla değiştirin.

function updateMultipleVeresiyeKayitlari(guncellemeler) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkış Listesi');



guncellemeler.forEach(function(kayit) {

  sheet.getRange(kayit.satirNumarasi, 4).setValue(kayit.yeniSatisTuru); // D Sütunu

  sheet.getRange(kayit.satirNumarasi, 12).setValue(kayit.yeniAciklama); // L Sütunu

});



// --- EN ÖNEMLİ DEĞİŞİKLİK BURADA ---

// Başarı cevabına, sayfanın kendini yeniden yükleyeceği URL'yi de ekliyoruz.

return JSON.stringify({ 

  success: true, 

  message: guncellemeler.length + " kayıt başarıyla güncellendi.",

  redirectUrl: ScriptApp.getService().getUrl() + '?page=veresiyeyonetim'

});

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

// YENİ EKLENECEK LİSTE GÖRÜNTÜLEME FONKSİYONLARI

/**

'Çıkış Listesi' sayfasındaki verileri getirir. Tarih aralığı belirtilirse filtreler.

@param {string} [baslangicTarihi] Opsiyonel. Filtre için başlangıç tarihi (örn: "2025-10-15").

@param {string} [bitisTarihi] Opsiyonel. Filtre için bitiş tarihi (örn: "2025-10-20").

@returns {string} JSON formatında tablo verisi veya hata mesajı.


*/

function getCikisListesiVerileri(baslangicTarihi, bitisTarihi) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkış Listesi');

var tumVeriler = sheet.getRange("A2:L" + sheet.getLastRow()).getValues(); // A2'den L'nin sonuna kadar



// Eğer tarih filtresi yoksa, tüm verileri döndür

if (!baslangicTarihi || !bitisTarihi) {

  return JSON.stringify({ success: true, data: tumVeriler });

}



// Tarih filtresi varsa, verileri filtrele

const baslangic = new Date(baslangicTarihi);

const bitis = new Date(bitisTarihi);

bitis.setHours(23, 59, 59, 999); // Bitiş tarihini gün sonuna ayarlayarak o günü de dahil et



var filtrelenmisVeriler = tumVeriler.filter(function(row) {

  var kayitTarihi = new Date(row[0]); // A sütunundaki tarih

  return kayitTarihi >= baslangic && kayitTarihi <= bitis;

});



return JSON.stringify({ success: true, data: filtrelenmisVeriler });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Liste Görüntüleme sayfasının URL'sini oluşturur.


*/

function getListeGoruntuleUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=listegoruntule';

}

// YENİ EKLENECEK ORTAK LİSTESİ FONKSİYONLARI

/**

'Ortak Listesi' sayfasındaki A2:E aralığındaki tüm verileri getirir.


*/

function getOrtakListesiVerileri() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Ortak Listesi');

var lastRow = sheet.getLastRow();

if (lastRow < 2) {

  return JSON.stringify({ success: true, data: [] });

}

var values = sheet.getRange('A2:E' + lastRow).getValues();

return JSON.stringify({ success: true, data: values });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Yeni bir ortağı 'Ortak Listesi' sayfasına ekler.

@param {object} ortakData Formdan gelen ortak bilgilerini içeren nesne.


*/

// Kod.gs dosyanızdaki addNewOrtak fonksiyonunun tamamını bununla değiştirin.

function addNewOrtak(ortakData) {

try {

if (!ortakData.numara || !ortakData.adsoyad) {

  throw new Error("Ortak Numarası ve Adı Soyadı alanları zorunludur.");

}

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Ortak Listesi');



var newRow = [

  ortakData.numara, ortakData.tckn, ortakData.adsoyad,

  ortakData.telefon, ortakData.mahalle

];

sheet.appendRow(newRow); // Veriyi kaydet



// --- EN ÖNEMLİ DEĞİŞİKLİK: KAYDETTİKTEN SONRA GÜNCEL LİSTEYİ OKU ---

var lastRow = sheet.getLastRow();

var values = []; // Varsayılan boş dizi

if (lastRow >= 2) {

  values = sheet.getRange('A2:E' + lastRow).getValues();

}



// Başarı mesajı ve GÜNCEL LİSTENİN TAMAMINI tek pakette geri gönder

return JSON.stringify({

  success: true,

  message: "'" + ortakData.adsoyad + "' başarıyla ortak listesine eklendi.",

  data: values 

});

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Ortak Listesi sayfasının URL'sini oluşturur.


*/

function getOrtakListesiUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=ortaklistesi';

}

// YENİ EKLENECEK ORTAK DIŞI LİSTESİ FONKSİYONLARI

/**

'Ortak Dışı Listesi' sayfasındaki A2:B aralığındaki tüm verileri getirir.


*/

function getOrtakDisiListesiVerileri() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Ortak Dışı Listesi');

var lastRow = sheet.getLastRow();

if (lastRow < 2) {

  return JSON.stringify({ success: true, data: [] });

}

var values = sheet.getRange('A2:B' + lastRow).getValues();

return JSON.stringify({ success: true, data: values });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Ortak Dışı Listesi sayfasının URL'sini oluşturur.


*/

function getOrtakDisiListesiUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=ortakdisilistesi';

}

// Kod.gs dosyanızdaki addNewGirisKaydi fonksiyonunun tamamını bununla değiştirin.

function addNewGirisKaydi(girisData) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkacak Listesi');

if (!sheet) {

  throw new Error("'Çıkacak Listesi' adında bir sayfa bulunamadı.");

}



var ortakNoTipi = '';

var adSoyad = '';

if (girisData.musteriTipi === 'ortak-ici') {

  ortakNoTipi = girisData.ortakBilgileri.ortakNo;

  adSoyad = girisData.ortakBilgileri.ortakAdSoyad;

} else {

  ortakNoTipi = 'Ortak Dışı';

  adSoyad = girisData.ortakBilgileri.ortakDisiAdSoyad;

}



var eklenecekSatirlar = [];



girisData.stoklar.forEach(function(stok) {

  var newRow = [

    girisData.tarih, girisData.kullanici, ortakNoTipi, adSoyad,

    stok.stokKodu, stok.stokAdi, stok.miktar, stok.birim

  ];

  eklenecekSatirlar.push(newRow);

});



if (eklenecekSatirlar.length > 0) {

  sheet.getRange(sheet.getLastRow() + 1, 1, eklenecekSatirlar.length, eklenecekSatirlar[0].length).setValues(eklenecekSatirlar);

}



// --- EN ÖNEMLİ DEĞİŞİKLİK BURADA ---

// Başarı cevabına, sayfanın kendini yeniden yükleyeceği URL'yi de ekliyoruz.

return JSON.stringify({ 

  success: true, 

  message: eklenecekSatirlar.length + " kalem ürün çıkacak listesine başarıyla eklendi.",

  redirectUrl: ScriptApp.getService().getUrl() + '?page=depogiris'

});

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

// EKSİK OLAN VE EKLENMESİ GEREKEN FONKSİYON

function getDepoGirisUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=depogiris';

}

// YENİ EKLENECEK DEPO ÇIKIŞ FONKSİYONLARI

/**

'Çıkacak Listesi'ndeki benzersiz müşteri isimlerini "Kod - İsim" formatında getirir.


*/

// Kod.gs dosyanızdaki getMusteriListesiForCikis fonksiyonunun tamamını bununla değiştirin.

// Kod.gs dosyanızdaki getMusteriListesiForCikis fonksiyonunun tamamını bununla değiştirin.

function getMusteriListesiForCikis() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkacak Listesi');

var data = sheet.getDataRange().getValues();



// Sadece kalan malı olan, benzersiz müşterileri saklamak için bir nesne

var aktifMusteriler = {}; 



// Başlık satırını atlayarak (i=1) tüm listeyi tara

for (var i = 1; i < data.length; i++) {

  var row = data[i];

  // K Sütunu (index 10) 'Kalan Miktar' sütunudur.

  var kalanMiktar = parseFloat(row[10]) || 0; 



  // Eğer bu satırda kalan miktar varsa...

  if (kalanMiktar > 0) {

    // ... C ve D sütunlarından müşteri kimliğini oluştur...

    var musteriKimligi = row[2] + " - " + row[3]; 

    // ... ve listeye ekle (nesne sayesinde her müşteri sadece bir kez eklenir).

    aktifMusteriler[musteriKimligi] = true;

  }

}



// Sadece aktif müşterilerin listesini döndür

return JSON.stringify({ success: true, data: Object.keys(aktifMusteriler) });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Seçilen müşterinin 'Çıkacak Listesi'ndeki tüm sipariş kalemlerini getirir.


*/

// Kod.gs dosyanızdaki getCikisDetaylari fonksiyonunun tamamını bununla değiştirin.

// Kod.gs dosyanızdaki getCikisDetaylari fonksiyonunun tamamını bununla değiştirin.

function getCikisDetaylari(musteriKimligi) {

try {

const [kod, ad] = musteriKimligi.split(' - ');

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkacak Listesi');

var tumVeriler = sheet.getDataRange().getValues();

var detaylar = [];



// Başlık satırını atlayarak (i=1) tüm listeyi tara

for (var i = 1; i < tumVeriler.length; i++) {

  var row = tumVeriler[i];

  

  // 1. Koşul: Müşteri eşleşiyor mu? (C ve D sütunları)

  if (row[2] == kod && row[3] == ad) {

    

    // --- KESİN ÇÖZÜM BURADA ---

    // 2. Koşul: Kalan Miktar (K Sütunu, index 10) sıfırdan büyük mü?

    var kalanMiktar = parseFloat(row[10]) || 0; 

    if (kalanMiktar > 0) {

      

      // Eğer her iki koşul da doğruysa, listeye ekle

      detaylar.push({

        originalRow: i + 1,

        tarih: row[0],

        stokKodu: row[4],

        stokAdi: row[5],

        alinanMiktar: row[6],

        birim: row[7],

        toplamCikan: row[9],

        kalanMiktar: kalanMiktar // Doğrudan okunan, doğru değer

      });

    }

  }

}



return JSON.stringify({ success: true, data: detaylar });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Formdan gelen yeni çıkış miktarlarını 'Çıkacak Listesi'ne işler ve hesaplamaları yapar.


*/

function kaydetDepoCikis(cikisVerileri) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkacak Listesi');



cikisVerileri.forEach(function(stok) {

  var satirNumarasi = stok.originalRow;

  var buSeferCikan = parseFloat(stok.cikanMiktar) || 0;



  // Güncel verileri E-Tablodan tekrar oku (güvenlik için)

  var guncelVeri = sheet.getRange(satirNumarasi, 7, 1, 5).getValues()[0]; // G'den K'ye

  var alinanMiktar = parseFloat(guncelVeri[0]) || 0;

  var eskiToplamCikan = parseFloat(guncelVeri[3]) || 0; // J sütunu (index 3)

  var guncelKalan = parseFloat(guncelVeri[4]) || 0;     // K sütunu (index 4)



  // Sunucu tarafı son kontrol

  if (buSeferCikan > guncelKalan) {

    throw new Error(stok.stokKodu + " için çıkış miktarı (" + buSeferCikan + "), kalan miktardan (" + guncelKalan + ") fazla olamaz!");

  }



  var yeniToplamCikan = eskiToplamCikan + buSeferCikan;

  var yeniKalanMiktar = alinanMiktar - yeniToplamCikan;

  var durum = "";



  if (yeniKalanMiktar < 0) {

    throw new Error("Hesaplama hatası! Kalan miktar negatif olamaz.");

  } else if (yeniKalanMiktar == 0) {

    durum = "Tamamlandı";

  } else {

    durum = "Devam Ediyor";

  }



  // E-Tabloya yeni değerleri tek seferde yaz

  sheet.getRange(satirNumarasi, 9, 1, 4).setValues([[buSeferCikan, yeniToplamCikan, yeniKalanMiktar, durum]]); // I, J, K, L sütunları

});



return JSON.stringify({ success: true, message: cikisVerileri.length + " kalem çıkışı başarıyla işlendi." });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Depo Çıkış sayfasının URL'sini oluşturur.


*/

function getDepoCikisUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=depocikis';

}

// YENİ EKLENECEK DEPO KAYITLARINI GÖRÜNTÜLEME FONKSİYONLARI

/**

'Çıkacak Listesi'ndeki verileri çeşitli filtrelere göre getirir.

@param {string} durumFiltresi "Tümü", "Devam Ediyor" veya "Tamamlananlar".

@param {string} musteriFiltresi "Tümü" veya "Kod - İsim" formatında bir müşteri kimliği.

@returns {string} JSON formatında filtrelenmiş tablo verisi.


*/

function getDepoKayitlari(durumFiltresi, musteriFiltresi) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkacak Listesi');

var tumVeriler = sheet.getDataRange().getValues();

var sonVeriler = [];



// Her satıra, orijinal satır numarasını ekleyerek yeni bir dizi oluştur. Bu, iptal işlemi için gereklidir.

for (var i = 1; i < tumVeriler.length; i++) { // Başlıkları atla

  sonVeriler.push({ originalRow: i + 1, data: tumVeriler[i] });

}



// Müşteri filtresini uygula

if (musteriFiltresi && musteriFiltresi !== "Tümü") {

  const [kod, ad] = musteriFiltresi.split(' - ');

  sonVeriler = sonVeriler.filter(item => item.data[2] == kod && item.data[3] == ad);

}



// Durum filtresini uygula

if (durumFiltresi && durumFiltresi !== "Tümü") {

  sonVeriler = sonVeriler.filter(item => item.data[11] == durumFiltresi); // L Sütunu (index 11)

}



return JSON.stringify({ success: true, data: sonVeriler });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

'Çıkacak Listesi'ndeki tüm benzersiz müşteri isimlerini "Kod - İsim" formatında getirir.


*/

function getMusteriListesiForFiltre() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkacak Listesi');

var data = sheet.getRange("C2:D" + sheet.getLastRow()).getValues();

var musteriler = {};

data.forEach(function(row) {

  if (row[1]) {

    musteriler[row[0] + " - " + row[1]] = true;

  }

});

return JSON.stringify({ success: true, data: Object.keys(musteriler).sort() });

} catch(e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

'Çıkacak Listesi'ndeki belirtilen bir satırı iptal olarak işaretler.

@param {number} satirNumarasi İptal edilecek satırın numarası.


*/

// Kod.gs dosyanızdaki iptalDepoKaydi fonksiyonunun tamamını bununla değiştirin.

function iptalDepoKaydi(satirNumarasi) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkacak Listesi');



// --- YENİ EKLENEN ADIMLAR ---



// 1. Mevcut Stok Adı'nı oku (F Sütunu, 6. sütun)

var stokAdiCell = sheet.getRange(satirNumarasi, 6);

var mevcutStokAdi = stokAdiCell.getValue();



// Güvenlik kontrolü: Eğer zaten iptal edilmişse, tekrar "- İptal" ekleme.

if (!mevcutStokAdi.endsWith(" - İptal")) {

    stokAdiCell.setValue(mevcutStokAdi + " - İptal");

}



// 2. Kalan Miktar'ı (K Sütunu, 11. sütun) sıfırla

sheet.getRange(satirNumarasi, 11).setValue(0);



// 3. Durum'u (L Sütunu, 12. sütun) "Tamamlandı" olarak güncelle (Bu zaten vardı, ama sırayı netleştirelim)

sheet.getRange(satirNumarasi, 12).setValue('Tamamlandı');



// --- MEVCUT ADIM ---



// 4. Tüm satırı biçimlendir (A'dan L'ye, yani 12 sütun)

sheet.getRange(satirNumarasi, 1, 1, 12).setBackground('#000000').setFontColor('#ffffff');



return JSON.stringify({ success: true, message: "Kayıt başarıyla iptal edildi ve tamamlandı olarak işaretlendi." });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Depo Kayıtlarını Görüntüleme sayfasının URL'sini oluşturur.


*/

function getDepoKayitlariniGoruntuleUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=depokayitlarigoruntule';

}

// YENİ EKLENECEK HAMALİYE HESAPLAMA FONKSİYONLARI

/**

'Hamaliye Hesabı' sayfasından başlangıç fiyatlarını okur.


*/

function getHamaliyeInitialData() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Hamaliye Hesabı');

var yemFiyati = sheet.getRange('C4').getValue();

var gubreFiyati = sheet.getRange('G4').getValue();

var digerFiyati = sheet.getRange('K4').getValue();



return JSON.stringify({

  success: true,

  data: { yem: yemFiyati, gubre: gubreFiyati, diger: digerFiyati }

});

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

'Hamaliye Hesabı' sayfasındaki fiyatları günceller.


*/

function updateHamaliyePrices(prices) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Hamaliye Hesabı');

sheet.getRange('C4').setValue(prices.yem);

sheet.getRange('G4').setValue(prices.gubre);

sheet.getRange('K4').setValue(prices.diger);

return JSON.stringify({ success: true, message: "Fiyatlar başarıyla güncellendi." });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

'Çıkış Listesi'ndeki fiş numaralarını hamaliye formu için getirir.


*/

function getFisNumaralariForHamaliye() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkış Listesi');

var fisNoRange = sheet.getRange('B2:B' + sheet.getLastRow()).getValues();

var fisNolari = [...new Set(fisNoRange.flat().filter(String))];

fisNolari.sort((a, b) => b - a);

return JSON.stringify({ success: true, data: fisNolari });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Seçilen bir fiş numarasına ait tüm stok kalemlerini ve bu stokların türlerini getirir.


*/

// Kod.gs dosyanızdaki getDetailsForFis fonksiyonunun tamamını bununla değiştirin.

// Kod.gs dosyanızdaki getDetailsForFis fonksiyonunun tamamını bununla değiştirin.

function getDetailsForFis(fisNo) {

try {

var cikisSheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Çıkış Listesi');

var stokSheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Stok Listesi');



// Performans için Stok Listesi'ni bir haritaya (map) dönüştürerek hem Tür hem de E Sütunu bilgisini sakla

var stokInfoMap = new Map();

var stokData = stokSheet.getRange("A2:F" + stokSheet.getLastRow()).getValues();

stokData.forEach(row => {

  stokInfoMap.set(row[0].toString(), { 

    tur: row[5],         // F Sütunu: Stok Türü

    eSutunu: row[4]      // E Sütunu: İlgili değer (Hamaliye Birimi)

  });

});



var cikisData = cikisSheet.getDataRange().getValues();

var kalemler = [];



for (var i = 1; i < cikisData.length; i++) {

  if (cikisData[i][1].toString() == fisNo) { // Fiş No (B Sütunu) eşleşirse

    var stokKodu = cikisData[i][7]; // H Sütunu

    var stokInfo = stokInfoMap.get(stokKodu.toString()) || { tur: 'Bilinmiyor', eSutunu: 0 };



    kalemler.push({

      stokKodu: stokKodu,

      stokAdi: cikisData[i][8],

      miktar: cikisData[i][9],

      stokTuru: stokInfo.tur,

      eSutunuDegeri: stokInfo.eSutunu // Hesaplama için bu yeni veriyi ekle

    });

  }

}

return JSON.stringify({ success: true, data: kalemler });

} catch(e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Hamaliye Hesaplama sayfasının URL'sini oluşturur.


*/

function getHamaliyeHesaplamaUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=hamaliyehesaplama';

}

// YENİ EKLENEN HAMALİYE KAYDETME FONKSİYONU

/**

Hamaliye Hesaplama formundan gelen tüm verileri işler ve 'Hamaliye Hesabı' sayfasına kaydeder.

@param {object} hesaplamaData Formdan toplanan tüm başlık, toplam ve fiş detaylarını içerir.


*/

// Kod.gs dosyanızdaki kaydetHamaliyeHesaplamasi fonksiyonunun tamamını bununla değiştirin.

// Kod.gs dosyanızdaki kaydetHamaliyeHesaplamasi fonksiyonunun tamamını bununla değiştirin.

// Kod.gs dosyanızdaki kaydetHamaliyeHesaplamasi fonksiyonunun tamamını bununla değiştirin.

// Kod.gs dosyanızdaki kaydetHamaliyeHesaplamasi fonksiyonunun tamamını bununla değiştirin.

function kaydetHamaliyeHesaplamasi(hesaplamaData) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Hamaliye Hesabı');

if (!sheet) {

  throw new Error("'Hamaliye Hesabı' sayfası bulunamadı.");

}



// --- DÜZELTME BURADA: Eski verilerin SADECE İÇERİĞİNİ temizle ---

// Bu bölüm, birleştirilmiş hücre formatlarınızı koruyacak şekilde güncellendi.

sheet.getRange('A1:L3').clearContent();

sheet.getRange('C6:D7').clearContent();

sheet.getRange('G6:H7').clearContent();

sheet.getRange('K6:L7').clearContent();

sheet.getRange('G8:L9').clearContent();

if (sheet.getLastRow() >= 11) {

  var oldDataRange = sheet.getRange('A11:L' + sheet.getLastRow());

  oldDataRange.clearContent(); // Sadece hücre içeriğini siler.

  // Kenarlıkları temizlemek için formatı değil, sadece kenarlığı sıfırla

  oldDataRange.setBorder(null, null, null, null, null, null); 

}

// --- DÜZELTME SONU ---



// --- 2. Adım: Başlık ve Genel Toplamları Yaz ---

sheet.getRange('A1:L3').merge().setValue(hesaplamaData.baslik);

sheet.getRange('C6:D7').merge().setValue(hesaplamaData.genelToplamlar.yem);

sheet.getRange('G6:H7').merge().setValue(hesaplamaData.genelToplamlar.gubre);

sheet.getRange('K6:L7').merge().setValue(hesaplamaData.genelToplamlar.diger);

sheet.getRange('G8:L9').merge().setValue(hesaplamaData.genelToplamlar.tutar);



// --- 3. Adım: Fiş Detaylarını İşle ve Grupla (Bu kısım aynı) ---

var fisOzetleri = new Map();

hesaplamaData.fisDetaylari.forEach(item => {

  if (!fisOzetleri.has(item.fisNo)) {

    fisOzetleri.set(item.fisNo, { yem: 0, gubre: 0, diger: 0, ciftMi: false });

  }

  let ozet = fisOzetleri.get(item.fisNo);

  if (['Yem', 'Tohum'].includes(item.stokTuru)) { ozet.yem += item.toplam; } 

  else if (['Kimyevi Gübre', 'Toz Gübre'].includes(item.stokTuru)) { ozet.gubre += item.toplam; } 

  else if (['Sıvı Gübre', 'Zirai İlaç', 'Sulama', 'Madeni Yağ'].includes(item.stokTuru)) { ozet.diger += item.toplam; }

  if (item.isCift) { ozet.ciftMi = true; }

});



// --- 4. Adım: Fiş Özetlerini Sayfaya Yaz (Bu kısım aynı) ---

var yemFiyati = parseFloat(sheet.getRange('C4').getValue()) || 0;

var gubreFiyati = parseFloat(sheet.getRange('G4').getValue()) || 0;

var digerFiyati = parseFloat(sheet.getRange('K4').getValue()) || 0;

var yazilacakSatirlar = [];

fisOzetleri.forEach((ozet, fisNo) => {

  let fisTutari = (ozet.yem * yemFiyati) + (ozet.gubre * gubreFiyati) + (ozet.diger * digerFiyati);

  yazilacakSatirlar.push([

    fisNo, '', ozet.ciftMi ? 'Çift' : 'Tek', '', ozet.yem, '', ozet.gubre, '', ozet.diger, '', fisTutari, ''

  ]);

});



var pdfUrl = null;

if (yazilacakSatirlar.length > 0) {

  var sonSatir = 10 + yazilacakSatirlar.length;

  sheet.getRange(11, 1, yazilacakSatirlar.length, 12).setValues(yazilacakSatirlar);

  

  var borderRange = sheet.getRange(11, 1, yazilacakSatirlar.length, 12);

  borderRange.setBorder(true, true, true, true, true, true, "#444444", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  

  pdfUrl = createHamaliyePdfUrl(sonSatir);

}



return JSON.stringify({

  success: true,

  message: "Hamaliye hesabı başarıyla kaydedildi.",

  pdfUrl: pdfUrl

});

} catch (e) {

return JSON.stringify({ success: false, message: "Kayıt sırasında hata oluştu: " + e.toString() });

}

}
// YENİ EKLENEN PDF OLUŞTURMA FONKSİYONU

function createHamaliyePdfUrl(lastRow) {

try {

const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

const sheet = spreadsheet.getSheetByName('Hamaliye Hesabı');

if (!sheet) throw new Error('Hamaliye Hesabı sayfası bulunamadı.');



const spreadsheetId = spreadsheet.getId();

const sheetId = sheet.getSheetId();

const printRange = `A1:L${lastRow}`;



const pdfUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?` +

  `format=pdf&` +

  `gid=${sheetId}&` +

  `range=${encodeURIComponent(printRange)}&` +

  `size=A4&` + // A4 Kağıt boyutu

  `portrait=true&` + // Dikey

  `fitw=true&` + // Genişliğe sığdır

  `gridlines=false&` +

  `printtitle=false&` +

  `sheetnames=false&` +

  `pagenumbers=false&` +

  `horizontal_alignment=CENTER&` +

  `vertical_alignment=TOP`;

  

return pdfUrl; // Sadece URL'yi döndür

} catch (e) {

return null; // Hata durumunda null döndür

}

}

// YENİ EKLENECEK TALEP TAKİBİ FONKSİYONLARI

/**

Talep Takibi sayfasının URL'sini oluşturur.


*/

function getTalepTakibiUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=taleptakibi';

}

/**

'Talep Takibi' sayfasındaki verileri çeşitli filtrelere göre getirir.

@param {string} durumFiltresi "Tümü" veya belirli bir durum.

@param {string} grupFiltresi "Tümü" veya belirli bir ürün grubu.


*/

function getTalepListesi(durumFiltresi, grupFiltresi) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Talep Takibi');

var tumVeriler = sheet.getDataRange().getValues();

var filtrelenmisVeriler = [];



for (var i = 1; i < tumVeriler.length; i++) { // Başlıkları atla

  var row = tumVeriler[i];

  var durumUygun = (durumFiltresi === 'Tümü' || row[8] === durumFiltresi); // I Sütunu (index 8)

  var grupUygun = (grupFiltresi === 'Tümü' || row[5] === grupFiltresi); // F Sütunu (index 5)



  if (durumUygun && grupUygun) {

    // Her satıra, orijinal satır numarasını da ekleyerek gönderiyoruz.

    filtrelenmisVeriler.push({ originalRow: i + 1, data: row });

  }

}

return JSON.stringify({ success: true, data: filtrelenmisVeriler });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Yeni bir talep kaydını 'Talep Takibi' sayfasına ekler.


*/

function addNewTalep(talepData) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Talep Takibi');

var eklenecekSatirlar = [];



var ortakNo = (talepData.musteriTipi === 'ortak-ici') ? talepData.ortakBilgileri.numara : 'Ortak Dışı';

var adSoyad = talepData.ortakBilgileri.adsoyad;

var telefon = talepData.ortakBilgileri.telefon;



talepData.urunler.forEach(urun => {

  eklenecekSatirlar.push([

    talepData.tarih, talepData.kullanici, ortakNo, adSoyad, telefon,

    urun.grup, urun.ad, urun.miktar, 'Talep Oluşturuldu', '' // I: Durum, J: Açıklama

  ]);

});



if (eklenecekSatirlar.length > 0) {

  sheet.getRange(sheet.getLastRow() + 1, 1, eklenecekSatirlar.length, 10).setValues(eklenecekSatirlar);

}

return JSON.stringify({ success: true, message: eklenecekSatirlar.length + " ürün talebi başarıyla oluşturuldu." });

} catch(e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

'Talep Takibi' sayfasındaki güncellenebilir talepleri (iptal ve tamamlanmış olanlar hariç) getirir.


*/

function getUpdatableTalepler() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Talep Takibi');

var tumVeriler = sheet.getDataRange().getValues();

var guncellenebilirler = [];

var yasakliDurumlar = ['Satışı Tamamlandı', 'İptal Edildi'];



for (var i = 1; i < tumVeriler.length; i++) {

  if (!yasakliDurumlar.includes(tumVeriler[i][8])) { // I Sütunu (durum)

    guncellenebilirler.push({ originalRow: i + 1, data: tumVeriler[i] });

  }

}

return JSON.stringify({ success: true, data: guncellenebilirler });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

'Talep Takibi' sayfasındaki tek bir talebin durumunu ve açıklamasını günceller.


*/

function updateTalep(satirNumarasi, yeniDurum, yeniAciklama) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Talep Takibi');



// I ve J sütunlarını güncelle

sheet.getRange(satirNumarasi, 9, 1, 2).setValues([[yeniDurum, yeniAciklama]]);



// Eğer iptal edildiyse, satırı biçimlendir

if (yeniDurum === 'İptal Edildi') {

  sheet.getRange(satirNumarasi, 1, 1, sheet.getLastColumn()).setBackground('#000000').setFontColor('#ffffff');

}



return JSON.stringify({ success: true, message: "Talep durumu başarıyla güncellendi." });

} catch(e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

// YENİ EKLENECEK STOK SAYIM FONKSİYONLARI

/**

Tarayıcıdan gönderilen Excel verisini alır ve 'Stok Sayım' sayfasına yazar.

@param {Array} data Excel'den okunan ve filtrelenen [A, B, E] verilerini içeren 2D dizi.


*/

// Kod.gs dosyanızdaki processExcelData fonksiyonunun tamamını bununla değiştirin.

function processExcelData(data) {

try {

if (!data || data.length === 0) {

  throw new Error("Excel dosyasından işlenecek veri bulunamadı.");

}



var ss = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ'); // Spreadsheet'i bir kere açalım

var sayimSheet = ss.getSheetByName('Stok Sayım');

if (!sayimSheet) {

  throw new Error("'Stok Sayım' sayfası bulunamadı.");

}



// Önceki verileri temizle (opsiyonel)

if (sayimSheet.getLastRow() >= 2) {

  // Sadece A, B, C değil, I sütununu da temizleyelim

  sayimSheet.getRange(2, 1, sayimSheet.getLastRow() - 1, 9).clearContent(); 

}



// Yeni veriyi A, B, C sütunlarına yaz (A2'den başlayarak)

sayimSheet.getRange(2, 1, data.length, 3).setValues(data);



// --- YENİ EKLENEN STOK TÜRÜ EŞLEŞTİRME BÖLÜMÜ ---



var stokSheet = ss.getSheetByName('Stok Listesi');

if (!stokSheet) {

  throw new Error("'Stok Listesi' sayfası bulunamadı.");

}



// Stok Listesi verisini (A ve F sütunları) hafızaya alıp bir Map oluştur (hızlı arama için)

var stokListesiData = stokSheet.getRange("A2:F" + stokSheet.getLastRow()).getValues();

var stokTuruMap = new Map();

stokListesiData.forEach(row => {

  if (row[0]) { // Stok kodu boş değilse

    stokTuruMap.set(row[0].toString(), row[5] || ''); // A sütunu -> F sütunu (Stok Türü)

  }

});



// Sayım sayfasına yeni yazılan stok kodlarını (A sütunu) oku

var sayimStokKodlari = sayimSheet.getRange(2, 1, data.length, 1).getValues();



var stokTurleriToWrite = []; // I sütununa yazılacak türler

var unmatchedCodes = [];     // Eşleşmeyen kodlar



sayimStokKodlari.forEach(function(row, index) {

  var stokKodu = row[0].toString();

  if (stokTuruMap.has(stokKodu)) {

    stokTurleriToWrite.push([stokTuruMap.get(stokKodu)]); // I sütunu için dizi içine al

  } else {

    stokTurleriToWrite.push(['']); // Eşleşme yoksa boş bırak

    unmatchedCodes.push(stokKodu); // Eşleşmeyenleri listeye ekle

  }

});



// Hesaplanan stok türlerini I sütununa (9. sütun) yaz

if (stokTurleriToWrite.length > 0) {

  sayimSheet.getRange(2, 9, stokTurleriToWrite.length, 1).setValues(stokTurleriToWrite);

}



// --- STOK TÜRÜ EŞLEŞTİRME BÖLÜMÜ SONU ---



// Başarı mesajını oluştur (eşleşmeyen varsa uyar)

var message = data.length + " satır başarıyla aktarıldı.";

if (unmatchedCodes.length > 0) {

  message += " UYARI: Aşağıdaki stok kodları 'Stok Listesi' sayfasında bulunamadı ve türleri boş bırakıldı: " + unmatchedCodes.join(', ');

}



return JSON.stringify({ success: true, message: message });

} catch (e) {

return JSON.stringify({ success: false, message: "Veri işlenirken hata oluştu: " + e.toString() });

}

}

/**

Stok Sayım sayfasının URL'sini oluşturur.


*/

function getStokSayimUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=stoksayim';

}

// YENİ EKLENECEK STOK SAYIM V2 FONKSİYONLARI

/**

Stok Listesi'ndeki tüm benzersiz stok türlerini getirir.


*/

function getStokTurleri() {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Stok Listesi');

var data = sheet.getRange("F2:F" + sheet.getLastRow()).getValues();

var turler = [...new Set(data.flat().filter(String))].sort(); // Benzersiz yap ve sırala

return JSON.stringify({ success: true, data: turler });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

'Stok Sayım' verilerini getirir, 'Çıkacak Listesi'ni kontrol ederek 'Çıkacak' miktarını hesaplar

ve belirtilen stok türüne göre filtreler.

@param {string} stokTuruFilter Filtrelenecek stok türü veya "Tümü".

@returns {string} JSON formatında işlenmiş tablo verisi.


*/

function getStokSayimData(stokTuruFilter) {

try {

var ss = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ');

var sayimSheet = ss.getSheetByName('Stok Sayım');

var cikisListesiSheet = ss.getSheetByName('Çıkış Listesi'); 

var cikacakSheet = ss.getSheetByName('Çıkacak Listesi'); 

var pesinSatisSheet = ss.getSheetByName('Peşin Satış');

var stokSheet = ss.getSheetByName('Stok Listesi'); // Filtreleme için bu gerekli



if (!sayimSheet) throw new Error("'Stok Sayım' sayfası bulunamadı.");

if (!cikisListesiSheet) throw new Error("'Çıkış Listesi' sayfası bulunamadı.");

if (!cikacakSheet) throw new Error("'Çıkacak Listesi' sayfası bulunamadı.");

if (!pesinSatisSheet) throw new Error("'Peşin Satış' sayfası bulunamadı.");

if (!stokSheet) throw new Error("'Stok Listesi' sayfası bulunamadı.");



var sayimData = sayimSheet.getDataRange().getValues(); 

var cikisListesiData = cikisListesiSheet.getDataRange().getValues(); 

var cikacakData = cikacakSheet.getDataRange().getValues(); 

var pesinSatisDataRange = pesinSatisSheet.getRange("A16:G" + pesinSatisSheet.getLastRow());

var pesinSatisData = pesinSatisDataRange.getValues();

var stokListesiData = stokSheet.getRange("A2:F" + stokSheet.getLastRow()).getValues();



// --- Stok Türü Haritası (FİLTRELEME İÇİN GEREKLİ) ---

var stokTuruMap = new Map();

stokListesiData.forEach(row => {

  if (row[0]) {

    stokTuruMap.set(row[0].toString(), row[5] || ''); // A sütunu (kod) -> F sütunu (tür)

  }

});



// --- Peşin Satış Hesaplama (Doğru) ---

var pesinSatisToplamlari = new Map();

pesinSatisData.forEach(function(row) {

  const stokKodu = row[0]; const miktar = parseFloat(row[6]) || 0;

  if (stokKodu && miktar > 0) pesinSatisToplamlari.set(stokKodu.toString(), (pesinSatisToplamlari.get(stokKodu.toString()) || 0) + miktar);

});



// --- Veresiye Hesaplama (İÇİ DOLDURULDU) ---

var veresiyeToplamlari = new Map();

for (let i = 1; i < cikisListesiData.length; i++) { 

  const row = cikisListesiData[i];

  const satisTuru = row[3];   

  const stokKodu = row[7];    

  const miktar = parseFloat(row[9]) || 0; 

  if (stokKodu && satisTuru === 'Veresiye' && miktar > 0) {

    veresiyeToplamlari.set(stokKodu.toString(), (veresiyeToplamlari.get(stokKodu.toString()) || 0) + miktar);

  }

}



// --- Çıkacak Hesaplama (İÇİ DOLDURULDU) ---

var cikacakToplamlari = new Map();

for (let i = 1; i < cikacakData.length; i++) {

  const row = cikacakData[i];

  const stokKodu = row[4]; // E Sütunu: Stok Kodu

  const durum = row[11];   // L Sütunu: Durum

  const kalan = parseFloat(row[10]) || 0; // K Sütunu: Kalan Miktar

  

  // Önceki isteğiniz: "Tamamlandı" yazmıyorsa ve kalan > 0 ise topla

  if (stokKodu && durum !== 'Tamamlandı' && kalan > 0) { 

    cikacakToplamlari.set(stokKodu.toString(), (cikacakToplamlari.get(stokKodu.toString()) || 0) + kalan);

  }

}



var resultData = [];

for (let i = 1; i < sayimData.length; i++) {

  const row = sayimData[i];

  const stokKodu = row[0] ? row[0].toString() : ''; 

  if (!stokKodu) continue;



  let stokTuru = row[8]; // I Sütunu (Excel'den)

  if (!stokTuru) { // Eğer Excel'den gelmemişse (manuel görüntüleme)

    stokTuru = stokTuruMap.get(stokKodu) || 'Diğer'; 

  }

  

  if (stokTuruFilter === 'Tümü' || stokTuru === stokTuruFilter) {

    const cikacakMiktar = cikacakToplamlari.get(stokKodu) || 0;

    const veresiyeTutar = veresiyeToplamlari.get(stokKodu) || 0; 

    const pesinKKTutar = pesinSatisToplamlari.get(stokKodu) || 0;



    resultData.push({

      originalRow: i + 1,

      stokKodu: stokKodu,       

      stokAdi: row[1],        

      miktarExcel: row[2],    

      mevcut: row[3],         

      veresiye: veresiyeTutar,  

      pesinKK: pesinKKTutar,    

      cikacak: cikacakMiktar, 

      kalanSheet: row[7]      

    });

  }

}



return JSON.stringify({ success: true, data: resultData });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Stok Sayım sayfasındaki belirli hücreleri günceller (Mevcut veya Peşin/KK)

@param {number} rowNum Güncellenecek satır numarası

@param {string} colName Güncellenecek sütun ('D' veya 'F')

@param {number} newValue Yeni değer


*/

// ESKİ updateSayimCell fonksiyonunu SİLİN ve YERİNE BUNU EKLEYİN:

/**

Stok Sayım sayfasındaki bir satırın D, E, F, G, H sütunlarını topluca günceller.

@param {object} rowData Güncellenecek satır numarası ve tüm değerleri içeren nesne.


*/

function updateSayimRow(rowData) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Stok Sayım');



// Verileri ilgili sütunlara yaz

// [Mevcut(D), Veresiye(E), Peşin/KK(F), Çıkacak(G), Kalan(H)]

// Sütun indeksleri: 4, 5, 6, 7, 8

var dataRange = sheet.getRange(rowData.rowNum, 4, 1, 5); // D'den H'ye 5 sütun



dataRange.setValues([[

  rowData.mevcut,

  rowData.veresiye,

  rowData.pesinKK,

  rowData.cikacak,

  rowData.kalan

]]);



return JSON.stringify({ success: true, message: "Satır " + rowData.rowNum + " güncellendi." });

} catch(e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

// YENİ EKLENECEK STOK SAYIM PDF YAZDIRMA FONKSİYONU

/**

HTML tarafından gönderilen filtrelenmiş sayım verisini alır,

'Sayım Yazdırma' sayfasına yapıştırır ve bir A4 PDF URL'si oluşturur.

@param {Array} dataToPrint Yazdırılacak veriyi (başlıklar dahil) içeren 2 boyutlu dizi.

@returns {string} JSON formatında PDF URL'si veya hata mesajı.


*/

// Kod.gs dosyanızdaki createSayimPdf fonksiyonunun tamamını bununla değiştirin.

function createSayimPdf(dataToPrint) {

try {

var ss = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ');

var sheetName = "Sayım Yazdırma"; // Rapor için özel sayfa

var sheet = ss.getSheetByName(sheetName);



if (!sheet) {

  throw new Error("Lütfen E-Tablonuzda 'Sayım Yazdırma' adında boş bir sayfa oluşturun.");

}



sheet.clear(); // Sayfayı tamamen temizle



// Veriyi A1 hücresinden başlayarak yapıştır

sheet.getRange(1, 1, dataToPrint.length, dataToPrint[0].length).setValues(dataToPrint);



// --- GÜNCELLEME BURADA (Sütun Genişlikleri) ---

// İstediğiniz gibi B sütununu (Stok Adı) içeriğine göre otomatik yeniden boyutlandırıyoruz.

// Diğerlerini de hizalı olması için ekliyoruz (A'dan I'ya - 9 sütun)

sheet.autoResizeColumns(1, 9);

// --- GÜNCELLEME SONU ---



// PDF URL'sini oluştur

var spreadsheetId = ss.getId();

var sheetId = sheet.getSheetId();

var printRange = `A1:I${dataToPrint.length}`; // A'dan I'ya (9 sütun)



var pdfUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?` +

  `format=pdf&` +

  `gid=${sheetId}&` +

  `range=${encodeURIComponent(printRange)}&` +

  `size=A4&` +

  

  // --- GÜNCELLEME: DİKEY'den YATAY'a ---

  `portrait=false&` +        // 'true' olan değeri 'false' yaptık (Yatay format)

  // --- GÜNCELLEME SONU ---



  `fitw=true&` +           // Genişliğe sığdır (Yatay A4'e sığdıracak)

  `gridlines=true&` +        

  `printtitle=false&` +

  `sheetnames=false&` +

  `pagenumbers=false&` +



  // --- YENİ EKLENEN DAR KENAR BOŞLUKLARI (0.25 inç) ---

  `top_margin=0.25&` +

  `bottom_margin=0.25&` +

  `left_margin=0.25&` +

  `right_margin=0.25&` +



  `horizontal_alignment=CENTER&` +

  `vertical_alignment=TOP`;

  

return JSON.stringify({ success: true, pdfUrl: pdfUrl });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

// YENİ EKLENECEK PEŞİN SATIŞ FONKSİYONLARI

/**

Peşin Satış sayfasının URL'sini oluşturur.


*/

function getPesinSatisUrl() {

var scriptUrl = ScriptApp.getService().getUrl();

return scriptUrl + '?page=pesinsatis';

}

/**

'Stok Listesi' (A, B) ve 'Fiyat Listesi' (A, C) verilerini tek seferde çeker.


*/

function getStokVeFiyatListesi() {

try {

var stokSheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Stok Listesi');

var fiyatSheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Fiyat Listesi');



// Stok Listesi (A:B)

var stokData = stokSheet.getRange("A2:B" + stokSheet.getLastRow()).getValues();

var stoklar = stokData.filter(row => row[0] !== '').map(row => ({ kod: row[0], ad: row[1] }));



// Fiyat Listesi (A:C)

var fiyatData = fiyatSheet.getRange("A2:C" + fiyatSheet.getLastRow()).getValues();

var fiyatMap = {};

fiyatData.forEach(row => {

  if (row[0] !== '') {

    fiyatMap[row[0].toString()] = row[2]; // Kod -> Fiyat eşlemesi

  }

});



return JSON.stringify({ success: true, stoklar: stoklar, fiyatlar: fiyatMap });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

'Fiyat Listesi' sayfasındaki tek bir ürünün fiyatını günceller veya ekler.


*/

function updateFiyatListesi(stokKodu, yeniFiyat) {

try {

var sheet = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ').getSheetByName('Fiyat Listesi');

var data = sheet.getRange("A:A").getValues();

var satirNumarasi = -1;



for (var i = 1; i < data.length; i++) { // A2'den başlar (index 1)

  if (data[i][0].toString() == stokKodu.toString()) {

    satirNumarasi = i + 1;

    break;

  }

}



if (satirNumarasi === -1) {

  // Bulamazsa, Stok Listesi'nden adı çekip yeni satır olarak ekleyebiliriz

  // Şimdilik sadece bulduğunu güncellesin (daha basit)

  // Veya en sona eklesin

  // En iyisi: A'da bulamazsa C'yi güncelleyemez.

  // Bu yüzden Fiyat Listesi'nde tüm stok kodlarının A sütununda olması gerekir.

   throw new Error("Fiyat Listesi'nde bu stok kodu (" + stokKodu + ") bulunamadı. Lütfen önce oraya ekleyin.");

}



sheet.getRange(satirNumarasi, 3).setValue(yeniFiyat); // C Sütunu

return JSON.stringify({ success: true, message: "Fiyat güncellendi." });

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

// YENİ EKLENECEK PEŞİN SATIŞ KAYIT VE YAZDIRMA FONKSİYONLARI

// Önceki getStokVeFiyatListesi fonksiyonunu güncelliyoruz,

// Artık Peşin Satış sayfasından eski verileri de okuyacak.

function getPesinSatisInitialData() {

try {

var ss = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ');

var stokSheet = ss.getSheetByName('Stok Listesi');

var fiyatSheet = ss.getSheetByName('Fiyat Listesi');

var pesinSheet = ss.getSheetByName('Peşin Satış');



if (!stokSheet || !fiyatSheet || !pesinSheet) {

  throw new Error("Gerekli sayfalardan biri (Stok Listesi, Fiyat Listesi, Peşin Satış) bulunamadı.");

}



// 1. Stok ve Fiyatları Çek

var stokData = stokSheet.getRange("A2:B" + stokSheet.getLastRow()).getValues();

var stoklar = stokData.filter(row => row[0]).map(row => ({ kod: row[0], ad: row[1] }));

var fiyatData = fiyatSheet.getRange("A2:C" + fiyatSheet.getLastRow()).getValues();

var fiyatMap = {};

fiyatData.forEach(row => { if (row[0]) fiyatMap[row[0].toString()] = row[2]; });



// 2. 'Peşin Satış' Sayfasından Mevcut Verileri Çek

// Para Sayıları

var paraAdetleri = pesinSheet.getRange("B4:B12").getValues().flat();

// Kasa Durumu

var kasaBakiyesi = pesinSheet.getRange("E5").getValue();

// Düzeltme Kayıtları

var duzeltmeAciklamalari = pesinSheet.getRange("F3:H12").getValues().map(row => row[0]);

var duzeltmeTutarlari = pesinSheet.getRange("I3:I12").getValues().flat();

// Satış Kayıtları

var satisKayitlari = [];

var lastSatisRow = pesinSheet.getLastRow();

if (lastSatisRow >= 16) {

  var satisData = pesinSheet.getRange("A16:I" + lastSatisRow).getValues();

  satisData.forEach(row => {

    if(row[0]) { // Stok kodu varsa

      satisKayitlari.push({

        stokKodu: row[0], // A

        stokAdi: row[1],  // B (Birleşik hücreden ilkini alır)

        miktar: row[6],   // G

        fiyat: row[7],    // H

        toplam: row[8]    // I

      });

    }

  });

}



return JSON.stringify({ 

  success: true, 

  stoklar: stoklar, 

  fiyatlar: fiyatMap,

  yuklenenVeri: {

    paraAdetleri: paraAdetleri,

    kasaBakiyesi: kasaBakiyesi,

    duzeltmeAciklamalari: duzeltmeAciklamalari,

    duzeltmeTutarlari: duzeltmeTutarlari,

    satisKayitlari: satisKayitlari

  }

});

} catch (e) {

return JSON.stringify({ success: false, message: e.toString() });

}

}

/**

Peşin Satış formundan gelen tüm verileri sayfaya kaydeder.


*/

function kaydetPesinSatis(data) {

try {

var ss = SpreadsheetApp.openById('1nV0BXEUAakoSbhYWVFtDMcjB5COPTsdIyQNNTGtVQjQ');

var sheet = ss.getSheetByName('Peşin Satış');

if (!sheet) throw new Error("'Peşin Satış' sayfası bulunamadı.");



// --- 1. Temizleme (içerikleri temizle, ama mevcut birleşik yapılarına dokunma) ---

sheet.getRange('A1').clearContent();

sheet.getRange('B4:B12').clearContent();

sheet.getRange('C13').clearContent();

sheet.getRange('E3').clearContent();

sheet.getRange('E4').clearContent();

sheet.getRange('E5').clearContent();

sheet.getRange('E6').clearContent();

sheet.getRange('D11').clearContent().setBackground(null).setFontColor(null);

// Düzeltme açıklama ve tutarlar

// temizlerken her hücreyi tek tek temizlemek birleşik hücre hatası vermez.

for (var i = 0; i < 10; i++) {

  sheet.getRange(3 + i, 6, 1, 3).clearContent(); // F? : H? (birleşik aralıkların sol üst hücresi seçilse bile safe)

  sheet.getRange(3 + i, 9).clearContent(); // I sütunu tutarlar

}

sheet.getRange('I13').clearContent();

sheet.getRange('I14').clearContent();



// Satış kayıtları alanını temizle (A16:I...)

if (sheet.getLastRow() >= 16) {

  var oldDataRange = sheet.getRange('A16:I' + sheet.getLastRow());

  oldDataRange.clearContent();

  oldDataRange.setBorder(false, false, false, false, false, false);

}



// --- 2. Başlık ve Genel Alanları Yaz (merge() çağrısı yok, varolan birleşik hücrelerin sol üst hücresine yazıyoruz) ---

sheet.getRange('A1').setValue(data.baslik || '');



// Para adetleri -> B4:B12 (9 satır beklenir). Eğer gelen dizi farklıysa pad/truncate yap.

var adetler = data.paraSayilari && data.paraSayilari.adetler ? data.paraSayilari.adetler : [];

// normalize: adetler her eleman ya [val] veya val olabilir => setValues için 2D array gerekli

var normAdetler = [];

for (var i = 0; i < 9; i++) {

  var v = adetler[i];

  var val = 0;

  if (v === undefined) val = '';

  else if (Array.isArray(v)) val = v[0];

  else val = v;

  normAdetler.push([val]);

}

sheet.getRange('B4:B12').setValues(normAdetler);



// Para toplam -> C13 (C13:C14 birleşikse C13'e yazmak yeterli)

sheet.getRange('C13').setValue(data.paraSayilari && data.paraSayilari.toplam ? data.paraSayilari.toplam : '');



// Kasa alanları

sheet.getRange('E3').setValue(data.kasaDurumu && data.kasaDurumu.nakitSatis ? data.kasaDurumu.nakitSatis : '');

sheet.getRange('E4').setValue(data.kasaDurumu && data.kasaDurumu.kasaToplam ? data.kasaDurumu.kasaToplam : '');

sheet.getRange('E5').setValue(data.kasaDurumu && data.kasaDurumu.kasaBakiyesi ? data.kasaDurumu.kasaBakiyesi : '');

sheet.getRange('E6').setValue(data.kasaDurumu && data.kasaDurumu.durum ? data.kasaDurumu.durum : '');



sheet.getRangeList(['E3','E4','E5','E6','I13','I14','I16:I'])

 .setNumberFormat('₺#,##0.00');



// Açıklama -> D11:E14 birleşik alana yaz (sol üst hücre D11'e)

var aciklamaText = (data.kasaDurumu && data.kasaDurumu.aciklama && data.kasaDurumu.aciklama.text) ? data.kasaDurumu.aciklama.text : '';

sheet.getRange('D11').setValue(aciklamaText);

// arka plan ve renk bilgisi varsa uygula (varsa uyguluyoruz, yoksa temizle)

if (data.kasaDurumu && data.kasaDurumu.aciklama) {

  if (data.kasaDurumu.aciklama.renk) sheet.getRange('D11').setBackground(data.kasaDurumu.aciklama.renk);

  if (data.kasaDurumu.aciklama.yaziRengi) sheet.getRange('D11').setFontColor(data.kasaDurumu.aciklama.yaziRengi);

} else {

  sheet.getRange('D11').setBackground(null).setFontColor(null);

}



// --- 3. Düzeltme Kayıtları ---

// data.duzeltmeKayitlari.aciklamalar beklenen format: [[aciklama],[aciklama],...]

var aciklamalar = (data.duzeltmeKayitlari && data.duzeltmeKayitlari.aciklamalar) ? data.duzeltmeKayitlari.aciklamalar : [];

var tutarlar = (data.duzeltmeKayitlari && data.duzeltmeKayitlari.tutarlar) ? data.duzeltmeKayitlari.tutarlar : [];



for (var i = 0; i < 10; i++) {

  var ac = aciklamalar[i];

  var acVal = '';

  if (ac !== undefined) acVal = Array.isArray(ac) ? ac[0] : ac;

  // F3:H3 -> satır 3+i, sütun 6, satırSayısı=1, sütunSayısı=3

  sheet.getRange(3 + i, 6, 1, 3).setValue(acVal || '');



  var t = tutarlar[i];

  var tVal = '';

  if (t !== undefined) tVal = Array.isArray(t) ? t[0] : t;

  // I3..I12 -> sütun 9

  sheet.getRange(3 + i, 9).setValue(tVal !== undefined ? tVal : '');

}



// Düzeltme toplam ve nakit satış toplam

sheet.getRange('I13').setValue(data.duzeltmeKayitlari && data.duzeltmeKayitlari.toplam ? data.duzeltmeKayitlari.toplam : '');

sheet.getRange('I14').setValue(data.duzeltmeKayitlari && data.duzeltmeKayitlari.nakitSatis ? data.duzeltmeKayitlari.nakitSatis : '');



// --- 4. Satış kayıtlarını yaz ---

var satisler = data.satisKayitlari || [];

var sonSatir = 15;

if (satisler.length > 0) {

  for (var i = 0; i < satisler.length; i++) {

    var s = satisler[i];

    var satir = 16 + i;

    sheet.getRange(satir, 1).setValue(s.stokKodu || '');

    // stok adı B sütununun başladığı birleşik alana yazıyoruz (sol üst hücre B)

    sheet.getRange(satir, 2).setValue(s.stokAdi || '');

    sheet.getRange(satir, 7).setValue(s.miktar || '');

    sheet.getRange(satir, 8).setValue(s.fiyat || '');

    sheet.getRange(satir, 9).setValue(s.toplam || '');

  }

  sonSatir = 15 + satisler.length;



  // Kenarlık ekleme: yalnızca A sütununda dolu olan satırlar için A:I aralığına border ekle

  // Bulunan son dolu satırı tespit et

  var lastDataRow = 15;

  for (var r = 16; r <= sonSatir; r++) {

    var aVal = sheet.getRange(r, 1).getValue();

    if (aVal !== '' && aVal !== null) lastDataRow = r;

  }

  if (lastDataRow >= 16) {

    var rowCount = lastDataRow - 15;

    var kenarlikAraligi = sheet.getRange(16, 1, rowCount, 9); // A..I

    kenarlikAraligi.setBorder(true, true, true, true, true, true, "#444444", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  }

} else {

  // Eğer hiç satış yoksa kenarlık olmamalı; zaten temizledik.

}



// --- 5. PDF Oluşturma ---

var pdfUrl = createPesinSatisPdf(sonSatir);

return JSON.stringify({ success: true, message: "Kasa başarıyla kaydedildi.", pdfUrl: pdfUrl });

} catch (e) {

return JSON.stringify({ success: false, message: "Kayıt sırasında hata oluştu: " + e.toString() });

}

}

/**

Peşin Satış sayfası için dinamik A4 Yatay PDF oluşturur.


*/

function createPesinSatisPdf(lastRow) {

try {

var ss = SpreadsheetApp.getActiveSpreadsheet();

var sheet = ss.getSheetByName('Peşin Satış');

var spreadsheetId = ss.getId();

var sheetId = sheet.getSheetId();

var printRange = `A1:I${lastRow}`; // A'dan I'ya son dolu satıra kadar



var pdfUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?` +

  `format=pdf&` +

  `gid=${sheetId}&` +

  `range=${encodeURIComponent(printRange)}&` +

  `size=A4&` +

  `portrait=false&` + // Yatay

  `fitw=true&` +

  `gridlines=true&` +

  `printtitle=false&` +

  `sheetnames=false&` +

  `pagenumbers=false&` +

  `top_margin=0.25&bottom_margin=0.25&left_margin=0.25&right_margin=0.25&` + // Dar kenar boşlukları

  `horizontal_alignment=CENTER&` +

  `vertical_alignment=TOP`;

  

return pdfUrl;

} catch (e) {

return null;

}

}
