const jwt = require('jsonwebtoken');
const config = require('config');
const { promisify } = require('util');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const createToken = (sub, expireDate) => {
  // expire seconds in NumericDate
  const exp = new Date(expireDate).getTime() / 1000;
  return sign(
    // https://auth0.com/docs/tokens/jwt-claims
    {
      iss: 'carrott',
      sub,
      exp,
    },
    config.get('jwt.secret')
  );
};

const verifyAndDecodeToken = async token => {
  let decoded;
  try {
    decoded = await verify(token, config.get('jwt.secret'));
  } catch (e) {
    return { isValid: false, reason: e.message };
  }
  return { isValid: true, decoded };
};

module.exports = {
  createToken,
  verifyAndDecodeToken,
};