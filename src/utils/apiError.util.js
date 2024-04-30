// Custom Error class for API errors
class ApiError extends Error {
    constructor(
        statusCode,
        message = 'Please check, something went wrong.', // (default = 'Please check, something went wrong.')
        errors = [], // (default = [])
        stack = '' // (default = '')
    ) {
        // Call the constructor of the parent class (Error)
        super(message);
        // Set properties specific to ApiError
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        this.message = message;
        // If stack trace is provided, set it, otherwise, capture the stack trace
        if(stack) {
            this.stack = stack;
        }else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export default the ApiError class
export default ApiError;