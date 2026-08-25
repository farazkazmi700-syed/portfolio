import { motion } from "framer-motion";
import { cvData } from "../../content/cvData";
import { FiCode, FiCpu, FiPackage, FiDatabase, FiTool, FiLayers, FiZap } from "react-icons/fi";

const categoryIcons = {
  Languages: FiCode,
  'ML / AI': FiCpu,
  Libraries: FiPackage,
  Databases: FiDatabase,
  Tools: FiTool,
  Methodologies: FiLayers,
};

function CategoryIcon({ category }) {
  const Icon = categoryIcons[category] || FiZap;
  return (
    <div className="w-11 h-11 shrink-0 rounded-lg bg-ink text-accent flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
      <Icon size={20} />
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function Skills() {
  return (
    <section id="skills" className="section-padding relative">
      {/* Background accent */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none" />

      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">technical skills</span>
          <h2 className="section-title">
            <span className="t-yellow">My</span>{" "}
            <span className="t-underline">Toolkit</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto font-body">
            Technologies and tools I use to build intelligent, data-driven solutions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(cvData.skills).map(([category, skills], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: catIndex * 0.08 }}
              whileHover={{ y: -4 }}
              className="card-dark p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <CategoryIcon category={category} />
                <div>
                  <h3 className="font-display font-bold text-ink text-sm drop-shadow-sm">{category}</h3>
                  <p className="text-gray-600 text-xs font-mono">{skills.length} items</p>
                </div>
              </div>

              {/* Skills */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={itemVariants}
                    className="skill-tag text-xs"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Python highlight bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 card-dark p-6 border-primary/20"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-mono text-gray-500 mb-1">Primary Language</p>
              <p className="font-display font-bold text-ink text-lg">Python ðŸ</p>
            </div>
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs font-mono text-gray-500 w-20 text-right">Proficiency</span>
              <div className="flex-1 h-2 bg-dark-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "82%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                />
              </div>
              <span className="text-xs font-mono text-primary w-8">82%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
