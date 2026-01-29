"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const workspaceImages = [
    {
        src: "/workspace_1.png",
        title: "COMMAND CENTER",
        category: "Where ideas take shape",
        description: "Our state-of-the-art facility designed for rapid prototyping and AI development."
    },
    {
        src: "/workspace_2.png",
        title: "THE FUTURE FORGE",
        category: "Collaborative Intelligence",
        description: "A hub of innovation where human creativity meets machine precision."
    }
];

export default function Projects() {
    return (
        <section className="relative bg-[#121212] py-40 px-6 border-t border-white/10">
            <div className="container mx-auto">
                <div className="flex items-end justify-between mb-20 divide-y divide-white/10">
                    <h2 className="text-6xl md:text-8xl font-display font-bold text-white">
                        OUR <span className="text-cyan-400">WORKSPACE</span>
                    </h2>
                    <div className="text-right text-gray-500 font-mono text-sm hidden md:block">
                        HQ: TECHCADD <br /> INDIA
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {workspaceImages.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={item.src}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                            <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-display font-medium text-white mb-2">{item.title}</h3>
                                    <p className="text-cyan-400 font-mono text-sm mb-2">{item.category}</p>
                                    <p className="text-gray-300 text-sm max-w-xs">{item.description}</p>
                                </div>
                                <Link href="/" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-cyan-400 group-hover:text-black transition-colors shrink-0">
                                    <ArrowUpRight />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
