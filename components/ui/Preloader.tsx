"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => {
                const next = prev + Math.floor(Math.random() * 5) + 1;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsLoading(false), 800);
                    return 100;
                }
                return next;
            });
        }, 40);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black text-white overflow-hidden"
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <Cpu className="w-12 h-12 text-neon-cyan animate-pulse" />
                        <h1 className="text-4xl font-display font-bold tracking-widest">
                            XAIR <span className="text-neon-cyan">SYSTEMS</span>
                        </h1>
                    </div>

                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-neon-cyan"
                            style={{ width: `${counter}%` }}
                        />
                    </div>

                    <div className="mt-4 font-mono text-neon-cyan text-sm tracking-widest">
                        INITIALIZING CORE... {counter}%
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        className="absolute bottom-10 text-xs font-mono uppercase tracking-[0.3em] text-white"
                    >
                        Secure Connection Established
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
