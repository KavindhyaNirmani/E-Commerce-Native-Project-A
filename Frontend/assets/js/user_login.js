$(function () {
  $("#icon-click").on("click", function () {
    $("#icon").toggleClass("fa-eye");

    const input = $("#password");
    input.attr("type", input.attr("type") === "password" ? "text" : "password");
  });

  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    const form = $(this);

    if (form[0].checkValidity()) {
      form.addClass("was-validated");
      submitLoginForm();
    } else {
      form.addClass("was-validated");
    }
  });

  function submitLoginForm() {
    const username = $("#userName").val();
    const password = $("#password").val();

    axios
      .post("https://ecom-back-t1.netfy.app/api/auth/login", {
        username,
        password,
      })
      .then(function (response) {
        if (response.status === 200) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("role", response.data.role);

          alert("Login successful!");

          if (
            response.data.role === "admin" ||
            response.data.role === "super admin"
          ) {
            window.location.href = "./dashboard.html";
          } else if (response.data.role === "user") {
            window.location.href = "./#menu";
          }
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
        $("#failed-modal-container").load("./log-fail.html", function () {
          $("#failModal").modal("show");
        });
      });
  }
});
