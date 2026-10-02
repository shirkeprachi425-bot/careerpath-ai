import { useMemo, useState } from "react";
import "./App.css";

const careers = {
  "AI/ML Engineer": {
    icon: "🤖",
    color: "purple",
    skills: ["Python", "NumPy", "Pandas", "Statistics", "Machine Learning", "Deep Learning"],
    roadmap: [
      {
        week: "Week 1",
        skill: "Python",
        work: "Python basics, functions and OOP",
        project: "Build a Python calculator",
      },
      {
        week: "Week 2",
        skill: "NumPy & Pandas",
        work: "Arrays, dataframes and data cleaning",
        project: "Analyze a student dataset",
      },
      {
        week: "Week 3",
        skill: "Statistics",
        work: "Mean, probability, distributions and correlation",
        project: "Create a statistics report",
      },
      {
        week: "Week 4",
        skill: "Machine Learning",
        work: "Regression, classification and model evaluation",
        project: "Build a simple prediction model",
      },
    ],
    resources: [
      ["Python", "📘 Course", "Python fundamentals course"],
      ["NumPy & Pandas", "💻 Practice", "Data analysis exercises"],
      ["Statistics", "🧪 Practice", "Statistics problem set"],
      ["Machine Learning", "🚀 Project", "Build a prediction model"],
    ],
  },

  "Data Scientist": {
    icon: "📊",
    color: "blue",
    skills: [
      "Python",
      "SQL",
      "Statistics",
      "Pandas",
      "Machine Learning",
      "Data Visualization",
    ],
    roadmap: [
      {
        week: "Week 1",
        skill: "Python",
        work: "Python for data analysis",
        project: "Data cleaning project",
      },
      {
        week: "Week 2",
        skill: "Pandas & SQL",
        work: "Data manipulation and queries",
        project: "Analyze a public dataset",
      },
      {
        week: "Week 3",
        skill: "Statistics",
        work: "Probability and statistical testing",
        project: "Statistical analysis report",
      },
      {
        week: "Week 4",
        skill: "Machine Learning",
        work: "Supervised learning basics",
        project: "Build a prediction model",
      },
    ],
    resources: [
      ["Python", "📘 Course", "Python for Data Science"],
      ["SQL", "💻 Practice", "SQL query practice"],
      ["Statistics", "📚 Course", "Statistics fundamentals"],
      ["Machine Learning", "🚀 Project", "Prediction project"],
    ],
  },

  "Data Analyst": {
    icon: "📈",
    color: "green",
    skills: [
      "Excel",
      "SQL",
      "Python",
      "Statistics",
      "Power BI",
      "Data Visualization",
    ],
    roadmap: [
      {
        week: "Week 1",
        skill: "Excel",
        work: "Formulas, pivot tables and charts",
        project: "Create a sales dashboard",
      },
      {
        week: "Week 2",
        skill: "SQL",
        work: "Queries, joins and aggregation",
        project: "Database analysis",
      },
      {
        week: "Week 3",
        skill: "Statistics",
        work: "Descriptive statistics",
        project: "Data insights report",
      },
      {
        week: "Week 4",
        skill: "Power BI",
        work: "Dashboards and visualizations",
        project: "Interactive business dashboard",
      },
    ],
    resources: [
      ["Excel", "📘 Course", "Advanced Excel"],
      ["SQL", "💻 Practice", "SQL challenges"],
      ["Statistics", "📚 Course", "Statistics basics"],
      ["Power BI", "🚀 Project", "Business dashboard"],
    ],
  },

  "Full Stack Developer": {
    icon: "💻",
    color: "orange",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git"],
    roadmap: [
      {
        week: "Week 1",
        skill: "HTML & CSS",
        work: "Responsive web design",
        project: "Build a portfolio website",
      },
      {
        week: "Week 2",
        skill: "JavaScript",
        work: "DOM, functions and APIs",
        project: "Build an interactive web app",
      },
      {
        week: "Week 3",
        skill: "React",
        work: "Components, state and props",
        project: "Build a React dashboard",
      },
      {
        week: "Week 4",
        skill: "Node.js & SQL",
        work: "Backend APIs and database",
        project: "Build a full-stack application",
      },
    ],
    resources: [
      ["HTML/CSS", "📘 Course", "Web development fundamentals"],
      ["JavaScript", "💻 Practice", "JavaScript challenges"],
      ["React", "🚀 Project", "Build a React dashboard"],
      ["Node.js & SQL", "🎓 Course", "Backend development"],
    ],
  },

  DevOps: {
    icon: "☁️",
    color: "cyan",
    skills: ["Linux", "Git", "Docker", "AWS", "CI/CD", "Kubernetes"],
    roadmap: [
      {
        week: "Week 1",
        skill: "Linux & Git",
        work: "Linux commands and Git workflow",
        project: "Create a Git-based project",
      },
      {
        week: "Week 2",
        skill: "Docker",
        work: "Containers and images",
        project: "Containerize an application",
      },
      {
        week: "Week 3",
        skill: "AWS",
        work: "Cloud fundamentals",
        project: "Deploy a web application",
      },
      {
        week: "Week 4",
        skill: "CI/CD",
        work: "Automated build and deployment",
        project: "Create a CI/CD pipeline",
      },
    ],
    resources: [
      ["Linux", "📘 Course", "Linux fundamentals"],
      ["Docker", "💻 Practice", "Container challenges"],
      ["AWS", "☁️ Course", "Cloud fundamentals"],
      ["CI/CD", "🚀 Project", "Deployment pipeline"],
    ],
  },
};

