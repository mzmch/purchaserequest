document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.toggle-button');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');
    const menuItemsWithSubmenu = document.querySelectorAll('.has-submenu > a');
    const openSubmenus = document.querySelectorAll('.has-submenu.open');
    const contentArea = document.querySelector('.content');
    const menuLinks = document.querySelectorAll('.menu a');
    const userEmailDisplay = document.getElementById('user-email-display');
    const logoutButton = document.getElementById('logout-btn');

    // 📱 Utility function for mobile check
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // 📱 Collapse sidebar by default on mobile
    if (isMobile()) {
        sidebar.classList.add('collapsed');
        openSubmenus.forEach(submenu => submenu.classList.remove('open'));
    }

    // ☰ Toggle button click handler
    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');

        // Show or hide overlay on mobile
        if (isMobile()) {
            overlay.style.display = sidebar.classList.contains('collapsed') ? 'block' : 'none';
        }
    });

    // 🧱 Overlay click closes sidebar
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('collapsed');
        overlay.style.display = 'none';
    });

    // 📁 Menu with submenu click toggle
    menuItemsWithSubmenu.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const parentLi = this.parentNode;

            // Close other open submenu
            const currentlyOpen = document.querySelector('.has-submenu.open');
            if (currentlyOpen && currentlyOpen !== parentLi) {
                currentlyOpen.classList.remove('open');
            }

            // Toggle current submenu
            parentLi.classList.toggle('open');
        });
    });

    // 📄 Load content dynamically
    function loadContent(contentId) {
        let title = '';
        let content = '';

        switch (contentId) {
            case 'dashboard':
                title = 'Dashboard';
                content = '<p>This is the dashboard content.</p>';
                break;
            case 'leave-apply':
                title = 'Apply Leave';
                content = '<p>Content for applying leave.</p>';
                break;
            case 'leave-status':
                title = 'Leave Status';
                content = '<p>Your leave request status.</p>';
                break;
            case 'leave-history':
                title = 'Leave History';
                content = '<p>Past leave requests.</p>';
                break;
            case 'purchase-status':
                title = 'Purchase Request Status';
                content = '<p>Status of your purchase requests.</p>';
                break;
            case 'purchase-history':
                title = 'Purchase Request History';
                content = '<p>Past purchase requests.</p>';
                break;
            case 'service-new':
                title = 'New Service Request';
                content = '<p>Create a new service request.</p>';
                break;
            case 'service-status':
                title = 'Service Request Status';
                content = '<p>Status of your service requests.</p>';
                break;
            case 'service-history':
                title = 'Service Request History';
                content = '<p>Past service requests.</p>';
                break;
            default:
                title = 'Dashboard';
                content = '<p>This is the default dashboard content.</p>';
        }

        contentArea.innerHTML = `<h1>${title}</h1>${content}`;
    }

    // 🏠 Initial load
    loadContent('dashboard');

    // 🔗 Link click load
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const contentId = this.getAttribute('data-content');

            if (contentId === 'purchase-new') {
                window.location.href = 'purchaserequest.html';
            } else {
                loadContent(contentId);

                // Hide sidebar and overlay on mobile after selection
                if (isMobile()) {
                    sidebar.classList.remove('collapsed');
                    overlay.style.display = 'none';
                }
            }
        });
    });

    // 👤 Display logged in user
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        userEmailDisplay.textContent = `Logged in as: ${user.email}`;
    } else {
        window.location.href = 'index.html';
    }

    // 🚪 Logout
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});
