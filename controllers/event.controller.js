import Event from "../models/events.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, "Events fetched successfully", events));
});

const findEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  res.status(200).json(new ApiResponse(200, "Event fetched successfully", event));
});

const addEvent = asyncHandler(async (req, res) => {
  const eventData = req.body;
  const fileBuffer = req.file?.buffer;

  if (!eventData) {
    throw new ApiError(400, "All fields are required");
  }

  const { secure_url, public_id } = fileBuffer
    ? await uploadOnCloudinary(fileBuffer)
    : { secure_url: "", public_id: "" };

  if (!eventData.date) {
    delete eventData.date;
  }

  const event = await Event.create({
    ...eventData,
    image: { secure_url, public_id },
  });

  res.status(200).json(new ApiResponse(200, "Event added successfully", event));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const eventData = req.body;
  const fileBuffer = req.file?.buffer;

  if (!eventData) {
    throw new ApiError(400, "All fields are required");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  let secure_url = event.image.secure_url;
  let public_id = event.image.public_id;

  if (fileBuffer) {
    if (event.image.public_id) {
      await deleteFromCloudinary(event.image.public_id);
    }
    const uploadPic = await uploadOnCloudinary(fileBuffer);
    secure_url = uploadPic.secure_url;
    public_id = uploadPic.public_id;
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    {
      ...eventData,
      image: { secure_url, public_id },
    },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "Event updated successfully", updatedEvent));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.image?.public_id) {
    try {
      await deleteFromCloudinary(event.image.public_id);
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
    }
  }

  await Event.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "Event deleted successfully"));
});

export { getEvents, findEvent, addEvent, updateEvent, deleteEvent };
