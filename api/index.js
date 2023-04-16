const express = require("express");
const router = express.Router();
const ctrlContacts = require("../controller");
const { asyncWrapper } = require("../helpers/apiHelpers");

router.get("/", asyncWrapper(ctrlContacts.get));

router.get("/:id", asyncWrapper(ctrlContacts.getById));

router.post("/", asyncWrapper(ctrlContacts.create));

router.put("/:id", asyncWrapper(ctrlContacts.update));

router.delete("/:id", asyncWrapper(ctrlContacts.remove));

router.patch("/:id/favorite", asyncWrapper(ctrlContacts.updateStatus));

module.exports = router;
