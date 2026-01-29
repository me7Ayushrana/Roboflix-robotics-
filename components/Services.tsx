"use client";

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { Shield, Bot, Factory, Settings, ArrowUpRight } from "lucide-react";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

const services = [
    {
        title: "Military & Defence",
        description: "Battlefield-ready autonomous systems designed for surveillance, reconnaissance, and tactical support.",
        icon: <Shield className="w-10 h-10 text-neon-cyan" />,
        color: "rgba(0, 243, 255, 1)", // Neon Cyan
        border: "group-hover:border-neon-cyan",
    },
    {
        title: "General Purpose Robots",
        description: "Versatile androids and quadrupeds capable of adapting to unstructured human environments.",
        icon: <Bot className="w-10 h-10 text-neon-purple" />,
        color: "rgba(188, 19, 254, 1)", // Neon Purple
        border: "group-hover:border-neon-purple",
    },
    {
        title: "Industrial Automation",
        description: "High-precision robotic arms and logistics fleets for 24/7 dark factory operations.",
        icon: <Factory className="w-10 h-10 text-yellow-400" />,
        color: "rgba(250, 204, 21, 1)", // Yellow
        border: "group-hover:border-yellow-400",
    },
    {
        title: "Custom Integration",
        description: "Tailored neural networks and hardware solutions for unique enterprise challenges.",
        icon: <Settings className="w-10 h-10 text-green-400" />,
        color: "rgba(74, 222, 128, 1)", // Green
        border: "group-hover:border-green-400",
    },
];

function Card({ item }: { item: typeof services[0] }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Mouse position values for the spotlight
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 500, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 500, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Create a template for the radial gradient background
    const background = useMotionTemplate`radial-gradient(
    650px circle at ${mouseX}px ${mouseY}px,
    ${item.color.replace('1)', '0.15)')},
    transparent 80%
  )`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const xPos = e.clientX - rect.left;
        const yPos = e.clientY - rect.top;

        const xPct = xPos / width - 0.5;
        const yPct = yPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);

        mouseX.set(xPos);
        mouseY.set(yPos);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="relative h-[28rem] w-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl group transition-all duration-300 overflow-hidden"
        >
            {/* Dynamic Spotlight Background */}
            <motion.div
                className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: background
                }}
            />

            {/* Glass reflection gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none mix-blend-overlay"></div>

            <div style={{ transform: "translateZ(50px)" }} className="relative z-10 flex flex-col h-full justify-between pointer-events-none p-8">
                <div>
                    <div className={cn(
                        "p-4 rounded-2xl bg-white/5 w-fit mb-6 border border-white/10 backdrop-blur-md transition-colors duration-300 shadow-lg",
                        item.border
                    )}>
                        {item.icon}
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-neon-cyan transition-colors duration-300">
                        {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base group-hover:text-gray-200 transition-colors">
                        {item.description}
                    </p>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>

                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors group-hover:translate-x-2 duration-300">
                    Explore Tech <ArrowUpRight className="w-4 h-4 text-neon-cyan" />
                </button>
            </div>

            {/* Glowing Border on Hover */}
            <div className={cn(
                "absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-300 pointer-events-none",
                item.border
            )}></div>
        </motion.div>
    );
}

export default function Services() {
    return (
        <section id="services" className="py-32 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none opacity-50"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 text-center md:text-left">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-sm font-bold text-neon-cyan uppercase tracking-widest mb-4"
                    >
                        Our Expertise
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-display font-bold text-white max-w-4xl leading-[0.9]"
                    >
                        Autonomy for <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Every Environment.</span>
                    </motion.h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
                    {services.map((item, index) => (
                        <Card key={index} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}
