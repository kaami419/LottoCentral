const express = require("express");
const router = express.Router();
const ContactUsController = require("../../controller/contactUsController");
// const { authenticate } = require("../../middlewares/authMiddleware");

router.post("/submit", ContactUsController.contactUs);

module.exports = router;
