"use client";

import ScrollyCanvas from "@/components/immersive/ScrollyCanvas";
import Overlay from "@/components/immersive/Overlay";
import Projects from "@/components/immersive/Projects";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

export default function ImmersivePage() {
    return (
        <main className="bg-[#121212] min-h-screen">
            <SmoothScroll />
            <CustomCursor />

            {/* Scroll Sequence Container */}
            <div className="relative">
                <ScrollyCanvas />
                <Overlay />
            </div>

            {/* Content Below */}
            <Projects />
        </main>
    );
}
