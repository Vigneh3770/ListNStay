import mongoose from "mongoose";
const schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose.default);
const User = mongoose.model("User", userSchema);

export default User;
