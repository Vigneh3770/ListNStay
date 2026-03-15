import express from "express";
import path from "path";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Listings from "./models/listing.js";
import ejsMate from "ejs-mate";
import { access } from "fs";
import wrapAsync from "./utils/wrapAsync.js";
import expressErrors from "./utils/expressErrors.js";
import listingSchema from "./schema.js";

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

const app = express();
const port = 8000;

//view engines
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

//middlewares

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen(port, () => {
  console.log(`Server running on port port ${port}`);
});

main()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

// const token = (req, res, next) => {
//   let { token } = req.query;
//   if (token === "giveaccess") {
//     next();
//   } else {
//     res.send("ACCESS DENIED");
//   }
// };

app.use((req, res, next) => {
  req.time = new Date().toString();

  next();
});

//root
app.get(
  "/",
  wrapAsync(async (req, res) => {
    res.send("root");
  }),
);
//home
app.get(
  "/home",
  wrapAsync(async (req, res) => {
    let data = await Listings.find();
    res.render("listings/allListings", { data });
  }),
);

//eachlisting
app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listings.findById(id);

    res.render("listings/eachlisting", { data, id });
  }),
);

// new listing form
app.get(
  "/listingNew",
  wrapAsync((req, res) => {
    console.log("this is the new listing form render");
    res.render("listings/listingForm");
  }),
);

//new listing

app.post(
  "/newListing",
  wrapAsync(async (req, res) => {
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    console.log("this is the new listing adding route ");
    let newListing = new Listings(req.body.Listings);
    await newListing.save();
    console.log(newListing);
    res.redirect("/home");
  }),
);

//deleteListing
app.post(
  "/deleteListing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listings.findByIdAndDelete(id);
    console.log("deleted");
    res.redirect("/home");
  }),
);

//editListings form
app.get(
  "/editListings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listings.findById(id);

    console.log("update from");
    res.render("listings/updateForm", { listing, id });
  }),
);

//updateListing
app.post(
  "/updateListing/:id",
  wrapAsync(async (req, res) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    let { id } = req.params;
    await Listings.findByIdAndUpdate(id, { ...req.body.Listings });
    console.log(req.body);
    res.redirect("/home");
  }),
);

//Error handling middleware
app.use((req, res, next) => {
  return next(new expressErrors(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Somehting went wrong" } = err;
  // res.render("listings/error.ejs", { statusCode, message });
  if (res.headersSent) {
    return next(err);
  }

  res
    .status(status)
    .render("listings/error.ejs", { err }, (renderErr, html) => {
      if (renderErr) {
        // If the template fails to render, send a plain text error instead of crashing
        return res.status(status).send(message);
      }
      res.send(html);
    });
  // res.status(status).render("listings/error.ejs", { err });
});
