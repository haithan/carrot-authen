const { validationResult } = require("express-validator");
const { User, ResetToken } = require("../../models")();
const constants = require("../../constants");
const socket = require("../../utils/notification");

module.exports = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: constants.VALIDATION_ERROR,
        errors: errors.array(),
      });
    }

    if (!req.isAuthenticated()) {
      throw {
        message: constants.UNAUTHORIZED,
        response: { status: 401 },
      };
    }

    const { id } = req.user;
    const { current_password, new_password } = req.body;

    const user = await User.findOne({ where: { id } });
    const isMatchedPassword = await user.validatePassword(current_password);

    if (!isMatchedPassword) {
      throw {
        message: constants.PASSWORD_INCORRECT,
        response: { status: 400 },
      };
    }

    await user.setPassword(new_password);
    await user.save();
    res.json({ message: constants.PASSWORD_SUCCESS });
  } catch (err) {
    next(err);
  }
};
