import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URL = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@mydata.w34yu0l.mongodb.net/`;

mongoose
  .connect(URL)
  .then(() => console.log("connected to mongoo"))
  .catch((e) => {
    console.log("mongo connection error", e.message);
  });
