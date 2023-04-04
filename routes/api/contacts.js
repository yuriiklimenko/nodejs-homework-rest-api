const express = require("express");

const {
  addContactValidation,
  updateContactValidation,
} = require("../../middlewares/validationMiddleware");

const {
  getListContacts,
  getContactById,
  addContact,
  deleteContacts,
  updateContact,
} = require("../../controllers/contactsController");

const router = express.Router();

router.get("/", getListContacts);

router.get("/:contactId", getContactById);

router.post("/", addContactValidation, addContact);

router.delete("/:contactId", deleteContacts);

router.put("/:contactId", updateContactValidation, updateContact);

module.exports = router;
