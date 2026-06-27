import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Contact"];

const SKILLS = {
  Languages: ["Python"],
  Libraries: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "Streamlit", "TensorFlow", "Hugging Face"],
  "ML & Analytics": ["Regression", "Classification", "NLP (TF-IDF)", "Recommendation Systems", "Feature Engineering", "RAG System"],
  Databases: ["SQL", "MySQL", "Firebase", "Supabase", "MongoDB"],
  Tools: ["Jupyter Notebook", "VS Code", "Git", "GitHub", "Google Colab"],
};

const SOFT_SKILLS = [
  "Teamwork", "Leadership", "Problem Solving", "Communication",
  "Time Management", "Critical Thinking", "Adaptability",
  "Attention to Detail", "Data-Driven Thinking", "Accountability & Integrity"
];

const PROJECTS = [
  {
    title: "Laptop Price Predictor",
    desc: "Regression pipeline built with Scikit-learn on 1,300+ records. Automated data cleaning in Pandas, deployed via Streamlit for real-time predictions.",
    tags: ["Scikit-learn", "Pandas", "Streamlit", "Regression"],
    icon: "💻",
    color: "#2f73f2",
  },
  {
    title: "NLP Text Classifier",
    desc: "TF-IDF based text classification system for document categorization. Implemented feature engineering and model evaluation pipelines.",
    tags: ["NLP", "TF-IDF", "Python", "Scikit-learn"],
    icon: "🧠",
    color: "#7c3aed",
  },
  {
    title: "Recommendation Engine",
    desc: "Collaborative filtering recommendation system using user-item matrices and cosine similarity for personalized product suggestions.",
    tags: ["NumPy", "Pandas", "Collaborative Filtering"],
    icon: "🎯",
    color: "#059669",
  },
  {
    title: "RAG System",
    desc: "Retrieval-Augmented Generation pipeline using Hugging Face Transformers for intelligent document question-answering.",
    tags: ["Hugging Face", "RAG", "LLMs", "Python"],
    icon: "⚡",
    color: "#d97706",
  },
];

const SKILL_BARS = [
  { name: "Python", level: 90 },
  { name: "Machine Learning", level: 82 },
  { name: "NLP / Transformers", level: 75 },
  { name: "SQL & Databases", level: 78 },
  { name: "Data Visualization", level: 85 },
];

