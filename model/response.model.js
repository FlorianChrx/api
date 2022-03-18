module.exports = class ApiResponse {
    constructor(isSuccess, message, data) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.data = data;
        if (!message) this.message = this.isSuccess ? 'Successfully done !' : 'An error has occurred';
    }
}
