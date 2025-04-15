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
        'leave-apply': '<p>Content for applying leave.</p>',
        'leave-status': '<p>Your leave request status.</p>',
        'leave-history': '<p>Past leave requests.</p>',
        'purchase-history': '<p>Past purchase requests.</p>',
        'service-new': '<p>Create a new service request.</p>',
        'service-status': '<p>Status of your service requests.</p>',
        'service-history': '<p>Past service requests.</p>',
      };

      contentArea.innerHTML = `<h2>${contentId.replace(/-/g, ' ')}</h2>${contentMap[contentId] || '<p>Not found</p>'}`;
    }
  }

  function fetchPurchaseStatus() {
    contentArea.innerHTML = `<h2>Purchase Request Status</h2>
      <div class="filters">
        <label>Status:
          <select id="statusFilter">
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Waiting">Waiting</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <label>Department:
          <input type="text" id="deptFilter" placeholder="Concern Department" />
        </label>
        <label>Date:
          <input type="date" id="dateFilter" />
        </label>
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
      <div id="detailPopup" class="popup hidden">
        <div class="popup-content"></div>
        <button class="close-popup">Close</button>
      </div>
    `;

    const url = `https://script.google.com/macros/s/AKfycbzckQ0YY_pwpfWLtb0hQjOgS58cwfi0YX0iSFuCXc7dQLIeI_nZGyT0NpG2Az4dcIFZ/exec?email=${loggedInUser.email}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => renderTable(data))
      .catch(err => {
        console.error('Fetch error:', err);
        contentArea.innerHTML += '<p style="color:red;">Error fetching data.</p>';
      });
  }

  function renderTable(data) {
    const tbody = document.querySelector('#purchaseTable tbody');
    const statusFilter = document.getElementById('statusFilter');
    const deptFilter = document.getElementById('deptFilter');
    const dateFilter = document.getElementById('dateFilter');

    const applyFilters = () => {
      const status = statusFilter.value.toLowerCase();
      const dept = deptFilter.value.toLowerCase();
      const date = dateFilter.value;

      tbody.innerHTML = '';

      data.forEach(row => {
        const matchesStatus = !status || row.Status.toLowerCase() === status;
        const matchesDept = !dept || row['Concern Department'].toLowerCase().includes(dept);
        const matchesDate = !date || row.Date === date;

        if (matchesStatus && matchesDept && matchesDate) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${row.Date}</td><td>${row.Item}</td><td>${row.Status}</td>`;
          tr.className = `status-${row.Status.toLowerCase()}`;
          tr.addEventListener('click', () => showDetails(row));
          tbody.appendChild(tr);
        }
      });
    };

    [statusFilter, deptFilter, dateFilter].forEach(filter => {
      filter.addEventListener('input', applyFilters);
    });

    applyFilters(); // Initial render
  }

  function showDetails(row) {
    const popup = document.getElementById('detailPopup');
    const content = popup.querySelector('.popup-content');
    popup.classList.remove('hidden');
    content.innerHTML = `
      <h3>Request Details</h3>
      ${Object.entries(row).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
    `;
    popup.querySelector('.close-popup').onclick = () => popup.classList.add('hidden');
  }
});
