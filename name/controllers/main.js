let danhSachSanPham = [];
let sortFlag = "";

getProducts();

// Hàm gửi yêu cầu lấy danh sách sản phẩm từ API
function getProducts(searchValue) {
  apiGetProducts(searchValue)
    .then((response) => {
      // Call API thành công
      const products = response.data.map((product) => {
        return new Products(
          product.id,
          product.name,
          product.price,
          product.img,
          product.desc
        );
      });
      danhSachSanPham = response.data;
      renderProducts(response.data);
    })
    .catch((error) => {
      // Call API thất bại
      alert("API get products error");
    });
}

// Hàm thêm sản phẩm
function createProduct() {
  const product = {
    name: getElement("#nameProduct").value,
    price: getElement("#Price").value,
    screen: getElement("#Screen").value,
    backCamera: getElement("#backCamera").value,
    frontCamera: getElement("#frontCamera").value,
    img: getElement("#imgLink").value,
    desc: getElement("#description").value,
    type: getElement("#chooseBrand").value,
  };

  if (!isValidate()) {
    return;
  }

  apiCreateProducts(product)
    .then((response) => {
      getProducts();
      resetInput();
    })
    .catch((error) => {
      alert("Thêm sản phẩm thất bại");
    });
}

// Hàm hiển thị danh sách sản phẩm ra table
function renderProducts(products) {
  let html = products.reduce((result, product, index) => {
    return (
      result +
      `
        <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${Intl.NumberFormat("vn-VN").format(product.price)}</td>
            <td>
                <img src="${product.img}" width="150" height="150" /> 
            </td>
            <td>${product.desc}</td>
            <td> 
                <button type="button" class="btn btn-secondary mb-2" onclick="selectProduct('${
                  product.id
                }')">Edit</button>
                <button type="button" class="btn btn-danger" onclick="deleteProduct(${
                  product.id
                })">Delete</button>
            </td>
        </tr>
      `
    );
  }, "");
  getElement("#tblListProducts").innerHTML = html;
}

// Hàm lấy dữ liệu của 1 sản phẩm hiển thị lên input modal
function selectProduct(productId) {
  apiGetProductById(productId)
    .then((response) => {
      const product = response.data;
      getElement("#nameProduct").value = product.name;
      getElement("#Price").value = product.price;
      getElement("#Screen").value = product.screen;
      getElement("#backCamera").value = product.backCamera;
      getElement("#frontCamera").value = product.frontCamera;
      getElement("#imgLink").value = product.img;
      getElement("#description").value = product.desc;
      getElement("#chooseBrand").value = product.type;

      // Mở và cập nhật giao diện modal
      getElement(".modal-title").innerHTML = "Cập nhật sản phẩm";
      getElement(".modal-footer").innerHTML = `
                <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button class="btn btn__updateProduct" onclick="updateProduct('${product.id}')">Cập nhật</button>
            `;
      $("#myModal").modal("show");
    })
    .catch((error) => {
      alert("Lấy chi tiết sản phẩm thất bại");
    });
}

// Hàm cập nhật sản phẩm
function updateProduct(productId) {
  const product = {
    name: getElement("#nameProduct").value,
    price: getElement("#Price").value,
    screen: getElement("#Screen").value,
    backCamera: getElement("#backCamera").value,
    frontCamera: getElement("#frontCamera").value,
    img: getElement("#imgLink").value,
    desc: getElement("#description").value,
    type: getElement("#chooseBrand").value,
  };

  if (!isValidate()) {
    return;
  }

  apiUpdateProduct(productId, product)
    .then((response) => {
      getProducts();
    })
    .catch((error) => {
      alert("Cập nhật sản phẩm thât bại");
    });
}

//Hàm xáo sản phẩm
function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(() => {
      getProducts();
    })
    .catch(() => {
      alert("Something wrong!");
    });
}

// Hàm reset các input
function resetInput() {
  getElement("#nameProduct").value = "";
  getElement("#Price").value = "";
  getElement("#Screen").value = "";
  getElement("#backCamera").value = "";
  getElement("#frontCamera").value = "";
  getElement("#imgLink").value = "";
  getElement("#description").value = "";
  getElement("#chooseBrand").value = "";
  getElement("#tbName").style.display = "none";
  getElement("#tbPrice").style.display = "none";
  getElement("#tbScreen").style.display = "none";
  getElement("#tbBackCamera").style.display = "none";
  getElement("#tbFrontCamera").style.display = "none";
  getElement("#tbImgLink").style.display = "none";
  getElement("#tbDescription").style.display = "none";
  getElement("#tbBrand").style.display = "none";
}

