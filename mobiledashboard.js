document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle-button');
    const sidebar = document.getElementById('sidebar');
    const menuItemsWithSubmenu = document.querySelectorAll('.has-submenu > a');

    // Toggle sidebar visibility
    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
    });

    // Handle submenu toggle, ensuring only one submenu opens at a time
    menuItemsWithSubmenu.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const parentLi = this.parentElement;

            // Collapse all other submenus
            document.querySelectorAll('.has-submenu').forEach(li => {
                if (li !== parentLi) {
                    li.classList.remove('open');
                }
            });

            // Toggle the clicked submenu
            parentLi.classList.toggle('open');
        });
    });

    // Optional: Handle submenu link clicks (You can add your own logic here)
    const submenuLinks = document.querySelectorAll('.submenu a');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            alert(`You clicked on: ${this.textContent}`);
        });
    });
});
