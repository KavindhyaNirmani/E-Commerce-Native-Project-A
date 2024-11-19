displaySelectedItems();

let selectedCartItemIds = [];
let cart_id = null;

async function displaySelectedItems() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    $("#checkout-error").text("Authentication required. Please log in again.");
    return;
  }

  try {
    const response = await axios.get(
      "https://ecom-back-t1.netfy.app/api/orders/checkout/selected-items",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      console.error(`Failed to fetch items: ${response.status}`);
      $("#checkout-error").text(
        "Failed to load items. Please try again later."
      );
      return;
    }

    const data = response.data;
    const itemsContainer = $("#order-items");
    itemsContainer.empty();
    selectedCartItemIds = [];

    if (Array.isArray(data.items) && data.items.length > 0) {
      console.log("Selected Items:", data.items);

      cart_id = data.items[0].cart_id; // Assuming all items belong to the same cart
      console.log("Cart ID:", cart_id);

      data.items.forEach((item) => {
        selectedCartItemIds.push(item.cart_item_id);
        const itemTotal = parseFloat(item.item_price) * item.quantity;

        const row = $("<tr>").html(`
            <td class="custom-td-padding"><img src="https://ecom-back-t1.netfy.app${
              item.item_image
            }" alt="${item.item_name}" class="item-image"></td>
            <td class="custom-td-padding">${item.item_name}</td>
            <td class="custom-td-padding">${item.quantity}</td>
            <td class="custom-td-padding">Rs.${itemTotal.toFixed(2)}</td>
            <td class="custom-td-padding"><button class="btn btn-danger" onclick="removeItem(${
              item.cart_item_id
            })" aria-label="Remove"><i class="fa fa-trash"></i></button></td>
          `);
        itemsContainer.append(row);
      });

      console.log("Selected Cart Item IDs:", selectedCartItemIds);

      const summaryResponse = await axios.get(
        `https://ecom-back-t1.netfy.app/api/orders/order-summary?selectedCartItemIds=${encodeURIComponent(
          JSON.stringify(selectedCartItemIds)
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (summaryResponse.status !== 200) {
        console.error(`Failed to fetch summary: ${summaryResponse.status}`);
        $("#checkout-error").text(
          "Failed to load order summary. Please try again later."
        );
        return;
      }

      const summaryData = summaryResponse.data;
      console.log("Order Summary Data:", summaryData);

      const orderSummaryContainer = $("#order-summary-table");

      if (summaryData) {
        const orderSummaryHTML = `
            <tr>
              <td>No. of Items</td>
              <td>:</td>
              <td><span id="item-count">${
                summaryData.totalQuantity || 0
              }</span></td>
            </tr>
            <tr>
              <td>Sub Total</td>
              <td>:</td>
              <td>Rs.<span id="sub-total">${(
                summaryData.totalAmount || 0
              ).toFixed(2)}</span></td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>:</td>
              <td>Rs.<span id="discount">${(
                summaryData.discountAmount || 0
              ).toFixed(2)}</span></td>
            </tr>
            <tr>
              <td colspan="3"><hr class="full-width-line" /></td>
            </tr>
            <tr>
              <td><strong>Total</strong></td>
              <td>:</td>
              <td><strong>Rs. <span id="total">${(
                summaryData.finalAmount || 0
              ).toFixed(2)}</span></strong></td>
            </tr>
          `;
        orderSummaryContainer.html(orderSummaryHTML);
      } else {
        console.error("No summary data received");
        $("#checkout-error").text("No order summary available.");
      }
    } else {
      itemsContainer.html(
        '<tr><td colspan="6">No selected items found</td></tr>'
      );
    }
  } catch (error) {
    console.error("Error fetching selected items or summary:", error);
    $("#checkout-error").text(
      "Error fetching selected items or summary. Please try again later."
    );
  }
}

async function removeItem(cartItemId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    $("#checkout-error").text("Authentication required. Please log in again.");
    return;
  }

  try {
    const url = `https://ecom-back-t1.netfy.app/api/orders/checkout/remove-items-from-checkout/${cartItemId}`;
    console.log("Removing item with URL:", url);

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200)
      throw new Error(`HTTP error! Status: ${response.status}`);
    console.log(response.data.message);

    displaySelectedItems();
  } catch (error) {
    console.error("Error removing item:", error);
    $("#checkout-error").text("Error removing item. Please try again later.");
  }
}

$("#checkoutButton").on("click", async function () {
  const formData = {
    selectedCartItemIds,
    first_name: $("input[placeholder='First name']").val(),
    last_name: $("input[placeholder='Last name']").val(),
    address: $("input[placeholder='1234 Main St']").val(),
    city: "Galle",
    postal_code: $("input[placeholder='Postal code']").val(),
    phone_number: $("input[placeholder='712345678']").val(),
    cart_id,
  };

  const token = localStorage.getItem("authToken");
  if (!token) {
    $("#checkout-error").text("Authentication required. Please log in again.");
    return;
  }

  try {
    const summaryResponse = await axios.get(
      `https://ecom-back-t1.netfy.app/api/orders/order-summary?selectedCartItemIds=${encodeURIComponent(
        JSON.stringify(selectedCartItemIds)
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (summaryResponse.status !== 200) {
      console.error(`Failed to fetch summary: ${summaryResponse.status}`);
      $("#checkout-error").text(
        "Failed to load order summary. Please try again later."
      );
      return;
    }

    const summaryData = summaryResponse.data;
    formData.totalAmount = summaryData.totalAmount || 0;
    formData.discountAmount = summaryData.discountAmount || 0;
    formData.finalAmount = summaryData.finalAmount || 0;

    console.log("Form Data with Order Summary:", formData);

    await axios.post(
      "https://ecom-back-t1.netfy.app/api/orders/place",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Order placed successfully!");
  } catch (error) {
    console.error("Error during checkout:", error);
    $("#checkout-error").text("Error during checkout. Please try again later.");
  }
});
