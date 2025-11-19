 import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import mammoth from "mammoth";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/build/pdf";
import { ai } from "../gemini/geminiClient";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default function ATSPage() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [fixes, setFixes] = useState([]);

  // ---------------- PDF EXTRACTION ----------------
  const extractPDF = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: buffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((t) => t.str).join(" ") + "\n";
    }

    return text;
  };

  // ---------------- DOCX EXTRACTION ----------------
  const extractDOCX = async (file) => {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  };

  // ---------------- HANDLE UPLOAD ----------------
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let extracted = "";

    if (file.type === "application/pdf") {
      extracted = await extractPDF(file);
    } else if (file.type.includes("wordprocessingml")) {
      extracted = await extractDOCX(file);
    } else {
      alert("Upload only PDF or DOCX files.");
      return;
    }

    setResumeText(extracted);
  };

  // ---------------- ANALYZE ATS SCORE ----------------
  const checkATS = async () => {
    if (!resumeText.trim()) return alert("Upload resume first.");

    setLoading(true);
    setScore(null);
    setKeywords([]);
    setFixes([]);

    try {
      const prompt = `
        You are an ATS scoring engine.
        Analyze this resume and return ONLY a JSON object:

        {
          "score": number (0-100),
          "missing_keywords": ["skill1","skill2"],
          "quick_fixes": ["short suggestion 1","short suggestion 2"]
        }

        Resume:
        ${resumeText}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const raw =
        response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      const cleaned = raw.replace(/```json|```/g, "");

      const json = JSON.parse(cleaned);

      setScore(json.score);
      setKeywords(json.missing_keywords || []);
      setFixes(json.quick_fixes || []);
    } catch (err) {
      console.error(err);
      alert("Error calculating ATS score.");
    }

    setLoading(false);
  };

  // ---------------- SCORE COLOR ----------------
  const getColor = (num) => {
    if (num >= 80) return "text-green-400";
    if (num >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 md:px-20 py-24">
      {/* PAGE TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold mb-2"
      >
        ATS Score Checker
      </motion.h1>

      <p className="text-gray-300 mb-10 max-w-xl">
        Upload your resume to get a fast, accurate ATS score with missing
        keywords and quick fixes.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* ---------------- LEFT: UPLOAD ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>

          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center w-full h-56
              rounded-xl cursor-pointer bg-white/5 border border-white/10 
              hover:bg-white/10 transition"
          >
            <Upload size={42} className="mb-3 opacity-70" />

            {resumeText ? (
              <span className="text-green-400 font-medium">
                File uploaded ✔
              </span>
            ) : (
              <span className="text-gray-300">
                Click to upload PDF or DOCX
              </span>
            )}

            <input
              type="file"
              id="fileUpload"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleUpload}
            />
          </label>

          {/* BUTTON WITH LOADER */}
          <button
            onClick={checkATS}
            className="w-full mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 
            rounded-lg active:scale-95 transition flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Checking…
              </>
            ) : (
              "Get ATS Score"
            )}
          </button>
        </motion.div>

        {/* ---------------- RIGHT: RESULT ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Score Breakdown</h2>

          {!score && !loading && (
            <p className="text-gray-400">Upload a resume to view score.</p>
          )}

          {/* SCORE UI */}
          {score !== null && (
            <div className="text-center">
              <h1
                className={`text-6xl font-bold mb-4 ${getColor(score)}`}
              >
                {score}
              </h1>
              <p className="text-gray-400 mb-6">ATS Score</p>

              {/* Missing Keywords */}
              <h3 className="text-lg font-semibold mb-2">Missing Keywords</h3>
              {keywords.length ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-sm"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-6">None 🎉</p>
              )}

              {/* Quick Fixes */}
              <h3 className="text-lg font-semibold mb-2">Quick Fixes</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                {fixes.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
