'use strict';

const SERVICES = require('../services');
const Joi = require('joi');

const { MESSAGES, ERROR_TYPES, AVAILABLE_AUTHS } = require('./constants');
const HELPERS = require('../helpers');
const multer = require('multer');
const uploadMiddleware = multer();

let routeUtils = {};

/**
 * function to create routes in the express.
 */
routeUtils.route = async (app, routes = []) => {
  routes.forEach(route => {
    let middlewares = [];
    if (route.joiSchema.formData) {
      const multerMiddleware = getMulterMiddleware(route.joiSchema.formData);
      middlewares = [multerMiddleware];
    }
    middlewares.push(getValidatorMiddleware(route));
    if (route.auth === AVAILABLE_AUTHS.USER) {
      middlewares.push(SERVICES.authService.userValidate());
    };
    app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route));
  });
};

/**
 * function to check the error of all joi validations
 * @param {*} joiValidatedObject 
 */
let checkJoiValidationError = (joiValidatedObject) => {
  if (joiValidatedObject.error) throw joiValidatedObject.error;
}

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} route 
 */
let joiValidatorMethod = async (request, route) => {
  if (route.joiSchema.params && Object.keys(route.joiSchema.params).length) {
    request.params = await Joi.object(route.joiSchema.params).validate(request.params);
    checkJoiValidationError(request.params);
  }
  if (route.joiSchema.body && Object.keys(route.joiSchema.body).length) {
    request.body = await Joi.object(route.joiSchema.body).validate(request.body);
    checkJoiValidationError(request.body);
  }
  if (route.joiSchema.query && Object.keys(route.joiSchema.query).length) {
    request.query = await Joi.object(route.joiSchema.query).validate(request.query);
    checkJoiValidationError(request.query);
  }
  if (route.joiSchema.headers && Object.keys(route.joiSchema.headers).length) {
    let headersObject = await Joi.object(route.joiSchema.headers).unknown().validate(request.headers);
    checkJoiValidationError(headersObject);
    request.headers.authorization = ((headersObject || {}).value || {}).authorization;
  }
  if (route.joiSchema.formData && route.joiSchema.formData.body && Object.keys(route.joiSchema.formData.body).length) {
    multiPartObjectParse(route.joiSchema.formData.body, request);
    request.body = await Joi.object(route.joiSchema.formData.body).validate(request.body);
    checkJoiValidationError(request.body);
  }
};


/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route 
 */
let getValidatorMiddleware = (route) => {
  return (request, response, next) => {
    joiValidatorMethod(request, route).then((result) => {
      return next();
    }).catch((err) => {
      let responseObject = HELPERS.responseHelper.createErrorResponse(err.message.toString(), ERROR_TYPES.BAD_REQUEST);
      return response.status(responseObject.statusCode).json(responseObject);
    });
  };
};

/**
 *  middleware to  to handle the multipart/form-data
 * @param {*} formData
 */
 let getMulterMiddleware = (formData) => {
  // for single file
  if (formData && Object.keys(formData).length) {
    const fileField = Object.keys(formData)[0];
    return uploadMiddleware.single(fileField);
  }
};

/**
 * middleware
 * @param {*} handler 
 */
let getHandlerMethod = (route) => {
  let handler = route.handler
  return (request, response) => {
    let payload = {
      ...((request.body || {}).value || {}),
      ...((request.params || {}).value || {}),
      ...((request.query || {}).value || {}),
      file: request.file || {},
      user: (request.user ? request.user : {})
    };
    //request handler/controller
    if (route.getExactRequest) {
      request.payload = payload;
      payload = request
    }
    handler(payload)
      .then((result) => {
        response.status(result.statusCode).json(result);
      })
      .catch((err) => {
        console.log('Error is ', err);
        if (!err.statusCode && !err.status) {
          err = HELPERS.responseHelper.createErrorResponse(MESSAGES.SOMETHING_WENT_WRONG, ERROR_TYPES.INTERNAL_SERVER_ERROR);
        }
        response.status(err.statusCode).json(err);
      });
  };
};

module.exports = routeUtils;
