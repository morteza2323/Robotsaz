import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    numericId: { type: Number, required: true, unique: true }, // ← ID عددی
    title: { type: String, required: true },
    short: { type: String, required: true },
    gallery: { type: [String], default: [] },
    badges: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    specs: { type: [[String]], default: [] }, // [[key,value]]
  },
  { timestamps: true }
);

// ایندکس یکتا (در صورت نیاز)
productSchema.index({ numericId: 1 }, { unique: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
