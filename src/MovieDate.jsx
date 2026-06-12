import { useState, useEffect, useRef } from "react";
// ── LANGKAH TAMBAHAN: Import client Supabase yang sudah dibuat di Langkah 6 ──
import { supabase } from "./supabase"; 

// ── PALET WARNA BARU ──────────────────────────────────────────────────────────
const COLOR_PRIMARY   = "#2C5EAD"; // Biru Utama / Aksen
const COLOR_SECONDARY = "#1591DC"; // Biru Pendukung / Cerah
const COLOR_LIGHT     = "#4BB8FA"; // Biru Muda / Highlight
const COLOR_SOFT      = "#C4E2F5"; // Biru Sangat Muda / Soft Text atau Pasangan

const ACCENT = COLOR_PRIMARY;
const YOU_COLOR = COLOR_SECONDARY;
const PARTNER_COLOR = COLOR_LIGHT;
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w300";
const TMDB_IMG_LG = "https://image.tmdb.org/t/p/w500";

const DEFAULT_PROFILES = {
  me:      { name: "You",     color: YOU_COLOR,     avatar: null },
  partner: { name: "Partner", color: PARTNER_COLOR, avatar: null },
};

function statusFromWatched(watched = []) {
  const me = watched.includes("me");
  const pt = watched.includes("partner");
  if (me && pt) return "both";
  if (me) return "me";
  if (pt) return "partner";
  return "none";
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ profile, size = 24, style: s = {} }) {
  const letter = (profile?.name || "?")[0].toUpperCase();
  if (profile?.avatar) {
    return (
      <img src={profile.avatar} alt={letter}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #1a1a2e", ...s }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: profile?.color || "#666",
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, fontWeight: 700, flexShrink: 0, border: "2px solid #1a1a2e", ...s,
    }}>{letter}</div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status, profiles }) {
  const meName = profiles?.me?.name || "You";
  const ptName = profiles?.partner?.name || "Partner";
  const map = {
    both:    { label: `Both watched`,    bg: "rgba(44, 94, 173, 0.2)",  color: COLOR_SOFT,     icon: "👫" },
    me:      { label: `${meName} watched`, bg: "rgba(21, 145, 220, 0.2)", color: YOU_COLOR,     icon: "🧑" },
    partner: { label: `${ptName} watched`, bg: "rgba(75, 184, 250, 0.2)", color: PARTNER_COLOR, icon: "💑" },
    none:    { label: "Not watched",       bg: "rgba(255,255,255,.08)",   color: "#9CA3AF",      icon: "👁"  },
  };
  const st = map[status] || map.none;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: st.bg, color: st.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
      <span>{st.icon}</span>{st.label}
    </span>
  );
}

