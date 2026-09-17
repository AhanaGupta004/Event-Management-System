const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================================
// PROTECT ROUTE
// ======================================================

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Please login first.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    // Find user
    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    // Attach complete user to request
    req.user = user;

    console.log("Authenticated User:", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    next();

  } catch (error) {
    console.error(
      "Authentication Error:",
      error
    );

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = {
  protect,
};