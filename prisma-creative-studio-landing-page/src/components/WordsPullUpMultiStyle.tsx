import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface TextSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[];
  className?: string;
  containerClassName?: string;
  staggerDelay?: number;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = ({
  segments,
  className = "",
  containerClassName = "inline-flex flex-wrap justify-center",
  staggerDelay = 0.08,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  interface FlattenedWord {
    word: string;
    className: string;
    globalIndex: number;
  }

  let globalCounter = 0;
  const flattenedWords: FlattenedWord[] = [];

  segments.forEach((seg) => {
    const words = seg.text.split(" ").filter((w) => w.length > 0);
    words.forEach((word) => {
      flattenedWords.push({
        word,
        className: seg.className || "",
        globalIndex: globalCounter++,
      });
    });
  });

  return (
    <div ref={containerRef} className={`${containerClassName} ${className}`}>
      {flattenedWords.map((item, idx) => (
        <motion.span
          key={idx}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{
            duration: 0.6,
            delay: item.globalIndex * staggerDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block mr-[0.25em] last:mr-0 py-[0.05em] ${item.className}`}
        >
          {item.word}
        </motion.span>
      ))}
    </div>
  );
};
