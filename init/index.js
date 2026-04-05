import mongoose from "mongoose";
import data from "./data.js";
import Listings from "../models/listing.js";
import User from "../models/user.js";

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
  let processedData = data.map((obj) => ({
    ...obj,
    owner: "69c78f9a705c55a4a30b8c75",
  }));
  console.log("deleted");
  await Listings.insertMany(processedData);
};
