document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.email) {
    console.error("User email not found in localStorage.");
    return;
  }

  const email = encodeURIComponent(user.email);
  const url = `https://script.google.com/macros/s/AKfycbwTdFk8jDaPanN7LF26U3rnbmZ30_lCP0eSiTpE5LZ5nfiWYN5U_y_d7Hv0jkjhgzB4jg/exec?mode=permissions&email=${email}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.allowedMenus && Array.isArray(data.allowedMenus)) {
        data.allowedMenus.forEach(menuName => {
          const menuItem = document.querySelector(`#admin-submenu li[data-menu="${menuName.trim()}"]`);
          if (menuItem) {
            menuItem.style.display = "block";
          }
        });
      } else {
        console.warn("No allowedMenus received or invalid format.");
      }
    })
    .catch(error => {
      console.error("Error fetching permissions:", error);
    });
});
