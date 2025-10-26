// app/api/projects/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb.js";
import Project from "@/models/project";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// S3 client برای آروان
const s3 = new S3Client({
  region: process.env.ARVAN_REGION,
  endpoint: process.env.ARVAN_ENDPOINT, // مثل: https://s3.ir-thr-at1.arvanstorage.ir
  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY,
    secretAccessKey: process.env.ARVAN_SECRET_KEY,
  },
  forcePathStyle: true,
});

// کمک: استخراج کلید فایل از URL عمومی آروان
function extractArvanKey(url) {
  try {
    // مثال: https://robotsaz2.s3.ir-thr-at1.arvanstorage.ir/projects/123/abc.png
    const base = process.env.ARVAN_PUBLIC_BASE.replace(/^https?:\/\//, "");
    const idx = url.indexOf(base);
    if (idx === -1) return null;
    return url.split(base)[1].replace(/^\/+/, ""); // projects/123/abc.png
  } catch {
    return null;
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB();

    const numericId = Number(params.id);
    if (!numericId || Number.isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    // 1) یافتن پروژه
    const project = await Project.findOne({ numericId });
    if (!project) {
      return NextResponse.json(
        { success: false, error: "پروژه یافت نشد" },
        { status: 404 }
      );
    }

    // 2) حذف تصاویر از آروان (اگر URLها از آروان هستند)
    if (Array.isArray(project.gallery) && project.gallery.length) {
      for (const url of project.gallery) {
        try {
          const Key = extractArvanKey(url);
          if (!Key) continue;
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.ARVAN_BUCKET, // مثلا: robotsaz2
              Key,
            })
          );
        } catch (e) {
          // اگر حذف یکی از عکس‌ها خطا داد، بقیه را ادامه بدهیم
          console.warn("Arvan delete error:", e.message);
        }
      }
    }

    // 3) حذف سند از دیتابیس
    await Project.deleteOne({ numericId });

    return NextResponse.json(
      { success: true, message: "پروژه و تصاویر آن حذف شد" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const numericId = Number(params.id);
    if (!numericId || Number.isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // فقط فیلدهای ارسال‌شده آپدیت می‌شوند
    const update = {
      ...(body.title !== undefined && { title: body.title }),
      ...(Array.isArray(body.gallery) && { gallery: body.gallery }),
      ...(body.summary !== undefined && { summary: body.summary }),
      ...(body.year !== undefined && { year: body.year }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.overview !== undefined && { overview: body.overview }),
      ...(Array.isArray(body.tags) && { tags: body.tags }),
      ...(Array.isArray(body.specs) && { specs: body.specs }),
    };

    const project = await Project.findOneAndUpdate({ numericId }, update, {
      new: true,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "پروژه یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/projects/[id] error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
