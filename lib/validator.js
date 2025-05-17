import { ApiError } from "./api_error.js"
import { BAD_REQUEST_STATUS } from "./status_codes.js"
import promiseAsyncWrapper from "./wrappers/promise_async_wrapper.js"

class Validator {
    static async validateNotNull(fields) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                let errors = []

                for (let field of Object.keys(fields)) {
                    const value = fields[field]
                    if (value === null || value === undefined || value === "" || 
                        (typeof value === 'string' && value.trim() === "") ||
                        (Array.isArray(value) && value.length === 0) ||
                        (typeof value === 'object' && Object.keys(value).length === 0)) {
                        errors.push({ field, error: `${field} cannot be null, empty, or undefined` })
                    }
                }

                if (errors.length > 0) {                    
                    let error = new ApiError(JSON.stringify(errors), BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

    static async isEmail(email) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                if (!email || !regex.test(String(email).toLowerCase())) {
                    let error = new ApiError(`Invalid email format: ${email}`, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

    static async validateFile(file, options = {}) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const {
                    required = true,
                    fieldName = 'file',
                    allowedTypes = [],
                    maxSize = 5 * 1024 * 1024, // 5MB default
                } = options

                if (required && (!file || !file.buffer)) {
                    return reject(new ApiError(`${fieldName} is required`, BAD_REQUEST_STATUS))
                }

                if (file) {
                    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
                        return reject(new ApiError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, BAD_REQUEST_STATUS))
                    }

                    if (file.size > maxSize) {
                        return reject(new ApiError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`, BAD_REQUEST_STATUS))
                    }
                }

                return resolve(true)
            }
        ))
    }

    static async isNumber(value, options = {}) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const {
                    min = Number.MIN_SAFE_INTEGER,
                    max = Number.MAX_SAFE_INTEGER,
                    integer = false
                } = options

                const num = Number(value)
                
                if (isNaN(num)) {
                    return reject(new ApiError(`${value} is not a valid number`, BAD_REQUEST_STATUS))
                }

                if (integer && !Number.isInteger(num)) {
                    return reject(new ApiError(`${value} must be an integer`, BAD_REQUEST_STATUS))
                }

                if (num < min || num > max) {
                    return reject(new ApiError(`${value} must be between ${min} and ${max}`, BAD_REQUEST_STATUS))
                }

                return resolve(true)
            }
        ))
    }

    static async isText(text, options = {}) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const {
                    minLength = 0,
                    maxLength = Number.MAX_SAFE_INTEGER,
                    pattern = null,
                    trim = true
                } = options

                if (typeof text !== 'string') {
                    return reject(new ApiError(`Value must be a string`, BAD_REQUEST_STATUS))
                }

                const value = trim ? text.trim() : text
                
                if (value.length < minLength || value.length > maxLength) {
                    return reject(new ApiError(
                        `Text length must be between ${minLength} and ${maxLength} characters`,
                        BAD_REQUEST_STATUS
                    ))
                }

                if (pattern && !pattern.test(value)) {
                    return reject(new ApiError(`Text does not match required pattern`, BAD_REQUEST_STATUS))
                }

                return resolve(true)
            }
        ))
    }

    static async isArray(array, options = {}) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const {
                    minLength = 0,
                    maxLength = Number.MAX_SAFE_INTEGER,
                    unique = false,
                    arrayName = "array"
                } = options

                if (!Array.isArray(array)) {
                    return reject(new ApiError(`${arrayName} must be an array`, BAD_REQUEST_STATUS))
                }

                if (array.length < minLength || array.length > maxLength) {
                    return reject(new ApiError(
                        `${arrayName} length must be between ${minLength} and ${maxLength}`,
                        BAD_REQUEST_STATUS
                    ))
                }

                if (unique && new Set(array).size !== array.length) {
                    return reject(new ApiError(`${arrayName} must contain unique values`, BAD_REQUEST_STATUS))
                }

                return resolve(true)
            }
        ))
    }

    static async isDate(date, options = {}) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const {
                    minDate = null,
                    maxDate = null,
                    format = null
                } = options

                let dateObj
                try {
                    dateObj = new Date(date)
                    if (isNaN(dateObj.getTime())) throw new Error()
                } catch {
                    return reject(new ApiError(`Invalid date format`, BAD_REQUEST_STATUS))
                }

                if (minDate && dateObj < new Date(minDate)) {
                    return reject(new ApiError(`Date must be after ${minDate}`, BAD_REQUEST_STATUS))
                }

                if (maxDate && dateObj > new Date(maxDate)) {
                    return reject(new ApiError(`Date must be before ${maxDate}`, BAD_REQUEST_STATUS))
                }

                return resolve(true)
            }
        ))
    }

    static async isURL(url) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                try {
                    new URL(url)
                    return resolve(true)
                } catch {
                    return reject(new ApiError(`Invalid URL format: ${url}`, BAD_REQUEST_STATUS))
                }
            }
        ))
    }

    static async isEnum(value, allowedValues, errorMessage = null) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                if (!allowedValues.includes(value)) {
                    return reject(new ApiError(
                        errorMessage || `Value must be one of: ${allowedValues.join(', ')}`,
                        BAD_REQUEST_STATUS
                    ))
                }
                return resolve(true)
            }
        ))
    }

    static async isPassword(password, options = {}) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const {
                    minLength = 8,
                    requireNumbers = true,
                    requireUppercase = true,
                    requireLowercase = true,
                    requireSpecialChars = true
                } = options

                const errors = []

                if (password.length < minLength) {
                    errors.push(`Password must be at least ${minLength} characters long`)
                }

                if (requireNumbers && !/\d/.test(password)) {
                    errors.push('Password must contain at least one number')
                }

                if (requireUppercase && !/[A-Z]/.test(password)) {
                    errors.push('Password must contain at least one uppercase letter')
                }

                if (requireLowercase && !/[a-z]/.test(password)) {
                    errors.push('Password must contain at least one lowercase letter')
                }

                if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                    errors.push('Password must contain at least one special character')
                }

                if (errors.length > 0) {
                    return reject(new ApiError(errors.join('. '), BAD_REQUEST_STATUS))
                }

                return resolve(true)
            }
        ))
    }
}

export default Validator
