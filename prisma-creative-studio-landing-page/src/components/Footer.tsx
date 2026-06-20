import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Footer: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 5000);
    }
  };

  return (
    <footer
      id="get-started"
      className="bg-black text-[#DEDBC8] pt-24 pb-12 px-4 md:px-12 border-t border-white/5 relative overflow-hidden"
    >
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 relative z-10">
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-[#DEDBC8]/60 inline-block mb-6">
              Get Early Access
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[0.95] mb-8 text-[#E1E0CC]">
              Start proving your skills today.
            </h2>
            <p className="text-gray-400 font-light text-sm sm:text-base max-w-md leading-relaxed mb-12">
              Connect your GitHub, verify your deployments, and let your commits speak louder than any resume.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs sm:text-sm">
            <div>
              <h4 className="font-mono text-gray-500 uppercase tracking-widest mb-3">
                Community
              </h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-gray-300 hover:text-[#E1E0CC] transition-colors">
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-[#E1E0CC] transition-colors">
                    Twitter/X ↗
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-[#E1E0CC] transition-colors">
                    Discord ↗
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-gray-500 uppercase tracking-widest mb-3">
                Legal
              </h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-gray-300 hover:text-[#E1E0CC] transition-colors">
                    Privacy Policy ↗
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-[#E1E0CC] transition-colors">
                    Terms of Service ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-[#101010] p-8 sm:p-10 rounded-2xl md:rounded-3xl border border-white/5 shadow-2xl relative">
            <h3 className="text-xl sm:text-2xl font-medium mb-8 text-[#E1E0CC]">
              Join the Waitlist
            </h3>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center"
              >
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 text-2xl">
                  ✓
                </div>
                <h4 className="text-2xl font-medium mb-3 text-[#E1E0CC]">
                  You're on the list.
                </h4>
                <p className="text-sm text-gray-400 font-light max-w-sm mx-auto">
                  We'll notify you when Skill Tree launches.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">
                    Your Name / GitHub Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marcus Chen"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@skilltree.dev"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="What are you building? Tell us about your stack."
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-black font-semibold text-sm sm:text-base py-3.5 px-8 rounded-xl transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <span>Join the Waitlist</span>
                  <ArrowRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-mono">
        <div>SKILLTREE © 2026</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-gray-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            Terms
          </a>
        </div>
        <div>BUILT FOR BUILDERS. POWERED BY PROOF.</div>
      </div>
    </footer>
  );
};
