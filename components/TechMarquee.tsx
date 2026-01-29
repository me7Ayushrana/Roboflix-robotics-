"use client";

import { motion } from "framer-motion";

const technologies = [
    "Deep Learning", "Neural Networks", "Computer Vision", "Reinforcement Learning", "Edge Computing",
    "React Three Fiber", "TensorFlow", "PyTorch", "ROS 2", "CUDA", "WebGL", "Next.js", "TailwindCSS"
];

export default function TechMarquee() {
    return (
        <div className="relative flex overflow-hidden py-10 bg-black border-y border-glass-border">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>

            <motion.div
                className="flex whitespace-nowrap gap-16"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear",
                    repeatType: "loop"
                }}
            >
                {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                    <span
                        key={index}
                        className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 uppercase tracking-tighter hover:from-neon-cyan hover:to-white transition-colors duration-300 cursor-default"
                    >
                        {tech}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
