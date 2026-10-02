import { NavLink, Outlet } from "react-router-dom";
import "./AppLayout.css";

function AppLayout({ user, onLogout }) {
  return (
    <>
      <nav className="app-navbar">
        <div className="app-navbar-logo">
          CareerPath <span>AI</span>
        </div>

        <div className="app-navbar-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/skill-gap">Skill Gap</NavLink>
          <NavLink to="/roadmap">Roadmap</NavLink>
          <NavLink to="/resources">Resources</NavLink>
          <NavLink to="/progress">Progress</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </div>

        <div className="app-navbar-right">
          <span className="app-navbar-user">
            {user?.name || "User"}
          </span>

          <button
            type="button"
            className="app-navbar-logout"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default AppLayout;