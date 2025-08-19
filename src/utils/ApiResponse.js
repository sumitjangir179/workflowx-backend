class ApiResponse {

    constructor(statusCode, data, message = 'success') {
        this.success = statusCode < 400
        this.data = data;
        this.message = message
    }

}

export default ApiResponse