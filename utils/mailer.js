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
    const transport = nodemailer.createTransport({
      host: host,
      service: service,
      port: Number(eport),
      secure: Boolean(secure),
      auth: {
        user: user,
        pass: pass,
      },
    });

    await transport.sendMail({
      from: noreply,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email delivered succesfully");
  } catch (error) {
    console.log(error.message);
  }
};
