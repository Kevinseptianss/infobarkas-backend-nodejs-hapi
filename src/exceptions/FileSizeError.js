const ClientError = require("./ClientError");

class FIleSizeError extends ClientError {
    constructor(message) {
        super(message, 413);
        this.name = 'FileSizeError';
    }
}

module.exports = FIleSizeError;