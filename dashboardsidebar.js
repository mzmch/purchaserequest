document.addEventListener('DOMContentLoaded', function () {
  const menuLinks = document.querySelectorAll('.top-menu a[data-content]');
  const userEmailDisplay = document.getElementById('user-email-display');
  const logoutButton = document.getElementById('logout-btn');
  const contentArea = document.getElementById('main-content');
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  if (!loggedInUser) {
    window.location.href = 'index.html';
    return;
  }

  userEmailDisplay.textContent = `Logged in as: ${loggedInUser.email}`;
  loadContent('dashboard');

  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const contentId = this.getAttribute('data-content');
      loadContent(contentId);
    });
  });

  logoutButton.addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  function loadContent(contentId) {
    contentArea.innerHTML = '';

    if (contentId === 'purchase-status') {
      fetchPurchaseStatus();
    } else {
      let contentMap = {
        'dashboard': '<p>This is the dashboard content.</p>',
      };

      contentArea.innerHTML = `<h2>${contentId.replace(/-/g, ' ')}</h2>${contentMap[contentId] || '<p>Not found</p>'}`;
    }
  }

  function fetchPurchaseStatus() {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 30);

    const todayStr = today.toISOString().split('T')[0];
    const pastDateStr = pastDate.toISOString().split('T')[0];

    contentArea.innerHTML = `
      <h2>Purchase Request Status</h2>
      <button id="refreshBtn" style="margin-bottom: 10px;">🔄 Refresh</button>
      <div class="filter-container">
        <label>Status:
          <select id="statusFilter">
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Waiting">Waiting</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <label>Department:
          <select id="deptFilter"><option value="">Loading...</option></select>
        </label>
        <label>Date From:
          <input type="date" id="fromDateFilter" value="${pastDateStr}">
        </label>
        <label>Date To:
          <input type="date" id="toDateFilter" value="${todayStr}">
        </label>
      </div>
      <div class="spinner-container"><div class="spinner"></div></div>
      <div class="table-container" style="display:none;">
        <table class="status-table" id="purchaseTable">
          <thead>
            <tr>
              <th>Request No</th>
              <th>Date</th>
              <th>Item</th>
              <th>Department</th>
              <th>Status</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="modal-overlay" id="detailPopup">
        <div class="modal">
          <button class="close-btn">Close</button>
          <div class="popup-content"></div>
        </div>
      </div>
    `;

    document.getElementById('refreshBtn').addEventListener('click', fetchPurchaseStatus);

    const url = `https://script.google.com/macros/s/AKfycbyfXGcYXnF80MQOvbm8fdHtKrLFxHiusBFf819S-6jXSv00eLq80G4dP07AClMESeh4/exec?email=${loggedInUser.email}`;

    fetch(url)
      .then(res => res.json())
      .then(({ data, departments }) => {
        document.querySelector('.spinner-container').style.display = 'none';
        document.querySelector('.table-container').style.display = 'block';
        populateDeptFilter(departments);
        renderTable(data);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        contentArea.innerHTML += '<p style="color:red;">Error fetching data.</p>';
      });
  }

  function populateDeptFilter(departments) {
    const deptFilter = document.getElementById('deptFilter');
    deptFilter.innerHTML = `<option value="">All Departments</option>`;
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      deptFilter.appendChild(option);
    });
  }

  function renderTable(data) {
    const table = document.getElementById('purchaseTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    const statusFilter = document.getElementById('statusFilter');
    const deptFilter = document.getElementById('deptFilter');
    const fromDateFilter = document.getElementById('fromDateFilter');
    const toDateFilter = document.getElementById('toDateFilter');

    const displayFields = [
      { key: 'FormattedDate', label: 'Date' },
      { key: 'Request Number', label: 'Request No' },
      { key: 'Item', label: 'Item' },
      { key: 'Concern Department', label: 'Department' },
      { key: 'Status', label: 'Status' },
      { key: 'Current Status', label: 'Current Status' }
    ];

    let originalData = data.map(entry => ({
      ...entry,
      FormattedDate: formatDate(entry.Date)
    }));

    originalData.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    thead.innerHTML = '';
    const headerRow = document.createElement('tr');
    displayFields.forEach(field => {
      const th = document.createElement('th');
      th.textContent = field.label;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    function applyFilters() {
      const status = statusFilter.value.toLowerCase();
      const dept = deptFilter.value.toLowerCase();
      const fromDate = new Date(fromDateFilter.value);
      const toDate = new Date(toDateFilter.value);
      tbody.innerHTML = '';

      const filteredData = originalData.filter(item => {
        const itemDate = new Date(item.Date);
        const isInDateRange = itemDate >= fromDate && itemDate <= toDate;
        const isInStatus = !status || item.Status.toLowerCase().includes(status);
        const isInDept = !dept || item['Concern Department'].toLowerCase().includes(dept);

        return isInDateRange && isInStatus && isInDept;
      });

      filteredData.forEach(row => {
        const tr = document.createElement('tr');
        displayFields.forEach(field => {
          const td = document.createElement('td');
          td.textContent = row[field.key];
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }

    applyFilters();
    statusFilter.addEventListener('change', applyFilters);
    deptFilter.addEventListener('change', applyFilters);
    fromDateFilter.addEventListener('input', applyFilters);
    toDateFilter.addEventListener('input', applyFilters);
  }

  function formatDate(date) {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }
});
