import { Routes, Route } from "react-router-dom";
import Site from "./pages/Site";
import AdminApp from "./admin/AdminApp";

export default function App() {
  return (
    <Routes>
      {/* User view */}
      <Route path="/" element={<Site />} />
      {/* Admin view (login + CMS dashboard) */}
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}


