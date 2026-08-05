import { useState, useId } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, PenTool, Loader2, AlertCircle, User } from "lucide-react";
import { useApp } from "../context";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FreelanceHubLogin({ mode = "login" }) {
  const { login, signup } = useApp();
  const [role, setRole] = useState("freelancer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [formError, setFormError] = useState("");

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const emailErrorId = useId();
  const passwordErrorId = useId();
  const nameErrorId = useId();

  const isSignUp = mode === "signup";

  const nameError = isSignUp && touched.name && !name ? "Name is required." : "";

  const emailError = touched.email
    ? !email
      ? "Email is required."
      : !EMAIL_RE.test(email)
      ? "Enter a valid email address."
      : ""
    : "";

  const passwordError = touched.password
    ? !password
      ? "Password is required."
      : password.length < 8
      ? "Password must be at least 8 characters."
      : ""
    : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    setTouched({ name: true, email: true, password: true });

    const nameValid = !isSignUp || !!name;
    const emailValid = !!email && EMAIL_RE.test(email);
    const passwordValid = !!password && password.length >= 8;

    if (!nameValid || !emailValid || !passwordValid) {
      setFormError("Fix the errors below to continue.");
      return;
    }

    setStatus("loading");
    
    setTimeout(() => {
      let result;
      if (isSignUp) {
        result = signup(name, email, password, role);
      } else {
        result = login(email, password);
      }

      if (result.success) {
        setStatus("success");
        setTimeout(() => {
          if (result.user.role === "client") {
            window.location.hash = "#/dashboard/client";
          } else if (result.user.role === "admin") {
            window.location.hash = "#/admin";
          } else {
            window.location.hash = "#/projects";
          }
        }, 800);
      } else {
        setStatus("idle");
        setFormError(result.error || "Authentication failed.");
      }
    }, 1000);
  };

  const navigateTo = (hash) => {
    setFormError("");
    setTouched({ name: false, email: false, password: false });
    window.location.hash = hash;
  };

  return (
    <div className="ffh-page">
      <style>{`
        .ffh-page {
          min-height: 90vh;
          width: 100%;
          display: flex;
          background-color: #F5F6F4;
        }

        .ffh-serif { font-family: 'Fraunces', serif; }
        .ffh-sans { font-family: 'Inter', sans-serif; }
        .ffh-mono { font-family: 'IBM Plex Mono', monospace; }

        /* ---- Left hero panel ---- */
        .ffh-hero {
          display: none;
          width: 42%;
          position: relative;
          overflow: hidden;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          background-color: #10192E;
        }

        @media (min-width: 1024px) {
          .ffh-hero { display: flex; }
        }

        .ffh-logo-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 64px;
        }

        .ffh-logo-badge {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #D9A441;
          flex-shrink: 0;
        }

        .ffh-logo-text {
          color: #fff;
          font-size: 14px;
          letter-spacing: 0.02em;
          font-weight: 500;
        }

        .ffh-hero h1 {
          color: #fff;
          font-size: 36px;
          line-height: 1.2;
          font-weight: 550;
          margin: 0 0 16px 0;
        }

        .ffh-hero p.ffh-tagline {
          font-size: 14px;
          line-height: 1.6;
          max-width: 320px;
          color: #9AA3B5;
          margin: 0;
        }

        .ffh-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid #24304F;
        }

        .ffh-stats .ffh-stat-num {
          font-size: 24px;
          color: #fff;
          font-weight: 550;
          margin: 0 0 2px 0;
        }

        .ffh-stats .ffh-stat-label {
          font-size: 12px;
          color: #7C87A0;
          margin: 0;
        }

        /* ---- Right form panel ---- */
        .ffh-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        @media (min-width: 640px) {
          .ffh-form-panel { padding: 48px; }
        }

        .ffh-form-inner {
          width: 100%;
          max-width: 420px;
        }

        .ffh-mobile-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 40px;
        }

        @media (min-width: 1024px) {
          .ffh-mobile-logo { display: none; }
        }

        .ffh-mobile-logo-text {
          font-size: 14px;
          letter-spacing: 0.02em;
          font-weight: 500;
          color: #10192E;
        }

        .ffh-title {
          color: #1C2333;
          font-size: 24px;
          font-weight: 550;
          margin: 0 0 4px 0;
        }

        .ffh-subtitle {
          color: #6B7280;
          font-size: 14px;
          margin: 0 0 28px 0;
        }

        /* Role toggle */
        .ffh-role-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          padding: 4px;
          margin-bottom: 24px;
          background-color: #EAE8E2;
          border-radius: 10px;
        }

        .ffh-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          padding: 10px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #6B7280;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .ffh-toggle[aria-checked="true"] {
          background-color: #10192E;
          color: #fff;
          box-shadow: 0 2px 0 rgba(0,0,0,0.04);
        }

        /* Form fields */
        .ffh-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #1C2333;
          margin-bottom: 6px;
        }

        .ffh-field {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          margin-bottom: 4px;
          border-radius: 12px;
          background-color: #FFFFFF;
          border: 1px solid #E4E2DC;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .ffh-field:focus-within {
          border-color: #10192E;
          box-shadow: 0 0 0 3px rgba(16, 25, 46, 0.1);
        }

        .ffh-field.has-error {
          border-color: #B3441C;
        }

        .ffh-field input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          padding: 11px 0;
          font-size: 14px;
          color: #1C2333;
        }

        .ffh-error-slot {
          margin-bottom: 12px;
          min-height: 18px;
        }

        .ffh-error-text {
          font-size: 12px;
          color: #B3441C;
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 4px 0 0 0;
        }

        .ffh-eye {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #9AA3B5;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .ffh-row-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .ffh-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6B7280;
          cursor: pointer;
        }

        input.ffh-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid #E4E2DC;
          background: #FFFFFF;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          margin: 0;
        }

        input.ffh-checkbox:checked {
          background: #10192E;
          border-color: #10192E;
        }

        .ffh-link {
          text-decoration: none;
          font-size: 12px;
          color: #1F7A5C;
          font-weight: 500;
          cursor: pointer;
        }

        .ffh-link:hover {
          text-decoration: underline;
        }

        .ffh-form-error {
          font-size: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 6px;
          padding: 8px 12px;
          color: #B3441C;
          background-color: #FBEEE8;
          border: 1px solid #F0D2C4;
        }

        .ffh-btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 0;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background-color: #D9A441;
          color: #10192E;
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        .ffh-btn-primary:hover:not(:disabled) {
          background-color: #C6923A;
        }

        .ffh-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .ffh-footer-text {
          font-size: 14px;
          text-align: center;
          color: #6B7280;
          margin-top: 28px;
        }

        .ffh-success-icon {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          background-color: #EAF3EE;
        }

        .spin {
          animation: ffh-spin 0.8s linear infinite;
        }
        @keyframes ffh-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Left Hero Panel */}
      <div className="ffh-hero">
        <div>
          <div className="ffh-logo-row">
            <div className="ffh-logo-badge">
              <Briefcase size={16} color="#10192E" strokeWidth={2.5} />
            </div>
            <span className="ffh-sans ffh-logo-text">FreelanceHub</span>
          </div>

          <h1 className="ffh-serif">
            Where skilled work
            <br />
            finds its client.
          </h1>
          <p className="ffh-sans ffh-tagline">
            Post a project or place a bid — every collaboration on FreelanceHub
            starts with a clear brief and a fair price.
          </p>
        </div>

        <div className="ffh-stats">
          <div>
            <p className="ffh-serif ffh-stat-num">28k+</p>
            <p className="ffh-sans ffh-stat-label">Freelancers</p>
          </div>
          <div>
            <p className="ffh-serif ffh-stat-num">6.2k</p>
            <p className="ffh-sans ffh-stat-label">Active projects</p>
          </div>
          <div>
            <p className="ffh-serif ffh-stat-num">₹4.8Cr</p>
            <p className="ffh-sans ffh-stat-label">Paid out this month</p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="ffh-form-panel">
        <div className="ffh-form-inner">
          <div className="ffh-mobile-logo">
            <div className="ffh-logo-badge">
              <Briefcase size={16} color="#10192E" strokeWidth={2.5} />
            </div>
            <span className="ffh-sans ffh-mobile-logo-text">FreelanceHub</span>
          </div>

          {status === "success" ? (
            <div>
              <div className="ffh-success-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10.5L8 14.5L16 6" stroke="#1F7A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="ffh-serif ffh-title">Success!</h2>
              <p className="ffh-sans ffh-subtitle" style={{ marginBottom: 0 }}>
                Redirecting you to your workspace…
              </p>
            </div>
          ) : (
            <>
              <h2 className="ffh-serif ffh-title">
                {isSignUp ? "Create an account" : "Sign in"}
              </h2>
              <p className="ffh-sans ffh-subtitle">
                {isSignUp
                  ? "Join FreelanceHub to kickstart your work or hire experts."
                  : "Enter your details to access your workspace."}
              </p>

              {/* Role selector: only visible during signup so users can choose client or freelancer */}
              {isSignUp && (
                <div role="radiogroup" aria-label="Account type" className="ffh-role-toggle">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={role === "freelancer"}
                    onClick={() => setRole("freelancer")}
                    className="ffh-toggle ffh-sans"
                  >
                    <PenTool size={14} /> Freelancer
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={role === "client"}
                    onClick={() => setRole("client")}
                    className="ffh-toggle ffh-sans"
                  >
                    <Briefcase size={14} /> Client
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {isSignUp && (
                  <>
                    <label htmlFor={nameId} className="ffh-label ffh-sans">
                      Full Name / Company Name
                    </label>
                    <div className={`ffh-field ${nameError ? "has-error" : ""}`}>
                      <User size={16} style={{ color: nameError ? "#B3441C" : "#9AA3B5", flexShrink: 0 }} />
                      <input
                        id={nameId}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        placeholder="e.g. Sarah Jenkins"
                      />
                    </div>
                    <div className="ffh-error-slot">
                      {nameError && (
                        <p id={nameErrorId} className="ffh-sans ffh-error-text">
                          <AlertCircle size={12} /> {nameError}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <label htmlFor={emailId} className="ffh-label ffh-sans">
                  Email address
                </label>
                <div className={`ffh-field ${emailError ? "has-error" : ""}`}>
                  <Mail size={16} style={{ color: emailError ? "#B3441C" : "#9AA3B5", flexShrink: 0 }} />
                  <input
                    id={emailId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    placeholder="you@example.com"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? emailErrorId : undefined}
                  />
                </div>
                <div className="ffh-error-slot">
                  {emailError && (
                    <p id={emailErrorId} className="ffh-sans ffh-error-text">
                      <AlertCircle size={12} /> {emailError}
                    </p>
                  )}
                </div>

                <label htmlFor={passwordId} className="ffh-label ffh-sans">
                  Password
                </label>
                <div className={`ffh-field ${passwordError ? "has-error" : ""}`}>
                  <Lock size={16} style={{ color: passwordError ? "#B3441C" : "#9AA3B5", flexShrink: 0 }} />
                  <input
                    id={passwordId}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    placeholder="••••••••"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? passwordErrorId : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="ffh-eye"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="ffh-error-slot">
                  {passwordError && (
                    <p id={passwordErrorId} className="ffh-sans ffh-error-text">
                      <AlertCircle size={12} /> {passwordError}
                    </p>
                  )}
                </div>

                {!isSignUp && (
                  <div className="ffh-row-between">
                    <label className="ffh-remember ffh-sans">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="ffh-checkbox"
                      />
                      Remember me
                    </label>
                    <span className="ffh-link ffh-sans">
                      Forgot password?
                    </span>
                  </div>
                )}

                {formError && (
                  <div role="alert" className="ffh-sans ffh-form-error">
                    <AlertCircle size={13} /> {formError}
                  </div>
                )}

                <button type="submit" disabled={status === "loading"} className="ffh-btn-primary ffh-sans">
                  {status === "loading" ? (
                    <>
                      <Loader2 size={15} className="spin" /> Processing…
                    </>
                  ) : (
                    <>
                      Sign
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <p className="ffh-sans ffh-footer-text">
                {isSignUp ? "Already have an account? " : "New to FreelanceHub? "}
                <span
                  onClick={() => navigateTo(isSignUp ? "#/login" : "#/signup")}
                  className="ffh-link"
                  style={{ fontSize: 14 }}
                >
                  {isSignUp ? "Sign In" : "Create an account"}
                </span>
              </p>
              
              {/* Seed Demo Quick Login Helper */}
              {!isSignUp && (
                <div className="mt-4 p-3 border rounded bg-white text-start">
                  <p className="mb-2 fw-semibold" style={{ fontSize: "11px", color: "var(--fh-slate)" }}>DEMO QUICK ACCOUNTS:</p>
                  <div className="d-flex flex-wrap gap-2">
                    <button 
                      type="button" 
                      onClick={() => { setEmail("sarah@bakery.com"); setPassword("password123"); }}
                      className="btn btn-sm btn-light border" 
                      style={{ fontSize: "11px" }}
                    >
                      Sarah (Client)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setEmail("alex@developer.com"); setPassword("password123"); }}
                      className="btn btn-sm btn-light border" 
                      style={{ fontSize: "11px" }}
                    >
                      Alex (Freelancer)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setEmail("admin@freelancehub.com"); setPassword("password123"); }}
                      className="btn btn-sm btn-light border" 
                      style={{ fontSize: "11px" }}
                    >
                      Admin Console
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}