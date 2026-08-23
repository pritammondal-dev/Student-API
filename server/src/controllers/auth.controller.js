const User = require("../models/user.model");
const createActivityLog = require("../utils/activityLogger");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// =============================
// Register User
// =============================
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check username
    const existingUser = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Check email
    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Login User
// =============================
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
  await createActivityLog({
    userId: user.id,
    userType: "admin",
    action: "failed_login",
    req,
  });

  return res.status(401).json({
    success: false,
    message: "Invalid password",
  });
}
    // Log admin login
    await createActivityLog({
      userId: user.id,
      userType: "admin",
      action: "login",
      req,
    });

    // Generate JWT
    const token = generateToken(user, "admin");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Logout User
// =============================
const logout = async (req, res, next) => {
  try {
    await createActivityLog({
      userId: req.user.id,
      userType: "admin",
      action: "logout",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};
