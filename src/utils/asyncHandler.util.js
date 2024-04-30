/*
    Middleware to handle asynchronous route handlers
    @param {function} fn - Asynchronous route handler function
    @returns {function} - Asynchronous route handler with error handling
*/
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise
        .resolve(fn(req, res, next))
        .catch((error) => {
            // Handle errors and send appropriate response
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            });
        });
    };
};

// Export default the asyncHandler middleware
export default asyncHandler;

/*
const asyncHandler = (fn) => async(req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res
        .status(error.code || 500)
        .json({
            success: false,
            message: error.message
        });
    }
};

export default asyncHandler;
*/