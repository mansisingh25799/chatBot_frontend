"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaAward } from "react-icons/fa";
import "../auth.css";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      console.log("✅ Mock user registered:", { name, email, password, company });
      await new Promise((resolve) => setTimeout(resolve, 650));
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setError("Unable to complete sign up. Please try again.");
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
              <FaUserPlus />
            </div>
            <h2 className="auth-title">Create your account</h2>
            <p className="subtitle">
              Set up your profile to unlock contextual recommendations and faster workflows for your legal research.
            </p>

            {error && <p className="status-message error">{error}</p>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="text-input"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="company">
                  Organization / Firm (optional)
                </label>
                <input
                  id="company"
                  type="text"
                  className="text-input"
                  placeholder="Lex & Co."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="registerEmail">
                  Work email
                </label>
                <input
                  id="registerEmail"
                  type="email"
                  className="text-input"
                  placeholder="you@firm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="registerPassword">
                  Password
                </label>
                <input
                  id="registerPassword"
                  type="password"
                  className="text-input"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="auth-meta">
              <span>Already have an account?</span>
              <a className="link-btn" href="/auth/login">
                Sign in instead
              </a>
            </div>

            <div className="auth-footnote">
              <FaAward /> Trusted by legal researchers across firms and universities
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
