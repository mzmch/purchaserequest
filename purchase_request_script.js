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
    progressBar.style.width = '30%';

    const formData = new FormData(form); // Keep using FormData directly

    console.log('FormData being sent:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwHSN9JXJksgUCneZYBBP1DcrMQ0mCqslRW726Bwkb5p2buAZjSNqS9O-qz9MoDrbtm/exec';

    fetch(scriptURL, {
      method: 'POST',
      body: formData
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
