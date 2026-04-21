import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { getData, saveData } from "../utils/storage";
import { ai } from "../gemini/geminiClient";

export default function Interview() {
  const { user } = useUser();
  const navigate = useNavigate();

  const userId = user?.id;
  const data = getData(`aiData_${userId}`);

  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(data?.questions || []);

  const [showHint, setShowHint] = useState({});
  const [showAnswer, setShowAnswer] = useState({});

  // ❌ NO DATA
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-lg font-semibold mb-2">No Resume Found</h2>
        <p className="text-gray-400 text-sm mb-4">
          Upload your resume to generate interview questions
        </p>

        <button
          onClick={() => navigate("/resume")}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-sm"
        >
          Upload Resume →
        </button>
      </div>
    );
  }

  // 🎯 FILTER
  const filtered =
    filter === "all" ? questions : questions.filter((q) => q.type === filter);

  // 🔄 GENERATE MORE
  const generateMore = async () => {
    setLoading(true);

    try {
      const prompt = `
You are an expert interviewer.

Generate 8 ${filter === "all" ? "" : filter} interview questions.

Rules:
- Do NOT repeat previous questions
- Include hint and answer
- Return ONLY JSON:

{
  "questions": [
    {
      "type": "technical|hr|dsa",
      "question": "...",
      "hint": "...",
      "answer": "..."
    }
  ]
}

Resume:
${JSON.stringify(data)}
`;

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = res.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      const cleaned = text.replace(/```json|```/g, "").trim();
      const json = JSON.parse(cleaned);

      const updated = [...questions, ...json.questions];

      setQuestions(updated);

      saveData(`aiData_${userId}`, {
        ...data,
        questions: updated,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions");
    }

    setLoading(false);
  };

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

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Interview Preparation 🎯
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          Practice questions based on your resume
        </p>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "technical", "hr", "dsa"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === type
                  ? "bg-indigo-600"
                  : "bg-[#0F172A] border border-slate-800"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* QUESTIONS */}
        <div className="space-y-4">
          {filtered.map((q, i) => (
            <div
              key={i}
              className="bg-[#0F172A] border border-slate-800 rounded-xl p-4"
            >
              <p className="text-xs text-gray-400 mb-1">
                {q.type.toUpperCase()}
              </p>

              <p className="font-medium">{q.question}</p>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => {
                    setShowHint((prev) => ({
                      ...prev,
                      [i]: !prev[i],
                    }));
                    setShowAnswer((prev) => ({
                      ...prev,
                      [i]: false,
                    }));
                  }}
                  className="text-indigo-400 text-sm"
                >
                  💡 Hint
                </button>

                <button
                  onClick={() => {
                    setShowAnswer((prev) => ({
                      ...prev,
                      [i]: !prev[i],
                    }));
                    setShowHint((prev) => ({
                      ...prev,
                      [i]: false,
                    }));
                  }}
                  className="text-green-400 text-sm"
                >
                  ✅ Answer
                </button>
              </div>

              {/* HINT */}
              {showHint[i] && (
                <p className="text-yellow-400 mt-2 text-sm">
                  {q.hint || "Think about the core concept"}
                </p>
              )}

              {/* ANSWER */}
              {showAnswer[i] && (
                <p className="text-gray-300 mt-2 text-sm">
                  {q.answer || "Answer not available"}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <button
            onClick={generateMore}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-sm"
          >
            {loading ? "Generating..." : "🔄 Generate More"}
          </button>

          <button
            onClick={() => navigate("/mock-interview")}
            className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-sm"
          >
            🎤 Start Mock Interview
          </button>
        </div>
      </div>
    </div>
  );
}
