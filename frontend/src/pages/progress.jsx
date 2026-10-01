import React from "react";
import "./progress.css";

function Progress({ onNavigate }) {
  return (
    <div className="progress-page">

      <div className="progress-header">
        <div>
          <p className="small-title">CAREERPATH AI</p>
          <h1>My Progress</h1>
          <p>Track your career learning journey and stay on your goals.</p>
        </div>

        <button
          className="back-btn"
          onClick={() => onNavigate("dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {/* Overall Progress */}
      <div className="progress-card main-progress">
        <div className="progress-info">
          <h2>Overall Progress</h2>
          <p>Keep learning and complete your career roadmap.</p>
        </div>

        <div className="circle-progress">
          <span>65%</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <h3>12</h3>
          <p>Courses Completed</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <h3>8</h3>
          <p>Skills Improved</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <h3>24h</h3>
          <p>Learning Time</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <h3>5</h3>
          <p>Achievements</p>
        </div>

      </div>

      {/* Learning Progress */}
      <div className="section-card">
        <h2>Learning Progress</h2>

        <div className="skill-progress">
          <div className="skill-top">
            <span>Programming</span>
            <strong>80%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-fill programming"></div>
          </div>
        </div>

        <div className="skill-progress">
          <div className="skill-top">
            <span>Web Development</span>
            <strong>65%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-fill web"></div>
          </div>
        </div>

        <div className="skill-progress">
          <div className="skill-top">
            <span>Database</span>
            <strong>55%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-fill database"></div>
          </div>
        </div>

        <div className="skill-progress">
          <div className="skill-top">
            <span>Communication</span>
            <strong>70%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-fill communication"></div>
          </div>
        </div>
      </div>

      {/* Current Goal */}
      <div className="goal-card">
        <div>
          <p className="goal-label">CURRENT GOAL</p>
          <h2>Become a Full Stack Developer</h2>
          <p>
            Complete your roadmap and improve your technical skills.
          </p>
        </div>

        <button
          onClick={() => onNavigate("roadmap")}
        >
          View Roadmap →
        </button>
      </div>

    </div>
  );
}

export default Progress;