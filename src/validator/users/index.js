const InvariantError = require("../../exceptions/InvariantError");
const { UserPayLoadSchema, UserUpdateSchema } = require("./schema");

const UserValidator = {
  validateUserPayLoad: (payload) => {
    const validationResult = UserPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateEditUserPayLoad: (payload) => {
    const validationResult = UserUpdateSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;
