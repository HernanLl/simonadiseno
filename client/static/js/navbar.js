window.addEventListener("load", () => {
  let isActive = false;
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  hamburger.addEventListener("click", () => {
    if (isActive) {
      {
        hamburger.classList.remove("active");
        nav.classList.remove("nav--active");
      }
    } else {
      hamburger.classList.add("active");
      nav.classList.add("nav--active");
    }
    isActive = !isActive;
  });
});
