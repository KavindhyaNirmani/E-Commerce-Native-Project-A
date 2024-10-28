class featureSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <style>
        .row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          margin: 10px !important;
        }
        .card {
          margin: 5px 0 0 0;
          padding: 0;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.6);
          text-align: center;  
          opacity: 0; /* Initially hidden */
          transform: translateX(-150px); /* Shifted to the right */
          transition: opacity 1s ease, transform 1s ease; /* Smooth transition */
        }
        .card.visible {
          opacity: 1; /* Fade-in effect */
          transform: translateX(0); /* Move to original position */
        }
        .card-image {
          width: 130px;
          height: auto;
          max-width: 150px;
          display: block;
          margin: 15px auto;
        }
        </style>
        <div class="row">
          <div class="col-sm-3 mb-sm-0">
            <div class="card">
              <img class="card-image" src="./assets/images/feature-delivery.png" alt="Delivery" />
              <div class="card-body">
                <h5 class="card-title">24/7 Service</h5>
                <p class="card-text">Enjoy delicious meals anytime! We’re open 24/7 to satisfy cravings, day or night.</p>
              </div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="card">
              <img class="card-image" src="./assets/images/feature-pizza.png" alt="Pizza" />
              <div class="card-body">
                <h5 class="card-title">Fresh Pizza</h5>
                <p class="card-text">We serve fresh and hand-tossed pizza with authentic ingredients.</p>
              </div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="card">
              <img class="card-image" src="./assets/images/feature-delivery.png" alt="Delivery" />
              <div class="card-body">
                <h5 class="card-title">Fast & Fresh Delivery</h5>
                <p class="card-text">Get your pizzas delivered fresh and fast to satisfy your cravings.</p>
              </div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="card">
              <img class="card-image" src="./assets/images/feature-dessert.png" alt="Dessert" />
              <div class="card-body">
                <h5 class="card-title">Sweet Desserts</h5>
                <p class="card-text">Our sweet treats will give you the perfect end to your meal.</p>
              </div>
            </div>
          </div>
        </div>
    `;

    // Add Intersection Observer with re-trigger on scroll
    const cards = this.querySelectorAll(".card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
  }
}

customElements.define("feature-section", featureSection);
