// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdO1MPq5I6Fg9ynwINabduKUZLn_t7xgg",
  authDomain: "moviedate-2220e.firebaseapp.com",
  projectId: "moviedate-2220e",
  storageBucket: "moviedate-2220e.firebasestorage.app",
  messagingSenderId: "411256165078",
  appId: "1:411256165078:web:497ef1b30e69523553ef77",
  measurementId: "G-HGZEQ17M4K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import "./App.css";
import STICKERS from "./stickers";
// ── IMPORT ICON PNG LOKAL ─────────────────────────────────────────────────────
import watchlistIcon from "./assets/watchlist.png";
import historyIcon from "./assets/history.png";
import analyticsIcon from "./assets/analytics.png";
import settingsIcon from "./assets/settings.png";
import powerIcon from "./assets/power.png";
import check from "./assets/check.png";
import deleteIcon from "./assets/bin.png"; 
import back from "./assets/back-arrow.png"; 
import maju from "./assets/forward.png"; 
import hapus from "./assets/eraser.png"; 
import keyboard from "./assets/keyboard.png"; 
import gambar from "./assets/paint.png"; 
import lautBg from "./assets/laut.png";


import noidAvatar from "./assets/noid.png"; 
import verenAvatar from "./assets/veren.png";
import noidSettingAvatar from "./assets/noid-setting.png"; 
import verenSettingAvatar from "./assets/veren-setting.png";
import kosong from "./assets/kosong.png";
import sidebarBg from "./assets/kupu2.PNG";
import loginBg from "./assets/sincan.png";


// ── PALET WARNA BARU ──────────────────────────────────────────────────────────
const COLOR_PRIMARY = "#2C5EAD";
const COLOR_SECONDARY = "#1591DC";
const COLOR_LIGHT = "#4BB8FA";

const ACCENT = COLOR_PRIMARY;
const YOU_COLOR = COLOR_SECONDARY;
const PARTNER_COLOR = COLOR_LIGHT;
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w300";

const DEFAULT_PROFILES = {
  me: { name: "You", color: YOU_COLOR, avatar: null },
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
      <img
        src={profile.avatar}
        alt={letter}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #1a1a2e", ...s }}
      />
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: profile?.color || "#666", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, fontWeight: 700, flexShrink: 0, border: "2px solid #1a1a2e", ...s,
      }}
    >
      {letter}
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, profiles }) {
  if (!status || status === "none") return null;

  let badgeText = "";
  let dynamicStyle = {};

  if (status === "both") {
    badgeText = "Ditonton Berdua";
    dynamicStyle = {
      color: "#fff",
      background: `linear-gradient(135deg, ${profiles.me.color}, ${profiles.partner.color})`,
      border: "1px solid transparent",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    };
  } else if (status === "me") {
    badgeText = `${profiles.me.name} watched`;
    dynamicStyle = {
      color: profiles.me.color,
      background: "rgba(255, 255, 255, 0.06)",
      border: `1px solid ${profiles.me.color}50`,
    };
  } else if (status === "partner") {
    badgeText = `${profiles.partner.name} watched`;
    dynamicStyle = {
      color: profiles.partner.color,
      background: "rgba(255, 255, 255, 0.06)",
      border: `1px solid ${profiles.partner.color}50`,
    };
  }

  return (
    <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%", ...dynamicStyle }}>
      {badgeText}
    </div>
  );
}

