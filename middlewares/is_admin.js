import { ApiError } from "../lib/api_error.js";
import { AUTH_ERROR_CODE, INTERNAL_SERVER_ERROR_CODE } from "../lib/error_codes.js";
import { verifyAdminToken } from "../lib/security.js";
import { INTERNAL_SERVER_STATUS, NOT_AUTHORIZED_STATUS } from "../lib/status_codes.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";

const isAdmin = asyncWrapper(
    (req,res,next) =>{

        let token = req.headers.authorization;

        if(!token){
            const not_authorized_error = new ApiError('You are not authenticated',INTERNAL_SERVER_ERROR_CODE, INTERNAL_SERVER_STATUS)
            return next(not_authorized_error)
        }
    
        const payload = verifyAdminToken(token);
    
        if(payload){
            return next();
        }
    
        const not_authorized_error = new ApiError('Not authorized', AUTH_ERROR_CODE, NOT_AUTHORIZED_STATUS)
        return next(not_authorized_error)
    }
)


export default isAdmin