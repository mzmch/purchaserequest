function toggleMenu() {
  const menu = document.getElementById('menuItems');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function loadContent(contentId) {
  const contentDiv = document.getElementById('mobile-content');
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
      content = '<p>This is the dashboard content.</p>';
  }

  contentDiv.innerHTML = `<h2>${title}</h2>${content}`;
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

