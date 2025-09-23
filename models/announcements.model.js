import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    time: String,
    file: {
      secure_url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Announcement", announcementSchema);
