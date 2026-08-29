import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiLogOut, FiPlus, FiTrash2, FiEdit3, FiSave, FiX, FiRefreshCw, FiCheckCircle, FiEye, FiEyeOff, FiGrid, FiKey, FiExternalLink, FiBriefcase, FiAward, FiLayers } from "react-icons/fi";
import { adminApi, api, getToken } from "../api";

const RESOURCES = {
  experience: ["title", "company", "period", "description"],
  projects: ["title", "description", "tags", "category", "link"],
  education: ["degree", "institution", "period", "status"],
  certifications: ["name", "issuer", "period"],
  skills: ["category", "name", "kind"],
};
const PROFILE_FIELDS = ["name", "title", "tagline", "bio", "location",
  "phone", "email", "github", "linkedin"];

/* ----------------------------- Login screen ----------------------------- */
function Login({ onOk }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const r = await api.login(form.username.trim(), form.password);
      onOk(r.username);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark bg-mesh flex items-center justify-center px-4 py-8">
      <form onSubmit={submit} className="card-dark p-6 sm:p-8 w-full max-w-md space-y-5">
        <div className="border-l-4 border-primary pl-4">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-2">Portfolio CMS</p>
          <h1 className="font-display font-bold text-ink text-3xl">Admin <span className="text-accent">Access</span></h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage site content and publish updates.</p>
        </div>
        {error && <p className="text-red-400 text-sm bg-red-50 border border-red-200 rounded p-2">{error}</p>}
        <input className="admin-input" placeholder="Username" value={form.username}
               onChange={(e) => setForm({ ...form, username: e.target.value })} autoFocus />
        <div className="relative">
          <input className="admin-input pr-10" type={showPassword ? "text" : "password"} placeholder="Password" value={form.password}
                 onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-ink" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <button disabled={busy} className="btn-primary w-full py-3 rounded-lg font-medium flex justify-center items-center gap-2">
          {busy && <FiRefreshCw className="animate-spin" />}
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link to="/" className="block text-center text-xs text-gray-600 hover:text-accent">
          ← back to portfolio
        </Link>
      </form>
    </div>
  );
}

