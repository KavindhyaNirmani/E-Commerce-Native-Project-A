$(function () {
  // Header
  axios
    .get("./assets/widgets/header.html")
    .then((response) => {
      $("#headerPlaceholder").html(response.data);
      $("#offcanvasNavbar").css("background-color", "black");
    })
    .catch((error) => console.error("Error loading header:", error));

  // Footer
  axios
    .get("./assets/widgets/footer.html")
    .then((response) => {
      $("#footerPlaceholder").html(response.data);
    })
    .catch((error) => console.error("Error loading footer:", error));

  //For read more content
  function toggleContent() {
    $(".additional-content").toggle();
  }
});
