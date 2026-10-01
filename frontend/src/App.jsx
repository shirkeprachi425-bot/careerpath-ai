import { useState } from "react";

import Auth from "./pages/Auth";
import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import Resources from "./pages/resources";
import Progress from "./pages/progress";
import Profile from "./pages/profile";
import Roadmap from "./pages/roadmap";
import SkillGap from "./pages/skillgap";
import Assessment from "./pages/Assessment";
import StudentInfo from "./pages/StudentInfo";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");

  // LOGIN
  const handleLogin = (user) => {
    console.log("User logged in:", user);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  // LOGOUT
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("landing");
  };

  // NAVIGATION
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // LANDING PAGE
 if (!isLoggedIn) {
  if (currentPage === "auth") {
    return <Auth onLogin={handleLogin} />;
  }

  if (currentPage === "student-info") {
    return (
      <StudentInfo
        onContinue={() => setCurrentPage("assessment")}
      />
    );
  }

  if (currentPage === "assessment") {
  return (
    <Assessment
      onComplete={() => {
        setCurrentPage("dashboard");
      }}
    />
  );
}

  return (
    <Landing
      onGetStarted={() => setCurrentPage("student-info")}
      onTakeTest={() => setCurrentPage("student-info")}
    />
  );
}

  // LOGGED-IN PAGES
  return (
    <div className="app-container">

      {/* NAVBAR */}
      <nav className="app-navbar">

        <div className="logo">
          CareerPath AI
        </div>

        <div className="nav-links">

          <button onClick={() => handleNavigate("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => handleNavigate("resources")}>
            Resources
          </button>

          <button onClick={() => handleNavigate("progress")}>
            Progress
          </button>

          <button onClick={() => handleNavigate("skillgap")}>
            Skill Gap
          </button>

          <button onClick={() => handleNavigate("roadmap")}>
            Roadmap
          </button>

          <button onClick={() => handleNavigate("assessment")}>
            Assessment
          </button>

          <button onClick={() => handleNavigate("profile")}>
            Profile
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="page-content">

        {currentPage === "dashboard" && (
          <Dashboard onNavigate={handleNavigate} />
        )}

        {currentPage === "resources" && (
          <Resources onNavigate={handleNavigate} />
        )}

        {currentPage === "progress" && (
          <Progress onNavigate={handleNavigate} />
        )}

        {currentPage === "profile" && (
          <Profile onNavigate={handleNavigate} />
        )}

        {currentPage === "roadmap" && (
          <Roadmap onNavigate={handleNavigate} />
        )}

        {currentPage === "skillgap" && (
          <SkillGap onNavigate={handleNavigate} />
        )}

        {currentPage === "assessment" && (
          <Assessment onNavigate={handleNavigate} />
        )}

      </main>

    </div>
  );
}

export default App;