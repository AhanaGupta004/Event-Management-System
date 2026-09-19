const Category = require("../models/Category");

// ======================================================
// CREATE CATEGORY - ADMIN ONLY
// ======================================================

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check required field
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const categoryName = name.trim();

    // Check duplicate category
    const existingCategory = await Category.findOne({
      name: categoryName,
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    // Create category
    const category = await Category.create({
      name: categoryName,
      description: description || "",
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(
      "Create Category Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while creating category",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL CATEGORIES - PUBLIC
// ======================================================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ name: 1 });

    return res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error(
      "Get Categories Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching categories",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE CATEGORY - ADMIN ONLY
// ======================================================

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const categoryName = name.trim();

    // Check whether another category
    // already has this name
    const existingCategory =
      await Category.findOne({
        name: categoryName,
        _id: { $ne: id },
      });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category =
      await Category.findByIdAndUpdate(
        id,
        {
          name: categoryName,
          description: description || "",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(
      "Update Category Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while updating category",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE CATEGORY - ADMIN ONLY
// ======================================================

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category =
      await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message:
        "Category deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Category Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while deleting category",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};