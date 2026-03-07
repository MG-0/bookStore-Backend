const express = require("express");
const router = express.Router();
const bookController = require("../controllers/books");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + "-" + file.fieldname + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Create New Book
router.post(
  "/createBook",
  upload.single("coverImage"),
  bookController.createBook,
);

// Get All Books
router.get("/getBooks", bookController.getBooks);

// Get Book By ID
router.get("/:id", bookController.getBook);

// Update Book
router.put(
  "/updateBook/:id",
  upload.single("coverImage"),
  bookController.updateBook
);

// Delete Book
router.delete("/deleteBook/:id", bookController.deleteBook);

module.exports = router;
