import Listings from "../models/listing.js";
import mbxgeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxgeocoding({ accessToken: mapToken });

export let index = async (req, res) => {
  let data = await Listings.find();
  res.render("listings/allListings", { data });
};

export let renderNewListingForm = async (req, res) => {
  res.render("listings/listingForm");
};

export let createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.Listings.location,
      limit: 1,
    })
    .send();
  if (!response.body.features.length) {
    req.flash("error", "Location not found. Please enter a valid address.");
    return res.redirect("/listings/new");
  }

  let newListing = new Listings(req.body.Listings);

  if (!response.body.features.length) {
    req.flash("error", "Location not found. Please enter a valid address.");
    return res.redirect("/listings/new");
  }
  newListing.owner = req.user._id;
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let result = await newListing.save();
  req.flash("success", "New listing added");
  // console.log(newListing);
  // console.log(req.user);
  console.log(result);

  res.redirect("/listings");
};

export let eachListing = async (req, res) => {
  let { id } = req.params;
  let data = await Listings.findById(id)
    .populate({ path: "reviews", populate: { path: "owner" } })
    .populate("owner");
  if (!data) {
    req.flash("err", "Listing does not exist");
    return res.redirect("/listings");
  }

  console.log(data);
  res.render("listings/eachlisting", { data, id });
};

export let editForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  if (!listing) {
    req.flash("err", "Listing does not exist");
    return res.redirect("/listings");
  }
  console.log("update form");
  let originalImage = listing.image.url;
  if (originalImage.includes("/upload")) {
    originalImage = originalImage.replace(
      "/upload",
      "/upload/w_250/e_blur:300",
    );
  }
  res.render("listings/updateForm", { listing, id, originalImage });
};

export let updateListing = async (req, res) => {
  // let result = listingSchema.validate(req.body);
  // console.log(result);
  let { id } = req.params;

  // let listing = await Listings.findById(id);

  let listing = await Listings.findByIdAndUpdate(id, { ...req.body.Listings });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    listing.save();
  }

  req.flash("updation", "Listing Updated");
  console.log(req.body);
  res.redirect(`/listings/${id}`);
};

export let deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listings.findByIdAndDelete(id);
  req.flash("deletion", "Listing Deleted");
  console.log("deleted");
  res.redirect("/listings");
};
