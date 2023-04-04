require("dotenv").config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV,
  },
  database: {
    url: process.env.MONGODB_URL,
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    dbName: process.env.MONGODB_DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || "1d",
  },
};

export default config;
