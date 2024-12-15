const Joi = require('joi');

const PostAuthSchemaPayload = Joi.object({
    idToken: Joi.string().required(),
});

module.exports = {
    PostAuthSchemaPayload,
}