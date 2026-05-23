import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiPhone } from "react-icons/fi";
import { cvData } from "../../content/cvData";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate send — swap with EmailJS / Formspree for real email
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus(null), 4000);
    }, 1200);
  };

  const inputClass =
    "w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-gray-300 placeholder-gray-600 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">// contact</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto font-body">
            Open to internship opportunities, collaborations, and AI projects. Drop me a message!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info — left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-5"
          >
            {[
              { icon: FiMail, label: "Email", value: cvData.email, href: `mailto:${cvData.email}` },
              { icon: FiPhone, label: "Phone", value: cvData.phone, href: `tel:${cvData.phone}` },
              { icon: FiMapPin, label: "Location", value: cvData.location, href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="card-dark p-5 flex items-center gap-4 hover:border-primary/30 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-600 mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-gray-300 hover:text-primary transition-colors text-sm font-body">{value}</a>
                  ) : (
                    <p className="text-gray-300 text-sm font-body">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="card-dark p-5">
              <p className="text-xs font-mono text-gray-600 mb-4">Find me on</p>
              <div className="flex gap-3">
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
                    className="w-11 h-11 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all hover:scale-110"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form — right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="card-dark p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-500 block mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-500 block mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 block mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Internship Opportunity / Collaboration"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 block mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about the opportunity or project..."
                  required
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : status === "sent" ? (
                  <>✅ Message Sent!</>
                ) : (
                  <>
                    <FiSend size={16} />
                    Send Message
                  </>
                )}
              </button>

              {status === "sent" && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-primary font-mono"
                >
                  Thanks! I'll get back to you soon. 🚀
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
