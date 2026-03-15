import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listings from "../models/listing.js";

main()
  .then(() => {
    console.log("connnection successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");

  await DBinit();
}

let DBinit = async () => {
  await Listings.deleteMany({});
  console.log("deleted");
  await Listings.insertMany(sampleListings);
};
