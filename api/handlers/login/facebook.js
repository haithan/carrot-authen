const { User, Profile } = require("../../models")();
const { createToken } = require("../../utils/jwt-token");
const axios = require("axios");
const aws = require("aws-sdk");
const config = require("config");

const s3 = new aws.S3({
  accessKeyId: config.get("s3.id"),
  secretAccessKey: config.get("s3.secret"),
  region: "eu-west-2",
  bucket: config.get("s3.bucket"),
});

module.exports = async (req, res, next) => {
  try {
    const { token } = req.body;

    const { data } = await axios({
      method: "get",
      url: `https://graph.facebook.com/me?fields=id,name,email,picture.height(961)&access_token=${token}`,
    });

    console.log(data);
    const { id, name, email, picture } = data;
    const user = await User.findOne({ where: { facebookId: id } });
    if (user) {
      const token = await createToken(user);
      res.status(200).json({
        auth: true,
        token,
      });
    } else {
      const u = await User.upsert({
        email,
        facebookId: id,
        verified: true,
      });
      const token = await createToken(u);

      const [first_name, last_name] = name.split(" ");
      const url = picture.data.url;
      const buffer = await axios({
        method: "get",
        url,
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
  }
};
