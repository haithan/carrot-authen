const nodemailer = require("nodemailer");
const config = require("config");
const { createToken } = require("../../utils/jwt-token");
const User = require("../../database/models/User");
const ResetToken = require("../../database/models/ResetToken");

module.exports = async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.get("mailer.address"),
      pass: config.get("mailer.password"),
    },
  });

  const email = await User.findOne({ where: { email: req.body.email } });
  if (email == null) {
    return res.json({ status: "ok" });
  }

  await ResetToken.update(
    {
      used: 1,
    },
    {
      where: {
        email: req.body.email,
      },
    }
  );

  //Create a random reset token
  const token = await createToken("arandomtoken");

  console.log("------->", token);

  //token expires after one hour
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1 / 24);

  //insert token data into DB
  await ResetToken.create({
    email: req.body.email,
    expiration: expireDate,
    token: token,
    used: 0,
  });

  //create email
  const message = {
    from: "hello@carrott.com",
    to: req.body.email,
    subject: "Your password reset request",
    text:
      "To reset your password, please click the link below.\n\nhttps://" +
      "/user/reset-password?token=" +
      encodeURIComponent(token) +
      "&email=" +
      req.body.email,
  };

  //send email
  transporter.sendMail(message, function (err, info) {
    /* istanbul ignore next */
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  return res.json({ status: "ok" });
};
