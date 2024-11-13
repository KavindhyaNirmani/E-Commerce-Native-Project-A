$(function () {
  const addOfferButton = $("#addOfferButton");
  const submitOfferBtn = $("#submitOfferBtn");
  const offerForm = $("#offerForm");
  const offerList = $("#offerList");

  addOfferButton.on("click", function () {
    const addOfferModal = new bootstrap.Modal($("#addOfferModal")[0]);
    addOfferModal.show();
  });

  fetchOffers();

  submitOfferBtn.on("click", async function (e) {
    e.preventDefault();
    if (offerForm[0].checkValidity()) {
      await submitOfferForm();
    } else {
      offerForm.addClass("was-validated");
    }
  });

  async function fetchOffers() {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://ecom-back-t1.netfy.app/api/promotion",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      offerList.empty();
      response.data.forEach((offer) => {
        const imageUrl = offer.promotion_image
          ? `https://ecom-back-t1.netfy.app${offer.promotion_image}`
          : "";

        const offerCard = `
      <div class="card m-2 promotion-card" style="width: 18rem;">
        ${
          offer.promotion_image
            ? `<img src="${imageUrl}" class="card-img-top" >`
            : ""
        }
        <div class="card-body">
          <h5 class="card-title">${offer.title}</h5>
          <h5 class="card-text">${offer.promotion_description}</h5>
          <h6>Start Date: ${new Date(
            offer.start_date
          ).toLocaleDateString()}</h6>
          <h6>End Date: ${new Date(offer.end_date).toLocaleDateString()}</h6>
          <button class="btn btn-danger remove-offer-button" data-remove-id="${
            offer.promotion_id
          }">Remove offer</button>
        </div>
      </div>
    `;
        offerList.append(offerCard);
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  }

  async function submitOfferForm() {
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("title", $("#offerTitle").val());
    formData.append("promotion_description", $("#offerDetail").val());
    formData.append("min_price", $("#minPrice").val());
    formData.append("discount_percentage", $("#disPercentage").val());
    formData.append("categories", $("#category").val());
    formData.append("start_date", $("#startDate").val());
    formData.append("end_date", $("#endDate").val());

    const offerImage = $("#offerImage")[0].files[0];
    formData.append("promotion_image", offerImage);

    const rules = [
      {
        min_price: $("#minPrice").val(),
        discount_percentage: $("#disPercentage").val(),
      },
    ];

    formData.append("rules", JSON.stringify(rules));

    try {
      // Log form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        "https://ecom-back-t1.netfy.app/api/promotion",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Offer added response:", response.data);
      alert("Offer added successfully!");

      offerForm[0].reset();
      offerForm.removeClass("was-validated");

      $("#addOfferModal").modal("hide");

      fetchOffers();
    } catch (error) {
      console.error(
        "Error adding offer:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to add offer.");
    }
  }

  offerList.on("click", ".remove-offer-button", async function () {
    const offerId = $(this).data("remove-id");
    if (confirm("Are you sure you want to remove this offer?")) {
      try {
        await axios.delete(
          `https://ecom-back-t1.netfy.app/api/promotion/${offerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        alert("Offer removed successfully!");
        fetchOffers();
      } catch (error) {
        console.error("Error removing offer:", error);
        alert("Failed to remove offer. Please try again.");
      }
    }
  });
});
