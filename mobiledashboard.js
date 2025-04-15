// Toggle the main menu visibility
document.getElementById('menu-toggle').addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
});

// Submenu toggle logic — only one open at a time
document.querySelectorAll('.menu-item > a').forEach(menuLink => {
  menuLink.addEventListener('click', e => {
    e.preventDefault();
    const clickedSubmenu = menuLink.nextElementSibling;

    // Close other open submenus
    document.querySelectorAll('.submenu').forEach(sub => {
      if (sub !== clickedSubmenu) sub.style.display = 'none';
    });

    // Toggle current submenu
    if (clickedSubmenu) {
      clickedSubmenu.style.display =
        clickedSubmenu.style.display === 'block' ? 'none' : 'block';
    }
  });
});

// Display user email from localStorage
const user = JSON.parse(localStorage.getItem('user'));
if (user && user.email) {
  document.getElementById('user-email-display').textContent = user.email;
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = 'login.html'; // Adjust if your login file name is different
});
