const InvariantError = require("../../exceptions/InvariantError");
const { AdsPayloadSchema } = require("./schema");

const AdsValidator = {
  validateAdsPayload: (payload) => {
    const validationResult = AdsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AdsValidator;
