function Navbar({ onNavigate, isSignedIn }) {
  return (
    <header className="navbar">
      <button className="brand" onClick={() => onNavigate("home")}>
        Career<span>Path</span> AI
      </button>

      <nav>
        <button onClick={() => onNavigate("home")}>Home</button>
        <button onClick={() => onNavigate("assessment")}>
          Career Test
        </button>
        <button onClick={() => onNavigate("profile")}>
          Profile
        </button>
        <button onClick={() => onNavigate("analysis")}>
          Skill Gap
        </button>
        <button onClick={() => onNavigate("roadmap")}>
          Roadmap
        </button>
        <button onClick={() => onNavigate("resources")}>
          Resources
        </button>
        <button onClick={() => onNavigate("progress")}>
          Progress
        </button>
      </nav>

      <button
        className="nav-cta"
        onClick={() => onNavigate(isSignedIn ? "profile" : "signin")}
      >
        {isSignedIn ? "My Profile" : "Sign In"}
      </button>
    </header>
  );
}

export default Navbar;