import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, ZoomIn, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const G = {
  bg: "#0a0804",
  surface: "rgba(20, 16, 10, 0.72)", surface2: "rgba(26, 20, 8, 0.55)",
  border: "rgba(201,168,76,0.18)", gold: "#c9a84c", goldDim: "rgba(201,168,76,0.5)",
  text: "#f5ead6", muted: "#9a8060",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

const TABS = ["All", "Wedding Gallery", "Birthday Gallery", "Family Function Gallery", "Videos"];

function SectionHead({ script, title }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.8rem", lineHeight: 1.1 }}>{script}</p>
      <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, margin: "2px 0 0" }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <div style={{ height: "1px", width: "40px", background: `linear-gradient(to right, transparent, ${G.gold})` }} />
        <span style={{ color: G.gold }}>✦</span>
        <div style={{ height: "1px", width: "40px", background: `linear-gradient(to left, transparent, ${G.gold})` }} />
      </div>
    </div>
  );
}

export default function GalleryTab() {
  const [active, setActive] = useState("All");
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setGallery(data || []);
    } catch (err) {
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGallery(); }, []);

  const filteredItems = active === "All" ? gallery : gallery.filter(item => item.category === active);

  // Keyboard navigation in lightbox
  const handleKey = useCallback((e) => {
    if (lightboxIndex === null) return;
    if (e.key === "ArrowRight") setLightboxIndex(i => i !== null ? Math.min(i + 1, filteredItems.length - 1) : null);
    if (e.key === "ArrowLeft")  setLightboxIndex(i => i !== null ? Math.max(i - 1, 0) : null);
    if (e.key === "Escape")     setLightboxIndex(null);
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const lightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;
  const isVideo = lightboxItem?.media_type === "video" || lightboxItem?.category === "Videos";

  return (
    <div style={{ padding: "2rem" }}>
      <SectionHead script="Captured Memories" title="Event Gallery" />

      {/* Category Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => { setActive(t); setLightboxIndex(null); }}
            style={{
              padding: "0.45rem 1.1rem",
              border: `1px solid ${active === t ? G.gold : G.border}`,
              background: active === t ? "rgba(201,168,76,0.12)" : "transparent",
              color: active === t ? G.gold : G.muted,
              borderRadius: "4px", cursor: "pointer",
              fontSize: "0.8rem", fontFamily: G.sans,
              fontWeight: active === t ? 600 : 400,
              transition: "all 0.2s",
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Count badge */}
      {!loading && filteredItems.length > 0 && (
        <p style={{ color: G.muted, fontFamily: G.sans, fontSize: "0.78rem", marginBottom: "1.25rem" }}>
          {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${G.border}`, borderTop: `2px solid ${G.gold}`, margin: "0 auto 1rem" }}
          />
          <p style={{ color: G.muted, fontFamily: G.sans }}>Loading gallery…</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: "5rem 2rem", textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}>
            <Images size={30} style={{ color: G.goldDim }} />
          </div>
          <p style={{ fontFamily: G.serif, color: G.text, fontSize: "1.1rem", marginBottom: "0.4rem" }}>
            No photos yet
          </p>
          <p style={{ color: G.muted, fontSize: "0.85rem" }}>
            Our team is capturing your memories — check back soon!
          </p>
        </motion.div>
      ) : (
        <motion.div
          key={active}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          style={{ columns: "3 200px", gap: "1rem" }}>
          {filteredItems.map((photo, i) => {
            const isVid = photo.media_type === "video" || photo.category === "Videos";
            return (
              <motion.div key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(i)}
                style={{
                  position: "relative", marginBottom: "1rem", borderRadius: "8px",
                  overflow: "hidden", cursor: "pointer",
                  border: `1px solid ${G.border}`, display: "inline-block",
                  width: "100%", breakInside: "avoid", transition: "border-color 0.25s",
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.borderColor = G.goldDim; }}
                onMouseLeave={(e) => { (e.currentTarget).style.borderColor = G.border; }}>
                <img
                  src={photo.url} alt={photo.caption}
                  style={{ width: "100%", display: "block", objectFit: "cover" }}
                  onError={(e) => { (e.target).src = "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=300&fit=crop"; }}
                />
                {/* Hover overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(10,8,4,0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.25s",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.background = "rgba(10,8,4,0.5)";
                    const icon = e.currentTarget.querySelector(".icon-wrap") | null;
                    if (icon) icon.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.background = "rgba(10,8,4,0)";
                    const icon = e.currentTarget.querySelector(".icon-wrap") | null;
                    if (icon) icon.style.opacity = "0";
                  }}>
                  <div className="icon-wrap" style={{
                    opacity: 0, transition: "opacity 0.2s",
                    background: "rgba(201,168,76,0.15)", border: `1px solid ${G.goldDim}`,
                    borderRadius: "50%", width: 44, height: 44,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isVid ? <Play size={20} style={{ color: G.gold }} /> : <ZoomIn size={20} style={{ color: G.gold }} />}
                  </div>
                </div>
                {/* Caption */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.6rem 0.8rem", background: "linear-gradient(to top, rgba(10,8,4,0.82), transparent)" }}>
                  <p style={{ color: G.text, fontSize: "0.73rem", fontFamily: G.serif, margin: 0 }}>{photo.caption}</p>
                  {isVid && (
                    <span style={{ fontSize: "0.62rem", color: G.gold, fontFamily: G.sans, textTransform: "uppercase", letterSpacing: "0.08em" }}>● Video</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(10,8,4,0.95)",
              backdropFilter: "blur(12px)", zIndex: 300,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
            }}>

            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              style={{
                position: "absolute", top: "1.5rem", right: "1.5rem",
                background: "rgba(201,168,76,0.12)", border: `1px solid ${G.border}`,
                color: G.gold, cursor: "pointer", borderRadius: "50%",
                width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <X size={18} />
            </button>

            {/* Prev */}
            {lightboxIndex !== null && lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? i - 1 : null); }}
                style={{
                  position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)",
                  background: "rgba(201,168,76,0.12)", border: `1px solid ${G.border}`,
                  color: G.gold, cursor: "pointer", borderRadius: "50%",
                  width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Next */}
            {lightboxIndex !== null && lightboxIndex < filteredItems.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? i + 1 : null); }}
                style={{
                  position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)",
                  background: "rgba(201,168,76,0.12)", border: `1px solid ${G.border}`,
                  color: G.gold, cursor: "pointer", borderRadius: "50%",
                  width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                <ChevronRight size={20} />
              </button>
            )}

            {/* Media */}
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", maxWidth: "90vw" }}
              onClick={e => e.stopPropagation()}>
              {isVideo ? (
                <video
                  src={lightboxItem.url} controls autoPlay
                  style={{ maxWidth: "85vw", maxHeight: "75vh", objectFit: "contain", borderRadius: "10px", border: `1px solid ${G.border}` }}
                />
              ) : (
                <motion.img
                  key={lightboxItem.id}
                  initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.88, opacity: 0 }} transition={{ duration: 0.22 }}
                  src={lightboxItem.url} alt={lightboxItem.caption}
                  style={{ maxWidth: "85vw", maxHeight: "75vh", objectFit: "contain", borderRadius: "10px", border: `1px solid ${G.border}` }}
                />
              )}
              {/* Caption & counter */}
              <div style={{ textAlign: "center" }}>
                <p style={{ color: G.text, fontFamily: G.serif, fontSize: "0.95rem", margin: 0 }}>{lightboxItem.caption}</p>
                <p style={{ color: G.muted, fontFamily: G.sans, fontSize: "0.72rem", marginTop: "0.25rem" }}>
                  {lightboxItem.category}
                  {lightboxIndex !== null && ` · ${lightboxIndex + 1} / ${filteredItems.length}`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

