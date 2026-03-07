const express = require("express");
const Book = require("../models/Book");

// Create New Book
exports.createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      author,
      isOnSale,
      isFeatured,
      discountPercentage,
      category,
    } = req.body;
    if (!title || !author || !price || !description || !stock || !category) {
      return res.status(400).json({ message: "All Felids Required!" });
    }
    const newBook = await new Book({
      title,
      description,
      price,
      stock,
      author,
      isFeatured,
      isOnSale,
      discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
      category,
      coverImage: req.file?.filename,
    });
    await newBook.save();
    await newBook.populate("category", "name");
    res
      .status(201)
      .json({ message: " Book Is Created Successfully!", book:newBook });
  } catch (error) {
    return res
      .status(500)
      .json({ message: " Book Created Failed!", error: error.message });
  }
};

// Get All Books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate("category", "name")
        res.status(201).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Get Books Is Failed!", error: error.message})
    }
};

// Get Book  By Id
exports.getBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId).populate("category", "name");
         if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
        res.status(201).json({ message: "Book Get Is Successfully!", book });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Get Book Is Failed!", error: error.message });
    }
};

// Update Book 
exports.updateBook = async (req, res) => {
    try { 
        const bookId = req.params.id;
        const updateData = { ...req.body };

        // If a new image was uploaded, add the filename to the update data
        if (req.file) {
            updateData.coverImage = req.file.filename;
        }

        const updateBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });
         if (!updateBook) {
           return res.status(404).json({ message: "Book not found!" });
         }
        res.status(200).json({ message: "Book Update Successfully!", book: updateBook})
    } catch (error) {
        return res
        .status(500)
        .json({ message: "Update Book Is Failed!", error: error.message });
    }
};

// Delete Book 
exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const deleteBook = await Book.findByIdAndDelete(bookId);
        if (!deleteBook) {
          return res.status(404).json({ message: "Book not found!" });
        }
        res.status(200).json({ message: "Book deleted successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Delete Book Is Failed!", error: error.message });
    }
 };