import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { getData } from "../utils/storage";

export default function ATSPage() {
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
        <h2 className="text-xl font-semibold mb-2">No Resume Found</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Upload your resume to see ATS analysis
        </p>

        <button
          onClick={() => navigate("/resume")}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg"
        >
          Upload Resume →
        </button>
      </div>
    );
  }

  const score = data?.ats?.score || 0;
  const keywords = data?.ats?.missing_keywords || [];
  const fixes = data?.ats?.quick_fixes || [];

  const getColor = (num) => {
    if (num >= 80) return "text-green-400";
    if (num >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#0B0F19] to-indigo-900/20 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
          >
            ← Back
          </button>

          <button
            onClick={() => navigate("/resume")}
            className="text-sm bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
          >
            Re-analyze →
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          ATS Optimization 📊
        </h1>

        <p className="text-gray-400 mb-8 text-sm">
          Improve your resume to pass Applicant Tracking Systems
        </p>

        {/* SCORE CARD */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 mb-8 text-center">
          <h2 className="text-gray-400 text-sm mb-2">Your ATS Score</h2>

          <h1 className={`text-6xl font-bold ${getColor(score)}`}>{score}</h1>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 h-2 rounded-full mt-4">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* KEYWORDS */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Missing Keywords</h3>

            {keywords.length ? (
              <div className="flex flex-wrap gap-2">
                {keywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/10 rounded-full text-xs"
                  >
                    {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-green-400 text-sm">No missing keywords 🎉</p>
            )}
          </div>

          {/* FIXES */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Quick Fixes</h3>

            <ul className="space-y-2 text-gray-300 text-sm">
              {fixes.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
