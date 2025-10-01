import Class from "../models/class.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getClass = asyncHandler(async (req, res) => {
  const classes = await Class.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "className",
        as: "studentsOfClass",
      },
    },
  ]);
  res.status(200).json(new ApiResponse(200, "Classes fetched successfully", classes));
});

const getClassForTeacher = asyncHandler(async (req, res) => {
  const classes = await Class.aggregate([
    {
      $lookup: {
        from: "teachers",
        localField: "_id",
        foreignField: "className",
        as: "teachersOfClass",
      },
    },
  ]);
  res.status(200).json(new ApiResponse(200, "Classes fetched successfully", classes));
});

const findClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const jamat = await Class.findById(id);
  if (!jamat) {
    throw new ApiError(404, "Class not found");
  }

  res.status(200).json(new ApiResponse(200, "Class fetched successfully", jamat));
});

const addClass = asyncHandler(async (req, res) => {
  const classData = req.body;

  if (!classData) {
    throw new ApiError(400, "All fields are required");
  }

  if (!classData.teacher || classData.teacher === "") {
    classData.teacher = null;
  }

  const jamat = await Class.create(classData);

  res.status(200).json(new ApiResponse(200, "Class added successfully", jamat));
});

const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const classData = req.body;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  if (!classData) {
    throw new ApiError(400, "All fields are required");
  }

  const jamat = await Class.findById(id);

  if (!jamat) {
    throw new ApiError(404, "Class not found");
  }

  const updatedJamat = await Class.findByIdAndUpdate(id, classData, { new: true });

  res.status(200).json(new ApiResponse(200, "Class updated successfully", updatedJamat));
});

const deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  const jamat = await Class.findById(id);
  if (!jamat) {
    throw new ApiError(404, "Class not found");
  }

  await Class.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "Class deleted successfully"));
});

export { getClass, findClass, addClass, updateClass, deleteClass , getClassForTeacher};
