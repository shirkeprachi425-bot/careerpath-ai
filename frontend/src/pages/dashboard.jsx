import { useEffect, useState } from "react";
import "./dashboard.css";

function Dashboard({
  userName = "User",
  userId,
  onSkillGap,
  onRoadmap,
  onResources,
  onProgress,
}) {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!userId) {
        setError("User ID not available.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://careerpath-ai-jhse.onrender.com/api/ai/recommend/${userId}`
        );

        const data = await response.json();

        console.log("AI RECOMMENDATION:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.details ||
              data.error ||
              "Failed to load AI recommendation."
          );
        }

        setRecommendation(data.recommendation);
      } catch (err) {
        console.error("AI RECOMMENDATION ERROR:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [userId]);

  // ------------------------------
  // Loading state
  // ------------------------------

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-label">YOUR DASHBOARD</span>

            <h1>
              Welcome back, <strong>{userName}</strong> 👋
            </h1>

            <p>
              Your AI career recommendation is being prepared...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------
  // Error state
  // ------------------------------

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-label">YOUR DASHBOARD</span>

            <h1>
              Welcome back, <strong>{userName}</strong> 👋
            </h1>

            <p>
              We couldn't load your AI recommendation right now.
            </p>

            <p style={{ color: "#d9534f", marginTop: "10px" }}>
              {error}
            </p>
          </div>

          <div className="dashboard-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  const career = recommendation?.recommendedCareer || "Career not available";
  const confidence = recommendation?.confidence || 0;
  const reason = recommendation?.reason || "";

  const strengths = recommendation?.strengths || [];
  const skillGaps = recommendation?.skillGaps || [];
  const roadmap = recommendation?.roadmap || [];
  const resources = recommendation?.recommendedResources || [];

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
            Continue your career journey with your personalized
            AI-powered career plan.
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
          <span>AI RECOMMENDED CAREER</span>

          <h2>{career}</h2>

          <p>
            {reason}
          </p>
        </div>

        <div className="dashboard-progress">
          <div
            className="dashboard-progress-circle"
            style={{
              background: `conic-gradient(#5965e8 ${
                confidence * 3.6
              }deg, #e9ebf5 0deg)`,
            }}
          >
            <div>
              <strong>{confidence}%</strong>
            </div>
          </div>

          <span>AI Confidence</span>
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
                Explore courses and learning material.
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

      {/* AI STRENGTHS */}
      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <span>💪</span>

          <div>
            <strong>Current Strengths</strong>

            <small>
              {strengths.length > 0
                ? strengths.slice(0, 2).join(" • ")
                : "No strengths available"}
            </small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>📊</span>

          <div>
            <strong>Skill Gaps</strong>

            <small>
              {skillGaps.length > 0
                ? `${skillGaps.length} areas to improve`
                : "No skill gaps available"}
            </small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span>🗺️</span>

          <div>
            <strong>Learning Plan</strong>

            <small>
              {roadmap.length} personalized steps
            </small>
          </div>
        </div>

      </section>

      {/* AI ROADMAP PREVIEW */}
      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <span>AI LEARNING PLAN</span>
            <h2>Your Personalized Roadmap</h2>
          </div>
        </div>

        <div className="dashboard-actions">

          {roadmap.map((item) => (
            <div
              className="dashboard-action"
              key={item.step}
            >
              <div className="action-icon blue">
                {item.step}
              </div>

              <div>
                <h3>{item.title}</h3>

                <p>
                  {item.description}
                </p>
              </div>
            </div>
          ))}

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
            Your roadmap is personalized using your profile,
            interests and assessment performance.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;