import "./skillgap.css";

function SkillGap({
  profile,
  selectedCareer,
  analysisData,
  skillStatus,
  onRoadmap,
}) {
  if (!selectedCareer) {
    return (
      <main className="skill-page">
        <div className="skill-empty">
          <h2>🎯 No Career Selected</h2>
          <p>Please complete your profile and select a target career.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="skill-page">

      <div className="skill-header">
        <span>STEP 02</span>

        <h1>Your Skill Gap Analysis</h1>

        <p>
          Here's how your current skills compare with{" "}
          {profile.career}.
        </p>
      </div>

      {/* TOP */}

      <div className="skill-top">

        <div className="career-banner">

          <div className="career-banner-icon">
            {selectedCareer.icon}
          </div>

          <div>
            <small>Target Career</small>
            <h2>{profile.career}</h2>
          </div>

        </div>

        <div className="match-card">
          <span>Skill Match</span>

          <strong>
            {analysisData?.readiness_score ?? 0}%
          </strong>
        </div>

      </div>

      {/* LEGEND */}

      <div className="skill-legend">
        <span>🔴 Critical</span>
        <span>🟠 Need Improvement</span>
        <span>🟢 Good</span>
      </div>

      {/* SKILLS */}

      <div className="skill-grid">

        {selectedCareer.skills.map((skill) => {

          const status = skillStatus(skill);

          return (
            <div
              className={`skill-card ${status}`}
              key={skill}
            >

              <div className="skill-card-icon">
                {status === "good"
                  ? "🟢"
                  : status === "improve"
                  ? "🟠"
                  : "🔴"}
              </div>

              <div>
                <h3>{skill}</h3>

                <p>
                  {status === "good"
                    ? "You already have this skill."
                    : status === "improve"
                    ? "Improve this skill for your target role."
                    : "Important skill gap to work on."}
                </p>
              </div>

            </div>
          );
        })}

      </div>

      {/* WHY */}

      <div className="skill-info">

        <div className="skill-info-icon">
          💡
        </div>

        <div>
          <h3>Why this analysis?</h3>

          <p>
            CareerPath AI compares your current skills
            with the skills required for your selected
            career and identifies areas that need attention.
          </p>
        </div>

      </div>

      <button
        className="roadmap-button"
        onClick={onRoadmap}
      >
        View My Learning Roadmap →
      </button>

    </main>
  );
}

export default SkillGap;