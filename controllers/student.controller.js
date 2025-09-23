import Student from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, "Students fetched successfully", students));
});

const findStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new ApiError(400, "Id is required");
  }
  res.status(200).json(new ApiResponse(200, "Student fetched successfully", student));
});

const addStudent = asyncHandler(async (req, res) => {
  const studentData = req.body;
  const path = req.file?.path;

  if (!studentData) {
    throw new ApiError(400, "All fields are required");
  }

  const { secure_url, public_id } = path
    ? await uploadOnCloudinary(path)
    : { secure_url: "", public_id: "" };

  const newStudent = await Student.create({
    ...studentData,
    image: { secure_url, public_id },
  });

  res.status(200).json(new ApiResponse(200, "Student added successfully", newStudent));
});

const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentData = req.body;
  const path = req.file?.path;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }

  if (!studentData) {
    throw new ApiError(400, "All fields are required");
  }

  const student = await Student.findById(id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  let secure_url = student.image.secure_url;
  let public_id = student.image.public_id;

  if (path) {
    if (student.image.public_id) {
      await deleteFromCloudinary(student.image.public_id);
    }
    const uploadPic = await uploadOnCloudinary(path);
    secure_url = uploadPic.secure_url;
    public_id = uploadPic.public_id;
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    {
      ...studentData,
      image: { secure_url, public_id },
    },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "Student updated successfully", updatedStudent));
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Id is required");

  const student = await Student.findById(id);
  if (!student) throw new ApiError(404, "Student not found");

  if (student.image?.public_id) {
    try {
      await deleteFromCloudinary(student.image.public_id);
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
    }
  }

  await Student.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "Student deleted successfully"));
});

export { getStudents, findStudentById, addStudent, updateStudent, deleteStudent };
