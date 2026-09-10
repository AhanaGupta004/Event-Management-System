const express = require("express");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get categories
router.get("/", getCategories);

// ======================================================
// ADMIN ONLY ROUTES
// ======================================================

// Create category
router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

// Update category
router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

// Delete category
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

module.exports = router;