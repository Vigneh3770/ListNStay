import express from "express";
const router = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";

import {
  isLoggedIn,
  isOwner,
  isReviewOwner,
  validateReview,
} from "../middlewares.js";
import { createReview, deleteReview } from "../controllers/reviews.js";

//ReviewSubmit

router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

//Review Delete

router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(deleteReview));

export default router;