function App() {
  const [page, setPage] = useState("home");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    education: "",
    skills: "",
    skillLevel: "",
    experience: "",
    interests: "",
    studyTime: "",
    career: "",
  });

  const [completed, setCompleted] = useState([]);

  const selectedCareer = careers[profile.career];

  const userSkills = useMemo(
    () =>
      profile.skills
        .toLowerCase()
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    [profile.skills]
  );

  const skillStatus = (skill) => {
    const found = userSkills.some(
      (userSkill) =>
        userSkill.includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill)
    );

    if (found) return "good";

    if (profile.skillLevel === "Advanced") return "improve";

    return "critical";
  };

  const progress = selectedCareer
    ? Math.round(
        (completed.length / selectedCareer.roadmap.length) * 100
      )
    : 0;

  const nav = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const signIn = (e) => {
    e.preventDefault();

    setIsSignedIn(true);
    setPage("profile");
  };

  const submitProfile = (e) => {
    e.preventDefault();

    if (!profile.career) {
      alert("Please select a career.");
      return;
    }

    setPage("analysis");
  };

  const toggleComplete = (index) => {
    setCompleted((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">

        <button className="brand" onClick={() => nav("home")}>
          Career<span>Path</span> AI
        </button>

        <nav>
          <button onClick={() => nav("home")}>Home</button>
          <button onClick={() => nav("profile")}>Profile</button>
          <button onClick={() => nav("analysis")}>Skill Gap</button>
          <button onClick={() => nav("roadmap")}>Roadmap</button>
          <button onClick={() => nav("resources")}>Resources</button>
          <button onClick={() => nav("progress")}>Progress</button>
        </nav>

        <button
          className="nav-cta"
          onClick={() => nav("signin")}
        >
          {isSignedIn ? "My Profile" : "Sign In"}
        </button>

      </header>

      {/* HOME */}
      {page === "home" && (
        <main>

          <section className="hero">

            <div className="hero-badge">
              ✨ Personalized AI Career Navigator
            </div>

            <h1>
              Build Your
              <span> Future Career</span>
            </h1>

            <p>
              CareerPath AI analyzes your skills, interests and goals
              to create a personalized career roadmap for you.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={() => nav("signin")}
              >
                Get Started 🚀
              </button>

            </div>

            <div className="hero-cards">

              <div>
                <span>🎯</span>
                <strong>Career Selection</strong>
                <p>Choose your target career.</p>
              </div>

              <div>
                <span>📊</span>
                <strong>Skill Gap</strong>
                <p>Find skills you need.</p>
              </div>

              <div>
                <span>🗺️</span>
                <strong>Smart Roadmap</strong>
                <p>Learn step by step.</p>
              </div>

              <div>
                <span>🤖</span>
                <strong>AI Adaptation</strong>
                <p>Roadmap adjusts to your pace.</p>
              </div>

            </div>

          </section>

          <section className="about-section">

            <div>
              <span className="section-label">
                HOW IT WORKS
              </span>

              <h2>
                Your Career Journey in 4 Steps
              </h2>
            </div>

            <div className="steps">

              <Step
                number="01"
                icon="🔐"
                title="Sign In"
              />

              <Step
                number="02"
                icon="👤"
                title="Build Profile"
              />

              <Step
                number="03"
                icon="🎯"
                title="Choose Career"
              />

              <Step
                number="04"
                icon="🚀"
                title="Follow Roadmap"
              />

            </div>

          </section>

        </main>
      )}

      {/* SIGN IN */}
      {page === "signin" && (
        <main className="signin-page">

          <div className="signin-card">

            <div className="signin-icon">
              🚀
            </div>

            <h1>
              Welcome to CareerPath AI
            </h1>

            <p>
              Sign in to continue your personalized career journey.
            </p>

            <form onSubmit={signIn}>

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                required
              />

              <button
                type="submit"
                className="signin-btn"
              >
                Sign In 🚀
              </button>

            </form>

            <div className="signin-divider">
              <span>or</span>
            </div>

            <button
              className="guest-btn"
              onClick={() => {
                setIsSignedIn(true);
                setPage("profile");
              }}
            >
              Continue as Guest
            </button>

            <p className="signup-text">
  New to CareerPath AI?

  <button
    type="button"
    className="create-account-link"
    onClick={() => nav("signup")}
  >
    Create Account
  </button>
</p>

          </div>

        </main>
      )}
{/* CREATE ACCOUNT */}
{page === "signup" && (
  <main className="signin-page">

    <div className="signin-card">

      <div className="signin-icon">
        ✨
      </div>

      <h1>Create Your Account</h1>

      <p>
        Create your CareerPath AI account and start your career journey.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSignedIn(true);
          setPage("profile");
        }}
      >

        <label>Full Name</label>

        <input
          type="text"
          placeholder="Enter your full name"
          required
        />

        <label>Email Address</label>

        <input
          type="email"
          placeholder="Enter your email"
          required
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Create a password"
          required
        />

        <label>Confirm Password</label>

        <input
          type="password"
          placeholder="Confirm your password"
          required
        />

        <button
          type="submit"
          className="signin-btn"
        >
          Create Account 🚀
        </button>

      </form>

      <p className="signup-text">
        Already have an account?

        <button
          type="button"
          className="create-account-link"
          onClick={() => nav("signin")}
        >
          Sign In
        </button>
      </p>

    </div>

  </main>
)}
      {/* PROFILE */}
      {page === "profile" && (
        <main className="page">

          <PageHeader
            label="STEP 01"
            title="Build Your Career Profile"
            text="Tell us about yourself so we can personalize your career journey."
          />

          <form
            className="profile-form"
            onSubmit={submitProfile}
          >

            <div className="form-card">

              <h3>
                👤 Personal Information
              </h3>

              <div className="form-grid">

                <Field
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={setProfile}
                  placeholder="Enter your name"
                />

                <div>
                  <label>Education</label>

                  <select
                    value={profile.education}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        education: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select education
                    </option>
                    <option>10th</option>
                    <option>12th</option>
                    <option>Diploma</option>
                    <option>Graduation</option>
                    <option>Post Graduation</option>
                  </select>
                </div>

                <Field
                  label="Current Skills"
                  name="skills"
                  value={profile.skills}
                  onChange={setProfile}
                  placeholder="Python, HTML, SQL..."
                />

                <div>
                  <label>Skill Level</label>

                  <select
                    value={profile.skillLevel}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        skillLevel: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select level
                    </option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                  <label>Experience</label>

                  <select
                    value={profile.experience}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        experience: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select experience
                    </option>
                    <option>Fresher</option>
                    <option>Less than 1 year</option>
                    <option>1–3 years</option>
                    <option>3+ years</option>
                  </select>
                </div>

                <Field
                  label="Interests"
                  name="interests"
                  value={profile.interests}
                  onChange={setProfile}
                  placeholder="AI, coding, business..."
                />

                <div>
                  <label>
                    Daily Learning Time
                  </label>

                  <select
                    value={profile.studyTime}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        studyTime: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      How much time?
                    </option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3+ hours</option>
                  </select>
                </div>

              </div>

            </div>

            {/* CAREER SELECTION */}

            <div className="form-card career-select-card">

              <h3>
                🎯 Choose Your Target Career
              </h3>

              <p>
                Select one career to generate your personalized roadmap.
              </p>

              <div className="career-grid">

                {Object.entries(careers).map(
                  ([name, data]) => (

                    <button
                      type="button"
                      className={`career-option ${
                        profile.career === name
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setProfile({
                          ...profile,
                          career: name,
                        })
                      }
                      key={name}
                    >

                      <span>
                        {data.icon}
                      </span>

                      <strong>
                        {name}
                      </strong>

                      <small>
                        {data.skills.length} core skills
                      </small>

                    </button>

                  )
                )}

              </div>

            </div>

            <button
              className="analyze-btn"
              type="submit"
            >
              Analyze My Career Path 🚀
            </button>

          </form>

        </main>
      )}

      {/* SKILL GAP */}
      {page === "analysis" && selectedCareer && (
        <main className="page">

          <PageHeader
            label="STEP 02"
            title="Your Skill Gap Analysis"
            text={`Here's how your current skills compare with ${profile.career}.`}
          />

          <div className="analysis-top">

            <div
              className={`career-banner ${selectedCareer.color}`}
            >

              <div className="career-icon">
                {selectedCareer.icon}
              </div>

              <div>
                <span>Target Career</span>

                <h2>
                  {profile.career}
                </h2>
              </div>

            </div>

            <div className="match-card">

              <span>
                Skill Match
              </span>

              <strong>
                {
                  Math.round(
                    (
                      selectedCareer.skills.filter(
                        (s) =>
                          skillStatus(s) === "good"
                      ).length /
                      selectedCareer.skills.length
                    ) * 100
                  )
                }%
              </strong>

            </div>

          </div>

          <div className="legend">

            <span>🔴 Critical</span>
            <span>🟠 Need Improvement</span>
            <span>🟢 Good</span>

          </div>

          <div className="skill-grid">

            {selectedCareer.skills.map((skill) => {

              const status = skillStatus(skill);

              return (
                <div
                  className={`skill-card ${status}`}
                  key={skill}
                >

                  <div className="skill-icon">

                    {status === "good"
                      ? "🟢"
                      : status === "improve"
                      ? "🟠"
                      : "🔴"}

                  </div>

                  <div>

                    <h3>
                      {skill}
                    </h3>

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

          <div className="why-card">

            <span>💡</span>

            <div>

              <h3>
                Why this analysis?
              </h3>

              <p>
                CareerPath AI compares your current skills
                with the skills required for your selected
                career and prioritizes the areas that need attention.
              </p>

            </div>

          </div>

          <button
            className="primary-btn"
            onClick={() => nav("roadmap")}
          >
            View My Learning Roadmap →
          </button>

        </main>
      )}

      {/* ROADMAP */}
      {page === "roadmap" && selectedCareer && (
        <main className="page">

          <PageHeader
            label="STEP 03"
            title="Your Personalized Roadmap"
            text="A week-by-week plan based on your target career and skill gaps."
          />

          <div className="roadmap-header">

            <div>

              <span>🎯 Target</span>

              <h2>
                {profile.career}
              </h2>

            </div>

            <div className="time-box">
              ⏰ {profile.studyTime || "1 hour"} / day
            </div>

          </div>

          <div className="timeline">

            {selectedCareer.roadmap.map(
              (item, index) => (

                <div
                  className={`roadmap-card ${
                    completed.includes(index)
                      ? "completed"
                      : ""
                  }`}
                  key={item.week}
                >

                  <div className="week-badge">
                    {item.week}
                  </div>

                  <div className="roadmap-content">

                    <div className="roadmap-title">

                      <h2>
                        {item.skill}
                      </h2>

                      {completed.includes(index) && (
                        <span className="done">
                          ✓ Completed
                        </span>
                      )}

                    </div>

                    <p>
                      <strong>
                        📚 Learn:
                      </strong>{" "}
                      {item.work}
                    </p>

                    <p>
                      <strong>
                        🚀 Practice / Project:
                      </strong>{" "}
                      {item.project}
                    </p>

                    <button
                      className={
                        completed.includes(index)
                          ? "completed-btn"
                          : "complete-btn"
                      }
                      onClick={() =>
                        toggleComplete(index)
                      }
                    >
                      {completed.includes(index)
                        ? "✓ Completed"
                        : "Mark as Complete"}
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

          <div className="adapt-card">

            <div className="adapt-icon">
              🤖
            </div>

            <div>

              <span>
                AI ADAPTATION
              </span>

              <h2>
                Your roadmap can adapt to your pace.
              </h2>

              <p>
                If you complete a skill faster,
                the next learning step can be brought forward.
                If you fall behind, the roadmap can be extended
                or broken into smaller tasks.
              </p>

              <div className="explanation">

                <strong>
                  💡 Why was my roadmap changed?
                </strong>

                <p>
                  Your learning pace and completed activities
                  are used to adjust the next recommended
                  learning step.
                </p>

              </div>

            </div>

          </div>

        </main>
      )}

      {/* RESOURCES */}
      {page === "resources" && selectedCareer && (
        <main className="page">

          <PageHeader
            label="STEP 04"
            title="Learning Resources"
            text="Courses, practice, projects and certifications for your target skills."
          />

          <div className="resource-grid">

            {selectedCareer.resources.map(
              ([skill, type, title]) => (

                <div
                  className="resource-card"
                  key={skill}
                >

                  <span className="resource-type">
                    {type}
                  </span>

                  <h2>
                    {skill}
                  </h2>

                  <p>
                    {title}
                  </p>

                  <button
                    onClick={() =>
                      alert(`Opening ${title}`)
                    }
                  >
                    Explore Resource →
                  </button>

                </div>

              )
            )}

          </div>

        </main>
      )}

      {/* PROGRESS */}
      {page === "progress" && selectedCareer && (
        <main className="page">

          <PageHeader
            label="STEP 05"
            title="Your Learning Progress"
            text="Track what you have completed and what comes next."
          />

          <div className="progress-hero">

            <div className="progress-circle">

              <strong>
                {progress}%
              </strong>

              <span>
                Complete
              </span>

            </div>

            <div>

              <span>
                Current Goal
              </span>

              <h2>
                {profile.career}
              </h2>

              <p>
                {completed.length} of{" "}
                {selectedCareer.roadmap.length}{" "}
                roadmap milestones completed.
              </p>

            </div>

          </div>

          <div className="progress-list">

            {selectedCareer.roadmap.map(
              (item, index) => (

                <div
                  className="progress-item"
                  key={item.skill}
                >

                  <span>
                    {completed.includes(index)
                      ? "🟢"
                      : "⚪"}
                  </span>

                  <div>

                    <strong>
                      {item.week} — {item.skill}
                    </strong>

                    <p>
                      {completed.includes(index)
                        ? "Completed successfully."
                        : "Not completed yet."}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      toggleComplete(index)
                    }
                  >
                    {completed.includes(index)
                      ? "Undo"
                      : "Mark Complete"}
                  </button>

                </div>

              )
            )}

          </div>

          <div className="adapt-card">

            <div className="adapt-icon">
              🔄
            </div>

            <div>

              <span>
                ADAPTIVE LEARNING
              </span>

              <h2>
                Keep learning at your own pace.
              </h2>

              <p>
                Your progress is used to decide
                which roadmap step should be prioritized next.
              </p>

            </div>

          </div>

        </main>
      )}

      {/* FOOTER */}
      <footer>

        <strong>
          CareerPath AI
        </strong>

        <span>
          Personalized Career & Skill Navigator
        </span>

      </footer>

    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label>
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        required
        onChange={(e) =>
          onChange((current) => ({
            ...current,
            [name]: e.target.value,
          }))
        }
      />

    </div>
  );
}

function PageHeader({
  label,
  title,
  text,
}) {
  return (
    <div className="page-header">

      <span>
        {label}
      </span>

      <h1>
        {title}
      </h1>

      <p>
        {text}
      </p>

    </div>
  );
}

function Step({
  number,
  icon,
  title,
}) {
  return (
    <div className="step">

      <small>
        {number}
      </small>

      <span>
        {icon}
      </span>

      <h3>
        {title}
      </h3>

    </div>
  );
}

export default App;