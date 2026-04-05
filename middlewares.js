import Listings from "./models/listing.js";
import Review from "./models/reviews.js";
import { listingSchema, reviewSchema } from "./schema.js";
import expressErrors from "./utils/expressErrors.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("err", "User is not logged in");
    return res.redirect("/login");
  }
  next();
};

export function validateReview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");

    throw new expressErrors(400, errMsg);
  } else {
    next();
  }
}

export function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");

    throw new expressErrors(400, errMsg);
  } else {
    next();
  }
}

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
};

export const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  if (!req.user || !listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("err", "You are not the user");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

export const isReviewOwner = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!req.user || !review.owner._id.equals(res.locals.currUser._id)) {
    req.flash("err", "You are not the Owner of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
