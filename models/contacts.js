const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const getListContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");

    return JSON.parse(contacts);
  } catch (error) {
    throw new Error(error);
  }
};

const getContactById = async (contactId) => {
  const contacts = await getListContacts();
  const contactById = contacts.find((contact) => contact.id === contactId);
  return contactById;
};

const removeContact = async (contactId) => {
  try {
    const contacts = await getListContacts();
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    if (filteredContacts.length === contacts.length) {
      console.log(`There is no contact with id-${contactId}`);
      return null;
    } else {
      const deletedContact = await getContactById(contactId);
      fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
      console.log(`Contact with id-${contactId} has been deleted`);
      return deletedContact;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await getListContacts();
    const newContact = { id: v4(), name, email, phone };
    const isContactExists = contacts.find((contact) => contact.name === name);
    if (isContactExists) {
      console.log(`A contact with the name ${name} already exists!`);
    } else {
      contacts.push(newContact);
      fs.writeFile(contactsPath, JSON.stringify(contacts));
      console.log(`Contact named ${name} added`);
      return newContact;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateContact = async (contactId, body) => {
  const contacts = await getListContacts();

  const index = contacts.findIndex(({ id }) => id === contactId);

  if (index === -1) {
    return null;
  }

  contacts[index] = { ...contacts[index], ...body };

  fs.writeFile(contactsPath, JSON.stringify(contacts));

  return contacts[index];
};

module.exports = {
  getListContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
