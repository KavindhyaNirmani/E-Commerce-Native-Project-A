$("#contactForm")
  .off("submit")
  .on("submit", function (event) {
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
        if (response.status === 200) {
          alert("Your message has been sent successfully!");
          location.reload();
        } else {
          alert("There was an issue with your request. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error response:", error);
        alert("There was an error sending your message. Please try again.");
      });
  });
