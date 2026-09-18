const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================================================
// REGISTER USER
// ======================================================

const registerUser = async (req, res) => {
  try {
    console.log("========== REGISTER ==========");

    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // ==================================================
    // CHECK REQUIRED FIELDS
    // ==================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    // ==================================================
    // NORMALIZE EMAIL
    // ==================================================

    const normalizedEmail =
      email.trim().toLowerCase();

    // ==================================================
    // CHECK EXISTING USER
    // ==================================================

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists with this email",
      });
    }

    // ==================================================
    // HASH PASSWORD
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ==================================================
    // CREATE USER
    //
    // IMPORTANT:
    // We DO NOT accept role from req.body.
    //
    // User.js will automatically assign:
    // role = "user"
    // ==================================================

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
    });

    console.log(
      "Registered user:",
      user.email
    );

    console.log(
      "User role:",
      user.role
    );

    // ==================================================
    // GENERATE JWT
    // ==================================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      message:
        "User registered successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during registration",
      error: error.message,
    });
  }
};

// ======================================================
// LOGIN USER
// ======================================================

const loginUser = async (req, res) => {
  try {
    console.log("========== LOGIN ==========");

    const {
      email,
      password,
    } = req.body;

    // ==================================================
    // CHECK REQUIRED FIELDS
    // ==================================================

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    // ==================================================
    // NORMALIZE EMAIL
    // ==================================================

    const normalizedEmail =
      email.trim().toLowerCase();

    // ==================================================
    // FIND USER
    // ==================================================

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // ==================================================
    // CHECK PASSWORD
    // ==================================================

    const isPasswordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    console.log(
      "Logged in user:",
      user.email
    );

    console.log(
      "User role:",
      user.role
    );

    // ==================================================
    // GENERATE JWT
    // ==================================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during login",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  registerUser,
  loginUser,
};
