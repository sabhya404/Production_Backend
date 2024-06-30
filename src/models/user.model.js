//video no -9
//packege- brypt --> help to hash our password
//package- jwt(json wweb token) --> make tokens

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"; //jwt ek bearer token hai--> jiske pas token wo sahi hai
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    //
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //make field searchable (database ki searching main jayega)
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //get url of the images from third party in string type
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //string main hi dena hai syntax hai
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10); //cannot write callback like ()=>{} bcoz this ka reference nhi pta hota isko
  next(); //async function likhte hai time lgta hai  10 is hash round
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, //firstwli paylord se  this waali database se
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, //firstwli paylord se  this waali database se
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
