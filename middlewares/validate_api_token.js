
import jwt from 'jsonwebtoken'
import { json_web_token_key } from '../lib/configs.js'
import asyncWrapper from '../lib/wrappers/async_wrapper.js'
import { ApiError } from '../lib/api_error.js'
import { FORBIDDEN_STATUS, NOT_AUTHORIZED_STATUS } from '../lib/status_codes.js'
import { AUTH_ERROR_CODE } from '../lib/error_codes.js'

const ValidateApiToken = asyncWrapper(async (req, res, next) =>{
    const { token } = req.headers

    if(!token){
        let missing_token_error = new ApiError('Please provide api token', AUTH_ERROR_CODE, FORBIDDEN_STATUS)
        return next(missing_token_error)
    }
    
    let decoded_token = undefined

    jwt.verify(token, json_web_token_key,{},(error,decoded) =>{
        if(error){
            let not_authorized_error = new ApiError('Invalid API token, Unauthorized', AUTH_ERROR_CODE, NOT_AUTHORIZED_STATUS)
            return next(not_authorized_error)
        }

        decoded_token = decoded
    })
    
    return next()
})


export default ValidateApiToken