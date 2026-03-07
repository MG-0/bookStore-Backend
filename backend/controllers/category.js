const Category = require("../models/Category");

// Create New Category
exports.createCategory = async (req, res) => {
    try { 
        const { name } = req.body;
        if (!name) {
            return res.status(401).json({ message: "Name Required!"});
        }
        const newCategory = await new Category({name});
        await newCategory.save();
        res.status(201).json({ message: "Category Created Successfully!", newCategory})
    } catch (error) {
        return res.status(500).json({ message: "Category Created Failed!", error: error.message});
    }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const Categories = await Category.find();
    res.status(201).json(Categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get Categories Is Failed!", error: error.message });
  }
};

// GEt Category By ID
exports.getCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(403).json({ message: "Category Not Found!"})
        }
        res.status(200).json({ message: "Category Get Successfully!", category})
    } catch (error) {
                return res
                  .status(500)
                  .json({
                    message: "Category Get Failed!",
                    error: error.message,
                  });
    }
};