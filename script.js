function handleLogoError(img) {
  img.style.display = 'none';
}

function toggleMenuCard(menuHeader) {
  const menuCard = menuHeader.parentElement;
  const allMenuCards = document.querySelectorAll('.menu-card');
  allMenuCards.forEach(card => {
    if (card !== menuCard) card.classList.remove('active');
  });
  menuCard.classList.toggle('active');
}

function navigate(page) {
  window.location.href = page;
}

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loadingScreen').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('loadingScreen').style.display = 'none';
      document.getElementById('mainScreen').style.display = 'block';
    }, 500);
  }, 1500);
});
