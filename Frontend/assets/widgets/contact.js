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

    $.ajax({
      url: " https://ecom-back-t1.netfy.app/api/feedback/send-feedback",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        name: name,
        email: email,
        contactNumber: contactNumber,
        message: message,
      }),
      success: function (response) {
        alert("Your message has been sent successfully!");
        $("#contactModal").modal("hide");
        $("#contactForm")[0].reset();
      },
      error: function (error) {
        alert("There was an error sending your message. Please try again.");
      },
    });
  });
});
