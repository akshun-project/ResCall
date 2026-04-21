 import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { getData, saveData } from "../utils/storage";
import { useState, useEffect } from "react";

export default function SkillPathPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const userId = user?.id;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const data = getData(`aiData_${userId}`);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-lg font-semibold mb-2">
          No Resume Found
        </h2>
        <button
          onClick={() => navigate("/resume")}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Upload Resume →
        </button>
      </div>
    );
  }

  const skills = data?.skills?.missing_skills || [];
  const level = data?.skills?.level || "N/A";

  // 🔥 LOAD PROGRESS
  const [completed, setCompleted] = useState(() => {
    return getData(`skillProgress_${userId}`) || {};
  });

  // 🔥 SAVE PROGRESS
  useEffect(() => {
    saveData(`skillProgress_${userId}`, completed);
  }, [completed]);

  const toggleSkill = (skill) => {
    setCompleted((prev) => ({
      ...prev,
      [skill]: !prev[skill],
    }));
  };

  // 📊 PROGRESS %
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = skills.length
    ? Math.round((completedCount / skills.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-4 py-10">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm"
          >
            ← Back
          </button>

          <button
            onClick={() => navigate("/resume")}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
          >
            Re-analyze →
          </button>

        </div>

        <h1 className="text-3xl font-semibold mb-2">
          Skill Roadmap 🧠
        </h1>

        <p className="text-gray-400 mb-6 text-sm">
          Track your progress and improve step-by-step
        </p>

        {/* LEVEL */}
        <div className="mb-6 p-5 bg-[#0F172A] border border-slate-800 rounded-xl">
          <h2 className="text-gray-400 text-sm">Current Level</h2>
          <p className="text-2xl text-indigo-400 font-semibold mt-2">
            {level}
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full bg-gray-800 h-2 rounded-full">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* SKILLS */}
        <div className="space-y-3 mb-10">
          {skills.map((skill, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#0F172A] p-4 rounded-lg border border-slate-800"
            >
              <span>{skill}</span>

              <input
                type="checkbox"
                checked={!!completed[skill]}
                onChange={() => toggleSkill(skill)}
                className="w-5 h-5 accent-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* TIP */}
        <div className="mb-8 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <p className="text-sm text-gray-300">
            Complete these skills step-by-step to improve your placement readiness.
          </p>
        </div>

        {/* CTA */}
       <div className="flex justify-center">
   <div className="flex justify-center mt-6">
  <button
    onClick={() => navigate("/mock-interview")}
    className="bg-green-500 hover:bg-green-600 px-8 py-2.5 rounded-lg"
  >
    Start Interview Practice →
  </button>
</div>
</div>

      </div>
    </div>
  );
}