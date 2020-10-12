const bestProducts = [
  "/static/assets/images/product.png",
  "/static/assets/images/product2.png",
  "/static/assets/images/product3.png",
];
let actualBest = 0;
function onLoadImage() {
  document.getElementById("loader").classList.add("d-none");
}
window.addEventListener("load", () => {
  document.getElementById("best-product-left").addEventListener("click", () => {
    actualBest =
      actualBest - 1 === -1 ? bestProducts.length - 1 : actualBest - 1;
    document.getElementById("best-product").src = bestProducts[actualBest];
  });
  document
    .getElementById("best-product-right")
    .addEventListener("click", () => {
      actualBest = actualBest + 1 === bestProducts.length ? 0 : actualBest + 1;
      document.getElementById("best-product").src = bestProducts[actualBest];
    });
  const categories = document.getElementsByClassName("categories__item");
  for (let i = 0; i < categories.length; i++) {
    categories[i].addEventListener("click", () => {
      window.location.replace(
        "/views/galery.html?category=" +
          categories[i].getAttribute("data-value").toLowerCase()
      );
    });
    categories[i].addEventListener("mouseover", () => {
      document
        .getElementsByClassName("categories__filter-intensive")
        [i].classList.add("categories__filter-intensive--show");
    });
    categories[i].addEventListener("mouseleave", () => {
      document
        .getElementsByClassName("categories__filter-intensive")
        [i].classList.remove("categories__filter-intensive--show");
    });
  }
});
