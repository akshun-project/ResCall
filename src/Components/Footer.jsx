 import { Mail, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] text-white border-t border-white/10 py-14 px-6 md:px-20">

      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3 text-center md:text-left">

        {/* LOGO + MESSAGE */}
        <div>
          <div className="text-3xl font-bold mb-3 flex justify-center md:justify-start">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Res
            </span>
            <span className="text-slate-300 font-medium">Call</span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
            Your AI-powered companion for resume analysis, job matching, skill gap detection,
            and career acceleration.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="#tools" className="hover:text-white transition">Tools</a></li>
            <li><a href="#features" className="hover:text-white transition">Features</a></li>
            <li><a href="#about" className="hover:text-white transition">About Us</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>

          <div className="flex md:flex-col flex-wrap items-center md:items-start gap-3 justify-center md:justify-start">

            <a
              href="mailto:support@rescall.com"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm"
            >
              <Mail size={16} /> support@rescall.com
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm"
            >
              <Linkedin size={16} /> LinkedIn
            </a>

            <a
              href="https://github.com"
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm"
            >
              <Github size={16} /> GitHub
            </a>

          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-12">
        © 2025 ResCall — Built with 💜 by the ResCall Team.
      </p>
    </footer>
  );
}
