$(function () {
  fetchOffers();

  const offerList = $("#offerList");

  async function fetchOffers() {
    try {
      const response = await axios.get(
        "https://ecom-back-t1.netfy.app/api/promotion",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetched Offers:", response.data);

      response.data.forEach((offer) => {
        const imageUrl = offer.promotion_image
          ? `https://ecom-back-t1.netfy.app${offer.promotion_image}`
          : "";

        const offerCard = `
       <div class="card  promotion-card" style="width: 20rem; position:relative">
         ${
           offer.promotion_image
             ? `<img src="${imageUrl}" class="card-img-top card-background" >`
             : ""
         }
         <div class="card-body card-overlay">
           <h5 class="card-title">${offer.title}</h5>
           <h5 class="card-text">${offer.promotion_description}</h5>
           <h6>Start Date: ${new Date(
             offer.start_date
           ).toLocaleDateString()}</h6>
           <h6>End Date: ${new Date(offer.end_date).toLocaleDateString()}</h6>
           
         </div>
       </div>
     `;

        console.log("Generated Offer Card:", offerCard);
        offerList.append(offerCard);
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  }
});
