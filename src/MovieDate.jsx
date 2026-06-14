import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase"; 
import "./App.css";

// ── IMPORT ICON PNG LOKAL ─────────────────────────────────────────────────────
import watchlistIcon from "./assets/watchlist.png";
import historyIcon from "./assets/history.png";
import analyticsIcon from "./assets/analytics.png";
import settingsIcon from "./assets/settings.png";
import powerIcon from "./assets/power.png";
import check from "./assets/check.png";
import noidAvatar from "./assets/noid.png";   // 👈 Sesuaikan jika filenya .jpg atau .PNG
import verenAvatar from "./assets/veren.png";
import noidSettingAvatar from "./assets/noid-setting.png";   // 👈 Sesuaikan nama filenya
import verenSettingAvatar from "./assets/veren-setting.png";
// bg
import sidebarBg from "./assets/kupu2.PNG";
import loginBg from "./assets/sincan.png"
// ── PALET WARNA BARU ──────────────────────────────────────────────────────────
const COLOR_PRIMARY   = "#2C5EAD"; 
const COLOR_SECONDARY = "#1591DC"; 
const COLOR_LIGHT     = "#4BB8FA"; 
const COLOR_SOFT      = "#C4E2F5"; 

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

// ── Status Badge ─────────────────────────────────────────────────────────────
// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, profiles }) {
  if (!status || status === "none") return null;

  let badgeText = "";
  let dynamicStyle = {};

  // 1. Jika ditonton berdua (BACKGROUND GRADIENT)
  if (status === "both") {
    badgeText = "Ditonton Berdua";
    dynamicStyle = {
      color: "#fff", // Teks putih agar kontras
      // ── Gradient menyatukan warna profil Noid & Veren! ──
      background: `linear-gradient(135deg, ${profiles.me.color}, ${profiles.partner.color})`, 
      border: "1px solid transparent", // Menjaga ukuran tetap sama dengan badge lain
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)" // Tambahan bayangan agar lebih menonjol
    };
  } 
  // 2. Jika ditonton Noid (Akun Saya)
  else if (status === "me") {
    badgeText = `${profiles.me.name} watched`;
    dynamicStyle = {
      color: profiles.me.color,
      background: "rgba(255, 255, 255, 0.06)",
      border: `1px solid ${profiles.me.color}50`
    };
  } 
  // 3. Jika ditonton Veren (Akun Partner)
  else if (status === "partner") {
    badgeText = `${profiles.partner.name} watched`;
    dynamicStyle = {
      color: profiles.partner.color,
      background: "rgba(255, 255, 255, 0.06)",
      border: `1px solid ${profiles.partner.color}50`
    };
  }

  return (
    <div style={{ 
      display: "inline-block", 
      padding: "4px 10px", 
      borderRadius: 12, 
      fontSize: 11, 
      fontWeight: 600, 
      marginTop: 4,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
      ...dynamicStyle // 👈 Style dinamis disuntikkan ke sini
    }}>
      {badgeText}
    </div>
  );
}
// ── Movie Card ────────────────────────────────────────────────────────────────
function MovieCard({ movie, onClick, selected, profiles }) {
  const [hov, setHov] = useState(false);
  
  // ── LOGIKA PENENTUAN AVATAR ──
  const isWatchedBoth = movie.status === "both";
  const showMeIcon = isWatchedBoth || movie.status === "me";
  const showPartnerIcon = isWatchedBoth || movie.status === "partner";

  const poster = movie.poster
    ? (movie.poster.startsWith("http") ? movie.poster : TMDB_IMG + movie.poster)
    : "https://via.placeholder.com/300x420/1a1a2e/666?text=No+Poster";

  return (
   <div onClick={() => onClick(movie)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ 
        background: "#1a1a2e", 
        borderRadius: 16, 
        overflow: "hidden", 
        cursor: "pointer", 
        border: selected ? `2px solid ${ACCENT}` : "2px solid transparent", 
        position: "relative",
        
        // ── EFEK HOVER MEMBESAR & NAIK (DIKUSTOMISASI) ──
        transform: hov ? "scale(1.06) translateY(-6px)" : "scale(1)", 
        zIndex: hov ? 10 : 1, // 👈 PENTING: Memaksa poster maju ke depan agar tidak tertutup kartu lain
        boxShadow: hov || selected ? "0 15px 40px rgba(0,0,0,0.8)" : "0 2px 16px rgba(0,0,0,0.4)", 
        transition: "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)" // 👈 Animasi dibuat lebih mulus membal
        // ───────────────────────────────────────────────
      }}>
      <div style={{ position: "relative", paddingTop: "150%" }}>
        <img src={poster} alt={movie.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#0f0f1aee 40%,transparent 70%)" }} />
        
        {/* ── BAGIAN BADGE PROFIL (WARNA DINAMIS SESUAI SETTING) ── */}
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", flexDirection: "row-reverse" }}>
          
          {/* 1. Tampilkan Profil Partner - WARNA DINAMIS */}
          {showPartnerIcon && (
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${profiles.partner.color}`, overflow: "hidden", marginLeft: -8, boxShadow: "0 2px 8px rgba(0,0,0,0.5)", background: "#1a1a2e" }}>
              <img src={profiles.partner.avatar} alt={profiles.partner.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* 2. Tampilkan Profil Admin (Saya) - WARNA DINAMIS */}
          {showMeIcon && (
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${profiles.me.color}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", background: "#1a1a2e" }}>
              <img src={profiles.me.avatar} alt={profiles.me.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

        </div>
        {/* ──────────────────────────────────────── */}

{/* ── BAGIAN ICON CHECK (CUSTOM) ── */}
        {isWatchedBoth && (
          <div style={{ 
            position: "absolute", top: 8, left: 8, width: 26, height: 26, 
            borderRadius: "50%", background: ACCENT, display: "flex", 
            alignItems: "center", justifyContent: "center", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)" 
          }}>
            <img 
              src={check}  /* 👈 GANTI DENGAN NAMA FILE ICON ANDA */
              alt="Checked" 
              style={{ width: 26, height: 26, objectFit: "contain" }} 
            />
          </div>
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

// ── Detail Panel & Review System ─────────────────────────────────────────────
function DetailPanel({ movie, onClose, onToggleWatch, onSaveReview, profiles }) {
  // ── 1. STATE ANIMASI ──
  const [isClosing, setIsClosing] = useState(false); 

  const currentRole = localStorage.getItem("my_couple_role") || "me";
  const [commentText, setCommentText] = useState("");
  const [myRating, setMyRating] = useState(movie?.user_ratings?.[currentRole] || 0);
  
  // ── TAMBAHKAN BARIS INI KEMBALI ──
  const reviewsList = movie?.reviews || []; 
  // ────────────────────────────────

  if (!movie) return null;

  const poster = movie.poster
    ? (movie.poster.startsWith("http") ? movie.poster : TMDB_IMG + movie.poster)
    : "https://via.placeholder.com/500x750/1a1a2e/666?text=No+Poster";

  // ... sisa kode ke bawah tetap sama

  // ── 2. BUAT FUNGSI UNTUK MENAHAN CLOSE SELAMA 400ms ──
  function handleClose() {
    setIsClosing(true); // Putar animasi keluar
    setTimeout(() => {
      onClose(); // Tutup panel sungguhan setelah 400ms
      setIsClosing(false); // Reset status
    }, 400); 
  }
  // ─────────────────────────────────────────────────────

  function handleSubmitReview() {
    if (!commentText.trim() && myRating === 0) return;
    onSaveReview(movie.id, commentText, myRating);
    setCommentText("");
  }

  return (
    <div 
      className="hide-scrollbar" 
      style={{ 
        width: 340, flexShrink: 0, background: "#13131f", 
        borderLeft: "1px solid #2a2a3e", display: "flex", 
        flexDirection: "column", overflowY: "auto",
        
        // ── 3. UBAH LOGIKA ANIMASI DI SINI ──
        animation: isClosing 
          ? "slideOutRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards" 
          : "slideInRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
        // ────────────────────────────────────
      }}
    >
      <div style={{ position: "relative" }}>
        <img src={poster} alt={movie.title} style={{ width: "100%", height: 220, objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#13131f 10%,transparent 70%)" }} />
        
        {/* ── 4. UBAH TOMBOL CLOSE AGAR MEMANGGIL handleClose, bukan onClose ── */}
        <button onClick={handleClose} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.5)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>×</button>
      </div>

      {/* ... (SISA KODE DI BAWAHNYA TETAP SAMA) ... */}

      <div style={{ padding: "0 20px 24px" }}>
        <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{movie.title}</h2>
        <div style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 12 }}>{movie.year} • {movie.genre} • ⭐ {movie.rating}/10</div>
        <StatusBadge status={movie.status} profiles={profiles} />
        
        <div style={{ margin: "18px 0 8px", color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Synopsis</div>
        <p style={{ color: "#D1D5DB", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{movie.synopsis || "No synopsis available."}</p>
          
          {/* trailer button */}
         {/* ── 2. TOMBOL TRAILER (GAYA TRANSPARAN) ── */}
        {movie.trailer_key && (
          <a href={`https://www.youtube.com/watch?v=${movie.trailer_key}`} target="_blank" rel="noreferrer"
            onMouseEnter={e => { 
              e.currentTarget.style.background = "#E50914"; // Background jadi merah solid saat disorot
              e.currentTarget.style.color = "#fff";         // Teks jadi putih saat disorot
              e.currentTarget.style.transform = "scale(1.03)"; 
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.background = "transparent"; // 👈 Kembali transparan saat ditinggalkan
              e.currentTarget.style.color = "#E50914";          // 👈 Teks kembali merah
              e.currentTarget.style.transform = "scale(1)"; 
            }}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 8, 
              marginTop: 16, 
              padding: 12, 
              
              // ── PENGATURAN AWAL TRANSPARAN ──
              background: "transparent", 
              border: "1px solid #E50914", // Garis tepi berwarna merah
              color: "#E50914",            // Teks berwarna merah
              // ───────────────────────────────
              
              borderRadius: 10, 
              textDecoration: "none", 
              fontWeight: 700, 
              fontSize: 14,
              transition: "all 0.2s ease-in-out" 
            }}>
            ▶ Watch Trailer
          </a>
        )}
       <div style={{ margin: "18px 0 12px", color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Mark as Watched</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {["me", "partner"].map(key => {
            const p = profiles[key];
            const watched = movie.status === "both" || movie.status === key;
            
            // ── KUNCI JIKA INI BUKAN PROFIL AKUN YANG SEDANG LOGIN ──
            const isNotMyProfile = key !== currentRole;

            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, background: "#1a1a2e", borderRadius: 10, padding: "10px 14px", opacity: isNotMyProfile ? 0.7 : 1 }}>
                <Avatar profile={p} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ color: watched ? "#34D399" : "#6B7280", fontSize: 11 }}>{watched ? "✓ Watched" : "Not watched yet"}</div>
                </div>
                
                {/* ── TOMBOL DIBUAT DINAMIS (BISA KLIK ATAU TERKUNCI) ── */}
                <button 
                  disabled={isNotMyProfile}
                  onClick={() => !isNotMyProfile && onToggleWatch(movie.id, key)} 
                  style={{ 
                    background: isNotMyProfile ? "transparent" : (watched ? "#2a2a3e" : ACCENT), 
                    color: isNotMyProfile ? "#4B5563" : (watched ? "#9CA3AF" : "#fff"), 
                    border: isNotMyProfile ? "1px solid #2a2a3e" : "none", 
                    borderRadius: 8, 
                    padding: "6px 12px", 
                    fontSize: 12, 
                    fontWeight: 600, 
                    cursor: isNotMyProfile ? "not-allowed" : "pointer" 
                  }}
                >
                  {isNotMyProfile ? "mark" : (watched ? "Undo" : "Mark")}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── SEKSI RATING & KOMENTAR SAYA ── */}
        <div style={{ borderTop: "1px solid #2a2a3e", paddingTop: 16 }}>
          <div style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Beri Rating Kamu</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} onClick={() => setMyRating(star)} style={{ fontSize: 24, cursor: "pointer", color: star <= myRating ? "#F59E0B" : "#374151", transition: "color 0.1s" }}>★</span>
            ))}
          </div>

          <div style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Tulis Komentar</div>
          <textarea 
            value={commentText} 
            onChange={e => setCommentText(e.target.value)}
            placeholder="Bagaimana filmnya menurutmu love?..."
            style={{ width: "100%", height: 60, background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 8, color: "#fff", padding: 10, fontSize: 13, resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 10 }}
          />
          <button onClick={handleSubmitReview} style={{ width: "100%", background: profiles.me.color, color: "#fff", border: "none", borderRadius: 8, padding: "8px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Kirim Review</button>
        </div>

        {/* ── TAMPILAN LIST KOMENTAR TERSEDIA ── */}
        <div style={{ marginTop: 24, borderTop: "1px solid #2a2a3e", paddingTop: 16 }}>
          <div style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Komentar & Review</div>
          {reviewsList.length === 0 && <div style={{ fontSize: 12, color: "#4B5563" }}>Belum ada komentar dari kalian.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reviewsList.map((rev, i) => {
              const isFromMe = rev.role === currentRole;
              const prof = isFromMe ? profiles[currentRole] : profiles[rev.role];
              return (
                <div key={i} style={{ background: "#1a1a2e", padding: 10, borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Avatar profile={prof} size={20} />
                    <span style={{ fontWeight: 600, fontSize: 12, color: prof?.color }}>{prof?.name}</span>
                    {rev.rating > 0 && <span style={{ fontSize: 11, color: "#F59E0B", marginLeft: "auto" }}>{"★".repeat(rev.rating)}</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#D1D5DB", lineHeight: 1.4 }}>{rev.text}</p>
                </div>
              );
            })}
          </div>
        </div>
 

      </div>
    </div>
  );
}

function SearchDropdown({ results, onAdd, loading }) {
  if (!results.length && !loading) return null;
  return (
    <div className="hide-scrollbar" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#1a1a2e", borderRadius: 12, border: "1px solid #2a2a3e", zIndex: 100, overflow: "hidden", boxShadow: "0 8px 32px #000a", maxHeight: 360, overflowY: "auto" }}>
      {loading && <div style={{ padding: 20, textAlign: "center", color: "#6B7280", fontSize: 13 }}>Searching...</div>}
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

function AnalyticsView({ movies, profiles }) {
  const myCount = movies.filter(m => m.status === "both" || m.status === "me").length;
  const ptCount = movies.filter(m => m.status === "both" || m.status === "partner").length;
  const total = movies.length || 1;
  const genreMap = {};
  movies.forEach(m => { if (m.genre) genreMap[m.genre] = (genreMap[m.genre] || 0) + 1; });
  const genres = Object.entries(genreMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div style={{ padding: 32, color: "#fff", maxWidth: 800 }}>
      <h2 style={{ fontfamily :"gantung, sans-serif",marginBottom: 24, fontSize: 24, fontWeight: 800 }}>Who Watched More?</h2>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ── KOMPONEN BARU: DAFTAR KOMENTAR & RATING TERTINGGI ──
function TopReviewsView({ movies, profiles }) {
  // 1. Mengumpulkan semua review dari seluruh film ke dalam satu wadah
  let allReviews = [];
  movies.forEach(movie => {
    if (movie.reviews && movie.reviews.length > 0) {
      movie.reviews.forEach(rev => {
        allReviews.push({
          ...rev,
          movieTitle: movie.title,
          moviePoster: movie.poster,
          movieYear: movie.year
        });
      });
    }
  });

  // 2. Mengurutkan berdasarkan rating tertinggi (bintang 5 dulu), lalu review terbaru
  allReviews.sort((a, b) => b.rating - a.rating || new Date(b.created_at || 0) - new Date(a.created_at || 0));

  return (
    <div style={{ padding: 32, color: "#fff", maxWidth: 800 }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 800 }}>⭐ Top Reviews & Ratings</h2>
      
      {allReviews.length === 0 && (
        <div style={{ color: "#6B7280", fontSize: 14 }}>Belum ada review atau rating yang diberikan dari kalian berdua.</div>
      )}
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {allReviews.map((rev, idx) => {
          const prof = profiles[rev.role];
          const poster = rev.moviePoster 
            ? (rev.moviePoster.startsWith("http") ? rev.moviePoster : "https://image.tmdb.org/t/p/w300" + rev.moviePoster) 
            : "https://via.placeholder.com/60x90/1a1a2e/666?text=?";
          
          return (
            <div key={idx} style={{ display: "flex", gap: 16, background: "#1a1a2e", borderRadius: 16, padding: "16px", border: `1px solid ${prof?.color}40`, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
              {/* Poster Film */}
              <img src={poster} alt={rev.movieTitle} style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              
              {/* Konten Review */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{rev.movieTitle} <span style={{fontSize: 12, color: "#9CA3AF", fontWeight: 400}}>({rev.movieYear})</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <Avatar profile={prof} size={20} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: prof?.color }}>{prof?.name}</span>
                    </div>
                  </div>
                  
                  {/* Indikator Bintang */}
                  <div style={{ fontSize: 16, color: "#F59E0B", letterSpacing: 2 }}>
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </div>
                </div>

                {/* Kotak Teks Komentar */}
                {rev.text && (
                  <p style={{ margin: 0, fontSize: 13, color: "#D1D5DB", lineHeight: 1.5, fontStyle: "italic", background: "#13131f", padding: "10px 14px", borderRadius: 8, borderLeft: `3px solid ${prof?.color}` }}>
                    "{rev.text}"
                  </p>
                )}
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// function HistoryView({ movies, profiles }) {
//   const watched = movies.filter(m => m.status !== "none");
//   return (
//     <div style={{ padding: 32, color: "#fff", maxWidth: 800 }}>
//       <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 800 }}>Watch History</h2>
//       {watched.length === 0 && <div style={{ color: "#6B7280" }}>Belum ada film yang ditonton.</div>}
//       <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//         {watched.map(m => {
//           const poster = m.poster ? (m.poster.startsWith("http") ? m.poster : TMDB_IMG + m.poster) : "https://via.placeholder.com/48x64/1a1a2e/666?text=?";
//           return (
//             <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 16, background: "#1a1a2e", borderRadius: 12, padding: "12px 16px" }}>
//               <img src={poster} alt={m.title} style={{ width: 48, height: 64, objectFit: "cover", borderRadius: 8 }} />
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontWeight: 700, fontSize: 15 }}>{m.title}</div>
//                 <div style={{ color: "#9CA3AF", fontSize: 12 }}>{m.year} • {m.genre} • ⭐ {m.rating}</div>
//               </div>
//               <StatusBadge status={m.status} profiles={profiles} />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

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

// ── SettingsView (Sistem Simpan Aman & Indikator Loading) ──
function SettingsView({ profiles, onSave, onLogout }) {
  const currentRole = localStorage.getItem("my_couple_role") || "me";

  const [form, setForm] = useState({
    me:      { ...profiles.me },
    partner: { ...profiles.partner },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ me: { ...profiles.me }, partner: { ...profiles.partner } });
  }, [profiles]);

  function handleChange(field, value) {
    setForm(prev => ({
      ...prev,
      [currentRole]: { ...prev[currentRole], [field]: value }
    }));
  }

  async function handleSave() {
    setSaving(true);
    const success = await onSave(form); // Harus tunggu database selesai!
    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

return (
    <div style={{ padding: 32, color: "#fff", position: "relative", width: "100%" }}>
      
      {/* ── BAGIAN BARU: GAMBAR KARAKTER MUNCUL DI KANAN ── */}
      <img
        src={currentRole === "me" ? noidSettingAvatar : verenSettingAvatar} /* 👈 Menggunakan import gambar sebelumnya */
        alt="Karakter Profil"
        style={{
          position: "fixed",
          bottom: 0,
          right: "1.5%", // Sedikit digeser ke kanan agar nyandar di tepi layar
          height: "85vh", // Mengisi 85% tinggi layar dari bawah
          objectFit: "contain",
          zIndex: 0, // Berada di latar belakang
          pointerEvents: "none", // 👈 PENTING: Agar gambar tidak memblokir klik mouse ke form/tombol
          filter: "drop-shadow(-20px 20px 30px rgba(0,0,0,0.6))", // Efek bayangan dramatis
          transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" // Animasi mulus saat ganti akun
        }}
      />

      {/* ── KONTEN SETTINGS UTAMA (DIBUNGKUS zIndex TINGGI AGAR BISA DIKLIK) ── */}
      <div style={{ maxWidth: 600, position: "relative", zIndex: 10 }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Settings</h2>
          <button 
            onClick={onLogout} 
            onMouseEnter={e => { 
              e.currentTarget.style.background = "#EF4444"; 
              e.currentTarget.style.color = "#fff";         
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.background = "transparent"; 
              e.currentTarget.style.color = "#EF4444";          
            }}
            style={{ 
              background: "transparent", border: "1px solid #EF4444", color: "#EF4444", 
              borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, 
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
            }}>
            <img src={powerIcon} alt="Logout" style={{ width: 16, height: 16, objectFit: "contain" }} />
            Keluar Akun
          </button>
        </div>
        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 32 }}>Kamu hanya bisa mengubah profil kamu sendiri.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          {["me", "partner"].map(key => {
            const p = form[key];
            const isNotMyProfile = key !== currentRole;
            const label = key === currentRole ? "The Admin" : "💜 My Love";

            return (
              <div key={key} style={{ background: "#1a1a2e", borderRadius: 16, padding: 24, opacity: isNotMyProfile ? 0.6 : 1, border: isNotMyProfile ? "1px solid transparent" : `1px solid ${COLOR_SECONDARY}`, transition: "all 0.3s" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: isNotMyProfile ? "#6B7280" : COLOR_LIGHT, marginBottom: 20 }}>{label}</div>

                {/* Avatar */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20, pointerEvents: isNotMyProfile ? "none" : "auto" }}>
                  <div style={{ position: "relative" }}>
                    {isNotMyProfile ? (
                      <Avatar profile={p} size={80} />
                    ) : (
                      <AvatarUpload profile={p} onUpload={url => handleChange("avatar", url)} size={80} />
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {isNotMyProfile ? "Profil milik partner" : "Klik foto untuk ganti"}
                  </div>
                  {p.avatar && !isNotMyProfile && (
                    <button onClick={() => handleChange("avatar", null)} style={{ background: "transparent", border: "1px solid #3a3a4e", color: "#9CA3AF", borderRadius: 8, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>
                      Hapus Foto
                    </button>
                  )}
                </div>

                {/* Name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 6, color: "#6B7280", fontSize: 12 }}>Nama</label>
                  <input
                    value={p.name}
                    disabled={isNotMyProfile}
                    onChange={e => handleChange("name", e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", background: isNotMyProfile ? "#141424" : "#0f0f1a", border: "1px solid #2a2a3e", borderRadius: 8, color: isNotMyProfile ? "#6B7280" : "#fff", outline: "none" }}
                  />
                </div>

                {/* Color */}
                <div>
                  <label style={{ display: "block", marginBottom: 6, color: "#6B7280", fontSize: 12 }}>Warna Avatar</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      type="color"
                      value={p.color}
                      disabled={isNotMyProfile}
                      onChange={e => handleChange("color", e.target.value)}
                      style={{ width: 44, height: 36, borderRadius: 8, border: "none", background: "none", cursor: isNotMyProfile ? "not-allowed" : "pointer", padding: 2 }}
                    />
                    <div style={{ background: p.color, borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.color}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleSave} disabled={saving} style={{ background: saving ? "#374151" : saved ? "#34D399" : ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "13px 32px", fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer", width: "100%" }}>
          {saving ? "Menyimpan ke server..." : saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
        </button>
      
      </div> {/* 👈 Penutup kotak konten form */}
    </div>
  );
}

const NAV_ITEMS = [
  { id: "watchlist", label: "Shared Watchlist", icon: watchlistIcon },
  { id: "reviews",   label: "Top Reviews",      icon: historyIcon },
  { id: "analytics", label: "Who Watched More", icon: analyticsIcon },
  { id: "settings",  label: "Settings",         icon: settingsIcon },
];
const FILTERS = ["All", "Unwatched", "Watched by Me", "Watched by Partner", "Both Watched"];
// ── KOMPONEN BARU: FILTER MELUNCUR ALA IOS ──
function FilterTabs({ filter, setFilter }) {
  const [pillStyle, setPillStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Memberi jeda 10ms agar teks ter-render dulu sebelum diukur
    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Cari tombol mana yang sedang aktif
        const activeBtn = containerRef.current.querySelector('.active-filter');
        if (activeBtn) {
          // Ukur posisi dan lebarnya, lalu tembakkan kotak biru ke titik tersebut
          setPillStyle({
            left: activeBtn.offsetLeft,
            top: activeBtn.offsetTop,
            width: activeBtn.offsetWidth,
            height: activeBtn.offsetHeight,
            opacity: 1
          });
        }
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [filter]);

  return (
    <div 
      ref={containerRef}
      className="hide-scrollbar" 
      style={{ 
        padding: "12px 28px", 
        background: "#13131f", 
        borderBottom: "1px solid #1e1e30", 
        display: "flex", 
        gap: 8, 
        flexShrink: 0, 
        position: "relative",
        overflowX: "auto" 
      }}
    >
      {/* ── 1. KOTAK BIRU PELUNCUR (SLIDING PILL) ── */}
      <div style={{
        position: "absolute",
        left: pillStyle.left,
        top: pillStyle.top,
        width: pillStyle.width,
        height: pillStyle.height,
        opacity: pillStyle.opacity,
        background: ACCENT, // Menggunakan warna biru utama Anda
        borderRadius: 20,
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)", // Efek mulus seperti karet
        zIndex: 0
      }} />

      {/* ── 2. TOMBOL TEKS FILTER ── */}
      {FILTERS.map(f => {
        const isActive = filter === f;
        return (
          <button 
            key={f} 
            className={isActive ? "active-filter" : ""} // Penanda untuk diukur
            onClick={() => setFilter(f)} 
            style={{ 
              padding: "6px 16px", 
              borderRadius: 20, 
              background: "transparent", // Dikosongkan karena sudah pakai peluncur
              border: isActive ? "1px solid transparent" : "1px solid #2a2a3e", 
              color: isActive ? "#fff" : "#9CA3AF", 
              fontWeight: isActive ? 700 : 500, 
              fontSize: 13, 
              cursor: "pointer", 
              position: "relative",
              zIndex: 1, // Pastikan teks di atas kotak biru
              transition: "color 0.2s",
              whiteSpace: "nowrap"
            }}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
// ─────────────────────────────────────────────

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MovieDate() {
  const [userRole, setUserRole]       = useState(localStorage.getItem("my_couple_role"));
  const [activeNav, setActiveNav]     = useState("watchlist");
  const [filter, setFilter]           = useState("All");
  const [sortBy, setSortBy] = useState("title"); // Default urut abjad
  const [filterGenre, setFilterGenre] = useState("All");
  const [selected, setSelected]       = useState(null);
  const [searchQ, setSearchQ]         = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [showSearch, setShowSearch]   = useState(false);
  
  const [movies, setMovies]           = useState([]);
  const [profiles, setProfiles]       = useState(DEFAULT_PROFILES);

  const searchRef  = useRef(null);
  const debounceRef = useRef(null);

  function handleSelectRole(role) {
      localStorage.setItem("my_couple_role", role);
      setUserRole(role);
      
      // ── KODE BARU: PAKSA PINDAH KE HALAMAN WATCHLIST ──
      setActiveNav("watchlist"); 
      setFilter("Unwatched");
    }

  function handleLogout() {
    localStorage.removeItem("my_couple_role");
    setUserRole(null);
  }

  useEffect(() => {
    async function fetchMovies() {
      const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false });
      if (!error && data) setMovies(data);
    }

    async function fetchProfiles() {
      const { data, error } = await supabase.from("profiles").select("*");
      if (!error && data) {
        // Data tidak akan ditukar-tukar posisinya lagi, jadi aman!
        const dbMe = data.find(p => p.id === "me");
        const dbPartner = data.find(p => p.id === "partner");

        setProfiles({
          me: { name: dbMe?.name || "You", color: dbMe?.color || "#1591DC", avatar: dbMe?.avatar || null },
          partner: { name: dbPartner?.name || "Partner", color: dbPartner?.color || "#4BB8FA", avatar: dbPartner?.avatar || null },
        });
      }
    }

    fetchMovies();
    fetchProfiles();

    const moviesChannel = supabase.channel("realtime-movies")
        .on("postgres_changes", { event: "*", scheme: "public", table: "movies" }, (payload) => {
          if (payload.eventType === "INSERT") {
            setMovies(prev => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setMovies(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
            setSelected(prev => prev && prev.id === payload.new.id ? payload.new : prev);
          } else if (payload.eventType === "DELETE") {
            setMovies(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }).subscribe();

    const profilesChannel = supabase.channel("realtime-profiles")
        .on("postgres_changes", { event: "UPDATE", scheme: "public", table: "profiles" }, () => {
          fetchProfiles(); 
        }).subscribe();

      return () => {
        supabase.removeChannel(moviesChannel);
        supabase.removeChannel(profilesChannel);
      };
  }, []); // Hapus userRole dari bracket agar login screen bisa me-load avatar

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
    
    // Pemetaan genre gabungan Movie & TV Show
    const GENRE_MAP = { 28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",10402:"Music",9648:"Mystery",10749:"Romance",878:"Sci-Fi",53:"Thriller",10752:"War",37:"Western", 10759:"Action & Adventure", 10762:"Kids", 10763:"News", 10764:"Reality", 10765:"Sci-Fi & Fantasy", 10766:"Soap", 10767:"Talk", 10768:"War & Politics" };
    
    debounceRef.current = setTimeout(async () => {
      try {
        // ── KUNCI PERUBAHAN: Mengubah 'movie' menjadi 'multi' ──
        const res  = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(val)}&language=en-US&page=1`);
        const data = await res.json();
        
        // Filter hasil agar hanya mengambil 'movie' dan 'tv' saja (membuang hasil berupa nama orang/aktor)
        const filteredResults = (data.results || []).filter(item => item.media_type === "movie" || item.media_type === "tv");

          setTmdbResults(filteredResults.slice(0, 50).map(m => {
          // TV Series menggunakan 'name' & 'first_air_date', Movie menggunakan 'title' & 'release_date'
          const title = m.title || m.name;
          const date = m.release_date || m.first_air_date;
          const year = date ? date.slice(0, 4) : "N/A";
          const typeLabel = m.media_type === "tv" ? "Series" : "Movie";

          // ── KUNCI PERUBAHAN: MENGAMBIL SEMUA GENRE ──
          // Kita map semua ID, filter yang valid, lalu gabungkan dengan koma.
          // (Opsional: .slice(0, 3) digunakan agar maksimal hanya 3 genre yang masuk supaya teks tidak kepanjangan di HP)
          const genreList = m.genre_ids && m.genre_ids.length > 0
            ? m.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 3).join(", ")
            : "Other";

          return {
            id: m.id, 
            title: title,
            year: year,
            genre: `${typeLabel} • ${genreList}`, // 👈 Memasukkan gabungan genre ke sini
            rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
            poster: m.poster_path || null, 
            synopsis: m.overview || "", 
            tmdb_id: m.id,
          };
        }));
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
      status: "none",
      reviews: [],
      user_ratings: {}
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

    const { error } = await supabase.from("movies").update({ watched: nextWatched, status: nextStatus }).eq("id", movieId);
    if (error) alert("Gagal memperbarui status: " + error.message);
  }

  async function handleSaveReview(movieId, reviewText, starRating) {
    const target = movies.find(m => m.id === movieId);
    if (!target) return;

    const currentRoleActive = userRole || localStorage.getItem("my_couple_role");
    const nextRatings = { ...(target.user_ratings || {}), [currentRoleActive]: starRating };

    let nextReviews = [...(target.reviews || [])];
    if (reviewText.trim()) {
      nextReviews.push({ role: currentRoleActive, text: reviewText, rating: starRating, created_at: new Date().toISOString() });
    }

    const { error } = await supabase.from("movies").update({ user_ratings: nextRatings, reviews: nextReviews }).eq("id", movieId);
    if (error) alert("Gagal menyimpan review: " + error.message);
  }

  // ── FUNGSI SAVE PROFIL YANG SUDAH DIPERBAIKI ──
  async function saveProfiles(newForm) {
    const currentRole = localStorage.getItem("my_couple_role");
    if (!currentRole) return false; // Kembalikan false jika gagal

    const myUpdatedData = newForm[currentRole];

    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: myUpdatedData.name,
        color: myUpdatedData.color,
        avatar: myUpdatedData.avatar
      })
      .eq("id", currentRole)
      .select(); 

    if (error) {
      alert("Gagal menyimpan ke database: " + error.message);
      return false;
    } else {
      setProfiles(prev => ({
        ...prev,
        [currentRole]: { ...prev[currentRole], ...myUpdatedData }
      }));
      return true; // Beri tahu UI bahwa simpan sukses
    }
  }

  const filterMap = {
    "All": () => true,
    "Unwatched": m => m.status === "none",
    "Watched by Me": m => m.status === userRole || m.status === "both",
    "Watched by Partner": m => m.status === (userRole === "me" ? "partner" : "me") || m.status === "both",
    "Both Watched": m => m.status === "both",
  };
  const filtered = movies.filter(filterMap[filter]);

  // ── LOGIKA BARU: FILTER GENRE & SORTING ──
  // 1. Mengumpulkan semua genre unik dari daftar film
  const availableGenres = Array.from(new Set(
    movies.flatMap(m => m.genre ? m.genre.replace(/Movie • |Series • /g, "").split(", ") : [])
  )).filter(Boolean).sort();

  // 2. Memproses film (Saring Genre lalu Urutkan)
  const processedMovies = filtered
    .filter(m => filterGenre === "All" || (m.genre && m.genre.includes(filterGenre)))
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title); // Default: A - Z
      if (sortBy === "newest") return parseInt(b.year || 0) - parseInt(a.year || 0); // Tahun terbaru
      if (sortBy === "rating") return parseFloat(b.rating || 0) - parseFloat(a.rating || 0); // Rating tertinggi
      return 0;
    });
  // ─────────────────────────────────────────
// ── SCREEN 1: LOGIN PILIHAN USER ──
  if (!userRole) {
    return (
      <div style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        
        // ── PENGATURAN BACKGROUND AMAN ──
        backgroundImage: `linear-gradient(rgba(15, 15, 26, 0.6), rgba(15, 15, 26, 0.6)), url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#0f0f1a",
        // ────────────────────────────────
        
        fontFamily: "'Inter',system-ui,sans-serif", 
        color: "#fff" 
      }}>
        <div style={{ textAlign: "center", marginBottom: 40, zIndex: 10 }}>
          <h1 style={{ fontFamily: "judul, sans-serif", fontSize: 80,color:"#AACCD6", fontWeight: 900, margin: "0 0 8px", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>MovieDate</h1>
          <p style={{ fontFamily: "tulisan, sans-serif",fontSize: 15,color: "#E5E7EB", margin: 0, textShadow: "0 1px 5px rgba(0,0,0,0.8)" }}>Nonton apa ya hari ni...</p>
        </div>

<div style={{ display: "flex", gap: 60, width: "100%", maxWidth: 600, justifyContent: "center", padding: "0 20px", boxSizing: "border-box", zIndex: 10 }}>
          
          {/* ── GAMBAR KLIK AKUN SAYA (NOID) ── */}
          <div 
            onClick={() => handleSelectRole("me")} 
            onMouseEnter={e => { 
              e.currentTarget.style.transform = "scale(1.1) translateY(-10px)";
              e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 15px 25px rgba(21, 145, 220, 0.6))"; 
              e.currentTarget.querySelector("span").style.color = COLOR_SECONDARY; 
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"; 
              e.currentTarget.querySelector("span").style.color = "#fff"; 
            }}
            style={{ 
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, 
              transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)" 
            }}>
            
            {/* 👇 KODE YANG DIPERBAIKI: Langsung tembak ke file noid.png 👇 */}
            <img 
              src={noidAvatar}
              alt="Noid" 
              style={{ 
                width: 300, height: 300, 
                objectFit: "contain", // 👈 Ubah jadi 'contain' agar kartunnya tidak terpotong
                transition: "all 0.3s ease",
                filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"
              }} 
            />
            <span style={{ fontFamily: "nama, sans-serif", fontWeight: 100, fontSize: 40, color: "#fff", transition: "color 0.2s ease-in-out", textShadow: "0 4px 10px rgba(0,0,0,0.6)" }}>
              Noid
            </span>
          </div>

          {/* ── GAMBAR KLIK AKUN PARTNER (VEREN) ── */}
          <div 
            onClick={() => handleSelectRole("partner")} 
            onMouseEnter={e => { 
              e.currentTarget.style.transform = "scale(1.1) translateY(-10px)";
              e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 15px 25px rgba(75, 184, 250, 0.6))"; 
              e.currentTarget.querySelector("span").style.color = COLOR_LIGHT; 
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"; 
              e.currentTarget.querySelector("span").style.color = "#fff"; 
            }}
            style={{ 
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, 
              transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)" 
            }}>
            
            {/* 👇 KODE YANG DIPERBAIKI: Langsung tembak ke file veren.png 👇 */}
            <img 
              src={verenAvatar} 
              alt="Veren" 
              style={{ 
                width: 280, height: 280, 
                objectFit: "contain", // 👈 Ubah jadi 'contain' agar kartunnya tidak terpotong
                transition: "all 0.3s ease",
                filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"
              }} 
            />
            <span style={{ fontFamily: "nama, sans-serif", fontWeight: 100, fontSize: 40, color: "#fff", transition: "color 0.2s ease-in-out", textShadow: "0 4px 10px rgba(0,0,0,0.6)" }}>
              Veren
            </span>
          </div>

        

        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0f0f1a", fontFamily: "'Inter',system-ui,sans-serif", color: "#fff" }}>
     <aside style={{ 
        width: 240, 
        flexShrink: 0, 
        
        // ── PENGATURAN BACKGROUND GAMBAR LOKAL ──
        backgroundImage: `url(${sidebarBg})`,
        backgroundSize: "cover",       // Memastikan gambar memenuhi seluruh area sidebar
        backgroundPosition: "center",  // Menjaga gambar tetap di tengah
        // ────────────────────────────────────────

        borderRight: "1px solid #1e1e30", 
        display: "flex", 
        flexDirection: "column", 
        padding: "20px 0" 
      }}>
        <div style={{ padding: "0 20px 5px", borderBottom: "1px solid #1e1e30", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="MovieDate Logo" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }} />
          <div><div style={{ fontFamily: "judul, sans-serif",fontWeight: 100, fontSize: 26 }}>MovieDate</div><div style={{ color: "#AACCD6", fontSize: 11, textAlign: "center" }}>Couple's Watchlist</div></div>
        </div>
          <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
          
          {/* ── 1. KOTAK MELUNCUR (SLIDING INDICATOR) ── */}
          {NAV_ITEMS.findIndex(item => item.id === activeNav) !== -1 && (
            <div style={{
              position: "absolute",
              top: 16,     // Menyesuaikan dengan padding-top dari nav
              left: 12,    // Menyesuaikan dengan padding-left dari nav
              right: 12,   // Menyesuaikan dengan padding-right dari nav
              height: 40,  // Tinggi tetap untuk tombol
              background: "rgba(255, 255, 255, 0.15)", // Warna highlight menu
              borderRadius: 10,
              
              // Rumus peluncuran: (Tinggi Tombol 40 + Jarak Gap 4) * Index Aktif
              transform: `translateY(${NAV_ITEMS.findIndex(item => item.id === activeNav) * 44}px)`,
              transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)", // Efek membal super mulus
              zIndex: 0
            }} />
          )}

          {/* ── 2. TOMBOL MENU ASLI ── */}
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ 
                height: 40, // Tinggi pasti agar rumus meluncurnya akurat
                display: "flex", alignItems: "center", gap: 10, width: "100%", 
                padding: "0 14px", borderRadius: 10, 
                border: "none", 
                
                // Background dihilangkan karena digantikan kotak peluncur
                background: "transparent", 
                color: isActive ? "#AACCD6" : "#9CA3AF", 
                fontWeight: isActive ? 700 : 500, 
                fontSize: 14, cursor: "pointer", 
                
                // Penting agar teks & icon berada di atas kotak peluncur
                position: "relative", 
                zIndex: 1,
                
                transition: "color .2s" 
              }}>
                <img src={item.icon} alt={item.label} style={{ width: 18, height: 18, objectFit: "contain", opacity: isActive ? 1 : 0.6, transition: "opacity .2s" }} />
                {item.label}
              </button>
            );
          })}
        </nav>
{/* Profile pill (konek life design)*/}
        <div style={{ 
          margin: "0 12px", 
          // ── UBAH BACKGROUND DI SINI ──
          background: "rgba(255, 255, 255, 0.1)", // Warna putih transparan 10%
          backdropFilter: "blur(5px)",            // Opsional: memberi efek buram kaca
          border: "1px solid rgba(255, 255, 255, 0.1)", // Opsional: garis tepi tipis agar estetik
          // ────────────────────────────
          borderRadius: 12, 
          padding: "12px 14px", 
          display: "flex", 
          alignItems: "center", 
          gap: 10 
        }}>
          <div style={{ display: "flex" }}>
            <Avatar profile={profiles.me} size={28} />
            <Avatar profile={profiles.partner} size={28} style={{ marginLeft: -8 }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{profiles.me.name} & {profiles.partner.name}</div>
            <div style={{ color: "#34D399", fontSize: 11 }}>● Connected Live</div>
          </div>
        </div>
        {/* ── TAMBAHKAN KODE INI DI BAWAH KOTAK PROFIL ── */}
        <div style={{ margin: "16px 12px 0", textAlign: "center", fontSize: 12, color: "#6B7280" }}>
          Login sebagai: <span style={{ color: profiles[userRole]?.color, fontWeight: 700 }}>{profiles[userRole]?.name}</span>
        </div>
        {/* ─────────────────────────────────────────────── */}
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
<header style={{ padding: "16px 28px", background: "#13131f", borderBottom: "1px solid #1e1e30", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <div ref={searchRef} style={{ flex: 1, position: "relative" }}>
            <img src="/search.png" alt="Search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, objectFit: "contain" }} />
            <input value={searchQ} onChange={e => handleSearchInput(e.target.value)} onFocus={() => searchQ && setShowSearch(true)} placeholder={TMDB_KEY ? "tambahkan film atau seriesmu love..." : "⚠️ Set VITE_TMDB_API_KEY in .env"} style={{ width: "100%", padding: "10px 14px 10px 40px", background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            {showSearch && <SearchDropdown results={tmdbResults} onAdd={handleAddMovie} loading={tmdbLoading} />}
          </div>
          
          {/* ── BAGIAN BARU: TOMBOL FILTER & SORT ── */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
            {/* 1. Dropdown Filter by Genre */}
            <select 
              value={filterGenre} 
              onChange={e => setFilterGenre(e.target.value)}
              style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#9CA3AF", padding: "8px 12px", borderRadius: 8, fontSize: 13, outline: "none", cursor: "pointer", fontWeight: 600 }}
            >
              <option value="All">Filter: All</option>
              {availableGenres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* 2. Dropdown Sort by */}
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#9CA3AF", padding: "8px 12px", borderRadius: 8, fontSize: 13, outline: "none", cursor: "pointer", fontWeight: 600 }}
            >
              <option value="title">Sort: A - Z</option>
              <option value="newest">Sort: Newest</option>
              <option value="rating">Sort: Top Rated</option>
            </select>
          </div>
        </header>
        {activeNav === "watchlist" && (
          <div style={{ padding: "12px 28px", background: "#13131f", borderBottom: "1px solid #1e1e30", display: "flex", gap: 8, flexShrink: 0 }}>
            {FILTERS.map(f => <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, background: filter === f ? ACCENT : "#1a1a2e", border: filter === f ? "none" : "1px solid #2a2a3e", color: filter === f ? "#fff" : "#9CA3AF", fontWeight: filter === f ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all .15s" }}>{f}</button>)}
          </div>
        )}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div className="hide-scrollbar"style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            {activeNav === "watchlist" && (
              <>
                {movies.length === 0 && (
                  <div style={{ textAlign: "center", marginTop: 80, color: "#6B7280" }}>
                    <img src="/Untitled-4.png" alt="Watchlist Kosong" style={{ width: 200, height: 200, objectFit: "contain", marginBottom: 16, display: "block", marginLeft: "auto", marginRight: "auto" }} />
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#9CA3AF", marginBottom: 8 }}>Watchlist kosong</div>
                    <div style={{ fontSize: 14 }}>Cari film di search bar di atas untuk mulai!</div>
                  </div>
                )}
                  {processedMovies.length > 0 && (
                  <>
                    {/* 1. Ubah jumlah filmnya */}
                    <div style={{ marginBottom: 16, color: "#6B7280", fontSize: 13 }}>
                      {processedMovies.length} film {filterGenre !== "All" ? `· ${filterGenre}` : ""}
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16 }}>
                      {/* 2. Ubah mapping-nya menjadi processedMovies */}
                      {processedMovies.map(m => (
                        <MovieCard key={m.id} movie={m} profiles={profiles} selected={selected?.id === m.id} onClick={mov => setSelected(selected?.id === mov.id ? null : mov)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            {activeNav === "history"   && <HistoryView movies={movies} profiles={profiles} />}
            {activeNav === "analytics" && <AnalyticsView movies={movies} profiles={profiles} />}
            {activeNav === "settings"  && <SettingsView profiles={profiles} onSave={saveProfiles} onLogout={handleLogout} />}
          </div>
          {selected && activeNav === "watchlist" && <DetailPanel movie={selected} onClose={() => setSelected(null)} onToggleWatch={toggleWatch} onSaveReview={handleSaveReview} profiles={profiles} />}
        </div>
      </div>
    </div>
  );
}