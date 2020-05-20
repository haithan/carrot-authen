const nodemailer = require('nodemailer');

module.exports = async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hello@carrott.com',
      pass: '18260432Slk!',
    },
  });
};
