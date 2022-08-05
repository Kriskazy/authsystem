const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  user: process.env.MAIL_USERNAME,
  pass: process.env.MAIL_PASSWORD,
  port: process.env.PORT,
  eport: process.env.EMAIL_PORT,
  db: process.env.DB_URL,
  tokensecret: process.env.SECRET,
  host: process.env.HOST,
  service: process.env.SERVICE,
  secure: process.env.SECURE,
  noreply: process.env.NOREPLY,
  url: process.env.BASE_URL,
};
