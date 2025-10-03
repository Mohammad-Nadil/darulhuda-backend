import Teacher from "../models/teacher.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import classModel from "../models/class.model.js";

const getTeacher = asyncHandler(async (req, res) => {
  const teachers = await  classModel.aggregate([
    {
      $lookup: {
        from: "teachers",
        localField: "_id",
        foreignField: "className",
        as: "teachersOfClass",
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, "Teachers fetched successfully", teachers));
});

const findTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const teacher = await Teacher.findById(id);
  if (!teacher) {
    throw new ApiError(400, "Id is required");
  }

  res.status(200).json(new ApiResponse(200, "Teacher fetched successfully", teacher));
});

const addTeacher = asyncHandler(async (req, res) => {
  const teacherData = req.body;

  if (!teacherData.name) {
    throw new ApiError(400, "Name field is required");
  }

  const fileBuffer = req.file?.buffer;
  const { secure_url, public_id } = fileBuffer
    ? await uploadOnCloudinary(fileBuffer)
    : { secure_url: "", public_id: "" };

  const teacher = await Teacher.create({
    ...teacherData,
    image: { secure_url, public_id },
  });

  res.status(200).json(new ApiResponse(200, "Teacher added successfully", teacher));
});

const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacherData = req.body;
  const fileBuffer = req.file?.buffer;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  if (!teacherData) {
    throw new ApiError(400, "All fields are required");
  }

  const teacher = await Teacher.findById(id);

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  let secure_url = teacher.image.secure_url;
  let public_id = teacher.image.public_id;

  if (fileBuffer) {
    if (teacher.image.public_id) {
      await deleteFromCloudinary(teacher.image.public_id);
    }
    const uploadPic = await uploadOnCloudinary(fileBuffer);
    secure_url = uploadPic.secure_url;
    public_id = uploadPic.public_id;
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    id,
    { ...teacherData, image: { secure_url, public_id } },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "Teacher updated successfully", updatedTeacher));
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const teacher = await Teacher.findById(id);
  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  if (teacher.image?.public_id) {
    try {
      await deleteFromCloudinary(teacher.image.public_id);
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
    }
  }

  await Teacher.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "Teacher deleted successfully"));
});

export { getTeacher, findTeacher, addTeacher, updateTeacher, deleteTeacher };
