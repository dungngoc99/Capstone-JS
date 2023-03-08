const URL = "https://6401c5b40a2a1afebef1a7a1.mockapi.io/Products";

function apiGetProducts(searchValue) {
  return axios({
    method: "GET",
    url: URL,

    // Những cặp key-value khai báo bên trong object params sẽ được đưa lên url theo dạng:
    // example.com/products?key1=value1&key2=value2
    params: {
      name: searchValue || undefined,
    },
  });
}

function apiCreateProducts(product) {
  return axios({
    method: "POST",
    url: URL,
    data: product,
  });
}

function apiDeleteProduct(productId) {
  return axios({
    method: "DELETE",
    url: `${URL}/${productId}`,
  });
}

function apiGetProductById(productId) {
  return axios({
    method: "GET",
    url: `${URL}/${productId}`,
  });
}

function apiUpdateProduct(productId, product) {
  return axios({
    method: "PUT",
    url: `${URL}/${productId}`,
    data: product,
  });
}
