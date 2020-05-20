const jwt = require('jsonwebtoken');
const getRandomValues = require('get-random-values');
const config = require('config');
const { promisify } = require('util');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const createToken = (user) => {
  const exp = new Date();
  exp.setDate(exp.getDate() + 30);

  const data = {
    // https://auth0.com/docs/tokens/jwt-claims
    sub: user,
    iss: 'Carrott',
    exp: exp.getTime() / 1000,
    aud: 'Carrott',
    nbf: new Date(Date.now()).getTime() / 1000,
    iat: new Date(Date.now()).getTime() / 1000,
    jti: uuidv4(),
  };

  const opt = {
    algorithm: 'RS256',
  };

  return sign(data, config.jwt.privateKey, opt);
};

const verifyAndDecodeToken = async (token) => {
  let decoded;
  try {
    decoded = await verify(token, config.get('jwt.publicKey'));
  } catch (e) {
    return { isValid: false, reason: e.message };
  }
  return { isValid: true, decoded };
};

const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

module.exports = {
  createToken,
  verifyAndDecodeToken,
};
