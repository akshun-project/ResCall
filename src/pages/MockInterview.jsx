import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { getData } from "../utils/storage";
import { ai } from "../gemini/geminiClient";

export default function MockInterview() {
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
        <h2 className="text-lg font-semibold">No data found</h2>
        <button
          onClick={() => navigate("/resume")}
          className="mt-4 bg-indigo-600 px-4 py-2 rounded"
        >
          Upload Resume →
        </button>
      </div>
    );
  }

  const questions = data?.questions || [];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [time, setTime] = useState(60);
  const [finished, setFinished] = useState(false);

  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // ⏱ Timer
  useEffect(() => {
    if (finished) return;

    if (time === 0) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time]);

  // 👉 Next question
  const handleNext = () => {
    if (!input.trim()) {
      alert("Please answer before moving to next question.");
      return;
    }

    const updated = [...answers, input];
    setAnswers(updated);
    setInput("");
    setTime(60);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };
  // 🤖 AI Feedback
  const generateFeedback = async () => {
    setLoadingFeedback(true);

    try {
      const prompt = `
You are an expert interviewer.

Analyze the following interview responses.

Return ONLY JSON:

{
  "score": number (0-100),
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [string]
}

Questions & Answers:
${questions
  .map(
    (q, i) => `
Q: ${q.question}
A: ${answers[i] || ""}
`,
  )
  .join("\n")}
`;

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = res.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      const cleaned = text.replace(/```json|```/g, "").trim();
      const json = JSON.parse(cleaned);

      setFeedback(json);
    } catch (err) {
      console.error(err);
      alert("Failed to generate feedback");
    }

    setLoadingFeedback(false);
  };

  // RESULT SCREEN
  if (finished) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">Interview Result 🎯</h1>

          {questions.map((q, i) => (
            <div
              key={i}
              className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <p className="font-semibold">
                Q{i + 1}: {q.question}
              </p>
              <p className="text-gray-300 mt-2">
                Your Answer: {answers[i] || "Not answered"}
              </p>
            </div>
          ))}

          {/* FEEDBACK BUTTON */}

          {/* FEEDBACK */}
          {feedback && (
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">
                Score: {feedback.score}/100 ⭐
              </h2>

              <h3 className="mt-3 font-semibold">Strengths</h3>
              <ul className="text-green-400">
                {feedback.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>

              <h3 className="mt-3 font-semibold">Weaknesses</h3>
              <ul className="text-red-400">
                {feedback.weaknesses.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>

              <h3 className="mt-3 font-semibold">Suggestions</h3>
              <ul className="text-yellow-400">
                {feedback.suggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
            {!feedback && (
              <button
                onClick={generateFeedback}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg"
              >
                {loadingFeedback ? "Analyzing..." : "Get AI Feedback 🚀"}
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="bg-gray-600 hover:bg-gray-800 px-6 py-3 rounded-lg"
            >
              Back to Home →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // INTERVIEW SCREEN
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm"
        >
          ← Back
        </button>
      </div>
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 p-6 rounded-xl">
        <div className="flex justify-between mb-4">
          <p>
            Question {current + 1}/{questions.length}
          </p>
          <p className="text-red-400 font-semibold">{time}s</p>
        </div>

        <h2 className="text-lg font-semibold mb-4">
          {questions[current]?.question}
        </h2>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          className="w-full h-32 bg-black/30 border border-white/10 rounded-lg p-3 outline-none"
        />
        <button
          onClick={handleNext}
          disabled={!input.trim()}
          className={`mt-4 w-full py-2 rounded-lg transition ${
            input.trim()
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          {current + 1 === questions.length
            ? "Finish Interview"
            : "Next Question →"}
        </button>
      </div>
    </div>
  );
}
