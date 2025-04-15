document.addEventListener('DOMContentLoaded', function () {
  const menuLinks = document.querySelectorAll('.top-menu a[data-content]');
  const userEmailDisplay = document.getElementById('user-email-display');
  const logoutButton = document.getElementById('logout-btn');
  const contentArea = document.getElementById('main-content');

  const loggedInUser = localStorage.getItem('user');
  let userEmail = '';
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    userEmail = user.email;
    userEmailDisplay.textContent = `Logged in as: ${user.email}`;
  } else {
    window.location.href = 'index.html';
  }

  loadContent('dashboard');

  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const contentId = this.getAttribute('data-content');
      if (contentId === 'purchase-new') {
        window.location.href = 'purchaserequest.html';
      } else {
        loadContent(contentId);
      }
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

    case 'purchase-status':
      title = 'Purchase Request Status';
      content = '<p>Loading your purchase requests...</p>';
      contentArea.innerHTML = `<h2>${title}</h2>${content}`;

      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      if (loggedInUser && loggedInUser.email) {
        const scriptUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYED_URL/exec'; // replace this
        fetch(`${scriptUrl}?email=${loggedInUser.email}`)
          .then(res => res.text())
          .then(html => {
            contentArea.innerHTML = `<h2>${title}</h2>${html}`;
          })
          .catch(err => {
            contentArea.innerHTML = `<h2>${title}</h2><p>Error loading data.</p>`;
            console.error(err);
          });
      } else {
        contentArea.innerHTML = `<h2>${title}</h2><p>User not logged in.</p>`;
      }
      return; // exit the function early to prevent overwriting
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

  contentArea.innerHTML = `<h2>${title}</h2>${content}`;
}


  

  function fetchPurchaseStatus() {
    const sheetUrl = 'https://script.google.com/macros/s/AKfycbxy7PFHunk4w5DOXf-fkCVW-opzDOVE9curj1gdf4IBU_-bUf6_74eDDmv43QM1wNIG/exec'; // Replace with your Web App URL
    fetch(`${sheetUrl}?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        renderTable(data);
        setupFilters(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }

  function renderTable(data) {
    const tbody = document.querySelector('#purchaseTable tbody');
    tbody.innerHTML = '';

    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.Date}</td>
        <td>${row.Item}</td>
        <td>${row.Status}</td>
      `;
      tr.classList.add(getStatusClass(row.Status));
      tr.addEventListener('click', () => showPopup(row));
      tbody.appendChild(tr);
    });
  }

  function getStatusClass(status) {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'waiting': return 'status-waiting';
      default: return '';
    }
  }

  function setupFilters(data) {
    document.getElementById('statusFilter').addEventListener('change', () => applyFilters(data));
    document.getElementById('dateFilter').addEventListener('input', () => applyFilters(data));
    document.getElementById('departmentFilter').addEventListener('input', () => applyFilters(data));
  }

  function applyFilters(data) {
    const status = document.getElementById('statusFilter').value.toLowerCase();
    const date = document.getElementById('dateFilter').value;
    const department = document.getElementById('departmentFilter').value.toLowerCase();

    const filtered = data.filter(row => {
      return (!status || row.Status.toLowerCase() === status) &&
             (!date || row.Date === date) &&
             (!department || row['Concern Department'].toLowerCase().includes(department));
    });

    renderTable(filtered);
  }

  function showPopup(row) {
    const popup = document.getElementById('popup');
    popup.innerHTML = `
      <div class="popup-content">
        <h3>Request Details</h3>
        <p><strong>Date:</strong> ${row.Date}</p>
        <p><strong>Item:</strong> ${row.Item}</p>
        <p><strong>Specification:</strong> ${row.Specification}</p>
        <p><strong>Estimated Cost:</strong> ${row['Estimated cost']}</p>
        <p><strong>Total Cost:</strong> ${row['Total Cost']}</p>
        <p><strong>Justification:</strong> ${row.Justification}</p>
        <p><strong>Vendor:</strong> ${row.Vendor}</p>
        <p><strong>Vendor Contact:</strong> ${row['Vendor Contact']}</p>
        <p><strong>Reason for Preference:</strong> ${row['Reason for Preference']}</p>
        <p><strong>Request Number:</strong> ${row['Request Number']}</p>
        <p><strong>Status:</strong> ${row.Status}</p>
        <p><strong>Approved By:</strong> ${row['Approved By']}</p>
        <p><strong>Approved At:</strong> ${row['Approved at']}</p>
        <p><strong>Approval Notes:</strong> ${row['Approval Notes']}</p>
        <p><strong>Concern Department:</strong> ${row['Concern Department']}</p>
        <button onclick="document.getElementById('popup').style.display='none'">Close</button>
      </div>
    `;
    popup.style.display = 'block';
  }

  logoutButton.addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });
});
