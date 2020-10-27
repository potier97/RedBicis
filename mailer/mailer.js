const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");


let mailConfig;
if (process.env.NODE_ENV === "production") {
  const options = {
    auth: {
      api_key: process.env.SENDGRID_API_SECRET,
    },
  };
  mailConfig = sgTransport(options);
} else {
  if (process.env.NODE_ENV === "staging") {
    console.log("XXXXX");
    const options = {
      auth: {
        api_key: process.env.SENDGRID_API_SECRET,
      },
    };
    mailConfig = sgTransport(options);
  } else {
    mailConfig = {
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.NODE_USERS,
        pass: process.env.NODE_PASSWORDS 
      },
    };
  }
}

module.exports = nodemailer.createTransport(mailConfig);
