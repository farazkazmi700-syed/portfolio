import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";
import { cvData } from "../../content/cvData";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center font-display font-bold text-ink text-sm">
              F
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm tracking-wide">Muhammad Faraz Kazmi</p>
              <p className="text-white/60 text-xs font-body">AI Engineer & Python Developer</p>
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-wrap justify-center gap-5">
            {["#about", "#skills", "#projects", "#education", "#contact"].map((href) => (
              <a
                key={href}
                href={href}
                className="text-white/70 hover:text-accent transition-colors text-xs font-body capitalize"
              >
                {href.replace("#", "")}
              </a>
            ))}
          </div>

          {/* Social — Joyseno circular buttons */}
          <div className="flex items-center gap-3">
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
                className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-cream hover:text-ink transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60 text-xs font-body flex items-center justify-center gap-1.5">
            © {year} Muhammad Faraz Kazmi. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
