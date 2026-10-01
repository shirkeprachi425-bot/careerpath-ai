import "./Dashboard.css";

function Dashboard({
  userName = "User",
  career = "Software Developer",
  progress = 0,
  onSkillGap,
  onRoadmap,
  onResources,
  onProgress,
}) {
  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-label">YOUR DASHBOARD</span>

          <h1>
            Welcome back, <strong>{userName}</strong> 👋
          </h1>

          <p>
            Continue your career journey and keep building
            the skills you need for your future.
          </p>
        </div>

        <div className="dashboard-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
      </section>

      {/* CAREER CARD */}
      <section className="career-summary">

        <div className="career-summary-icon">
          🚀
        </div>

        <div className="career-summary-info">
          <span>YOUR TARGET CAREER</span>
          <h2>{career}</h2>
          <p>
            Keep learning and complete your roadmap milestones.
          </p>
        </div>

        <div className="dashboard-progress">
          <div
            className="dashboard-progress-circle"
            style={{
              background: `conic-gradient(#5965e8 ${
                progress * 3.6
              }deg, #e9ebf5 0deg)`,
            }}
          >
            <div>
              <strong>{progress}%</strong>
            </div>
          </div>

          <span>Overall Progress</span>
        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <span>QUICK ACTIONS</span>
            <h2>Continue Your Journey</h2>
          </div>
        </div>

        <div className="dashboard-actions">

          <button
            className="dashboard-action"
            onClick={onSkillGap}
          >
            <div className="action-icon purple">
              📊
            </div>

            <div>
              <h3>Skill Gap</h3>
              <p>
                Check the skills you need to improve.
              </p>
            </div>

            <span>→</span>
          </button>

          <button
            className="dashboard-action"
            onClick={onRoadmap}
          >
            <div className="action-icon blue">
              🗺️
            </div>

            <div>
              <h3>My Roadmap</h3>
              <p>
                Continue your personalized learning plan.
              </p>
            </div>

            <span>→</span>
          </button>

          <button
            className="dashboard-action"
            onClick={onResources}
          >
            <div className="action-icon green">
              📚
            </div>

            <div>
              <h3>Resources</h3>
              <p>
                Explore courses, projects and learning material.
              </p>
            </div>

            <span>→</span>
          </button>

          <button
            className="dashboard-action"
            onClick={onProgress}
          >
            <div className="action-icon orange">
              📈
            </div>

            <div>
              <h3>Progress</h3>
              <p>
                Track your completed learning milestones.
              </p>
            </div>

            <span>→</span>
          </button>

        </div>

      </section>

      {/* STATS */}
      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <span>🎯</span>
          <div>
            <strong>Career Goal</strong>
            <small>{career}</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>📊</span>
          <div>
            <strong>Skill Analysis</strong>
            <small>Ready to explore</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>🗺️</span>
          <div>
            <strong>Learning Plan</strong>
            <small>Personalized roadmap</small>
          </div>
        </div>

      </section>

      {/* MOTIVATION */}
      <section className="dashboard-motivation">

        <div className="motivation-icon">
          🤖
        </div>

        <div>
          <span>CAREERPATH AI</span>

          <h2>
            Small progress every day creates a better career.
          </h2>

          <p>
            Follow your roadmap, complete your milestones
            and keep improving your skills.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;