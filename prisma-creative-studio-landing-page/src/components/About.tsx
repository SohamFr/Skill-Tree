import React from "react";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";
import { ScrollRevealText } from "./AnimatedLetter";

export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="bg-black py-16 sm:py-24 md:py-32 px-4 md:px-6 w-full flex justify-center relative z-20"
    >
      <div className="bg-[#101010] w-full max-w-6xl rounded-2xl md:rounded-[2rem] p-6 sm:p-12 md:p-16 lg:p-24 flex flex-col items-center text-center border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Subtle ambient light behind the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DEDBC8]/5 blur-3xl pointer-events-none rounded-full" />

        {/* Small Top Label */}
        <span className="text-primary text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium mb-6 sm:mb-10 inline-block py-1.5 px-4 rounded-full border border-[#DEDBC8]/15 bg-[#DEDBC8]/5 shadow-inner">
          Visual arts
        </span>

        {/* Main Heading */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] mb-10 sm:mb-16 select-none">
          <WordsPullUpMultiStyle
            segments={[
              { text: "I am Marcus Chen,", className: "font-normal" },
              {
                text: "a self-taught director.",
                className: "font-serif italic text-primary px-[0.05em]",
              },
              {
                text: "I have skills in color grading, visual effects, and narrative design.",
                className: "font-normal",
              },
            ]}
          />
        </div>

        {/* Scroll Reveal Body Paragraph */}
        <div className="max-w-2xl mx-auto px-2">
          <ScrollRevealText
            text="Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals."
            className="text-primary text-xs sm:text-sm md:text-base font-light tracking-wide"
          />
        </div>
      </div>
    </section>
  );
};
