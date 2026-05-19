"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";

export default function RoboflixFooter() {
  const sections = [
    {
      title: "Platform",
      links: [
        { name: "All Seasons", href: "/#seasons" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Success Stories", href: "/#community" },
        { name: "Documentation", href: "/browse" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "About Roboflix", href: "/#about" },
        { name: "Robotics Blog", href: "/#blog" },
        { name: "Community Discord", href: "https://discord.gg/roboflix" },
        { name: "Contact Us", href: "mailto:info@xair.live" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/policy" },
        { name: "Terms of Service", href: "/policy" },
        { name: "Refund Policy", href: "/policy" }
      ]
    }
  ];

  return (
    <footer className="w-full bg-black border-t border-brand-border py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
        {/* Brand Information */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link href="/browse" className="flex items-center gap-2 group w-fit">
            <div className="w-8 h-8 rounded-md bg-brand-red flex items-center justify-center text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] group-hover:scale-105 transition-transform">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bebas text-2xl tracking-wider text-brand-red">
              ROBO<span className="text-white group-hover:text-brand-red transition-colors">FLIX</span>
            </span>
          </Link>
          <p className="font-inter text-sm text-gray-400 max-w-sm leading-relaxed">
            Learn robotics like binge-watching your favorite series. Addictive. Practical. Fun.
          </p>
        </div>

        {/* Links Grid */}
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h4 className="font-bebas text-lg tracking-wider text-gray-200">
              {section.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-inter text-xs text-gray-500 hover:text-brand-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="h-px bg-brand-border my-8 max-w-7xl mx-auto" />

      {/* Copyright Info */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="font-mono text-[10px] text-gray-600">
          © 2026 Roboflix. All rights reserved. Made with passion for robotics.
        </p>
        <p className="font-mono text-[10px] text-gray-600">
          Built for builders. Level up every single month.
        </p>
      </div>
    </footer>
  );
}
