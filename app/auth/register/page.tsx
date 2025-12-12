"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaAward } from "react-icons/fa";
import "../auth.css";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Password validation
  const passwordRequirements: PasswordRequirement[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.met);

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

    if (!isPasswordValid) {
      setError("Password does not meet all requirements. Please check the criteria below.");
      setShowPasswordReqs(true);
      return;
    }

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
      <div className="auth-card" ref={cardRef} tabIndex={0}>
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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordReqs(true)}
                  autoComplete="new-password"
                  required
                />
                {(showPasswordReqs || password.length > 0) && (
                  <div className="password-requirements">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`password-req ${req.met ? "met" : ""}`}
                      >
                        <span className="req-icon">{req.met ? "✓" : "○"}</span>
                        <span className="req-label">{req.label}</span>
                      </div>
                    ))}
                  </div>
                )}
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
