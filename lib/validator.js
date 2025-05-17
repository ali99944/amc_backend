import { ApiError } from "./api_error.js"
import { BAD_REQUEST_STATUS } from "./status_codes.js"
import promiseAsyncWrapper from "./wrappers/promise_async_wrapper.js"

class Validator {
    static async validateNotNull(fields) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                let errors = []

                for (let field of Object.keys(fields)) {
                    if (fields[field] == null || fields[field] == undefined || fields[field] == "") {
                        errors.push({ field: field, error: `${field} cannot be null or empty` })
                    }
                }

                if (errors.length > 0) {
                    let error = new ApiError(errors, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }


    static async isEmail(email) {
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!regex.test(String(email).toLowerCase())) {
                    let error = new ApiError(`${email} is not a valid email`, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

    static async requiredSingleImage(file){
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                if(!file || file.fieldname != 'image'){
                    let error = new ApiError(`file is required`, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

    
    static async isNumber(number){
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                if(isNaN(number) || !(typeof number === 'number')){
                    let error = new ApiError(`${number} is not a number`, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

    static async isText(text){
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                if(typeof text !== 'string' || text.length == 0){
                    let error = new ApiError(`${text} is not a valid text`, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

    static async isArray(array){
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                if(!Array.isArray(array)){
                    let error = new ApiError(`${array} is not an array`, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

    static async minArrayLength(array, length, errorMessage){
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                if(array.length < length){
                    let error = new ApiError(errorMessage || `array length must be at least ${length}`, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

    
    static async isEnum(value, enums, errorMessage){
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) => {
                if(!enums.includes(value)){
                    let error = new ApiError(errorMessage || `${value} is not in the enum ${enums}`, BAD_REQUEST_STATUS)
                    return reject(error)
                }
                return resolve(true)
            }
        ))
    }

}

export default Validator
