import Announcement from "../models/announcements.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, "Announcements fetched successfully", announcements));
});

const findAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const announcement = await Announcement.findById(id);
  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  res.status(200).json(new ApiResponse(200, "Announcement fetched successfully", announcement));
});

const addAnnouncement = asyncHandler(async (req, res) => {
  const announcementData = req.body;
  const fileBuffer = req.file?.buffer;

  if (!announcementData) {
    throw new ApiError(400, "All fields are required");
  }
  let fileData = {};
  if (fileBuffer) {
    const { secure_url, public_id } = await uploadOnCloudinary(fileBuffer);
    fileData = { secure_url, public_id };
  }

  const announcement = await Announcement.create({
    ...announcementData,
    file: fileData,
  });

  res.status(200).json(new ApiResponse(200, "Announcement added successfully", announcement));
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcementData = req.body;
  const fileBuffer = req.file?.buffer;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  if (!announcementData) {
    throw new ApiError(400, "All fields are required");
  }


  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  let secure_url = announcement.file.secure_url;
  let public_id = announcement.file.public_id;

  if (fileBuffer) {
    if (announcement.file.public_id) {
      await deleteFromCloudinary(announcement.file.public_id);
    }
    const uploadPic = await uploadOnCloudinary(fileBuffer);
    secure_url = uploadPic.secure_url;
    public_id = uploadPic.public_id;
  }

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(
    id,
    {
      ...announcementData,
      file: { secure_url, public_id },
    },
    { new: true }
  );
console.log(announcement);

  res
    .status(200)
    .json(new ApiResponse(200, "Announcement updated successfully", updatedAnnouncement));
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const announcement = await Announcement.findById(id);
  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  if (announcement.file?.public_id) {
    try {
      await deleteFromCloudinary(announcement.file.public_id);
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
    }
  }

  await Announcement.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "Announcement deleted successfully"));
});

export {
  getAnnouncements,
  findAnnouncement,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
