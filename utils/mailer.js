const nodemailer = require("nodemailer");
const {
  user,
  eport,
  pass,
  host,
  service,
  secure,
  noreply,
} = require("../config");

module.exports = async (email, subject, text) => {
  try {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: user,
        pass: pass,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });

    await transport.sendMail({
      from: user,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email delivered succesfully");
  } catch (error) {
    console.log(error);
  }
};
