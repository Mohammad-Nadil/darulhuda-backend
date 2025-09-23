import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
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
