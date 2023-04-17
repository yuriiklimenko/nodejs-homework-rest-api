const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");
const { errorHandlerRoute, errorHandler } = require("./helpers/apiHelpers");

require("dotenv").config();

const app = express();

app.use(express.json());
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
const contactsRouter = require("./api/index");

app.use("/api/contacts", contactsRouter);

app.use(errorHandlerRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb);

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);

    process.exit(1);
  });
