import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: { type: Date, default: Date.now },
    time: String,
    vertical: Boolean,
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
