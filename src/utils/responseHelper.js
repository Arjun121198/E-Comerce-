/**
 * Helper function to send a success response
 * @param {Object} res - The response object
 * @param {number} statusCode - The HTTP status code
 * @param {string} message - The success message
 * @param {Object} [data] - Optional data to send in response
 */
const successResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Helper function to send an error response
 * @param {Object} res - The response object
 * @param {number} statusCode - The HTTP status code
 * @param {string} message - The error message
 * @param {string} [error] - Optional error detail
 */
const errorResponse = (res, statusCode, message, error = '') => {
    return res.status(statusCode).json({
        success: false,
        message,
        error
    });
};

module.exports = {
    successResponse,
    errorResponse
};
