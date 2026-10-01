import "./Profile.css";

function Profile({
  profile,
  setProfile,
  normalizedCareers = [],
  careersLoading = false,
  careersError = "",
  onSubmit,
  loading = false,
}) {
  const update = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <main className="profile-page">

      <div className="profile-header">
        <span>STEP 01</span>
        <h1>Build Your Career Profile</h1>
        <p>
          Tell us about yourself so we can personalize your career journey.
        </p>
      </div>

      <form onSubmit={onSubmit}>

        <div className="profile-card">
          <h2>👤 Personal Information</h2>

          <div className="profile-grid">

            <div className="profile-field">
              <label>Full Name</label>
              <input
                value={profile.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="profile-field">
              <label>Education</label>
              <select
                value={profile.education}
                onChange={(e) => update("education", e.target.value)}
                required
              >
                <option value="">Select education</option>
                <option>10th</option>
                <option>12th</option>
                <option>Diploma</option>
                <option>Graduation</option>
                <option>Post Graduation</option>
              </select>
            </div>

            <div className="profile-field">
              <label>Current Skills</label>
              <input
                value={profile.skills}
                onChange={(e) => update("skills", e.target.value)}
                placeholder="Python, HTML, SQL..."
                required
              />
            </div>

            <div className="profile-field">
              <label>Skill Level</label>
              <select
                value={profile.skillLevel}
                onChange={(e) => update("skillLevel", e.target.value)}
                required
              >
                <option value="">Select level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="profile-field">
              <label>Experience</label>
              <select
                value={profile.experience}
                onChange={(e) => update("experience", e.target.value)}
                required
              >
                <option value="">Select experience</option>
                <option>Fresher</option>
                <option>Less than 1 year</option>
                <option>1–3 years</option>
                <option>3+ years</option>
              </select>
            </div>

            <div className="profile-field">
              <label>Interests</label>
              <input
                value={profile.interests}
                onChange={(e) => update("interests", e.target.value)}
                placeholder="AI, coding, business..."
                required
              />
            </div>

            <div className="profile-field">
              <label>Daily Learning Time</label>
              <select
                value={profile.studyTime}
                onChange={(e) => update("studyTime", e.target.value)}
                required
              >
                <option value="">How much time?</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>3+ hours</option>
              </select>
            </div>

          </div>
        </div>

        <div className="profile-card">
          <h2>🎯 Choose Your Target Career</h2>

          <p className="profile-description">
            Select one career to generate your personalized roadmap.
          </p>

          {careersLoading && (
            <p>Loading careers...</p>
          )}

          {careersError && (
            <p className="profile-error">
              {careersError}
            </p>
          )}

          <div className="career-grid">

            {normalizedCareers.map((career) => (
              <button
                type="button"
                key={career.name}
                className={`career-option ${
                  profile.career === career.name ? "selected" : ""
                }`}
                onClick={() => update("career", career.name)}
              >
                <span className="career-icon">
                  {career.icon}
                </span>

                <strong>{career.name}</strong>

                <small>
                  {career.skills.length} core skills
                </small>
              </button>
            ))}

          </div>

          {!careersLoading && normalizedCareers.length === 0 && (
            <p className="profile-description">
              No careers found. Please check your backend.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="profile-submit"
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Analyze My Career Path 🚀"}
        </button>

      </form>

    </main>
  );
}

export default Profile;