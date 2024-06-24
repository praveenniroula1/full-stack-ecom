import express from "express";
import { getUserByEmail, getUserById, insertUser, updateUserPassword } from "../models/userModel.js";
const router = express.Router();
import jwt from "jsonwebtoken"

router.post("/register", async (req, res) => {
  try {
    const insertUserData = await insertUser(req.body);
    if (insertUserData) {
      res.json({
        success: true,
        message: "Posted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to insert user data",
      });
    }
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.json({
        success: true,
        data: user,
      });
      
    } catch (error) {
      console.error("Error getting user by ID:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });


  // Login route
// Login route
router.post("/login", async (req, res) => {
  try {
      // Extract email and password from request body
      const { email, password } = req.body;

      console.log(`Attempting login for email: ${email}`); // Log the email being searched for

      // Check if the user exists
      const user = await getUserByEmail(email);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // Compare passwords
      if (password !== user.password) {
          return res.status(401).json({ success: false, message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Send token in response
      res.status(200).json({ success: true, token, user });
  } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    console.log(`Received change password request - userId: ${userId}, oldPassword: ${oldPassword}, newPassword: ${newPassword}`);

    // Get user by ID
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if old password matches
    if (oldPassword !== user.password) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Update user's password
    const updateSuccess = await updateUserPassword(userId, newPassword);
    if (updateSuccess) {
      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update password",
      });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
  

export default router;
