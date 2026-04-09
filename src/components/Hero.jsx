import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from "react-icons/fi";
import { cvData } from "../data/cvData";

const TypewriterText = () => {
  const roles = ["AI Engineer", "Python Developer", "ML Practitioner", "Data Analyst"];
  return (
    <span className="text-primary font-mono">
      {roles[0]}
    </span>
  );
};

const floatVariants = {
  initial: { y: 0 },
  animate: { y: [-8, 8, -8], transition: { repeat: Infinity, duration: 5, ease: "easeInOut" } }
};

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh">
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/3 rounded-full blur-2xl" />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="section-tag">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Available for Internships
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-4"
            >
              Hi, I'm{" "}
              <span className="gradient-text">Faraz</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-300">
                I build with{" "}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-primary font-mono">
                AI & Python
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg"
            >
              {cvData.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#projects" className="btn-primary flex items-center gap-2">
                View My Work
                <FiArrowDown />
              </a>
              <a href="#contact" className="btn-outline flex items-center gap-2">
                <FiMail size={16} />
                Get In Touch
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-4 mt-8"
            >
              <span className="text-gray-500 text-sm font-mono">connect</span>
              <div className="h-px w-8 bg-dark-border" />
              {[
                { icon: FiGithub, href: cvData.github, label: "GitHub" },
                { icon: FiLinkedin, href: cvData.linkedin, label: "LinkedIn" },
                { icon: FiMail, href: `mailto:${cvData.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all duration-200 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: Visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="relative"
            >
              {/* Avatar circle */}
              <div className="w-72 h-72 rounded-3xl bg-dark-card border border-dark-border p-1 shadow-2xl animate-pulse-glow relative overflow-hidden">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-dark-surface via-dark-card to-dark flex items-center justify-center relative overflow-hidden">
                  {/* Grid lines inside */}
                  <div className="absolute inset-0 bg-mesh opacity-40" />
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4">
                      <span className="font-display font-bold text-5xl text-primary">F</span>
                    </div>
                    <p className="font-display font-bold text-white text-xl">Faraz Kazmi</p>
                    <p className="text-primary font-mono text-sm mt-1">AI Engineer</p>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="absolute -left-12 top-8 bg-dark-card border border-dark-border rounded-xl px-3 py-2 shadow-lg"
                >
                  <span className="text-xs font-mono text-primary">🤖 ML / AI</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="absolute -right-10 bottom-12 bg-dark-card border border-dark-border rounded-xl px-3 py-2 shadow-lg"
                >
                  <span className="text-xs font-mono text-primary">🐍 Python</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-dark-card border border-primary/30 rounded-xl px-4 py-2 shadow-lg"
                >
                  <span className="text-xs font-mono text-gray-300">📍 Lahore, PK</span>
                </motion.div>
              </div>

              {/* Spinning ring */}
              <div className="absolute inset-0 -m-4 rounded-full border border-dashed border-primary/10 animate-spin-slow" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-gray-600">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 rounded-full border border-dark-border flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
