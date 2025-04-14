const scriptURL = 'https://script.google.com/macros/s/AKfycbygbzFiEqeMpoTwZ3GLBTJOam9AykRKxdDgsS5zhAuGsTEcc85tks44Bxf-N0SLMCWn/exec'; // Replace with your actual script URL
const form = document.getElementById('purchase-form');
const status = document.getElementById('status');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBar = document.getElementById('progress-bar');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    status.innerText = ''; // Clear previous status
    progressBarContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressBar.innerText = '0%';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

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
            progressBar.style.width = progress + '%';
            progressBar.innerText = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                return response.json();
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
});
