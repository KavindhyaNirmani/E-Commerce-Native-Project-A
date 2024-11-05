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
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
              text-align: center;  
              opacity: 0; 
              transform: translatey(150px); 
              transition: opacity 1s ease, transform 1s ease; 
            }
            .card.visible {
              opacity: 1; 
              transform: translateX(0); 
            }
            .card-image {
          width: 150px;
          height: auto;
          max-width: 150px;
          display: block;
          border-radius:10px;
          margin: 10px auto;
          
            }
              .card-image:hover{
              -webkit-transform: scale(-1);
              transform:scalex(-1);
              transition: 1.5s;
              }
             
              .card-title:hover {
              color: #c59d5f;
              }
            </style>
            <div class="row">
              <div class="col-sm-3 mb-sm-0">
                <div class="card">
                  <img class="card-image" src="./assets/images/feature-pizza-img1.jpg" alt="24h-service" />
                  <div class="card-body">
                    <h5 class="card-title">Healthy Pizza</h5>
                   
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="card">
                  <img class="card-image" src="./assets/images/feature-pizza-img3.jpg" alt="Pizza" />
                  <div class="card-body">
                    <h5 class="card-title">Mini Pizza</h5>
                    
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="card">
                  <img class="card-image" src="./assets/images/feature-pizza-img1.jpg" alt="Delivery" />
                  <div class="card-body">
                    <h5 class="card-title">Customized Pizza</h5>
                    
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="card">
                  <img class="card-image" src="./assets/images/feature-pizza-img3.jpg" alt="Dessert" />
                  <div class="card-body">
                    <h5 class="card-title">Enjoy With Family</h5>
                   
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
