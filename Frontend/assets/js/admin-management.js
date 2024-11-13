$(function () {
  const adminModal = new bootstrap.Modal(
    document.getElementById("adminModal"),
    {
      keyboard: false,
    }
  );

  // Use Axios to fetch admins
  async function fetchAdmins() {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://ecom-back-t1.netfy.app/api/auth/admins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Debugging: log the response to check its structure
      console.log("Response data:", response.data);

      if (response.data && response.data.data) {
        displayAdmins(response.data.data);
      } else {
        alert("No admins found or invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      alert("Failed to fetch admins. Please try again.");
    }
  }

  // Function to display the list of admins
  function displayAdmins(admins) {
    $("#adminListContainer").empty(); // Clear existing entries
    admins.forEach((admin) => {
      appendNewAdminToTable(admin);
    });
  }

  // Function to append admins into admin list
  const appendNewAdminToTable = (admin) => {
    const imageUrl = admin.user_image
      ? `https://ecom-back-t1.netfy.app${admin.user_image}`
      : "";

    const adminCard = `
        <div class="card card-style" style="width: 15rem;">
          ${
            admin.user_image
              ? `<img class="card-img-top rounded-circle mt-2  d-block p-3 img-style" src="${imageUrl}" alt="Admin Image">`
              : ""
          }
          <div class="card-body text-center">
            <h5 class="card-title">${admin.first_name} ${admin.last_name}</h5>
          </div>
          <ul class="list-group list-custom">
            <li class="list-group-item">First Name: ${admin.first_name}</li>
            <li class="list-group-item">Last Name: ${admin.last_name}</li>
            <li class="list-group-item">User Name: ${admin.username}</li>
            <li class="list-group-item">Role: ${admin.role}</li>
            <li class="list-group-item">Email: ${admin.email}</li>
            <li class="list-group-item">Phone Number: ${admin.phone_no}</li>
            <li class="list-group-item">Address: ${admin.address}</li>
          </ul>
          <div class="card-body text-center">
            <button class="btn btn-danger remove-admin-button" data-admin-id="${
              admin.user_id
            }">Remove Admin</button>
          </div>
        </div>
      `;
    $("#adminListContainer").append(adminCard);
  };

  // Fetch admins initially
  fetchAdmins();

  // Show the modal when add admin button is clicked
  $("#addAdminButton").on("click", function () {
    $("#addAdminForm")[0].reset();
    $("#addAdminForm").removeClass("was-validated");
    $("#adminImagePreview").attr("src", "#").addClass("d-none"); // Reset image preview
    adminModal.show();
  });

  // Image preview
  $("#adminImage").on("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#adminImagePreview")
          .attr("src", e.target.result)
          .removeClass("d-none");
      };
      reader.readAsDataURL(file);
    } else {
      $("#adminImagePreview").attr("src", "#").addClass("d-none");
    }
  });

  // Handle form submission
  $("#addAdminForm").on("submit", function (event) {
    event.preventDefault();
    const form = $(this)[0];

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Collect form data
      var formData = new FormData();
      formData.append("first_name", $("#firstName").val().trim());
      formData.append("last_name", $("#lastName").val().trim());
      formData.append("username", $("#userName").val().trim());
      formData.append("role", $("#role").val().trim());
      formData.append("email", $("#email").val().trim());
      formData.append("password", $("#password").val().trim());
      formData.append("phone_no", $("#phoneNumber").val().trim());
      formData.append("address", $("#address").val().trim());

      const imageFile = $("#adminImage")[0].files[0];
      if (imageFile) {
        formData.append("user_image", imageFile);
      } else {
        alert("Please select an image to upload");
        return;
      }

      axios
        .post("https://ecom-back-t1.netfy.app/api/auth/add-admin", formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Admin added successfully:", response.data);
          alert("Admin added successfully");
          adminModal.hide();
          fetchAdmins();
        })
        .catch((error) => {
          console.error("Error adding admin:", error);
          alert("Failed to add admin. Please try again.");
        });
    }

    $(this).addClass("was-validated");
  });

  // Handle remove admin
  $(document).on("click", ".remove-admin-button", function () {
    const adminId = $(this).data("admin-id");
    const adminCard = $(this).closest(".card");

    if (confirm("Are you sure you want to remove this admin?")) {
      axios
        .delete(`https://ecom-back-t1.netfy.app/api/auth/admins/${adminId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        })
        .then((response) => {
          console.log("Admin removed successfully :", response);
          alert("Admin removed successfully");
          adminCard.remove();
        })
        .catch((error) => {
          console.error("Error removing admin:", error);
          alert("Failed to remove admin. Please try again.");
        });
    }
  });
});
