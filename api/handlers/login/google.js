const config = require("config");
const axios = require("axios");
const aws = require("aws-sdk");

const { OAuth2Client } = require("google-auth-library");

const { User, Profile } = require("../../models")();
const { createToken } = require("../../utils/jwt-token");

const s3 = new aws.S3({
  accessKeyId: config.get("s3.id"),
  secretAccessKey: config.get("s3.secret"),
  region: "eu-west-2",
  bucket: config.get("s3.bucket"),
});

const client = new OAuth2Client(config.get("auth.google.id"));

module.exports = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.get("auth.google.id"),
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];

    const { sub: googleId, email, name, picture } = payload;
    const user = await User.findOne({ where: { googleId } });
    if (user) {
      const token = await createToken(user);
      res.status(200).json({
        auth: true,
        token,
      });
    } else {
      const u = await User.upsert({
        email,
        googleId,
        verified: true,
      });
      const token = await createToken(u);

      const [first_name, last_name] = name.split(" ");
      const buffer = await axios({
        method: "get",
        url: picture,
        responseType: "arraybuffer",
      });

      const { Location } = await s3
        .upload({
          Bucket: config.get("s3.bucket"),
          Key: Date.now().toString(),
          Body: Buffer.from(buffer.data, "binary"),
          ACL: "public-read",
        })
        .promise();

      await Profile.upsert({
        email,
        first_name,
        last_name,
        image_url: Location,
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
