// Load header
$.get("./assets/widgets/header.html")
  .done(function (data) {
    $("#headerPlaceholder").html(data);
    const offcanvasNavbar = $("#offcanvasNavbar");
    if (offcanvasNavbar.length) {
      offcanvasNavbar.css("background-color", "black");
    }
  })
  .fail(function (error) {
    console.error("Error loading header:", error);
  });

// Load footer
$.get("./assets/widgets/footer.html")
  .done(function (data) {
    $("#footerPlaceholder").html(data);
  })
  .fail(function (error) {
    console.error("Error loading footer:", error);
  });

// Fetch cart items
async function fetchCartItems() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    $("#cart-message").text("You need to log in to view your cart.");
    return;
  }

  try {
    const response = await $.ajax({
      url: "https://ecom-back-t1.netfy.app/api/cart",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    displayCartItems(response.items);
  } catch (error) {
    console.error("There was an error fetching cart items:", error);
    $("#cart-message").text(
      "There was an error fetching cart items. Please try again."
    );
  }
}

// Display cart items
function displayCartItems(items) {
  const cartItemsContainer = $("#cart-items");
  cartItemsContainer.empty();

  if (items.length === 0) {
    cartItemsContainer.html(
      "<tr><td colspan='7'>Your cart is empty.</td></tr>"
    );
    return;
  }

  items.forEach((item) => {
    const quantity = item.quantity || 1;
    const itemTotal = parseFloat(item.item_price) * quantity;

    const row = $(`
      <tr>
        <td><input type="checkbox" class="item-checkbox" data-id="${
          item.cart_item_id
        }" data-price="${item.item_price}" /></td>
        <td><img src="https://ecom-back-t1.netfy.app${item.item_image}" alt="${
      item.item_name
    }" style="width: 50px; height: 50px;"></td>
        <td>${item.item_name}</td>
        <td>Rs: ${item.item_price}</td>
        <td>
          <button onclick="changeQuantity(${
            item.cart_item_id
          }, -1)" class="btn-qunatity">-</button>
          <span id="quantity-${item.cart_item_id}">${quantity}</span>
          <button onclick="changeQuantity(${
            item.cart_item_id
          }, 1)" class="btn-qunatity">+</button>
        </td>
        <td>Rs: <span id="total-${item.cart_item_id}">${itemTotal.toFixed(
      2
    )}</span></td>
        <td><button class="btn btn-danger" onclick="removeItem(${
          item.cart_item_id
        })" aria-label="Remove"><i class="fa fa-trash"></i></button></td>
      </tr>
    `);
    cartItemsContainer.append(row);
  });

  updateOrderSummary();

  $(".item-checkbox").on("change", updateOrderSummary);
}

// Update order summary
function updateOrderSummary() {
  let total = 0;
  let itemCount = $(".item-checkbox:checked").length;

  $(".item-checkbox:checked").each(function () {
    const id = $(this).data("id");
    const price = parseFloat($(this).data("price"));
    const quantity = parseInt($(`#quantity-${id}`).text());
    total += price * quantity;
  });

  $("#item-count").text(itemCount);
  $("#sub-total").text(total.toFixed(2));
  $("#total").text(total.toFixed(2));
}

// Change item quantity
async function changeQuantity(cartItemId, change) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You need to log in to change item quantities.");
    return;
  }

  const quantityElement = $(`#quantity-${cartItemId}`);
  let currentQuantity = parseInt(quantityElement.text());
  currentQuantity += change;

  if (currentQuantity < 1) return;

  try {
    await $.ajax({
      url: `https://ecom-back-t1.netfy.app/api/cart/update/${cartItemId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ quantity: currentQuantity }),
    });

    quantityElement.text(currentQuantity);
    const itemPrice = parseFloat($(`[data-id="${cartItemId}"]`).data("price"));
    $(`#total-${cartItemId}`).text((currentQuantity * itemPrice).toFixed(2));

    updateOrderSummary();
  } catch (error) {
    console.error("Error updating item quantity:", error);
    alert("Error updating item quantity. Please try again.");
  }
}

// Remove item from cart
async function removeItem(cartItemId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You need to log in to remove items from the cart.");
    return;
  }

  try {
    await $.ajax({
      url: `https://ecom-back-t1.netfy.app/api/cart/delete/${cartItemId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCartItems();
  } catch (error) {
    console.error("Error deleting cart item:", error);
    alert("Error deleting item. Please try again.");
  }
}

// Get selected items
function getSelectedItems() {
  const selectedItems = [];
  $(".item-checkbox:checked").each(function () {
    const id = $(this).data("id");
    const price = parseFloat($(this).data("price"));
    const quantity = parseInt($(`#quantity-${id}`).text());
    const itemName = $(this).closest("tr").find("td:nth-child(3)").text();

    selectedItems.push({
      cart_item_id: id,
      item_name: itemName,
      item_price: price,
      quantity: quantity,
    });
  });
  return selectedItems;
}

// Pass items to checkout
async function passItemsToCheckout() {
  const selectedItems = getSelectedItems();
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("You need to log in to proceed to checkout.");
    return;
  }

  if (!selectedItems.length) {
    alert("Please select items to proceed to checkout.");
    return;
  }

  try {
    await $.ajax({
      url: "https://ecom-back-t1.netfy.app/api/orders/checkout/transfer-selected",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        selectedCartItemIds: selectedItems.map((item) => item.cart_item_id),
      }),
    });

    alert("Items transferred to checkout successfully!");
    window.location.href = "checkout.html";
  } catch (error) {
    console.error("Error transferring items to checkout:", error);
    alert("An error occurred while transferring items. Please try again.");
  }
}

// Initial fetch of cart items
fetchCartItems();
