//video-12

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validatiion-- not empty
  //check if user already exist username , email
  //check for images, check for avatar
  //upload to cloudinary, avatat
  //create user object - create entry in db
  //remove password and refresh token field fromm response
  //check for user creation
  //return res

  const { fullname, email, username, password } = req.body;
  console.log("email ", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field are required");
  }

  const existUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImage = req.files?.coverImage[0]?.path;
});

export { registerUser };
