 import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import { ai } from "../gemini/geminiClient";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  // -------------------------------------------------------
  // PDF Extract
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // DOCX Extract
  // -------------------------------------------------------
  const extractDOCX = async (file) => {
    const buf = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    return res.value;
  };

  // -------------------------------------------------------
  // File Upload
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // AI → Clean Formatting (NO stars, NO markdown)
  // -------------------------------------------------------
  const formatOutput = (text) => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      if (!line.trim()) return null;

      // Heading
      if (line.includes(":") && !line.startsWith("-")) {
        return (
          <h3 key={index} className="text-lg font-semibold text-indigo-400 mt-5">
            {line}
          </h3>
        );
      }

      // Bullets
      if (line.startsWith("-") || line.startsWith("•")) {
        return (
          <p key={index} className="ml-4 text-gray-300">
            • {line.replace(/[-•]/, "").trim()}
          </p>
        );
      }

      // Normal Text
      return (
        <p key={index} className="text-gray-300 mt-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  // -------------------------------------------------------
  // Analyze Resume (FAST + SHORT RESPONSE)
  // -------------------------------------------------------
  const analyzeResume = async () => {
    if (!resumeText.trim()) return alert("Upload your resume first.");

    setLoading(true);
    setAnalysis("");

    try {
      const prompt = `
        You are an expert ATS scanner. 
        Give a VERY SHORT, SUPER CLEAR analysis of this resume.
        
        Keep it under 250 words. DO NOT use stars, bold, markdown, or long paragraphs.

        Structure:
        - ATS Score
        - Missing Skills
        - Top Issues
        - Improvements
        - Strong Points
        - Short Summary Rewrite

        Resume:
        ${resumeText}
      `;

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text =
        res.candidates?.[0]?.content?.parts?.[0]?.text || "No output received.";

      setAnalysis(text);
    } catch (err) {
      console.error(err);
      setAnalysis("Error analyzing resume.");
    }

    setLoading(false);
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 md:px-20 py-24">

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold mb-2"
      >
        Resume Analyzer
      </motion.h1>

      <p className="text-gray-300 mb-10 max-w-xl">
        Upload your resume and get a fast, short, premium AI analysis.
      </p>

      <div className="grid md:grid-cols-2 gap-10">

     {/* Upload section */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl"
>
  <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>

  <label
    htmlFor="fileUpload"
    className="flex flex-col items-center justify-center h-56
      rounded-xl cursor-pointer bg-white/5 border border-white/10 
      hover:bg-white/10 transition text-center px-4"
  >
    <Upload size={42} className="mb-3 opacity-70" />

    {/* CONDITIONAL UI */}
    {resumeText ? (
      <div className="flex flex-col items-center gap-1">
        {/* Green success tick */}
        <div className="flex items-center gap-2 text-green-400 font-medium">
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12l4 4L19 6" />
          </svg>
          Uploaded Successfully
        </div>

        <p className="text-gray-400 text-sm">File processed ✓</p>

        {/* Change File */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setResumeText("");
          }}
          className="mt-3 px-4 py-1 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          Change File
        </button>
      </div>
    ) : (
      <span className="text-gray-300">Click to upload PDF or DOCX</span>
    )}

    <input
      type="file"
      id="fileUpload"
      className="hidden"
      accept=".pdf,.docx"
      onChange={handleUpload}
    />
  </label>

  {/* BUTTON + LOADER */}
  <button
    onClick={analyzeResume}
    className="w-full mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 
    rounded-lg active:scale-95 transition flex items-center justify-center gap-3"
  >
    {loading ? (
      <span className="flex items-center gap-3">
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Analyzing…
      </span>
    ) : (
      "Analyze Resume"
    )}
  </button>
</motion.div>


        {/* OUTPUT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 
          shadow-xl overflow-y-auto max-h-[600px]"
        >
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>

          {loading ? (
            <p className="text-gray-400 animate-pulse">Generating insights…</p>
          ) : analysis ? (
            <div className="space-y-2">{formatOutput(analysis)}</div>
          ) : (
            <p className="text-gray-400">Upload a resume to see insights.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
