import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiLogOut, FiPlus, FiTrash2, FiEdit3, FiSave, FiX, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { adminApi, api, getToken } from "../api";

const RESOURCES = {
  experience: ["title", "company", "period", "description"],
  projects: ["title", "description", "tags", "category", "link"],
  education: ["degree", "institution", "period", "status"],
  certifications: ["name", "issuer", "period"],
  skills: ["category", "name"],
};
const PROFILE_FIELDS = ["name", "title", "tagline", "bio", "location",
  "phone", "email", "github", "linkedin"];

/* ----------------------------- Login screen ----------------------------- */
function Login({ onOk }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
          <p className="text-gray-500 text-sm mt-1">Sign in to manage site content.</p>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input className="admin-input" placeholder="Username" value={form.username}
               onChange={(e) => setForm({ ...form, username: e.target.value })} autoFocus />
        <input className="admin-input" type="password" placeholder="Password" value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })} />
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
function Field({ label, value, onChange }) {
  const textarea = label === "description" || label === "bio";
  return textarea ? (
    <textarea rows={3} className="admin-input" placeholder={label} value={value}
              onChange={(e) => onChange(e.target.value)} />
  ) : (
    <input className="admin-input" placeholder={label} value={value}
           onChange={(e) => onChange(e.target.value)} />
  );
}

/* ------------------------------ Resource tab ---------------------------- */
function ResourceTab({ name }) {
  const fields = RESOURCES[name];
  const [rows, setRows] = useState([]);
  const [draft, setDraft] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const blank = () => Object.fromEntries(fields.map((field) => [field, ""]));
  useEffect(() => { refresh(); setDraft(blank()); setEditingId(null); }, [name]);

  async function refresh() {
    setLoading(true);
    try { setRows((await adminApi.get(`/${name}`)).data || []); }
    catch (error) { setMsg(error.message); }
    finally { setLoading(false); }
  }

  async function save(event) {
    event.preventDefault();
    const payload = { ...draft };
    if (typeof payload.tags === "string") payload.tags = payload.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    try {
      if (editingId) await adminApi.update(`/${name}/${editingId}`, payload);
      else await adminApi.create(`/${name}`, payload);
      setDraft(blank()); setEditingId(null); setMsg("Saved"); refresh();
    } catch (error) { setMsg(error.message); }
  }

  async function remove(id) {
    try { await adminApi.remove(`/${name}/${id}`); setMsg("Deleted"); refresh(); }
    catch (error) { setMsg(error.message); }
  }

  return <section className="space-y-5">
    <div className="flex items-end justify-between gap-4"><div><p className="section-tag">Content manager</p><h2 className="font-display text-3xl font-bold text-ink capitalize">{name}</h2></div><button type="button" title="Refresh" className="icon-button" onClick={refresh}><FiRefreshCw className={loading ? "animate-spin" : ""} /></button></div>
    <form onSubmit={save} className="card-dark p-5 grid gap-4 md:grid-cols-2">
      {fields.map((field) => <Field key={field} label={field} value={draft[field] || ""}
        onChange={(value) => setDraft({ ...draft, [field]: value })} />)}
      <div className="md:col-span-2 flex gap-2">
        <button className="btn-primary px-4 py-2 inline-flex items-center gap-2"><FiPlus /> {editingId ? "Update" : "Add"}</button>
        {editingId && <button type="button" className="btn-secondary px-4 py-2" onClick={() => { setDraft(blank()); setEditingId(null); }}><FiX /> Cancel</button>}
      </div>
    </form>
    {msg && <p className="text-sm text-accent">{msg}</p>}
    {loading ? <p className="text-gray-500">Loading {name}…</p> : <div className="space-y-2">{rows.map((row) => <article key={row.id} className="card-dark p-4 flex justify-between gap-4">
      <div><h3 className="font-semibold text-ink">{row.title || row.name || row.degree || row.category}</h3>
        <p className="text-sm text-gray-500">{row.company || row.institution || row.issuer || row.period || row.description}</p></div>
      <div className="flex gap-2 shrink-0"><button title="Edit" className="icon-button" onClick={() => { setDraft({ ...row, tags: Array.isArray(row.tags) ? row.tags.join(", ") : row.tags || "" }); setEditingId(row.id); }}><FiEdit3 /></button>
        <button title="Delete" className="icon-button text-red-400" onClick={() => remove(row.id)}><FiTrash2 /></button></div>
    </article>)}{!rows.length && <p className="card-dark p-5 text-gray-500">No {name} entries yet.</p>}</div>}
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

export default function AdminApp() {
  const [user, setUser] = useState(() => getToken());
  const [tab, setTab] = useState("profile");
  if (!user) return <Login onOk={setUser} />;
  const tabs = ["profile", ...Object.keys(RESOURCES)];
  return <div className="min-h-screen bg-dark bg-mesh text-ink"><header className="border-b border-dark-border bg-white/80 px-4 py-4"><div className="max-w-6xl mx-auto flex justify-between items-center"><div><p className="text-primary text-[10px] font-semibold uppercase tracking-[0.18em]">Control room</p><h1 className="font-display text-xl font-bold">Portfolio CMS</h1></div><button className="btn-secondary px-3 py-2 inline-flex items-center gap-2" onClick={() => { api.logout(); setUser(""); }}><FiLogOut /> Sign out</button></div></header>
    <main className="max-w-6xl mx-auto px-4 py-8"><div className="flex items-center gap-2 mb-6 text-xs text-gray-500"><FiCheckCircle className="text-green-500" /> Connected to local content API</div><nav className="flex flex-wrap gap-2 mb-8">{tabs.map((item) => <button key={item} className={`px-3 py-2 capitalize ${tab === item ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab(item)}>{item}</button>)}</nav>{tab === "profile" ? <ProfileTab /> : <ResourceTab name={tab} />}</main>
  </div>;
}
