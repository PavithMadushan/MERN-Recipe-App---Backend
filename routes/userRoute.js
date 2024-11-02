const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const axios = require("axios");
const {
  registerUser,
  loginUser,
  addFavoriteRecipe,
  getFavoriteRecipes,
} = require("../controllers/userController");

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

// Add to Favorites Route
router.post("/add", authMiddleware, addFavoriteRecipe);

// Get Favorites Route
router.get("/favorites", authMiddleware, getFavoriteRecipes);

module.exports = router;
