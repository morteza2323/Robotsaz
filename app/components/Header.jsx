"use client";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useToast } from "./toast/ToastProvider";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  const readAuth = () => {
    try {
      const logged =
        typeof window !== "undefined" &&
        localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(!!logged);
    } catch {}
  };

  useEffect(() => {
    readAuth();
  }, [pathname]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "isLoggedIn") readAuth();
    };
    const onAuthChange = () => readAuth();

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-change", onAuthChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-change", onAuthChange);
    };
  }, []);

  function handleLogout() {
    router.push("/login");
  }

  function handleLogin() {
    router.push("/login");
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          <div className={styles.row}>
            <Link href="/" className={styles.logo}>
              Robotsaz
            </Link>
            <div className={styles.actions}>
              {isLoggedIn ? (
                <>
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                  </button>
                  <button onClick={() => router.push('/dashboard')} className={styles.logoutBtn}>
                    Dashboard
                  </button>
                </>
              ) : (
                <button onClick={handleLogin} className={styles.loginBtn}>
                  Login
                </button>
              )}
            </div>
          </div>

          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact" className="btn-ghost">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
