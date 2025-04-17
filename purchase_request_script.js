const scriptURL = 'https://script.google.com/macros/s/AKfycby_DcCVU9tvGM5lnfXDiE46iJCZZosiTVuWlj815H35RlSAuNC6T8Z9nxEGQffYMlHwnw/exec';
const form = document.getElementById('purchase-form');
const status = document.getElementById('status');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBar = document.getElementById('progress-bar');
const departmentDropdown = document.getElementById('department-dropdown');
const concernDeptDropdown = document.getElementById('concern-dept-dropdown');

// Load dropdowns from script
window.addEventListener('DOMContentLoaded', () => {
  fetch(scriptURL)
    .then(response => response.json())
    .then(data => {
      if (data.departments) {
        departmentDropdown.innerHTML = '<option value="">Select Department</option>';
        data.departments.forEach(dept => {
          departmentDropdown.innerHTML += `<option value="${dept}">${dept}</option>`;
        });
      }
      if (data.concernDepartments) {
        concernDeptDropdown.innerHTML = '<option value="">Select Concern Department</option>';
        data.concernDepartments.forEach(dept => {
          concernDeptDropdown.innerHTML += `<option value="${dept}">${dept}</option>`;
        });
      }
    })
    .catch(error => {
      console.error('Error loading departments:', error);
    });
});

// Helper function to fetch the concern department email
function getConcernDeptEmail(concernDeptName) {
  return fetch(`${scriptURL}?concernDept=${concernDeptName}`)
    .then(response => response.json())
    .then(data => data.email)
    .catch(error => {
      console.error('Error fetching concern department email:', error);
      return '';
    });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  status.innerText = '';
  progressBarContainer.style.display = 'block';
  progressBar.style.width = '0%';
  progressBar.innerText = '0%';

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const concernDeptName = data.concern_department;

  // Fetch concern department email before submitting the form
  getConcernDeptEmail(concernDeptName).then(concernDeptEmail => {
    if (concernDeptEmail) {
      // Add the concern department email to the data
      data.concern_dept_email = concernDeptEmail;

      // Submit the form data with the concern department email
      fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          progressBar.style.width = `${progress}%`;
          progressBar.innerText = `${progress}%`;
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 100);

        return response.json();
      })
      .then(data => {
        progressBarContainer.style.display = 'none';
        if (data.result === "success") {
          status.innerText = "Request submitted successfully!";
          form.reset();
        } else {
          status.innerText = "Something went wrong.";
        }
      })
      .catch(error => {
        progressBarContainer.style.display = 'none';
        status.innerText = "Error: " + error.message;
      });
    } else {
      progressBarContainer.style.display = 'none';
      status.innerText = "Error: Concern Department Email not found.";
    }
  });
});
