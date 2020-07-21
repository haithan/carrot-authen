const { User, EmailToken } = require("../../models")();
const constants = require("../../constants");
const { validationResult } = require("express-validator");

module.exports = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: constants.VALIDATION_ERROR,
        errors: errors.array(),
      });
    }

    const { token } = req.query;
    const emailToken = await EmailToken.findOne({
      where: { token },
    });
    const user = await User.findOne({ where: { email: emailToken.email } });

    emailToken.used = new Date();
    await emailToken.save();
    user.verified = true;
    await user.save();

    res.json({ message: constants.VALIDATE_SUCCESS });
  } catch (err) {
    next(err);
  }
};
