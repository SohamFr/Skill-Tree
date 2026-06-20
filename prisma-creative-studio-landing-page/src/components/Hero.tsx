import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "./Navbar";
import { WordsPullUp } from "./WordsPullUp";

export const Hero: React.FC = () => {
  const handleJoinLab = () => {
    const target = document.querySelector("#analyzer");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[100svh] p-3 sm:p-4 md:p-6 bg-black flex flex-col justify-between">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col justify-between border border-white/5 shadow-2xl touch-none">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />

        {/* Noise Overlay */}
        <div className="noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none z-10" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none z-10" />

        <Navbar />

        {/* Bottom Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 z-30">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            {/* LEFT — Large Heading anchored to bottom-left */}
            <div className="flex flex-col gap-4">
              <WordsPullUp
                text="SkillTree"
                showAsterisk={true}
                className="text-[18vw] sm:text-[16vw] md:text-[13vw] lg:text-[11vw] xl:text-[10vw] font-medium leading-[0.85] tracking-[-0.07em]"
              />
            </div>

            {/* RIGHT — Description, button, pills stacked vertically */}
            <div className="flex flex-col items-start lg:items-end gap-4 lg:pb-2 lg:max-w-xs xl:max-w-sm">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-primary/70 text-xs sm:text-sm leading-relaxed font-light lg:text-right"
              >
                SkillTree verifies real developer skills through repositories,
                commits, and live deployments — not resumes.
              </motion.p>

              <motion.button
                onClick={handleJoinLab}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center justify-between gap-3 hover:gap-4 bg-primary text-black font-semibold text-sm py-1.5 pl-6 pr-1.5 rounded-full transition-all duration-300 shadow-xl cursor-pointer"
              >
                <span>Analyze My GitHub</span>
                <div className="bg-black rounded-full w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <ArrowRight className="w-4 h-4 text-[#E1E0CC]" />
                </div>
              </motion.button>

              {/* Stat pills */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-2"
              >
                {["10K+ Repos Analyzed", "99% Accuracy", "Real-time Verified"].map((pill) => (
                  <span
                    key={pill}
                    className="bg-white/10 border border-white/10 text-[10px] px-3 py-1 rounded-full text-[#DEDBC8]/70 font-mono backdrop-blur-sm"
                  >
                    {pill}
                  </span>
                ))}
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
