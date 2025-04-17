// purchase_request_script.js

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('purchase-form');
  const statusDiv = document.getElementById('status');
  const progressBarContainer = document.getElementById('progress-bar-container');
  const progressBar = document.getElementById('progress-bar');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    statusDiv.innerText = 'Submitting request...';
    progressBarContainer.style.display = 'block';
    progressBar.style.width = '30%'; // Initial progress

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      switch (key) {
        case 'name':
          data.Name = value;
          break;
        case 'department':
          data.Department = value;
          break;
        case 'mobile':
          data.Mobile = value;
          break;
        case 'email':
          data.Email = value;
          break;
        case 'item_description':
          data.Item = value;
          break;
        case 'specification':
          data.Specification = value;
          break;
        case 'estimated_cost':
          data.estimated_cost = value;
          break;
        case 'total_cost':
          data.total_cost = value;
          break;
        case 'justification':
          data.justification = value;
          break;
        case 'vendor_name':
          data.vendor_name = value;
          break;
        case 'vendor_contact':
          data.vendor_contact = value;
          break;
        case 'vendor_reason':
          data.vendor_reason = value;
          break;
        case 'concern_department':
          data.concern_department = value;
          break;
        default:
          console.warn('Unknown form field:', key);
      }
    });

    console.log('Data being sent:', data);

    const scriptURL = 'https://script.google.com/macros/s/AKfycbx3Cm-ajb44ZunKaOGM4WDt6OABSITpTI23gq0sGkh9CnCjAGerWN50ztt4onlj17-B/exec';

    fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(result => {
        console.log('Success:', result);
        progressBar.style.width = '100%';
        statusDiv.innerText = `Request submitted successfully! Your Request Number is: ${result.requestNumber}`;
        form.reset();
        setTimeout(() => {
          progressBarContainer.style.display = 'none';
          progressBar.style.width = '0%';
          statusDiv.innerText = '';
        }, 5000);
      })
      .catch(error => {
        console.error('Error!', error);
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = '#f44336';
        statusDiv.innerText = 'An error occurred while submitting the request.';
        setTimeout(() => {
          progressBarContainer.style.display = 'none';
          progressBar.style.width = '0%';
          progressBar.style.backgroundColor = '#4caf50';
          statusDiv.innerText = '';
        }, 5000);
      });
  });
});
