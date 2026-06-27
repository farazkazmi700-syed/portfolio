import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { cvData } from "../../content/cvData";

const categories = ["Machine Learning Models", "Generative AI", "Computer Vision", "NLP & Chatbots", "All"];

export default function Projects() {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? cvData.projects
    : cvData.projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-tag">// projects</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white drop-shadow-lg mt-2">
            What I've <span className="gradient-text">Built</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto font-body">
            Real-world ML and AI projects demonstrating applied skills in Artificial Intelligence and intelligent systems.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-mono transition-all duration-200 ${
                active === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="card-dark p-6 flex flex-col group hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-3xl group-hover:bg-primary/10 transition-colors" />

                {/* Category badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/40 transition-all"
                      aria-label="GitHub"
                    >
                      <FiGithub size={14} />
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/40 transition-all"
                      aria-label="View Project"
                    >
                      <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <h3 className="font-display font-bold text-white text-base drop-shadow-sm mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono bg-dark text-gray-500 border border-dark-border px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href={cvData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-outline"
          >
            <FiGithub size={16} />
            View All Projects on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
