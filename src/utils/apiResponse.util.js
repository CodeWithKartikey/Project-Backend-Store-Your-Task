// Class for constructing API response objects
class ApiResponse {
    /*
        Constructor for ApiResponse
        @param {number} statusCode - HTTP status code of the response
        @param {object} data - Data to be included in the response
        @param {string} message - Message associated with the response (default: "Success")
    */
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.data = data;
        this.message = message; 
    }
}

// Export default the ApiResponse class
export default ApiResponse;