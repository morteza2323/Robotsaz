import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    numericId: { type: Number, required: true, unique: true },
    title:     { type: String, required: true },           // اجباری
    gallery:   { type: [String], required: true, default: [] }, // اجباری: حداقل یک تصویر
    summary:   { type: String, required: true },           // اجباری

    // اختیاری‌ها
    year: Number,
    status: { type: String, enum: ["delivered", "in-progress", "prototype"], default: "delivered" },
    overview: { type: String, default: "" },               // ✅ اختیاری (required نیست)
    tags: { type: [String], default: [] },
    specs: { type: [[String]], default: [] },
  },
  { timestamps: true }
);

ProjectSchema.index({ numericId: 1 }, { unique: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
