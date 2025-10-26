import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.ARVAN_REGION,
  endpoint: process.env.ARVAN_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY,
    secretAccessKey: process.env.ARVAN_SECRET_KEY,
  },
  forcePathStyle: true,
});

/** 🔹 DELETE — حذف محصول + عکس‌های مرتبط */
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const id = params.id;
    if (!id) return NextResponse.json({ success: false, error: "شناسه محصول نامعتبر است" }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false, error: "محصول یافت نشد" }, { status: 404 });

    // 🔸 حذف عکس‌ها از Arvan Cloud
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      for (const url of product.gallery) {
        try {
          const key = extractArvanKey(url);
          if (key) {
            await s3.send(new DeleteObjectCommand({
              Bucket: process.env.ARVAN_BUCKET,
              Key: key,
            }));
          }
        } catch (e) {
          console.warn("خطا در حذف تصویر از Arvan:", e.message);
        }
      }
    }

    // 🔸 حذف محصول از دیتابیس
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "محصول و تصاویر آن حذف شد" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** 🧩 تابع کمکی: استخراج مسیر فایل از URL آروان */
function extractArvanKey(url) {
  try {
    const base = process.env.ARVAN_PUBLIC_BASE.replace(/^https?:\/\//, "");
    const idx = url.indexOf(base);
    if (idx === -1) return null;
    return url.split(base)[1].replace(/^\/+/, "");
  } catch {
    return null;
  }
}
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const id = params.id;
    const body = await req.json();

    // آپدیت امن فقط فیلدهای ارسالی
    const update = {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.short !== undefined && { short: body.short }),
      ...(Array.isArray(body.gallery) && { gallery: body.gallery }),
      ...(Array.isArray(body.badges) && { badges: body.badges }),
      ...(Array.isArray(body.highlights) && { highlights: body.highlights }),
      ...(Array.isArray(body.specs) && { specs: body.specs }),
    };

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) {
      return NextResponse.json({ success: false, error: "محصول یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (e) {
    console.error("PUT /api/products/[id] error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
