import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

interface FeatureCardData {
  id: string;
  number: string;
  title: string;
  icon: string;
  items: string[];
}

export const Features: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });

  const featureCards: FeatureCardData[] = [
    {
      id: "storyboard",
      number: "01",
      title: "Project Storyboard.",
      icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85",
      items: [
        "Cinematic visual timeline",
        "Real-time sequence asset syncing",
        "Multi-angle shot organization",
        "Editorial pacing annotations",
      ],
    },
    {
      id: "critiques",
      number: "02",
      title: "Smart Critiques.",
      icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85",
      items: [
        "Automated AI lighting & color analysis",
        "Timestamped creative audio/visual notes",
        "Direct NLE & grading tool integrations",
      ],
    },
    {
      id: "immersion",
      number: "03",
      title: "Immersion Capsule.",
      icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85",
      items: [
        "Pure focus notification silencing",
        "Engineered ambient soundscapes",
        "Automated studio schedule syncing",
      ],
    },
  ];

  const handleLearnMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const footer = document.querySelector("#footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="features"
      className="relative min-h-screen bg-black py-20 sm:py-28 md:py-36 px-4 md:px-8 w-full flex flex-col justify-center overflow-hidden"
    >
      {/* Background Noise Overlay */}
      <div className="bg-noise opacity-[0.15] pointer-events-none z-0" />

      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-gradient-to-b from-[#DEDBC8]/5 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header Text */}
        <div className="mb-16 sm:mb-24 text-center max-w-4xl mx-auto px-2 select-none flex flex-col items-center gap-2">
          <WordsPullUpMultiStyle
            segments={[
              {
                text: "Studio-grade workflows for visionary creators.",
                className: "text-[#DEDBC8]",
              },
            ]}
            containerClassName="inline-flex flex-wrap justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal"
          />
          <WordsPullUpMultiStyle
            segments={[
              {
                text: "Built for pure vision. Powered by art.",
                className: "text-gray-500",
              },
            ]}
            containerClassName="inline-flex flex-wrap justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal"
            staggerDelay={0.05}
          />
        </div>

        {/* 4-Column Card Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3 md:gap-2 lg:gap-1 items-stretch"
        >
          {/* Card 1: Video Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.8,
              delay: 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative w-full lg:h-[480px] min-h-[420px] rounded-2xl overflow-hidden flex flex-col justify-end p-6 md:p-8 border border-white/10 shadow-2xl bg-[#181818]"
          >
            {/* Background Video */}
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Darkening for Readable Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium bg-black/60 text-[#DEDBC8] border border-white/10 backdrop-blur-md">
                  Core Lab
                </span>
                <span className="w-2 h-2 rounded-full bg-[#DEDBC8] animate-pulse" />
              </div>

              <div className="mt-auto">
                <p className="text-xs font-mono text-[#DEDBC8]/60 tracking-widest uppercase mb-2">
                  Prisma Engine
                </p>
                <h3
                  className="text-2xl sm:text-3xl font-medium tracking-tight"
                  style={{ color: "#E1E0CC" }}
                >
                  Your creative canvas.
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Cards 2, 3, 4: Standard Features */}
          {featureCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
              }
              transition={{
                duration: 0.8,
                delay: (idx + 1) * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative w-full lg:h-[480px] min-h-[420px] rounded-2xl bg-[#212121] p-6 sm:p-7 flex flex-col justify-between border border-white/5 shadow-xl transition-all duration-300 hover:bg-[#252525] hover:border-[#DEDBC8]/20"
            >
              {/* Subtle top-right glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEDBC8]/5 blur-2xl rounded-full pointer-events-none" />

              <div>
                {/* Top Bar with Icon and Number */}
                <div className="flex items-start justify-between mb-8">
                  <div className="p-3 bg-black/50 rounded-xl border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={card.icon}
                      alt={card.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                  </div>
                  <span className="text-xs font-mono text-[#DEDBC8]/40 tracking-wider">
                    {card.number}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-lg sm:text-xl font-semibold mb-6 text-[#E1E0CC] tracking-tight">
                  {card.title}
                </h4>

                {/* Checklist */}
                <ul className="space-y-3 mb-6">
                  {card.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-400"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                      <span className="leading-snug font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Learn More Link */}
              <div className="pt-5 border-t border-white/5 mt-auto flex items-center justify-between">
                <a
                  href="#inquiries"
                  onClick={handleLearnMore}
                  className="group/btn inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#DEDBC8] hover:text-[#E1E0CC] transition-colors cursor-pointer"
                >
                  <span>Learn more</span>
                  <div className="p-1 rounded-full bg-white/5 group-hover/btn:bg-white/15 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg] transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-[#E1E0CC]" />
                  </div>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
