import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: String,
    dob: Date,
    phone: String,
    age: String,
    gender: String,
    address: String,
    image: {
      secure_url: String,
      public_id: String,
    },
    education: String,
    joining_date: { type: Date, default: Date.now },
    className: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    branch: String,
    salary: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Teacher", teacherSchema);
