 import { motion } from "framer-motion";
import { FileSearch, Settings, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";

export default function ToolsSection() {
  const navigate = useNavigate();
  const { user } = useUser();

  const userId = user?.id;

  const tools = [
    {
      title: "ATS Score Checker",
      desc: "See how Applicant Tracking Systems score your resume and get keyword optimization suggestions.",
      icon: <Settings size={32} className="text-yellow-400" />,
      link: "/ats",
      btn: "Check ATS Score →",
      color: "bg-yellow-600 hover:bg-yellow-700",
    },
    {
      title: "Interview Preparation",
      desc: "View personalized interview questions based on your resume with guided learning.",
      icon: <FileSearch size={32} className="text-blue-400" />,
      link: "/interview",
      btn: "View Questions →",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Skill Gap & Learning Path",
      desc: "Discover missing skills and follow a structured roadmap to improve your career readiness.",
      icon: <BadgeCheck size={32} className="text-green-400" />,
      link: "/skill-path",
      btn: "View Skill Path →",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "AI Mock Interview",
      desc: "Practice real interview scenarios with timer, answer tracking, and AI feedback.",
      icon: <FileSearch size={32} className="text-pink-400" />,
      link: "/mock-interview",
      btn: "Start Interview →",
      color: "bg-pink-600 hover:bg-pink-700",
    },
  ];

  // 🔐 Smart Navigation
  const handleNavigation = (path) => {
    if (!userId) return;

    const data = localStorage.getItem(`aiData_${userId}`);

    if (!data) {
      navigate("/resume");
    } else {
      navigate(path);
    }
  };

  return (
    <section
      id="tools"
      className="bg-[#0B0F19] text-white px-6 md:px-16 lg:px-24 xl:px-32 py-24"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-semibold text-center mb-12"
      >
        Explore Career Tools 🚀
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 rounded-xl bg-[#0F172A] border border-slate-800
                       hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              {tool.icon}
              <h3 className="text-lg font-semibold">{tool.title}</h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {tool.desc}
            </p>

            {/* 🔐 NOT LOGGED IN */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-white">
                  Login to Use →
                </button>
              </SignInButton>
            </SignedOut>

            {/* 🔓 LOGGED IN */}
            <SignedIn>
              <button
                onClick={() => handleNavigation(tool.link)}
                className={`${tool.color} px-5 py-2 rounded-lg transition text-white`}
              >
                {tool.btn}
              </button>
            </SignedIn>
          </motion.div>
        ))}
      </div>
    </section>
  );
}