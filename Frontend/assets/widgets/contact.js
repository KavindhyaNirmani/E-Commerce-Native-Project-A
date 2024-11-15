$(document).ready(function () {
  $("#contact-email").on("click", function (event) {
    event.preventDefault();
    $("#contactModal").modal("show");
  });

  $("#contactForm").on("submit", function (event) {
    event.preventDefault();

    const name = $("#name").val();
    const email = $("#email").val();
    const contactNumber = $("#contactNumber").val();
    const message = $("#message").val();

    axios
      .post("https://ecom-back-t1.netfy.app/api/feedback/send-feedback", {
        name: name,
        email: email,
        contactNumber: contactNumber,
        message: message,
      })
      .then(function (response) {
        alert("Your message has been sent successfully!");
        $("#contactModal").modal("hide");
        $("#contactForm")[0].reset();
      })
      .catch(function (error) {
        alert("There was an error sending your message. Please try again.");
      });
  });
});
