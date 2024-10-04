class commonSidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = ` <!--Sidebar-->
    <link rel="stylesheet" href="../Sidebar/sidebar.css">
    <div class="sidebar d-flex flex-column" id="sidebar">
  <div class="logo">
    <img src="../../Assets/Logo.png" alt="Logo" class="logo-img" />
  </div>
  <div class="nav-links">
    <a href="../Admin List/dash.html" class="nav-link">Dashboard</a>
    <a href="../Admin List/item.html" class="nav-link">Items</a>
    <a href="../Admin List/order.html" class="nav-link">Orders</a>
    <a href="../Admin List/Admin.html" class="nav-link">Admin</a>
  </div>
</div>

<!-- Toggle Button for small screens -->
    <div class="toggle-container">
      <button class="toggle-btn" id="toggleBtn">☰</button>
    </div>`;

    //Toggle button for small screens
    const toggleBtn = document.getElementById("toggleBtn");
    const sidebar = document.getElementById("sidebar");

    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("show");
    });

    document.addEventListener("DOMContentLoaded", function () {
      const currentPage = window.location.pathname;

      //sidebar link elements
      const dashboardLink = document.querySelector(
        '.nav-link[href="../Admin List/dash.html"]'
      );
      const itemsLink = document.querySelector(
        '.nav-link[href="../Admin List/item.html"]'
      );
      const ordersLink = document.querySelector(
        '.nav-link[href="../Admin List/order.html"]'
      );
      const adminLink = document.querySelector(
        '.nav-link[href="../Admin List/Admin.html"]'
      );

      //active curent page
      if (currentPage.includes("dash.html")) {
        dashboardLink.classList.add("active");
      } else if (currentPage.includes("item.html")) {
        itemsLink.classList.add("active");
      } else if (currentPage.includes("order.html")) {
        ordersLink.classList.add("active");
      } else if (currentPage.includes("Admin.html")) {
        adminLink.classList.add("active");
      }
    });
  }
}
customElements.define("common-sidebar", commonSidebar);
