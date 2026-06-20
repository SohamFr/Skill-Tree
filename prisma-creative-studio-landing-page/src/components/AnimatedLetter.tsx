import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface AnimatedLetterProps {
  children: React.ReactNode;
  progress: MotionValue<number>;
  index: number;
  totalChars: number;
}

export const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  children,
  progress,
  index,
  totalChars,
}) => {
  const charProgress = index / totalChars;
  const opacity = useTransform(
    progress,
    [charProgress - 0.1, charProgress + 0.05],
    [0.2, 1]
  );

  return <motion.span style={{ opacity }}>{children}</motion.span>;
};

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
  text,
  className = "",
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  // Calculate total characters excluding spaces for precise indexing
  const totalChars = words.reduce((acc, word) => acc + word.length, 0);

  let charCounter = 0;

  return (
    <p
      ref={containerRef}
      className={`leading-relaxed flex flex-wrap justify-center ${className}`}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex mr-[0.25em] last:mr-0 mb-[0.15em]">
          {word.split("").map((char, charIdx) => (
            <AnimatedLetter
              key={charIdx}
              progress={scrollYProgress}
              index={charCounter++}
              totalChars={totalChars}
            >
              {char}
            </AnimatedLetter>
          ))}
        </span>
      ))}
    </p>
  );
};
