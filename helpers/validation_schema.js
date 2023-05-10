const Joi = require("joi");

const authValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

const subscriptionValidation = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const emailSchema = Joi.object({
  email: Joi.string().required(),
});

module.exports = {
  authValidation,
  subscriptionValidation,
  emailSchema,
};
