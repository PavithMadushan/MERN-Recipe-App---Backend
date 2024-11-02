const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number should contain exactly 10 digits."
    }),
  password: Joi.string().min(6).max(30).required(),
  confirmPassword: Joi.ref("password")
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const favoriteRecipeSchema = Joi.object({
  recipeId: Joi.string().required()
});

module.exports = { registerSchema, loginSchema, favoriteRecipeSchema };