export default function Portfolio() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [animatedBars, setAnimatedBars] = useState(false);
  const skillsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_LINKS.map((n) => document.getElementById(n.toLowerCase()));
      sections.forEach((sec) => {
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) setActive(sec.id.charAt(0).toUpperCase() + sec.id.slice(1));
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimatedBars(true); },
      { threshold: 0.3 }
    );
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Syne', 'Outfit', sans-serif", background: "#0a0f1e", color: "#e8edf5", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #2f73f2; border-radius: 10px; }

        .nav-link { transition: color 0.25s; cursor: pointer; font-weight: 500; font-size: 0.9rem; letter-spacing: 0.03em; }
        .nav-link:hover { color: #5a9bff; }
        .nav-link.active { color: #2f73f2; }

        .hero-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(47,115,242,0.18) 0%, transparent 70%); pointer-events: none; }

        .btn-primary { background: #2f73f2; color: #fff; border: none; padding: 0.75rem 2rem; border-radius: 50px; font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.3s; letter-spacing: 0.03em; }
        .btn-primary:hover { background: #1a5fd4; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(47,115,242,0.35); }

        .btn-outline { background: transparent; color: #e8edf5; border: 1.5px solid rgba(255,255,255,0.2); padding: 0.72rem 1.8rem; border-radius: 50px; font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-outline:hover { border-color: #2f73f2; color: #5a9bff; }

        .tag { display: inline-block; background: rgba(47,115,242,0.12); color: #5a9bff; border: 1px solid rgba(47,115,242,0.25); padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 500; font-family: 'Outfit', sans-serif; }

        .skill-chip { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.8rem; font-family: 'Outfit', sans-serif; color: #b0bdd0; transition: all 0.25s; }
        .skill-chip:hover { background: rgba(47,115,242,0.12); border-color: rgba(47,115,242,0.35); color: #5a9bff; }

        .project-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.75rem; transition: all 0.3s; cursor: default; }
        .project-card:hover { background: rgba(255,255,255,0.055); border-color: rgba(47,115,242,0.3); transform: translateY(-4px); }

        .section-label { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #2f73f2; margin-bottom: 0.75rem; font-family: 'Outfit', sans-serif; }

        .stat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; text-align: center; }

        .input-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.85rem 1.1rem; color: #e8edf5; font-family: 'Outfit', sans-serif; font-size: 0.9rem; outline: none; transition: border-color 0.25s; }
        .input-field:focus { border-color: #2f73f2; }
        .input-field::placeholder { color: #4a5568; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes barGrow { from { width: 0; } to { width: var(--target-width); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.25s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.55s; }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .pulse-dot { animation: pulse 2s ease-in-out infinite; }

        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        @media (max-width: 768px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .hero-flex { flex-direction: column; }
          .hide-mobile { display: none; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid-3 { grid-template-columns: repeat(2, 1fr); }
        }

        .bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #2f73f2, #7c3aed); animation: barGrow 1.2s ease both; }

        .avatar-ring { width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(135deg, #2f73f2 0%, #7c3aed 50%, #059669 100%); padding: 3px; flex-shrink: 0; }
        .avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: #111827; display: flex; align-items: center; justify-content: center; font-size: 4rem; }

        .divider { height: 1px; background: rgba(255,255,255,0.07); margin: 0; }

        .nav-glass { background: rgba(10,15,30,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.07); }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        transition: "all 0.3s",
      }} className={scrolled ? "nav-glass" : ""}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#e8edf5" }}>
            MF<span style={{ color: "#2f73f2" }}>.</span>
          </span>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hide-mobile">
            {NAV_LINKS.map((l) => (
              <span key={l} className={`nav-link ${active === l ? "active" : ""}`} onClick={() => scrollTo(l)} style={{ color: active === l ? "#2f73f2" : "#9aafc0" }}>
                {l}
              </span>
            ))}
            <button className="btn-primary" style={{ padding: "0.55rem 1.4rem", fontSize: "0.85rem" }} onClick={() => scrollTo("Contact")}>
              Hire Me
            </button>
          </div>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#e8edf5", cursor: "pointer", fontSize: "1.5rem", display: "none" }} className="show-mobile">☰</button>
          <style>{`@media (max-width:768px) { .show-mobile { display:block!important; } }`}</style>
        </div>
        {menuOpen && (
          <div style={{ background: "rgba(10,15,30,0.97)", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {NAV_LINKS.map((l) => (
              <span key={l} className="nav-link" onClick={() => scrollTo(l)} style={{ color: "#9aafc0", fontSize: "1rem" }}>{l}</span>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
        <div style={{ position: "absolute", top: "20%", left: "60%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(47,115,242,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem", width: "100%", display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap" }} className="hero-flex">
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#3cd278", display: "inline-block" }} />
              <span style={{ fontSize: "0.82rem", color: "#5a9bff", fontFamily: "'Outfit',sans-serif", fontWeight: 500, letterSpacing: "0.08em" }}>Available for work</span>
            </div>
            <h1 className="fade-up delay-1" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem, 5vw, 3.8rem)", lineHeight: 1.1, marginBottom: "1.25rem", color: "#fff" }}>
              Muhammad<br /><span style={{ color: "#2f73f2" }}>Faraz</span> Kazmi
            </h1>
            <p className="fade-up delay-2" style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1.1rem", color: "#7a8fa6", lineHeight: 1.7, maxWidth: 500, marginBottom: "1.75rem" }}>
              Python Developer · Data Analyst · AI Engineer<br />
              <span style={{ color: "#9aafc0" }}>Building intelligent systems from data — one model at a time.</span>
            </p>
            <div className="fade-up delay-3" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              <button className="btn-primary" onClick={() => scrollTo("Projects")}>View Projects</button>
              <button className="btn-outline" onClick={() => scrollTo("Contact")}>Get in Touch</button>
            </div>
            <div className="fade-up delay-4" style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <a href="https://github.com/farazkazmi700-syed" target="_blank" rel="noreferrer" style={{ color: "#5a9bff", fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.1rem" }}>⬡</span> GitHub
              </a>
              <a href="https://www.linkedin.com/in/muhammad-faraz-kazmi-81821b1b5" target="_blank" rel="noreferrer" style={{ color: "#5a9bff", fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.1rem" }}>⬡</span> LinkedIn
              </a>
              <span style={{ color: "#4a5568", fontFamily: "'Outfit',sans-serif", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                📍 Lahore, Pakistan
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }} className="float-anim">
            <div className="avatar-ring">
              <div className="avatar-inner">🧑‍💻</div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              {["Python", "ML", "AI", "Data"].map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ABOUT */}
      <section id="about" style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "3.5rem" }}>
            <p className="section-label">About Me</p>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "#fff", marginBottom: "1rem" }}>
              Turning Data into<br /><span style={{ color: "#2f73f2" }}>Intelligent Decisions</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1rem", color: "#7a8fa6", lineHeight: 1.9, marginBottom: "1.5rem" }}>
                I'm a detail-oriented aspiring AI/ML Engineer based in Lahore, Pakistan, with hands-on experience in data analysis, machine learning, and data visualization. I love turning raw data into meaningful insights.
              </p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1rem", color: "#7a8fa6", lineHeight: 1.9, marginBottom: "2rem" }}>
                Currently pursuing a BS in Computer Science (2023–2027) and certified in AI/ML from NAVTTC. I work with Python, Pandas, NumPy, Scikit-learn, TensorFlow, and Hugging Face to build scalable machine learning solutions.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => scrollTo("Skills")}>My Skills</button>
                <a href="mailto:kazmitech142@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#5a9bff", fontFamily: "'Outfit',sans-serif", fontSize: "0.9rem", textDecoration: "none" }}>✉ kazmitech142@gmail.com</a>
              </div>
            </div>
            <div className="grid-2">
              {[
                { label: "Years Learning", value: "2+", icon: "🎓" },
                { label: "Projects Built", value: "10+", icon: "🚀" },
                { label: "Certifications", value: "1", icon: "🏆" },
                { label: "Technologies", value: "20+", icon: "⚙️" },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "2rem", color: "#2f73f2", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.8rem", color: "#5a7a90", marginTop: "0.35rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <style>{`@media (max-width:768px) { #about .grid-cols-2 { grid-template-columns:1fr!important; } }`}</style>
        </div>
      </section>

      <div className="divider" />

      {/* SKILLS */}
      <section id="skills" ref={skillsRef} style={{ padding: "6rem 1.5rem", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "3.5rem" }}>
            <p className="section-label">Skills & Expertise</p>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "#fff" }}>
              Technical <span style={{ color: "#2f73f2" }}>Arsenal</span>
            </h2>
          </div>

          {/* Proficiency Bars */}
          <div style={{ marginBottom: "3.5rem" }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 600, color: "#9aafc0", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>Proficiency</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1rem" }}>
              {SKILL_BARS.map((s) => (
                <div key={s.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem" }}>
                    <span style={{ color: "#c0cdd8" }}>{s.name}</span>
                    <span style={{ color: "#2f73f2", fontWeight: 600 }}>{s.level}%</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
                    <div
                      className="bar-fill"
                      style={{
                        "--target-width": `${s.level}%`,
                        width: animatedBars ? `${s.level}%` : "0%",
                        transition: "width 1.2s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Categories */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            {Object.entries(SKILLS).map(([cat, chips]) => (
              <div key={cat} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "#5a9bff", marginBottom: "1rem", letterSpacing: "0.04em" }}>{cat}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {chips.map((c) => <span key={c} className="skill-chip">{c}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* Soft Skills */}
          <div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "#9aafc0", marginBottom: "1rem", letterSpacing: "0.05em" }}>Soft Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {SOFT_SKILLS.map((s) => (
                <span key={s} style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa", padding: "0.3rem 0.9rem", borderRadius: 50, fontSize: "0.78rem", fontFamily: "'Outfit',sans-serif" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "3.5rem" }}>
            <p className="section-label">Work & Projects</p>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "#fff" }}>
              Featured <span style={{ color: "#2f73f2" }}>Builds</span>
            </h2>
          </div>
          <div className="grid-2">
            {PROJECTS.map((p) => (
              <div key={p.title} className="project-card">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${p.color}18`, border: `1px solid ${p.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                    {p.icon}
                  </div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#e8edf5" }}>{p.title}</h3>
                </div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.88rem", color: "#6a7f96", lineHeight: 1.75, marginBottom: "1.25rem" }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* Education & Certification */}
          <div style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
            <div style={{ background: "rgba(47,115,242,0.07)", border: "1px solid rgba(47,115,242,0.2)", borderRadius: 16, padding: "1.75rem" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>🎓</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#5a9bff", marginBottom: "0.4rem" }}>Education</h3>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1rem", color: "#e8edf5", fontWeight: 600 }}>BS Computer Science</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", color: "#6a7f96" }}>2023 – 2027</p>
            </div>
            <div style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16, padding: "1.75rem" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>🏆</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#a78bfa", marginBottom: "0.4rem" }}>Certification</h3>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1rem", color: "#e8edf5", fontWeight: 600 }}>Artificial Intelligence (ML/DL)</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", color: "#6a7f96" }}>NAVTTC</p>
            </div>
            <div style={{ background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 16, padding: "1.75rem" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>📍</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#34d399", marginBottom: "0.4rem" }}>Location</h3>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1rem", color: "#e8edf5", fontWeight: 600 }}>Lahore, Pakistan</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", color: "#6a7f96" }}>Open to remote worldwide</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* CONTACT */}
      <section id="contact" style={{ padding: "6rem 1.5rem", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p className="section-label">Get In Touch</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "#fff", marginBottom: "1rem" }}>
            Let's <span style={{ color: "#2f73f2" }}>Work Together</span>
          </h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1rem", color: "#6a7f96", lineHeight: 1.8, marginBottom: "3rem" }}>
            Have a project or opportunity in mind? I'd love to hear from you. Drop me a message and I'll get back to you promptly.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input className="input-field" placeholder="Your Name" style={{ minWidth: 0 }} />
              <input className="input-field" placeholder="Email Address" style={{ minWidth: 0 }} />
            </div>
            <input className="input-field" placeholder="Subject" />
            <textarea className="input-field" placeholder="Your message..." rows={5} style={{ resize: "vertical" }} />
            <button className="btn-primary" style={{ alignSelf: "center", padding: "0.85rem 2.5rem" }}>
              Send Message ✈
            </button>
          </div>

          <div style={{ marginTop: "3rem", padding: "1.5rem", background: "rgba(47,115,242,0.06)", border: "1px solid rgba(47,115,242,0.15)", borderRadius: 14 }}>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2rem" }}>
              <a href="mailto:kazmitech142@gmail.com" style={{ textDecoration: "none", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>✉️</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.8rem", color: "#6a7f96" }}>Email</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", color: "#5a9bff" }}>kazmitech142@gmail.com</div>
              </a>
              <a href="tel:+923411019063" style={{ textDecoration: "none", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>📞</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.8rem", color: "#6a7f96" }}>Phone</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", color: "#5a9bff" }}>+92 341-1019063</div>
              </a>
              <a href="https://github.com/farazkazmi700-syed" target="_blank" rel="noreferrer" style={{ textDecoration: "none", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>⬡</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.8rem", color: "#6a7f96" }}>GitHub</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", color: "#5a9bff" }}>farazkazmi700-syed</div>
              </a>
              <a href="https://www.linkedin.com/in/muhammad-faraz-kazmi-81821b1b5" target="_blank" rel="noreferrer" style={{ textDecoration: "none", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>🔗</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.8rem", color: "#6a7f96" }}>LinkedIn</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", color: "#5a9bff" }}>Muhammad Faraz</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.82rem", color: "#3a4f62" }}>
          © 2025 Muhammad Faraz Kazmi · Python Developer · AI Engineer · Lahore, Pakistan
        </p>
      </footer>
    </div>
  );
}
