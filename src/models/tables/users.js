module.exports = (sequelize, Sequelize) => {
  const DataTypes = Sequelize.DataTypes;

  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        min: 1,
        max: 100,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
      },
      userName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: {
          args: true,
          msg: "Username already in use",
        },
      },
      isAuthUser: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      // define the table's name
      tableName: "users",
    }
  );

  // User.sync({ force: true });

  return User;
};
