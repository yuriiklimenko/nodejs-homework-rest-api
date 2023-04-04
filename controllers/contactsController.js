const model = require("../models/contacts");

const getListContacts = async (req, res, next) => {
  const contacts = await model.getListContacts();
  res.json({
    status: "success",
    code: 200,
    data: {
      contacts,
    },
  });
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;

  const contactById = await model.getContactById(contactId);

  if (!contactById) {
    return next();
  }

  res.json({
    status: "success",
    code: 200,
    data: contactById,
  });
};

const addContact = async (req, res, next) => {
  const newContact = await model.addContact(req.body);

  res.json({
    status: "success",
    code: 201,
    data: newContact,
  });
};

const deleteContacts = async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await model.removeContact(contactId);
  if (!deletedContact) {
    return next();
  }

  res.json({
    status: "success",
    code: 200,
    contact: deletedContact,
    message: "Contact deleted",
  });
};

const updateContact = async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing fields" });
  }

  const { contactId } = req.params;

  const updatedContact = await model.updateContact(contactId, req.body);

  if (!updatedContact) {
    return next();
  }

  res.json({
    status: "success",
    code: 200,
    data: updatedContact,
  });
};

module.exports = {
  getListContacts,
  getContactById,
  deleteContacts,
  addContact,
  updateContact,
};
