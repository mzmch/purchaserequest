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
    contentArea.innerHTML = `
      <h2>Purchase Request Status</h2>
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
        <label>Date:
          <input type="date" id="dateFilter">
        </label>
      </div>
      <div class="table-container">
        <table class="status-table" id="purchaseTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Status</th>
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

    const url = `https://script.google.com/macros/s/AKfycbx2noq0JxrRtmxTlHkt76MXftUGQdfAwzD6rbyF8PDlFvnXiQzX1i6pg9k2VS8Sc8YM/exec?email=${loggedInUser.email}`;

    fetch(url)
      .then(res => res.json())
      .then(({ data, departments }) => {
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
    const tbody = document.querySelector('#purchaseTable tbody');
    const statusFilter = document.getElementById('statusFilter');
    const deptFilter = document.getElementById('deptFilter');
    const dateFilter = document.getElementById('dateFilter');

    let originalData = data.map(entry => ({
      ...entry,
      FormattedDate: formatDate(entry.Date)
    }));

    function applyFilters() {
      const status = statusFilter.value.toLowerCase();
      const dept = deptFilter.value.toLowerCase();
      const date = dateFilter.value;

      tbody.innerHTML = '';

      originalData.forEach(row => {
        const rowDate = new Date(row.Date);
        const formattedDateOnly = rowDate.toISOString().split('T')[0];

        const matchesStatus = !status || row.Status.toLowerCase() === status;
        const matchesDept = !dept || row['ConcernDepartment'].toLowerCase().includes(dept);
        const matchesDate = !date || date === formattedDateOnly;

        if (matchesStatus && matchesDept && matchesDate) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${row.FormattedDate}</td><td>${row.Item}</td><td>${row.Status}</td>`;
          tr.className = `status-${row.Status.toLowerCase()}`;
          tr.addEventListener('click', () => showDetails(row));
          tbody.appendChild(tr);
        }
      });
    }

    [statusFilter, deptFilter, dateFilter].forEach(filter => {
      filter.addEventListener('input', applyFilters);
    });

    applyFilters();
  }

  function formatDate(rawDate) {
    const date = new Date(rawDate);
    if (isNaN(date)) return rawDate;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    const time = `${hours}:${minutes} ${ampm}`;

    return `${day}-${month}-${year} ${time}`;
  }

  function showDetails(row) {
    const popup = document.getElementById('detailPopup');
    const content = popup.querySelector('.popup-content');
    content.innerHTML = `
      <h3>Request Details</h3>
      <table>
        ${Object.entries(row).map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`).join('')}
      </table>
    `;
    popup.style.display = 'flex';
    popup.querySelector('.close-btn').onclick = () => {
      popup.style.display = 'none';
    };
  }
});
