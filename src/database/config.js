const config = {
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "Password_123",
  database: process.env.DB_DATABASE || "Lotto_Db",
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
};

console.log(config);

module.exports = {
  ...config,
  dialect: "mysql",
  define: {
    timestamps: false,
  },
  pool: {
    max: 5,
    mind: 0,
    acquire: 30000,
    idle: 10000,
  },
};
