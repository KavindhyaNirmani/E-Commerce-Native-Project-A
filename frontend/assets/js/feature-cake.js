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
            width: 250px;
            border-radius:10px;
            height: 150px;
            
            display: block;
            margin: 15px auto;
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
                <img class="card-image" src="./assets/images/cake-feature-img1.jpg" alt="24h-service" />
                <div class="card-body">
                  <h5 class="card-title">Wedding Cake</h5>
                 
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="card">
                <img class="card-image" src="./assets/images/cake-feature-img2.jpg" alt="Pizza" />
                <div class="card-body">
                  <h5 class="card-title">Christmas Cake</h5>
                  
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="card">
                <img class="card-image" src="./assets/images/feature-cake-img3.jpg" alt="Delivery" />
                <div class="card-body">
                  <h5 class="card-title">BirthDay Cake</h5>
                  
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="card">
                <img class="card-image" src="./assets/images/feature-cake-img4.jpg" alt="Dessert" />
                <div class="card-body">
                  <h5 class="card-title">Customize Cake</h5>
                 
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
