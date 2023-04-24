const jwt = require("jsonwebtoken");
const User = require("../services/schemas/user");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const createError = require("http-errors");

const registration = async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw createError.Conflict(`Email is already in use`);
  }

  try {
    const newUser = new User({ username, email });

    newUser.setPassword(password);

    await newUser.save();
    const { email: userEmail, subscription: userSubscription } = newUser;
    res.status(201).json({
      status: "success",
      code: 201,
      user: {
        email: userEmail,
        subscription: userSubscription,
      },
    });
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    throw createError.BadRequest("Email or password is wrong");
  }

  const payload = {
    userId: user._id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  await User.findByIdAndUpdate(user._id, { token });
  const { email: userEmail, subscription: userSubscription } = user;
  res.json({
    status: "success",
    code: 200,
    token,
    user: {
      email: userEmail,
      subscription: userSubscription,
    },
  });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    status: "success",
    code: 200,
    user: {
      email,
      subscription,
    },
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  const { _id: id, email, subscription: newSubscription } = updatedUser;
  res.json({
    status: "success",
    code: 200,
    user: {
      id,
      email,
      newSubscription,
    },
  });
};

module.exports = updateSubscription;

module.exports = {
  registration,
  logIn,
  current,
  logOut,
  updateSubscription,
};
