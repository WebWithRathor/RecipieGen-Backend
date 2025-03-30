export const successResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error ? error.toString() : null
    });
};

export const responses = {
    USER_NOT_FOUND: (res) => errorResponse(res, 404, "User not found"),
    INVALID_CREDENTIALS: (res) => errorResponse(res, 400, "Invalid email or password"),
    MISSING_CREDENTIALS: (res) => errorResponse(res, 400, "Missing email or password"),
    UNAUTHORIZED: (res) => errorResponse(res, 401, "Unauthorized access"),
    FORBIDDEN: (res) => errorResponse(res, 403, "Access forbidden"),
    SERVER_ERROR: (res, error) => errorResponse(res, 500, "Internal server error", error),
    ROUTE_NOT_FOUND: (res) => errorResponse(res, 404, "Route not found"),
    USER_ALREADY_EXISTS: (res) => errorResponse(res, 409, "User already exists"),
};
