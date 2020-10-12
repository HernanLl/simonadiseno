let products = [];
let filteredProducts = products;
let inputValue = "";
const url = new URL(window.location);
let actualCategory = url.searchParams.get("category")
  ? url.searchParams.get("category")
  : "todos";

function onClickProduct(id) {
  document.getElementById("preview").classList.remove("d-none");
  document.getElementById("preview-img").src = products.find(
    (e) => e.id === id
  ).url;
}
function filterProducts() {
  filteredProducts = products.filter((product) =>
    actualCategory === "todos"
      ? true
      : product.category.toLowerCase() === actualCategory.toLowerCase()
  );
  filteredProducts = filteredProducts.filter(
    (product) =>
      product.name.toLowerCase().indexOf(inputValue.toLowerCase()) === 0
  );
}
function renderProducts() {
  filterProducts();
  const galery = document.getElementById("galery");
  galery.innerHTML = "";
  filteredProducts.forEach((product) => {
    galery.innerHTML += `
      <div onClick="onClickProduct('${product.id}')" class="galery__product">
        <img src="${product.url}" alt="" class="img" />
        <div class="galery__info">
          <h1>${product.name}</h1>
          <h2>$${product.price}</h2>
        </div>
      </div>
    `;
  });
}
function renderCategories() {
  const categories = document.getElementsByClassName(
    "galery__filter-products__category"
  );
  for (let i = 0; i < categories.length; i++) {
    categories[i].classList.remove("galery__filter-products__category--active");
    if (
      categories[i].getAttribute("data-value").toLowerCase() === actualCategory
    ) {
      categories[i].classList.add("galery__filter-products__category--active");
    }
  }
  renderProducts();
}
window.addEventListener("load", async () => {
  const res = await fetch(`${HOST}/products`).then((res) => res.json());
  if (res.products) {
    products = res.products;
  }
  let filterActive = false;
  let sortByPrice = 0;
  let sortByDate = 0;
  document.getElementById("dropdown-btn").addEventListener("click", () => {
    if (filterActive) {
      document
        .getElementById("filter-products")
        .classList.add("galery__filter-products--hide");
      document.getElementById("dropdown-btn").src =
        "/static/assets/icons/down-arrow.svg";
    } else {
      document
        .getElementById("filter-products")
        .classList.remove("galery__filter-products--hide");
      document.getElementById("dropdown-btn").src =
        "/static/assets/icons/up-arrow.svg";
    }
    filterActive = !filterActive;
  });

  const previewImg = document.getElementById("preview-img");
  const ly = document.getElementById("preview-img-ly");
  ly.addEventListener("mousemove", (e) => {
    if (window.innerWidth > 768) {
      previewImg.style.transform = `scale(1.5) translate(${
        (e.clientX - 800) / -5
      }px,${(e.clientY - 350) / -5}px)`;
    }
  });
  ly.addEventListener("mouseleave", (e) => {
    previewImg.style.transform = null;
  });

  const categories = document.getElementsByClassName(
    "galery__filter-products__category"
  );
  for (let i = 0; i < categories.length; i++) {
    categories[i].addEventListener("click", () => {
      for (let j = 0; j < categories.length; j++) {
        categories[j].classList.remove(
          "galery__filter-products__category--active"
        );
      }
      categories[i].classList.add("galery__filter-products__category--active");
      actualCategory = categories[i].getAttribute("data-value").toLowerCase();
      renderProducts();
    });
  }

  const cancel = document.getElementById("preview-cancel");
  cancel.addEventListener("click", () => {
    document.getElementById("preview").classList.add("d-none");
  });

  const search = document.getElementById("search-input");
  search.addEventListener("input", (e) => {
    inputValue = search.value;
    renderProducts();
  });

  renderCategories();
});