// ── Movie Card ────────────────────────────────────────────────────────────────
function MovieCard({ movie, onClick, selected, profiles }) {
  const [hov, setHov] = useState(false);
  const showY = movie.status === "both" || movie.status === "me";
  const showP = movie.status === "both" || movie.status === "partner";
  const poster = movie.poster
    ? (movie.poster.startsWith("http") ? movie.poster : TMDB_IMG + movie.poster)
    : "https://via.placeholder.com/300x420/1a1a2e/666?text=No+Poster";

  return (
    <div onClick={() => onClick(movie)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#1a1a2e", borderRadius: 16, overflow: "hidden", cursor: "pointer", border: selected ? `2px solid ${ACCENT}` : "2px solid transparent", transform: hov ? "translateY(-4px)" : "none", boxShadow: hov || selected ? "0 8px 32px #0009" : "0 2px 16px #0006", transition: "all .18s", position: "relative" }}>
      <div style={{ position: "relative", paddingTop: "150%" }}>
        <img src={poster} alt={movie.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#0f0f1aee 40%,transparent 70%)" }} />
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex" }}>
          {showY && <Avatar profile={profiles.me} size={24} style={{ marginLeft: -6 }} />}
          {showP && <Avatar profile={profiles.partner} size={24} style={{ marginLeft: -6 }} />}
        </div>
        {movie.status === "both" && (
          <div style={{ position: "absolute", top: 8, left: 8, width: 22, height: 22, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 12px 10px" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 2, lineHeight: 1.2 }}>{movie.title}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>{movie.year} • {movie.genre} • ⭐ {movie.rating}</div>
          <StatusBadge status={movie.status} profiles={profiles} />
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ movie, onClose, onToggleWatch, profiles }) {
  if (!movie) return null;
  const poster = movie.poster
    ? (movie.poster.startsWith("http") ? movie.poster : TMDB_IMG_LG + movie.poster)
    : "https://via.placeholder.com/500x750/1a1a2e/666?text=No+Poster";

  return (
    <div style={{ width: 340, flexShrink: 0, background: "#13131f", borderLeft: "1px solid #2a2a3e", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ position: "relative" }}>
        <img src={poster} alt={movie.title} style={{ width: "100%", height: 220, objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#13131f 10%,transparent 70%)" }} />
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.5)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>×</button>
      </div>
      <div style={{ padding: "0 20px 24px" }}>
        <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{movie.title}</h2>
        <div style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 12 }}>{movie.year} • {movie.genre} • ⭐ {movie.rating}/10</div>
        <StatusBadge status={movie.status} profiles={profiles} />
        <div style={{ margin: "18px 0 8px", color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Synopsis</div>
        <p style={{ color: "#D1D5DB", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{movie.synopsis || "No synopsis available."}</p>
        <div style={{ margin: "18px 0 12px", color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Mark as Watched</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["me", "partner"].map(key => {
            const p = profiles[key];
            const watched = movie.status === "both" || movie.status === key;
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, background: "#1a1a2e", borderRadius: 10, padding: "10px 14px" }}>
                <Avatar profile={p} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ color: watched ? "#34D399" : "#6B7280", fontSize: 11 }}>{watched ? "✓ Watched" : "Not watched yet"}</div>
                </div>
                <button onClick={() => onToggleWatch(movie.id, key)} style={{ background: watched ? "#2a2a3e" : ACCENT, color: watched ? "#9CA3AF" : "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{watched ? "Undo" : "Mark"}</button>
              </div>
            );
          })}
        </div>
        {movie.trailer_key && (
          <a href={`https://www.youtube.com/watch?v=${movie.trailer_key}`} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20, padding: 12, background: ACCENT, borderRadius: 10, color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            ▶ Watch Trailer
          </a>
        )}
      </div>
    </div>
  );
}

// ── Search Dropdown ───────────────────────────────────────────────────────────
function SearchDropdown({ results, onAdd, loading }) {
  if (!results.length && !loading) return null;
  return (
    <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#1a1a2e", borderRadius: 12, border: "1px solid #2a2a3e", zIndex: 100, overflow: "hidden", boxShadow: "0 8px 32px #000a", maxHeight: 360, overflowY: "auto" }}>
      {loading && <div style={{ padding: 20, textAlign: "center", color: "#6B7280", fontSize: 13 }}>🔍 Searching...</div>}
      {results.map(r => (
        <div key={r.id} onClick={() => onAdd(r)}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #2a2a3e", transition: "background .15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#252538"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <img src={r.poster ? TMDB_IMG + r.poster : "https://via.placeholder.com/40x56/252538/666?text=?"} alt={r.title} style={{ width: 40, height: 56, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{r.title}</div>
            <div style={{ color: "#9CA3AF", fontSize: 12 }}>{r.year} • {r.genre} • ⭐ {r.rating}</div>
          </div>
          <div style={{ marginLeft: "auto", background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700 }}>+ Add</div>
        </div>
      ))}
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────
function AnalyticsView({ movies, profiles }) {
  const myCount = movies.filter(m => m.status === "both" || m.status === "me").length;
  const ptCount = movies.filter(m => m.status === "both" || m.status === "partner").length;
  const total = movies.length || 1;
  const genreMap = {};
  movies.forEach(m => { if (m.genre) genreMap[m.genre] = (genreMap[m.genre] || 0) + 1; });
  const genres = Object.entries(genreMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div style={{ padding: 32, color: "#fff", maxWidth: 800 }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 800 }}>Who Watched More?</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        {[{ key: "me", count: myCount }, { key: "partner", count: ptCount }].map(p => {
          const prof = profiles[p.key];
          return (
            <div key={p.key} style={{ background: "#1a1a2e", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Avatar profile={prof} size={48} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{prof.name}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 13 }}>Movies watched</div>
                </div>
              </div>
              <div style={{ fontSize: 48, fontWeight: 900, color: prof.color }}>{p.count}</div>
              <div style={{ marginTop: 8, height: 6, background: "#2a2a3e", borderRadius: 3 }}>
                <div style={{ width: `${(p.count / total) * 100}%`, height: "100%", background: prof.color, borderRadius: 3, transition: "width .5s" }} />
              </div>
              <div style={{ marginTop: 6, color: "#6B7280", fontSize: 12 }}>{Math.round((p.count / total) * 100)}% of watchlist</div>
            </div>
          );
        })}
      </div>
      {genres.length > 0 && (
        <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700, color: "#9CA3AF" }}>Genres on your list</h3>
          {genres.map(([genre, count]) => (
            <div key={genre} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 90, color: "#D1D5DB", fontSize: 13 }}>{genre}</div>
              <div style={{ flex: 1, height: 8, background: "#2a2a3e", borderRadius: 4 }}>
                <div style={{ width: `${(count / total) * 100}%`, height: "100%", background: ACCENT, borderRadius: 4 }} />
              </div>
              <div style={{ color: "#9CA3AF", fontSize: 12, width: 20 }}>{count}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── History ───────────────────────────────────────────────────────────────────
function HistoryView({ movies, profiles }) {
  const watched = movies.filter(m => m.status !== "none");
  return (
    <div style={{ padding: 32, color: "#fff", maxWidth: 800 }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 800 }}>Watch History</h2>
      {watched.length === 0 && <div style={{ color: "#6B7280" }}>Belum ada film yang ditonton.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {watched.map(m => {
          const poster = m.poster ? (m.poster.startsWith("http") ? m.poster : TMDB_IMG + m.poster) : "https://via.placeholder.com/48x64/1a1a2e/666?text=?";
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 16, background: "#1a1a2e", borderRadius: 12, padding: "12px 16px" }}>
              <img src={poster} alt={m.title} style={{ width: 48, height: 64, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{m.title}</div>
                <div style={{ color: "#9CA3AF", fontSize: 12 }}>{m.year} • {m.genre} • ⭐ {m.rating}</div>
              </div>
              <StatusBadge status={m.status} profiles={profiles} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Avatar Upload Button ──────────────────────────────────────────────────────
function AvatarUpload({ profile, onUpload, size = 80 }) {
  const inputRef = useRef(null);
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onUpload(ev.target.result);
    reader.readAsDataURL(file);
  }
  return (
    <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }} onClick={() => inputRef.current.click()}>
      <Avatar profile={profile} size={size} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
        justifyContent: "center", opacity: 0, transition: "opacity .2s",
        fontSize: 20,
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0}>
        📷
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsView({ profiles, onSave }) {
  const [form, setForm] = useState({
    me:      { ...profiles.me },
    partner: { ...profiles.partner },
  });
  const [saved, setSaved] = useState(false);

  // Update local form saat profiles berubah dari database luar
  useEffect(() => {
    setForm({ me: { ...profiles.me }, partner: { ...profiles.partner } });
  }, [profiles]);

  function handleName(key, val) {
    setForm(f => ({ ...f, [key]: { ...f[key], name: val } }));
  }
  function handleColor(key, val) {
    setForm(f => ({ ...f, [key]: { ...f[key], color: val } }));
  }
  function handleAvatar(key, dataUrl) {
    setForm(f => ({ ...f, [key]: { ...f[key], avatar: dataUrl } }));
  }
  function handleRemoveAvatar(key) {
    setForm(f => ({ ...f, [key]: { ...f[key], avatar: null } }));
  }
  function handleSave() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: 32, color: "#fff", maxWidth: 600 }}>
      <h2 style={{ marginBottom: 8, fontSize: 24, fontWeight: 800 }}>Settings</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 32 }}>Atur profil kamu dan pasanganmu di sini.</p>

      {/* Profile Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        {["me", "partner"].map(key => {
          const p = form[key];
          const label = key === "me" ? "👤 Profil Kamu" : "💜 Profil Partner";
          return (
            <div key={key} style={{ background: "#1a1a2e", borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#9CA3AF", marginBottom: 20 }}>{label}</div>

              {/* Avatar upload */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ position: "relative" }}>
                  <AvatarUpload profile={p} onUpload={url => handleAvatar(key, url)} size={80} />
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>Klik foto untuk ganti</div>
                {p.avatar && (
                  <button onClick={() => handleRemoveAvatar(key)} style={{ background: "transparent", border: "1px solid #3a3a4e", color: "#9CA3AF", borderRadius: 8, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>
                    Hapus Foto
                  </button>
                )}
              </div>

              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Nama</label>
                <input
                  value={p.name}
                  onChange={e => handleName(key, e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", background: "#0f0f1a", border: "1px solid #2a2a3e", borderRadius: 8, color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                />
              </div>

              {/* Color */}
              <div>
                <label style={{ display: "block", marginBottom: 6, color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Warna Avatar</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="color" value={p.color} onChange={e => handleColor(key, e.target.value)}
                    style={{ width: 44, height: 36, borderRadius: 8, border: "none", background: "none", cursor: "pointer", padding: 2 }} />
                  <div style={{ background: p.color, borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.color}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview */}
      <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Preview</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar profile={form.me} size={40} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{form.me.name || "?"}</span>
          </div>
          <div style={{ color: "#6B7280", fontSize: 20 }}>❤️</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar profile={form.partner} size={40} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{form.partner.name || "?"}</span>
          </div>
        </div>
      </div>

      <button onClick={handleSave} style={{
        background: saved ? "#34D399" : ACCENT, color: "#fff", border: "none",
        borderRadius: 10, padding: "13px 32px", fontWeight: 700, fontSize: 15,
        cursor: "pointer", transition: "background .3s", width: "100%",
      }}>
        {saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
      </button>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "watchlist", label: "Shared Watchlist", icon: "🎬" },
  { id: "history",   label: "History",          icon: "🕐" },
  { id: "analytics", label: "Who Watched More", icon: "📊" },
  { id: "settings",  label: "Settings",         icon: "⚙️" },
];
const FILTERS = ["All", "Unwatched", "Watched by Me", "Watched by Partner", "Both Watched"];

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function MovieDate() {
  const [activeNav, setActiveNav]     = useState("watchlist");
  const [filter, setFilter]           = useState("All");
  const [selected, setSelected]       = useState(null);
  const [searchQ, setSearchQ]         = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [showSearch, setShowSearch]   = useState(false);
  
  const [movies, setMovies]           = useState([]);
  const [profiles, setProfiles]       = useState(DEFAULT_PROFILES);

  const searchRef  = useRef(null);
  const debounceRef = useRef(null);

  // ── BAGIAN INTEGRASI BARU: Ambil & Sinkronisasi data Real-time dengan Supabase ──
  useEffect(() => {
    async function fetchMovies() {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setMovies(data);
    }

    async function fetchProfiles() {
      const { data, error } = await supabase.from("profiles").select("*");
      if (!error && data) {
        const mapped = { ...DEFAULT_PROFILES };
        data.forEach(p => {
          if (p.id === "me" || p.id === "partner") {
            mapped[p.id] = { name: p.name, color: p.color, avatar: p.avatar };
          }
        });
        setProfiles(mapped);
      }
    }

    fetchMovies();
    fetchProfiles();

    const moviesChannel = supabase
      .channel("realtime-movies")
      .on("postgres_changes", { event: "*", scheme: "public", table: "movies" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setMovies(prev => [payload.new, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setMovies(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
          setSelected(prev => prev && prev.id === payload.new.id ? payload.new : prev);
        } else if (payload.eventType === "DELETE") {
          setMovies(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe();

    const profilesChannel = supabase
      .channel("realtime-profiles")
      .on("postgres_changes", { event: "UPDATE", scheme: "public", table: "profiles" }, (payload) => {
        const updatedProfile = payload.new;
        setProfiles(prev => ({
          ...prev,
          [updatedProfile.id]: {
            name: updatedProfile.name,
            color: updatedProfile.color,
            avatar: updatedProfile.avatar
          }
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(moviesChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  useEffect(() => {
    const handler = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSearchInput(val) {
    setSearchQ(val);
    setShowSearch(true);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setTmdbResults([]); return; }
    setTmdbLoading(true);
    const GENRE_MAP = { 28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",10402:"Music",9648:"Mystery",10749:"Romance",878:"Sci-Fi",53:"Thriller",10752:"War",37:"Western" };
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(val)}&language=en-US&page=1`);
        const data = await res.json();
        setTmdbResults((data.results || []).slice(0, 8).map(m => ({
          id: m.id, title: m.title,
          year: m.release_date ? m.release_date.slice(0, 4) : "N/A",
          genre: m.genre_ids?.[0] ? (GENRE_MAP[m.genre_ids[0]] || "Other") : "Other",
          rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
          poster: m.poster_path || null, synopsis: m.overview || "", tmdb_id: m.id,
        })));
      } catch { setTmdbResults([]); }
      finally { setTmdbLoading(false); }
    }, 400);
  }

  async function handleAddMovie(tmdbMovie) {
    if (movies.find(m => m.tmdb_id === tmdbMovie.tmdb_id)) {
      alert(`"${tmdbMovie.title}" sudah ada di watchlist!`);
      setShowSearch(false); setSearchQ(""); setTmdbResults([]); return;
    }
    let trailerKey = null;
    try {
      const res  = await fetch(`https://api.themoviedb.org/3/movie/${tmdbMovie.tmdb_id}/videos?api_key=${TMDB_KEY}`);
      const data = await res.json();
      const yt   = (data.results || []).find(v => v.site === "YouTube" && v.type === "Trailer");
      trailerKey = yt?.key || null;
    } catch {}

    const newMovie = {
      id: Date.now(),
      tmdb_id: tmdbMovie.tmdb_id,
      title: tmdbMovie.title,
      year: tmdbMovie.year,
      genre: tmdbMovie.genre,
      rating: tmdbMovie.rating,
      poster: tmdbMovie.poster,
      synopsis: tmdbMovie.synopsis,
      trailer_key: trailerKey,
      watched: [],
      status: "none"
    };

    const { error } = await supabase.from("movies").insert([newMovie]);
    if (error) alert("Gagal menambahkan film ke server: " + error.message);

    setShowSearch(false); setSearchQ(""); setTmdbResults([]);
  }

  async function toggleWatch(movieId, person) {
    const targetMovie = movies.find(m => m.id === movieId);
    if (!targetMovie) return;

    const currentWatched = targetMovie.watched || [];
    const nextWatched = currentWatched.includes(person)
      ? currentWatched.filter(w => w !== person)
      : [...currentWatched, person];
    
    const nextStatus = statusFromWatched(nextWatched);

    const { error } = await supabase
      .from("movies")
      .update({ watched: nextWatched, status: nextStatus })
      .eq("id", movieId);

    if (error) alert("Gagal memperbarui status: " + error.message);
  }

  async function saveProfiles(newForm) {
    const { error: errorMe } = await supabase
      .from("profiles")
      .update({ name: newForm.me.name, color: newForm.me.color, avatar: newForm.me.avatar })
      .eq("id", "me");

    const { error: errorPartner } = await supabase
      .from("profiles")
      .update({ name: newForm.partner.name, color: newForm.partner.color, avatar: newForm.partner.avatar })
      .eq("id", "partner");

    if (errorMe || errorPartner) {
      alert("Gagal memperbarui profil di database online.");
    }
  }

  const filterMap = {
    "All": () => true,
    "Unwatched": m => m.status === "none",
    "Watched by Me": m => m.status === "me" || m.status === "both",
    "Watched by Partner": m => m.status === "partner" || m.status === "both",
    "Both Watched": m => m.status === "both",
  };
  const filtered = movies.filter(filterMap[filter]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0f0f1a", fontFamily: "'Inter',system-ui,sans-serif", color: "#fff" }}>

      {/* Sidebar */}
      <aside style={{ width: 240, flexShrink: 0, background: "#13131f", borderRight: "1px solid #1e1e30", display: "flex", flexDirection: "column", padding: "20px 0" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1e1e30" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Menggunakan COLOR_PRIMARY untuk icon background */}
            <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎥</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>MovieDate</div>
              <div style={{ color: "#6B7280", fontSize: 11 }}>Couple's Watchlist</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 14px", borderRadius: 10,
              // Update opasitas background nav aktif menggunakan hex color baru (22 mewakili ~13% opacity)
              background: activeNav === item.id ? `${ACCENT}22` : "transparent",
              border: "none", color: activeNav === item.id ? ACCENT : "#9CA3AF",
              fontWeight: activeNav === item.id ? 700 : 500,
              fontSize: 14, cursor: "pointer", marginBottom: 2, transition: "all .15s",
            }}><span>{item.icon}</span>{item.label}</button>
          ))}
        </nav>
        {/* Profile pill */}
        <div style={{ margin: "0 12px", background: "#1a1a2e", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex" }}>
            <Avatar profile={profiles.me} size={28} />
            <Avatar profile={profiles.partner} size={28} style={{ marginLeft: -8 }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{profiles.me.name} & {profiles.partner.name}</div>
            <div style={{ color: "#34D399", fontSize: 11 }}>● Connected Live</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ padding: "16px 28px", background: "#13131f", borderBottom: "1px solid #1e1e30", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <div ref={searchRef} style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: 16 }}>🔍</span>
            <input value={searchQ} onChange={e => handleSearchInput(e.target.value)} onFocus={() => searchQ && setShowSearch(true)}
              placeholder={TMDB_KEY ? "Search for a movie to add..." : "⚠️ Set VITE_TMDB_API_KEY in .env"}
              style={{ width: "100%", padding: "10px 14px 10px 40px", background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            {showSearch && <SearchDropdown results={tmdbResults} onAdd={handleAddMovie} loading={tmdbLoading} />}
          </div>
          <div style={{ color: "#6B7280", fontSize: 13, whiteSpace: "nowrap" }}>{movies.length} films</div>
        </header>

        {/* Filters */}
        {activeNav === "watchlist" && (
          <div style={{ padding: "12px 28px", background: "#13131f", borderBottom: "1px solid #1e1e30", display: "flex", gap: 8, flexShrink: 0 }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 16px", borderRadius: 20,
                background: filter === f ? ACCENT : "#1a1a2e",
                border: filter === f ? "none" : "1px solid #2a2a3e",
                color: filter === f ? "#fff" : "#9CA3AF",
                fontWeight: filter === f ? 700 : 500,
                fontSize: 13, cursor: "pointer", transition: "all .15s",
              }}>{f}</button>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            {activeNav === "watchlist" && (
              <>
                {movies.length === 0 && (
                  <div style={{ textAlign: "center", marginTop: 80, color: "#6B7280" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#9CA3AF", marginBottom: 8 }}>Watchlist kosong</div>
                    <div style={{ fontSize: 14 }}>Cari film di search bar di atas untuk mulai!</div>
                  </div>
                )}
                {filtered.length > 0 && (
                  <>
                    <div style={{ marginBottom: 16, color: "#6B7280", fontSize: 13 }}>{filtered.length} film{filter !== "All" ? ` · ${filter}` : ""}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16 }}>
                      {filtered.map(m => (
                        <MovieCard key={m.id} movie={m} profiles={profiles} selected={selected?.id === m.id}
                          onClick={mov => setSelected(selected?.id === mov.id ? null : mov)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            {activeNav === "history"   && <HistoryView movies={movies} profiles={profiles} />}
            {activeNav === "analytics" && <AnalyticsView movies={movies} profiles={profiles} />}
            {activeNav === "settings"  && <SettingsView profiles={profiles} onSave={saveProfiles} />}
          </div>
          {selected && activeNav === "watchlist" && (
            <DetailPanel movie={selected} onClose={() => setSelected(null)} onToggleWatch={toggleWatch} profiles={profiles} />
          )}
        </div>
      </div>
    </div>
  );
}