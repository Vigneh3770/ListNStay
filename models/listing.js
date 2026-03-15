import mongoose from "mongoose";
const schema = mongoose.Schema;

let link =
  "https://images.unsplash.com/photo-1771149076648-d0fdcd270f86?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

let listingSchema = new schema({
  title: {
    type: String,
  },
  // description: {
  //   type: String,
  //   required: true,
  // },
  description: String,
  image: {
    filename: {
      default: "listingimage",
      type: String,
    },
    url: {
      type: String,
      default: link,
    },
  },

  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

let Listings = mongoose.model("Listings", listingSchema);

export default Listings;