// ── Movie Card ────────────────────────────────────────────────────────────────
function MovieCard({ movie, onClick, selected, profiles }) {
  const [hov, setHov] = useState(false);

  const isWatchedBoth = movie.status === "both";
  const showMeIcon = isWatchedBoth || movie.status === "me";
  const showPartnerIcon = isWatchedBoth || movie.status === "partner";

  const poster = movie.poster
    ? movie.poster.startsWith("http")
      ? movie.poster
      : TMDB_IMG + movie.poster
    : "https://via.placeholder.com/300x420/1a1a2e/666?text=No+Poster";

  return (
    <div
      onClick={() => onClick(movie)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#1a1a2e", borderRadius: 16, overflow: "hidden", cursor: "pointer", border: selected ? `2px solid ${ACCENT}` : "2px solid transparent", position: "relative",
        transform: hov ? "scale(1.06) translateY(-6px)" : "scale(1)",
        zIndex: hov ? 10 : 1,
        boxShadow: hov || selected ? "0 15px 40px rgba(0,0,0,0.8)" : "0 2px 16px rgba(0,0,0,0.4)",
        transition: "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      <div style={{ position: "relative", paddingTop: "150%" }}>
        <img src={poster} alt={movie.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#0f0f1aee 40%,transparent 70%)" }} />

        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", flexDirection: "row-reverse" }}>
          {showPartnerIcon && (
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${profiles.partner.color}`, overflow: "hidden", marginLeft: -8, boxShadow: "0 2px 8px rgba(0,0,0,0.5)", background: "#1a1a2e" }}>
              <img src={profiles.partner.avatar} alt={profiles.partner.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          {showMeIcon && (
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${profiles.me.color}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", background: "#1a1a2e" }}>
              <img src={profiles.me.avatar} alt={profiles.me.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
        </div>

        {isWatchedBoth && (
          <div style={{ position: "absolute", top: 8, left: 8, width: 26, height: 26, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            <img src={check} alt="Checked" style={{ width: 26, height: 26, objectFit: "contain" }} />
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
function DetailPanel({ movie, onClose, onToggleWatch, onSaveReview, profiles, onDeleteMovie, onOpenPopup , isMobile, onEditClick }) {
  const [isClosing, setIsClosing] = useState(false);
  const currentRole = localStorage.getItem("my_couple_role") || "me";
  const [myRating, setMyRating] = useState(movie?.user_ratings?.[currentRole] || 0);
    // ── STATE BARU UNTUK LINK ──
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [inputWatch, setInputWatch] = useState(movie?.link_watch || "");
  const [inputDownload, setInputDownload] = useState(movie?.link_download || "");

    useEffect(() => {                                          // 👈 tambah di sini
    setInputWatch(movie?.link_watch || "");
    setInputDownload(movie?.link_download || "");
  }, [movie?.link_watch, movie?.link_download]);

  const reviewsList = movie?.reviews || [];

  if (!movie) return null;

  const poster = movie.poster
    ? movie.poster.startsWith("http")
      ? movie.poster
      : TMDB_IMG + movie.poster
    : "https://via.placeholder.com/500x750/1a1a2e/666?text=No+Poster";

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400);
  }

  // Fungsi simpan rating instan dari DetailPanel
  function handleRatingClick(star) {
    setMyRating(star);
    const existingReview = reviewsList.find(r => r.role === currentRole);
    onSaveReview(movie.id, existingReview?.text || "", star);
  }

      return (
          <div
            className="hide-scrollbar"
            style={{
              // 👇 BARIS YANG DIUBAH MENJADI DINAMIS JIKA DI HP
              width: isMobile ? "100%" : 340,
              position: isMobile ? "fixed" : "relative",
              inset: isMobile ? 0 : "auto",
              zIndex: isMobile ? 8000 : 1,
              
              flexShrink: 0, background: "#13131f", borderLeft: "1px solid #2a2a3e", display: "flex", flexDirection: "column", overflowY: "auto",paddingBottom: isMobile ? "80px" : "0",
              animation: isClosing ? "slideOutRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards" : "slideInRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
            }}
          >
      <div style={{ position: "relative" }}>
        <img src={poster} alt={movie.title} style={{ width: "100%", height: 220, objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#13131f 10%,transparent 70%)" }} />
        <button onClick={handleClose} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.5)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>×</button>
      </div>

      <div style={{ padding: isMobile ? "0 20px 100px" : "0 20px 24px" }}>
        <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{movie.title}</h2>
        <div style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 12 }}>{movie.year} • {movie.genre} • ⭐ {movie.rating}/10</div>
        <StatusBadge status={movie.status} profiles={profiles} />

        <div style={{ margin: "18px 0 8px", color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Synopsis</div>
        <p style={{ color: "#D1D5DB", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{movie.synopsis || "No synopsis available."}</p>

        {movie.trailer_key && (
          <a
            href={`https://www.youtube.com/watch?v=${movie.trailer_key}`}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#E50914";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#E50914";
              e.currentTarget.style.transform = "scale(1)";
            }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, padding: 12,
              background: "transparent", border: "1px solid #E50914", color: "#E50914", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, transition: "all 0.2s ease-in-out",
            }}
          >
            ▶ Watch Trailer
          </a>
          
        )}
{/* ── TOMBOL LINK NONTON & DOWNLOAD ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>

          <button
            onClick={() => setShowLinkPopup(true)}
            style={{ flex: 1, background: "transparent", border: "1px solid #3a3a4e", color: "#9CA3AF", borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#3a3a4e"; e.currentTarget.style.color = "#9CA3AF"; }}
          >
            🔗 Input Link
          </button>

 <button
            onClick={() => { if (movie?.link_watch) window.open(movie.link_watch, "_blank"); }}
            disabled={!movie?.link_watch}
            onMouseEnter={e => { if (movie?.link_watch) e.currentTarget.style.filter = "brightness(1.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; }}
            onMouseDown={e => { if (movie?.link_watch) e.currentTarget.style.transform = "scale(0.97)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            style={{
              flex: 1, background: movie?.link_watch ? COLOR_SECONDARY : "#1a1a2e",
              color: movie?.link_watch ? "#fff" : "#4B5563",
              border: movie?.link_watch ? "none" : "1px solid #2a2a3e",
              borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 600,
              cursor: movie?.link_watch ? "pointer" : "not-allowed",
              opacity: movie?.link_watch ? 1 : 0.5,
              transition: "all 0.2s"
            }}
          >
            ▶ Nonton
          </button>

          <button
            onClick={() => { if (movie?.link_download) window.open(movie.link_download, "_blank"); }}
            disabled={!movie?.link_download}
            onMouseEnter={e => { if (movie?.link_download) e.currentTarget.style.filter = "brightness(1.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; }}
            onMouseDown={e => { if (movie?.link_download) e.currentTarget.style.transform = "scale(0.97)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            style={{
              flex: 1, background: movie?.link_download ? "#10B981" : "#1a1a2e",
              color: movie?.link_download ? "#fff" : "#4B5563",
              border: movie?.link_download ? "none" : "1px solid #2a2a3e",
              borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: 600,
              cursor: movie?.link_download ? "pointer" : "not-allowed",
              opacity: movie?.link_download ? 1 : 0.5,
              transition: "all 0.2s"
            }}
          >
            Download
          </button>

        </div>

        {/* ── POPUP INPUT LINK ── */}
        {showLinkPopup && (
          <div
            onClick={() => setShowLinkPopup(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(10,10,18,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 13000 }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ background: "#13131f", border: "1px solid #2a2a3e", borderRadius: 20, padding: 28, width: "90%", maxWidth: 460, boxShadow: "0 25px 60px rgba(0,0,0,0.6)", position: "relative" }}
            >
              <button onClick={() => setShowLinkPopup(false)} style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: "#6B7280", fontSize: 20, cursor: "pointer" }}>×</button>
              
              <h3 style={{ color: "#fff", margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>
                🔗 Link untuk <span style={{ color: COLOR_LIGHT }}>{movie.title}</span>
              </h3>

              {/* Input Link Nonton */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#6B7280", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Link Nonton</label>
                <input
                  value={inputWatch}
                  onChange={e => setInputWatch(e.target.value)}
                  placeholder="https://..."
                  style={{ width: "100%", padding: "10px 14px", background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Input Link Download */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#6B7280", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Link Download</label>
                <input
                  value={inputDownload}
                  onChange={e => setInputDownload(e.target.value)}
                  placeholder="https://..."
                  style={{ width: "100%", padding: "10px 14px", background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowLinkPopup(false)}
                  style={{ flex: 1, background: "#2a2a3e", color: "#9CA3AF", border: "none", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                    onClick={async () => {
                      const { error } = await supabase
                        .from("movies")
                        .update({ link_watch: inputWatch || null, link_download: inputDownload || null })
                        .eq("id", movie.id);
                      if (error) alert("Gagal menyimpan link: " + error.message);
                      else setShowLinkPopup(false);
                    }}
                  style={{ flex: 2, background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Simpan Link
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ margin: "18px 0 12px", color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Mark as Watched</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {["me", "partner"].map((key) => {
            const p = profiles[key];
            const watched = movie.status === "both" || movie.status === key;
            const isNotMyProfile = key !== currentRole;

            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, background: "#1a1a2e", borderRadius: 10, padding: "10px 14px", opacity: isNotMyProfile ? 0.7 : 1 }}>
                <Avatar profile={p} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ color: watched ? "#34D399" : "#6B7280", fontSize: 11 }}>{watched ? "✓ Watched" : "Not watched yet"}</div>
                </div>
                <button
                  disabled={isNotMyProfile}
                  onClick={() => !isNotMyProfile && onToggleWatch(movie.id, key)}
                  style={{
                    background: isNotMyProfile ? "transparent" : watched ? "#2a2a3e" : ACCENT,
                    color: isNotMyProfile ? "#4B5563" : watched ? "#9CA3AF" : "#fff",
                    border: isNotMyProfile ? "1px solid #2a2a3e" : "none",
                    borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: isNotMyProfile ? "not-allowed" : "pointer",
                  }}
                >
                  {isNotMyProfile ? "mark" : watched ? "Undo" : "Mark"}
                </button>
              </div>
            );
          })}
        </div>

{/* ── SEKSI TOMBOL BUKA MODAL RATING & KOMENTAR ── */}
        <div style={{ borderTop: "1px solid #2a2a3e", paddingTop: 16 }}>
          <button
            onClick={() => onOpenPopup(movie)}
            style={{ width: "100%", background: "linear-gradient(90deg, #D4AF37 0%, #4A3500 50%, #D4AF37 100%)", color: "#ffffff", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
          Beri Rating & Ulasan
          </button>
          
          <button
            onClick={() => onDeleteMovie(movie.id, movie.title)}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68)"; e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#3a3a4e"; e.currentTarget.style.color = "#EF4444"; }}
            style={{ width: "100%", background: "transparent", color: "#EF4444", border: "1px solid #3a3a4e", borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 10, transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <img src={deleteIcon} alt="Hapus" style={{ width: 14, height: 14, objectFit: "contain" }} />
            Hapus Film dari Watchlist 
          </button>
        </div>

{/* ── TAMPILAN LIST KOMENTAR TERSEDIA ── */}
        <div style={{ marginTop: 24, borderTop: "1px solid #2a2a3e", paddingTop: 16 }}>
          <div style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            Komentar & Review
          </div>
          
          {reviewsList.length === 0 && (
            <div style={{ fontSize: 12, color: "#4B5563" }}>Belum ada komentar dari kalian.</div>
          )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: isMobile ? 60 : 0 }}>
            {reviewsList.map((rev, i) => {
              const isFromMe = rev.role === currentRole;
              const prof = isFromMe ? profiles[currentRole] : profiles[rev.role];
              
              return (
                <div 
                  key={i} 
                  onClick={() => {
                    if (isFromMe) { // Hanya bisa klik edit jika itu komentar milik sendiri
                      onEditClick(rev);
                    }
                  }}
                  style={{ 
                    background: "#1a1a2e", padding: 10, borderRadius: 8, cursor: "pointer",
                    border: "1px solid transparent", transition: "0.2s" 
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = prof?.color || "#3a3a4e"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Avatar profile={prof} size={20} />
                    <span style={{ fontWeight: 600, fontSize: 12, color: prof?.color }}>{prof?.name}</span>
                    
                    {rev.created_at && (
                      <span style={{ fontSize: 10, color: "#6B7280" }}>
                        • {new Date(rev.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(/\./g, ':')}
                      </span>
                    )}
                    {rev.rating > 0 && (
                      <span style={{ fontSize: 11, color: "#F59E0B", marginLeft: "auto" }}>{"★".repeat(rev.rating)}</span>
                    )}
                  </div>

                    {rev.text && rev.text.startsWith("data:image/") ? (
                      <img src={rev.text} alt="Coretan review" style={{ maxWidth: "100%", maxHeight: 80, objectFit: "contain", background: "#13131f", borderRadius: 6, marginTop: 4, display: "block" }} />
                    ) : rev.text && (rev.text.startsWith("/src/assets/") || rev.text.startsWith("/assets/") || rev.text.match(/\.(png|webp|gif|jpe?g)$/i) || rev.text.includes("stickers/")) ? (
                      <img src={rev.text} alt="Sticker" style={{ maxHeight: 50, objectFit: "contain", marginTop: 4, display: "block" }} />
                    ) : (
                      <p style={{ margin: 0, fontSize: 12, color: "#D1D5DB", lineHeight: 1.4 }}>{rev.text}</p>
                    )}
                </div>
              );
            })}
          
          </div>
        </div>
      </div>
    </div>
  );
  {/* MODAL POP-UP PREVIEW (Copy ini di akhir file DetailPanel Anda) */}
      {previewReview && (
        <div 
          onClick={() => setPreviewReview(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(10, 10, 18, 0.85)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 12000
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: "#13131f", borderRadius: 20, padding: 32, width: "90%", maxWidth: 650, border: "1px solid #2a2a3e" }}>
            <h3 style={{ color: "#fff", marginBottom: 20 }}>{previewReview.movieTitle}</h3>
              {previewReview.text && previewReview.text.startsWith("data:image/") ? (
                <img src={previewReview.text} alt="Coretan" style={{ width: "100%", borderRadius: 8, background: "#13131f", display: "block" }} />
              ) : previewReview.text && (previewReview.text.startsWith("/src/assets/") || previewReview.text.startsWith("/assets/")) ? (
                <img src={previewReview.text} alt="Sticker" style={{ maxHeight: 120, objectFit: "contain", display: "block", margin: "0 auto" }} />
              ) : (
                <p style={{ margin: 0, fontSize: 16, color: "#D1D5DB", lineHeight: 1.6, whiteSpace: "pre-wrap", fontStyle: "italic" }}>
                  "{previewReview.text || "Hanya memberikan rating bintang."}"
                </p>
              )}
            <button onClick={() => setPreviewReview(null)} style={{ marginTop: 20, background: "#EF4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
}


// ── SearchDropdown ──
function SearchDropdown({ results, onAdd, loading }) {
  if (!results.length && !loading) return null;
  return (
    <div
      className="hide-scrollbar"
      style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#1a1a2e", borderRadius: 12, border: "1px solid #2a2a3e", zIndex: 100, overflow: "hidden", boxShadow: "0 8px 32px #000a", maxHeight: 360, overflowY: "auto" }}
    >
      {loading && <div style={{ padding: 20, textAlign: "center", color: "#6B7280", fontSize: 13 }}>Searching...</div>}
      {results.map((r) => (
        <div
          key={r.id} onClick={() => onAdd(r)}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #2a2a3e", transition: "background .15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#252538")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
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

// ── AnalyticsView ──
// 👇 1. Tambahkan isMobile sebagai prop
function AnalyticsView({ movies, profiles, isMobile }) {
  const myCount = movies.filter((m) => m.status === "both" || m.status === "me").length;
  const ptCount = movies.filter((m) => m.status === "both" || m.status === "partner").length;
  const total = movies.length || 1;
  const genreMap = {};
  movies.forEach((m) => { if (m.genre) genreMap[m.genre] = (genreMap[m.genre] || 0) + 1; });

  return (
    // 👇 2. Padding kontainer diperkecil di HP
    <div style={{ padding: isMobile ? "16px 12px" : 32, color: "#fff", maxWidth: 800, position: "relative", zIndex: 1 }}>
      
      {/* 👇 3. Ukuran judul utama diperkecil (dari 40 ke 28) */}
      <h2 style={{ fontFamily: "love, sans-serif", marginBottom: 24, fontSize: isMobile ? 28 : 40, fontWeight: 100 ,color: "#1591DC"}}>
        Who Watched More?
      </h2>
      
      {/* 👇 4. Grid diubah jadi 1 kolom (atas-bawah) di HP */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 20, marginBottom: 32 }}>
        {[{ key: "me", count: myCount }, { key: "partner", count: ptCount }].map((p) => {
          const prof = profiles[p.key];
          return (
            // 👇 5. Padding dalam kartu diperkecil
            <div key={p.key} style={{ background: "#1a1a2e", borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isMobile ? 12 : 16 }}>
                
                {/* 👇 6. Ukuran Avatar mengecil di HP (dari 48 ke 36) */}
                <Avatar profile={prof} size={isMobile ? 36 : 48} />
                <div>
                  {/* 👇 7. Ukuran nama & subtitle mengecil di HP */}
                  <div style={{ fontWeight: 700, fontSize: isMobile ? 15 : 18 }}>{prof.name}</div>
                  <div style={{ color: "#9CA3AF", fontSize: isMobile ? 11 : 13 }}>Movies watched</div>
                </div>
              </div>
              
              {/* 👇 8. Ukuran angka jumlah film mengecil di HP (dari 48 ke 36) */}
              <div style={{ fontSize: isMobile ? 36 : 48, fontWeight: 900, color: prof.color }}>{p.count}</div>
              
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
// ── TopReviewsView ──
function TopReviewsView({ movies, profiles, isMobile }) { 
  const currentRole = localStorage.getItem("my_couple_role") || "me";
  const partnerRole = currentRole === "me" ? "partner" : "me";
  
  const [previewReview, setPreviewReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  let allReviews = [];
  if (Array.isArray(movies)) {
    movies.forEach((movie) => {
      if (movie && Array.isArray(movie.reviews)) {
        movie.reviews.forEach((rev) => {
          if (rev) {
            allReviews.push({ 
              ...rev, 
              movieId: movie.id, 
              movieTitle: movie.title || "Untitled", 
              moviePoster: movie.poster, 
              movieYear: movie.year,
              movieReviewsList: movie.reviews,
              movieRatingsList: movie.user_ratings
            });
          }
        });
      }
    });
  }

  const myReviews = allReviews
    .filter((r) => r.role === currentRole)
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    
  const partnerReviews = allReviews
    .filter((r) => r.role === partnerRole)
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));

async function confirmDeleteReview() {
    if (!reviewToDelete) return;
    
    // Kita butuh created_at dari review yang ingin dihapus
    const { movieId, currentReviews, currentRatings, targetReviewCreatedAt } = reviewToDelete;
    
    // 👇 FILER BARU: Hapus HANYA jika role SAMA DAN waktu pembuatannya SAMA
    const nextReviews = currentReviews.filter((rev) => 
      !(rev.role === currentRole && rev.created_at === targetReviewCreatedAt)
    );

    // Update rating hanya jika tidak ada lagi komentar dari role ini
    const stillHasReview = nextReviews.some(r => r.role === currentRole);
    const nextRatings = { 
      ...(currentRatings || {}), 
      [currentRole]: stillHasReview ? currentRatings[currentRole] : 0 
    };

    const { error } = await supabase
      .from("movies")
      .update({ reviews: nextReviews, user_ratings: nextRatings })
      .eq("id", movieId);

    if (error) {
      alert("Gagal menghapus review: " + error.message);
    } else {
      if (previewReview?.movieId === movieId) setPreviewReview(null);
      setReviewToDelete(null); 
    }
  }

  function formatWaktu(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).replace(/\./g, ':');
  }

  function formatWaktuLengkap(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).replace(/\./g, ':');
  }

  // 👇 KARTU REVIEW SEKARANG SANGAT RESPONSIF
  const ReviewCard = ({ rev, isMine }) => {
    const prof = profiles[rev.role] || {};
    const poster = rev.moviePoster ? rev.moviePoster.startsWith("http") ? rev.moviePoster : "https://image.tmdb.org/t/p/w300" + rev.moviePoster : "https://via.placeholder.com/60x90/1a1a2e/666?text=?";
    const validRating = Math.max(0, Math.min(5, Math.floor(Number(rev.rating) || 0)));
    const emptyStars = Math.max(0, 5 - validRating);

    return (
      <div 
        onClick={() => setPreviewReview(rev)}
        style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", // 👈 Di HP, isi kartu disusun vertikal agar rapi
          gap: isMobile ? 10 : 16, 
          background: "#1a1a2e", borderRadius: 16, 
          padding: isMobile ? "12px" : "16px", 
          border: `1px solid ${prof?.color || "#666"}40`, position: "relative",
          cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = `0 10px 20px rgba(0,0,0,0.4)`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        
        {/* --- HEADER KARTU KHUSUS HP (Kecil, Rapi, & Anti-Nabrak) --- */}
        {isMobile ? (
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <img src={poster} alt={rev.movieTitle} style={{ width: 44, height: 66, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rev.movieTitle}</div>
              <div style={{ fontSize: 10, color: prof?.color, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <span style={{ fontWeight: 600 }}>{prof?.name}</span>
              </div>
              {rev.created_at && <div style={{ color: "#6B7280", fontSize: 9, marginTop: 2 }}>{formatWaktu(rev.created_at)}</div>}
              {validRating > 0 && <div style={{ fontSize: 12, color: "#F59E0B", marginTop: 4 }}>{"★".repeat(validRating)}</div>}
            </div>
          </div>
        ) : (
          /* HEADER KARTU KHUSUS DESKTOP (Seperti Biasa) */
          <img src={poster} alt={rev.movieTitle} style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: isMine ? (isMobile ? 18 : 24) : 0 }}>
          
          {/* HEADER DESKTOP */}
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{rev.movieTitle}</div>
                <div style={{ fontSize: 12, color: prof?.color, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  {prof?.name}
                  {rev.created_at && <span style={{ color: "#6B7280", fontSize: 10 }}>• {formatWaktu(rev.created_at)}</span>}
                </div>
              </div>
              {validRating > 0 && <div style={{ fontSize: 16, color: "#F59E0B", whiteSpace: "nowrap" }}>{"★".repeat(validRating)}{"☆".repeat(emptyStars)}</div>}
            </div>
          )}

          {/* ISI KOMENTAR TEKS/GAMBAR/STICKER (Otomatis menyesuaikan ukuran HP/Laptop) */}
          {rev.text && rev.text.startsWith("data:image/") ? (
            <img src={rev.text} alt="Coretan review" style={{ maxWidth: "100%", maxHeight: isMobile ? 50 : 80, objectFit: "contain", background: "#13131f", borderRadius: 6, marginTop: isMobile ? 0 : 8, display: "block" }} />
          ) : rev.text && (rev.text.startsWith("/src/assets/") || rev.text.startsWith("/assets/")) ? (
            <img src={rev.text} alt="Sticker" style={{ maxHeight: isMobile ? 40 : 60, objectFit: "contain", marginTop: isMobile ? 0 : 8, display: "block" }} />
          ) : rev.text ? (
            <p style={{ margin: isMobile ? 0 : "8px 0 0 0", fontSize: isMobile ? 11 : 13, color: "#D1D5DB", fontStyle: "italic", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: isMobile ? 3 : 2, WebkitBoxOrient: "vertical" }}>"{rev.text}"</p>
          ) : null}
          
          {isMine && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Di dalam ReviewCard atau bagian tombol Hapus:
              setReviewToDelete({
                movieId: rev.movieId,
                currentReviews: rev.movieReviewsList,
                currentRatings: rev.movieRatingsList,
                targetReviewCreatedAt: rev.created_at // 👈 Tambahkan ini agar unik
              });
              }}
              style={{
                position: "absolute", bottom: isMobile ? 8 : 12, right: isMobile ? 10 : 16,
                background: "transparent", border: "none", color: "#EF4444",
                fontSize: isMobile ? 10 : 11, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4, opacity: 0.8, transition: "opacity 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
            >
              {isMobile ? "Hapus" : "Hapus Komen"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: isMobile ? "16px 12px" : 32, color: "#fff", width: "100%", maxWidth: 1000, position: "relative", zIndex: 1 }}>
      
      <h2 style={{ fontFamily:"gantung,sans serif", marginBottom: 10, fontSize: isMobile ? 25 : 50, fontWeight: 100, color:"#1591DC"}}>Top Reviews & Ratings</h2>
      
      {/* 👇 LAYOUT TETAP KIRI-KANAN (1fr 1fr), BAHKAN DI HP! */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 12 : 32 }}>
        
        <div>
          <div style={{ borderBottom: `2px solid ${profiles[currentRole]?.color}`, paddingBottom: 8, marginBottom: 16 }}>
            <h3 style={{ fontFamily:"eter,sans serif",margin: 0, fontSize: isMobile ? 16 : 30, color: profiles[currentRole]?.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Komentar Kamu</h3>
          </div>
          {myReviews.length === 0 && <div style={{ color: "#6B7280", fontSize: 13 }}>Belum ada ulasan.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
            {myReviews.map((rev, idx) => <ReviewCard key={idx} rev={rev} isMine={true} />)}
          </div>
        </div>

        <div>
          <div style={{ borderBottom: `2px solid ${profiles[partnerRole]?.color}`, paddingBottom: 8, marginBottom: 16 }}>
            <h3 style={{fontFamily:"eter,sans serif", margin: 0, fontSize: isMobile ? 16 : 30, color: profiles[partnerRole]?.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Komen {profiles[partnerRole]?.name}</h3>
          </div>
          {partnerReviews.length === 0 && <div style={{ color: "#6B7280", fontSize: 13 }}>Belum ada ulasan.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
            {partnerReviews.map((rev, idx) => <ReviewCard key={idx} rev={rev} isMine={false} />)}
          </div>
        </div>
      </div>

      {/* MODAL POP-UP PREVIEW LAYAR PENUH */}
      {previewReview && (
        <div 
          onClick={() => setPreviewReview(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(10, 10, 18, 0.85)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 12000,
            animation: "fadeIn 0.2s ease"
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: "#13131f", border: `1px solid ${profiles[previewReview.role]?.color || "#2a2a3e"}`,
              borderRadius: 20, padding: 32, width: "90%", maxWidth: 650,
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)", position: "relative",
              display: "flex", flexDirection: "column", gap: 20
            }}
          >
            <button onClick={() => setPreviewReview(null)} style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: "#6B7280", fontSize: 24, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}>×</button>
            
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {profiles[previewReview.role]?.avatar ? (
                <img src={profiles[previewReview.role].avatar} alt="Avatar" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${profiles[previewReview.role].color}` }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: profiles[previewReview.role]?.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 20 }}>
                  {(profiles[previewReview.role]?.name || "?")[0].toUpperCase()}
                </div>
              )}
              
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: profiles[previewReview.role]?.color }}>
                  {profiles[previewReview.role]?.name}
                </div>
                
                {previewReview.created_at && (
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                    {formatWaktuLengkap(previewReview.created_at)}
                  </div>
                )}
                  {Math.floor(Number(previewReview.rating) || 0) > 0 && (
                    <div style={{ fontSize: 16, color: "#F59E0B", marginTop: 4 }}>
                      {"★".repeat(Math.max(0, Math.floor(Number(previewReview.rating) || 0)))}
                      <span style={{ color: "#3a3a4e" }}>{"★".repeat(Math.max(0, 5 - Math.floor(Number(previewReview.rating) || 0)))}</span>
                    </div>
                  )}
              </div>
            </div>

            <div>
              <p style={{ margin: "0 0 4px 0", color: "#9CA3AF", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Review untuk Film:</p>
              <h3 style={{ margin: 0, color: "#fff", fontSize: 24, fontWeight: 800 }}>{previewReview.movieTitle}</h3>
            </div>

            <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 16, border: "1px solid #2a2a3e" }}>
                        {(() => {
                          const t = previewReview.text || "";
                          const cleanT = t.replace(/^"|"$/g, "");
                          if (t.startsWith("data:image/")) {
                            return <img src={t} alt="Coretan" style={{ width: "100%", borderRadius: 8, background: "#13131f", display: "block" }} />;
                          } else if (cleanT.includes("stickers/") || cleanT.match(/\.(png|webp|gif|jpg)$/i)) {
                            return <img src={cleanT} alt="Sticker" style={{ maxHeight: 120, objectFit: "contain", display: "block", margin: "0 auto" }} />;
                          } else {
                            return (
                              <p style={{ margin: 0, fontSize: 16, color: "#D1D5DB", lineHeight: 1.6, whiteSpace: "pre-wrap", fontStyle: "italic" }}>
                                "{t || "Hanya memberikan rating bintang."}"
                              </p>
                            );
                          }
                        })()}
            </div>
            
          </div>
        </div>
      )}

      {/* MODAL KUSTOM UNTUK HAPUS KOMENTAR */}
      {reviewToDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 15, 26, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 13000 }}>
          <div style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", margin: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: 16 }}>         
              <img src={deleteIcon} alt="Hapus" style={{ width: 50, height: 50, objectFit: "contain", display: "block" }} />
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: 18, fontWeight: 700 }}>Hapus Komentar?</h3>
            <p style={{ margin: "0 0 24px 0", color: "#9CA3AF", fontSize: 14, lineHeight: 1.5 }}>Apakah kamu yakin ingin menghapus ulasan ini secara permanen?</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button 
                onClick={() => setReviewToDelete(null)} 
                style={{ flex: 1, background: "#2a2a3e", color: "#9CA3AF", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }} 
                onMouseEnter={e => e.currentTarget.style.background = "#3a3a54"} 
                onMouseLeave={e => e.currentTarget.style.background = "#2a2a3e"}
              >
                Batal
              </button>
              <button 
                onClick={confirmDeleteReview} 
                style={{ flex: 1, background: "#EF4444", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }} 
                onMouseEnter={e => e.currentTarget.style.background = "#DC2626"} 
                onMouseLeave={e => e.currentTarget.style.background = "#EF4444"}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ── AvatarUpload ──
function AvatarUpload({ profile, onUpload, size = 80 }) {
  const inputRef = useRef(null);
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target.result);
    reader.readAsDataURL(file);
  }
  return (
    <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }} onClick={() => inputRef.current.click()}>
      <Avatar profile={profile} size={size} />
      <div
        style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity .2s", fontSize: 20 }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
      >📷</div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

// ── SettingsView ──
// 👇 1. Tambahkan isMobile di sini
function SettingsView({ profiles, onSave, onLogout, isMobile }) {
  const currentRole = localStorage.getItem("my_couple_role") || "me";
  const [form, setForm] = useState({ me: { ...profiles.me }, partner: { ...profiles.partner } });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ me: { ...profiles.me }, partner: { ...profiles.partner } });
  }, [profiles]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [currentRole]: { ...prev[currentRole], [field]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    const success = await onSave(form);
    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    // 👇 2. Padding luar diperkecil di HP
    <div style={{ padding: isMobile ? "16px 12px" : 32, color: "#fff", position: "relative", width: "100%" }}>
      
      {/* Gambar karakter raksasa di kanan bawah disembunyikan di HP agar layar tidak penuh */}
      {!isMobile && (
        <img src={currentRole === "me" ? noidSettingAvatar : verenSettingAvatar} alt="Karakter Profil" style={{ position: "fixed", bottom: 0, right: "1.5%", height: "85vh", objectFit: "contain", zIndex: 0, pointerEvents: "none", filter: "drop-shadow(-20px 20px 30px rgba(0,0,0,0.6))", transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }} />
      )}

      <div style={{ maxWidth: 600, position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          
          {/* 👇 3. Font judul diperkecil di HP */}
          <h2 style={{ fontFamily: "love, sans-serif", marginBottom: -15, fontSize: isMobile ? 32 : 40, fontWeight: 100 ,color: "#1591DC"}}>Settings</h2>
          
          <button
            onClick={onLogout}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#EF4444"; }}
            style={{ background: "transparent", border: "1px solid #EF4444", color: "#EF4444", borderRadius: 8, padding: isMobile ? "6px 10px" : "6px 14px", fontSize: isMobile ? 11 : 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
          >
            <img src={powerIcon} alt="Logout" style={{ width: isMobile ? 14 : 16, height: isMobile ? 14 : 16, objectFit: "contain" }} />
            Keluar Akun
          </button>
        </div>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 12 : 14, marginBottom: isMobile ? 24 : 32 }}>Kamu hanya bisa mengubah profil kamu sendiri.</p>

        {/* 👇 4. Grid dirubah jadi 1 kolom (atas-bawah) di HP */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 20, marginBottom: isMobile ? 24 : 32 }}>
          {["me", "partner"].map((key) => {
            const p = form[key];
            const isNotMyProfile = key !== currentRole;
            const label = key === currentRole ? "The Admin" : "💜 My Love";

            return (
              // 👇 5. Padding dalam kotak profil diperkecil di HP
              <div key={key} style={{ background: "#1a1a2e", borderRadius: 16, padding: isMobile ? 16 : 24, opacity: isNotMyProfile ? 0.6 : 1, border: isNotMyProfile ? "1px solid transparent" : `1px solid ${COLOR_SECONDARY}`, transition: "all 0.3s" }}>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 14, color: isNotMyProfile ? "#6B7280" : COLOR_LIGHT, marginBottom: isMobile ? 16 : 20 }}>{label}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: isMobile ? 16 : 20, pointerEvents: isNotMyProfile ? "none" : "auto" }}>
                  <div style={{ position: "relative" }}>
                    
                    {/* 👇 6. Ukuran Avatar Foto diperkecil dari 80 jadi 60 di HP */}
                    {isNotMyProfile ? <Avatar profile={p} size={isMobile ? 60 : 80} /> : <AvatarUpload profile={p} onUpload={(url) => handleChange("avatar", url)} size={isMobile ? 60 : 80} />}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{isNotMyProfile ? "Profil milik partner" : "Klik foto untuk ganti"}</div>
                  {p.avatar && !isNotMyProfile && (
                    <button onClick={() => handleChange("avatar", null)} style={{ background: "transparent", border: "1px solid #3a3a4e", color: "#9CA3AF", borderRadius: 8, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Hapus Foto</button>
                  )}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 6, color: "#6B7280", fontSize: 11 }}>Nama</label>
                  <input value={p.name} disabled={isNotMyProfile} onChange={(e) => handleChange("name", e.target.value)} style={{ width: "100%", padding: isMobile ? "8px 12px" : "10px 14px", background: isNotMyProfile ? "#141424" : "#0f0f1a", border: "1px solid #2a2a3e", borderRadius: 8, color: isNotMyProfile ? "#6B7280" : "#fff", outline: "none", fontSize: isMobile ? 13 : 14 }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, color: "#6B7280", fontSize: 11 }}>Warna Avatar</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input type="color" value={p.color} disabled={isNotMyProfile} onChange={(e) => handleChange("color", e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: "none", background: "none", cursor: isNotMyProfile ? "not-allowed" : "pointer", padding: 2 }} />
                    <div style={{ background: p.color, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff" }}>{p.color}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSave} disabled={saving}
          onMouseEnter={(e) => { if (!saved) { e.currentTarget.style.background = "#1D4ED8"; e.currentTarget.style.filter = "brightness(1.2)"; } }}
          onMouseLeave={(e) => { if (!saved) { e.currentTarget.style.background = saving ? "#374151" : ACCENT; e.currentTarget.style.filter = "brightness(1)"; } }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          style={{ background: saving ? "#374151" : saved ? "#34D399" : ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: isMobile ? "12px 24px" : "13px 32px", fontWeight: 700, fontSize: isMobile ? 13 : 15, cursor: saving ? "not-allowed" : "pointer", width: "100%", transition: "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)", transform: "scale(1)" }}
        >
          {saving ? "Menyimpan ke server..." : saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "watchlist", label: "Shared Watchlist", icon: watchlistIcon },
  { id: "reviews", label: "Top Reviews", icon: historyIcon },
  { id: "analytics", label: "Who Watched More", icon: analyticsIcon },
  { id: "settings", label: "Settings", icon: settingsIcon },
];
const FILTERS = ["All", "Unwatched", "Watched by Me", "Watched by Partner", "Both Watched"];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MovieDate() {
  const [userRole, setUserRole] = useState(localStorage.getItem("my_couple_role"));
  const [activeNav, setActiveNav] = useState("watchlist");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [filterGenre, setFilterGenre] = useState("All");
  const [selected, setSelected] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [watchlistSearchQ, setWatchlistSearchQ] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [movies, setMovies] = useState([]);
  const [profiles, setProfiles] = useState(DEFAULT_PROFILES);
  
  // ── STATE UNTUK MODAL ──
  const [commentPopupTarget, setCommentPopupTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alertTarget, setAlertTarget] = useState(null);

  const [editingReview, setEditingReview] = useState(null);
// ── STATE KHUSUS PAINT, TEKS KOMENTAR, & RATING ──
  const [inputMode, setInputMode] = useState("text"); 
  const [commentText, setCommentText] = useState("");
  const [popupRating, setPopupRating] = useState(0); // 👈 State bintang
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paintColor, setPaintColor] = useState("");
  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [drawHistory, setDrawHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  

    // ── DETEKSI MOBILE ──
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // 👇 1. STATE UNTUK PULL TO REFRESH 👇
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollRef = useRef(null);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── LOGIKA TOMBOL BACK HP ──
  useEffect(() => {
    const handleBackPress = (event) => {
      if (commentPopupTarget || deleteTarget || alertTarget) {
        setCommentPopupTarget(null);
        setDeleteTarget(null);
        setAlertTarget(null);
      // 1. Jika ada DetailPanel (selected), tutup DetailPanel dulu
      if (selected) {
                window.history.pushState(null, "", window.location.pathname);
              }
            }
      // 2. Jika ada Modal Pop-up (Komentar/Delete), tutup Modal dulu
      else if (selected) {
              setSelected(null);
            }
      // 3. Jika sudah di tab lain, kembali ke tab utama (Watchlist)
      else if (activeNav !== "watchlist") {
              setActiveNav("watchlist");
            }
          };
window.addEventListener("popstate", handleBackPress);
    return () => window.removeEventListener("popstate", handleBackPress);
  }, [selected, commentPopupTarget, deleteTarget, alertTarget, activeNav]);

  useEffect(() => {
      if (selected || activeNav !== "watchlist") {
        window.history.pushState(null, "", window.location.pathname);
      }
    }, [selected, activeNav]);

  useEffect(() => {
    if (commentPopupTarget) {
      setPopupRating(commentPopupTarget.user_ratings?.[userRole || "me"] || 0);
    }
  }, [commentPopupTarget, userRole]);

  const searchRef = useRef(null);
  const debounceRef = useRef(null);

// Tambahkan fungsi ini di MovieDate()
async function handleSaveLinks(movieId, linkWatch, linkDownload) {
  const { error } = await supabase
    .from("movies")
    .update({ link_watch: linkWatch || null, link_download: linkDownload || null })
    .eq("id", movieId);
  if (error) alert("Gagal menyimpan link: " + error.message);
}
  
  // ── FUNGSI MENGGAMBAR UNTUK MODAL POPUP ──
function startDrawing(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    // ── LOGIKA KETEBALAN DINAMIS ──
    if (isErasing) {
      ctx.globalCompositeOperation = "destination-out";
      // Penghapus dibuat 2x lebih besar dari kuas agar lebih mudah menghapus
      ctx.lineWidth = brushSize * 2; 
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = paintColor || profiles[userRole || "me"]?.color || "#fff";
      ctx.lineWidth = brushSize; // Kuas mengikuti ukuran slider
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  }
  function draw(e) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  }

// ── LOGIKA BARU: UNDO, REDO & SAVE HISTORY ──
  function saveCanvasState() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    const newHistory = drawHistory.slice(0, historyStep + 1);
    newHistory.push(data);
    setDrawHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  }

  function stopDrawing() {
    if (isDrawing) {
      setIsDrawing(false);
      saveCanvasState(); // Simpan riwayat setiap kali selesai 1 coretan
    }
  }

  function restoreCanvas(dataUrl) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.globalCompositeOperation = "source-over"; // Reset mode penghapus
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }

  function handleUndo() {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setHistoryStep(prevStep);
      restoreCanvas(drawHistory[prevStep]);
    } else if (historyStep === 0) {
      setHistoryStep(-1);
      const canvas = canvasRef.current;
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function handleRedo() {
    if (historyStep < drawHistory.length - 1) {
      const nextStep = historyStep + 1;
      setHistoryStep(nextStep);
      restoreCanvas(drawHistory[nextStep]);
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    saveCanvasState(); // Jadikan 'Clear' sebagai salah satu langkah history
  }

  function handleSubmitPopupReview() {
    if (!commentPopupTarget) return;
    let finalContent = commentText;

    if (inputMode === "paint" && canvasRef.current) {
      const canvas = canvasRef.current;
      finalContent = canvas.toDataURL("image/png");
    }
    handleSaveReview(commentPopupTarget.id, finalContent, popupRating);
    
  setCommentText("");
  setPopupRating(0);
  setEditingReview(null); // 👈 PENTING: Pastikan reset saat simpan
  if (inputMode === "paint") clearCanvas();
  setCommentPopupTarget(null);
}
  // ─────────────────────────────────────────
  // 👇 2. FUNGSI LOGIKA PULL TO REFRESH 👇
  function handleTouchStart(e) {
    // Hanya aktif jika posisi layar sedang dipaling atas (scrollTop === 0)
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  }

  function handleTouchMove(e) {
    if (!pullStartY) return;
    const y = e.touches[0].clientY;
    const dist = y - pullStartY;
    
    // Jika ditarik ke bawah
    if (dist > 0 && scrollRef.current && scrollRef.current.scrollTop === 0) {
      // Diberi efek berat/resistensi (dist * 0.4) dan maksimal ditarik 70px
      setPullDistance(Math.min(dist * 0.4, 70)); 
    }
  }

  function handleTouchEnd() {
    if (pullDistance >= 60) {
      // Jika tarikan sudah cukup jauh, refresh halaman
      window.location.reload();
    } else {
      // Jika batal ditarik full, layar membal ke posisi semula
      setPullDistance(0);
    }
    setPullStartY(0);
  }
  function handleSelectRole(role) {
    localStorage.setItem("my_couple_role", role);
    setUserRole(role);
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
        const dbMe = data.find((p) => p.id === "me");
        const dbPartner = data.find((p) => p.id === "partner");
        setProfiles({
          me: { name: dbMe?.name || "You", color: dbMe?.color || "#1591DC", avatar: dbMe?.avatar || null },
          partner: { name: dbPartner?.name || "Partner", color: dbPartner?.color || "#4BB8FA", avatar: dbPartner?.avatar || null },
        });
      }
    }
    fetchMovies();
    fetchProfiles();

    const moviesChannel = supabase.channel("realtime-movies").on("postgres_changes", { event: "*", scheme: "public", table: "movies" }, (payload) => {
      if (payload.eventType === "INSERT") setMovies((prev) => [payload.new, ...prev]);
      else if (payload.eventType === "UPDATE") {
        setMovies((prev) => prev.map((m) => (m.id === payload.new.id ? payload.new : m)));
        setSelected((prev) => prev && prev.id === payload.new.id ? payload.new : prev);
        // Update data di modal popup jika sedang terbuka
        setCommentPopupTarget((prev) => prev && prev.id === payload.new.id ? payload.new : prev);
      }
      else if (payload.eventType === "DELETE") setMovies((prev) => prev.filter((m) => m.id !== payload.old.id));
    }).subscribe();

    const profilesChannel = supabase.channel("realtime-profiles").on("postgres_changes", { event: "UPDATE", scheme: "public", table: "profiles" }, () => {
      fetchProfiles();
    }).subscribe();

    return () => { supabase.removeChannel(moviesChannel); supabase.removeChannel(profilesChannel); };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSearchInput(val) {
    setSearchQ(val);
    setShowSearch(true);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setTmdbResults([]); return; }
    setTmdbLoading(true);

    const GENRE_MAP = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 10752: "War", 37: "Western", 10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics" };

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(val)}&language=en-US&page=1`);
        const data = await res.json();
        const filteredResults = (data.results || []).filter((item) => item.media_type === "movie" || item.media_type === "tv");
        setTmdbResults(filteredResults.slice(0, 50).map((m) => {
          const title = m.title || m.name;
          const date = m.release_date || m.first_air_date;
          const year = date ? date.slice(0, 4) : "N/A";
          const typeLabel = m.media_type === "tv" ? "Series" : "Movie";
          const genreList = m.genre_ids && m.genre_ids.length > 0 ? m.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3).join(", ") : "Other";
          return { id: m.id, title: title, year: year, genre: `${typeLabel} • ${genreList}`, rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A", poster: m.poster_path || null, synopsis: m.overview || "", tmdb_id: m.id };
        }));
      } catch { setTmdbResults([]); } finally { setTmdbLoading(false); }
    }, 400);
  }

  async function handleAddMovie(tmdbMovie) {
    if (movies.find((m) => m.tmdb_id === tmdbMovie.tmdb_id)) {
      setAlertTarget({ title: tmdbMovie.title });
      setShowSearch(false);
      setSearchQ("");
      setTmdbResults([]);
      return;
    }
    let trailerKey = null;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbMovie.tmdb_id}/videos?api_key=${TMDB_KEY}`);
      const data = await res.json();
      const yt = (data.results || []).find((v) => v.site === "YouTube" && v.type === "Trailer");
      trailerKey = yt?.key || null;
    } catch {}

    const newMovie = { id: Date.now(), tmdb_id: tmdbMovie.tmdb_id, title: tmdbMovie.title, year: tmdbMovie.year, genre: tmdbMovie.genre, rating: tmdbMovie.rating, poster: tmdbMovie.poster, synopsis: tmdbMovie.synopsis, trailer_key: trailerKey, watched: [], status: "none", reviews: [], user_ratings: {} };
    const { error } = await supabase.from("movies").insert([newMovie]);
    if (error) alert("Gagal menambahkan film ke server: " + error.message);
    setShowSearch(false); setSearchQ(""); setTmdbResults([]);
  }

  async function toggleWatch(movieId, person) {
    const targetMovie = movies.find((m) => m.id === movieId);
    if (!targetMovie) return;
    const currentWatched = targetMovie.watched || [];
    const nextWatched = currentWatched.includes(person) ? currentWatched.filter((w) => w !== person) : [...currentWatched, person];
    const nextStatus = statusFromWatched(nextWatched);
    const { error } = await supabase.from("movies").update({ watched: nextWatched, status: nextStatus }).eq("id", movieId);
    if (error) alert("Gagal memperbarui status: " + error.message);
  }

async function handleSaveReview(movieId, reviewText, starRating) {
    const target = movies.find((m) => m.id === movieId);
    if (!target) return;

    const currentRoleActive = userRole || localStorage.getItem("my_couple_role");
    const nextRatings = { ...(target.user_ratings || {}), [currentRoleActive]: starRating };
    let nextReviews = [...(target.reviews || [])];

    // ── LOGIKA EDIT ──
    if (editingReview) {
      // Cari dan ganti komentar yang sesuai dengan created_at (ID unik komentar)
      nextReviews = nextReviews.map(rev => 
        (rev.role === currentRoleActive && rev.created_at === editingReview.created_at)
          ? { ...rev, text: reviewText.trim(), rating: starRating }
          : rev
      );
      setEditingReview(null); // Reset mode edit
    } else {
      // ── LOGIKA TAMBAH BARU ──
      // (Baris filter penghapus komentar lama SUDAH DIHAPUS di sini)
      if (reviewText.trim() || starRating > 0) {
        nextReviews.push({
          role: currentRoleActive,
          text: reviewText.trim(),
          rating: starRating,
          created_at: new Date().toISOString(),
        });
      }
    }

    const { error } = await supabase.from("movies").update({ user_ratings: nextRatings, reviews: nextReviews }).eq("id", movieId);
    if (error) alert("Gagal menyimpan review: " + error.message);
  }

  async function saveProfiles(newForm) {
    const currentRole = localStorage.getItem("my_couple_role");
    if (!currentRole) return false;
    const myUpdatedData = newForm[currentRole];
    const { error } = await supabase.from("profiles").update({ name: myUpdatedData.name, color: myUpdatedData.color, avatar: myUpdatedData.avatar }).eq("id", currentRole).select();
    if (error) {
      alert("Gagal menyimpan ke database: " + error.message);
      return false;
    } else {
      setProfiles((prev) => ({ ...prev, [currentRole]: { ...prev[currentRole], ...myUpdatedData } }));
      return true;
    }
  }

  const filterMap = {
    All: () => true,
    Unwatched: (m) => m.status === "none",
    "Watched by Me": (m) => m.status === userRole || m.status === "both",
    "Watched by Partner": (m) => m.status === (userRole === "me" ? "partner" : "me") || m.status === "both",
    "Both Watched": (m) => m.status === "both",
  };
  const filtered = movies.filter(filterMap[filter]);

  const availableGenres = Array.from(new Set(movies.flatMap((m) => m.genre ? m.genre.replace(/Movie • |Series • /g, "").split(", ") : []))).filter(Boolean).sort();

  const processedMovies = filtered
    .filter((m) => filterGenre === "All" || (m.genre && m.genre.includes(filterGenre)))
    .filter((m) => m.title.toLowerCase().includes(watchlistSearchQ.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "newest") return parseInt(b.year || 0) - parseInt(a.year || 0);
      if (sortBy === "rating") return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
      return 0;
    });

  // ── SCREEN 1: LOGIN ──
  if (!userRole) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: `linear-gradient(rgba(15, 15, 26, 0.6), rgba(15, 15, 26, 0.6)), url(${loginBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "#0f0f1a", fontFamily: "'Inter',system-ui,sans-serif", color: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 40, zIndex: 10 }}>
          <h1 style={{ fontFamily: "judul, sans-serif", fontSize: 80, color: "#AACCD6", fontWeight: 900, margin: "0 0 8px", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>MovieDate</h1>
          <p style={{ fontFamily: "tulisan, sans-serif", fontSize: 15, color: "#E5E7EB", margin: 0, textShadow: "0 1px 5px rgba(0,0,0,0.8)" }}>Nonton apa ya hari ni...</p>
        </div>
        <div style={{ display: "flex", gap: 60, width: "100%", maxWidth: 600, justifyContent: "center", padding: "0 20px", boxSizing: "border-box", zIndex: 10 }}>
          <div onClick={() => handleSelectRole("me")} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1) translateY(-10px)"; e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 15px 25px rgba(21, 145, 220, 0.6))"; e.currentTarget.querySelector("span").style.color = COLOR_SECONDARY; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"; e.currentTarget.querySelector("span").style.color = "#fff"; }} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)" }}>
            <img src={noidAvatar} alt="Noid" style={{ width: 300, height: 300, objectFit: "contain", transition: "all 0.3s ease", filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))" }} />
            <span style={{ fontFamily: "nama, sans-serif", fontWeight: 100, fontSize: 40, color: "#fff", transition: "color 0.2s ease-in-out", textShadow: "0 4px 10px rgba(0,0,0,0.6)" }}>Noid</span>
          </div>
          <div onClick={() => handleSelectRole("partner")} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1) translateY(-10px)"; e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 15px 25px rgba(75, 184, 250, 0.6))"; e.currentTarget.querySelector("span").style.color = COLOR_LIGHT; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"; e.currentTarget.querySelector("span").style.color = "#fff"; }} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)" }}>
            <img src={verenAvatar} alt="Veren" style={{ width: 280, height: 280, objectFit: "contain", transition: "all 0.3s ease", filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))" }} />
            <span style={{ fontFamily: "nama, sans-serif", fontWeight: 100, fontSize: 40, color: "#fff", transition: "color 0.2s ease-in-out", textShadow: "0 4px 10px rgba(0,0,0,0.6)" }}>Veren</span>
          </div>
        </div>
      </div>
    );
  }

// ── MAIN UI APP ──
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0f0f1a", fontFamily: "'Inter',system-ui,sans-serif", color: "#fff" }}>
      
      {/* ── SIDEBAR (desktop only) ── */}
      {!isMobile && (
        <aside style={{ width: 240, flexShrink: 0, backgroundImage: `url(${sidebarBg})`, backgroundSize: "cover", backgroundPosition: "center", borderRight: "1px solid #1e1e30", display: "flex", flexDirection: "column", padding: "20px 0" }}>
          <div style={{ padding: "0 20px 5px", borderBottom: "1px solid #1e1e30", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="MovieDate Logo" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }} />
            <div>
              <div style={{ fontFamily: "judul, sans-serif", marginBottom: -11, fontWeight: 100, fontSize: 26 }}>MovieDate</div>
              <div style={{ color: "#AACCD6", fontSize: 11, textAlign: "center" }}>Couple's Watchlist</div>
            </div>
          </div>
          <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
            {NAV_ITEMS.findIndex((item) => item.id === activeNav) !== -1 && (
              <div style={{ position: "absolute", top: 16, left: 12, right: 12, height: 40, background: "rgba(255, 255, 255, 0.15)", borderRadius: 10, transform: `translateY(${NAV_ITEMS.findIndex((item) => item.id === activeNav) * 44}px)`, transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)", zIndex: 0 }} />
            )}
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ height: 40, display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "0 14px", borderRadius: 10, border: "none", background: "transparent", color: isActive ? "#AACCD6" : "#9CA3AF", fontWeight: isActive ? 700 : 500, fontSize: 14, cursor: "pointer", position: "relative", zIndex: 1, transition: "color .2s" }}>
                  <img src={item.icon} alt={item.label} style={{ width: 18, height: 18, objectFit: "contain", opacity: isActive ? 1 : 0.6, transition: "opacity .2s" }} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div style={{ margin: "0 12px", background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(5px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex" }}>
              <Avatar profile={profiles.me} size={28} />
              <Avatar profile={profiles.partner} size={28} style={{ marginLeft: -8 }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{profiles.me.name} & {profiles.partner.name}</div>
              <div style={{ color: "#34D399", fontSize: 11 }}>● Connected Live</div>
            </div>
          </div>
          <div style={{ margin: "16px 12px 0", textAlign: "center", fontSize: 12, color: "#6B7280" }}>
            Login sebagai: <span style={{ color: profiles[userRole]?.color, fontWeight: 700 }}>{profiles[userRole]?.name}</span>
          </div>
        </aside>
      )}

<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* 👇 TAMBAHKAN KONDISI INI AGAR HEADER HANYA MUNCUL DI WATCHLIST 👇 */}
        {activeNav === "watchlist" && (
          <header style={{ 
                padding: isMobile ? "12px 16px" : "16px 28px",
                background: "#13131f", borderBottom: "1px solid #1e1e30", 
                display: "flex", flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 12 : 16, flexShrink: 0
          }}>
            <div ref={searchRef} style={{ flex: 1, position: "relative" }}>
              <img src="/search.png" alt="Search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: isMobile ? 14 : 16, height: isMobile ? 14 : 16, objectFit: "contain" }} />
              <input value={searchQ} onChange={(e) => handleSearchInput(e.target.value)} onFocus={() => searchQ && setShowSearch(true)} placeholder={TMDB_KEY ? "tambahkan film atau seriesmu love..." : "⚠️ Set VITE_TMDB_API_KEY in .env"} style={{ width: "100%", padding: isMobile ? "8px 14px 8px 36px" : "10px 14px 10px 40px", background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 10, color: "#fff", fontSize: isMobile ? 13 : 14, outline: "none", boxSizing: "border-box" }} />
              {showSearch && <SearchDropdown results={tmdbResults} onAdd={handleAddMovie} loading={tmdbLoading} />}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
              <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} style={{ flex: 1, background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#9CA3AF", padding: isMobile ? "6px 10px" : "8px 12px", borderRadius: 8, fontSize: isMobile ? 12 : 13, outline: "none", cursor: "pointer", fontWeight: 600 }}>
                <option value="All">Filter: All</option>
                {availableGenres.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1, background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#9CA3AF", padding: isMobile ? "6px 10px" : "8px 12px", borderRadius: 8, fontSize: isMobile ? 12 : 13, outline: "none", cursor: "pointer", fontWeight: 600 }}>
                <option value="title">Sort: A - Z</option>
                <option value="newest">Sort: Newest</option>
                <option value="rating">Sort: Top Rated</option>
              </select>
            </div>
          </header>
        )}
        {/* 👆 BATAS PENAMBAHAN KONDISI 👆 */}

        {activeNav === "watchlist" && (
          <div className="hide-scrollbar" style={{
            padding: isMobile ? "10px 16px" : "12px 28px", 
            background: "#13131f", borderBottom: "1px solid #1e1e30", 
            display: "flex", gap: 8, flexShrink: 0, 
            overflowX: "auto", whiteSpace: "nowrap"
          }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ 
                padding: isMobile ? "6px 12px" : "6px 16px",
                borderRadius: 20, background: filter === f ? ACCENT : "#1a1a2e", 
                border: filter === f ? "none" : "1px solid #2a2a3e", color: filter === f ? "#fff" : "#9CA3AF", 
                fontWeight: filter === f ? 700 : 500, fontSize: isMobile ? 11 : 13, cursor: "pointer", transition: "all .15s",
                flexShrink: 0
              }}>{f}</button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
                  
                  {/* 👇 INDIKATOR REFRESH MUNCUL DI ATAS SAAT DITARIK 👇 */}
                  {isMobile && pullDistance > 0 && (
                    <div style={{ position: "absolute", top: 16, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 0, opacity: pullDistance / 60 }}>
                      <div style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", padding: "8px 16px", borderRadius: 20, color: "#4BB8FA", fontSize: 12, fontWeight: 700, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 8 }}>
                        {pullDistance >= 60 ? "Refresh..." : "swipe up..."}
                      </div>
                    </div>
                  )}

                  {/* 👇 CONTAINER SCROLL DITAMBAH EVENT TOUCH & ANIMASI 👇 */}
                  <div 
                    className="hide-scrollbar" 
                    ref={scrollRef}
                    onTouchStart={isMobile ? handleTouchStart : undefined}
                    onTouchMove={isMobile ? handleTouchMove : undefined}
                    onTouchEnd={isMobile ? handleTouchEnd : undefined}
                    style={{ 
                      flex: 1, overflowY: "auto", padding: "24px 28px", paddingBottom: isMobile ? 180 : 150,
                      transform: `translateY(${pullDistance}px)`, // Efek layar ikut ketarik ke bawah
                      transition: pullStartY === 0 ? "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none", // Efek membal saat jari dilepas
                      position: "relative", zIndex: 1 
                    }}
                  >
            {activeNav === "watchlist" && (
              <>
                {movies.length === 0 ? (
                  <div style={{ textAlign: "center", marginTop: 80, color: "#6B7280" }}>
                    <img src="/Untitled-4.png" alt="Watchlist Kosong" style={{ width: 200, height: 200, objectFit: "contain", marginBottom: 16, display: "block", marginLeft: "auto", marginRight: "auto" }} />
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#9CA3AF", marginBottom: 8 }}>Watchlist kosong</div>
                    <div style={{ fontSize: 14 }}>Cari film di search bar di atas untuk mulai!</div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 24, gap: 10, width: "100%" }}>
                      <div style={{ position: "relative", width: "100%", maxWidth: 340 }}>
                        <input type="text" value={watchlistSearchQ} onChange={(e) => setWatchlistSearchQ(e.target.value)} placeholder="Cari film di watchlist ini..." style={{ width: "100%", padding: "8px 16px 8px 38px", background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 20, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                        <img src="/search.png" alt="Search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, objectFit: "contain", opacity: 0.6 }} />
                        {watchlistSearchQ && (
                          <button onClick={() => setWatchlistSearchQ("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
                        )}
                      </div>
                      <div style={{ color: "#6B7280", fontSize: 12, letterSpacing: "0.3px" }}>
                        {processedMovies.length} film {filterGenre !== "All" ? `· ${filterGenre}` : ""}
                        {watchlistSearchQ && ` · Hasil pencarian "${watchlistSearchQ}"`}
                      </div>
                    </div>

                    {processedMovies.length === 0 ? (
                      <div style={{ textAlign: "center", marginTop: 60, color: "#6B7280", position: "relative", zIndex: 1 }}>
                        <img src={kosong} alt="Tidak ditemukan" style={{ width: 400, height: "auto", objectFit: "contain", marginBottom: 16, display: "block", marginLeft: "auto", marginRight: "auto" }} />
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Film tidak ditemukan</div>
                        <div style={{ fontSize: 13, color: "#fff"}}>Tidak ada judul yang cocok dengan "{watchlistSearchQ}" di halaman ini.</div>
                      </div>
                    ) : (
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill,minmax(160px,1fr))", 
                      gap: isMobile ? 12 : 16 
                    }}>
                      {processedMovies.map((m) => (
                        <MovieCard key={m.id} movie={m} profiles={profiles} selected={selected?.id === m.id} onClick={(mov) => setSelected(selected?.id === mov.id ? null : mov)} />
                      ))}
                    </div>
                    )}
                  </>
                )}
              </>
            )}
            {activeNav === "reviews" && <TopReviewsView movies={movies} profiles={profiles} isMobile={isMobile} />}
            {activeNav === "analytics" && <AnalyticsView movies={movies} profiles={profiles} isMobile={isMobile} />}
            {activeNav === "settings" && <SettingsView profiles={profiles} onSave={saveProfiles} onLogout={handleLogout} isMobile={isMobile} />}
          </div>
          {selected && activeNav === "watchlist" && (
            <DetailPanel
              movie={selected}
              onClose={() => setSelected(null)}
              onToggleWatch={toggleWatch}
              onSaveReview={handleSaveReview}
              profiles={profiles}
              onDeleteMovie={triggerDeleteMovie}
              onOpenPopup={setCommentPopupTarget}
              onSaveLinks={handleSaveLinks} 
              isMobile={isMobile}
              onEditClick={(rev) => {
                setEditingReview(rev);
                setCommentText(rev.text || "");
                setPopupRating(rev.rating || 0);
                setCommentPopupTarget(selected);
                }}
            />
          )}
            {/* ── LAUT DEPAN CARD ── */}
            {(activeNav === "watchlist" || activeNav === "reviews" || activeNav === "analytics") && (
              <img 
                src={lautBg} 
                alt="Dekorasi Laut" 
                style={{ 
                  position: "absolute",
                  bottom: 0, 
                  left: 0,
                  width: "100%",
                  height: "400px",
                  objectFit: "cover", 
                  objectPosition: "center bottom",
                  zIndex: 0,
                  pointerEvents: "none",
                  maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
                }} 
              />
            )}
        </div>
      </div>

      {/* ── BOTTOM NAV (mobile only) ── */}
      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#13131f", borderTop: "1px solid #2a2a3e",
          display: "flex", zIndex: 9000, paddingBottom: "env(safe-area-inset-bottom)"
        }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 4, padding: "10px 0",
                  background: "transparent", border: "none",
                  color: isActive ? COLOR_SECONDARY : "#6B7280",
                  fontSize: 10, fontWeight: isActive ? 700 : 500, cursor: "pointer",
                  borderTop: isActive ? `2px solid ${COLOR_SECONDARY}` : "2px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                <img src={item.icon} alt={item.label} style={{ width: 20, height: 20, objectFit: "contain", opacity: isActive ? 1 : 0.5 }} />
                {item.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      )}

      {/* ── MODAL HAPUS ── */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 15, 26, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
          <div style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", margin: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: 16 }}>         
              <img src={deleteIcon} alt="Hapus" style={{ width: 50, height: 50, objectFit: "contain", display: "block" }} />
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: 18, fontWeight: 700 }}>Hapus dari Watchlist?</h3>
            <p style={{ margin: "0 0 24px 0", color: "#9CA3AF", fontSize: 14, lineHeight: 1.5 }}>Apakah kamu yakin ingin menghapus <span style={{ color: "#EF4444", fontWeight: 600 }}>"{deleteTarget.title}"</span> dari watchlist kalian, love?</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, background: "#2a2a3e", color: "#9CA3AF", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#3a3a54"} onMouseLeave={e => e.currentTarget.style.background = "#2a2a3e"}>Batal</button>
              <button onClick={confirmDeleteMovie} style={{ flex: 1, background: "#EF4444", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#DC2626"} onMouseLeave={e => e.currentTarget.style.background = "#EF4444"}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL POP-UP KOMENTAR & PAINT DI TENGAH LAYAR (BLUR) ── */}
      {commentPopupTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 18, 0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 11000, animation: "fadeIn 0.2s ease" }}>
          <div style={{ 
            background: "#13131f", border: "1px solid #2a2a3e", 
            borderRadius: isMobile ? "20px 20px 0 0" : 20, // 👈 Berubah di sini
            padding: 28, 
            paddingBottom: isMobile ? 80 : 28, // 👈 Berubah di sini (Biar gak ketutup nav bawah)
            width: "100%", 
            maxWidth: isMobile ? "100%" : 550, // 👈 Berubah di sini
            maxHeight: isMobile ? "90vh" : "auto", 
            overflowY: isMobile ? "auto" : "visible",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)", position: "relative" 
          }}>
            <button onClick={() => { setCommentPopupTarget(null); setCommentText(""); if(inputMode === "paint") clearCanvas(); }} style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: "#6B7280", fontSize: 20, cursor: "pointer" }}>×</button>
              {/* Judul & Bintang Rating */}
                          <h3 style={{ margin: "0", color: "#fff", fontSize: 18, fontWeight: 700, textAlign: "center" }}>
                            Beri Ulasan untuk film <span style={{ color: "#4BB8FA" }}>{commentPopupTarget.title}</span>
                          </h3>
                          
                          <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "12px 0 20px" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                onClick={() => setPopupRating(star)}
                                style={{ cursor: "pointer", fontSize: 38, lineHeight: 1, color: star <= popupRating ? "#F59E0B" : "#3a3a4e", transition: "all 0.2s", transform: star <= popupRating ? "scale(1.1)" : "scale(1)" }}
                              >
                                ★
                              </span>
                            ))}
                          </div>

                          <p style={{ margin: "0 0 20px 0", color: "#6B7280", fontSize: 13, textAlign: "center" }}>
                            Pilih bintang lalu ekspresikan pendapatmu lewat teks atau coretan gambar, love.
                          </p>
            <div style={{ display: "flex", background: "#1a1a2e", borderRadius: 10, padding: 4, marginBottom: 16, gap: 4 }}>
              
              {/* TOMBOL MODE TEKS */}
              <button 
                onClick={() => setInputMode("text")} 
                style={{ 
                  flex: 1, 
                  background: inputMode === "text" ? ACCENT : "transparent", 
                  border: "none", 
                  color: "#fff", 
                  padding: "8px", 
                  borderRadius: 8, 
                  fontSize: 13, 
                  fontWeight: 600, 
                  cursor: "pointer", 
                  transition: "all 0.2s",
                  display: "flex",            // 👈 Menyatukan gambar dan teks
                  alignItems: "center",       // 👈 Rata tengah vertikal
                  justifyContent: "center",   // 👈 Rata tengah horizontal
                  gap: 8                      // 👈 Jarak gambar dan teks
                }}
              >
                <img src={keyboard} alt="Teks" style={{ width: 16, height: 16, objectFit: "contain" }} />
                Teks
              </button>
              
              {/* TOMBOL MODE GAMBAR */}
              <button 
                onClick={() => setInputMode("paint")} 
                style={{ 
                  flex: 1, 
                  background: inputMode === "paint" ? ACCENT : "transparent", 
                  border: "none", 
                  color: "#fff", 
                  padding: "8px", 
                  borderRadius: 8, 
                  fontSize: 13, 
                  fontWeight: 600, 
                  cursor: "pointer", 
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                <img src={gambar} alt="Gambar" style={{ width: 16, height: 16, objectFit: "contain" }} />
                Gambar
              </button>
              <button 
                onClick={() => setInputMode("sticker")} 
                style={{ flex: 1, background: inputMode === "sticker" ? ACCENT : "transparent", border: "none", color: "#fff", padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                🎭 Sticker
              </button>
            </div>

            
            {inputMode === "text" ? (
              <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Bagaimana filmnya menurutmu love? Tulis di sini..." style={{ width: "100%", height: 140, background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 12, color: "#fff", padding: 14, fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 20, lineHeight: 1.5 }} />
                ) : inputMode === "sticker" ? (
                  <div style={{ marginBottom: 20 }}>
                    {/* Preview */}
                    <div style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 12, padding: 16, textAlign: "center", marginBottom: 12, minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {commentText && commentText.startsWith("/") || commentText && commentText.startsWith("blob") ? (
                        <img src={commentText} alt="sticker" style={{ maxHeight: 80, objectFit: "contain" }} />
                      ) : (
                        <span style={{ color: "#4B5563", fontSize: 13 }}>Pilih sticker di bawah, love ✨</span>
                      )}
                    </div>

                    {/* Grid semua sticker otomatis */}
                    <div className="hide-scrollbar" style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 200, overflowY: "auto" }}>
                      {STICKERS.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCommentText(src)}
                          style={{
                            width: 100, height: 100, padding: 4,
                            background: commentText === src ? "#2a2a3e" : "transparent",
                            border: commentText === src ? `2px solid ${ACCENT}` : "2px solid transparent",
                            borderRadius: 10, cursor: "pointer",
                            transition: "all 0.15s",
                            transform: commentText === src ? "scale(1.15)" : "scale(1)"
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#2a2a3e"; e.currentTarget.style.transform = "scale(1.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = commentText === src ? "#2a2a3e" : "transparent"; e.currentTarget.style.transform = commentText === src ? "scale(1.15)" : "scale(1)"; }}
                        >
                          <img src={src} alt={`sticker-${idx}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </button>
                      ))}
                    </div>
                  </div>

            ) : (
              <div style={{ position: "relative", marginBottom: 20 }}>
                {/* Area Papan Paint Kanvas Lebar */}
                <canvas
                  ref={canvasRef}
                  width={494}
                  height={220}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{
                    background: "#1a1a2e",
                    border: "1px solid #2a2a3e",
                    borderRadius: 12,
                    cursor: "crosshair",
                    display: "block",
                    width: "100%"
                  }}
                />


{/* ── ALAT GAMBAR LENGKAP & COMPACT ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                  
                  {/* BARIS 1: PALET WARNA (Ukuran Dikecilkan) */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>Warna:</span>
                    
                    {[
                      profiles[userRole || "me"]?.color || "#1591DC",
                      "#FFFFFF", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#A855F7", "#EC4899"  
                    ].map((col, idx) => {
                      const isActive = !isErasing && (paintColor || profiles[userRole || "me"]?.color) === col;
                      return (
                        <div
                          key={idx}
                          onClick={() => { setPaintColor(col); setIsErasing(false); }}
                          style={{
                            width: 18, height: 18, borderRadius: "50%", backgroundColor: col, cursor: "pointer", // 👈 Ukuran jadi 18px
                            border: isActive ? "2px solid #fff" : "2px solid transparent",
                            boxShadow: isActive ? `0 0 8px ${col}` : "0 2px 4px rgba(0,0,0,0.5)",
                            transform: isActive ? "scale(1.2)" : "scale(1)",
                            transition: "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)"
                          }}
                          title="Pilih Warna"
                        />
                      );
                    })}
                    
                    <div style={{ width: 1, height: 16, background: "#2a2a3e", margin: "0 2px" }} />

                    <input 
                      type="color" 
                      value={paintColor || profiles[userRole || "me"]?.color || "#ffffff"} 
                      onClick={() => setIsErasing(false)}
                      onChange={(e) => { setPaintColor(e.target.value); setIsErasing(false); }}
                      style={{ width: 22, height: 22, padding: 0, border: "none", cursor: "pointer", background: "transparent" }}
                      title="Warna Custom"
                    />
                  </div>

                  {/* BARIS 2: TOOLBAR BAWAH (Undo, Redo, Eraser, Slider, Clear) */}
                  <div style={{ 
                    display: "flex", justifyContent: "center", alignItems: "center", gap: 12, 
                    background: "#1a1a2e", padding: "6px 16px", borderRadius: 12, width: "fit-content", margin: "0 auto",
                    border: "1px solid #2a2a3e"
                  }}>
                    
                    {/* Undo */}
                    <button onClick={handleUndo} disabled={historyStep < 0} style={{ background: "transparent", border: "none", fontSize: 16, cursor: historyStep < 0 ? "not-allowed" : "pointer", opacity: historyStep < 0 ? 0.3 : 1, transition: "0.2s" }} title="Undo (Kembali)">↩️</button>
                    
                    {/* Redo */}
                    <button onClick={handleRedo} disabled={historyStep >= drawHistory.length - 1} style={{ background: "transparent", border: "none", fontSize: 16, cursor: historyStep >= drawHistory.length - 1 ? "not-allowed" : "pointer", opacity: historyStep >= drawHistory.length - 1 ? 0.3 : 1, transition: "0.2s" }} title="Redo (Maju)">↪️</button>
                    
                    <div style={{ width: 1, height: 16, background: "#3a3a4e" }} />
                    
{/* Penghapus */}
                    <button
                      onClick={() => setIsErasing(true)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 28, height: 28, borderRadius: 6, cursor: "pointer", 
                        background: isErasing ? "#EF4444" : "transparent",
                        border: "none", fontSize: 14,
                        boxShadow: isErasing ? "0 0 8px #EF4444" : "none",
                        transition: "all 0.2s"
                      }}
                      title="Penghapus"
                    >
                      {/* 👇 Emoji diganti dengan tag gambar (img) 👇 */}
                      <img src={hapus} alt="Penghapus" style={{ width: 16, height: 16, objectFit: "contain" }} />
                    </button>

                    <div style={{ width: 1, height: 16, background: "#3a3a4e" }} />

                    {/* Slider Ketebalan */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "#9CA3AF", minWidth: 28 }}>{brushSize}px</span>
                      <input type="range" min="1" max="30" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} style={{ width: 80, cursor: "pointer", accentColor: ACCENT }} />
                    </div>

                    <div style={{ width: 1, height: 16, background: "#3a3a4e" }} />

                    {/* Clear Canvas Baru */}
                    <button 
                      onClick={clearCanvas}
                      style={{ background: "transparent", border: "none", color: "#EF4444", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Clear
                    </button>
                    </div>
                  </div>
                </div>
            )}
            <button onClick={handleSubmitPopupReview} style={{ width: "100%", background: profiles.me.color, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Simpan & Kirim Ulasan</button>
          </div>
        </div>
      )}

      {/* ── MODAL ALERT DUPLIKAT ── */}
      {alertTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 15, 26, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
          <div style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", margin: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: 16 }}>         
              <img src={check} alt="Peringatan" style={{ width: 50, height: 50, objectFit: "contain", display: "block" }} />
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: 18, fontWeight: 700 }}>Sudah Ada di List!</h3>
            <p style={{ margin: "0 0 24px 0", color: "#9CA3AF", fontSize: 14, lineHeight: 1.5 }}>Film <span style={{ color: COLOR_LIGHT, fontWeight: 600 }}>"{alertTarget.title}"</span> sudah masuk di dalam watchlist kalian, love!</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={() => setAlertTarget(null)} style={{ width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"} onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}>Oke, Mengerti</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // ── FUNGSI MODAL HAPUS ──
  function triggerDeleteMovie(movieId, movieTitle) {
    setDeleteTarget({ id: movieId, title: movieTitle });
  }

  async function confirmDeleteMovie() {
    if (!deleteTarget) return;
    const { error } = await supabase.from("movies").delete().eq("id", deleteTarget.id);
    if (error) alert("Gagal menghapus film: " + error.message);
    else { setSelected(null); setDeleteTarget(null); }
  }
}
