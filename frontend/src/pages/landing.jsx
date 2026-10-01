import "./Landing.css";

function Landing({ onGetStarted, onTakeTest }) {
  return (
    <div className="landing">

      {/* HERO */}
      <section className="landing-hero">

        <div className="hero-content">
          <div className="hero-badge">
            ✨ AI-Powered Career Navigator
          </div>

          <h1>
            Build Your
            <span> Future Career</span>
          </h1>

          <p>
            Discover the right career, identify your skill gaps,
            get a personalized learning roadmap and track your
            progress — all in one place.
          </p>

          <div className="hero-buttons">
            <button
              className="landing-primary"
              onClick={onGetStarted}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="landing-secondary"
              onClick={onTakeTest}
            >
              🎯 Take Career Test
            </button>
          </div>

          <div className="hero-trust">
            <span>✓ Personalized</span>
            <span>✓ AI Powered</span>
            <span>✓ Easy to Follow</span>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-header">
              <div>
                <small>Your Career Journey</small>
                <h3>Software Developer</h3>
              </div>

              <div className="preview-icon">🚀</div>
            </div>

            <div className="progress-preview">
              <div className="progress-info">
                <span>Learning Progress</span>
                <strong>68%</strong>
              </div>

              <div className="progress-bar">
                <div></div>
              </div>
            </div>

            <div className="preview-cards">

              <div className="preview-card">
                <span>🎯</span>
                <div>
                  <strong>Skill Gap</strong>
                  <small>3 skills to improve</small>
                </div>
              </div>

              <div className="preview-card">
                <span>🗺️</span>
                <div>
                  <strong>Roadmap</strong>
                  <small>12 weeks plan</small>
                </div>
              </div>

            </div>

            <div className="preview-task">
              <span>✓</span>
              <div>
                <strong>Today's Goal</strong>
                <small>Complete JavaScript basics</small>
              </div>
            </div>

          </div>

          <div className="floating-card floating-one">
            🎯 <strong>Career Match</strong>
            <span>92%</span>
          </div>

          <div className="floating-card floating-two">
            🤖 <strong>AI Roadmap</strong>
            <span>Updated</span>
          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="landing-features">

        <div className="section-heading">
          <span>WHY CAREERPATH AI?</span>

          <h2>
            Everything You Need to
            <strong> Build Your Career</strong>
          </h2>

          <p>
            From choosing a career to tracking your learning,
            CareerPath AI guides you at every step.
          </p>
        </div>

        <div className="feature-grid">

          <Feature
            icon="🎯"
            title="Career Selection"
            text="Explore careers and choose the path that matches your interests and goals."
          />

          <Feature
            icon="📊"
            title="Skill Gap Analysis"
            text="Understand which skills you already have and which skills you need to improve."
          />

          <Feature
            icon="🗺️"
            title="Personalized Roadmap"
            text="Follow a simple step-by-step roadmap designed for your target career."
          />

          <Feature
            icon="📈"
            title="Progress Tracking"
            text="Track completed milestones and see how far you have progressed."
          />

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">

        <div className="section-heading">
          <span>HOW IT WORKS</span>

          <h2>
            Your Career Journey in
            <strong> 4 Simple Steps</strong>
          </h2>
        </div>

        <div className="journey">

          <Journey
            number="01"
            icon="👤"
            title="Create Profile"
            text="Tell us about your education, skills and interests."
          />

          <Journey
            number="02"
            icon="🎯"
            title="Choose Career"
            text="Select the career you want to build your future in."
          />

          <Journey
            number="03"
            icon="📊"
            title="Find Skill Gaps"
            text="Discover the important skills you need for your career."
          />

          <Journey
            number="04"
            icon="🚀"
            title="Follow Roadmap"
            text="Learn step-by-step and track your progress."
          />

        </div>

      </section>

      {/* CTA */}
      <section className="landing-cta">

        <div>
          <span>READY TO START?</span>

          <h2>
            Your Future Starts
            <strong> Today.</strong>
          </h2>

          <p>
            Take the first step towards a smarter career journey.
          </p>

          <button
            onClick={onGetStarted}
            className="cta-button"
          >
            Start My Career Journey →
          </button>
        </div>

      </section>

    </div>
  );
}

/* FEATURE */

function Feature({ icon, title, text }) {
  return (
    <div className="landing-feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <span className="feature-arrow">→</span>

    </div>
  );
}

/* JOURNEY */

function Journey({ number, icon, title, text }) {
  return (
    <div className="journey-card">

      <small>{number}</small>

      <div className="journey-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}

export default Landing;