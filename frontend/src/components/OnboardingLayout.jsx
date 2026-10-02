import { Outlet, useNavigate } from "react-router-dom";
import "./OnboardingLayout.css";

function OnboardingLayout({ onLogout }) {
  console.log("ONBOARDING LAYOUT RENDERED");
  const navigate = useNavigate();

  return (
    <div className="onboarding-layout">
      {/* HEADER */}
      <header className="onboarding-header">
        <div className="onboarding-logo" onClick={() => navigate("/")}>
          Career<span>Path</span> AI
        </div>

        <button className="onboarding-logout" onClick={onLogout}>
          Logout
        </button>
      </header>

      {/* PROGRESS */}
      <div className="onboarding-progress">
        <div className="onboarding-step active">
          <span>1</span>
          <p>Your Profile</p>
        </div>

        <div className="progress-line"></div>

        <div className="onboarding-step">
          <span>2</span>
          <p>Assessment</p>
        </div>
      </div>

      {/* CURRENT ONBOARDING PAGE */}
      <main className="onboarding-content">
        <Outlet />
      </main>
    </div>
  );
}

export default OnboardingLayout;
