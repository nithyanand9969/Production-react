const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const JWT = require("jsonwebtoken");

// Register a new user
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Name, email, and password (at least 6 characters) are required.",
      });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered.",
      });
    }

    // Hash the password and save it to the database
    const hashedPassword = await hashPassword(password);
    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please log in.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in API",
      error: error.message,
    });
  }
};

// Login a user
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password.",
      });
    }
    
    // Generate JWT token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    // Set the password field to undefined
    user.password = undefined;
    
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in login API",
      error: error.message,
    });
  }
};

// Update user
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const user = await userModel.findOne({ email });

    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password is required and must be at least 6 characters long.",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      {
        new: true,
      }
    );

    // Set the password field to undefined
    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: "Profile updated. Please login.",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in user details",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
};
