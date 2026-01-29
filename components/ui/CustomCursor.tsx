"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        }

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-cyan pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
        >
            <motion.div
                animate={{
                    scale: isHovered ? 0.5 : 1,
                    opacity: isHovered ? 1 : 0
                }}
                className="w-1 h-1 bg-neon-cyan rounded-full"
            />
            <motion.div
                className="absolute inset-0 rounded-full bg-neon-cyan/20"
                animate={{
                    scale: isHovered ? 2.5 : 0,
                }}
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    );
}
