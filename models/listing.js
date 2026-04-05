import mongoose from "mongoose";

const schema = mongoose.Schema;
import Review from "./reviews.js";
import user from "./user.js";

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
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

let Listings = mongoose.model("Listings", listingSchema);

export default Listings;
