import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    validate(value) {
      if (value.length < 9) throw Error("min length of password is 8 digits !");
    },
  },
  isBlocked: { type: Boolean, default: false },
  key: { type: String, default: "unknown" },
  tokens: [
    {
      accessToken: {
        type: String,
        required: true,
      },
    },
  ],
  role: { type: String, required: true },
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const accessToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30min" }
  );
  const refreshToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "240min" }
  );

  user.tokens = user.tokens.concat({ accessToken });
  await user.save();
  return { accessToken, refreshToken, user };
};

export const User = new model("User", userSchema);
