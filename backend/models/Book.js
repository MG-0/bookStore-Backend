const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  isOnSale: {
    type: Boolean,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  coverImage: {
    type: String,
  },
  discountPercentage: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

module.exports = mongoose.model("Book", BookSchema);
