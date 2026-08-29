import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Education from "../components/sections/Education";
import Contact from "../components/sections/Contact";
import useLiveSync from "../hooks/useLiveSync";

/** User view: the public portfolio. */
export default function Site() {
  // Live LinkedIn-sync overlay: refreshes cvData in place when the
  // sync backend (VITE_API_URL) is reachable; no-op otherwise.
  useLiveSync();

  return (
    <div className="min-h-screen bg-dark text-muted font-body overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
