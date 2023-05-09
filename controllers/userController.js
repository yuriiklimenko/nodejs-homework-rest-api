require("dotenv").config();
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const User = require("../services/schemas/user");
const createError = require("http-errors");
const gravatar = require("gravatar");

const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const sendVerificationEmail = require("../helpers/sendVerificationEmail");

const registration = async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw createError.Conflict(`Email is already in use`);
  }

  try {
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = new User({ username, email, avatarURL, verificationToken });

    newUser.setPassword(password);

    await newUser.save();
    const { email: userEmail, subscription: userSubscription } = newUser;

    const verifyEmail = {
      to: email,
      subject: "Registration succesfull. Please, verify your email",
      html: `<a href="http://localhost:3000/api/user/verify/${verificationToken}" target="_blank">Click to verify your e-mail address</a>`,
    };
    await sendVerificationEmail(verifyEmail);

    res.status(201).json({
      status: "success",
      code: 201,
      user: {
        email: userEmail,
        subscription: userSubscription,
        avatarURL,
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
  const { email: userEmail, subscription: userSubscription, avatarURL } = user;
  res.json({
    status: "success",
    code: 200,
    token,
    user: {
      email: userEmail,
      subscription: userSubscription,
      avatarURL,
    },
  });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const current = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.status(200).json({
    status: "success",
    code: 200,
    user: {
      email,
      subscription,
      avatarURL,
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

  const {
    _id: id,
    email,
    subscription: newSubscription,
    avatarURL,
  } = updatedUser;
  res.json({
    status: "success",
    code: 200,
    user: {
      id,
      email,
      newSubscription,
      avatarURL,
    },
  });
};

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { path: tempDir, originalname } = req.file;
  const avatarImage = await Jimp.read(tempDir);
  avatarImage.resize(250, 250);
  avatarImage.write(tempDir);
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;
  try {
    const resultUpload = path.join(avatarsDir, imageName);
    await fs.rename(tempDir, resultUpload);
    const avatarURL = path.join("public", "avatars", imageName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.json({
      status: "success",
      code: 200,
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(tempDir);
    throw error;
  }
};
// ----------------------------------------------------
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw createError.NotFound("User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendEmailRequest = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new createError.NotFound("User not found");
  }

  if (user.verify) {
    throw new createError.BadRequest("Verification has already been passed");
  }

  const verificationToken = nanoid();

  await User.findByIdAndUpdate(user._id, {
    verificationToken,
  });
  const mail = {
    to: email,
    subject: "E-mail verification",
    html: `<a href="http://localhost:3000/api/user/verify/${verificationToken}" target="_blank">Click to verify your e-mail address</a>`,
  };

  await sendVerificationEmail(mail);
  res.json({
    status: "success",
    code: 200,
    message: "Verification email sent",
  });
};

module.exports = {
  registration,
  logIn,
  current,
  logOut,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendEmailRequest,
};
