function ProductCart(id, name, price, img, quantity) {
  this.id = id;
  this.name = name;
  this.price = +price;
  this.img = img;
  this.quantity = quantity;
}

ProductCart.prototype.calcTotalPrice = function () {
  return this.quantity * this.price;
};
