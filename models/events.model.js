import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: { type: Date, default: Date.now },
    image: {
      secure_url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);
