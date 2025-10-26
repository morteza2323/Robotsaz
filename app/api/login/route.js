// نمونه ساده از route برای ورود کاربر

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // اعتبارسنجی ساده
    if (!email || !password) {
      return Response.json(
        { success: false, message: "ایمیل و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    // فرضی: بررسی کاربر در دیتابیس
    // در آینده اینجا با MongoDB یا هر پایگاه داده‌ای وصل می‌کنی
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASS = process.env.ADMIN_PASS;
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      return Response.json(
        {
          success: true,
          message: "ورود موفقیت‌آمیز بود!",
          token: "fake-jwt-token-123",
        },
        { status: 200 }
      );
    }

    return Response.json(
      { success: false, message: "ایمیل یا رمز عبور اشتباه است." },
      { status: 401 }
    );
  } catch (err) {
    console.error("Login Error:", err);
    return Response.json(
      { success: false, message: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}
