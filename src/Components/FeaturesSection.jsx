import { motion } from "framer-motion";
import { FileText, BrainCircuit, Gauge, Sparkles } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <FileText className="text-indigo-400" size={36} />,
      title: "Resume Analysis & ATS Score",
      desc: "Upload your resume and instantly get ATS score, missing keywords, and improvement suggestions.",
    },
    {
      icon: <BrainCircuit className="text-green-400" size={36} />,
      title: "Interview Preparation System",
      desc: "Get personalized interview questions based on your resume with hints and answers for guided learning.",
    },
    {
      icon: <Gauge className="text-yellow-400" size={36} />,
      title: "Skill Gap & Career Roadmap",
      desc: "Identify missing skills and follow a structured learning path to improve your placement readiness.",
    },
    {
      icon: <Sparkles className="text-pink-400" size={36} />,
      title: "AI Mock Interview Practice",
      desc: "Simulate real interviews with timer, answer tracking, and AI feedback to improve performance.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-[#0B0F19] text-white px-6 md:px-16 lg:px-24 xl:px-32 py-24"
    >
      {/* Heading */}
      <div className="text-center">
        <p className="text-purple-400 px-6 py-1.5 rounded-full bg-purple-950 border border-purple-800 w-max mx-auto">
          Features
        </p>

        <h2 className="text-3xl font-semibold mt-4 text-white">
          Why{" "}
          <span className="bg-gradient-to-r font-semibold from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Res
          </span>
          <span className="text-slate-300 font-medium">Call</span> Stands Out
        </h2>

        <p className="mt-2 text-slate-300 max-w-xl mx-auto">
          AI-driven tools built to give you a professional advantage.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-12 max-w-4xl mx-auto">
        {features.map((f, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`hover:-translate-y-0.5 transition duration-300 rounded-xl border border-slate-800 bg-slate-950 p-6`}
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-lg font-medium text-white">{f.title}</h3>
            <p className="text-slate-300 mt-2 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
