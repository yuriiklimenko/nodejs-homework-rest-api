const express = require("express");
const router = express.Router();
const ctrlAuth = require("../controllers/authController");
const { asyncWrapper } = require("../helpers/apiHelpers");
const {
  authValidation,
  subscriptionValidation,
} = require("../helpers/validation_schema");
const { authMiddleware } = require("../middlewares/authMiddleware");
const validateBodySchema = require("../middlewares/validateBodySchema");

router.post(
  "/registration",
  validateBodySchema(authValidation),
  asyncWrapper(ctrlAuth.registration)
);
router.post(
  "/login",
  validateBodySchema(authValidation),
  asyncWrapper(ctrlAuth.logIn)
);

router.get("/current", authMiddleware, asyncWrapper(ctrlAuth.current));

router.post("/logout", authMiddleware, asyncWrapper(ctrlAuth.logOut));

router.patch(
  "/",
  authMiddleware,
  validateBodySchema(subscriptionValidation),
  asyncWrapper(ctrlAuth.updateSubscription)
);

module.exports = router;
