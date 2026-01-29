"use client";

import { motion } from "framer-motion";

export default function ContactForm() {
    return (
        <section id="contact" className="py-32 bg-black relative border-t border-white/10">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-neon-cyan uppercase tracking-widest mb-4">Get in Touch</h2>
                    <h3 className="text-5xl md:text-6xl font-display font-bold text-white">
                        Start the <span className="italic font-light text-gray-400">Collaboration</span>
                    </h3>
                </div>

                <form className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-transparent peer"
                            />
                            <label className="absolute left-0 top-4 text-gray-500 text-xl transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-neon-cyan peer-placeholder-shown:top-4 peer-placeholder-shown:text-xl">
                                Name
                            </label>
                        </div>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-transparent peer"
                            />
                            <label className="absolute left-0 top-4 text-gray-500 text-xl transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-neon-cyan peer-placeholder-shown:top-4 peer-placeholder-shown:text-xl">
                                Email
                            </label>
                        </div>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Company"
                            className="w-full bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-transparent peer"
                        />
                        <label className="absolute left-0 top-4 text-gray-500 text-xl transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-neon-cyan peer-placeholder-shown:top-4 peer-placeholder-shown:text-xl">
                            Company / Organization
                        </label>
                    </div>

                    <div className="relative group">
                        <textarea
                            rows={4}
                            placeholder="Message"
                            className="w-full bg-transparent border-b border-white/20 py-4 text-white text-xl focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-transparent peer resize-none"
                        ></textarea>
                        <label className="absolute left-0 top-4 text-gray-500 text-xl transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-neon-cyan peer-placeholder-shown:top-4 peer-placeholder-shown:text-xl">
                            Message
                        </label>
                    </div>

                    <div className="flex justify-end pt-8">
                        <button className="px-10 py-4 bg-white text-black font-bold font-display uppercase tracking-widest hover:bg-neon-cyan transition-all hover:scale-105">
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
