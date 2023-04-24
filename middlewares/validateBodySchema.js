const createError = require("http-errors");

const validateSchema = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw createError.BadRequest(error.message);
    }
    next();
  };

  return func;
};

module.exports = validateSchema;
