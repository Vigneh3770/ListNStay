import Review from "../models/reviews.js";
import Listings from "../models/listing.js";

export let createReview = async (req, res) => {
  let { id } = req.params;
  let review = new Review(req.body.Review);
  review.owner = req.user._id;
  let listing = await Listings.findById(id);
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  console.log(review);
  res.redirect(`/listings/${listing._id}`);
};

export let deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
