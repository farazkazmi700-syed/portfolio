import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";
import { cvData } from "../../content/cvData";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-border bg-dark-card">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-display font-bold text-white text-sm">
              F
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm drop-shadow-md">Muhammad Faraz Kazmi</p>
              <p className="text-white/80 text-xs font-mono drop-shadow-sm">AI Engineer & Python Developer</p>
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-wrap justify-center gap-4">
            {["#about", "#skills", "#projects", "#education", "#contact"].map((href) => (
              <a
                key={href}
                href={href}
                className="text-gray-500 hover:text-primary transition-colors text-xs font-mono capitalize"
              >
                {href.replace("#", "")}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {[
              { icon: FiGithub, href: cvData.github },
              { icon: FiLinkedin, href: cvData.linkedin },
              { icon: FiMail, href: `mailto:${cvData.email}` },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-border text-center">
          <p className="text-white/70 text-xs font-mono flex items-center justify-center gap-1.5 drop-shadow-sm">
            © {year} Muhammad Faraz Kazmi
          </p>
        </div>
      </div>
    </footer>
  );
}
