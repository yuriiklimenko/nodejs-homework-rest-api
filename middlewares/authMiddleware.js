const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const User = require("../services/schemas/user");
const createError = require("http-errors");

const authMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  try {
    if (bearer !== "Bearer") {
      throw new createError.Unauthorized("Not authorized");
    }

    const payload = jwt.verify(token, secret);

    const user = await User.findById(payload.userId);

    if (!user || !user.token) {
      throw new createError.Unauthorized("Not authorized");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.message === "Invalid signature") {
      err.status = 401;
    }
    next(err);
  }
};

module.exports = {
  authMiddleware,
};