/* ------------------------------ Field input ----------------------------- */
function Field({ label, value, onChange, required = false, type = "text", fullWidth = false, selects = {} }) {
  const textarea = label === "description" || label === "bio";
  const isUrl = label === "link" || label === "github" || label === "linkedin";
  const fieldType = isUrl ? "url" : type;
  const containerClass = fullWidth ? "col-span-full" : "";
  
  return (
    <div className={containerClass}>
      <label className="block text-xs font-semibold text-ink mb-1 uppercase tracking-widest">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {selects[label] ? (
        <select
          className="admin-input w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {selects[label].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea 
          rows={3}
          className="admin-input w-full" 
          placeholder={`Enter ${label}...`} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      ) : (
        <input 
          type={fieldType}
          className="admin-input w-full" 
          placeholder={`Enter ${label}...`} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
    </div>
  );
}

/* ------------------------------ Resource tab ---------------------------- */
function ResourceTab({ name }) {
  const fields = RESOURCES[name];
  // "kind" on skills becomes a dropdown; other resources have no selects.
  const selects = name === "skills" ? { kind: ["technical", "soft"] } : {};
  const [rows, setRows] = useState([]);
  const [draft, setDraft] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const blank = () => {
    const base = Object.fromEntries(fields.map((field) => [field, ""]));
    if (name === "skills") base.kind = "technical"; // new skills are technical by default
    return base;
  };
  
  useEffect(() => { refresh(); setDraft(blank()); setEditingId(null); }, [name]);

  async function refresh() {
    setLoading(true);
    try { 
      const result = await adminApi.get(`/${name}`);
      setRows(result.data || []); 
    }
    catch (error) { 
      setMsg(error.message || "Failed to load data");
      setMsgType("error");
    } finally { 
      setLoading(false); 
    }
  }

  async function save(event) {
    event.preventDefault();
    const payload = { ...draft };
    if (typeof payload.tags === "string") {
      payload.tags = payload.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    }
    if (name === "projects" && payload.published === undefined) {
      payload.published = true; // new content is published by default
    }
    try {
      if (editingId) {
        await adminApi.update(`/${name}/${editingId}`, payload);
        setMsg(`${name.slice(0, -1)} updated successfully`);
      } else {
        await adminApi.create(`/${name}`, payload);
        setMsg(`${name.slice(0, -1)} added successfully`);
      }
      setMsgType("success");
      setDraft(blank()); 
      setEditingId(null); 
      refresh();
    } catch (error) { 
      setMsg(error.message || "Failed to save");
      setMsgType("error");
    }
  }

  async function togglePublish(row) {
    const next = { ...row, published: !row.published };
    try {
      await adminApi.update(`/${name}/${row.id}`, next);
      setMsg(row.published
        ? `${name.slice(0, -1)} moved to draft`
        : `${name.slice(0, -1)} published to your site`);
      setMsgType("success");
      refresh();
    } catch (error) {
      setMsg(error.message || "Failed to update publish status");
      setMsgType("error");
    }
  }

  async function remove(id) {
    setDeleting(id);
    try { 
      await adminApi.remove(`/${name}/${id}`); 
      setMsg(`${name.slice(0, -1)} deleted successfully`);
      setMsgType("success");
      refresh(); 
    }
    catch (error) { 
      setMsg(error.message || "Failed to delete");
      setMsgType("error");
    } finally {
      setDeleting(null);
    }
  }

  function editRow(row) {
    setDraft({ ...row, tags: Array.isArray(row.tags) ? row.tags.join(", ") : row.tags || "" });
    setEditingId(row.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <section className="space-y-6">
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="section-tag">Content manager</p>
        <h2 className="font-display text-3xl font-bold text-ink capitalize">{name}</h2>
        <p className="text-sm text-gray-500 mt-1">{rows.length} {name} in your portfolio</p>
      </div>
      <button type="button" title="Refresh" className="icon-button hover:bg-primary/10" onClick={refresh}>
        <FiRefreshCw className={loading ? "animate-spin" : ""} />
      </button>
    </div>
    
    {msg && (
      <div className={`p-4 rounded-lg border ${msgType === "success" 
        ? "bg-green-50 border-green-200 text-green-700" 
        : "bg-red-50 border-red-200 text-red-700"}`}>
        {msg}
      </div>
    )}
    
    <form onSubmit={save} className="card-dark p-6 space-y-4 border-l-4 border-primary">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <Field 
            key={field} 
            label={field} 
            value={draft[field] || ""}
            onChange={(value) => setDraft({ ...draft, [field]: value })}
            fullWidth={field === "description" || field === "tags"}
            selects={selects}
          />
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <button className="btn-primary px-4 py-2 inline-flex items-center gap-2 rounded-lg">
          <FiPlus size={18} /> {editingId ? "Update" : "Add"} {name.slice(0, -1)}
        </button>
        {editingId && (
          <button 
            type="button" 
            className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2" 
            onClick={() => { setDraft(blank()); setEditingId(null); }}
          >
            <FiX size={18} /> Cancel
          </button>
        )}
      </div>
    </form>
    
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin inline-block"><FiRefreshCw /></div>
        <p className="text-gray-500 mt-2">Loading {name}…</p>
      </div>
    ) : (
      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="card-dark p-8 text-center">
            <p className="text-gray-500">No {name} entries yet. Add one to get started!</p>
          </div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="card-dark p-5 hover:shadow-lg transition-shadow">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-ink break-words">{row.title || row.name || row.degree || row.category}</h3>
                    {name === "projects" && (
                      <span className={`publish-badge ${row.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {row.published ? "Published" : "Draft"}
                      </span>
                    )}
                    {name === "skills" && row.kind === "soft" && (
                      <span className="publish-badge bg-purple-100 text-purple-700">Soft skill</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {row.category || row.company || row.institution || row.issuer || row.period || row.description || row.tags}
                  </p>
                  {row.link && <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 inline-block">{row.link}</a>}
                </div>
                <div className="flex gap-2 shrink-0">
                  {name === "projects" && (
                    <button
                      title={row.published ? "Unpublish" : "Publish"}
                      className={`icon-button p-2 rounded-lg transition-colors ${row.published ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-amber-50 hover:text-amber-600"}`}
                      onClick={() => togglePublish(row)}
                    >
                      {row.published ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </button>
                  )}
                  <button 
                    title="Edit" 
                    className="icon-button hover:bg-primary/10 p-2 rounded-lg transition-colors" 
                    onClick={() => editRow(row)}
                  >
                    <FiEdit3 size={18} />
                  </button>
                  <button 
                    title="Delete" 
                    className="icon-button text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors" 
                    onClick={() => remove(row.id)}
                    disabled={deleting === row.id}
                  >
                    {deleting === row.id ? <FiRefreshCw size={18} className="animate-spin" /> : <FiTrash2 size={18} />}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    )}
  </section>;
}

function ProfileTab() {
  const [profile, setProfile] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.get("/profile").then((result) => setProfile(result.data || {})).catch((error) => setMsg(error.message)).finally(() => setLoading(false)); }, []);
  async function save(event) { event.preventDefault(); setMsg("Saving…"); try { await adminApi.update("/profile", profile); setMsg("Profile saved"); } catch (error) { setMsg(error.message); } }
  return <section className="space-y-5"><div><p className="section-tag">Site settings</p><h2 className="font-display text-3xl font-bold text-ink">Profile</h2></div><form onSubmit={save} className="card-dark p-5 grid gap-4 md:grid-cols-2">
    {PROFILE_FIELDS.map((field) => <Field key={field} label={field} value={profile[field] || ""} onChange={(value) => setProfile({ ...profile, [field]: value })} />)}
    <div className="md:col-span-2 flex items-center gap-3"><button disabled={loading} className="btn-primary px-4 py-2 inline-flex items-center gap-2"><FiSave /> Save profile</button>{msg && <span className={`text-sm ${msg.includes("Failed") ? "text-red-500" : "text-accent"}`}>{msg}</span>}</div>
  </form></section>;
}


/* ----------------------------- Dashboard tab ----------------------------- */
const RESOURCE_LABELS = {
  experience: { label: "Experience", icon: FiBriefcase },
  projects: { label: "Projects", icon: FiGrid },
  education: { label: "Education", icon: FiAward },
  certifications: { label: "Certifications", icon: FiAward },
  skills: { label: "Skills", icon: FiLayers },
};

function DashboardTab({ onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const results = {};
      await Promise.all(
        Object.keys(RESOURCE_LABELS).map(async (key) => {
          try {
            const r = await adminApi.get(`/${key}`);
            results[key] = (r.data || []).length;
          } catch { results[key] = 0; }
        })
      );
      setStats(results);
    })();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <p className="section-tag">Overview</p>
        <h2 className="font-display text-3xl font-bold text-ink">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Your portfolio is live and driven by the content below — edit any section to update the main website instantly.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(RESOURCE_LABELS).map(([key, { label, icon: Icon }]) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className="card-dark p-4 text-left hover:border-primary/40 transition-all group"
          >
            <Icon size={18} className="text-primary mb-2" />
            <div className="font-display font-bold text-2xl text-ink">{stats ? stats[key] ?? 0 : "…"}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </button>
        ))}
      </div>
      <div className="card-dark p-5 border-l-4 border-primary">
        <p className="font-semibold text-ink mb-1">Quick start</p>
        <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
          <li>Add new items from each section tab — they publish to the site immediately.</li>
          <li>Toggle the eye icon on a project to switch between Published and Draft.</li>
          <li>Changes publish to your site immediately.</li>
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------ Settings tab ----------------------------- */
function SettingsTab() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    if (newPassword.length < 8) {
      setMsg("Password must be at least 8 characters");
      setMsgType("error");
      return;
    }
    if (newPassword !== confirm) {
      setMsg("Passwords do not match");
      setMsgType("error");
      return;
    }
    setBusy(true);
    try {
      await adminApi.changePassword({ newPassword });
      setMsg("Password changed successfully");
      setMsgType("success");
      setNewPassword("");
      setConfirm("");
    } catch (error) {
      setMsg(error.message || "Failed to change password");
      setMsgType("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="section-tag">Security</p>
        <h2 className="font-display text-3xl font-bold text-ink">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Update your admin password. Keep it secure — this guards full control of your site.</p>
      </div>
      {msg && (
        <div className={`p-4 rounded-lg border ${msgType === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {msg}
        </div>
      )}
      <form onSubmit={submit} className="card-dark p-6 space-y-4 max-w-md border-l-4 border-primary">
        <div>
          <label className="admin-label">New password</label>
          <input
            type="password"
            className="admin-input"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="admin-label">Confirm new password</label>
          <input
            type="password"
            className="admin-input"
            placeholder="Repeat the password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <button disabled={busy} className="btn-primary px-4 py-2 inline-flex items-center gap-2 rounded-lg disabled:opacity-60">
          {busy && <FiRefreshCw className="animate-spin" />}
          <FiKey size={18} /> Change password
        </button>
      </form>
    </section>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(() => getToken());
  const [tab, setTab] = useState("dashboard");
  if (!user) return <Login onOk={setUser} />;
  const tabs = ["dashboard", "profile", ...Object.keys(RESOURCES), "settings"];
  return (
    <div className="min-h-screen bg-dark bg-mesh text-ink">
      <header className="sticky top-0 z-30 border-b border-dark-border bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-display font-bold text-lg shrink-0">F</div>
            <div className="min-w-0">
              <p className="text-primary text-[10px] font-semibold uppercase tracking-[0.18em] mb-0.5">Control room</p>
              <h1 className="font-display text-lg sm:text-xl font-bold leading-tight truncate">Portfolio CMS</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary px-3 py-2 inline-flex items-center gap-2">
              <FiExternalLink /> <span className="hidden sm:inline">View site</span>
            </a>
            <button className="btn-secondary px-3 py-2 inline-flex items-center gap-2" onClick={() => { api.logout(); setUser(""); }}>
              <FiLogOut /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
          <FiCheckCircle className="text-green-500 shrink-0" /> <span className="truncate">Connected to content API</span>
        </div>
        <nav className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Admin sections">
          {tabs.map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`px-3 py-2 capitalize whitespace-nowrap ${tab === item ? "btn-primary" : "btn-secondary"}`}>
              {item}
            </button>
          ))}
        </nav>
        {tab === "dashboard" && <DashboardTab onNavigate={setTab} />}
        {tab === "profile" && <ProfileTab />}
        {tab === "settings" && <SettingsTab />}
        {tab !== "dashboard" && tab !== "profile" && tab !== "settings" && <ResourceTab name={tab} />}
      </main>
    </div>
  );
}
