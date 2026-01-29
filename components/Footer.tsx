"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="relative bg-black pt-32 pb-10 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
                    <div>
                        <h2 className="text-8xl md:text-9xl font-display font-black text-white tracking-tighter mb-6 leading-[0.8]">
                            LET'S <br /> BUILD <span className="text-neon-cyan">FUTURE.</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 text-right">
                        <button className="px-8 py-4 bg-white text-black font-bold font-display uppercase tracking-widest hover:bg-neon-cyan transition-colors">
                            Start Project
                        </button>
                        <a href="mailto:hello@xair.ai" className="text-gray-400 hover:text-white transition-colors">
                            hello@xair.ai
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/10 pt-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 font-display font-bold text-2xl text-white mb-6">
                            <Cpu className="text-neon-cyan" /> XAIR
                        </Link>
                        <p className="text-gray-500 max-w-sm">
                            Pioneering the next generation of autonomous infrastructure.
                            Silicon Valley, CA.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Sitemap</h4>
                        <ul className="space-y-2 text-gray-500">
                            <li><Link href="#" className="hover:text-neon-cyan transition-colors">Home</Link></li>
                            <li><Link href="#services" className="hover:text-neon-cyan transition-colors">Capabilities</Link></li>
                            <li><Link href="#research" className="hover:text-neon-cyan transition-colors">Research</Link></li>
                            <li><Link href="#contact" className="hover:text-neon-cyan transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Socials</h4>
                        <ul className="space-y-2 text-gray-500">
                            <li><a href="#" className="hover:text-neon-purple transition-colors">Twitter / X</a></li>
                            <li><a href="#" className="hover:text-neon-purple transition-colors">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-neon-purple transition-colors">GitHub</a></li>
                            <li><a href="#" className="hover:text-neon-purple transition-colors">Discord</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 flex justify-between items-center text-xs text-gray-600 uppercase tracking-widest font-mono">
                    <p>&copy; 2024 X AI Robotics Inc.</p>
                    <p>Designed by Antigravity</p>
                </div>
            </div>
        </footer>
    );
}
