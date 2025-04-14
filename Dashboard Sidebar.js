document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.toggle-button');
    const sidebar = document.querySelector('.sidebar');
    const menuItemsWithSubmenu = document.querySelectorAll('.has-submenu > a');
    const contentArea = document.querySelector('.content');
    const menuLinks = document.querySelectorAll('.menu a');

    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    menuItemsWithSubmenu.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const parentLi = this.parentNode;
            parentLi.classList.toggle('open');
        });
    });

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
            case 'purchase-new':
                title = 'New Purchase Request';
                content = '<p>Create a new purchase request.</p>';
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
                break;
        }

        contentArea.innerHTML = `<h1>${title}</h1>${content}`;
    }

    // Load Dashboard content on page load
    loadContent('dashboard');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const contentId = this.getAttribute('data-content');
            loadContent(contentId);
        });
    });
});
