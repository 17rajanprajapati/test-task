const HELPERS = require("../helpers");
const { MESSAGES, ERROR_TYPES, NORMAL_PROJECTION } = require('../utils/constants');
const SERVICES = require('../services');
const { compareHash, encryptJwt, hashPassword } = require(`../utils/utils`);
const { s3Bucket } = require('../../config');

let userController = {};

/**
 * function to register a user to the system.
 */
userController.registerNewUser = async (payload) => {
  let criteria = { email: payload.email };
  // check here if email is already exists in the database or not.
  let isUserAlreadyExists = await SERVICES.userService.getUser(criteria);
  if (!isUserAlreadyExists) {
    let newRegisteredUser = await SERVICES.userService.registerUser(payload);
    const dataForJwt = {
      id: newRegisteredUser._id,
      name: newRegisteredUser.name,
      date: Date.now()
    };
    return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.USER_REGISTERED_SUCCESSFULLY), { token: encryptJwt(dataForJwt) });
  }
  throw HELPERS.responseHelper.createErrorResponse(MESSAGES.EMAIL_ALREADY_EXISTS, ERROR_TYPES.BAD_REQUEST);
};

/**
 * Function to fetch user's profile from the system.
 */
userController.getUserProfile = async (payload) => {
  let criteria = { _id: payload.user._id };
  let user = await SERVICES.userService.getUser(criteria, { ...NORMAL_PROJECTION, password: 0 });
  if (user) {
    return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.PROFILE_FETCHED_SUCCESSFULLY), { data: user });
  }
  throw HELPERS.responseHelper.createErrorResponse(MESSAGES.NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND);
};

/**
 * Function to upload file.
 */
userController.uploadFile = async (payload) => {
  // check whether the request contains valid payload.
  if (!Object.keys(payload.file).length) {
    throw HELPERS.responseHelper.createErrorResponse(MESSAGES.FILE_REQUIRED_IN_PAYLOAD, ERROR_TYPES.BAD_REQUEST);
  }
  // remove all the whitespaces from filename and replace them with _.
  let fileName = payload.file.originalname.replace(/ /g, '_');
  fileName = `${Date.now()}_${fileName}`;
  let fileUrl = await SERVICES.fileUploadService.uploadFileToS3(payload.file.buffer, fileName, s3Bucket.BUCKET_NAME);
  return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.FILE_UPLOADED_SUCCESSFULLY), { fileUrl });
};

/**
 * function to login a user to the system.
 * @param {*} payload 
 * @returns 
 */
userController.login = async (payload) => {
  let user = await SERVICES.userService.getUser({ email: payload.email }, { ...NORMAL_PROJECTION });
  if (user) {
    // compare user's password.
    if (!compareHash(payload.password, user.password)) {
      throw HELPERS.responseHelper.createErrorResponse(MESSAGES.INVALID_PASSWORD, ERROR_TYPES.BAD_REQUEST);
    }

    // create data for JWT token.
    const dataForJwt = {
      id: user._id,
      name: user.name,
      date: Date.now()
    };
    delete user.password;
    return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.LOGGED_IN_SUCCESSFULLY), { data: { ...user }, token: encryptJwt(dataForJwt) });
  }
  throw HELPERS.responseHelper.createErrorResponse(MESSAGES.EMAIL_NOT_REGISTERED, ERROR_TYPES.BAD_REQUEST);
};

/**
 * Function to update profile of a user.
 * @param {*} payload 
 * @returns 
 */
userController.updateProfile = async (payload) => {
  if (payload.hasOwnProperty('email')) {
    let isAlreadyExistUser = await SERVICES.userService.getUser({ email: payload.email });
    if (isAlreadyExistUser) {
      let responseMessage = payload.user._id.equals(isAlreadyExistUser._id) ? MESSAGES.EMAIL_CANNOT_BE_SAME_AS_PREVIOUS_EMAIL : MESSAGES.EMAIL_ALREADY_EXISTS;
      throw HELPERS.responseHelper.createErrorResponse(responseMessage, ERROR_TYPES.BAD_REQUEST);
    }
  }

  // if user wants to change his password then compare old password.
  if (payload.hasOwnProperty('oldPassword')) {
    if (payload.oldPassword === payload.newPassword) {
      throw HELPERS.responseHelper.createErrorResponse(MESSAGES.OLD_PASSWORD_OR_NEW_PASSWORD_CANNOT_BE_SAME, ERROR_TYPES.BAD_REQUEST);
    }
    let user = await SERVICES.userService.getUser({ _id: payload.user._id });
    if (!compareHash(payload.oldPassword, user.password)) {
      throw HELPERS.responseHelper.createErrorResponse(MESSAGES.ENTERED_OLD_PASSWORD_IS_INCORRECT, ERROR_TYPES.BAD_REQUEST);
    }
    payload.password = await hashPassword(payload.newPassword);
  }
  let updatedUser = await SERVICES.userService.updateUser({ _id: payload.user._id }, payload, { lean: true, new: true, projection: { ...NORMAL_PROJECTION, password: 0 } });
  return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.USER_UPDATED_SUCCESSFULLY), { data: updatedUser });
};


/* export userController */
module.exports = userController;