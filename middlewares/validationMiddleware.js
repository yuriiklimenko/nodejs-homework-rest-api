const Joi = require("joi");

module.exports = {
  addContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().required(),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      console.log(validationResult.error.details);
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  },

  // ---------------------------------

  updateContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(20),
      phone: Joi.string(),
      email: Joi.string(),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json(validationResult.error.details);
    }
    next();
  },
};
