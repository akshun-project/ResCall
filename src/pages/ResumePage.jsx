import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Upload, ArrowLeft } from "lucide-react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import { ai } from "../gemini/geminiClient";
import { useNavigate } from "react-router-dom";
import { saveData } from "../utils/storage";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [role, setRole] = useState("Software Developer");

  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id;

  // ---------------- PDF Extract ----------------
  const extractPDF = async (file) => {
    const buf = await file.arrayBuffer();
    const pdf = await getDocument({ data: buf }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((x) => x.str).join(" ") + "\n";
    }
    return text;
  };

  // ---------------- DOCX Extract ----------------
  const extractDOCX = async (file) => {
    const buf = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    return res.value;
  };

  // ---------------- Upload ----------------
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let output = "";
    if (file.type === "application/pdf") output = await extractPDF(file);
    else if (file.type.includes("wordprocessingml"))
      output = await extractDOCX(file);
    else return alert("Upload PDF or DOCX only");

    setResumeText(output);
  };

  // ---------------- Analyze Resume ----------------
  const analyzeResume = async () => {
    if (!userId) return alert("User not loaded");
    if (!resumeText.trim()) return alert("Upload resume first");

    setLoading(true);
    setAnalysis("");

    try {
      const prompt = `
You are an expert ATS system and interviewer.

Target Role: ${role}

Analyze the resume and return STRICT JSON.

FORMAT:
{
  "ats": {
    "score": number (0-100),
    "missing_keywords": [string],
    "quick_fixes": [string]
  },
  "skills": {
    "level": "Beginner" | "Intermediate" | "Advanced",
    "missing_skills": [string]
  },
  "questions": [
    {
      "type": "technical" | "hr" | "dsa",
      "question": string
    }
  ],
  "insight": string
}

RULES:
- ALWAYS return 6 questions
- ALWAYS include "type"
- Types must be: technical, hr, dsa
- Questions must match the selected role
- HR role → no coding questions
- Developer role → include coding/DSA
- Keep insight under 25 words

Resume:
${resumeText}
`;

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = res.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const json = JSON.parse(cleaned);

      saveData(`aiData_${userId}`, {
        ...json,
        role: role,
      });

      setAnalysis("Done");

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume");
    }

    setLoading(false);
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 md:px-20 py-20">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-16">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>

        <div className="text-center flex-1">
          <h1 className="text-4xl font-semibold">Resume Analyzer</h1>

          <p className="text-gray-400 mt-2">
            AI-powered role-based resume evaluation
          </p>

          <span className="inline-block mt-3 text-xs bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            AI Powered
          </span>
        </div>

        <div className="w-[60px]" />
      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        {/* LEFT INFO */}
        <div>
          <h2 className="text-3xl font-semibold leading-snug">
            Get your resume evaluated
            <br />
            with <span className="text-indigo-400">AI precision</span>
          </h2>

          <p className="text-gray-400 mt-4 leading-relaxed">
            Upload your resume and receive ATS score, missing skills, and
            interview preparation insights tailored to your role.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-gray-300">
            <li>✔ Role-based analysis</li>
            <li>✔ Skill gap detection</li>
            <li>✔ Interview preparation</li>
          </ul>
        </div>

        {/* RIGHT CARD */}
        <div
          className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 
      border border-white/10 backdrop-blur-xl shadow-lg"
        >
          {/* ROLE */}
          <label className="text-sm text-gray-400">Target Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-2 mb-5 p-3 rounded-lg 
  bg-[#111827] text-white border border-white/10 
  focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option className="bg-[#111827] text-white">
              Software Developer
            </option>
            <option className="bg-[#111827] text-white">Data Analyst</option>
            <option className="bg-[#111827] text-white">HR</option>
            <option className="bg-[#111827] text-white">Marketing</option>
          </select>

          {/* UPLOAD */}
          <label
            className="flex flex-col items-center justify-center h-40 border border-white/10 
        rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition text-center"
          >
            <Upload size={36} className="mb-2 opacity-70" />

            {resumeText ? (
              <span className="text-green-400 text-sm">✅ Resume Uploaded</span>
            ) : (
              <span className="text-gray-300 text-sm">
                Click to upload PDF or DOCX
              </span>
            )}

            <input type="file" className="hidden" onChange={handleUpload} />
          </label>

          {/* BUTTON */}
          <button
            onClick={analyzeResume}
            className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
          hover:opacity-90 rounded-lg font-medium transition active:scale-95"
          >
            {loading ? "Analyzing..." : "Analyze Resume 🚀"}
          </button>

          {/* STATUS */}
          {analysis && (
            <p className="text-green-400 text-center mt-4">
              ✅ Analysis complete. Redirecting...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
