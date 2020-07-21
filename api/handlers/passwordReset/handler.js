const { User, ResetToken } = require("../../models")();
const constants = require("../../constants");
const socket = require("../../utils/notification");

module.exports = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const { email } = req.user;
      const { current_password, new_password, confirm_password } = req.body;

      const user = await User.findOne({ where: { email } });
      const isPassword = await user.validatePassword(current_password);

      if (isPassword) {
        if (new_password === confirm_password) {
          await user.setPassword(new_password);
          await user.save();
          res.json({ message: constants.PASSWORD_SUCCESS });
        } else {
          throw {
            message: constants.PASSWORD_NOMATCH,
            response: { status: 400 },
          };
        }
      } else {
        throw {
          message: constants.PASSWORD_INCORRECT,
          response: { status: 400 },
        };
      }
    } else {
      const { email, token, new_password, confirm_password } = req.body;

      if (!token) {
        const user = User.findOne({ where: { email } });
        if (!user) res.json({ message: constants.EMAIL_SENT });
        else {
          const resetToken = await ResetToken.create({ email });
          socket.emit("emailMessage", {
            type: "resetPassword",
            to: email,
            content: resetToken.token,
          });
          res.json({ message: constants.EMAIL_SENT });
        }
      } else {
        const resetToken = await ResetToken.findOne({ where: { token } });
        const user = await User.findOne({ where: { email: resetToken.email } });
        if (new_password === confirm_password) {
          await user.setPassword(new_password);
          await user.save();
          res.json({ message: constants.PASSWORD_SUCCESS });
        } else {
          throw {
            message: constants.PASSWORD_NOMATCH,
            response: { status: 400 },
          };
        }
      }
    }
  } catch (err) {
    next(err);
  }
};
