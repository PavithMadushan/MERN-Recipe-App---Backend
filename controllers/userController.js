// const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const axios = require("axios");

// // Register a new user
// exports.registerUser = async (req, res) => {
//   try {
//     const userExists = await User.findOne({ email: req.body.email });
//     if (userExists) {
//       return res
//         .status(200)
//         .send({ message: "User already exists", success: false });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     req.body.password = hashedPassword;
//     const newUser = new User(req.body);
//     await newUser.save();
//     res.status(200).send({ message: "User created successfully", success: true });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).send({ message: "Error creating user", success: false, error });
//   }
// };

// // Login user
// exports.loginUser = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res
//         .status(200)
//         .send({ message: "User does not exist", success: false });
//     }
//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) {
//       return res.status(200).send({ message: "Password is incorrect", success: false });
//     } else {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//       res.status(200).send({ message: "Login successful", success: true, data: token });
//     }
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).send({ message: "Error logging in", success: false, error });
//   }
// };

// // Add recipe to favorites
// exports.addFavoriteRecipe = async (req, res) => {
//   try {
//     const { recipeId } = req.body;
//     const user = await User.findById(req.user.id);
//     if (user.favorites.includes(recipeId)) {
//       return res.status(400).json({ message: "Recipe already in favorites" });
//     }
//     await User.findByIdAndUpdate(
//       req.user.id,
//       { $push: { favorites: recipeId } },
//       { new: true, runValidators: false }
//     );
//     res.status(200).json({ message: "Recipe added to favorites" });
//   } catch (error) {
//     console.error("Error adding favorite recipe:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get user's favorite recipes
// exports.getFavoriteRecipes = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user || !user.favorites) {
//       return res.status(404).json({ message: "No favorites found" });
//     }
//     const favoriteRecipes = await Promise.all(
//       user.favorites.map(async (recipeId) => {
//         const response = await axios.get(
//           `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
//         );
//         return response.data.meals[0];
//       })
//     );
//     res.status(200).json({ success: true, favorites: favoriteRecipes });
//   } catch (error) {
//     console.error("Error fetching favorite recipes:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { registerSchema, loginSchema, favoriteRecipeSchema } = require("../validations/userValidation");

// Register a new user
exports.registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({ message: "User already exists", success: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Save new user
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Error creating user", success: false, error });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User does not exist", success: false });
    }

    // Check password match
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Password is incorrect", success: false });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({ message: "Login successful", success: true, data: token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ message: "Error logging in", success: false, error });
  }
};

// Add recipe to favorites
exports.addFavoriteRecipe = async (req, res) => {
  const { error } = favoriteRecipeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.user.id);
    if (user.favorites.includes(recipeId)) {
      return res.status(400).json({ message: "Recipe already in favorites" });
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { favorites: recipeId } },
      { new: true, runValidators: false }
    );

    res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    console.error("Error adding favorite recipe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's favorite recipes
exports.getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.favorites) {
      return res.status(404).json({ message: "No favorites found" });
    }

    // Fetch details for each favorite recipe by its ID
    const favoriteRecipes = await Promise.all(
      user.favorites.map(async (recipeId) => {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
        );
        return response.data.meals[0];
      })
    );

    res.status(200).json({ success: true, favorites: favoriteRecipes });
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};
