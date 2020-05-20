const { createToken, verifyAndDecodeToken } = require('./jwt-token');
const { decode } = require('jsonwebtoken');
// const { addDays, subDays } = require('date-fns');

const payloadSectionRegexp = /(?<=\.)[0-9a-zA-Z_-]+(?=\.)/g;
const signatureSectionRegexp = /(?<=\.)[0-9a-zA-Z_-]+$/g;

describe('jwt token utility', () => {
  const sessionID = '0123456789ABCD';
  const now = new Date();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  it('sign a valid token', async () => {
    const token = await createToken(sessionID, expires);
    const { iss, sub, exp, iat, aud, nbf } = decode(token);
    expect(iss).toEqual('Carrott');
    expect(sub).toEqual(sessionID);
    expect(Math.floor(exp)).toEqual(Math.floor(expires.getTime() / 1e3));
    expect(Math.floor(iat)).toEqual(Math.floor(now / 1e3));
    expect(Math.floor(nbf)).toEqual(Math.floor((now - 1000) / 1e3));
    // 3 sec precision
    expect(Date.now() / 1e3 - iat).toBeLessThan(3);
  });

  it('verify a valid token and decode it', async () => {
    const token = await createToken(sessionID);
    const { isValid, decoded } = await verifyAndDecodeToken(token);
    expect(isValid).toBe(true);
    expect(decoded).toEqual(
      expect.objectContaining({
        sub: sessionID,
      })
    );
  });

  it('verify an expired token should fail', async () => {
    // issue the token from yesterday
    const expired = new Date();
    expired.setDate(expired.getDate() - 33);
    const token = await createToken(sessionID, expired);
    const { isValid, reason } = await verifyAndDecodeToken(token);
    expect(isValid).toBe(false);
    expect(reason).toBe('jwt expired');
  });

  it('verify a token with another signature should fail', async () => {
    const token = await createToken(sessionID);
    const tempered = token.replace(
      signatureSectionRegexp,
      // bad signature
      'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    );
    const { isValid, reason } = await verifyAndDecodeToken(tempered);
    expect(isValid).toBe(false);
    expect(reason).toBe('invalid signature');
  });

  it('verify a tampered token should fail', async () => {
    const token = await createToken(sessionID);
    // create a new sub
    const newToken = await createToken('ABCD0123456789');
    const newPayload = newToken.match(payloadSectionRegexp)[0];
    // replace with new payload
    const tempered = token.replace(payloadSectionRegexp, newPayload);
    const { isValid, reason } = await verifyAndDecodeToken(tempered);
    expect(isValid).toBe(false);
    expect(reason).toBe('invalid signature');
  });
});
