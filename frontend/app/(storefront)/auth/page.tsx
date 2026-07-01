"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import styles from "./Auth.module.css";

type AuthView = "login" | "register" | "otp";

export default function AuthPage() {
  const router = useRouter();
  const { user, sendOtp, verifyOtp } = useAuth();

  const [view, setView] = useState<AuthView>("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(120);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  // OTP countdown
  useEffect(() => {
    if (view !== "otp") return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [view]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (phone.length < 10) {
      setLocalError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const formattedPhone = phone.startsWith("0") ? phone : "0" + phone;
    setLoading(true);

    try {
      if (view === "register") {
        if (!name.trim()) {
          setLocalError("Name is required.");
          setLoading(false);
          return;
        }
        await sendOtp(formattedPhone, name, email || undefined);
      } else {
        await sendOtp(formattedPhone);
      }
      setOtpTimer(120);
      setView("otp");
    } catch (err: any) {
      setLocalError(err.message || "Failed to request OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const code = otp.join("");
    if (code.length < 6) {
      setLocalError("Please enter the complete 6-digit OTP code.");
      return;
    }

    const formattedPhone = phone.startsWith("0") ? phone : "0" + phone;
    setLoading(true);

    try {
      await verifyOtp(formattedPhone, code);
      // redirect handled by useEffect
    } catch (err: any) {
      setLocalError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={styles["auth-card"]}>
        {/* Logo */}
        <div className={styles["auth-card__header"]}>
          <Link href="/" className={styles["auth-card__logo"]}>
            <div className={styles["auth-card__logo-icon"]}>I</div>
            <div className={styles["auth-card__logo-text"]}>
              Inno<span>verse</span>
            </div>
          </Link>

          {view === "otp" ? (
            <>
              <h1 className={styles["auth-card__title"]}>Verify OTP</h1>
              <p className={styles["auth-card__subtitle"]}>
                Enter the 6-digit code sent to +880{phone}
              </p>
            </>
          ) : (
            <>
              <h1 className={styles["auth-card__title"]}>
                {view === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className={styles["auth-card__subtitle"]}>
                {view === "login"
                  ? "Sign in to track orders and manage your account"
                  : "Join Innoverse for the best gadget deals"}
              </p>
            </>
          )}
        </div>

        {localError && (
          <div style={{
            color: "#ff4d4d",
            backgroundColor: "rgba(255, 77, 77, 0.1)",
            padding: "var(--space-3)",
            borderRadius: "var(--border-radius-md)",
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-4)",
            border: "1px solid rgba(255, 77, 77, 0.2)"
          }}>
            {localError}
          </div>
        )}

        {/* OTP View */}
        {view === "otp" && (
          <form className={styles["auth-form"]} onSubmit={handleVerifyOtpSubmit}>
            <div className={styles["otp-container"]}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={styles["otp-input"]}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  aria-label={`OTP digit ${i + 1}`}
                  id={`otp-input-${i}`}
                />
              ))}
            </div>

            <div className={styles["otp-timer"]}>
              {otpTimer > 0 ? (
                <>Resend code in <span>{formatTime(otpTimer)}</span></>
              ) : (
                <button
                  className={styles["otp-resend"]}
                  onClick={async () => {
                    try {
                      setLocalError(null);
                      await sendOtp(phone.startsWith("0") ? phone : "0" + phone);
                      setOtpTimer(120);
                    } catch (err: any) {
                      setLocalError(err.message || "Failed to resend OTP.");
                    }
                  }}
                  type="button"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              className="btn btn--primary btn--lg btn--block"
              type="submit"
              id="verify-otp-btn"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              className="btn btn--secondary btn--block"
              type="button"
              onClick={() => setView("login")}
              disabled={loading}
            >
              ← Change Phone Number
            </button>
          </form>
        )}

        {/* Login / Register View */}
        {view !== "otp" && (
          <>
            {/* Tabs */}
            <div className={styles["auth-tabs"]}>
              <button
                className={`${styles["auth-tab"]} ${view === "login" ? styles["auth-tab--active"] : ""}`}
                onClick={() => setView("login")}
              >
                Sign In
              </button>
              <button
                className={`${styles["auth-tab"]} ${view === "register" ? styles["auth-tab--active"] : ""}`}
                onClick={() => setView("register")}
              >
                Create Account
              </button>
            </div>

            <form className={styles["auth-form"]} onSubmit={handleRequestOtp}>
              {/* Name (register only) */}
              {view === "register" && (
                <div className={styles["auth-input-group"]}>
                  <label className={styles["auth-label"]}>Full Name</label>
                  <input
                    type="text"
                    className={styles["auth-input"]}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="auth-name"
                    required
                  />
                </div>
              )}

              {/* Phone */}
              <div className={styles["auth-input-group"]}>
                <label className={styles["auth-label"]}>Phone Number</label>
                <div className={styles["auth-phone-group"]}>
                  <span className={styles["auth-phone-prefix"]}>+880</span>
                  <input
                    type="tel"
                    className={`${styles["auth-input"]} ${styles["auth-phone-input"]}`}
                    placeholder="1XXXXXXXXX"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setPhone(val.startsWith("0") ? val.slice(1, 11) : val.slice(0, 10));
                    }}
                    id="auth-phone"
                    required
                  />
                </div>
                <span className={styles["auth-input-hint"]}>
                  We&apos;ll send a verification code to this number
                </span>
              </div>

              {/* Email (register only) */}
              {view === "register" && (
                <div className={styles["auth-input-group"]}>
                  <label className={styles["auth-label"]}>Email (optional)</label>
                  <input
                    type="email"
                    className={styles["auth-input"]}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="auth-email"
                  />
                  <span className={styles["auth-input-hint"]}>
                    For order confirmations and receipts
                  </span>
                </div>
              )}

              <button
                className="btn btn--primary btn--lg btn--block"
                type="submit"
                id="send-otp-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : view === "login" ? "Send OTP" : "Create Account"}
              </button>

              {view === "register" && (
                <p className={styles["auth-terms"]}>
                  By creating an account, you agree to our{" "}
                  <Link href="/terms">Terms & Conditions</Link> and{" "}
                  <Link href="/privacy">Privacy Policy</Link>.
                </p>
              )}
            </form>

            {/* Divider */}
            <div className={styles["auth-divider"]} style={{ margin: "var(--space-4) 0" }}>
              or continue with
            </div>

            {/* Social Login */}
            <div className={styles["auth-social"]}>
              <button
                className={styles["auth-social-btn"]}
                onClick={() => {
                  setLocalError("Social login is stubbed. Please use Phone Number verification.");
                }}
                type="button"
              >
                <span className={styles["auth-social-btn__icon"]}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </span>
                Continue with Google
              </button>
            </div>

            {/* Footer */}
            <div className={styles["auth-card__footer"]}>
              {view === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); setView("register"); }}>
                    Create one
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); setView("login"); }}>
                    Sign in
                  </a>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
