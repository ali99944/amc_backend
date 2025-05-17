import { ApiError } from "../api_error.js";
import { INTERNAL_SERVER_ERROR_CODE } from "../error_codes.js";
import { INTERNAL_SERVER_STATUS } from "../status_codes.js";

const promiseAsyncWrapper = (fn) =>{
    return async (resolve, reject) =>{
        try{
            await fn(resolve,reject);
        }catch(error){            
            
            let custom_error = new ApiError(error.message, INTERNAL_SERVER_ERROR_CODE, INTERNAL_SERVER_STATUS)
            return reject(custom_error);
        }
    }
}

export default promiseAsyncWrapper