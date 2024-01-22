const nodemailer = require("nodemailer");
const { Our_Email } = require("../utils/common");
const { ContactUsModel } = require("../models");
const { logger } = require("../utils/logger");

// Create a nodemailer transporter with your email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "Gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "rohabkhan3585@gmail.com",
    pass: "ccyu whaf ehdv chud",
  },
});

// ...

// ContactUs API
async function contactUs(req, res, next) {
  logger().info("running contact us function");
  const { name, email, message } = req.body;

  try {
    // Create email options
    const mailOptions = {
      from: email,
      to: Our_Email,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    await ContactUsModel.create({
      name: name,
      email: email,
      message: message,
    });

    return res.status(200).json({
      status: 200,
      message: "Contact form submitted successfully!",
    });
  } catch (error) {
    logger().error("Error in sending email:", error);
    next(error);
  }
}

module.exports = {
  contactUs,
};
