import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.ARVAN_REGION,
  endpoint: process.env.ARVAN_ENDPOINT, // ← سرویس-اندپوینت، نه باکت
  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY,
    secretAccessKey: process.env.ARVAN_SECRET_KEY,
  },
  forcePathStyle: true, // لازم برای Arvan
});

export async function POST(req) {
  const { filename, contentType, folder = "uploads" } = await req.json();
  if (!filename || !contentType)
    return Response.json({ error: "filename & contentType required" }, { status: 400 });

  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${Date.now()}-${safe}`;

  const command = new PutObjectCommand({
    Bucket: process.env.ARVAN_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: "public-read", // اگر باکت private است بردار
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const publicUrl = `${process.env.ARVAN_PUBLIC_BASE}/${key}`;

  return Response.json({ uploadUrl, publicUrl, key });
}
