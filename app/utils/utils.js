let CONSTANTS = require('./constants');
const BCRYPT = require("bcrypt");
const JWT = require("jsonwebtoken");

let commonFunctions = {};

/**
 * function to hash normal password string.
 * @param {*} payloadString -- normal password string
 * @returns 
 */
commonFunctions.hashPassword = async (payloadString) => {
  return BCRYPT.hashSync(payloadString, await BCRYPT.genSalt());
};

/**
 * function to compare passwords
 * @param {*} payloadPassword -- normal password string
 * @param {*} userPasswordHash -- user's password hash
 * @returns 
 */
commonFunctions.compareHash = (payloadPassword, userPasswordHash) => {
  return BCRYPT.compareSync(payloadPassword, userPasswordHash);
};

/**
 * function to encrypt/create JWT token.
 * @param {*} payload  -- contains data for JWT payload.
 * @returns 
 */
commonFunctions.encryptJwt = (payload) => {
  let token = JWT.sign(payload, CONSTANTS.SECURITY.JWT_SIGN_KEY, {
    algorithm: 'HS256',
    expiresIn: '15M'       // define expiry time here we take 15 minutes for now
  });
  return token;
};

/**
 * function to verify/decode the JWT token
 * @param {*} token 
 * @returns 
 */
commonFunctions.decryptJwt = (token) => {
  return JWT.verify(token, CONSTANTS.SECURITY.JWT_SIGN_KEY, { algorithm: 'HS256' })
};

module.exports = commonFunctions;

