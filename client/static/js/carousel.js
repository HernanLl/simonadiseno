const SWAP = 200;
window.addEventListener("load", () => {
  let actualItem = 0;
  const items = document.getElementsByClassName("carousel__item");
  const carouselPoints = document.getElementById("carousel__points");
  const title = document.getElementById("carousel__title");
  function renderTitle() {
    title.innerHTML = items[actualItem].getAttribute("data-value");
  }
  function renderPoints() {
    carouselPoints.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
      if (i === actualItem) {
        carouselPoints.innerHTML += `<div class="carousel__point carousel__point--active"></div>`;
      } else {
        carouselPoints.innerHTML += `<div class="carousel__point"></div>`;
      }
    }
  }
  function renderNext() {
    items[actualItem].classList.remove("animation-opacity");
    items[actualItem].classList.add("animation-opacity-reverse");
    actualItem = actualItem + 1 === items.length ? 0 : actualItem + 1;
    items[actualItem].classList.remove("animation-opacity-reverse");
    items[actualItem].classList.add("animation-opacity");
    renderPoints();
    renderTitle();
  }
  function renderPreview() {
    items[actualItem].classList.remove("animation-opacity");
    items[actualItem].classList.add("animation-opacity-reverse");
    actualItem = actualItem - 1 < 0 ? items.length - 1 : actualItem - 1;
    items[actualItem].classList.remove("animation-opacity-reverse");
    items[actualItem].classList.add("animation-opacity");
    renderPoints();
    renderTitle();
  }
  renderPoints();
  document.getElementById("arrow-left").addEventListener("click", () => {
    renderPreview();
  });
  document.getElementById("arrow-right").addEventListener("click", () => {
    renderNext();
  });
  let initialPosition = null;
  document.getElementById("carousel").addEventListener("mousedown", (e) => {
    initialPosition = e.offsetX;
  });
  document.getElementById("carousel").addEventListener("mouseup", (e) => {
    initialPosition = null;
  });
  document.getElementById("carousel").addEventListener("mousemove", (e) => {
    if (initialPosition !== null) {
      if (e.offsetX - initialPosition < -SWAP) {
        renderNext();
        initialPosition = null;
      } else if (e.offsetX - initialPosition > SWAP) {
        renderPreview();
        initialPosition = null;
      }
    }
  });
  document.getElementById("carousel").addEventListener("touchstart", (e) => {
    initialPosition = e.touches[0].clientX;
  });
  document.getElementById("carousel").addEventListener("touchend", (e) => {
    initialPosition = null;
  });
  document.getElementById("carousel").addEventListener("touchmove", (e) => {
    if (initialPosition !== null) {
      if (e.touches[0].clientX - initialPosition < -SWAP) {
        renderNext();
        initialPosition = null;
      } else if (e.touches[0].clientX - initialPosition > SWAP) {
        renderPreview();
        initialPosition = null;
      }
    }
  });
});
