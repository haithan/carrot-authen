const jwt = require("jsonwebtoken");
const config = require("config");

const { User, Profile } = require("../../models")();
const { createToken } = require("../../utils/jwt-token");

module.exports = async (req, res, next) => {
  const { token, name, email } = req.body;
  try {
    const secretOrPublicKey = config.get("auth.apple.key");
    const tok = await jwt.decode(token, {
      algorithms: "RS256",
      audience: "org.reactjs.native.example.Carrott",
    });

    const user = await User.findOne({ where: { appleId: tok.email } });
    if (user) {
      const t = await createToken(user);
      res.status(200).json({
        auth: true,
        token: t,
      });
    } else {
      const u = await User.upsert({
        email,
        appleId: tok.email,
        verified: true,
      });
      const token = await createToken(u);

      const [first_name, last_name] = name.split(" ");
      await Profile.upsert({
        email,
        first_name,
        last_name,
      });

      res.status(200).json({
        auth: true,
        token,
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
