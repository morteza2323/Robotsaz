import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product";
import { getNextId } from "@/lib/nextId";

// دریافت تمام محصولات
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return Response.json(products, { status: 200 });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// افزودن محصول جدید
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newId = await getNextId("products");

    // اعتبارسنجی ساده
    if (!body.title || !body.short)
      return NextResponse.json(
        { error: "عنوان و توضیح کوتاه الزامی است" },
        { status: 400 }
      );
    if (!Array.isArray(body.gallery) || body.gallery.length === 0)
      return NextResponse.json(
        { error: "حداقل یک تصویر باید انتخاب شود" },
        { status: 400 }
      );

    const product = await Product.create({
      numericId: newId,
      title: body.title,
      short: body.short,
      gallery: body.gallery,
      badges: Array.isArray(body.badges) ? body.badges : [],
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      specs: Array.isArray(body.specs) ? body.specs : [],
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    console.error("POST /products error:", err);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
