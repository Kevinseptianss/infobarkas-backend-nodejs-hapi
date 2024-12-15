const Joi = require("joi");

const UserPayLoadSchema = Joi.object({
  email: Joi.string().email().required().not().empty().messages({
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().not().empty().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
  name: Joi.string().required().not().empty().messages({
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  location: Joi.string().required().not().empty().messages({
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
});

const UserUpdateSchema = Joi.object({
  name: Joi.string().allow('').optional(),
  phone: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
});
module.exports = { UserPayLoadSchema, UserUpdateSchema };
