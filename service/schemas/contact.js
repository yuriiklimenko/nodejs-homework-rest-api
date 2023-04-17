const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 70,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      minlength: 3,
      maxlength: 170,
    },
    phone: {
      type: String,
      minlength: 3,
      maxlength: 170,
    },

    favorite: {
      type: Boolean,
      default: false,
    },
  },

  { versionKey: false, timestamps: true }
);

const Contact = mongoose.model("contact", contact);

module.exports = Contact;
