// DepoTech Minimal İstemci Mantığı
// Bu sürüm yalnızca index.html ve login.html sayfalarını destekler.

const allowedPages = new Set(['', 'index.html', 'login.html']);
const userDatabase = {
  'Okan Kotan': 'Okan123',
  'Alper Taşçı': 'Alper321',
  'Kübra Delisoy': 'Kübra456',
  'Ünsal Ünal': 'Ünsal654',
  'Ömer Yüzgeç': 'Ömer789'
};

function getCurrentPage() {
  return window.location.pathname.split('/').pop();
}

function enforcePageAccess() {
  const page = getCurrentPage();
  if (!allowedPages.has(page)) {
    window.location.replace('index.html');
  }
}

function requireAuthentication() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.replace('login.html');
  }
  return currentUser;
}

function populateLoginUsers() {
  const select = document.getElementById('loginUsername');
  if (!select) return;

  Object.keys(userDatabase).forEach((name) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function handleLogin() {
  const username = document.getElementById('loginUsername')?.value || '';
  const password = document.getElementById('loginPassword')?.value || '';

  if (!username || !password) {
    showLoginError('Lütfen kullanıcı adı ve şifre giriniz.');
    return;
  }

  const expectedPassword = userDatabase[username];
  if (expectedPassword && expectedPassword === password) {
    localStorage.setItem('currentUser', username);
    localStorage.setItem('currentUserEmail', username);
    localStorage.setItem('lastLoginTime', new Date().toISOString());
    window.location.replace('index.html');
  } else {
    showLoginError('Kullanıcı adı veya şifre hatalı.');
  }
}

function showLoginError(message) {
  const errorBox = document.getElementById('loginError');
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.style.display = 'block';
}

function handleLogout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserEmail');
  localStorage.removeItem('lastLoginTime');
  window.location.replace('login.html');
}

function toggleMenu(button) {
  const list = button?.nextElementSibling;
  if (!list) return;
  list.style.display = list.style.display === 'block' ? 'none' : 'block';
}

function disableUnavailableMenus() {
  document.querySelectorAll('.menu-group ul').forEach((list) => {
    list.innerHTML = '<li class="disabled">Bu özellik devre dışı bırakıldı.</li>';
  });
}

function updateIndexInfo(currentUser) {
  const dateElement = document.getElementById('date');
  if (dateElement) {
    const formatter = new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    dateElement.textContent = formatter.format(new Date());
  }

  const welcome = document.createElement('div');
  welcome.className = 'welcome-banner';
  welcome.textContent = `Hoş geldin ${currentUser}! DepoTech sadece ana panelde kullanılabilir.`;

  const header = document.querySelector('.header');
  if (header && !document.querySelector('.welcome-banner')) {
    header.appendChild(welcome);
  }
}

function revealIndexLayout() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainScreen = document.getElementById('mainScreen');
  if (loadingScreen) loadingScreen.style.display = 'none';
  if (mainScreen) mainScreen.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  enforcePageAccess();
  const page = getCurrentPage();

  if (page === 'login.html') {
    populateLoginUsers();
    return;
  }

  const currentUser = requireAuthentication();
  if (page === 'index.html') {
    disableUnavailableMenus();
    updateIndexInfo(currentUser);
    revealIndexLayout();
  }
});

window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.toggleMenu = toggleMenu;
