import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBookOpen, FiArrowRight } from "react-icons/fi";
import { api } from "../../api";

/** User-facing list of published articles (live from the CMS backend). */
export default function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.articles()
      .then((r) => setArticles((r.data || []).filter((a) => a.published)))
      .catch(() => setArticles([]));
  }, []);

  if (!articles.length) return null; // hidden until the admin publishes one

  return (
    <section id="articles" className="section-padding relative">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag">articles</span>
          <h2 className="section-title mt-2">
            Latest <span className="t-yellow">Writing</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {articles.map((a, i) => (
            <motion.article
              key={a.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-dark p-6 hover:border-accent/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-3">
                <FiBookOpen size={13} />
                {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
              </div>
              <h3 className="font-display font-bold text-ink text-lg mb-2">
                {a.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                {a.excerpt}
              </p>
              <Link
                to={`/articles/${a.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-3 transition-all"
              >
                Read article <FiArrowRight size={14} />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
