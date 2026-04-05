import mongoose from "mongoose";

const schema = mongoose.Schema;
const reviewSchema = new schema({
  comment: String,
  rating: {
    min: 1,
    max: 5,
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
});

let Review = mongoose.model("Review", reviewSchema);

export default Review;
