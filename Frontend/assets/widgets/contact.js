document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      contactNo: document.getElementById("contactNo").value,
      message: document.getElementById("message").value,
    };

    try {
      // Send data to the API
      const response = await fetch(
        "https://ecom-back-t1.netfy.app/api/feedback/send-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Handle response
      if (response.ok) {
        alert("Message sent successfully!");
        document.getElementById("contactForm").reset(); // Clear the form
        //document.querySelector(".btn-close").click(); // Closes the modal
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  });
