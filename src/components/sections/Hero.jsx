import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from "react-icons/fi";
import { cvData } from "../../content/cvData";

const TypewriterText = () => {
  const roles = ["AI Engineer", "Python Developer"];
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

          {/* Right: Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:flex justify-center"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="relative"
            >
              <div className="relative h-[20rem] w-[16rem] md:h-[22rem] md:w-[18rem] lg:h-[26rem] lg:w-[21rem] overflow-hidden rounded-3xl border border-primary/20 bg-dark-card shadow-2xl shadow-primary/10 animate-pulse-glow">
                <img
                  src="/assets/images/faraz-profile.jpg"
                  alt="Muhammad Faraz Kazmi"
                  className="h-full w-full object-cover object-[50%_28%] saturate-110 contrast-110 brightness-90"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/6 to-primary/6" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_22%,transparent_0%,transparent_42%,rgba(0,0,0,0.62)_100%)] opacity-20" />
                <div className="absolute inset-x-5 bottom-5">
                  <p className="font-display text-2xl font-bold text-white drop-shadow-lg">
                    Faraz Kazmi
                  </p>
                  <p className="mt-1 font-mono text-sm text-primary">
                    AI Engineer & Python Developer
                  </p>
                </div>
              </div>

              {/* Spinning ring */}
              <div className="absolute inset-0 -m-4 rounded-[2rem] border border-dashed border-primary/10 animate-spin-slow" />
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
