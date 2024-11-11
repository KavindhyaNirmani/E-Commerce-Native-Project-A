document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        contactNo: document.getElementById("contactNo").value,
        message: document.getElementById("message").value,
      };

      try {
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

        if (response.ok) {
          alert("Message sent successfully!");
          document.getElementById("contactForm").reset();
        } else {
          const errorData = await response.json();
          alert(
            `Failed to send message: ${
              errorData.message || "Please try again."
            }`
          );
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  } else {
    console.error("contactForm element not found");
  }
});
