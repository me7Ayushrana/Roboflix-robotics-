import type { Metadata } from "next";
import { Orbitron, Rajdhani, Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ROBOFLIX",
  description: "Learn robotics Netflix-style. Dive into our curriculum from ground zero basics up to autonomous navigation and multi-joint robotic limbs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${bebasNeue.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
