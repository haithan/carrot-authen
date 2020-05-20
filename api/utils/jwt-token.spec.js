const { createToken, verifyAndDecodeToken } = require('./jwt-token');
const { decode } = require('jsonwebtoken');
const { addDays, subDays } = require('date-fns');

const payloadSectionRegexp = /(?<=\.)[0-9a-zA-Z_-]+(?=\.)/g;
const signatureSectionRegexp = /(?<=\.)[0-9a-zA-Z_-]+$/g;

describe('jwt token utility', () => {
  const sessionID = '0123456789ABCD';
  // 1 year from now
  const expires = addDays(new Date(), 365).toString();

  it('sign a valid token', async () => {
    const token = await createToken(sessionID, expires);
    const { iss, sub, exp, iat } = decode(token);
    expect(iss).toEqual('carrott');
    expect(sub).toEqual(sessionID);
    expect(exp).toEqual(new Date(expires).getTime() / 1e3);
    // 3 sec precision
    expect(Date.now() / 1e3 - iat).toBeLessThan(3);
  });

  it('verify a valid token and decode it', async () => {
    const token = await createToken(sessionID, expires);
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
    const expired = subDays(new Date(), 1).toString();
    const token = await createToken(sessionID, expired);
    const { isValid, reason } = await verifyAndDecodeToken(token);
    expect(isValid).toBe(false);
    expect(reason).toBe('jwt expired');
  });

  it('verify a token with another signature should fail', async () => {
    const token = await createToken(sessionID, expires);
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
    const token = await createToken(sessionID, expires);
    // create a new sub
    const newToken = await createToken('ABCD0123456789', expires);
    const newPayload = newToken.match(payloadSectionRegexp)[0];
    // replace with new payload
    const tempered = token.replace(payloadSectionRegexp, newPayload);
    const { isValid, reason } = await verifyAndDecodeToken(tempered);
    expect(isValid).toBe(false);
    expect(reason).toBe('invalid signature');
  });
});