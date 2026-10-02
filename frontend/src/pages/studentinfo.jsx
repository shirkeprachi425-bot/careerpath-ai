import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./studentinfo.css";

function StudentInfo({ user }) {
  const navigate = useNavigate();
  console.log("STUDENT INFO COMPONENT RENDERED");
  console.log("STUDENT INFO USER:", user);
  const [form, setForm] = useState({
    education: "",
    skills: "",
    experience: "",
    studyTime: "",
    interests: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD EXISTING PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      console.log("StudentInfo received user:", user);

      const userId = user?.id ?? user?.userId;

      console.log("Resolved user ID:", userId);

      if (!userId) {
        setError("User information is missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("Loading profile for user:", userId);

        const response = await fetch(
          `http://careerpath-ai-jhse.onrender.com/api/student-profile/${userId}`,
        );

        const data = await response.json();

        console.log("Profile GET response:", data);

        if (!response.ok) {
          setError(data.error || "Unable to load your profile.");
          return;
        }

        if (data.profile) {
          setForm({
            education: data.profile.education || "",
            skills: data.profile.skills || "",
            experience: data.profile.experience || "",
            studyTime: data.profile.studyTime || "",
            interests: data.profile.interests || "",
          });

          console.log("Existing profile loaded into form.");
        } else {
          console.log("No existing profile found.");
        }
      } catch (error) {
        console.error("Profile loading error:", error);

        setError(
          "Unable to connect to the server. Please make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = user?.id ?? user?.userId;

    if (!userId) {
      setError("User information is missing. Please login again.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      console.log("Saving profile for user:", userId);

      const response = await fetch(
        "http://careerpath-ai-jhse.onrender.com/api/student-profile",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: userId,
            education: form.education,
            skills: form.skills,
            experience: form.experience,
            studyTime: form.studyTime,
            interests: form.interests,
          }),
        },
      );

      const data = await response.json();

      console.log("Profile POST response:", data);

      if (!response.ok) {
        setError(data.error || "Unable to save your profile.");
        return;
      }

      setSuccess("Profile saved successfully!");

      setTimeout(() => {
        navigate("/assessment");
      }, 1000);
    } catch (error) {
      console.error("Profile saving error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="student-info-page">
        <div className="student-info-card">
          <div className="student-info-header">
            <div className="student-info-icon">👤</div>

            <h1>Loading Your Profile...</h1>

            <p>Checking whether you already have a saved profile.</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="student-info-page">
      <div className="student-info-card">
        <div className="student-info-header">
          <div className="student-info-icon">👤</div>

          <h1>Tell Us About Yourself</h1>

          <p>
            Share a few details about yourself so we can personalize your career
            journey.
          </p>
        </div>

        {error && <div className="student-error">⚠️ {error}</div>}

        {success && <div className="student-success">✓ {success}</div>}

        <form className="student-info-form" onSubmit={handleSubmit}>
          {/* EDUCATION */}

          <div className="student-field">
            <label>Education</label>

            <select
              name="education"
              value={form.education}
              onChange={handleChange}
              required
            >
              <option value="">Select education</option>
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Graduation">Graduation</option>
              <option value="Post Graduation">Post Graduation</option>
            </select>
          </div>

          {/* EXPERIENCE */}

          <div className="student-field">
            <label>Experience</label>

            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
            >
              <option value="">Select experience</option>
              <option value="Fresher">Fresher</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1–3 years">1–3 years</option>
              <option value="3+ years">3+ years</option>
            </select>
          </div>

          {/* SKILLS */}

          <div className="student-field full">
            <label>Current Skills</label>

            <input
              type="text"
              name="skills"
              placeholder="Example: Python, HTML, SQL"
              value={form.skills}
              onChange={handleChange}
              required
            />
          </div>

          {/* STUDY TIME */}

          <div className="student-field">
            <label>Daily Learning Time</label>

            <select
              name="studyTime"
              value={form.studyTime}
              onChange={handleChange}
              required
            >
              <option value="">Select time</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="3+ hours">3+ hours</option>
            </select>
          </div>

          {/* INTERESTS */}

          <div className="student-field">
            <label>Interests</label>

            <input
              type="text"
              name="interests"
              placeholder="Example: AI, Web Development"
              value={form.interests}
              onChange={handleChange}
              required
            />
          </div>

          {/* SUBMIT */}

          <button type="submit" className="student-submit" disabled={saving}>
            {saving ? "Saving Profile..." : "Continue to Assessment →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentInfo;
