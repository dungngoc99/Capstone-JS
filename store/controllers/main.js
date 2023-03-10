let cartProducts = getProductListCart(); // gio hang
let products = [];

getProducts();

function getProducts() {
  apiGetProducts()
    .then((response) => {
      renderProducts(response.data);
      products = response.data;
    })
    .catch((error) => {
      alert(error);
    });
}

function renderProducts(ds) {
  let html = ds.reduce((result, value) => {
    let item = new Product(
      value.id,
      value.name,
      value.price,
      value.screen,
      value.backCamera,
      value.frontCamera,
      value.img,
      value.desc,
      value.type
    );

    return (
      result +
      `
        <div class="card col-6 col-lg-4">
          <img
            class="card-img-top py-3"
            src="${item.img}"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">
            ${item.desc}
            </p>
            <p class="card-text">
              <small class="text-muted">Price: ${item.price}$</small>
            </p>
            <button class="btn btn__add" onclick="createProductListCart('${item.id}')">Add to cart</button>
          </div>
        </div>
      `
    );
  }, "");
  getElement("#productCards").innerHTML = html;
}

function renderCart(ds) {
  let html = ds.reduce((result, value, index) => {
    return (
      result +
      `
        <tr>
            <td scope="row">${index + 1}</td>
            <td>${value.name}</td>
            <td>
              <img src="${value.img}" alt="" />
            </td>
            <td>
              <div
                class="d-flex align-items-center justify-content-center"
              >
                <button class="quantity__button" onclick="decreaseProduct('${
                  value.id
                }')">-</button>
                ${value.quantity}
                <button class="quantity__button"  onclick="increaseProduct('${
                  value.id
                }')">+</button>
              </div>
            </td>
            <td>${value.price.toLocaleString()}
            </td>
            <td>
              <button class="btn btn-danger" onclick="deleteProduct('${
                value.id
              }')">Delete</button>
            </td>
        </tr>
      `
    );
  }, "");

  let totalPrice = ds.reduce((result, value) => {
    return result + value.calcTotalPrice();
  }, 0);

  getElement("#totalPrice").innerHTML = totalPrice.toLocaleString();
  getElement("#tbodyCart").innerHTML = html;
}

getElement("#showCart").onclick = function () {
  renderCart(cartProducts);
};

// H??m th??m s???n ph???m v??o gi??? h??ng
function createProductListCart(id) {
  let findId = cartProducts.find((item) => item.id === id);

  if (!findId) {
    let item = products.find((item) => item.id === id);

    const cardItem = new ProductCart(
      item.id,
      item.name,
      item.price,
      item.img,
      (item.quantity = 1)
    );
    cartProducts.push(cardItem);
  } else {
    findId.quantity++;
  }

  storeProductList();
}

// H??m t??m ki???m theo type
function selectTypeChange() {
  let select = getElement("#selectList").value;

  let item = products.filter((typeSelect) => {
    let type = typeSelect.type;

    return type.indexOf(select) !== -1;
  });

  renderProducts(item);
}

// H??m thanh to??n
function payCart() {
  localStorage.clear();
  cartProducts = [];
  renderCart([]);
}

function storeProductList() {
  // chuy???n Array cartProducts th??nh JSON
  const json = JSON.stringify(cartProducts);
  // L??u xu???ng localStorage v???i key l?? cartProducts
  localStorage.setItem("cartProducts", json);
}

function getProductListCart() {
  // L???y danh s??ch data t??? LocalStorage v???i key l?? cartProducts
  const json = localStorage.getItem("cartProducts");

  if (!json) {
    return [];
  }

  // Chuy???n JSON th??nh Array
  const cartProducts = JSON.parse(json);
  for (let index = 0; index < cartProducts.length; index++) {
    const productCart = cartProducts[index];
    cartProducts[index] = new ProductCart(
      productCart.id,
      productCart.name,
      productCart.price,
      productCart.img,
      productCart.quantity
    );
  }
  return cartProducts;
}

//H??m x??a s???n ph???m kh???i gi??? h??ng
function deleteProduct(productId) {
  cartProducts = cartProducts.filter((product) => {
    return product.id !== productId;
  });
  renderCart(cartProducts);
  storeProductList();
}

//H??m t??ng/gi???m s??? l?????ng s???n ph???m
function decreaseProduct(productId) {
  //b3:
  let findIndex = 0;

  //b1:
  let phone = cartProducts.find((item, index) => {
    //b3.1:
    if (item.id === productId) {
      findIndex = index;
    }
    return item.id === productId;
  });

  //b2: Gi???m quantity
  if (phone.quantity === 1) {
    cartProducts.splice(findIndex, 1);
  } else {
    phone.quantity--;

    //b3.2: ghi ???? ?????i t?????ng
    cartProducts[findIndex] = phone;
  }
  renderCart(cartProducts);
}

function increaseProduct(productId) {
  //B3:
  let findIndex = 0;
  //b1: T??m object s???n ph???m trong cart d???a v??o ID (h??m Find)
  let findPhone = cartProducts.find((item, index) => {
    //b3.1: T??m v??? tr?? index c???a s???n ph???m ???????c t??m th???y
    if (item.id === productId) {
      findIndex = index;
    }
    return item.id === productId;
  });
  //b2: t??ng quantity
  findPhone.quantity++;
  //b3.2: ghi ???? ?????i t?????ng findPhone v??o m???ng t???i v??? tr?? t????ng ???ng th??ng qua index
  cartProducts[findIndex] = findPhone;
  renderCart(cartProducts);
}

//=== DOM ===
function getElement(selector) {
  return document.querySelector(selector);
}
