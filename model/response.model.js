module.exports = class ApiResponse {
    constructor(isSuccess, message, data) {
        this._isSuccess = isSuccess;
        this._message = message;
        this._data = data;
        if (!message) this._message = this.isSuccess ? 'Successfully done !' : 'An error has occurred';
    }

    get isSuccess() {
        return this._isSuccess;
    }

    set isSuccess(value) {
        this._isSuccess = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }
}
