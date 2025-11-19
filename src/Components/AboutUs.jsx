 import { motion } from "framer-motion";
import { Rocket, Lightbulb, BrainCircuit, Users } from "lucide-react";

export default function AboutUs() {
  const cards = [
    {
      icon: <Rocket size={28} className="text-pink-400" />,
      title: "Our Mission",
      text: "To simplify the job-hunting process with AI-powered insights that help you present your skills, experience, and professionalism with confidence.",
    },
    {
      icon: <Lightbulb size={28} className="text-yellow-400" />,
      title: "What We Offer",
      text: "Resume analysis, ATS scoring, job description matching, skill-gap detection, and personalized learning paths — all in one place.",
    },
    {
      icon: <BrainCircuit size={28} className="text-purple-400" />,
      title: "Powered by AI",
      text: "Built with state-of-the-art AI models, ResCall provides fast, actionable, and deeply accurate career insights.",
    },
  ];

  const team = [
    {
      name: "Akshun Jindal",
      role: "Frontend Developer",
      desc: "Leads the UI engineering and builds smooth, modern user experiences across ResCall.",
    },
    {
      name: "Akshat Kansal",
      role: "Backend Developer",
      desc: "Responsible for API integration, architecture, and backend logic powering all AI features.",
    },
    {
      name: "Avee Singh",
      role: "Design & UI/UX",
      desc: "Crafts visually appealing layouts and ensures ResCall feels clean, intuitive, and professional.",
    },
    {
      name: "Ansh Goel",
      role: "Product & Quality",
      desc: "Handles testing, feature validation, and helps align the product with real user needs.",
    },
  ];

  return (
    <section className="min-h-screen bg-[#0B0F19] text-white px-6 md:px-16 lg:px-24 xl:px-32 py-28"  id="about"
       >

      {/* Page Label */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-medium text-purple-400 px-6 py-1.5 rounded-full
                   bg-purple-950 border border-purple-800 w-max mx-auto"
      >
        About Us
      </motion.p>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-semibold text-center mt-4"
      >
        Why We Built  <span className="bg-gradient-to-r font-semibold from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Res
            </span>
            <span className="text-slate-300 font-medium">Call</span>
      </motion.h1>

      <p className="text-center text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
        ResCall uses AI to improve your resume, match you to the right jobs, and guide your career with clarity.
      </p>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-14 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl
                       hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              {card.icon}
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{card.text}</p>
          </motion.div>
        ))}
      </div>

      {/* TEAM SECTION */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold text-center mt-24"
      >
        Meet the  <span className="bg-gradient-to-r font-semibold from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Res
            </span>
            <span className="text-slate-300 font-medium">Call</span> Team
      </motion.h2>

      <p className="text-center text-slate-300 mt-2 mb-10">
        A passionate group of developers and designers building the future of AI-powered career tools.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {team.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl 
                       hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-3">
              <Users size={30} className="text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-slate-400">{member.role}</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{member.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
