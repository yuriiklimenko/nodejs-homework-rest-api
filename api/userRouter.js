const express = require("express");
const router = express.Router();
const ctrlUser = require("../controllers/userController");
const { asyncWrapper } = require("../helpers/apiHelpers");
const {
  authValidation,
  subscriptionValidation,
} = require("../helpers/validation_schema");
const {
  uploadFile,
  authMiddleware,
  validateBodySchema,
} = require("../middlewares");

router.post(
  "/registration",
  validateBodySchema(authValidation),
  asyncWrapper(ctrlUser.registration)
);
router.post(
  "/login",
  validateBodySchema(authValidation),
  asyncWrapper(ctrlUser.logIn)
);

router.get("/current", authMiddleware, asyncWrapper(ctrlUser.current));

router.post("/logout", authMiddleware, asyncWrapper(ctrlUser.logOut));

router.patch(
  "/",
  authMiddleware,
  validateBodySchema(subscriptionValidation),
  asyncWrapper(ctrlUser.updateSubscription)
);

router.patch(
  "/avatar",
  authMiddleware,
  uploadFile.single("avatar"),
  asyncWrapper(ctrlUser.updateAvatar)
);

module.exports = router;