// VALIDATION
function isValidate() {
  let isValid = true;

  //Phone name:
  let name = getElement("#nameProduct").value;
  if (!name.trim() || name.length < 6) {
    isValid = false;
    getElement("#tbName").innerHTML =
      "Tên sản phẩm không được để trống và phải chứa 6 kí tự trở lên";
    getElement("#tbName").style.display = "block";
    getElement("#tbName").style.color = "red";
  } else {
    getElement("#tbName").innerHTML = "";
    getElement("#tbName").style.display = "none";
  }

  //Price:
  let price = getElement("#Price").value;
  const regexHasAlphabet = /\D/;
  if (!price.trim() || regexHasAlphabet.test(price)) {
    isValid = false;
    getElement("#tbPrice").innerHTML = "Vui lòng điền giá tiền bằng chữ số";
    getElement("#tbPrice").style.display = "block";
    getElement("#tbPrice").style.color = "red";
  } else {
    getElement("#tbPrice").innerHTML = "";
    getElement("#tbPrice").style.display = "none";
  }

  //Phải có http trong link
  let link = getElement("#imgLink").value;

  if (link.toLowerCase().indexOf("http") === -1) {
    isValid = false;
    getElement("#tbImgLink").innerHTML = "Vui lòng nhập link dẫn hợp lệ";
    getElement("#tbImgLink").style.display = "block";
    getElement("#tbImgLink").style.color = "red";
  } else {
    getElement("#tbImgLink").style.display = "none";
  }

  //Screen, back camera, font camera, description, select
  let isEmptyScreen = isCheckEmpty(
    "Screen",
    "tbScreen",
    "Screen không được để trống"
  );
  let isEmptyBackCamera = isCheckEmpty(
    "backCamera",
    "tbBackCamera",
    "Back camera không được để trống"
  );
  let isEmptyFrontCamera = isCheckEmpty(
    "frontCamera",
    "tbFrontCamera",
    "Front camera không được để trống"
  );
  let isEmptyDescription = isCheckEmpty(
    "description",
    "tbDescription",
    "Vui lòng nhập mô tả sản phẩm"
  );
  let isEmptySelectBrand = isCheckEmpty(
    "chooseBrand",
    "tbBrand",
    "Vui lòng chọn nhãn hàng phù hợp"
  );

  if (
    isEmptyScreen ||
    isEmptyBackCamera ||
    isEmptyFrontCamera ||
    isEmptyDescription ||
    isEmptySelectBrand
  ) {
    isValid = false;
  }

  return isValid;
}

function isCheckEmpty(idInput, idSpan, message) {
  let valueInput = getElement(`#${idInput}`).value;
  if (!valueInput.trim()) {
    getElement(`#${idSpan}`).innerHTML = message;
    getElement(`#${idSpan}`).style.display = "block";
    getElement(`#${idSpan}`).style.color = "red";
    return true;
  }
  getElement(`#${idSpan}`).style.display = "none";
  return false;
}

//SEARCH BY NAME
getElement("#basic-addon2").onclick = function () {
  let searchText = getElement("#txtSearch").value;

  let searchProductList = danhSachSanPham.filter((product) => {
    return product.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  });

  renderProducts(searchProductList);
};

//SORT BY PRICE
function sortByPrice() {
  if (!sortFlag || sortFlag === "desc") {
    danhSachSanPham.sort((a, b) => a.price - b.price);
    sortFlag = "asc";
  } else if (sortFlag === "asc") {
    danhSachSanPham.sort((a, b) => b.price - a.price);
    sortFlag = "desc";
  }
  // if(sortFlag === "desc") {
  //     danhSachSanPham.sort((a, b) => a.price - b.price);
  //     sortFlag = "asc";
  // }
  renderProducts(danhSachSanPham);
}
// ====================== DOM ========================
getElement("#btnAddProduct").addEventListener("click", () => {
  getElement(".modal-title").innerHTML = "Thêm sản phẩm";
  getElement(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
    <button class="btn btn__addProduct" onclick="createProduct()">Thêm</button>
    `;
  resetInput();
});

getElement("#txtSearch").addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  const searchValue = event.target.value;
  getProducts(searchValue);
});

getElement("#sort").onclick = sortByPrice;

// ================= Helper =================
function getElement(selector) {
  return document.querySelector(selector);
}
