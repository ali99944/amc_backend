import Validator from '../lib/validator.js';
import { ApiError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import { VALIDATION_ERROR_CODE } from '../lib/error_codes.js';

/**
 * Creates a validation middleware for a given schema.
 * The schema should be an object where keys are 'body', 'query', or 'params',
 * and values are objects defining validation rules for each field.
 * Each rule is a function from the Validator class or a custom validation function.
 * Example:
 * const schema = {
 *   body: {
 *     email: Validator.isEmail,
 *     password: (value) => Validator.isPassword(value, { minLength: 8 }),
 *     age: (value) => Validator.isNumber(value, { min: 18, max: 99, integer: true })
 *   },
 *   query: {
 *     page: (value) => Validator.isNumber(value, { min: 1, integer: true })
 *   }
 * };
 */
const validationMiddleware = (schema) => {
  return async (req, res, next) => {
    const errors = [];

    const validate = async (source, definition) => {
      for (const field in definition) {
        const validatorFn = definition[field];
        const value = source[field];
        
        // Handle required fields defined by validateNotNull in the schema
        if (validatorFn === Validator.validateNotNull) {
            try {
                await Validator.validateNotNull({ [field]: value });
            } catch (error) {
                // Extract details from ApiError if validateNotNull fails
                const errorDetails = JSON.parse(error.message);
                errors.push(...errorDetails);
            }
            continue; // Move to the next field
        }
        
        // For other validators, proceed if value is present
        // Optional fields are handled by not including them if not present or by specific validator logic
        if (value !== undefined && value !== null && value !== '') {
          try {
            await validatorFn(value);
          } catch (error) {
            if (error instanceof ApiError) {
              errors.push({ field, message: error.message, code: error.code });
            } else {
              errors.push({ field, message: error.message || 'Invalid value' });
            }
          }
        }
      }
    };

    if (schema.body) {
      await validate(req.body, schema.body);
    }
    if (schema.query) {
      await validate(req.query, schema.query);
    }
    if (schema.params) {
      await validate(req.params, schema.params);
    }

    if (errors.length > 0) {
      const error = new ApiError(
        'Validation failed',
        VALIDATION_ERROR_CODE,
        BAD_REQUEST_STATUS,
        errors
      );
      return next(error);
    }

    next();
  };
};

export default validationMiddleware;