let RESPONSE = {
    ERROR: {
        DATA_NOT_FOUND: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 404,
                msg: msg,
                status: false,
                type: 'DATA_NOT_FOUND',
            };
        },
        BAD_REQUEST: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 400,
                msg: msg,
                status: false,
                type: 'BAD_REQUEST',
            };
        },
        ALREADY_EXISTS: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 400,
                msg: msg,
                status: false,
                type: 'ALREADY_EXISTS',
            };
        },
        INTERNAL_SERVER_ERROR: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 500,
                msg: msg,
                status: false,
                type: 'INTERNAL_SERVER_ERROR',
            };
        },
        UNAUTHORIZED: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 401,
                msg: msg,
                status: false,
                type: 'UNAUTHORIZED',
            };
        }
    },
    SUCCESS: {
        MISSCELANEOUSAPI: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 200,
                msg: msg,
                status: true,
                type: 'Default',
            };
        }
    }
};

/**
 * function to create a valid SUCCESS response object.
 * @param {*} message message that has to be pass in the response object.
 */
function createSuccessResponse(message) {
    return RESPONSE.SUCCESS.MISSCELANEOUSAPI(message);
}

/**
 * function to create a valid ERROR response object.
 * @param {*} message message that has to be pass in the response object.
 */
function createErrorResponse(message, errorType) {
    return RESPONSE.ERROR[errorType](message);
}

module.exports = {
    createErrorResponse: createErrorResponse,
    createSuccessResponse: createSuccessResponse
};
