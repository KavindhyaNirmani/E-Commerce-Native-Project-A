$(document).ready(function () {
  const form = $("#myForm");
  const tableBody = $("#data");
  const imgPreview = $("#imgPreview");
  const imgInput = $("#imgInput");
  let currentItemId = null;
  const userFormModal = new bootstrap.Modal(
    document.getElementById("userForm")
  );
  const readDataModal = new bootstrap.Modal(
    document.getElementById("readData")
  );
  const token = localStorage.getItem("authToken");

  // Function to load items from the API
  const loadItems = async () => {
    try {
      const response = await axios.get(
        "https://ecom-back-t1.netfy.app/api/items",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      tableBody.empty();
      response.data.forEach((item) => {
        const newRow = $(`
          <tr>
            <td>${escapeHTML(item.item_name)}</td>
            <td>${escapeHTML(item.item_description)}</td>
            <td>${parseFloat(item.item_price).toFixed(2)}</td>
            <td>${escapeHTML(item.category_name)}</td>
            <td>
              <img src="https://ecom-back-t1.netfy.app${escapeHTML(
                item.item_image
              )}" alt="Item Image" width="40" height="40">
            </td>
            <td>
              <button class="btn" onclick="viewItem('${encodeURIComponent(
                item.item_id
              )}')">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn" onclick="editItem('${encodeURIComponent(
                item.item_id
              )}')">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn" onclick="deleteItem('${encodeURIComponent(
                item.item_id
              )}')">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `);
        tableBody.append(newRow);
      });
    } catch (error) {
      console.error("Error loading items:", error);
      alert("Failed to load items. Please try again later.");
    }
  };

  // Helper function to escape HTML to prevent XSS
  const escapeHTML = (str) => {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Function to view item details
  window.viewItem = async (item_id) => {
    try {
      const response = await axios.get(
        `https://ecom-back-t1.netfy.app/api/items/${item_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const item = response.data;
      $("#viewImg").attr(
        "src",
        `https://ecom-back-t1.netfy.app${item.item_image}`
      );
      $("#viewName").val(item.item_name);
      $("#viewDescription").val(item.item_description);
      $("#viewPrice").val(parseFloat(item.item_price).toFixed(2));
      $("#viewCategory").val(item.category_id);
      readDataModal.show();
    } catch (error) {
      console.error("Error fetching item:", error);
      alert("Failed to fetch item details. Please try again later.");
    }
  };

  // Function to edit an item
  window.editItem = async (item_id) => {
    try {
      const response = await axios.get(
        `https://ecom-back-t1.netfy.app/api/items/${item_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const item = response.data;
      $("#name").val(item.item_name);
      $("#description").val(item.item_description);
      $("#price").val(parseFloat(item.item_price).toFixed(2));
      $("#category").val(item.category_id);
      imgPreview.attr(
        "src",
        `https://ecom-back-t1.netfy.app${item.item_image}`
      );
      currentItemId = item_id;
      userFormModal.show();
    } catch (error) {
      console.error("Error fetching item for edit:", error);
      alert("Failed to fetch item for editing. Please try again later.");
    }
  };

  // Function to handle form submission for Add/Edit
  form.on("submit", async (e) => {
    e.preventDefault();

    const name = $("#name").val().trim();
    const description = $("#description").val().trim();
    const price = $("#price").val().trim();
    const category = $("#category").val();
    const image = imgInput[0].files[0];

    // Basic validation
    if (!name || !description || !price || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("item_name", name);
    formData.append("item_description", description);
    formData.append("item_price", price);
    formData.append("category_name", category);
    if (image) {
      formData.append("item_image", image);
    }

    try {
      let url = "https://ecom-back-t1.netfy.app/api/items";
      let method = "post";

      if (currentItemId) {
        url = `https://ecom-back-t1.netfy.app/api/items/${currentItemId}`;
        method = "put";
      }

      const response = await axios({
        method: method,
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });

      if (response.status === 200 || response.status === 201) {
        loadItems();
        form[0].reset();
        imgPreview.attr("src", "");
        currentItemId = null;
        userFormModal.hide();
        alert(`Item ${method === "post" ? "added" : "updated"} successfully.`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "An error occurred while submitting the form. Please try again later."
      );
    }
  });

  // Handle form reset (Discard button)
  form.on("reset", () => {
    imgPreview.attr("src", "");
    currentItemId = null;
  });

  // Function to delete an item
  window.deleteItem = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `https://ecom-back-t1.netfy.app/api/items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          loadItems();
          alert("Item deleted successfully.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert(
          "An error occurred while deleting the item. Please try again later."
        );
      }
    }
  };

  // Image Preview Handler
  imgInput.on("change", () => {
    const file = imgInput[0].files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imgPreview.attr("src", e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      imgPreview.attr("src", "");
    }
  });

  // Initial Load of Items
  loadItems();
});
