const express = require("express");
const router = express.Router()
const categoryController = require("../controllers/category");

// Create New Category
router.post("/createCategory", categoryController.createCategory);

// Get Categories
router.get("/getCategories", categoryController.getCategories);

// Get Category By Id 
router.get("/:id", categoryController.getCategory);

module.exports = router;