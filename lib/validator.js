import { ApiError } from "./api_error.js"
import { BAD_REQUEST_CODE } from "./error_codes.js"
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
                        errors.push({ field, error: `${field} لا يمكن أن يكون فارغًا، أو غير معرّف` })
                    }
                }

                if (errors.length > 0) {                    
                    let error = new ApiError("بعض الحقول مفقودة", BAD_REQUEST_CODE, BAD_REQUEST_STATUS)
                    error.details = errors
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
                    let error = new ApiError(`صيغة بريد إلكتروني غير صالحة: ${email}`, BAD_REQUEST_STATUS)
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
                    fieldName = 'ملف',
                    allowedTypes = [],
                    maxSize = 5 * 1024 * 1024, // 5MB default
                } = options

                if (required && (!file || !file.buffer)) {
                    return reject(new ApiError(`${fieldName} مطلوب`, BAD_REQUEST_STATUS))
                }

                if (file) {
                    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
                        return reject(new ApiError(`نوع ملف غير صالح. الأنواع المسموح بها: ${allowedTypes.join(', ')}`, BAD_REQUEST_STATUS))
                    }

                    if (file.size > maxSize) {
                        return reject(new ApiError(`حجم الملف يتجاوز الحد الأقصى المسموح به ${maxSize / (1024 * 1024)}MB`, BAD_REQUEST_STATUS))
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
                    return reject(new ApiError(`${value} ليس رقماً صالحًا`, BAD_REQUEST_STATUS))
                }

                if (integer && !Number.isInteger(num)) {
                    return reject(new ApiError(`${value} يجب أن يكون عددًا صحيحًا`, BAD_REQUEST_STATUS))
                }

                if (num < min || num > max) {
                    return reject(new ApiError(`${value} يجب أن يكون بين ${min} و ${max}`, BAD_REQUEST_STATUS))
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
                    return reject(new ApiError(`القيمة يجب أن تكون سلسلة نصية`, BAD_REQUEST_STATUS))
                }

                const value = trim ? text.trim() : text
                
                if (value.length < minLength || value.length > maxLength) {
                    return reject(new ApiError(
                        `يجب أن يتراوح طول النص بين ${minLength} و ${maxLength} حروف`,
                        BAD_REQUEST_STATUS
                    ))
                }

                if (pattern && !pattern.test(value)) {
                    return reject(new ApiError(`النص لا يطابق النمط المطلوب`, BAD_REQUEST_STATUS))
                }

                return resolve(true)
            }
        ))
    }

    /**
     * 
     * @param {Array<T>} array 
     * @param {{
     *      arrayName: string
     *      minLength: number
     *      maxLength: number
     *      unique: boolean,
    * }} options 
     * @returns 
     */
    static async isArray(array, options = {}) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const {
                    minLength = 0,
                    maxLength = Number.MAX_SAFE_INTEGER,
                    unique = false,
                    arrayName = "مصفوفة"
                } = options

                if (!Array.isArray(array)) {
                    return reject(new ApiError(`${arrayName} يجب أن يكون مصفوفة`, BAD_REQUEST_STATUS))
                }

                if (array.length < minLength || array.length > maxLength) {
                    return reject(new ApiError(
                        `يجب أن يتراوح طول ${arrayName} بين ${minLength} و ${maxLength}`,
                        BAD_REQUEST_STATUS
                    ))
                }

                if (unique && new Set(array).size !== array.length) {
                    return reject(new ApiError(`${arrayName} يجب أن تحتوي على قيم فريدة`, BAD_REQUEST_STATUS))
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
                    return reject(new ApiError(`صيغة تاريخ غير صالحة`, BAD_REQUEST_STATUS))
                }

                if (minDate && dateObj < new Date(minDate)) {
                    return reject(new ApiError(`يجب أن يكون التاريخ بعد ${minDate}`, BAD_REQUEST_STATUS))
                }

                if (maxDate && dateObj > new Date(maxDate)) {
                    return reject(new ApiError(`يجب أن يكون التاريخ قبل ${maxDate}`, BAD_REQUEST_STATUS))
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
                    return reject(new ApiError(`صيغة عنوان URL غير صالحة: ${url}`, BAD_REQUEST_STATUS))
                }
            }
        ))
    }

    static async isEnum(value, allowedValues, errorMessage = null) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                if (!allowedValues.includes(value)) {
                    return reject(new ApiError(
                        errorMessage || `القيمة يجب أن تكون واحدة من: ${allowedValues.join(', ')}`,
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
                    errors.push(`يجب أن تكون كلمة المرور على الأقل ${minLength} حروف`)
                }

                if (requireNumbers && !/\d/.test(password)) {
                    errors.push('يجب أن تحتوي كلمة المرور على رقم واحد على الأقل')
                }

                if (requireUppercase && !/[A-Z]/.test(password)) {
                    errors.push('يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل')
                }

                if (requireLowercase && !/[a-z]/.test(password)) {
                    errors.push('يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل')
                }

                if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                    errors.push('يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل')
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

