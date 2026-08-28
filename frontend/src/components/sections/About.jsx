import { motion } from "framer-motion";
import { FiMapPin, FiMail, FiPhone, FiGithub, FiLinkedin } from "react-icons/fi";
import { cvData } from "../../content/cvData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const stats = [
  { value: "3+", label: "ML Projects" },
  { value: "2+", label: "Certifications" },
  { value: "AI", label: "Specialization" },
  { value: "BSCS", label: "Degree in Computer Science" },
];

export default function About() {
  return (
    <section id="about" className="section-padding relative">
      <div className="container-max">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="section-tag">about me</span>
          <h2 className="section-title">
            <span className="t-yellow">Who Am</span>{" "}
            <span className="t-underline">I?</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Bio */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={1}
          >
            <div className="card-dark p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
              <h3 className="font-display font-bold text-xl text-ink mb-4">
                Passionate about Building <span className="text-primary">Intelligent Systems</span>
              </h3>
              <p className="text-muted leading-relaxed mb-4">
                I'm an aspiring AI Engineer currently pursuing a BS in Computer Science with a specialization in Artificial Intelligence at Virtual University of Pakistan.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                My journey started with Python and expanded into the fascinating world of Machine Learning, Deep Learning, and NLP. 
              </p>
              <p className="text-muted leading-relaxed mb-8">
                I'm currently open to <span className="text-primary font-medium">Remote Work opportunities</span> where I can grow, contribute, and apply AI to solve meaningful problems.
              </p>

              {/* Contact info */}
              <div className="space-y-3">
                {[
                  { icon: FiMapPin, text: cvData.location },
                  { icon: FiMail, text: cvData.email, href: `mailto:${cvData.email}` },
                  { icon: FiPhone, text: cvData.phone },
                ].map(({ icon: Icon, text, href }) => (
                  <div key={text} className="flex items-center gap-3 text-muted">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-primary" />
                    </div>
                    {href ? (
                      <a href={href} className="hover:text-primary transition-colors text-sm">{text}</a>
                    ) : (
                      <span className="text-sm">{text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-dark-border">
                <a href={cvData.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors font-mono">
                  <FiGithub /> GitHub
                </a>
                <a href={cvData.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors font-mono">
                  <FiLinkedin /> LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Stats + Soft Skills */}
          <div className="space-y-6">
            {/* Stats grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={2}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.04, borderColor: "rgba(250,126,35,0.5)" }}
                  className="card-dark p-5 text-center hover:border-primary/40 transition-all cursor-default"
                >
                  <div className="font-display font-bold text-3xl text-primary mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm font-body">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Soft skills */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={4}
              className="card-dark p-6"
            >
              <h4 className="font-display font-semibold text-ink text-sm mb-4">Soft Skills</h4>
              <div className="flex flex-wrap gap-2">
                {cvData.softSkills.map((skill) => (
                  <span key={skill} className="text-xs font-mono bg-dark-surface border border-dark-border text-muted px-3 py-1 rounded-full hover:text-primary hover:border-primary/40 transition-all">
                    {skill}
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
