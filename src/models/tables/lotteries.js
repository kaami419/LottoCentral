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
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiryTime: {
        type: DataTypes.DATE,
        allowNull: false,
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
  // Lottery.sync({ force: true });

  return Lottery;
};
