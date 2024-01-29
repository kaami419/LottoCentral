const nodemailer = require("nodemailer");
const { NodeMailerEmail } = require("../utils/common");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "Gmail",
  port: 587,
  // secure: false,
  auth: {
    user: NodeMailerEmail,
    pass: process.env.PASS,
  },
});

module.exports = {
  transporter,
};
