import { connectDB } from "@/lib/mongodb.js";
import Project from "@/models/project.js";
import { getNextId } from "@/lib/nextId";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return Response.json(projects, { status: 200 });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // ✅ اعتبارسنجی موارد اجباری
    if (!body?.title || !Array.isArray(body?.gallery) || body.gallery.length === 0 || !body?.summary) {
      return Response.json(
        { success: false, error: "فیلدهای title، gallery (حداقل یک تصویر) و summary الزامی‌اند." },
        { status: 400 }
      );
    }

    // ✅ آیدی عددی افزایشی مخصوص پروژه‌ها
    const newId = await getNextId("projects");

    const project = await Project.create({
      numericId: newId,
      title: body.title,
      gallery: body.gallery,
      summary: body.summary,

      // اختیاری‌ها
      year: body.year ?? undefined,
      status: body.status || "delivered",
      overview: body.overview || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      specs: Array.isArray(body.specs) ? body.specs : [],
    });

    return Response.json({ success: true, project }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
