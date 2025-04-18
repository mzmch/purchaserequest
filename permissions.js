// Function to check if the user info label has been populated
function waitForUserInfo() {
  const userEmailLabel = document.getElementById('user-email-display');
  
  if (userEmailLabel && userEmailLabel.textContent) {
    // If the label has email text, proceed to check permissions
    const email = userEmailLabel.textContent.trim();
    if (email) {
      fetchPermissions(email);
    }
  } else {
    // If the label is empty or not populated, retry after 500ms
    setTimeout(waitForUserInfo, 500);
  }
}

// Function to fetch permissions
function fetchPermissions(email) {
  const apiUrl = `https://script.google.com/macros/s/AKfycbwTdFk8jDaPanN7LF26U3rnbmZ30_lCP0eSiTpE5LZ5nfiWYN5U_y_d7Hv0jkjhgzB4jg/exec?mode=permissions&email=${email}`;

  // Fetch permissions from the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Handle the response here
      if (data.allowedMenus) {
        console.log("Allowed Menus:", data.allowedMenus);
        // Show/hide menu items based on permissions
        toggleMenuVisibility(data.allowedMenus);
      } else {
        console.log("No permissions found for this user.");
      }
    })
    .catch(error => {
      console.error("Error fetching permissions:", error);
    });
}

// Function to toggle menu visibility based on allowed menus
function toggleMenuVisibility(allowedMenus) {
  // Find the submenu under the Admin menu
  const adminSubmenu = document.querySelector('.admin-submenu');
  
  // Make the Admin submenu visible (if user has access)
  if (allowedMenus.includes('Admin')) {
    adminSubmenu.style.display = 'block';  // Show Admin submenu
  }
  
  // Loop through each submenu item under the Admin menu
  const submenuItems = adminSubmenu.querySelectorAll('.submenu-item');
  
  submenuItems.forEach(item => {
    const menuId = item.id;  // Get the submenu item id, e.g., 'IT', 'HRD', etc.
    
    if (allowedMenus.includes(menuId)) {
      item.style.display = 'block';  // Show the submenu item if allowed
    } else {
      item.style.display = 'none';  // Hide the submenu item if not allowed
    }
  });
}


// Wait for the user email to be populated in the label
waitForUserInfo();
