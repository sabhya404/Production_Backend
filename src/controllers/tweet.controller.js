import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });
  if (!tweet) {
    throw new ApiError(500, "Failed to crate tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet fatched Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "only owner can edit their tweet");
  }
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(500, "Failed to edit tweet please try again");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const tweetId = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  if (tweet?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "you are not the owner!!!");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet Deleted Successfully"));
});

export {
  createTweet, //done
  getUserTweets,
  updateTweet, //done
  deleteTweet,
}; //done
