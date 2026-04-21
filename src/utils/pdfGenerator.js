import jsPDF from "jspdf";

export const generatePDF = (data, userId) => {
  const pdf = new jsPDF();

  let y = 10;

  // HEADER
  pdf.setFontSize(18);
  pdf.text("ResCall AI Resume Report", 10, y);
  y += 6;

  pdf.setFontSize(10);
  pdf.text(`User ID: ${userId}`, 10, y);
  y += 5;

  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 10, y);
  y += 8;

  // LINE
  pdf.line(10, y, 200, y);
  y += 8;

  // ATS SCORE
  pdf.setFontSize(14);
  pdf.text("ATS Score", 10, y);
  y += 6;

  pdf.setFontSize(12);
  pdf.text(`${data?.ats?.score || 0}`, 10, y);
  y += 8;

  // KEYWORDS
  pdf.setFontSize(14);
  pdf.text("Missing Keywords", 10, y);
  y += 6;

  pdf.setFontSize(11);
  data?.ats?.missing_keywords?.forEach((k) => {
    pdf.text(`• ${k}`, 12, y);
    y += 5;
  });

  y += 4;

  // SKILLS
  pdf.setFontSize(14);
  pdf.text("Skills", 10, y);
  y += 6;

  pdf.setFontSize(11);
  pdf.text(`Level: ${data?.skills?.level}`, 12, y);
  y += 6;

  data?.skills?.missing_skills?.forEach((s) => {
    pdf.text(`• ${s}`, 12, y);
    y += 5;
  });

  y += 4;

  // QUESTIONS
  pdf.setFontSize(14);
  pdf.text("Interview Questions", 10, y);
  y += 6;

  pdf.setFontSize(11);
  data?.questions?.slice(0, 5).forEach((q, i) => {
    pdf.text(`${i + 1}. ${q.question}`, 10, y);
    y += 6;
  });

  y += 4;

  // INSIGHT
  pdf.setFontSize(14);
  pdf.text("AI Insight", 10, y);
  y += 6;

  const splitText = pdf.splitTextToSize(data?.insight || "", 180);
  pdf.setFontSize(11);
  pdf.text(splitText, 10, y);

  // SAVE
  pdf.save(`ResCall_Report_${userId}.pdf`);
};