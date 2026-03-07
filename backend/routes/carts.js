const express = require("express");
const router = express.Router()
const cartControllers = require("../controllers/cart")
const {cookieAuth} = require("../auth/middleware")


// Get Items in Cart
router.get("/", cookieAuth(), cartControllers.getCart )

// Add Item To Cart
router.post("/add", cookieAuth(), cartControllers.addToCart)

// Update Cart
router.put("/updateCart", cookieAuth(), cartControllers.updateCart)

// Delete Item From Cart
router.delete("/delete/:bookId", cookieAuth(), cartControllers.deleteCart)

module.exports = router;