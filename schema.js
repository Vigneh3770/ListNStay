import Joi from "joi";
const listingSchema = Joi.object({
  Listings: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    location: Joi.string().required(),

    country: Joi.string().required(),
    price: Joi.number().min(500).required(),
    image: Joi.string().allow("", null),
  }).required(),
});

export default listingSchema;
