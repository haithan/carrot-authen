const { User, ResetToken } = require("../../database/models")();

module.exports = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    if (!token)
      throw { message: "no token provided", response: { status: 400 } };

    const resetToken = await ResetToken.findOne({
      where: {
        token,
        used: null,
        expiration: {
          [Op.gte]: new Date(),
        },
      },
    });
    if (!resetToken) throw { message: "no match", response: { status: 404 } };

    const user = await User.findOne({ where: { email: resetToken.email } });
    if (!user) throw { message: "no match", response: { status: 404 } };

    resetToken.used = new Date();
    await resetToken.save();
    user.setPassword(password);
    await user.save();

    res.json({ message: "sucessfully updated" });
  } catch (err) {
    next(err);
  }
};
