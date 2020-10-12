let products = [];
let filteredProducts = products;
let inputValue = "";
const url = new URL(window.location);
let actualProduct = {};
let actualCategory = url.searchParams.get("category")
  ? url.searchParams.get("category")
  : "todos";

function redirectLogin() {
  window.location.href = FRONT + "/views/login.html ";
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

function renderWidget(openWidget) {
  if (openWidget) {
    document.getElementById("widget").classList.remove("d-none");
    if (actualProduct) {
      document.getElementById("widget-title").innerHTML = "Editar producto";
      document.getElementById("widget-btn").innerHTML = "Editar";
    } else {
      document.getElementById("widget-title").innerHTML = "Agregar producto";
      document.getElementById("widget-btn").innerHTML = "Agregar";
    }
  } else {
    document.getElementById("widget").classList.add("d-none");
  }
}

function renderProducts() {
  filterProducts();
  const galery = document.getElementById("galery");
  galery.innerHTML = "";
  filteredProducts.forEach((product) => {
    galery.innerHTML += `
      <div class="galery__product galery__product--admin">
        <img src="${product.url}" alt="" class="img" />
        <h1>${product.name}</h1>
        <h2>$${product.price}</h2>
        <div>
            <img onclick='editWrapper("${product.id}")' class="galery__product__icon" src="/static/assets/icons/edit.svg"/>
            <img onclick='deleteProduct("${product.id}")' class="galery__product__icon" src="/static/assets/icons/trash.svg"/>
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
function editWrapper(id) {
  actualProduct = products.find((e) => e.id === id);
  document.getElementById("img-preview").src = actualProduct.url;
  document.getElementById("form-name").value = actualProduct.name;
  document.getElementById("form-price").value = actualProduct.price;
  document.getElementById("form-category").value = actualProduct.category;
  renderWidget(true);
}
function deleteProduct(id) {
  fetch(HOST + "/product/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  }).then((res) => {
    if (res.status === 200) {
      products = products.filter((e) => e.id !== id);
      renderProducts();
    } else if (res.status === 403) {
      redirectLogin();
    }
  });
}
function editProduct() {
  const name = document.getElementById("form-name").value;
  const price = document.getElementById("form-price").value;
  const category = document.getElementById("form-category").value;
  fetch(HOST + "/product/" + actualProduct.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      name,
      price,
      category,
    }),
  }).then((res) => {
    if (res.status === 200) {
      products = products.map((p) => {
        return p.id === actualProduct.id
          ? {
              id: actualProduct.id,
              name,
              price,
              category,
              url: actualProduct.url,
            }
          : p;
      });
      renderProducts();
      renderWidget(false);
    } else if (res.status === 403) {
      redirectLogin();
    }
  });
}
window.addEventListener("load", async () => {
  if (!localStorage.getItem("token")) {
    redirectLogin();
  }
  const res = await fetch(`${HOST}/products`).then((res) => res.json());
  if (res.products) {
    products = res.products;
  }
  let filterActive = false;
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

  const search = document.getElementById("search-input");
  search.addEventListener("input", (e) => {
    inputValue = search.value;
    renderProducts();
  });

  const btnAddProduct = document.getElementById("add-product");
  btnAddProduct.addEventListener("click", (e) => {
    e.preventDefault();
    actualProduct = null;
    document.getElementById("img-preview").src = "";
    document.getElementById("form-name").value = "";
    document.getElementById("form-price").value = "";
    document.getElementById("form-file").value = "";
    document.getElementById("form-category").value = "Mates";
    renderWidget(true);
  });
  const btnCancel = document.getElementById("widget-cancel");
  btnCancel.addEventListener("click", () => {
    renderWidget(false);
  });
  const formFile = document.getElementById("form-file");
  let file;
  formFile.addEventListener("change", (e) => {
    file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("img-preview").src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  const widgetButton = document.getElementById("widget-btn");
  widgetButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (actualProduct) {
      editProduct();
    } else {
      addProduct();
    }
  });

  function addProduct() {
    const name = document.getElementById("form-name").value;
    const price = document.getElementById("form-price").value;
    const category = document.getElementById("form-category").value;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", file);
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + localStorage.getItem("token"));
    fetch(HOST + "/product", {
      method: "POST",
      headers,
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) redirectLogin();
      })
      .then((res) => {
        if (res) {
          products.push({ name, price, category, url: res.url, id: res.id });
          renderWidget(false);
          renderProducts();
        }
      });
  }

  renderCategories();
});
