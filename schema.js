import Joi from "joi";
export const listingSchema = Joi.object({
  Listings: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    location: Joi.string().required(),

    country: Joi.string().required(),
    price: Joi.number().min(500).required(),
    image: Joi.allow("", null),
  }),
});

export const reviewSchema = Joi.object({
  Review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }),
});
