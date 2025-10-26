import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // مثلا 'product'
    value: { type: Number, default: 0 },
  },
  { versionKey: false }
);

export default mongoose.models.Counter || mongoose.model("Counter", counterSchema);
