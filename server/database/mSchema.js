const mongoose = require('mongoose');

const product = new mongoose.Schema({
  productId: { type: Number, unqiue: true },
  name: String,
  slogan: String,
  catergory: String,
  defaultPrice: Number,
  features: Array,
  photos: Array,
  style: Array, // Array of style documents below
});

const sku = new mongoose.Schema({
  skuId: { type: Number, unqiue: true },
  qty: Number,
  size: String,
});

const style = new mongoose.Schema({
  sytleId: { type: Number, unqiue: true },
  productId: Number,
  name: String,
  salesPrice: String,
  defaultStyle: Boolean,
  skus: Array, // Array of sku documents above
  photos: Array, // Array of photo documents below
});

const photo = new mongoose.Schema({
  thumbnail_url: String,
  url: String,
});

module.exports = {
  product, style, sku, photo,
};
