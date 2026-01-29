"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Robotics", href: "#robotics" },
    { name: "Services", href: "#services" },
    { name: "Research", href: "#research" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6">
            {/* Desktop Nav */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden md:flex items-center gap-2 px-3 py-3 rounded-full border border-glass-border bg-glass-bg backdrop-blur-md shadow-2xl shadow-cyan-500/10"
            >
                <Link href="/" className="flex items-center gap-2 px-4 font-display font-bold text-xl tracking-wider text-white mr-4">
                    <Cpu className="text-neon-cyan w-6 h-6 animate-pulse" />
                    XAIR
                </Link>

                {navItems.map((item, index) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-white text-gray-400"
                    >
                        {hoveredIndex === index && (
                            <motion.div
                                layoutId="nav-hover"
                                className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {item.name}
                    </Link>
                ))}

                <button className="ml-4 px-6 py-2 rounded-full bg-neon-cyan text-black font-bold font-display hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]">
                    Get Started
                </button>
            </motion.nav>

            {/* Mobile Nav */}
            <div className="md:hidden flex justify-between w-full px-6">
                <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-white">
                    <Cpu className="text-neon-cyan" /> XAIR
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="absolute top-20 left-4 right-4 bg-black/90 backdrop-blur-xl border border-glass-border rounded-2xl overflow-hidden md:hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-gray-300 hover:text-neon-cyan transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
