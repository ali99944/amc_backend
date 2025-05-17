import { ApiError } from "../api_error.js";
import { INTERNAL_SERVER_ERROR_CODE } from "../error_codes.js";
import logger from "../logger.js";
import { INTERNAL_SERVER_STATUS } from "../status_codes.js";

const asyncWrapper = (fn) =>{
    return async (req,res,next) =>{
        try{
            await fn(req,res,next);
        }catch(error){            
            logger.error(error.message)
            if(error instanceof ApiError){
                return next(error);
            }

            let custom_error = new ApiError(error.message, INTERNAL_SERVER_ERROR_CODE, INTERNAL_SERVER_STATUS)
            return next(custom_error);
        }
    }
}

export default asyncWrapper

