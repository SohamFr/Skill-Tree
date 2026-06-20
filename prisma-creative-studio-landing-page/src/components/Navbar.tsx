import React, { useState } from "react";
import { motion } from "framer-motion";

export const Navbar: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    { name: "Analyzer", href: "#analyzer" },
    { name: "Deployments", href: "#deployments" },
    { name: "Ledger", href: "#ledger" },
    { name: "Leaderboard", href: "#leaderboard" },
    { name: "Get Started", href: "#get-started" },
  ];

  const logo = (
    <span className="font-mono text-[9px] sm:text-xs text-[#DEDBC8] flex items-center gap-1.5 mr-4">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
      SkillTree
    </span>
  );

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-black rounded-b-2xl md:rounded-b-3xl px-3 py-2 sm:px-6 sm:py-3 md:px-9 md:py-4 flex items-center gap-2 sm:gap-4 md:gap-10 lg:gap-14 border-b border-x border-[#DEDBC8]/15 shadow-2xl backdrop-blur-md bg-black/95"
      >
        {logo}
        {navItems.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <a
              key={idx}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="text-[10px] sm:text-xs md:text-sm font-medium tracking-wide uppercase transition-all duration-300 relative py-1"
              style={{
                color: isHovered ? "#E1E0CC" : "rgba(225, 224, 204, 0.8)",
              }}
            >
              {item.name}
              {isHovered && (
                <motion.span
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#E1E0CC]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </motion.div>
    </header>
  );
};
