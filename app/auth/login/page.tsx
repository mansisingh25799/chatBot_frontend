"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaShieldAlt, FaLock } from "react-icons/fa";
import "../auth.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cardRef.current && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        const scrollAmount = 40;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          cardRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          cardRef.current.scrollBy({ top: -scrollAmount, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (!email || !password) {
        setError("Please enter your credentials.");
        return;
      }

      setLoading(true);
      console.log("✅ Mock login successful:", { email, password, rememberMe });
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push("/chat");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" ref={cardRef} tabIndex={0}>
        <div className="auth-grid">
          <div className="auth-right">
            <div className="auth-icon">
              <FaShieldAlt />
            </div>
            <h2 className="auth-title">Welcome back</h2>
            <p className="subtitle">
              Sign in to continue working with your AI legal copilot. Stay synced across devices with enterprise-grade security.
            </p>

            {error && <p className="status-message error">{error}</p>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="text-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="text-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="action-row">
                <label className="checkbox-control">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a className="link-btn" href="/auth/forgot-password">
                  Forgot password?
                </a>
              </div>

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="auth-meta">
              <span>New here?</span>
              <a className="link-btn" href="/auth/register">
                Create an account
              </a>
            </div>

            <div className="auth-footnote">
              <FaLock /> Secured with enterprise-grade encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
