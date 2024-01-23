const { sequelize, Sequelize } = require("../database");
// /**/ import tables
const User = require("./tables/users");
const InquiryUsers = require("./tables/inquiryUsers");
const Lottery = require("./tables/lotteries");
const ContactUs = require("./tables/contactUs");

// /**/ initialize tables
const UserModel = User(sequelize, Sequelize);
const InquiryUsersModel = InquiryUsers(sequelize, Sequelize);
const LotteryModel = Lottery(sequelize, Sequelize);
const ContactUsModel = ContactUs(sequelize, Sequelize);

// /**/ initiate junction tables

//  /**/ associate models

//  /**/ export models
module.exports = {
  UserModel,
  InquiryUsersModel,
  LotteryModel,
  ContactUsModel,
};
