import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  //check for fields
  //take video and thumbnail
  //upload on cloudinary
  //create video
  //upload on database
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(404, "All fields are requied");
  }
  const videoFileLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, "videoFileLocalPath is required");
  }
  if (!videoFileLocalPath) {
    throw new ApiError(400, "thumbnailLocalPath is required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "video fole is not found");
  }
  if (!thumbnail) {
    throw new ApiError(400, "thumbnail is not found");
  }

  const video = await Video.create({
    title,
    description,
    duration: videoFile.duration,
    videoFile: {
      url: videoFile.url,
      public_id: videoFile.public_id,
    },
    thumbnail: {
      url: thumbnail.url,
      public_id: thumbnail.public_id,
    },
    owner: req.user?._id,
    isPublished: false,
  });
  const videoUpload = await Video.findById(video._id);
  if (!videoUpload) {
    throw new ApiError(500, "video uploading fail try again !!!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  //video id validation
  //add and check title and description
  //find video from db
  //check authorization
  //delete old thumbnail
  //take new thumbnail from frontend
  //upload it to cloudinary
  //update all changes in video
  //delete old thumbnail from cloudinary
  //finally through response
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  if (!(title && description)) {
    throw new ApiError(400, "title and description are required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "No video found");
  }
  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can't edit this video as you are not the owner"
    );
  }

  const deletethumbnail = video.thumbnail.public_id;

  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnailLocal file is missing");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail.url) {
    throw new ApiError(400, "Error while uploading thumbnail");
  }

  const updatedvideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: {
          public_id: thumbnail.public_id,
          url: thumbnail.url,
        },
      },
    },
    { new: true }
  );
  if (!updatedVideo) {
    throw new ApiError(500, "Failed to update video please try again");
  }
  if (updatedVideo) {
    await deleteOnCloudinary(deletethumbnail);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedvideo, "Video Uploaded successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  //validate id
  //find video
  //check owner
  //delete video
  //delete video from cloudinary
  //delete video comments and likes
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid videoId");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "No video found");
  }
  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can't delete this video as you are not the owner"
    );
  }
  const deletevideo = await Video.findByIdAndDelete(video?._id);
  if (!deletevideo) {
    throw new ApiError(400, "Failed to delete the video please try again");
  }
  await deleteOnCloudinary(video.thumbnail.public_id);
  await deleteOnCloudinary(video.videoFile.public_id, "video");

  await Like.deleteMany({
    video: videoId,
  });

  // delete video comments
  await Comment.deleteMany({
    video: videoId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "video deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can't toogle publish status as you are not the owner"
    );
  }

  const toggledVideoPublish = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video?.isPublished,
      },
    },
    { new: true }
  );

  if (!toggledVideoPublish) {
    throw new ApiError(500, "Failed to toogle video publish status");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: toggledVideoPublish.isPublished },
        "Video publish toggled successfully"
      )
    );
});

export {
  getAllVideos,
  publishAVideo, //done
  getVideoById,
  updateVideo, //done
  deleteVideo, //done
  togglePublishStatus, //done
};
