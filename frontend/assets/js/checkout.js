$(document).ready(() => {
  displaySelectedItems();
});

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
    let selectedCartItemIds = [];

    if (Array.isArray(data.items) && data.items.length > 0) {
      console.log("Selected Items:", data.items);

      data.items.forEach((item) => {
        selectedCartItemIds.push(item.cart_item_id);
        const itemTotal = parseFloat(item.item_price) * item.quantity;

        const row = $("<tr>").html(`
            <td><img src="https://ecom-back-t1.netfy.app${
              item.item_image
            }" alt="${item.item_name}" style="width: 50px; height: 50px;"></td>
            <td>${item.item_name}</td>
            <td>Rs.${parseFloat(item.item_price).toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>Rs.${itemTotal.toFixed(2)}</td>
            <td><button class="btn btn-danger" onclick="removeItem(${
              item.cart_item_id
            })" aria-label="Remove"><i class="fa fa-trash"></i></button></td>
          `);
        itemsContainer.append(row);
      });

      console.log("Selected Cart Item IDs:", selectedCartItemIds);

      const summaryResponse = await axios.get(
        `https://ecom-back-t1.netfy.app/api/orders/order-summary?selectedCartItemIds=${JSON.stringify(
          selectedCartItemIds
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
