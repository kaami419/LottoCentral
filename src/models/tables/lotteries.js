// src/models/tables/lotteries.js

module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;

  const Lottery = sequelize.define(
    "lotteries",
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
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      priceType: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiryTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // Add other fields as needed
    },
    {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      tableName: "lotteries",
    }
  );
  // Lottery.sync({ alter: true });

  return Lottery;
};
