// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Landing from "./pages/landing";
// import Auth from "./pages/Auth";
// import StudentInfo from "./pages/StudentInfo";
// import Assessment from "./pages/Assessment";
// import Dashboard from "./pages/dashboard";
// import Resources from "./pages/resources";
// import Progress from "./pages/progress";
// import Profile from "./pages/profile";
// import Roadmap from "./pages/roadmap";
// import SkillGap from "./pages/skillgap";
// import OnboardingLayout from "./components/OnboardingLayout";

// import "./App.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* PUBLIC ROUTES */}

//         <Route path="/" element={<Landing />} />

//         <Route path="/auth" element={<Auth />} />

//         {/* ONBOARDING */}

//         <Route element={<OnboardingLayout />}>
//           <Route path="/student-info" element={<StudentInfo />} />

//           <Route path="/assessment" element={<Assessment />} />
//         </Route>

//         {/* APPLICATION */}

//         <Route path="/dashboard" element={<Dashboard />} />

//         <Route path="/resources" element={<Resources />} />

//         <Route path="/progress" element={<Progress />} />

//         <Route path="/profile" element={<Profile />} />

//         <Route path="/roadmap" element={<Roadmap />} />

//         <Route path="/skill-gap" element={<SkillGap />} />

//         {/* UNKNOWN URL */}

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Landing from "./pages/landing";
import Auth from "./pages/Auth";
import StudentInfo from "./pages/StudentInfo";
import Assessment from "./pages/Assessment";

import Dashboard from "./pages/dashboard";
import Resources from "./pages/resources";
import Progress from "./pages/progress";
import Profile from "./pages/profile";
import Roadmap from "./pages/roadmap";
import SkillGap from "./pages/skillgap";

import OnboardingLayout from "./components/OnboardingLayout";

import "./App.css";

function AppRoutes() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  // ==============================
  // LOGIN
  // ==============================

const handleLogin = (loggedInUser) => {
  console.log("LOGIN USER RECEIVED:", loggedInUser);

  setUser(loggedInUser);

  localStorage.setItem("user", JSON.stringify(loggedInUser));
  localStorage.setItem("isLoggedIn", "true");

  navigate("/student-info");
};

  // ==============================
  // NAVIGATE AFTER LOGIN
  // ==============================

  // useEffect(() => {
  //   if (user) {
  //     console.log("USER STATE UPDATED:", user);

  //     navigate("/student-info");
  //   }
  // }, [user, navigate]);

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    setUser(null);

    navigate("/auth", { replace: true });
  };
  return (
    <Routes>
      {/* =========================
          PUBLIC
      ========================= */}

      <Route
        path="/"
        element={
          <Landing
            onGetStarted={() => navigate("/auth")}
            onTakeTest={() => navigate("/auth")}
          />
        }
      />

      <Route path="/auth" element={<Auth onLogin={handleLogin} />} />

      {/* =========================
    ONBOARDING
========================= */}

      <Route
        element={
          user ? (
            <OnboardingLayout onLogout={handleLogout} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      >
        <Route
          path="student-info"
          element={
            <StudentInfo
              user={user}
              onContinue={() => navigate("/assessment")}
            />
          }
        />

        <Route
          path="assessment"
          element={<Assessment onComplete={() => navigate("/dashboard")} />}
        />
      </Route>

      {/* =========================
          APPLICATION
      ========================= */}

      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard
              userName={user.name}
              onSkillGap={() => navigate("/skill-gap")}
              onRoadmap={() => navigate("/roadmap")}
              onResources={() => navigate("/resources")}
              onProgress={() => navigate("/progress")}
            />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      <Route
        path="/resources"
        element={user ? <Resources /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/progress"
        element={user ? <Progress /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/roadmap"
        element={user ? <Roadmap /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/skill-gap"
        element={user ? <SkillGap /> : <Navigate to="/auth" replace />}
      />

      {/* =========================
          UNKNOWN URL
      ========================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
