exports.Response = class Response {
    constructor(success, message, data) {
        this.message = message;
        this.success = success;
        this.data = data;
        if (!message) this.message = success ? 'Succesfully done !' : 'An error has occured';
    }
}
