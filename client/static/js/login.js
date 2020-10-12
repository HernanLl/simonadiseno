window.addEventListener("load", () => {
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    fetch(HOST + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password }),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
      })
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res.token);
          window.location.href = FRONT + "/views/admin";
        }
      });
  });
});
