"use client";

import { useState, useEffect, useRef } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

export default function GlitchText({ text, className }: { text: string, className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        let iteration = 0;
        clearInterval(intervalRef.current as NodeJS.Timeout);

        intervalRef.current = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
            }

            iteration += 1 / 3;
        }, 30);
    };

    useEffect(() => {
        scramble();
    }, []);

    return (
        <span
            className={className}
            onMouseEnter={scramble}
            style={{ cursor: "default" }}
        >
            {displayText}
        </span>
    );
}
