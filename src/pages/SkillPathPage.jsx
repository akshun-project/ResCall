 import { useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { ai } from "../gemini/geminiClient";

export default function SkillPathPage() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const generatePath = async () => {
    if (!currentSkills.trim() || !targetRole.trim()) {
      alert("Please enter skills and target role.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const prompt = `
Generate a concise, premium, easy-to-understand skill gap & learning path.

OUTPUT FORMAT (NO MARKDOWN, ONLY CLEAN TEXT):

MISSING SKILLS
TOP 5 PRIORITY SKILLS
30-DAY LEARNING ROADMAP
WEEKLY GOALS
PROJECT TO BUILD
FINAL ADVICE

Current Skills:
${currentSkills}

Target Role:
${targetRole}
`;

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text =
        res.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No output generated.";

      setResult(text);
    } catch (err) {
      console.error(err);
      setResult("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  // Format AI text nicely
  const formatOutput = (text) => {
    const lines = text.split("\n").filter((l) => l.trim() !== "");

    return lines.map((line, i) => {
      if (line.endsWith(":") || line.startsWith("MISSING")) {
        return (
          <h3 key={i} className="text-lg font-semibold text-indigo-400 mt-4">
            {line}
          </h3>
        );
      }

      if (line.startsWith("-") || line.startsWith("*")) {
        return (
          <p key={i} className="ml-4 text-gray-300">
            • {line.replace(/[-*]/, "").trim()}
          </p>
        );
      }

      return (
        <p key={i} className="text-gray-300 mt-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 md:px-20 py-24">

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold mb-2"
      >
        Skill Gap & Learning Path AI
      </motion.h1>

      <p className="text-gray-300 mb-10 max-w-xl">
        Identify missing skills and get a personalized, premium AI roadmap to reach your target role.
      </p>

      <div className="grid md:grid-cols-2 gap-10">

        {/* INPUT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>

          <textarea
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl 
            px-4 py-3 text-gray-200 outline-none resize-none mb-4"
            placeholder="Your current skills (comma separated)..."
            onChange={(e) => setCurrentSkills(e.target.value)}
          />

          <textarea
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl 
            px-4 py-3 text-gray-200 outline-none resize-none"
            placeholder="Target role (e.g., Frontend Developer)"
            onChange={(e) => setTargetRole(e.target.value)}
          />

          <button
            onClick={generatePath}
            className="w-full mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 
            rounded-lg active:scale-95 transition flex justify-center gap-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating…
              </span>
            ) : (
              "Generate Skill Path"
            )}
          </button>
        </motion.div>

        {/* RESULT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 
          backdrop-blur-xl overflow-y-auto max-h-[600px]"
        >
          <h2 className="text-xl font-semibold mb-4">Your Learning Roadmap</h2>

          {loading ? (
            <p className="text-gray-400 animate-pulse">Preparing your roadmap…</p>
          ) : result ? (
            <div>{formatOutput(result)}</div>
          ) : (
            <p className="text-gray-400">
              Enter skills + target role to generate a custom learning plan.
            </p>
          )}
        </motion.div>

      </div>
    </div>
  );
}
