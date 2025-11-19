 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
        <Route path="/matcher" element={<JobMatcherPage />} />
        <Route path="/ats" element={<ATSPage />} />
        <Route path="/skill-path" element={<SkillPathPage />} />

      </Routes>
    </Router>
  );
}

export default App;
