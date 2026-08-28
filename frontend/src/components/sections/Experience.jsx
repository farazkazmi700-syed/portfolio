import { motion } from "framer-motion";
import { FiBriefcase } from "react-icons/fi";
import { cvData } from "../../content/cvData";

const experience = Array.isArray(cvData.experience) ? cvData.experience : [];

export default function Experience() {
  if (!experience.length) return null; // hidden until synced data exists

  return (
    <section id="experience" className="section-padding relative">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">experience</span>
          <h2 className="section-title mt-2">
            Where I've <span className="t-yellow">Worked</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative pl-6 border-l border-dark-border space-y-6">
          {experience.map((job, i) => (
            <motion.div
              key={`${job.title}-${job.company}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[1.65rem] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-white shadow-lg shadow-accent/30" />

              <div className="card-dark p-6 hover:border-accent/30 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                    <FiBriefcase size={11} />
                    {job.company || "Professional"}
                  </span>
                  <span className="text-xs font-mono text-gray-600">
                    {job.period}
                  </span>
                </div>
                <h4 className="font-display font-bold text-ink text-sm mb-1">
                  {job.title}
                </h4>
                {job.description && (
                  <p className="text-gray-500 text-sm leading-relaxed mt-2">
                    {job.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
