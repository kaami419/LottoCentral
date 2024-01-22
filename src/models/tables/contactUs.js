// src/models/tables/admins.js

module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;

  const ContactUs = sequelize.define(
    "contact_us",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // Add other fields as needed
    },
    {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      tableName: "contact_us",
    }
  );

  //   ContactUs.sync({ force: true });

  return ContactUs;
};
