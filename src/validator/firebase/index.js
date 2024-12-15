const InvariantError = require("../../exceptions/InvariantError");
const { PostAuthSchemaPayload } = require("./schema")

const FirebaseValidator = {
    validatePostFirebasePayload: (payload) => {
        const validationResult = PostAuthSchemaPayload.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
}

module.exports = FirebaseValidator;