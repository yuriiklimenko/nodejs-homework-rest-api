const service = require("../services/contactsService");
const createError = require("http-errors");

const get = async (req, res, next) => {
  const { id: userId } = req.user;

  const results = await service.getAllContacts(userId, req.query);

  res.json({
    status: "success",
    code: 200,
    data: {
      contacts: results,
    },
  });
};

const getById = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id } = req.params;
  const result = await service.getContactById(id, userId);

  if (result) {
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } else {
    throw createError.NotFound(`Not found contact id: ${id}`);
  }
};

const create = async (req, res, next) => {
  const { id: userId } = req.user;
  const result = await service.createContact(req.body, userId);

  res.status(201).json({
    status: "success",
    code: 201,
    data: { contact: result },
  });
};

const update = async (req, res, next) => {
  const { id: contactId } = req.params;
  const { id: userId } = req.user;

  const result = await service.updateContact(contactId, req.body, userId);

  if (result) {
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } else {
    throw createError.NotFound(`Not found contact id: ${contactId}`);
  }
};

const updateStatus = async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const { id: userId } = req.user;
  const { id } = req.params;
  const { favorite = false } = req.body;

  const result = await service.updateContact(id, { favorite }, userId);

  if (result) {
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } else {
    throw createError.NotFound(`Not found contact id: ${id}`);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  const { id: userId } = req.user;

  const result = await service.removeContact(id, userId);
  if (result) {
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } else {
    throw createError.NotFound(`Not found contact id: ${id}`);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
};
