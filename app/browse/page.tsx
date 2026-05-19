"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import RoboflixNavbar from "@/components/RoboflixNavbar";
import RoboflixFooter from "@/components/RoboflixFooter";
import { SEASONS_DATA, CONTINUE_WATCHING_DATA, Season } from "@/lib/roboflix-data";

export default function BrowsePage() {
  const [filter, setFilter] = useState<string>("ALL");

  const filterPills = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "HARDWARE", "SOFTWARE"];

  const filteredSeasons = useMemo(() => {
    if (filter === "ALL") return SEASONS_DATA;
    return SEASONS_DATA.filter((season) => {
      if (filter === "BEGINNER" || filter === "INTERMEDIATE" || filter === "ADVANCED") {
        return season.difficulty === filter;
      }
      if (filter === "HARDWARE") {
        return season.category === "HARDWARE" || season.category === "BOTH";
      }
      if (filter === "SOFTWARE") {
        return season.category === "SOFTWARE" || season.category === "BOTH";
      }
      return true;
    });
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-premium-grid bg-radial-glow text-white flex flex-col font-inter relative overflow-hidden">
      {/* Sticky Header Nav */}
      <RoboflixNavbar />

      {/* Main Browse Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-10 relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-brand-red uppercase">
              // ALL SEASONS
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
            </span>
            <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">
              Curriculum Core Live
            </span>
          </div>
          <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-white">
            BROWSE SERIES
          </h1>
          <p className="font-inter text-sm text-gray-400 max-w-2xl leading-relaxed mt-1">
            Learn robotics Netflix-style. Dive into our curriculum from ground zero basics up to autonomous navigation and multi-joint robotic limbs. Tap on any series to start watching.
          </p>
        </div>

        {/* Filter Pill Bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-brand-border pb-6">
          {filterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setFilter(pill)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                filter === pill
                  ? "bg-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] border border-transparent"
                  : "bg-[#141414] hover:bg-[#1a1a1a] text-gray-400 hover:text-white border border-brand-border"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Series Thumbnail Grid */}
        <div className="flex flex-col gap-4">
          <h2 className="font-bebas text-2xl tracking-wider text-gray-200">
            ALL ACTIVE RUNS ({filteredSeasons.length})
          </h2>
          {filteredSeasons.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center border border-brand-border rounded bg-brand-card text-gray-500 font-mono text-sm">
              No series match this filter. Please try another category.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredSeasons.map((season) => (
                <Link
                  key={season.id}
                  href={`/watch/${season.id}`}
                  className="group relative flex flex-col bg-brand-card rounded-md border border-brand-border overflow-hidden hover:border-brand-red/50 hover:shadow-[0_0_25px_rgba(229,9,20,0.25)] hover:scale-[1.04] transition-all duration-300 cursor-pointer animate-shine-hover"
                >
                  {/* Poster Image Container (2:3 Aspect Ratio) */}
                  <div className="relative w-full aspect-[2/3] bg-black overflow-hidden select-none">
                    <img
                      src={season.posterUrl}
                      alt={season.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />

                    {/* S1 Origin Badge Left */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-brand-red text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
                      {season.badge}
                    </div>

                    {/* Status Badge Right */}
                    <div className={`absolute top-3 right-3 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider shadow-[0_2px_5px_rgba(0,0,0,0.5)] ${
                      season.status === "LIVE NOW" 
                        ? "bg-green-600 text-white animate-pulse" 
                        : "bg-yellow-600 text-white"
                    }`}>
                      {season.status}
                    </div>

                    {/* Hover Overlay showing Play + Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      {/* Centered Play Button */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-2 border-brand-red bg-black/60 flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-brand-red ml-0.5" />
                        </div>
                      </div>

                      {/* Overlaid Title & Ep count info */}
                      <div className="flex flex-col gap-1">
                        <span className="font-bebas text-xl tracking-wide text-white uppercase line-clamp-1">
                          {season.title}
                        </span>
                        <span className="font-mono text-[10px] text-brand-red">
                          {season.episodesCount} EPISODES
                        </span>
                      </div>
                    </div>

                    {/* Red progress bar at bottom of poster image representing watched state */}
                    {season.progressPercent !== undefined && season.progressPercent > 0 && (
                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-800">
                        <div
                          className="h-full bg-brand-red shadow-[0_0_8px_#e50914]"
                          style={{ width: `${season.progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Card Footer Info */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-bebas text-lg tracking-wide text-white group-hover:text-brand-red transition-colors line-clamp-1">
                        SEASON {season.seasonNumber} — {season.title}
                      </h3>
                      <p className="font-mono text-[10px] text-gray-500">
                        {season.episodesCount} Episodes · {season.difficulty}
                      </p>
                    </div>

                    {/* Tag Chips */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {season.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded-sm bg-[#181818] border border-brand-border font-mono text-[8px] text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {season.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-[#181818] border border-brand-border font-mono text-[8px] text-gray-500">
                          +{season.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Continue Watching Section */}
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="font-bebas text-2xl tracking-wider text-gray-200">
            CONTINUE WATCHING
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {CONTINUE_WATCHING_DATA.map((item) => (
              <Link
                key={item.episodeId}
                href={`/watch/${item.seasonId}`}
                className="group relative flex flex-col bg-brand-card rounded-md border border-brand-border overflow-hidden hover:border-brand-red/50 hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] hover:scale-[1.03] transition-all duration-300 cursor-pointer animate-shine-hover"
              >
                {/* Thumbnail Image Container (16:9 Aspect Ratio) */}
                <div className="relative w-full aspect-[16/9] bg-black overflow-hidden select-none">
                  {/* Backdrop representation image or poster */}
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Red absolute overlay with emoji representation */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                    <span className="text-4xl filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border border-brand-red bg-black/60 flex items-center justify-center text-brand-red">
                      <Play className="w-4 h-4 fill-brand-red ml-0.5" />
                    </div>
                  </div>

                  {/* Red progress bar at bottom of 16:9 representing resume watching */}
                  <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gray-800">
                    <div
                      className="h-full bg-brand-red shadow-[0_0_8px_#e50914]"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Footer Details */}
                <div className="p-4 flex flex-col gap-1 justify-between flex-1">
                  <div>
                    <h3 className="font-bebas text-base tracking-wide text-white group-hover:text-brand-red transition-colors line-clamp-1">
                      S{item.seasonNumber}:E{item.episodeNumber} — {item.title}
                    </h3>
                    <p className="font-mono text-[10px] text-gray-500 uppercase mt-0.5">
                      {item.seasonTitle} · {item.duration}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-mono text-[9px] text-brand-red font-semibold">
                      {item.progressPercent}% WATCHED
                    </span>
                    <span className="font-mono text-[9px] text-gray-500">
                      {item.durationLeft}
                    </span>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        </div>

      </main>

      {/* Dark Footer style matching roboflix */}
      <RoboflixFooter />
    </div>
  );
}
