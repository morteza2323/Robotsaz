import { connectDB } from "@/lib/mongodb";
import Counter from "@/models/counter";

// گرفتن عدد بعدی به‌صورت اتمیک
export async function getNextId(name) {
  await connectDB();
  const doc = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return doc.value; // 1, 2, 3, ...
}
