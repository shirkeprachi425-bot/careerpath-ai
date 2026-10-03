
// import { useState, useEffect } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useNavigate,
// } from "react-router-dom";

// import Landing from "./pages/landing";
// import Auth from "./pages/Auth";
// import StudentInfo from "./pages/studentinfo";
// import Assessment from "./pages/Assessment";
// import AppLayout from "./components/AppLayout";
// import Dashboard from "./pages/dashboard";
// import Resources from "./pages/resources";
// import Progress from "./pages/progress";
// import Profile from "./pages/profile";
// import Roadmap from "./pages/roadmap";
// import SkillGap from "./pages/skillgap";

// import OnboardingLayout from "./components/OnboardingLayout";

// import "./App.css";

// function AppRoutes() {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");

//     return savedUser ? JSON.parse(savedUser) : null;
//   });
//   const navigate = useNavigate();

//   // ==============================
//   // CHECK USER STATUS
//   // ==============================

//   const checkUserStatus = async (userId) => {
//     try {
//       const response = await fetch(
//         `https://127.0.0.1:5000/api/user/${userId}/status`,
//       );

//       const data = await response.json();

//       console.log("USER STATUS:", data);

//       if (!response.ok || !data.success) {
//         throw new Error(data.error || "Failed to check user status.");
//       }

//       return data;
//     } catch (error) {
//       console.error("USER STATUS ERROR:", error);
//       return null;
//     }
//   };

//   // ==============================
//   // LOGIN
//   // ==============================

//   const handleLogin = async (loggedInUser) => {
//     console.log("LOGIN USER RECEIVED:", loggedInUser);

//     setUser(loggedInUser);

//     localStorage.setItem("user", JSON.stringify(loggedInUser));
//     localStorage.setItem("isLoggedIn", "true");

//     // Check where this user currently is in the onboarding process
//     const status = await checkUserStatus(loggedInUser.id);

//     if (!status) {
//       // If status check fails, don't guess.
//       // Send the user to student info.
//       navigate("/student-info");
//       return;
//     }

//     console.log("USER STATUS AFTER LOGIN:", status);

//     if (!status.profileCompleted) {
//       // New user → complete student profile first
//       navigate("/student-info");
//       return;
//     }

//     if (!status.assessmentCompleted) {
//       // Profile completed but assessment not done
//       navigate("/assessment");
//       return;
//     }

//     // Existing user → go directly to dashboard
//     navigate("/dashboard");
//   };

//   // ==============================
//   // NAVIGATE AFTER LOGIN
//   // ==============================

//   // useEffect(() => {
//   //   if (user) {
//   //     console.log("USER STATE UPDATED:", user);

//   //     navigate("/student-info");
//   //   }
//   // }, [user, navigate]);

//   // ==============================
//   // LOGOUT
//   // ==============================

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("isLoggedIn");

//     setUser(null);

//     navigate("/auth", { replace: true });
//   };
//   return (
//     <Routes>
//       {/* =========================
//           PUBLIC
//       ========================= */}

//       <Route
//         path="/"
//         element={
//           <Landing
//             onGetStarted={() => navigate("/auth")}
//             onTakeTest={() => navigate("/auth")}
//           />
//         }
//       />

//       <Route path="/auth" element={<Auth onLogin={handleLogin} />} />

//       {/* =========================
//     ONBOARDING
// ========================= */}

//       <Route
//         element={
//           user ? (
//             <OnboardingLayout onLogout={handleLogout} />
//           ) : (
//             <Navigate to="/auth" replace />
//           )
//         }
//       >
//         <Route
//           path="student-info"
//           element={
//             <StudentInfo
//               user={user}
//               onContinue={() => navigate("/assessment")}
//             />
//           }
//         />

//         <Route
//           path="assessment"
//           element={
//             <Assessment
//               userId={user?.id}
//               onComplete={() => navigate("/dashboard")}
//             />
//           }
//         />
//       </Route>

//       {/* =========================
//     APPLICATION
// ========================= */}

//       <Route
//         element={
//           user ? (
//             <AppLayout user={user} onLogout={handleLogout} />
//           ) : (
//             <Navigate to="/auth" replace />
//           )
//         }
//       >
//         <Route
//           path="/dashboard"
//           element={
//             <Dashboard
//               userName={user?.name}
//               userId={user.id}
//               onSkillGap={() => navigate("/skill-gap")}
//               onRoadmap={() => navigate("/roadmap")}
//               onResources={() => navigate("/resources")}
//               onProgress={() => navigate("/progress")}
//             />
//           }
//         />

//         <Route path="/resources" element={<Resources />} />

//         <Route path="/progress" element={<Progress />} />

//         <Route path="/profile" element={<Profile />} />

//         <Route path="/roadmap" element={<Roadmap />} />

