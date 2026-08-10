import { motion } from "motion/react";
import { Bell, Tag, CalendarClock, CheckCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

const G = {
  surface: "rgba(20, 16, 10, 0.72)", surface2: "rgba(26, 20, 8, 0.55)", border: "rgba(201,168,76,0.18)", gold: "#c9a84c",
  text: "#f5ead6", muted: "#9a8060",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

const typeConfig = {
  booking: { icon: Bell, color: G.gold, bg: "rgba(201,168,76,0.12)", label: "Booking Update" },
  offer:   { icon: Tag, color: "#4ade80", bg: "rgba(74,222,128,0.1)", label: "Offer" },
  reminder:{ icon: CalendarClock, color: "#60a5fa", bg: "rgba(96,165,250,0.1)", label: "Reminder" },
};

function SectionHead({ script, title }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.6rem", lineHeight: 1.1 }}>{script}</p>
      <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, margin: 0 }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <div style={{ height: "1px", width: "40px", background: `linear-gradient(to right, transparent, ${G.gold})` }} />
        <span style={{ color: G.gold }}>✦</span>
        <div style={{ height: "1px", width: "40px", background: `linear-gradient(to left, transparent, ${G.gold})` }} />
      </div>
    </div>
  );
}

const FILTERS = ["All", "Booking Updates", "Offers & Discounts", "Event Reminders"];

export default function NotificationsTab({ onReadChange }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const loadNotifications = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (user) {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifs(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
    if (!error) {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      onReadChange?.();
    }
  };

  const unread = notifs.filter(n => !n.read).length;

  const filterMap = {
    "All": null,
    "Booking Updates": "booking",
    "Offers & Discounts": "offer",
    "Event Reminders": "reminder",
  };

  const shown = filter === "All" ? notifs : notifs.filter(n => n.type === filterMap[filter]);

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <SectionHead script="Stay Updated" title="Notifications" />
        {unread > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.1)", border: `1px solid ${G.border}`, borderRadius: "99px", padding: "4px 12px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: G.gold, display: "inline-block" }} />
            <span style={{ color: G.gold, fontSize: "0.75rem", fontWeight: 600 }}>{unread} unread</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "0.4rem 1rem", border: `1px solid ${filter === f ? G.gold : G.border}`, background: filter === f ? "rgba(201,168,76,0.12)" : "transparent", color: filter === f ? G.gold : G.muted, borderRadius: "4px", cursor: "pointer", fontSize: "0.78rem", fontFamily: G.sans, fontWeight: filter === f ? 600 : 400, transition: "all 0.2s" }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: G.muted, fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>Loading notifications...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {shown.length === 0 ? (
            <p style={{ color: G.muted, fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>No notifications found.</p>
          ) : (
            shown.map((n, i) => {
              const cfg = typeConfig[n.type] || typeConfig.booking;
              const Icon = cfg.icon;
              return (
                <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => { if (!n.read) markAsRead(n.id); }}
                  style={{ background: n.read ? G.surface : `linear-gradient(90deg, rgba(201,168,76,0.07), ${G.surface})`, border: `1px solid ${n.read ? G.border : "rgba(201,168,76,0.3)"}`, borderRadius: "10px", padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start", cursor: n.read ? "default" : "pointer" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} style={{ color: cfg.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: "0.3rem" }}>
                      <span style={{ background: cfg.bg, color: cfg.color, padding: "1px 8px", borderRadius: "99px", fontSize: "0.65rem", fontWeight: 700 }}>{cfg.label}</span>
                      {!n.read && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: G.gold, flexShrink: 0 }} />}
                    </div>
                    <p style={{ color: G.text, fontSize: "0.9rem", fontWeight: n.read ? 400 : 600, marginBottom: "0.3rem", fontFamily: G.serif }}>{n.title}</p>
                    <p style={{ color: G.muted, fontSize: "0.82rem", lineHeight: 1.65 }}>{n.body}</p>
                    <p style={{ color: G.muted, fontSize: "0.7rem", marginTop: "0.5rem", opacity: 0.7 }}>{n.time}</p>
                  </div>
                  {n.read && <CheckCheck size={16} style={{ color: G.muted, opacity: 0.4, flexShrink: 0 }} />}
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

