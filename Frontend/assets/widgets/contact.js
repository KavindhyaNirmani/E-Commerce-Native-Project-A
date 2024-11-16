$(document).ready(function () {
  console.log("Document is ready");

  $("#contact-email").on("click", function (event) {
    console.log("Contact email clicked");
    event.preventDefault();
    $("#contactModal").modal("show");
  });

  $("#contactForm").on("submit", function (event) {
    console.log("Form submitted");
    event.preventDefault();

    const name = $("#name").val();
    const email = $("#email").val();
    const contactNumber = $("#contactNumber").val();
    const message = $("#message").val();

    console.log({ name, email, contactNumber, message });

    if (!name || !email || !contactNumber || !message) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    axios
      .post("https://ecom-back-t1.netfy.app/api/feedback/send-feedback", {
        name,
        email,
        contactNumber,
        message,
      })
      .then((response) => {
        console.log("Response:", response);
        alert("Your message has been sent successfully!");
        $("#contactModal").modal("hide");
        $("#contactForm")[0].reset();
      })
      .catch((error) => {
        console.error("Error response:", error);
        alert("There was an error sending your message. Please try again.");
      });
  });
});
