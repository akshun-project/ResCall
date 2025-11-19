 import { motion } from "framer-motion";
import { FileText, FileSearch, Settings, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export default function ToolsSection() {
  const tools = [
    {
      title: "Resume Analyzer",
      desc: "Upload your resume and get instant AI insights, ATS improvements, and professional formatting fixes.",
      icon: <FileText size={32} className="text-indigo-400" />,
      link: "/resume",
      btn: "Analyze Resume →",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "ATS Score Checker",
      desc: "See how Applicant Tracking Systems score your resume and get keyword optimization suggestions.",
      icon: <Settings size={32} className="text-yellow-400" />,
      link: "/ats",
      btn: "Check ATS Score →",
      color: "bg-yellow-600 hover:bg-yellow-700",
    },
    {
      title: "Job Description Matcher",
      desc: "Paste a job description and instantly get match score, missing keywords, and tailored improvements.",
      icon: <FileSearch size={32} className="text-red-400" />,
      link: "/matcher",
      btn: "Match Resume →",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      title: "Skill Gap & Learning Path AI",
      desc: "Discover missing skills and receive a personalized AI-powered roadmap to accelerate your career.",
      icon: <BadgeCheck size={32} className="text-green-400" />,
      link: "/skill-path",
      btn: "Generate Path →",
      color: "bg-green-600 hover:bg-green-700",
    },
  ];

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
        Explore AI-Powered Career Tools
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg
                       hover:shadow-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              {tool.icon}
              <h3 className="text-xl font-semibold">{tool.title}</h3>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {tool.desc}
            </p>

            {/* 🔐 Show LOGIN Button if not logged in */}
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-white font-medium"
                >
                  Login to Use →
                </button>
              </SignInButton>
            </SignedOut>

            {/* 🔓 Show real tool link only when logged in */}
            <SignedIn>
              <Link to={tool.link}>
                <button
                  className={`${tool.color} px-6 py-2 rounded-lg transition-all active:scale-95 text-white font-medium`}
                >
                  {tool.btn}
                </button>
              </Link>
            </SignedIn>

          </motion.div>
        ))}
      </div>
    </section>
  );
}