//         <Route path="/skill-gap" element={<SkillGap />} />
//       </Route>
//       {/* =========================
//           UNKNOWN URL
//       ========================= */}

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
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
import StudentInfo from "./pages/studentinfo";
import Assessment from "./pages/Assessment";
import AppLayout from "./components/AppLayout";
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

  const [recommendation, setRecommendation] = useState(null);
  const navigate = useNavigate();

  // ==============================
  // CHECK USER STATUS
  // ==============================

  const checkUserStatus = async (userId) => {
    try {
      const response = await fetch(
        `https://careerpath-ai-jhse.onrender.com/api/user/${userId}/status`
      );

      const data = await response.json();

      console.log("USER STATUS:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to check user status.");
      }

      return data;
    } catch (error) {
      console.error("USER STATUS ERROR:", error);
      return null;
    }
  };

  // ==============================
  // FETCH AI RECOMMENDATION
  // ==============================

  const fetchRecommendation = async (userId) => {
    if (!userId) return;

    try {
      const response = await fetch(
        `https://careerpath-ai-jhse.onrender.com/api/ai/recommend/${userId}`
      );

      const data = await response.json();

      console.log("AI RECOMMENDATION FROM APP:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.details ||
            data.error ||
            "Failed to load AI recommendation."
        );
      }

      setRecommendation(data.recommendation);
    } catch (error) {
      console.error("AI RECOMMENDATION ERROR:", error);
    }
  };

  // ==============================
  // LOAD AI DATA FOR LOGGED-IN USER
  // ==============================

  useEffect(() => {
    if (user?.id) {
      fetchRecommendation(user.id);
    }
  }, [user?.id]);

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = async (loggedInUser) => {
    console.log("LOGIN USER RECEIVED:", loggedInUser);

    setUser(loggedInUser);

    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("isLoggedIn", "true");

    const status = await checkUserStatus(loggedInUser.id);

    if (!status) {
      navigate("/student-info");
      return;
    }

    console.log("USER STATUS AFTER LOGIN:", status);

    if (!status.profileCompleted) {
      navigate("/student-info");
      return;
    }

    if (!status.assessmentCompleted) {
      navigate("/assessment");
      return;
    }

    navigate("/dashboard");
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    setUser(null);
    setRecommendation(null);

    navigate("/auth", { replace: true });
  };

  // ==============================
  // SELECTED CAREER
  // ==============================

  const selectedCareer = recommendation
    ? {
        name: recommendation.recommendedCareer,
        icon: "🚀",
        skills: recommendation.skillGaps || [],
        roadmap: (recommendation.roadmap || []).map((item, index) => ({
          week: `Step ${index + 1}`,
          skill: item.title,
          work: item.description,
          project: item.description,
        })),
      }
    : null;

  // ==============================
  // PROFILE DATA FOR OLD COMPONENTS
  // ==============================

  const profile = {
    career: recommendation?.recommendedCareer || "",
    studyTime: "1 hour",
  };

  // ==============================
  // SKILL STATUS
  // ==============================

  const skillStatus = (skill) => {
    if (!recommendation) return "critical";

    const gaps = recommendation.skillGaps || [];
    const strengths = recommendation.strengths || [];

    if (
      strengths.some(
        (item) =>
          item.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(item.toLowerCase())
      )
    ) {
      return "good";
    }

    if (
      gaps.some(
        (item) =>
          item.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(item.toLowerCase())
      )
    ) {
      return "improve";
    }

    return "critical";
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

      <Route
        path="/auth"
        element={<Auth onLogin={handleLogin} />}
      />

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
          element={
            <Assessment
              userId={user?.id}
              onComplete={() => navigate("/dashboard")}
            />
          }
        />
      </Route>

      {/* =========================
          APPLICATION
      ========================= */}

      <Route
        element={
          user ? (
            <AppLayout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      >

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <Dashboard
              userName={user?.name}
              userId={user?.id}
              onSkillGap={() => navigate("/skill-gap")}
              onRoadmap={() => navigate("/roadmap")}
              onResources={() => navigate("/resources")}
              onProgress={() => navigate("/progress")}
            />
          }
        />

        {/* RESOURCES */}

        <Route
          path="/resources"
          element={
            <Resources
              recommendation={recommendation}
            />
          }
        />

        {/* PROGRESS */}

        <Route
          path="/progress"
          element={
            <Progress
              recommendation={recommendation}
            />
          }
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            <Profile
              user={user}
            />
          }
        />

        {/* ROADMAP */}

        <Route
          path="/roadmap"
          element={
            <Roadmap
              profile={profile}
              selectedCareer={selectedCareer}
              completed={[]}
              onToggleComplete={() => {}}
            />
          }
        />

        {/* SKILL GAP */}

        <Route
          path="/skill-gap"
          element={
            <SkillGap
              profile={profile}
              selectedCareer={selectedCareer}
              analysisData={{
                readiness_score: recommendation?.confidence || 0,
              }}
              skillStatus={skillStatus}
              onRoadmap={() => navigate("/roadmap")}
            />
          }
        />

      </Route>

      {/* =========================
          UNKNOWN URL
      ========================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

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