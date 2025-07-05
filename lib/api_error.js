import {
    AUTH_ERROR_CODE,
    BAD_REQUEST_CODE,
    DUPLICATION_ERROR_CODE,
    INTERNAL_SERVER_ERROR_CODE,
    VALIDATION_ERROR_CODE
} from "./error_codes.js";

import {
    ALREADY_EXISTS_STATUS,
    BAD_REQUEST_STATUS,
    INTERNAL_SERVER_STATUS,
    NOT_AUTHORIZED_STATUS
} from "./status_codes.js";

class ApiError extends Error {
    constructor(message, code = INTERNAL_SERVER_ERROR_CODE, status = INTERNAL_SERVER_STATUS, details = []) {
        super(message);
        this.code = code;
        this.status = status;
        this.details = details;
    }
}

class ValidationError extends ApiError {
    constructor(details = []) {
        super("Validation failed", VALIDATION_ERROR_CODE, BAD_REQUEST_STATUS, details);
    }
}

class AuthError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, AUTH_ERROR_CODE, NOT_AUTHORIZED_STATUS);
    }
}

class DuplicationError extends ApiError {
    constructor(message = "Data is duplicated") {
        super(message, DUPLICATION_ERROR_CODE, ALREADY_EXISTS_STATUS);
    }
}

class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(message, BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
}



export {
    AuthError,
    ValidationError,
    DuplicationError,
    ApiError,
    BadRequestError
}