import { useState } from "react";
import "./Auth.css";

function Auth({ onLogin }) {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "signup") {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (form.password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }
    }

    if (onLogin) {
      onLogin(form);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-visual">

        <div className="visual-content">

          <div className="logo">
            Career<span>Path</span> AI
          </div>

          <div className="visual-badge">
            ✨ AI-Powered Career Navigator
          </div>

          <h1>
            Build the career
            <span> you deserve.</span>
          </h1>

          <p>
            Discover your ideal career, identify your skill gaps,
            follow a personalized roadmap and track your progress.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div>
                <strong>Find Your Career</strong>
                <small>Choose the right career path.</small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <strong>Discover Skill Gaps</strong>
                <small>Know what skills you need.</small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <div>
                <strong>Follow Your Roadmap</strong>
                <small>Learn step by step.</small>
              </div>
            </div>

          </div>

        </div>

        <div className="visual-circle circle-one"></div>
        <div className="visual-circle circle-two"></div>

      </div>


      {/* RIGHT SIDE */}
      <div className="auth-form-section">

        <div className="auth-card">

          <div className="mobile-logo">
            Career<span>Path</span> AI
          </div>

          <div className="auth-heading">

            <div className="auth-icon">
              {mode === "signin" ? "👋" : "🚀"}
            </div>

            <h2>
              {mode === "signin"
                ? "Welcome Back!"
                : "Create Your Account"}
            </h2>

            <p>
              {mode === "signin"
                ? "Sign in to continue your career journey."
                : "Start building your personalized career journey."}
            </p>

          </div>


          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {mode === "signup" && (
              <>
                <label>Full Name</label>

                <div className="input-wrapper">

                  <span>👤</span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                </div>
              </>
            )}


            <label>Email Address</label>

            <div className="input-wrapper">

              <span>✉️</span>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>


            <label>Password</label>

            <div className="input-wrapper">

              <span>🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>


            {mode === "signup" && (
              <>
                <label>Confirm Password</label>

                <div className="input-wrapper">

                  <span>🔐</span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-btn"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>

                </div>
              </>
            )}


            {mode === "signin" && (
              <div className="form-options">

                <label className="remember">

                  <input type="checkbox" />

                  <span>Remember me</span>

                </label>

                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() =>
                    alert("Password reset feature coming soon.")
                  }
                >
                  Forgot Password?
                </button>

              </div>
            )}


            <button
              type="submit"
              className="auth-submit"
            >
              {mode === "signin"
                ? "Sign In"
                : "Create Account"}

              <span>→</span>
            </button>

          </form>


          <div className="auth-divider">
            <span>OR</span>
          </div>


          <button
            className="guest-login"
            type="button"
            onClick={() =>
              onLogin({
                name: "Guest User",
                email: "guest@careerpath.ai",
              })
            }
          >
            <span>👤</span>
            Continue as Guest
          </button>


          <div className="auth-switch">

            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={switchMode}
            >
              {mode === "signin"
                ? "Create Account"
                : "Sign In"}
            </button>

          </div>


          <div className="security-note">
            🔐 Your information is kept secure.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Auth;