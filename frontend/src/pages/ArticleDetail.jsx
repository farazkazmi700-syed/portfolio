import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiClock } from "react-icons/fi";
import { api } from "../api";

/** Public page for a single published article. */
export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.article(slug)
      .then((r) => setArticle(r.data))
      .catch(() => setError("Article not found or not published."));
  }, [slug]);

  return (
    <div className="min-h-screen bg-dark text-muted font-body overflow-x-hidden">
      <div className="container-max py-20 max-w-3xl">
        <Link
          to="/#articles"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors mb-10"
        >
          <FiArrowLeft size={15} /> Back to portfolio
        </Link>

        {error && (
          <p className="card-dark p-6 text-center text-gray-400">{error}</p>
        )}

        {article && (
          <article>
            <h1 className="font-display font-bold text-ink text-3xl sm:text-4xl leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-600 mb-8 pb-8 border-b border-dark-border">
              {article.createdAt && (
                <span className="inline-flex items-center gap-1.5">
                  <FiClock size={12} />
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              )}
              {article.tags.map((t) => (
                <span key={t} className="text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <div className="space-y-5 text-gray-400 leading-relaxed whitespace-pre-wrap">
              {article.body}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
