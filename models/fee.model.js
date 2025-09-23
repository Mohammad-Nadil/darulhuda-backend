import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Fee", feeSchema);
