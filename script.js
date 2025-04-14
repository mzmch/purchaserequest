const scriptURL = 'https://script.google.com/macros/s/AKfycbw2iQJNxZuqxU3lSOUKFkWiiftkH7GgF3lWdfLRjf4BNkSe_WTuDNcF7Pq_RE3nQdF53A/exec';
const form = document.getElementById('purchase-form');
const status = document.getElementById('status');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            status.innerText = "Request submitted successfully!";
            form.reset();
        } else {
            status.innerText = "Something went wrong.";
        }
    })
    .catch(error => {
        status.innerText = "Error: " + error.message;
    });
});
