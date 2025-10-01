import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bloodGroup: String,
    image: {
      secure_url: String,
      public_id: String,
    },
    dob: Date,
    age: String,
    gender: String,
    className: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    branch: String,
    grade: String,
    rollNumber: String,

    admissionDate: { type: Date, default: Date.now },

    // Flattened Parent / Guardian Info
    fatherName: String,
    fatherOccupation: String,
    fatherMobile: String,

    motherName: String,
    motherOccupation: String,
    motherMobile: String,

    guardianName: String,
    guardianOccupation: String,
    guardianMobile: String,
    guardianRelation: String,

    // Flattened Address
    presentAddress: String,
    permanentAddress: String,
    city: String,

    running: { type: Boolean, default: true },
    newStudent: { type: Boolean, default: true },
    previousSchool: String,
    previousClass: String,

    // Flattened Fees
    admissionFee: { type: Number, default: 0 },
    monthlyFee: { type: Number, default: 0 },
    foodFee: { type: Number, default: 0 },
    othersFee: { type: Number, default: 0 },
    totalFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);


export default mongoose.model("Student", studentSchema);
