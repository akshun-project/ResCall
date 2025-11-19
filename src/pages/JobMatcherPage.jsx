 import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import { ai } from "../gemini/geminiClient";

// PDF worker
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default function JobMatcherPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ------------------ PDF Extract ------------------
  const extractPDFText = async (file) => {
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

  // ------------------ DOCX Extract ------------------
  const extractDOCXText = async (file) => {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  };

  // ------------------ Resume Upload ------------------
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let text = "";

    if (file.type === "application/pdf") text = await extractPDFText(file);
    else if (file.type.includes("word")) text = await extractDOCXText(file);
    else return alert("Upload PDF or DOCX only.");

    setResumeText(text);
  };

  // ------------------ AI Matcher ------------------
  const matchResume = async () => {
    if (!resumeText.trim() || !jobText.trim()) {
      alert("Please upload resume + job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    const prompt = `
Compare the following RESUME and JOB DESCRIPTION.
Return VERY SHORT, CLEAN text. No markdown.

RETURN STRICT FORMAT:
MATCH SCORE (0–100)
MISSING KEYWORDS (comma list)
MATCHED SKILLS (comma list)
3 MAIN GAPS
3 IMPROVED BULLET POINTS FOR RESUME
FINAL ADVICE (1 short paragraph)

==== RESUME ====
${resumeText}

==== JOB DESCRIPTION ====
${jobText}
`;

    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const raw = res.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const lines = raw.split("\n").filter((l) => l.trim() !== "");

      const score = parseInt(lines[0]) || 0;

      setResult({
        score,
        text: lines.slice(1).join("\n"),
      });
    } catch (err) {
      console.error(err);
      setResult({
        score: 0,
        text: "Error analyzing. Try again.",
      });
    }

    setLoading(false);
  };

  // ----------- Format Output (clean bullets) -----------
  const formatOutput = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.includes(":")) {
        return (
          <h3 key={i} className="text-lg font-semibold text-indigo-400 mt-4">
            {line.trim()}
          </h3>
        );
      }

      return (
        <p key={i} className="text-gray-300 leading-relaxed ml-2">
          • {line.trim()}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 md:px-20 py-24">

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold mb-2"
      >
        Job Description Matcher
      </motion.h1>

      <p className="text-gray-300 mb-10 max-w-xl">
        Upload your resume, paste any job description, and get a match score + missing keywords + bullet point rewrites.
      </p>

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT SECTION: INPUT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>

          {/* Upload Box */}
          <label
            htmlFor="upload"
            className="flex flex-col items-center justify-center 
            h-48 rounded-xl cursor-pointer bg-white/5 border border-white/10 
            hover:bg-white/10 transition mb-6"
          >
            <Upload size={40} className="mb-2 opacity-70" />
            <span className="text-gray-300">
              {resumeText ? "Resume uploaded ✓" : "Click to upload PDF or DOCX"}
            </span>

            <input
              id="upload"
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleUpload}
            />
          </label>

          {/* Job Description */}
          <h2 className="text-xl font-semibold mb-3">Paste Job Description</h2>

          <textarea
            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 resize-none outline-none"
            placeholder="Paste job description here…"
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
          />

          {/* Button */}
          <button
            onClick={matchResume}
            className="mt-6 w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg active:scale-95 transition flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Matching…
              </span>
            ) : (
              "Match Resume"
            )}
          </button>
        </motion.div>

        {/* RIGHT SECTION: RESULTS */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-lg overflow-y-auto max-h-[650px]"
        >
          <h2 className="text-xl font-semibold mb-4">Match Results</h2>

          {!result ? (
            <p className="text-gray-400">Results will appear here…</p>
          ) : (
            <>
              {/* Score */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-yellow-400">
                  {result.score}
                </div>
                <p className="text-gray-400">Match Score</p>
              </div>

              {/* Output */}
              <div className="space-y-2">
                {formatOutput(result.text)}
              </div>
            </>
          )}
        </motion.div>

      </div>
    </div>
  );
}
