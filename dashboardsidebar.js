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
      case 'purchase-status':
        title = 'Purchase Request Status';
        content = `
          <div id="filters">
            <label>Status: 
              <select id="statusFilter">
                <option value="">All</option>
                <option value="Approved">Approved</option>
                <option value="Waiting">Waiting</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>
            <label>Date: <input type="date" id="dateFilter" /></label>
            <label>Concern Department: <input type="text" id="departmentFilter" placeholder="Department" /></label>
          </div>
          <table id="purchaseTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div id="popup" class="popup" style="display:none;"></div>
        `;
        contentArea.innerHTML = `<h2>${title}</h2>${content}`;
        fetchPurchaseStatus();
        break;

      default:
        title = contentId.charAt(0).toUpperCase() + contentId.slice(1).replace('-', ' ');
        content = `<p>This is the ${title} content.</p>`;
        contentArea.innerHTML = `<h2>${title}</h2>${content}`;
    }
  }

  function fetchPurchaseStatus() {
    const sheetUrl = 'YOUR_WEB_APP_URL'; // Replace with your Web App URL
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
