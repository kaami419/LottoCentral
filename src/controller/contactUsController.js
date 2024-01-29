const { Our_Email } = require("../utils/common");
const { ContactUsModel } = require("../models");
const { logger } = require("../utils/logger");
const { transporter } = require("../utils/mailer");

// ...

// ContactUs API
async function contactUs(req, res, next) {
  logger().info("running contact us function");
  const { name, email, message } = req.body;

  try {
    await ContactUsModel.create({
      name: name,
      email: email,
      message: message,
    });
    logger().info("Contact Details Stored Successfully");
    // Create email options
    const mailOptions = {
      from: email,
      to: Our_Email,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    logger().info("Sending Mail");
    await transporter.sendMail(mailOptions);
    logger().info("Mail sent successfully");

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
