// src/models/tables/inquiry_users.js

module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;

  const InquiryUsers = sequelize.define(
    "inquiry_users",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
      },
    },
    {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      tableName: "inquiry_users",
    }
  );

  return InquiryUsers;
};
