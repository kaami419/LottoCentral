// src/models/tables/admins.js

module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;

  const Admin = sequelize.define(
    "admins",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      // Add other fields as needed
    },
    {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      tableName: "admins",
    }
  );

  return Admin;
};
