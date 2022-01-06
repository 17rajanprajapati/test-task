const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const HELPERS = require("../helpers");
const { userModel } = require(`../models`);
const { decryptJwt } = require('../utils/utils');

let authService = {};

/**
 * function to authenticate user.
 */
authService.userValidate = () => {
    return (request, response, next) => {
        validateUser(request).then((result) => {
            if (result.isAuthorized) {
                return next();
            }
            let responseObject = HELPERS.responseHelper.createErrorResponse(result.msg || MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        }).catch((err) => {
            let responseObject = HELPERS.responseHelper.createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        });
    };
};


/**
 * function to validate user's jwt token and fetch its details from the system. 
 * @param {} request 
 */
let validateUser = async (request) => {
    try {
        let decodedToken;
        try {
            decodedToken = decryptJwt(request.headers.authorization)
        } catch (err) {
            return { isAuthorized: false, msg: MESSAGES.SESSION_EXPIRED }
        }
        let authenticatedUser = await userModel.findOne({ _id: decodedToken.id }).lean();
        if (authenticatedUser) {
            request.user = authenticatedUser;
            return { isAuthorized: true };
        }
        return { isAuthorized: false };
    } catch (err) {
        return { isAuthorized: false };
    }
};

module.exports = authService;