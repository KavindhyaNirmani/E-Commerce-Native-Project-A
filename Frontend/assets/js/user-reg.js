$(function () {
  // Password toggle functionality
  $(".toggle-password").on("click", function () {
    e.preventDefault();

    const targetInput = $($(this).data("target"));
    const icon = $(this).find("i");

    icon.toggleClass("fa-eye fa-eye-slash");
    targetInput.attr(
      "type",
      targetInput.attr("type") === "password" ? "text" : "password"
    );
  });

  $("#registerForm").on("submit", function (e) {
    e.preventDefault();

    const form = $(this)[0];

    if (!form.checkValidity()) {
      e.stopPropagation();
      $(form).addClass("was-validated");
      return;
    }

    const email = $("#email").val();
    const username = $("#userName").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Sending data to the server:", {
      email,
      username,
      password,
      confirmPassword,
    });

    axios
      .post("https://ecom-back-t1.netfy.app/api/auth/register", {
        email,
        username,
        password,
        confirmPassword,
      })
      .then(function (response) {
        console.log("Response from server:", response.data);

        $("#success-modal-content").load("./reg-success.html", function () {
          $("#successModal").modal("show");
        });
      })
      .catch(function (error) {
        console.error("Error:", error);
        alert(error.response?.data?.message || "Registration failed.");
      });
  });
});
