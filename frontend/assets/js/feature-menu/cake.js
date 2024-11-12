$(document).ready(function () {
  // Header
  axios
    .get("./assets/widgets/header.html")
    .then((response) => {
      $("#headerPlaceholder").html(response.data);
      $("#offcanvasNavbar").css("background-color", "black");
    })
    .catch((error) => console.error("Error loading header:", error));

  // Footer
  axios
    .get("./assets/widgets/footer.html")
    .then((response) => {
      $("#footerPlaceholder").html(response.data);
    })
    .catch((error) => console.error("Error loading footer:", error));

  //Cake menu data and limit
  let allCakeData = [];
  let cakeLimit = 3;

  axios
    .get("https://ecom-back-t1.netfy.app/api/items/category/cake")
    .then((response) => {
      allCakeData = response.data;
      displayCakeItems(allCakeData.slice(0, cakeLimit));
    })
    .catch((error) => console.error("Error loading menu data:", error));

  // Display cake items on the page
  function displayCakeItems(items) {
    const $menu = $("#cakeMenu");
    items.forEach((item) => {
      const menuItem = $(`
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="card-container">
              <div class="food-card">
                <div class="image-container">
                  <img src="https://ecom-back-t1.netfy.app${
                    item.item_image
                  }" alt="${item.item_name}">
                  <div class="overlay"><p>${item.item_description}</p></div>
                </div>
                <div class="item-name"><h5>${item.item_name}</h5></div>
                <div class="item-price"><h6>Rs: ${item.item_price}</h6></div>
                <button class="order-btn" data-item='${JSON.stringify(
                  item
                )}'>Order Now</button>
              </div>
            </div>
          </div>
        `);
      $menu.append(menuItem);
    });

    $(".order-btn").on("click", handleAddToCart);
  }

  // Load more items
  $("#viewMoreBtn").on("click", function () {
    const additionalItems = allCakeData.slice(cakeLimit, cakeLimit + 8);
    displayCakeItems(additionalItems);
    cakeLimit += 8;
    if (cakeLimit >= allCakeData.length) {
      $("#viewMoreBtn").hide();
    }
  });

  // Handle "Order Now" button
  function handleAddToCart(event) {
    const item = JSON.parse($(event.target).attr("data-item"));
    const token = localStorage.getItem("authToken");

    if (!token) {
      localStorage.setItem("redirectAfterLogin", "index.html#menu");
      window.location.href = "user-reg.html";
      return;
    }

    addToCart(item);
  }

  // Add item to cart
  function addToCart(item) {
    const token = localStorage.getItem("authToken");
    console.log("Adding item to cart:", item);
    console.log("Using token:", token);

    $.ajax({
      url: "https://ecom-back-t1.netfy.app/api/cart/add",
      type: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      contentType: "application/json",
      data: JSON.stringify({ item_id: item.item_id }),
      success: function (response) {
        console.log("Response Data:", response);
        alert(`${item.item_name} has been added to your cart.`);
        window.location.href = "cart.html";
      },
      error: function (error) {
        console.error(
          "There was an error adding the item to your cart:",
          error
        );
        const errorMessage = error.responseJSON?.message || "Unknown error";
        alert(`Error adding item to cart: ${errorMessage}`);
      },
    });
  }
});
