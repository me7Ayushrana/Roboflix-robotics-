"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoboflixNavbarProps {
  activeSection?: string;
}

export default function RoboflixNavbar({ activeSection }: RoboflixNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Browse Series", href: "/" },
    { name: "Season 1", href: "/watch/s1" },
    { name: "Season 2", href: "/watch/s2" },
    { name: "Season 3", href: "/watch/s3" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[60px] bg-brand-bg/85 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-6 md:px-12 transition-all">
      {/* Brand Logo */}
      <Link href="/browse" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-md bg-brand-red flex items-center justify-center text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] group-hover:scale-105 transition-transform">
          <Play className="w-4 h-4 fill-white" />
        </div>
        <span className="font-bebas text-2xl tracking-wider text-brand-red select-none">
          ROBO<span className="text-white group-hover:text-brand-red transition-colors">FLIX</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="font-inter text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Right Action Button */}
      <div className="hidden md:flex items-center gap-4">
        <Link href="/browse" className="font-inter text-sm font-semibold text-gray-300 hover:text-white mr-2 transition-colors">
          Browse
        </Link>
        <a
          href="https://rzp.io/rzp/roboflix"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-1.5 rounded bg-brand-red hover:bg-brand-red/90 text-white font-inter text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(229,9,20,0.35)] hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:scale-[1.02]"
        >
          Start Building →
        </a>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="absolute top-[60px] left-0 right-0 w-full bg-brand-bg/95 backdrop-blur-lg border-b border-brand-border md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col p-6 gap-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="font-inter text-base font-semibold text-gray-300 hover:text-brand-red transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px bg-brand-border my-2" />
            <Link
              href="/browse"
              onClick={() => setIsOpen(false)}
              className="font-inter text-base font-semibold text-gray-300 hover:text-brand-red transition-colors"
            >
              Browse Series
            </Link>
            <a
              href="https://rzp.io/rzp/roboflix"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded bg-brand-red text-white font-inter font-bold tracking-wide shadow-[0_0_15px_rgba(229,9,20,0.35)]"
            >
              Start Building →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
