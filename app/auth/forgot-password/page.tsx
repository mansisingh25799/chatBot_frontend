"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelopeOpenText, FaUndo } from "react-icons/fa";
import "../auth.css";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (!email) {
        setError("Please enter the email you signed up with.");
        return;
      }

      setLoading(true);
      console.log("📧 Mock reset link sent to:", email);
      await new Promise((resolve) => setTimeout(resolve, 750));
      setMessage("A secure reset link has been sent to your inbox.");
    } catch (err) {
      console.error(err);
      setError("Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-grid">
          <div className="auth-right">
            <div className="auth-icon">
              <FaEnvelopeOpenText />
            </div>
            <h2 className="auth-title">Forgot password?</h2>
            <p className="subtitle">Enter your account email and we’ll send you a link to reset your password.</p>

            {error && <p className="status-message error">{error}</p>}
            {message && <p className="status-message success">{message}</p>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="resetEmail">
                  Email address
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  className="text-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Sending link..." : "Send reset link"}
              </button>
            </form>
            <div className="auth-meta">
              <span>Remembered your password?</span>
              <a className="link-btn" href="/auth/login">
                Back to login
              </a>
            </div>

            <div className="auth-footnote">
              <FaUndo /> You’ll be redirected to set a new password securely.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
