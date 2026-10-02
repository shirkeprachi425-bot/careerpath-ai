import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth({ onLogin }) {
  const navigate = useNavigate();

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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =========================
    // SIGNUP VALIDATION
    // =========================

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

    try {
      setLoading(true);

      // =========================
      // SIGNUP
      // =========================

      if (mode === "signup") {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to create account.");
          return;
        }

        // SUCCESSFUL SIGNUP

        setSuccess("Account created successfully! Please sign in.");

        // Clear form
        setForm({
          name: "",
          email: form.email,
          password: "",
          confirmPassword: "",
        });

        // Switch to signin after a short delay
        setTimeout(() => {
          setMode("signin");
          setSuccess("");
        }, 1500);

        return;
      }

      // =========================
      // LOGIN
      // =========================

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // LOGIN SUCCESSFUL

      console.log("Login successful:", data);
      console.log("USER BEING SENT TO APP:", data.user);

      // Tell App.jsx that login was successful
      onLogin(data.user);

      // Clear password fields
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        "Unable to connect to the server. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");

    setError("");
    setSuccess("");

    setShowPassword(false);
    setShowConfirmPassword(false);

    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}

      <div className="auth-visual">
        <div className="visual-content">
          <div className="logo">
            Career<span>Path</span> AI
          </div>

          <div className="visual-badge">✨ AI-Powered Career Navigator</div>

          <h1>
            Build the career
            <span> you deserve.</span>
          </h1>

          <p>
            Discover your ideal career, identify your skill gaps, follow a
            personalized roadmap and track your progress.
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
            <div className="auth-icon">{mode === "signin" ? "👋" : "🚀"}</div>

            <h2>
              {mode === "signin" ? "Welcome Back!" : "Create Your Account"}
            </h2>

            <p>
              {mode === "signin"
                ? "Sign in to continue your career journey."
                : "Start building your personalized career journey."}
            </p>
          </div>

          {/* ERROR */}

          {error && <div className="auth-error">⚠️ {error}</div>}

          {/* SUCCESS */}

          {success && <div className="auth-success">✓ {success}</div>}

          <form onSubmit={handleSubmit}>
            {/* NAME */}

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

            {/* EMAIL */}

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

            {/* PASSWORD */}

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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}

            {mode === "signup" && (
              <>
                <label>Confirm Password</label>

                <div className="input-wrapper">
                  <span>🔐</span>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </>
            )}

            {/* SIGNIN OPTIONS */}

            {mode === "signin" && (
              <div className="form-options">
                <label className="remember">
                  <input type="checkbox" />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() => alert("Password reset feature coming soon.")}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* SUBMIT */}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}

              {!loading && <span>→</span>}
            </button>
          </form>

          {/* DIVIDER */}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* GUEST */}

          <button
            className="guest-login"
            type="button"
            onClick={() => navigate("/student-info")}
          >
            <span>👤</span>
            Continue as Guest
          </button>

          {/* SWITCH */}

          <div className="auth-switch">
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button type="button" onClick={switchMode}>
              {mode === "signin" ? "Create Account" : "Sign In"}
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
