// purchase_request_script.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('purchase-form');
    const statusDiv = document.getElementById('status');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        statusDiv.innerText = 'Submitting request...';
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '30%'; // Initial progress

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            // Map HTML input names to the keys expected by the doPost function
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
                    data['Estimated cost'] = value;
                    break;
                case 'total_cost':
                    data['Total Cost'] = value;
                    break;
                case 'justification':
                    data.Justification = value;
                    break;
                case 'vendor_name':
                    data.Vendor = value;
                    break;
                case 'vendor_contact':
                    data['Vendor Contact'] = value;
                    break;
                case 'vendor_reason':
                    data['Reason for Preference'] = value;
                    break;
                case 'concern_department':
                    data['Concern Department'] = value;
                    break;
                default:
                    console.warn('Unknown form field:', key);
            }
        });

        console.log('Data being sent:', data); // Log the data before sending

        const scriptURL = 'https://script.google.com/macros/s/AKfycbzODquzKeh0Qxu6t2y1g-jaWIx-rc8aVSL0-ekjBf7foHkd_EHkw5_Djz9nap92QcGfbQ/exec'; // Ensure this is your correct script URL

        fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            progressBar.style.width = '100%';
            statusDiv.innerText = `Request submitted successfully! Your Request Number is: ${result.requestNumber}`;
            form.reset();
            setTimeout(() => {
                progressBarContainer.style.display = 'none';
                progressBar.style.width = '0%';
                statusDiv.innerText = '';
            }, 5000); // Clear status after 5 seconds
        })
        .catch(error => {
            console.error('Error!', error);
            progressBar.style.width = '100%';
            progressBar.style.backgroundColor = '#f44336'; // Indicate error color
            statusDiv.innerText = 'An error occurred while submitting the request.';
            setTimeout(() => {
                progressBarContainer.style.display = 'none';
                progressBar.style.width = '0%';
                progressBar.style.backgroundColor = '#4caf50'; // Reset color
                statusDiv.innerText = '';
            }, 5000);
        });
    });
});
