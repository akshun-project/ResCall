import { motion } from "framer-motion";
import { Rocket, Lightbulb, BrainCircuit, Users } from "lucide-react";

export default function AboutUs() {
  const cards = [
    {
      icon: <Rocket size={28} className="text-pink-400" />,
      title: "Why ResCall Exists",
      text: "Most students don’t know what to improve in their resume or how to prepare for interviews. ResCall solves this with a clear, step-by-step system.",
    },
    {
      icon: <Lightbulb size={28} className="text-yellow-400" />,
      title: "What Makes It Different",
      text: "Instead of random tools, ResCall connects everything — resume analysis, skill gaps, and interview preparation into one guided flow.",
    },
    {
      icon: <BrainCircuit size={28} className="text-purple-400" />,
      title: "How It Helps You",
      text: "Upload your resume, get insights, improve weak areas, and practice interviews — all in one place without confusion.",
    },
  ];

  const team = [
    {
      name: "Akshun Jindal",
      role: "Frontend Developer",
      desc: "Builds clean, fast, and responsive user interfaces focused on real user experience.",
    },
    {
      name: "Akshat Kansal",
      role: "Backend Developer",
      desc: "Handles APIs, architecture, and ensures smooth integration of all AI-powered features.",
    },
    {
      name: "Avee Singh",
      role: "Design & UI/UX",
      desc: "Designs intuitive layouts that make the platform simple, clean, and easy to use.",
    },
    {
      name: "Ansh Goel",
      role: "Product & Quality",
      desc: "Focuses on testing, feature clarity, and making sure the product solves real problems.",
    },
  ];

  return (
    <section id="about" className="bg-[#0B0F19] text-white px-4 py-20">
      <div className="max-w-5xl mx-auto">
        {/* LABEL */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center text-purple-400 px-5 py-1 rounded-full bg-purple-950 border border-purple-800 w-max mx-auto text-sm"
        >
          About Us
        </motion.p>

        {/* HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-semibold text-center mt-4"
        >
          Why{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            ResCall
          </span>{" "}
          Exists
        </motion.h1>

        {/* DESCRIPTION */}
        <p className="text-center text-gray-400 text-sm mt-3 max-w-xl mx-auto">
          ResCall is not just a tool — it’s a complete system that helps you
          analyze, improve, and practice step-by-step for your career.
        </p>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl hover:border-indigo-500 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                {card.icon}
                <h3 className="text-sm font-semibold">{card.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* TEAM */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-semibold text-center mt-16"
        >
          Meet the{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Team
          </span>
        </motion.h2>

        <p className="text-center text-gray-400 text-sm mt-2 mb-8">
          Built by a team focused on solving real placement problems faced by
          students.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-5 bg-[#0F172A] border border-slate-800 rounded-xl hover:border-indigo-500 transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-purple-400" />
                <div>
                  <h3 className="text-sm font-semibold">{member.name}</h3>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
