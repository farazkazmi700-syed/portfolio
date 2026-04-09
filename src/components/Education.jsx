import { motion } from "framer-motion";
import { cvData } from "../data/cvData";

export default function Education() {
  return (
    <section id="education" className="section-padding relative">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">// education & certs</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2">
            My <span className="gradient-text">Background</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display font-bold text-white text-lg mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-sm">🎓</span>
              Education
            </motion.h3>

            <div className="relative pl-6 border-l border-dark-border space-y-6">
              {cvData.education.map((edu, i) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[1.65rem] top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-dark shadow-lg shadow-primary/40" />

                  <div className="card-dark p-6 hover:border-primary/30 transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                        {edu.status}
                      </span>
                      <span className="text-xs font-mono text-gray-600">{edu.period}</span>
                    </div>
                    <h4 className="font-display font-bold text-white text-sm mb-1">{edu.degree}</h4>
                    <p className="text-gray-500 text-sm">{edu.institution}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display font-bold text-white text-lg mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-sm">🏆</span>
              Certifications
            </motion.h3>

            <div className="relative pl-6 border-l border-dark-border space-y-6">
              {cvData.certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-[1.65rem] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-dark shadow-lg shadow-accent/40" />

                  <div className="card-dark p-6 hover:border-accent/30 transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                        Certified
                      </span>
                      <span className="text-xs font-mono text-gray-600">{cert.period}</span>
                    </div>
                    <h4 className="font-display font-bold text-white text-sm mb-1">{cert.name}</h4>
                    <p className="text-gray-500 text-sm">{cert.issuer}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Currently learning card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 card-dark p-6 border-dashed border-primary/20 bg-primary/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-mono text-primary">Currently Exploring</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Deep Learning", "LangChain", "Transformers", "FastAPI", "Docker"].map((item) => (
                  <span key={item} className="text-xs font-mono bg-dark border border-dark-border text-gray-400 px-2.5 py-1 rounded-lg">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
