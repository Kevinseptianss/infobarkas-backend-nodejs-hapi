const Joi = require("joi");

const AdsPayloadSchema = Joi.object({
  data: Joi.string()
    .required()
    .not()
    .empty(),
    // .custom((value, helpers) => {
    //   try {
    //     const parsed = JSON.parse(value); // Try to parse the JSON string
    //     // Validate the parsed object structure
    //     const schema = Joi.object({
    //       title: Joi.string().required(),
    //       price: Joi.number().required(),
    //       description: Joi.string().required(),
    //     });

    //     const { error } = schema.validate(parsed); // Validate the parsed object
    //     if (error) {
    //       return helpers.error("any.invalid"); // Return an error if validation fails
    //     }
    //     return value; // Return the original value if validation passes
    //   } catch (err) {
    //     return helpers.error("any.invalid"); // Return an error if JSON parsing fails
    //   }
    // }),
  images: Joi.array(),
    // .items(
    //   Joi.object({
    //     "content-type": Joi.string()
    //       .valid(
    //         "image/apng",
    //         "image/avif",
    //         "image/jpeg",
    //         "image/png",
    //         "image/webp"
    //       )
    //       .required(),
    //   }).unknown()
    // )
    // .min(1) // Minimum 1 image
    // .max(10) // Maximum 10 images
    // .required(),
});
module.exports = { AdsPayloadSchema };
