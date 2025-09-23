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
    rollNumber: { type: String, unique: true },

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

studentSchema.pre("save", async function (next) {
  try {
    const Class = mongoose.model("Class");
    if (this.isNew && this.className) {
      await Class.findByIdAndUpdate(this.className, {
        $addToSet: { students: this._id },
      });
    } else if (this.isModified("className")) {
      const oldStudent = await this.constructor.findById(this._id);
      if (oldStudent.className) {
        await Class.findByIdAndUpdate(oldStudent.className, {
          $pull: { students: this._id },
        });
      }
      if (this.className) {
        await Class.findByIdAndUpdate(this.className, {
          $addToSet: { students: this._id },
        });
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

async function removeFromClass(doc, next) {
  try {
    if (doc?.className) {
      const Class = mongoose.model("Class");
      await Class.findByIdAndUpdate(doc.className, {
        $pull: { students: doc._id },
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

studentSchema.post("findOneAndDelete", removeFromClass);
studentSchema.post("findByIdAndDelete", removeFromClass);

export default mongoose.model("Student", studentSchema);
