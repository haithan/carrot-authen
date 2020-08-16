const { User } = require("../../models")();
const { createToken } = require("../../utils/jwt-token");
const axios = require("axios");

module.exports = async (req, res, next) => {
  try {
    const { token } = req.body;

    const { data } = await axios({
      method: "get",
      url: `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`,
    });

    console.log(data);
    const { id, name, email } = data;
    const user = await User.findOne({ where: { facebookId: id } });
    if (user) {
      const token = await createToken(user);
      res.status(200).json({
        auth: true,
        token,
      });
    } else {
      console.log("no user here");
      const u = await User.upsert({
        email,
        facebookId: id,
        verified: true,
      });
      const token = await createToken(u);
      res.status(200).json({
        auth: true,
        token,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
