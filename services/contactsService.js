const Contact = require("./schemas/contact");

const getAllContacts = (userId, queryReq) => {
  const { page = 1, limit = 20, favorite, name, email } = queryReq;

  const query = {
    owner: userId,
  };

  if (favorite) {
    query.favorite = favorite;
  }

  if (name) {
    query.name = name;
  }

  if (email) {
    query.email = email;
  }

  return Contact.find(query, "", {
    // відаємо
    skip: (page - 1) * limit,

    limit: Number(limit),
  }).populate("owner", "_id email subscription");
};

const getContactById = (contactId, userId) => {
  return Contact.findOne({ _id: contactId, owner: userId });
};

const createContact = (credential, userId) => {
  return Contact.create({ ...credential, owner: userId });
};

const updateContact = (contactId, fields, userId) => {
  return Contact.findOneAndUpdate({ _id: contactId, owner: userId }, fields, {
    new: true,
  });
};

const removeContact = (id, userId) => {
  return Contact.findOneAndRemove({ _id: id, owner: userId });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
