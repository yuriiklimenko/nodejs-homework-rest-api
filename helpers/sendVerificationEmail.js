const nodemailer = require("nodemailer");
require("dotenv").config();

const { EMAIL_ADDRESS, EMAIL_PASSWORD, EMAIL_USER } = process.env;

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (data) => {
  const email = { ...data, from: EMAIL_ADDRESS };
  await transporter.sendMail(email);
  return true;
};

module.exports = sendVerificationEmail;
