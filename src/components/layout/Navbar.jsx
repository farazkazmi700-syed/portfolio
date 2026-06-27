import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { cvData } from "../../content/cvData";

const resumePath = "/assets/documents/Muhammad_Faraz_ATS_Resume.pdf";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-dark/90 backdrop-blur-xl border-b border-dark-border shadow-xl shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-display font-bold text-white text-sm drop-shadow-md group-hover:scale-110 transition-transform">
                F
              </div>
              <span className="font-display font-bold text-white text-lg hidden sm:block drop-shadow-lg">
                Faraz<span className="text-primary">.</span>
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={`relative px-4 py-2 text-sm font-body font-medium rounded-lg transition-all duration-200 ${
                    active === link.label
                      ? "text-primary"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <a
                href={resumePath}
                download="Muhammad_Faraz_ATS_Resume.pdf"
                className="hidden sm:inline-flex btn-primary min-h-10 items-center gap-2 px-4 py-2 text-sm"
                aria-label="Download Muhammad Faraz ATS resume"
              >
                <FiDownload className="h-4 w-4 shrink-0" aria-hidden="true" />
                Resume
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-surface transition-all"
              >
                {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-dark-card border-b border-dark-border shadow-2xl md:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => { setActive(link.label); setMenuOpen(false); }}
                  className="py-3 px-4 text-white/90 hover:text-primary hover:bg-dark-surface rounded-xl transition-all font-body"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={resumePath}
                download="Muhammad_Faraz_ATS_Resume.pdf"
                className="btn-primary mt-2 inline-flex items-center justify-center gap-2 text-center"
                aria-label="Download Muhammad Faraz ATS resume"
              >
                <FiDownload className="h-4 w-4 shrink-0" aria-hidden="true" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
