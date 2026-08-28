import { Routes, Route } from "react-router-dom";
import Site from "./pages/Site";
import ArticleDetail from "./pages/ArticleDetail";
import AdminApp from "./admin/AdminApp";

export default function App() {
  return (
    <Routes>
      {/* User view */}
      <Route path="/" element={<Site />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      {/* Admin view (login + CMS dashboard) */}
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}


