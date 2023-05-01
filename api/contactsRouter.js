const express = require("express");
const router = express.Router();
const ctrlContacts = require("../controllers/contactsController");
const { asyncWrapper } = require("../helpers/apiHelpers");
const { authMiddleware } = require("../middlewares");

router.use(authMiddleware);

router.get("/", asyncWrapper(ctrlContacts.get));

router.get("/:id", asyncWrapper(ctrlContacts.getById));

router.post("/", asyncWrapper(ctrlContacts.create));

router.put("/:id", asyncWrapper(ctrlContacts.update));

router.delete("/:id", asyncWrapper(ctrlContacts.remove));

router.patch("/:id/favorite", asyncWrapper(ctrlContacts.updateStatus));

module.exports = router;
