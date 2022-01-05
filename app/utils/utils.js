let CONSTANTS = require('./constants');
const BCRYPT = require("bcrypt");
const JWT = require("jsonwebtoken");

let commonFunctions = {};

/**
 * incrypt password in case user login implementation
 * @param {*} payloadString 
 */
commonFunctions.hashPassword = async (payloadString) => {
  return BCRYPT.hashSync(payloadString, await BCRYPT.genSalt());
};

/**
 * @param {string} plainText 
 * @param {string} hash 
 */
commonFunctions.compareHash = (payloadPassword, userPasswordHash) => {
  return BCRYPT.compareSync(payloadPassword, userPasswordHash);
};

/** create jsonwebtoken **/
commonFunctions.encryptJwt = (payload) => {
  let token = JWT.sign(payload, CONSTANTS.SECURITY.JWT_SIGN_KEY, {
    algorithm: 'HS256',
    expiresIn: '5M'       // define expiry time here we take 5 minutes for now
  });
  return token;
};

commonFunctions.decryptJwt = (token) => {
  return JWT.verify(token, CONSTANTS.SECURITY.JWT_SIGN_KEY, { algorithm: 'HS256' })
};

module.exports = commonFunctions;

