 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Interview from "./pages/Interview";
import MockInterview from "./pages/MockInterview";
import Dashboard from "./pages/Dashboard";

// Components
import Hero from "./Components/Hero";
import ToolsSection from "./Components/ToolsSection";
import FeaturesSection from "./Components/FeaturesSection";
import AboutUs from "./Components/AboutUs";
import Footer from "./Components/Footer";

// Pages
import ResumePage from "./pages/ResumePage";
import JobMatcherPage from "./pages/JobMatcherPage";
import ATSPage from "./pages/ATSPage";
import SkillPathPage from "./pages/SkillPathPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* ---------------- HOME PAGE ---------------- */}
        <Route
          path="/"
          element={
            <div className="bg-[#0B0F19]">
              <Hero />
              <ToolsSection />
              <FeaturesSection />
              <AboutUs />
              <Footer />
            </div>
          }
        />

        {/* ---------------- TOOL PAGES ---------------- */}
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ats" element={<ATSPage />} />
        <Route path="/skill-path" element={<SkillPathPage />} />
        <Route path="/matcher" element={<JobMatcherPage />} />

        {/* INTERVIEW */}
        <Route path="/interview" element={<Interview />} />
        <Route path="/mock-interview" element={<MockInterview />} />

      </Routes>
    </Router>
  );
}

export default App;