window.addEventListener("load", () => {
  document.getElementById("contact__form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contact__form-name").value;
    const phone = document.getElementById("contact__form-phone").value;
    const email = document.getElementById("contact__form-email").value;
    const message = document.getElementById("contact__form-message").value;

    const responseMessage = document.getElementById("contact-message");
    responseMessage.innerHTML = "";
    responseMessage.classList.remove("contact__message-danger");
    responseMessage.classList.remove("contact__message-success");

    fetch(HOST + "/sendemail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, message }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res) {
          if (res.status === 400) {
            responseMessage.innerHTML = res.message;
            responseMessage.classList.add("contact__message-danger");
          } else if (res.status === 200) {
            responseMessage.innerHTML = res.message;
            responseMessage.classList.add("contact__message-success");
          }
        }
      });
  });
});
