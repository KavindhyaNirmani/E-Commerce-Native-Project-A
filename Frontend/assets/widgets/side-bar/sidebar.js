class commonSidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <link rel="stylesheet" href="./sidebar.css"/>
        <!-- Sidebar -->
    <div id="sidebar" class="sidebar d-flex flex-column">
      <div class="logo">
        <img
          src="/frontend/assets/images/Yumzy.png"
          alt="Logo"
          class="logo-img" />
      </div>
      <div class="nav-links">
        <a href="/frontend/dashboard.html" class="nav-link">Dashboard</a>
        <a href="/frontend/item-management.html" class="nav-link">Items</a>
        <a href="/frontend/order-management.html" class="nav-link">Orders</a>
        <a href="/frontend/admin-management.html" class="nav-link">Admin</a>
      </div>
    </div>

    <!-- Toggle Button for small screens -->
    <div class="toggle-container">
      <button class="toggle-btn" id="toggleBtn">☰</button>
    </div>
    `;

    $(function () {
      $("#toggleBtn").on("click", function () {
        $("#sidebar").toggleClass("show");
      });

      const currentPage = window.location.pathname;

      const dashboardLink = $('.nav-link[href="/frontend/dashboard.html"]');
      const itemsLink = $('.nav-link[href="/frontend/item-management.html"]');
      const ordersLink = $('.nav-link[href="/frontend/order-management.html"]');
      const adminLink = $('.nav-link[href="/frontend/admin-management.html"]');

      if (currentPage.includes("dashboard.html")) {
        dashboardLink.addClass("active");
      } else if (currentPage.includes("item-management.html")) {
        itemsLink.addClass("active");
      } else if (currentPage.includes("order-management.html")) {
        ordersLink.addClass("active");
      } else if (currentPage.includes("admin-management.html")) {
        adminLink.addClass("active");
      }
    });
  }
}

customElements.define("common-sidebar", commonSidebar);
