"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";

export default function ScrollyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Load images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const frameCount = 123; // User provided 123 frames

            const promises = Array.from({ length: frameCount }, (_, i) => {
                const img = new Image();
                const filename = `/sequence/frame_${String(i).padStart(3, "0")}.gif`;
                img.src = filename;

                return new Promise<HTMLImageElement | null>((resolve) => {
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.log(`Failed to load frame ${i}`);
                        resolve(null);
                    };
                });
            });

            const results = await Promise.all(promises);
            const finalImages = results.filter((img): img is HTMLImageElement => img !== null);

            setImages(finalImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // Update canvas
    useEffect(() => {
        if (!canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas dimensions to match window (or high res)
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener("resize", updateSize);

        const render = (index: number) => {
            const img = images[index];
            if (!img) return;

            // Object-fit: cover logic
            const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                centerShift_x,
                centerShift_y,
                img.width * ratio,
                img.height * ratio
            );
        };

        // Render initial frame
        if (images[0]) render(0);

        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const frameIndex = Math.min(
                images.length - 1,
                Math.floor(latest * (images.length - 1))
            );
            requestAnimationFrame(() => render(frameIndex));
        });

        return () => {
            window.removeEventListener("resize", updateSize);
            unsubscribe();
        };
    }, [images, scrollYProgress]);

    return (
        <div ref={containerRef} className="h-[500vh] relative bg-[#121212]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {/* Loading Indicator */}
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono z-50 bg-black">
                        LOADING SEQUENCE...
                    </div>
                )}
            </div>
        </div>
    );
}
