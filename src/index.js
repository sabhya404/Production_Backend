//import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});
// method 2
connectDB() //async await bdefault promise return karta hai isliye hm .then .catch methog use kar sakte hai
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed", err);
  });

//require("dotenv").config({ path: "./env" });

//connect to database method 1
/*import express from express;
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`); //databsse connect / name of database
    app.on("error", (error) => {
      console.log("ERR", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR:", error);
    throw err;
  }
})(); //use of iife
*/
