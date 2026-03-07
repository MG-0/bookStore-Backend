const mongoose = require("mongoose");

const CartItems = new mongoose.Schema({
    book: {
        type: mongoose.Types.ObjectId, ref: "Book"
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number, 
        required: true
    }
})


const Cart = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true,
        unique: true
    },
    items: [CartItems],
    totalAmount: {
        type: Number,
        default: 0
    },
    totalItems: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Cart", Cart);