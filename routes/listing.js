import express from "express";
import multer from "multer";
import wrapAsync from "../utils/wrapAsync.js";
import { storage } from "../cloudConfig.js";

const router = express.Router();
const upload = multer({ storage });

import { isLoggedIn, isOwner, validateListing } from "../middlewares.js";
import {
  index,
  renderNewListingForm,
  createListing,
  eachListing,
  editForm,
  updateListing,
  deleteListing,
} from "../controllers/listings.js";

router
  .route("/")
  .get(wrapAsync(index)) //home listing
  .post(
    isLoggedIn,
    upload.single("Listings[image][url]"),
    validateListing,
    wrapAsync(createListing), //create listing
  );

// .post(upload.single("Listings[image][url]"), (req, res) => {
//   res.send(req.file);
// });

// new listing form
router.get("/createForm", isLoggedIn, wrapAsync(renderNewListingForm));

//eachlisting
router.get("/:id", wrapAsync(eachListing));

//editListings form
router.get("/:id/editForm", isLoggedIn, wrapAsync(editForm));

router
  .route("/:id")
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("Listings[image][url]"),
    validateListing,
    wrapAsync(updateListing),
  ) //updateListing
  .delete(isLoggedIn, isOwner, validateListing, wrapAsync(deleteListing)); //deleteListing

export default router;
