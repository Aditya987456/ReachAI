"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-gray-100 py-2 sm:py-3 md:py-3 lg:py-5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-40 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold cursor-pointer">
          Reach<span className="text-red-600">AI</span>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-base font-medium">
          <a href="#how" className="hover:text-red-600 transition">How it works</a>
          <a href="#faq" className="hover:text-red-600 transition">FAQ</a>
          <a href="#about" className="hover:text-red-600 transition">About</a>
          <a href="#contact" className="hover:text-red-600 transition">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-3xl font-bold text-gray-800"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-72" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-4 bg-white px-6 py-5 text-base font-medium border-t border-gray-100">
          <a href="#how" onClick={() => setOpen(false)} className="hover:text-red-600 transition">
            How it works
          </a>
          <a href="#faq" onClick={() => setOpen(false)} className="hover:text-red-600 transition">
            FAQ
          </a>
          <a href="#about" onClick={() => setOpen(false)} className="hover:text-red-600 transition">
            About
          </a>
          <a href="#contact" onClick={() => setOpen(false)} className="hover:text-red-600 transition">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
