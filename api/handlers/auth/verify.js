const { User, EmailToken } = require("../../database/models")();

module.exports = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token)
      throw { message: "no token provided", response: { status: 400 } };

    const emailToken = await EmailToken.findOne({
      where: { token, used: null },
    });
    if (!emailToken) throw { message: "no match", response: { status: 404 } };

    const user = await User.findOne({ where: { email: emailToken.email } });
    if (!user) throw { message: "no match", response: { status: 404 } };

    emailToken.used = new Date();
    await emailToken.save();
    user.verified = true;
    await user.save();

    res.json({ message: "sucessfully verified" });
  } catch (err) {
    next(err);
  }
};
