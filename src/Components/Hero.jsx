 import React, { useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

export default function Hero() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      {/* GLOBAL FONT */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          * { font-family: 'Poppins', sans-serif; }
        `}
      </style>

      <section className="flex flex-col items-center text-white text-sm relative bg-[#0B0F19] overflow-hidden pb-20">

        {/* GRADIENT RING */}
        <svg
          className="absolute -z-10 w-full max-w-none -mt-60 sm:-mt-48 md:-mt-32 opacity-80"
          width="1440"
          height="676"
          viewBox="0 0 1440 676"
          fill="none"
        >
          <rect
            x="-92"
            y="-948"
            width="1624"
            height="1624"
            rx="812"
            fill="url(#ring)"
          />
          <defs>
            <radialGradient
              id="ring"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="rotate(90 428 292) scale(850)"
            >
              <stop offset="0.45" stopColor="#4338CA" stopOpacity="0.35" />
              <stop offset="1" stopColor="#4338CA" />
            </radialGradient>
          </defs>
        </svg>

        {/* NAVBAR */}
        <nav className="z-50 sticky top-0 flex items-center justify-between w-full py-4 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur">

          {/* LOGO */}
          <a href="/" className="text-2xl sm:text-3xl font-extrabold flex items-center tracking-tight">
            <span className="bg-gradient-to-r font-semibold from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Res
            </span>
            <span className="text-slate-300 font-medium">Call</span>
          </a>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="hover:text-slate-300 transition">Home</a>
            <a href="#tools" className="hover:text-slate-300 transition">Tools</a>
            <a href="#features" className="hover:text-slate-300 transition">Features</a>
            <a href="#about" className="hover:text-slate-300 transition">About</a>
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 border border-slate-400 rounded-md hover:bg-white/10 transition whitespace-nowrap">
                  Login
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md whitespace-nowrap">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpenMenu(true)}
            className="md:hidden active:scale-90 transition"
          >
            <svg width="26" height="26" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h18" />
              <path d="M4 12h18" />
              <path d="M4 18h18" />
            </svg>
          </button>
        </nav>

        {/* MOBILE OVERLAY */}
        {openMenu && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-lg flex flex-col items-center justify-center gap-8 text-lg">

            <a href="#tools" onClick={() => setOpenMenu(false)}>Tools</a>
            <a href="#features" onClick={() => setOpenMenu(false)}>Features</a>
            <a href="#faq" onClick={() => setOpenMenu(false)}>FAQ</a>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-40 px-6 py-2 bg-white text-black rounded-md">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-40 px-6 py-2 bg-indigo-600 text-white rounded-md">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <button
              onClick={() => setOpenMenu(false)}
              className="p-2 bg-white/20 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        )}

        {/* STATUS TAG */}
        <div className="flex items-center mt-20 sm:mt-28 gap-2 border border-slate-600 text-gray-50 rounded-full px-4 py-2">
          <div className="size-2.5 bg-green-500 rounded-full" />
          <span className="text-xs sm:text-sm">AI-powered tools for your career</span>
        </div>

        {/* HERO HEADING */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mt-4 max-w-3xl px-4">
          Your{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI-Powered
          </span>{" "}
          Resume, Career & Job Match{" "}
          <span className="text-purple-300 font-semibold">Assistant</span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-center text-sm sm:text-base max-w-lg mt-3 text-gray-300 px-4">
          Analyze your resume, compare job descriptions, discover skill gaps, and get a personalized career roadmap.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-lg active:scale-95 w-full sm:w-auto">
                Start Analysis →
              </button>
            </SignUpButton>

            <SignInButton mode="modal">
              <button className="border border-slate-400 hover:bg-white/10 px-8 h-11 rounded-lg active:scale-95 w-full sm:w-auto">
                Explore Tools
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <a
              href="/resume"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 h-11 rounded-lg active:scale-95 w-full sm:w-auto"
            >
              Continue Analysis →
            </a>
          </SignedIn>
        </div>

        {/* HERO IMAGE */}
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-2.png"
          className="w-full max-w-4xl rounded-[15px] mt-12 sm:mt-16 px-4"
          alt="hero section"
        />
      </section>
    </>
  );
}
