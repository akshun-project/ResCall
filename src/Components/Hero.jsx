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

      <section className="flex flex-col items-center text-white text-sm relative bg-[#0B0F19] overflow-hidden pb-24">

        {/* GRADIENT RING BACKGROUND */}
        <svg
          className="absolute -z-10 w-screen -mt-40 md:mt-0 opacity-80"
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
        <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur">
          
          {/* LOGO */}
          <a href="/" className="text-3xl font-extrabold flex items-center tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-bold">
              Res
            </span>
            <span className="text-slate-300 font-medium">Call</span>
          </a>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="hover:text-slate-300 transition">Home</a>
            <a href="#tools" className="hover:text-slate-300 transition">Tools</a>
            <a href="#features" className="hover:text-slate-300 transition">Features</a>
            <a href="#about" className="hover:text-slate-300 transition">About</a>
          </div>

          {/* AUTH BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-5 py-2 border border-slate-400 rounded-md hover:bg-white/10 transition">
                  Login
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* MOBILE MENU ICON */}
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

        {/* MOBILE OVERLAY MENU */}
        {openMenu && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-lg flex flex-col items-center justify-center gap-8 text-lg">
            <a href="/" onClick={() => setOpenMenu(false)}>Home</a>
            <a href="#tools" onClick={() => setOpenMenu(false)}>Tools</a>
            <a href="#features" onClick={() => setOpenMenu(false)}>Features</a>
            <a href="#about" onClick={() => setOpenMenu(false)}>About</a>

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
        <div className="flex items-center mt-24 gap-2 border border-slate-600 text-gray-50 rounded-full px-4 py-2">
          <div className="size-2.5 bg-green-500 rounded-full" />
          <span>AI-powered tools for your career</span>
        </div>

        {/* HERO TITLE */}
        <h1 className="text-center text-5xl md:text-6xl font-bold leading-tight mt-4 max-w-3xl">
          Your{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI-Powered
          </span>{" "}
          Resume, Career & Job Match{" "}
          <span className="text-purple-300 font-semibold">Assistant</span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-center text-base max-w-lg mt-3 text-gray-300">
          Analyze your resume, compare job descriptions, discover skill gaps,
          and get a personalized career roadmap.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex items-center gap-4 mt-8">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-lg active:scale-95">
                Start Analysis →
              </button>
            </SignUpButton>

            <SignInButton mode="modal">
              <button className="border border-slate-400 hover:bg-white/10 px-8 h-11 rounded-lg active:scale-95">
                Explore Tools
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <a
              href="/resume"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 h-11 rounded-lg active:scale-95"
            >
              Continue Analysis →
            </a>
          </SignedIn>
        </div>

        {/* HERO IMAGE */}
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-2.png"
          className="w-full rounded-[15px] max-w-4xl mt-16"
          alt="hero section"
        />
      </section>
    </>
  );
}
