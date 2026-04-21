import { useNavigate } from "react-router-dom";
import { getData, removeData } from "../utils/storage";
import { useUser } from "@clerk/clerk-react";
import { generatePDF } from "../utils/pdfGenerator";
export default function Dashboard() {
  const navigate = useNavigate();

  const { user } = useUser();
  const userId = user?.id;

  if (!userId) {
    return <p className="text-white p-10">Loading...</p>;
  }

  const data = getData(`aiData_${userId}`);
  // ---------------- EMPTY STATE ----------------
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white text-center px-6">
        <h2 className="text-xl font-semibold mb-2">No resume found</h2>
        <p className="text-gray-400 mb-4">
          Upload your resume to start analysis
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

  // ---------------- MAIN UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#0B0F19] to-indigo-900/20 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Dashboard 🚀</h1>
            <p className="text-gray-400 text-sm mt-1">
              Track your progress and improve your career
            </p>
          </div>

          <button
            onClick={() => generatePDF(data, userId)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
          >
            Download Report 📄
          </button>

          <button
            onClick={() => {
              removeData(`aiData_${userId}`);
              navigate("/resume");
            }}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm"
          >
            Re-analyze
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">ATS Score</p>
            <h2 className="text-2xl font-bold text-indigo-400">
              {data?.ats?.score || 0}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Skills Missing</p>
            <h2 className="text-2xl font-bold">
              {data?.skills?.missing_skills?.length || 0}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Questions</p>
            <h2 className="text-2xl font-bold">
              {data?.questions?.length || 0}
            </h2>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* ATS CARD */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-300">📊 ATS Score</h3>
              <span className="text-3xl font-bold text-indigo-400">
                {data?.ats?.score || 0}
              </span>
            </div>

            <div className="w-full bg-gray-800 h-2 rounded-full mt-3">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${data?.ats?.score || 0}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {data?.ats?.missing_keywords?.slice(0, 4).map((k, i) => (
                <span
                  key={i}
                  className="bg-white/10 px-3 py-1 rounded-full text-xs"
                >
                  {k}
                </span>
              ))}
            </div>

            <button
              onClick={() => navigate("/ats")}
              className="mt-4 text-indigo-400 text-sm"
            >
              Improve ATS →
            </button>
          </div>

          {/* SKILLS CARD */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
            <h3 className="text-gray-300 mb-2">🧠 Skill Level</h3>

            <p className="text-xl text-indigo-400 font-semibold">
              {data?.skills?.level || "N/A"}
            </p>

            <ul className="mt-3 text-sm text-gray-300 space-y-1">
              {data?.skills?.missing_skills?.slice(0, 4).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/skill-path")}
              className="mt-4 text-indigo-400 text-sm"
            >
              View Skill Path →
            </button>
          </div>

          {/* QUESTIONS PREVIEW */}
          <div className="bg-[#0F172A] border border-white/10 rounded-xl p-5 md:col-span-2">
            <h3 className="text-gray-300 mb-3">🎯 Interview Questions</h3>

            <ul className="text-sm text-gray-300 space-y-2">
              {data?.questions?.slice(0, 3).map((q, i) => (
                <li key={i}>• {q.question}</li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/interview")}
              className="mt-3 text-indigo-400 text-sm"
            >
              View All →
            </button>
          </div>

          {/* ACTIONS */}
          <div className="bg-[#0F172A] border border-white/10 rounded-xl p-5 md:col-span-2">
            <h3 className="text-gray-300 mb-3">⚡ Quick Actions</h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/ats")}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg w-full"
              >
                Improve Resume
              </button>

              <button
                onClick={() => navigate("/interview")}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full"
              >
                Practice Questions
              </button>

              <button
                onClick={() => navigate("/mock-interview")}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg w-full"
              >
                Mock Interview
              </button>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="bg-[#0F172A] border border-white/10 rounded-xl p-5 md:col-span-2">
            <h3 className="text-gray-300 mb-2">💡 AI Insight</h3>
            <p className="text-sm text-gray-300">{data?.insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
