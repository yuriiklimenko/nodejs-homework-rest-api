const service = require("../service");

const get = async (req, res, next) => {
  const results = await service.getAllContacts();
  res.json({
    status: "success",
    code: 200,
    data: {
      contacts: results,
    },
  });
};

const getById = async (req, res, next) => {
  const { id } = req.params;

  const result = await service.getContactById(id);

  if (result) {
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } else {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found contact id: ${id}`,
      data: "Not Found",
    });
  }
};

const create = async (req, res, next) => {
  const result = await service.createContact(req.body);

  res.status(201).json({
    status: "success",
    code: 201,
    data: { contact: result },
  });
};

const update = async (req, res, next) => {
  const { id } = req.params;

  const result = await service.updateContact(id, req.body);

  if (result) {
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } else {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found contact id: ${id}`,
      data: "Not Found",
    });
  }
};

const updateStatus = async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const { id } = req.params;
  const { favorite = false } = req.body;

  const result = await service.updateContact(id, { favorite });

  if (result) {
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } else {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found contact id: ${id}`,
      data: "Not Found",
    });
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  const result = await service.removeContact(id);
  if (result) {
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } else {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found contact id: ${id}`,
      data: "Not Found",
    });
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
