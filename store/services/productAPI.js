const URL = "https://6401c5b40a2a1afebef1a7a1.mockapi.io/Products";

function apiGetProducts() {
  return axios({
    method: "GET",
    url: URL,
  });
}
