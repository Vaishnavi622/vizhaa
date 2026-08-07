import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, CalendarDays, Package, Images, BookOpen,
  Bell, User, ChevronLeft, ChevronRight, Menu, X, LogOut
} from "lucide-react";

import logo from "@/assets/logo.png";

const NAV_ITEMS = [
  { id: "home",          label: "Home",           icon: Home },
  { id: "events",        label: "Events",          icon: CalendarDays },
  { id: "packages",      label: "Packages",        icon: Package },
  { id: "bookings",      label: "My Bookings",     icon: BookOpen },
  { id: "gallery",       label: "Event Gallery",   icon: Images },
  { id: "notifications", label: "Notifications",   icon: Bell },
  { id: "profile",       label: "Profile",         icon: User },
];

const G = {
  bg: "#0a0804",
  surface: "rgba(20, 16, 10, 0.72)",
  surface2: "rgba(26, 20, 8, 0.55)",
  border: "rgba(201,168,76,0.18)",
  gold: "#c9a84c",
  goldLight: "#e8cc84",
  goldDim: "rgba(201,168,76,0.5)",
  text: "#f5ead6",
  muted: "#9a8060",
  serif: "'Playfair Display', serif",
  sans: "'Raleway', sans-serif",
  script: "'Great Vibes', cursive",
};

export default function DashboardLayout({ activeTab, onTabChange, onLogout, userName, children, notifCount = 3 }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "1.5rem 0.75rem" : "1.5rem 1.5rem", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", flexShrink: 0 }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logo} alt="Vizhaa Logo" style={{ height: "44px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 1px 6px rgba(201,168,76,0.3))" }} />
            <div>
              <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.6rem", lineHeight: 1 }}>Vizhaa</p>
              <p style={{ color: G.muted, fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Event Management App</p>
            </div>
          </div>
        )}
        {collapsed && <img src={logo} alt="Vizhaa Logo" style={{ height: "30px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 1px 4px rgba(201,168,76,0.25))" }} />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex"
          style={{ background: "none", border: `1px solid ${G.border}`, color: G.gold, cursor: "pointer", borderRadius: "50%", width: "26px", height: "26px", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* User pill */}
      {!collapsed && (
        <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${G.border}`, flexShrink: 0 }}>
          <div className="flex items-center gap-3">
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #9a7a2e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#0a0804", fontWeight: 700, fontSize: "0.95rem" }}>{userName[0].toUpperCase()}</span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ color: G.text, fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "0.75rem 0", scrollbarWidth: "none" }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = id === activeTab;
          const isBell = id === "notifications";
          return (
            <button
              key={id}
              onClick={() => { onTabChange(id); setMobileOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                width: "100%",
                padding: collapsed ? "0.75rem" : "0.72rem 1.5rem",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "linear-gradient(90deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))" : "transparent",
                border: "none",
                borderLeft: active ? `3px solid ${G.gold}` : "3px solid transparent",
                color: active ? G.gold : G.muted,
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = G.goldLight; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = G.muted; }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Icon size={18} />
                {isBell && notifCount > 0 && (
                  <span style={{ position: "absolute", top: "-5px", right: "-6px", background: G.gold, color: "#0a0804", borderRadius: "50%", width: "14px", height: "14px", fontSize: "0.55rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {notifCount}
                  </span>
                )}
              </div>
              {!collapsed && <span style={{ fontSize: "0.88rem", fontFamily: G.sans, whiteSpace: "nowrap" }}>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: collapsed ? "1rem 0.75rem" : "1rem 1.5rem", borderTop: `1px solid ${G.border}`, flexShrink: 0 }}>
        <button
          onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: collapsed ? "center" : "flex-start", background: "none", border: "none", color: G.muted, cursor: "pointer", width: "100%", padding: "0.5rem 0", transition: "color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#e05555"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = G.muted; }}
        >
          <LogOut size={17} />
          {!collapsed && <span style={{ fontSize: "0.88rem", fontFamily: G.sans }}>Logout</span>}
        </button>
      </div>
    </div>
  );

  const sidebarW = collapsed ? "64px" : "240px";

  return (
    <div style={{ display: "flex", height: "100vh", background: G.bg, overflow: "hidden", fontFamily: G.sans }}>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col"
        style={{ background: G.surface, borderRight: `1px solid ${G.border}`, overflow: "hidden", flexShrink: 0, zIndex: 10 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.7)", zIndex: 40 }}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "240px", background: G.surface, borderRight: `1px solid ${G.border}`, zIndex: 50, display: "flex", flexDirection: "column" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar (mobile) */}
        <header className="flex lg:hidden items-center justify-between" style={{ background: G.surface, borderBottom: `1px solid ${G.border}`, padding: "0 1rem", height: "56px", flexShrink: 0 }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", color: G.gold, cursor: "pointer" }}>
            <Menu size={22} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={logo} alt="Vizhaa Logo" style={{ height: "30px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 1px 4px rgba(201,168,76,0.25))" }} />
            <span style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem" }}>Vizhaa</span>
          </div>
          <div style={{ width: "22px" }} />
        </header>

        {/* Tab header bar */}
        <div style={{ background: G.surface2, borderBottom: `1px solid ${G.border}`, padding: "0 1.5rem", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div className="flex items-center gap-2">
            <span style={{ color: G.muted, fontSize: "0.75rem" }}>Dashboard</span>
            <span style={{ color: G.border }}>›</span>
            <span style={{ color: G.gold, fontSize: "0.82rem", fontWeight: 600 }}>
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange("notifications")}
              style={{ position: "relative", background: "none", border: "none", color: G.muted, cursor: "pointer" }}
            >
              <Bell size={18} />
              {notifCount > 0 && (
                <span style={{ position: "absolute", top: "-4px", right: "-4px", background: G.gold, color: "#0a0804", borderRadius: "50%", width: "14px", height: "14px", fontSize: "0.55rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {notifCount}
                </span>
              )}
            </button>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #9a7a2e)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => onTabChange("profile")}>
              <span style={{ color: "#0a0804", fontWeight: 700, fontSize: "0.8rem" }}>{userName[0].toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{ minHeight: "100%" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

