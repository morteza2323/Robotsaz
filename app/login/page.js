"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useToast } from "../components/toast/ToastProvider";

export default function LoginPage() {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(logged);
    }
  }, []);

  // ✅ Login handler
  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const form = new FormData(e.currentTarget);
    const email = (form.get("email") || "").toString().trim();
    const password = (form.get("password") || "").toString();

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return toast.error("Invalid email!");
    if (!password || password.length < 6)
      return toast.error("Password must be at least 6 characters.");

    setLoading(true);
    const tid = toast.loading("Logging in...");

    try {
      // Demo login simulation
      await new Promise((r) => setTimeout(r, 1000));

      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("auth-change"));
      setIsLoggedIn(true);
      toast.dismiss(tid);
      toast.success("Login successful ✅");

      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err) {
      toast.dismiss(tid);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Logout handler
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("auth-change"));
    setIsLoggedIn(false);
    toast.info("Logged out");
    setTimeout(() => router.push("/"), 600);
  }

  // ✅ Logged in state
  if (isLoggedIn) {
    return (
      <main className={styles.login}>
        <div className="container">
          <div className={styles.card}>
            <h1 className={styles.title}>You are logged in</h1>
            <p className={styles.sub}>
              Click below to sign out of your account.
            </p>

            <button className={styles.btnPrimary} onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ✅ Login form
  return (
    <main className={styles.login}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.sub}>Enter your email and password.</p>

          <form onSubmit={onSubmit} noValidate>
            <div className={styles.row}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.row}>
              <label htmlFor="password">Password</label>
              <div className={styles.passWrap}>
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className={styles.toggle}
                >
                  {showPass ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>

            <button className={styles.btnPrimary} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
