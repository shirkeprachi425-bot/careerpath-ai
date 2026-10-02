import "./roadmap.css";

function Roadmap({
  profile,
  selectedCareer,
  completed = [],
  onToggleComplete,
}) {
  if (!selectedCareer) {
    return (
      <main className="roadmap-page">
        <div className="roadmap-empty">
          <h2>🗺️ No Roadmap Available</h2>
          <p>Please select a career from your profile first.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="roadmap-page">

      <div className="roadmap-title">
        <span>STEP 03</span>
        <h1>Your Personalized Roadmap</h1>
        <p>
          A step-by-step learning plan for your target career.
        </p>
      </div>

      <div className="roadmap-header">

        <div>
          <small>🎯 TARGET CAREER</small>
          <h2>
            {selectedCareer.icon} {profile.career}
          </h2>
        </div>

        <div className="study-time">
          ⏰ {profile.studyTime || "1 hour"} / day
        </div>

      </div>

      <div className="timeline">

        {selectedCareer.roadmap.map((item, index) => {
          const isCompleted = completed.includes(index);

          return (
            <div
              className={`roadmap-card ${
                isCompleted ? "completed" : ""
              }`}
              key={`${item.week}-${item.skill}`}
            >

              <div className="week-badge">
                {item.week}
              </div>

              <div className="roadmap-content">

                <div className="roadmap-card-title">
                  <h2>{item.skill}</h2>

                  {isCompleted && (
                    <span className="completed-label">
                      ✓ Completed
                    </span>
                  )}
                </div>

                <p>
                  <strong>📚 Learn:</strong>{" "}
                  {item.work}
                </p>

                <p>
                  <strong>🚀 Practice:</strong>{" "}
                  {item.project}
                </p>

                <button
                  className={
                    isCompleted
                      ? "undo-button"
                      : "complete-button"
                  }
                  onClick={() =>
                    onToggleComplete(index)
                  }
                >
                  {isCompleted
                    ? "✓ Completed"
                    : "Mark as Complete"}
                </button>

              </div>

            </div>
          );
        })}

      </div>

      <div className="adaptive-card">

        <div className="adaptive-icon">
          🤖
        </div>

        <div>
          <span>AI ADAPTATION</span>

          <h2>
            Your roadmap adapts to your learning pace.
          </h2>

          <p>
            Complete your milestones and keep progressing
            through your personalized career journey.
          </p>
        </div>

      </div>

    </main>
  );
}

export default Roadmap;