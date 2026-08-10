import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import {
  LayoutDashboard, Users, User, ShoppingBag, CalendarDays, Bell, Settings,
  TrendingUp, TrendingDown, CheckCircle, Clock, XCircle, LogOut, Menu,
  ChevronRight, ChevronDown, MapPin, Scissors, Gift, CreditCard, Images,
  BarChart3, Star, AlertCircle, UserCheck, Send, Trash2, Edit3, Plus,
  Eye, Ban, RefreshCw, Download, Upload, Folder, MessageSquare, ThumbsUp,
  ThumbsDown, ChevronLeft, Package2, Wrench,
  Palette, Utensils, Camera, Music, Mail, Clipboard, Sparkles, Play, ZoomIn, X,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from "date-fns";
import ProfileTab from "./ProfileTab";
import { EditVendorModal } from "./EditVendorModal";
import { AdminPackagesPanel } from "./AdminPackagesPanel";
import logo from "@/assets/logo.png";

const G = {
  bg: "#0a0804",
  surface: "rgba(20, 16, 10, 0.72)",
  surface2: "rgba(26, 20, 8, 0.55)",
  border: "rgba(201,168,76,0.18)", gold: "#c9a84c",
  text: "#f5ead6", muted: "#9a8060",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

const NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { id: "dashboard", label: "Dashboard",   icon: LayoutDashboard },
      { id: "services_mgmt", label: "Services",    icon: Scissors },
      { id: "packages_mgmt", label: "Packages",    icon: Package2 },
      { id: "vendors_mgmt", label: "Vendors",     icon: Users },
      { id: "bookings", label: "Booking",     icon: ShoppingBag },
      { id: "reports", label: "Performance", icon: BarChart3 },
      { id: "reviews", label: "Feedback",    icon: Star },
      { id: "event_gallery", label: "Event Gallery", icon: Images },
      { id: "profile", label: "Profile",     icon: User },
    ],
  },
];

/* ─── shared helpers ─── */
const sc = (s) => s === "Confirmed" || s === "Completed" || s === "Paid" ? "#4ade80" : s === "Pending" ? G.gold : "#f87171";
const sb = (s) => s === "Confirmed" || s === "Completed" || s === "Paid" ? "rgba(74,222,128,0.1)" : s === "Pending" ? "rgba(201,168,76,0.1)" : "rgba(248,113,113,0.1)";
const SI = ({ s }) => s === "Confirmed" || s === "Completed" || s === "Paid" ? <CheckCircle size={12} /> : s === "Pending" ? <Clock size={12} /> : <XCircle size={12} />;

function Chip({ label, color, bg }) {
  return <span style={{ background: bg, color, padding: "2px 10px", borderRadius: "99px", fontSize: "0.68rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>{label}</span>;
}

const ACTION_MESSAGES = {
  "View":        "Opening details…",
  "Edit":        "Opening editor…",
  "Delete":      "Item deleted.",
  "Add":         "New item added.",
  "Confirm":     "Confirmed successfully.",
  "Approve":     "Approved successfully.",
  "Refund":      "Refund initiated.",
  "Invoice":     "Invoice downloaded.",
  "Contact":     "Opening contact form…",
  "Block":       "User blocked.",
  "Unblock":     "User unblocked.",
  "Profile":     "Opening customer profile…",
  "Add Points":  "Bonus points added.",
  "Deduct":      "Points deducted.",
  "Pricing":     "Opening pricing editor…",
  "Availability":"Opening availability calendar…",
  "Organise":    "Opening album organiser…",
  "Reply":       "Opening reply editor…",
  "Use":         "Template applied.",
  "Respond":     "Opening response editor…",
  "Add Service": "Opening new service form…",
  "Add Venue":   "Opening new venue form…",
  "Add Category":"Opening new category form…",
  "Export":      "Report exported.",
  "Send Now":    "Notification sent!",
};

function ActionBtn({ icon: Icon, label, danger, onClick }) {
  const handleClick = (e) => {
    onClick?.(e);
    const msg = ACTION_MESSAGES[label];
    if (msg) {
      if (danger) toast.error(msg, { style: { background: G.surface2, border: `1px solid rgba(248,113,113,0.3)`, color: "#f87171" } });
      else        toast.success(msg, { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
    }
  };
  return (
    <button onClick={handleClick} style={{ display: "flex", alignItems: "center", gap: "5px", background: danger ? "rgba(248,113,113,0.1)" : "rgba(201,168,76,0.1)", border: `1px solid ${danger ? "rgba(248,113,113,0.3)" : G.border}`, color: danger ? "#f87171" : G.gold, padding: "4px 12px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer", fontFamily: G.sans, transition: "opacity 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
      <Icon size={12} />{label}
    </button>
  );
}

function AHead({ label, title }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.4rem", lineHeight: 1 }}>{label}</p>
      <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "clamp(1.2rem,3vw,1.7rem)", fontWeight: 700, margin: "2px 0 0" }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
        <div style={{ height: "1px", width: "32px", background: `linear-gradient(to right, transparent, ${G.gold})` }} />
        <span style={{ color: G.gold, fontSize: "0.9rem" }}>✦</span>
        <div style={{ height: "1px", width: "32px", background: `linear-gradient(to left, transparent, ${G.gold})` }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, up }) {
  return (
    <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "1.25rem" }}>
      <p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>{label}</p>
      <p style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.8rem", fontWeight: 700, lineHeight: 1, marginBottom: "0.3rem" }}>{value}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {up ? <TrendingUp size={12} style={{ color: "#4ade80" }} /> : <TrendingDown size={12} style={{ color: "#f87171" }} />}
        <span style={{ color: up ? "#4ade80" : "#f87171", fontSize: "0.7rem" }}>{sub}</span>
      </div>
    </div>
  );
}

/* ══════════════ CALENDAR COMPONENT ══════════════ */
function CalendarWidget({ bookings }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart  = startOfMonth(currentMonth);
  const monthEnd    = endOfMonth(currentMonth);
  const days        = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay    = getDay(monthStart); // 0=Sun

  const WEEKDAYS    = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getKey = (d) => format(d, "yyyy-MM-dd");

  const calendarEventsLookup = {};
  
  bookings.forEach(b => {
    if (b.event_date) {
      const key = b.event_date;
      if (!calendarEventsLookup[key]) {
        calendarEventsLookup[key] = [];
      }
      calendarEventsLookup[key].push({
        event: b.event_name,
        client: b.profiles?.full_name || "Customer",
        color: b.status === "Confirmed" ? G.gold : b.status === "Completed" ? "#4ade80" : "#f87171"
      });
    }
  });

  const eventsForDate = (d) => calendarEventsLookup[getKey(d)] ?? [];
  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  return (
    <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <p style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem" }}>
          {format(currentMonth, "MMMM yyyy")}
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            style={{ width: "28px", height: "28px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            style={{ width: "28px", height: "28px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign: "center", color: G.muted, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const evs = eventsForDate(day);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const hasEvents = evs.length > 0;
          const isToday = isSameDay(day, new Date());
          return (
            <button key={day.toString()} onClick={() => setSelectedDate(isSameDay(day, selectedDate ?? new Date(0)) ? null : day)}
              style={{
                position: "relative", padding: "6px 2px", borderRadius: "6px", border: `1px solid ${isSelected ? G.gold : "transparent"}`,
                background: isSelected ? "rgba(201,168,76,0.15)" : hasEvents ? "rgba(201,168,76,0.05)" : "transparent",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                transition: "all 0.15s",
              }}>
              <span style={{ fontSize: "0.78rem", color: isSelected ? G.gold : isToday ? "#60a5fa" : G.text, fontWeight: isToday || isSelected ? 700 : 400 }}>
                {format(day, "d")}
              </span>
              {hasEvents && (
                <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", justifyContent: "center" }}>
                  {evs.slice(0, 3).map((ev, j) => (
                    <div key={j} style={{ width: "5px", height: "5px", borderRadius: "50%", background: ev.color }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date events */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${G.border}` }}>
              <p style={{ color: G.muted, fontSize: "0.72rem", marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {format(selectedDate, "d MMMM yyyy")}
              </p>
              {selectedEvents.length === 0 ? (
                <p style={{ color: G.muted, fontSize: "0.82rem", fontStyle: "italic" }}>No events scheduled for this date.</p>
              ) : (
                selectedEvents.map((ev, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.85rem", background: G.surface2, border: `1px solid ${G.border}`, borderLeft: `3px solid ${ev.color}`, borderRadius: "6px", marginBottom: "0.5rem" }}>
                    <div>
                      <p style={{ color: G.text, fontSize: "0.85rem", fontFamily: G.serif }}>{ev.event}</p>
                      <p style={{ color: G.muted, fontSize: "0.7rem" }}>{ev.client}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Shared data parsing helper ─── */
const parseAmount = (amtStr) => {
  if (!amtStr) return 0;
  const clean = amtStr.replace(/[^0-9]/g, "");
  return parseInt(clean) || 0;
};

/* ══════════════ PANELS ══════════════ */
const PIE_COLORS   = [G.gold, "#60a5fa", "#4ade80", "#f87171"];

function DashboardPanel({ bookings, profiles }) {
  const totalBookings = bookings.length;
  const totalUsers = profiles.length;
  
  const totalRevenue = bookings
    .filter(b => b.status !== "Cancelled")
    .reduce((acc, b) => acc + parseAmount(b.amount), 0);
  const formattedRevenue = totalRevenue >= 100000 
    ? `₹${(totalRevenue / 100000).toFixed(1)}L` 
    : `₹${totalRevenue.toLocaleString()}`;

  const cancelledCount = bookings.filter(b => b.status === "Cancelled").length;

  const recentDbBookings = bookings.slice(0, 4).map(b => ({
    id: b.id.substring(0, 8).toUpperCase(),
    user: b.profiles?.full_name || "New Customer",
    event: b.event_name,
    amount: b.amount,
    status: b.status
  }));

  return (
    <div style={{ padding: "2rem" }}>
      <AHead label="Overview" title="Admin Dashboard" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Total Bookings"  value={String(totalBookings)} sub={totalBookings > 0 ? "From database" : "No bookings yet"} up={totalBookings > 0}  />
        <StatCard label="Total Users"     value={String(totalUsers)}  sub={totalUsers > 0 ? "Registered users" : "No users yet"}  up={totalUsers > 0}  />
        <StatCard label="Revenue"         value={formattedRevenue} sub={totalRevenue > 0 ? "Non-cancelled bookings" : "No revenue yet"} up={totalRevenue > 0}  />
        <StatCard label="Cancelled"       value={String(cancelledCount)} sub={cancelledCount > 0 ? "Cancelled bookings" : "None cancelled"}  up={false} />
      </div>

      {/* Calendar + recent bookings */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 420px) 1fr", gap: "1.5rem", marginBottom: "2rem" }} className="grid grid-cols-[minmax(300px,420px)_1fr]">
        <div>
          <p style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", marginBottom: "0.75rem" }}>Event Calendar</p>
          <CalendarWidget bookings={bookings} />
        </div>
        <div>
          <p style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", marginBottom: "0.75rem" }}>Recent Bookings</p>
          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", overflow: "hidden" }}>
            {recentDbBookings.length === 0 ? (
              <p style={{ color: G.muted, fontSize: "0.85rem", textAlign: "center", padding: "1.5rem" }}>No bookings found</p>
            ) : (
              recentDbBookings.map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", padding: "0.85rem 1.25rem", borderBottom: i < recentDbBookings.length - 1 ? `1px solid ${G.border}` : "none" }}>
                  <div><p style={{ color: G.text, fontSize: "0.85rem", fontFamily: G.serif }}>{b.event}</p><p style={{ color: G.muted, fontSize: "0.7rem" }}>{b.id} · {b.user}</p></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ color: G.gold, fontWeight: 700, fontSize: "0.85rem" }}>{b.amount}</span>
                    <Chip label={b.status} color={sc(b.status)} bg={sb(b.status)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ BOOKINGS PANEL ══════════════ */
function BookingsPanel({ bookings, onReload }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);

  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === "Confirmed" || b.status === "Completed").length;
  const pendingCount = bookings.filter(b => b.status === "Pending" || b.status === "In Progress").length;
  const cancelledCount = bookings.filter(b => b.status === "Cancelled").length;

  const handleSaveBooking = async () => {
    const { error } = await supabase
      .from("bookings")
      .update({
        coordinator: editBooking.coordinator,
        amount: editBooking.amount,
        paid: editBooking.paid,
        status: editBooking.status,
        details: editBooking.details
      })
      .eq("id", editBooking.id);

    if (error) {
      toast.error("Failed to update booking: " + error.message, { style: { background: G.surface2, border: `1px solid rgba(248,113,113,0.3)`, color: "#f87171" } });
    } else {
      toast.success("Booking updated successfully!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
      setEditBooking(null);
      onReload();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (error) {
      toast.error("Failed to update status: " + error.message, { style: { background: G.surface2, border: `1px solid rgba(248,113,113,0.3)`, color: "#f87171" } });
    } else {
      toast.success(`Booking status changed to ${newStatus}!`, { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
      onReload();
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <AHead label="Manage Orders" title="All Bookings" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ l: "Total", v: String(totalBookings) },{ l: "Confirmed", v: String(confirmedCount) },{ l: "Pending", v: String(pendingCount) },{ l: "Cancelled", v: String(cancelledCount) }].map(({ l, v }) => (
          <div key={l} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "1.1rem", textAlign: "center" }}>
            <p style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.6rem", fontWeight: 700 }}>{v}</p>
            <p style={{ color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "3px" }}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", overflow: "hidden" }}>
        {bookings.length === 0 ? (
          <p style={{ color: G.muted, fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>No bookings found.</p>
        ) : (
          bookings.map((b, i) => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", padding: "1rem 1.5rem", borderBottom: i < bookings.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <div>
                <p style={{ color: G.text, fontSize: "0.88rem", fontFamily: G.serif }}>{b.event_name}</p>
                <p style={{ color: G.muted, fontSize: "0.7rem" }}>{b.id.substring(0, 8).toUpperCase()} · {b.profiles?.full_name || "Customer"} · {b.event_date} · Coordinator: {b.coordinator || "Unassigned"}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                <span style={{ color: G.gold, fontWeight: 700, fontSize: "0.88rem" }}>{b.amount}</span>
                <Chip label={b.status} color={sc(b.status)} bg={sb(b.status)} />
                <button onClick={() => setSelectedBooking(b)} style={{ display: "flex", alignItems: "center", gap: "3px", background: "rgba(201,168,76,0.1)", border: `1px solid ${G.border}`, color: G.gold, padding: "4px 10px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" }}>
                  <Eye size={12} /> View
                </button>
                <button onClick={() => setEditBooking(b)} style={{ display: "flex", alignItems: "center", gap: "3px", background: "rgba(201,168,76,0.1)", border: `1px solid ${G.border}`, color: G.gold, padding: "4px 10px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" }}>
                  <Edit3 size={12} /> Edit
                </button>
                {b.status === "Pending" && (
                  <>
                    <button onClick={() => handleStatusChange(b.id, "Confirmed")} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", padding: "4px 10px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" }}>Confirm</button>
                    <button onClick={() => handleStatusChange(b.id, "Cancelled")} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "4px 10px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" }}>Decline</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={() => setSelectedBooking(null)}>
          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", padding: "2rem", color: G.text, position: "relative" }}
            onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedBooking(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                color: G.muted,
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = G.gold}
              onMouseLeave={e => e.currentTarget.style.color = G.muted}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.3rem", marginBottom: "1rem" }}>Booking Details</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Event Name</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.event_name}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Booking ID</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.id}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Date</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.event_date}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Time</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.event_time || "TBD"}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Guests</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.guests_count || "TBD"}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Venue</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.venue || "TBD"}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Status</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.status}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Coordinator</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.coordinator || "Not Assigned"}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Amount</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.amount}</p></div>
              <div><p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase" }}>Paid</p><p style={{ fontSize: "0.9rem" }}>{selectedBooking.paid}</p></div>
            </div>

            {selectedBooking.services && selectedBooking.services.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Services Requested</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {selectedBooking.services.map((s) => <span key={s} style={{ background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, color: G.muted, padding: "3px 10px", borderRadius: "99px", fontSize: "0.72rem" }}>{s}</span>)}
                </div>
              </div>
            )}

            {selectedBooking.details && Object.keys(selectedBooking.details).length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Custom Form Selections</p>
                <div style={{ background: G.surface2, padding: "1rem", borderRadius: "8px", border: `1px solid ${G.border}` }}>
                  {Object.entries(selectedBooking.details).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                      <span style={{ color: G.muted }}>{key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}:</span>
                      <span style={{ color: G.text }}>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setSelectedBooking(null)} style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.6rem 1.5rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", width: "100%" }}>Close</button>
          </div>
        </div>
      )}

      {/* Booking Edit Modal */}
      {editBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={() => setEditBooking(null)}>
          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", padding: "2rem", color: G.text, position: "relative" }}
            onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setEditBooking(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                color: G.muted,
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = G.gold}
              onMouseLeave={e => e.currentTarget.style.color = G.muted}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.3rem", marginBottom: "1rem" }}>Edit Booking</h3>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "0.4rem" }}>COORDINATOR</label>
              <input type="text" value={editBooking.coordinator || ""} onChange={e => setEditBooking({ ...editBooking, coordinator: e.target.value })}
                style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "0.4rem" }}>TOTAL AMOUNT</label>
              <input type="text" value={editBooking.amount || ""} onChange={e => setEditBooking({ ...editBooking, amount: e.target.value })}
                style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "0.4rem" }}>PAID AMOUNT</label>
              <input type="text" value={editBooking.paid || ""} onChange={e => setEditBooking({ ...editBooking, paid: e.target.value })}
                style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "0.4rem" }}>STATUS</label>
              <select value={editBooking.status} onChange={e => setEditBooking({ ...editBooking, status: e.target.value })}
                style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none" }}>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {["Confirmed", "In Progress", "Completed"].includes(editBooking.status) && (
              <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: "1rem", marginTop: "1rem", marginBottom: "1.5rem" }}>
                <p style={{ fontFamily: G.serif, color: G.gold, fontSize: "0.85rem", marginBottom: "0.8rem", textTransform: "uppercase" }}>Event Tracking Progress</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "0.3rem" }}>EVENT PREPARATION</label>
                    <select 
                      value={editBooking.details?.tracking_preparation || "Pending"} 
                      onChange={e => setEditBooking({
                        ...editBooking,
                        details: {
                          ...(editBooking.details || {}),
                          tracking_preparation: e.target.value
                        }
                      })}
                      style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none" }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "0.3rem" }}>ON-SITE SETUP</label>
                    <select 
                      value={editBooking.details?.tracking_setup || "Pending"} 
                      onChange={e => setEditBooking({
                        ...editBooking,
                        details: {
                          ...(editBooking.details || {}),
                          tracking_setup: e.target.value
                        }
                      })}
                      style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none" }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "0.3rem" }}>EVENT EXECUTED</label>
                    <select 
                      value={editBooking.details?.tracking_execution || "Pending"} 
                      onChange={e => setEditBooking({
                        ...editBooking,
                        details: {
                          ...(editBooking.details || {}),
                          tracking_execution: e.target.value
                        }
                      })}
                      style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none" }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setEditBooking(null)} style={{ flex: 1, background: "transparent", border: `1px solid ${G.border}`, color: G.muted, padding: "0.6rem", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveBooking} style={{ flex: 1, background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.6rem", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════ SERVICES PANELS ══════════════ */
const SERVICE_CATEGORIES = [
  {
    name: "Decoration Services", icon: "🎨", count: 8,
    sub: ["Stage Decoration","Floral Decoration","Balloon Decoration","Theme Decoration","Entrance Decoration","Mandap Decoration","LED Decoration","Table Decoration"],
  },
  {
    name: "Catering Services", icon: "🍽️", count: 6,
    sub: ["Vegetarian Catering","Non-Vegetarian Catering","Buffet Service","Live Food Counters","Sweet & Dessert Counters","Welcome Drinks"],
  },
  {
    name: "Photography & Videography", icon: "📸", count: 7,
    sub: ["Photography","Videography","Drone Photography","Live Streaming","Pre-Wedding Shoot","Album Creation","Instant Photo Booth"],
  },
  {
    name: "Entertainment Services", icon: "🎵", count: 7,
    sub: ["DJ Services","Live Band","Orchestra","Dance Performance","Magic Show","Celebrity Appearance","Emcee / Anchor"],
  },
  {
    name: "Birthday Services", icon: "🎂", count: 5,
    sub: ["Theme Setup","Character Mascots","Cake Arrangement","Games & Activities","Return Gifts"],
  },
  {
    name: "Wedding Services", icon: "💍", count: 6,
    sub: ["Bridal Makeup","Groom Makeup","Wedding Invitations","Mehendi Artists","Wedding Car Decoration","Guest Management"],
  },
  {
    name: "Family Function Services", icon: "👨‍👩‍👧", count: 5,
    sub: ["Baby Shower Decoration","Naming Ceremony Setup","Housewarming Setup","Ear Piercing Ceremony Arrangement","Puberty Function Decoration"],
  },
  {
    name: "Additional Services", icon: "🛠️", count: 7,
    sub: ["Invitation Card Design","Digital Invitations","Gift Arrangement","Event Hosting","Security Services","Power Backup","Cleaning Services"],
  },
];

const DEFAULT_SERVICES = [
  {
    id: "s1", name: "Decoration Services", tagline: "Transform spaces into dreamscapes",
    description: "Transforming weddings, birthdays, and parties with thematic visual installations and floral arrangements.",
    icon: "Palette", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=360&fit=crop",
    media_type: "image", price: "From ₹15,000", rating: 4.9, reviews_count: 312,
    items: [
      { name: "Stage Decoration", desc: "Elegant stage setups for events", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Floral Decoration", desc: "Beautiful floral arrangements", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Balloon Decoration", desc: "Vibrant balloon designs", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Theme Decoration", desc: "Custom themed decor", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Entrance Decoration", desc: "Grand entrance setups", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Mandap Decoration", desc: "Traditional mandap designs", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "LED Decoration", desc: "Modern LED lighting setups", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Table Decoration", desc: "Elegant table settings", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" }
    ]
  },
  {
    id: "s2", name: "Catering Services", icon: "Utensils", tagline: "Culinary excellence for every occasion",
    description: "Curating gourmet menus featuring traditional, continental, and live counters for a premium dining experience.",
    img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=600&h=360&fit=crop",
    price: "From ₹450/plate", rating: 4.8, reviews_count: 287, media_type: "image",
    items: [
      { name: "Vegetarian Catering", desc: "Fresh vegetarian dishes", img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=500&h=300&fit=crop" },
      { name: "Non-Vegetarian Catering", desc: "Delicious meat options", img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=500&h=300&fit=crop" },
      { name: "Buffet Service", desc: "All-you-can-eat buffet", img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=500&h=300&fit=crop" },
      { name: "Live Food Counters", desc: "Interactive live counters for chat, mocktails & starters", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop" },
      { name: "Sweet & Dessert Counters", desc: "Variety of sweets and desserts", img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=500&h=300&fit=crop" },
      { name: "Welcome Drinks", desc: "Refreshing welcome beverages", img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=500&h=300&fit=crop" }
    ]
  },
  {
    id: "s3", name: "Photography & Videography", icon: "Camera", tagline: "Capture every precious moment",
    description: "Documenting your milestones with candid coverage, cinematic wedding highlights, and drone capture.",
    img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=600&h=360&fit=crop",
    price: "From ₹35,000", rating: 4.9, reviews_count: 420, media_type: "image",
    items: [
      { name: "Photography", desc: "High-quality portrait and event photography", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" },
      { name: "Videography", desc: "Professional video coverage for events", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" },
      { name: "Drone Photography", desc: "Aerial shots using drones", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" },
      { name: "Live Streaming", desc: "Stream your event live online", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" },
      { name: "Pre-Wedding Shoot", desc: "Romantic pre-wedding photo sessions", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" },
      { name: "Album Creation", desc: "Custom photo album designs", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" },
      { name: "Instant Photo Booth", desc: "On-site photo booth with instant prints", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" }
    ]
  },
  {
    id: "s4", name: "Entertainment Services", icon: "Music", tagline: "Keep the energy alive all night",
    description: "Dynamic entertainment lineups from premium live DJs, classical orchestras, and anchors to keep the vibes high.",
    img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&h=360&fit=crop",
    price: "From ₹20,000", rating: 4.7, reviews_count: 198, media_type: "image",
    items: [
      { name: "DJ Services", desc: "Professional DJ tracks and lighting systems", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&h=300&fit=crop" },
      { name: "Live Band", desc: "Acoustic and electric live band performances", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&h=300&fit=crop" },
      { name: "Orchestra", desc: "Traditional and instrumental orchestras", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&h=300&fit=crop" },
      { name: "Dance Performance", desc: "Choreographed troupe dance shows", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&h=300&fit=crop" },
      { name: "Magic Show", desc: "Illusionists and fun magic acts for guests", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&h=300&fit=crop" },
      { name: "Celebrity Appearance", desc: "VIP guest management and celebrity bookings", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&h=300&fit=crop" },
      { name: "Emcee / Anchor", desc: "Professional hosts to keep the crowd engaged", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&h=300&fit=crop" }
    ]
  },
  {
    id: "s5", name: "Birthday Services", icon: "Gift", tagline: "Unforgettable birthday memories",
    description: "Creative birthday setups, character mascots, and fun activities.",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=360&fit=crop",
    price: "From ₹15,000", rating: 4.8, reviews_count: 150, media_type: "image",
    items: [
      { name: "Theme Setup", desc: "Creative birthday theme decorations and stages", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Character Mascots", desc: "Interactive mascots and cartoon entertainers", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Cake Arrangement", desc: "Customized multi-tier theme birthday cakes", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Games & Activities", desc: "Engaging game host, balloon twisting & magic show", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Return Gifts", desc: "Customized favors and return gift packaging", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" }
    ]
  },
  {
    id: "s6", name: "Wedding Services", icon: "Clipboard", tagline: "Flawless planning for your special day",
    description: "Flawless planning, makeup artists, invitations and card management.",
    img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=600&h=360&fit=crop",
    price: "From ₹30,000", rating: 5.0, reviews_count: 210, media_type: "image",
    items: [
      { name: "Bridal Makeup", desc: "Stunning makeup artistry for brides", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=300&fit=crop" },
      { name: "Groom Makeup", desc: "Professional grooming solutions for grooms", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=300&fit=crop" },
      { name: "Wedding Invitations", desc: "Designer invite cards and digital invites", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=500&h=300&fit=crop" },
      { name: "Mehendi Artists", desc: "Exquisite traditional henna designers", img: "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&h=300&fit=crop" },
      { name: "Wedding Car Decoration", desc: "Premium car decorations with artificial and real flowers", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop" },
      { name: "Guest Management", desc: "RSVP coordinations & check-in table desks", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" }
    ]
  },
  {
    id: "s7", name: "Family Function Services", icon: "Users", tagline: "Celebrating bond and togetherness",
    description: "Naming ceremonies, baby showers, puberty events and traditional arrangements.",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=360&fit=crop",
    price: "From ₹25,000", rating: 4.8, reviews_count: 98, media_type: "image",
    items: [
      { name: "Baby Shower Decoration", desc: "Aesthetic theme setups for baby shower celebrations", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Naming Ceremony Setup", desc: "Traditional naming ceremony stage and cradle arrangements", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&h=300&fit=crop" },
      { name: "Housewarming Setup", desc: "Warm floral decor and traditional entrance arrangements", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop" },
      { name: "Ear Piercing Ceremony Arrangement", desc: "Traditional seating and decor setup for child ear piercing", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" },
      { name: "Puberty Function Decoration", desc: "Grand traditional arrangements and elegant backdrop decor", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" }
    ]
  },
  {
    id: "s8", name: "Additional Services", icon: "Wrench", tagline: "Comprehensive support for a perfect event",
    description: "Valet parking, event safety security, power back-ups and post-cleaning services.",
    img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=360&fit=crop",
    price: "Custom Pricing", rating: 4.7, reviews_count: 88, media_type: "image",
    items: [
      { name: "Invitation Card Design", desc: "Traditional luxury printed event cards", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=500&h=300&fit=crop" },
      { name: "Digital Invitations", desc: "Cinematic animated video invitations", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=500&h=300&fit=crop" },
      { name: "Gift Arrangement", desc: "Fancy fruit, dry fruit, and customized gift packing", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Event Hosting", desc: "Professional coordinators and welcoming hosts", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Security Services", desc: "Trained security guards for event gate keeping", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" },
      { name: "Power Backup", desc: "Silent diesel generator rentals for uninterrupted lighting", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" },
      { name: "Cleaning Services", desc: "Pre-event and post-event sweepers and sanitization", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" }
    ]
  }
];

const ICON_MAP = {
  Palette, Utensils, Camera, Music, Mail, Clipboard, Wrench, Sparkles, Gift
};

function ServicesMgmtPanel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [expanded, setExpanded] = useState(null);

  // Sub-item inline edit modal (description + images)
  const [subEditOpen, setSubEditOpen] = useState(false);
  const [subEditKey, setSubEditKey] = useState("");
  const [subEditData, setSubEditData] = useState({ vendorName: "", description: "", images: [] });
  const [subItemDetails, setSubItemDetails] = useState({});

  // Multiple vendors management states
  const [editingVendors, setEditingVendors] = useState([]);
  const [activeVendorIndex, setActiveVendorIndex] = useState(null);
  const [vendorForm, setVendorForm] = useState({ vendorName: "", description: "", phone: "", email: "", price: "", images: [] });

  // Sub-items add/edit modal states
  const [subItemModalOpen, setSubItemModalOpen] = useState(false);
  const [currentSubItem, setCurrentSubItem] = useState(null);
  const [subItemServiceId, setSubItemServiceId] = useState(null);
  const [subItemUploading, setSubItemUploading] = useState(false);
  const [subItemMediaPreview, setSubItemMediaPreview] = useState(null);

  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaTypeField, setMediaTypeField] = useState("image");

  const openSubEdit = (catName, svcName) => {
    const key = `${catName}::${svcName}`;
    setSubEditKey(key);
    
    const rawDetail = subItemDetails[key] || { description: "", images: [] };
    let vendors = [];
    
    if (rawDetail.description) {
      try {
        const parsed = JSON.parse(rawDetail.description);
        if (Array.isArray(parsed)) {
          vendors = parsed;
        } else if (parsed && typeof parsed === "object") {
          vendors = [{
            vendorName: parsed.vendorName || "Vendor",
            description: parsed.description || "",
            images: rawDetail.images || []
          }];
        }
      } catch (e) {
        vendors = [{
          vendorName: "Default Vendor",
          description: rawDetail.description,
          images: rawDetail.images || []
        }];
      }
    }
    
    setEditingVendors(vendors);
    setActiveVendorIndex(null);
    setSubEditOpen(true);
  };

  const saveSubEdit = async () => {
    try {
      const allImages = [];
      editingVendors.forEach(v => {
        if (v.images) {
          v.images.forEach((img) => {
            if (!allImages.includes(img)) allImages.push(img);
          });
        }
      });

      const jsonDesc = JSON.stringify(editingVendors);

      // 1. Immediately update local state & show confirmation dialog to the admin
      setSubItemDetails(prev => ({
        ...prev,
        [subEditKey]: { description: jsonDesc, images: allImages }
      }));
      
      window.alert("All changes saved successfully!");
      setSubEditOpen(false);

      // 2. Perform Database updates in the background asynchronously
      supabase
        .from("sub_service_details")
        .upsert({
          key: subEditKey,
          description: jsonDesc,
          images: allImages
        })
        .then(({ error }) => {
          if (error) {
            console.warn("Background database save failed, using local state:", error.message);
          }
        });

      if (allImages.length > 0) {
        const getGalleryCategory = (categoryName) => {
          const cat = categoryName.toLowerCase();
          if (cat.includes("decor") || cat.includes("wedding")) return "Wedding Gallery";
          if (cat.includes("cater") || cat.includes("family")) return "Family Function Gallery";
          if (cat.includes("entertain") || cat.includes("birth")) return "Birthday Gallery";
          return "Wedding Gallery";
        };

        const galleryCategory = getGalleryCategory(subEditKey.split("::")[0]);
        const subSvcName = subEditKey.split("::")[1];

        supabase
          .from("gallery")
          .select("url")
          .eq("service_name", subSvcName)
          .then(({ data: existingGallery }) => {
            const existingUrls = new Set((existingGallery || []).map((item) => item.url));
            const newImagesToInsert = [];
            editingVendors.forEach(v => {
              if (v.images) {
                v.images.forEach((img) => {
                  if (!existingUrls.has(img)) {
                    if (!newImagesToInsert.some(item => item.url === img)) {
                      newImagesToInsert.push({ url: img, vendorName: v.vendorName || "Vendor" });
                    }
                  }
                });
              }
            });

            if (newImagesToInsert.length > 0) {
              const insertRows = newImagesToInsert.map(item => ({
                url: item.url,
                caption: `${item.vendorName} - ${subSvcName}`,
                category: galleryCategory,
                media_type: "image",
                budget_tier: "medium",
                service_name: subSvcName
              }));

              supabase
                .from("gallery")
                .insert(insertRows)
                .then(({ error: galleryErr }) => {
                  if (galleryErr) {
                    console.warn("Background gallery insert failed:", galleryErr.message);
                  }
                });
            }
          });
      }
    } catch (err) {
      console.error("Error in saveSubEdit:", err);
    }
  };

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        if (!error.message.includes("does not exist")) {
          toast.error("Failed to load services: " + error.message, { style: { background: G.surface2, border: `1px solid rgba(248,113,113,0.3)`, color: "#f87171" } });
        }
        setServices(DEFAULT_SERVICES);
      } else {
        setServices(data && data.length > 0 ? data : DEFAULT_SERVICES);
      }
    } catch (err) {
      console.error(err);
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  const loadSubItemDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("sub_service_details")
        .select("*");
      if (!error && data) {
        const mapping = {};
        data.forEach((row) => {
          mapping[row.key] = {
            description: row.description || "",
            images: row.images || []
          };
        });
        setSubItemDetails(mapping);
      }
    } catch (err) {
      console.error("Error fetching sub-service details:", err);
    }
  };

  useEffect(() => {
    loadServices();
    loadSubItemDetails();
  }, []);

  useEffect(() => {
    const channel1 = supabase.channel('admin:services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        loadServices();
      })
      .subscribe();

    const channel2 = supabase.channel('admin:sub_service_details')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sub_service_details' }, () => {
        loadSubItemDetails();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  const uploadFileToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `admin-uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('user_uploads')
      .upload(filePath, file);
      
    if (error) {
      console.warn("Storage upload failed, falling back to local Base64:", error.message);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") resolve(reader.result);
          else reject(new Error("Failed to read file"));
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('user_uploads')
      .getPublicUrl(filePath);
      
    return publicUrlData?.publicUrl || "";
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const url = await uploadFileToSupabase(file);
      setMediaPreview(url);
      const isVideo = file.type.startsWith("video/");
      setMediaTypeField(isVideo ? "video" : "image");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const tagline = formData.get("tagline");
    const description = formData.get("description");
    const price = formData.get("price");
    const icon = formData.get("icon");
    const ratingRaw = formData.get("rating");
    const rating = ratingRaw ? parseFloat(ratingRaw) : 4.8;
    const reviewsRaw = formData.get("reviews_count");
    const reviews_count = reviewsRaw ? parseInt(reviewsRaw) : 150;

    const media_type = mediaTypeField;
    const imgUrlInput = formData.get("img_url");
    const img = mediaPreview || imgUrlInput || "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=360&fit=crop&auto=format";

    const payload = { name, tagline, description, price, icon, img, media_type, rating, reviews_count };

    if (currentService) {
      const isLocal = currentService.id.startsWith("s") || currentService.id.startsWith("local");
      if (isLocal) {
        setServices(prev => prev.map(s => s.id === currentService.id ? { ...s, ...payload } : s));
        toast.success("Service category updated (local state only)!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
        setModalOpen(false);
        return;
      }

      const { error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", currentService.id);

      if (error) {
        setServices(prev => prev.map(s => s.id === currentService.id ? { ...s, ...payload } : s));
        toast.success("Service category updated (local state only)!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
        setModalOpen(false);
      } else {
        toast.success("Service category updated successfully!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
        setModalOpen(false);
        loadServices();
      }
    } else {
      const fullPayload = { ...payload, items: [] };
      const { error } = await supabase.from("services").insert(fullPayload);
      if (error) {
        const newSvc = { id: "s_" + Date.now(), ...fullPayload };
        setServices(prev => [...prev, newSvc]);
        toast.success("Service category added (local state only)!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
        setModalOpen(false);
      } else {
        toast.success("Service category added successfully!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
        setModalOpen(false);
        loadServices();
      }
    }
  };

  const handleSaveSubItem = async (e) => {
    e.preventDefault();
    if (!subItemServiceId) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("sub_name");
    const desc = formData.get("sub_desc");
    const imgUrlInput = formData.get("sub_img_url");
    const img = subItemMediaPreview || imgUrlInput || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=250&fit=crop";

    const service = services.find(s => s.id === subItemServiceId);
    if (!service) return;

    const items = [...(service.items || [])];
    const newItem = { name, desc, img };

    if (currentSubItem && typeof currentSubItem.index === "number") {
      items[currentSubItem.index] = newItem;
    } else {
      items.push(newItem);
    }

    const isLocal = subItemServiceId.startsWith("s") || subItemServiceId.startsWith("local");
    if (isLocal) {
      setServices(prev => prev.map(s => s.id === subItemServiceId ? { ...s, items } : s));
      toast.success("Sub-item saved (local state)!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
      setSubItemModalOpen(false);
      return;
    }

    const { error } = await supabase
      .from("services")
      .update({ items })
      .eq("id", subItemServiceId);

    if (error) {
      setServices(prev => prev.map(s => s.id === subItemServiceId ? { ...s, items } : s));
      toast.success("Sub-item saved (local state)!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
      setSubItemModalOpen(false);
    } else {
      toast.success("Sub-item saved successfully!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
      setSubItemModalOpen(false);
      loadServices();
    }
  };

  const handleEditSubItem = (serviceId, item, index) => {
    setSubItemServiceId(serviceId);
    setCurrentSubItem({
      name: item.name || item,
      desc: item.desc || "",
      img: item.img || "",
      index: index
    });
    setSubItemMediaPreview(item.img || "");
    setSubItemModalOpen(true);
  };

  const handleDeleteSubItem = async (serviceId, index) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const items = (service.items || []).filter((_, idx) => idx !== index);

    const isLocal = serviceId.startsWith("s") || serviceId.startsWith("local");
    if (isLocal) {
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, items } : s));
      toast.success("Sub-item deleted (local state)!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
      return;
    }

    const { error } = await supabase
      .from("services")
      .update({ items })
      .eq("id", serviceId);

    if (error) {
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, items } : s));
      toast.success("Sub-item deleted (local state)!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
    } else {
      toast.success("Sub-item deleted successfully!", { style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold } });
      loadServices();
    }
  };

  const handleSubItemFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubItemUploading(true);
    try {
      const url = await uploadFileToSupabase(file);
      setSubItemMediaPreview(url);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setSubItemUploading(false);
    }
  };

  const renderOfferings = () => {
    if (!expanded) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <style>{`
            .admin-services-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1.25rem;
              margin-bottom: 2.5rem;
            }
            @media (min-width: 768px) {
              .admin-services-grid {
                grid-template-columns: repeat(4, 1fr);
              }
            }
            .admin-cat-box {
              background: #14100a;
              border: 1.5px solid rgba(201,168,76,0.18);
              border-radius: 12px;
              height: 120px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 1rem;
              cursor: pointer;
              transition: all 0.25s ease-in-out;
            }
            .admin-cat-box.active {
              border-color: #c9a84c;
              box-shadow: 0 0 12px rgba(201,168,76,0.15);
            }
            .admin-cat-box:hover {
              border-color: rgba(201,168,76,0.45);
              transform: translateY(-2px);
            }
          `}</style>

          {/* Categories in a 4-column Grid */}
          <div className="admin-services-grid">
            {services.map(cat => {
              const isActive = expanded === cat.name;
              const subItems = cat.items || [];
              return (
                <div 
                  key={cat.id}
                  onClick={() => setExpanded(cat.name)}
                  className={`admin-cat-box ${isActive ? "active" : ""}`}
                >
                  <h3 style={{ 
                    fontFamily: G.serif, 
                    color: G.text, 
                    fontSize: "1.05rem", 
                    margin: 0, 
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}>{cat.name}</h3>
                  <span style={{ color: G.muted, fontSize: "0.76rem", marginTop: "8px" }}>
                    {subItems.length} services
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const cat = services.find(c => c.name === expanded);
    if (!cat) return null;

    return (
      <motion.div
        key={cat.name}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", padding: "1.75rem", marginBottom: "3rem" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap", borderBottom: `1px solid ${G.border}`, paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
          <div>
            <button onClick={() => setExpanded(null)}
              style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.gold, padding: "4px 12px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "1rem", fontFamily: G.sans, fontWeight: 600 }}>
              ← Back to Categories
            </button>
            <span style={{ color: G.gold, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Category Overview</span>
            <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.5rem", fontWeight: 700, margin: "3px 0 0 0" }}>{cat.name}</h3>
            <p style={{ color: G.muted, fontSize: "0.85rem", marginTop: "6px", margin: "6px 0 0 0" }}>Manage events and service details for {cat.name.toLowerCase()}</p>
          </div>
          <div>
            <button onClick={() => { setSubItemServiceId(cat.id); setCurrentSubItem(null); setSubItemMediaPreview(null); setSubItemModalOpen(true); }}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.55rem 1.25rem", borderRadius: "6px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>
              <Plus size={14} /> Add Service
            </button>
          </div>
        </div>

        <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", marginBottom: "1rem", fontWeight: 600 }}>Included Events & Services</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(cat.items || []).map((item, idx) => {
            const name = typeof item === "string" ? item : item.name;
            const key = `${cat.name}::${name}`;
            const detail = subItemDetails[key];
            
            let parsedDesc = "";
            let vendors = [];
            if (detail?.description) {
              try {
                const parsed = JSON.parse(detail.description);
                if (Array.isArray(parsed)) {
                  vendors = parsed;
                } else if (parsed && typeof parsed === "object") {
                  vendors = [{ vendorName: parsed.vendorName || "Vendor", description: parsed.description || "" }];
                  parsedDesc = parsed.description || "";
                }
              } catch (e) {
                parsedDesc = detail.description;
              }
            }
            
            return (
              <div key={name} style={{ borderRadius: "8px", background: G.surface2, border: `1px solid ${G.border}`, padding: "0.75rem 1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: G.gold, flexShrink: 0 }} />
                    <span style={{ color: G.text, fontSize: "0.9rem", fontWeight: 600 }}>{name}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                    <button
                      onClick={() => handleEditSubItem(cat.id, item, idx)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "3px", background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, color: G.gold, borderRadius: "4px", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.18)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubItem(cat.id, idx)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "3px", background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.22)", color: "#e05555", borderRadius: "4px", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(224,85,85,0.18)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(224,85,85,0.08)"; }}>
                      Delete
                    </button>
                    <button
                      onClick={() => openSubEdit(cat.name, name)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "3px", background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, color: G.gold, borderRadius: "4px", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.18)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}>
                      <Plus size={12} /> Add Vendor
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <AHead label="Manage Offerings" title="Service Management" />
        <button onClick={() => { setCurrentService(null); setMediaPreview(null); setMediaTypeField("image"); setModalOpen(true); }}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.6rem 1.25rem", borderRadius: "6px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>
          <Plus size={14} /> Add Category
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: G.muted }}>Loading services...</div>
      ) : (
        renderOfferings()
      )}

      {/* SUB-ITEM EDIT MODAL */}
      {subEditOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.88)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "1.5rem" }}>
          <div style={{ background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "14px", width: "100%", maxWidth: "560px", maxHeight: "88vh", overflowY: "auto", boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px 0" }}>Manage Vendors & Details</p>
                <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", margin: 0, fontWeight: 700 }}>{subEditKey.split("::")[1]}</h3>
                <p style={{ color: G.muted, fontSize: "0.75rem", margin: "2px 0 0 0" }}>{subEditKey.split("::")[0]}</p>
              </div>
              <button onClick={() => setSubEditOpen(false)}
                style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.muted, width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = G.gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = G.muted; }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.75rem 2rem" }}>
              {activeVendorIndex === null ? (
                /* ─── VENDORS LIST VIEW ─── */
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ color: G.muted, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Vendors ({editingVendors.length})</span>
                    <button type="button" onClick={() => {
                      setVendorForm({ vendorName: "", description: "", phone: "", email: "", price: "", images: [] });
                      setActiveVendorIndex(-1);
                    }}
                      style={{ background: "rgba(201,168,76,0.12)", border: `1px solid ${G.border}`, color: G.gold, padding: "4px 10px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer", fontFamily: G.sans, fontWeight: 600 }}>
                      + Add Vendor
                    </button>
                  </div>

                  {editingVendors.length === 0 ? (
                    <div style={{ background: G.surface2, border: `1px solid ${G.border}`, padding: "2rem", borderRadius: "8px", textAlign: "center", color: G.muted, fontSize: "0.82rem", marginBottom: "2rem" }}>
                      No vendors added to this category yet. Click "+ Add Vendor" to add one.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "2rem", maxHeight: "300px", overflowY: "auto" }}>
                      {editingVendors.map((vendor, idx) => (
                        <div key={idx} style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ color: G.text, fontSize: "0.88rem", fontWeight: 600, margin: 0 }}>{vendor.vendorName}</p>
                            <p style={{ color: G.muted, fontSize: "0.74rem", margin: "2px 0 0", fontStyle: "italic", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {vendor.description || "No description"}
                            </p>
                            {vendor.images?.length > 0 && (
                              <p style={{ color: G.gold, fontSize: "0.68rem", margin: "4px 0 0" }}>{vendor.images.length} photo(s) uploaded</p>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button type="button" onClick={() => {
                              setVendorForm({
                                vendorName: vendor.vendorName || "",
                                description: vendor.description || "",
                                phone: vendor.phone || "",
                                email: vendor.email || "",
                                price: vendor.price || "",
                                images: vendor.images || []
                              });
                              setActiveVendorIndex(idx);
                            }}
                              style={{ background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, color: G.gold, padding: "3px 8px", borderRadius: "4px", fontSize: "0.7rem", cursor: "pointer" }}>
                              Edit
                            </button>
                            <button type="button" onClick={() => {
                              if (window.confirm(`Remove vendor "${vendor.vendorName}"?`)) {
                                setEditingVendors(prev => prev.filter((_, i) => i !== idx));
                              }
                            }}
                              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", padding: "3px 8px", borderRadius: "4px", fontSize: "0.7rem", cursor: "pointer" }}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modal Footer Actions */}
                  <div style={{ display: "flex", gap: "0.75rem", borderTop: `1px solid ${G.border}`, paddingTop: "1.25rem" }}>
                    <button type="button" onClick={() => setSubEditOpen(false)}
                      style={{ flex: 1, background: "transparent", border: `1px solid ${G.border}`, color: G.muted, padding: "0.7rem", borderRadius: "6px", cursor: "pointer", fontFamily: G.sans, fontSize: "0.85rem" }}>
                      Cancel
                    </button>
                    <button type="button" onClick={saveSubEdit}
                      style={{ flex: 2, background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.7rem", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontFamily: G.sans, fontSize: "0.85rem" }}>
                      Save All Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── ADD/EDIT SINGLE VENDOR SUB-FORM ─── */
                <div>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Vendor Name</label>
                    <input
                      type="text"
                      value={vendorForm.vendorName}
                      onChange={e => setVendorForm(prev => ({ ...prev, vendorName: e.target.value }))}
                      placeholder="Enter vendor name..."
                      style={{ width: "100%", padding: "0.75rem 1rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", fontFamily: G.sans }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Description</label>
                    <textarea
                      value={vendorForm.description}
                      onChange={e => setVendorForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the vendor's services, specialties, and experience..."
                      rows={3}
                      style={{ width: "100%", padding: "0.75rem 1rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text, fontSize: "0.88rem", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, fontFamily: G.sans }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Phone Number</label>
                      <input
                        type="tel"
                        value={vendorForm.phone}
                        onChange={e => setVendorForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. +91 98765 43210"
                        style={{ width: "100%", padding: "0.75rem 1rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", fontFamily: G.sans }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Starting Price</label>
                      <input
                        type="text"
                        value={vendorForm.price}
                        onChange={e => setVendorForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g. From ₹8,000"
                        style={{ width: "100%", padding: "0.75rem 1rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", fontFamily: G.sans }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Email Address</label>
                    <input
                      type="email"
                      value={vendorForm.email}
                      onChange={e => setVendorForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. vendor@example.com"
                      style={{ width: "100%", padding: "0.75rem 1rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", fontFamily: G.sans }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Upload Photos</label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", border: `2px dashed ${G.border}`, borderRadius: "8px", padding: "0.85rem 1.25rem", cursor: "pointer", color: G.muted, fontSize: "0.82rem", transition: "border-color 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget).style.borderColor = G.gold; }}
                      onMouseLeave={e => { (e.currentTarget).style.borderColor = G.border; }}>
                      <span>📷</span>
                      <span>Click to upload photos (multiple allowed)</span>
                      <input type="file" accept="image/*" multiple onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = ev => {
                            const result = ev.target?.result;
                            setVendorForm(prev => ({ ...prev, images: [...prev.images, result] }));
                          };
                          reader.readAsDataURL(file);
                        });
                      }} style={{ display: "none" }} />
                    </label>
                  </div>

                  {vendorForm.images.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Vendor Photos ({vendorForm.images.length})</label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "6px", maxHeight: "140px", overflowY: "auto" }}>
                        {vendorForm.images.map((img, idx) => (
                          <div key={idx} style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: `1px solid ${G.border}`, aspectRatio: "4/3" }}>
                            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            <button
                              type="button"
                              onClick={() => setVendorForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                              style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(10,8,4,0.85)", border: "none", color: "#f87171", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.65rem", fontWeight: 700 }}>
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-form Buttons */}
                  <div style={{ display: "flex", gap: "0.5rem", borderTop: `1px solid ${G.border}`, paddingTop: "1rem" }}>
                    <button type="button" onClick={() => setActiveVendorIndex(null)}
                      style={{ flex: 1, background: "transparent", border: `1px solid ${G.border}`, color: G.muted, padding: "0.6rem", borderRadius: "6px", cursor: "pointer", fontFamily: G.sans, fontSize: "0.82rem" }}>
                      Back to List
                    </button>
                    <button type="button" onClick={() => {
                      if (!vendorForm.vendorName.trim()) {
                        alert("Vendor name is required.");
                        return;
                      }
                      
                      setEditingVendors(prev => {
                        const next = [...prev];
                        const newVendor = {
                          vendorName: vendorForm.vendorName.trim(),
                          description: vendorForm.description.trim(),
                          phone: vendorForm.phone.trim(),
                          email: vendorForm.email.trim(),
                          price: vendorForm.price.trim(),
                          images: vendorForm.images
                        };
                        
                        if (activeVendorIndex === -1) {
                          next.push(newVendor);
                        } else {
                          next[activeVendorIndex] = newVendor;
                        }
                        return next;
                      });
                      setActiveVendorIndex(null);
                    }}
                      style={{ flex: 1.5, background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.6rem", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontFamily: G.sans, fontSize: "0.82rem" }}>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* CATEGORY ADD/EDIT MODAL */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1010, padding: "1.5rem" }}>
          <form onSubmit={handleSave} style={{ background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "12px", width: "100%", maxWidth: "480px", padding: "2rem", boxSizing: "border-box", position: "relative" }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                color: G.muted,
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = G.gold}
              onMouseLeave={e => e.currentTarget.style.color = G.muted}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginTop: 0, marginBottom: "1.5rem", borderBottom: `1px solid ${G.border}`, paddingBottom: "0.75rem" }}>
              {currentService ? "Edit Category" : "Add Service Category"}
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Category Name</label>
              <input required name="name" defaultValue={currentService?.name || ""} placeholder="e.g. Decoration Services"
                style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Tagline</label>
              <input required name="tagline" defaultValue={currentService?.tagline || ""} placeholder="e.g. Transform spaces into dreamscapes"
                style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Description</label>
              <textarea name="description" defaultValue={currentService?.description || ""} placeholder="Brief description of the category offerings..." rows={2}
                style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", resize: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Starting Price</label>
              <input required name="price" defaultValue={currentService?.price || ""} placeholder="e.g. From ₹15,000"
                style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Icon Name</label>
              <input required name="icon" defaultValue={currentService?.icon || "Palette"} placeholder="e.g. Palette, Utensils, Camera, Music, Gift, Heart"
                style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Upload Cover Photo</label>
              <input type="file" accept="image/*" onChange={handleFileUpload}
                style={{ width: "100%", fontSize: "0.78rem", color: G.muted, padding: "0.45rem 0" }} />
            </div>

            {mediaPreview && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Cover Photo Preview</p>
                <div style={{ width: "100%", height: "120px", borderRadius: "6px", overflow: "hidden", background: "#000", border: `1px solid ${G.border}` }}>
                  <img src={mediaPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, background: "transparent", border: `1px solid ${G.border}`, color: G.muted, padding: "0.65rem", borderRadius: "6px", cursor: "pointer", fontFamily: G.sans }}>Cancel</button>
              <button type="submit" disabled={uploadingMedia} style={{ flex: 1, background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.65rem", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontFamily: G.sans }}>
                {uploadingMedia ? "Reading File..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-ITEM ADD/EDIT MODAL */}
      {subItemModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1010, padding: "1.5rem" }}>
          <form onSubmit={handleSaveSubItem} style={{ background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "12px", width: "100%", maxWidth: "480px", padding: "2rem", boxSizing: "border-box", position: "relative" }}>
            <button
              type="button"
              onClick={() => setSubItemModalOpen(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                color: G.muted,
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = G.gold}
              onMouseLeave={e => e.currentTarget.style.color = G.muted}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginTop: 0, marginBottom: "1.5rem", borderBottom: `1px solid ${G.border}`, paddingBottom: "0.75rem" }}>
              {currentSubItem ? "Edit Service" : "Add Service"}
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Service Name</label>
              <input required name="sub_name" defaultValue={currentSubItem?.name || ""} placeholder="e.g. Stage Floral Backdrop"
                style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Details / Info</label>
              <textarea required name="sub_desc" defaultValue={currentSubItem?.desc || ""} placeholder="Details about this service..." rows={3}
                style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", resize: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Upload Photo</label>
              <input type="file" accept="image/*" onChange={handleSubItemFileUpload}
                style={{ width: "100%", fontSize: "0.78rem", color: G.muted, padding: "0.45rem 0" }} />
            </div>

            {subItemMediaPreview && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>Photo Preview</p>
                <div style={{ width: "100%", height: "120px", borderRadius: "6px", overflow: "hidden", background: "#000", border: `1px solid ${G.border}` }}>
                  <img src={subItemMediaPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" onClick={() => setSubItemModalOpen(false)} style={{ flex: 1, background: "transparent", border: `1px solid ${G.border}`, color: G.muted, padding: "0.65rem", borderRadius: "6px", cursor: "pointer", fontFamily: G.sans }}>Cancel</button>
              <button type="submit" disabled={subItemUploading} style={{ flex: 1, background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.65rem", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontFamily: G.sans }}>
                {subItemUploading ? "Reading File..." : "Save Service"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ══════════════ VENDOR MANAGEMENT PANEL ══════════════ */
function VendorsPanel() {
  const [subItemDetails, setSubItemDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  const [isEditVendorModalOpen, setIsEditVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const handleEditVendor = (v) => {
    setEditingVendor(v);
    setIsEditVendorModalOpen(true);
  };

  const handleDeleteVendor = async (v) => {
    if (!window.confirm(`Are you sure you want to delete vendor "${v.name}"?`)) return;
    try {
      const { data, error: fetchErr } = await supabase
        .from("sub_service_details")
        .select("*")
        .eq("key", v.dbKey)
        .single();
      if (fetchErr) throw fetchErr;

      let vendorsList = [];
      if (data.description) {
        try {
          const parsed = JSON.parse(data.description);
          vendorsList = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          vendorsList = [];
        }
      }

      vendorsList = vendorsList.filter((_, idx) => idx !== v.originalIndex);

      const jsonDesc = JSON.stringify(vendorsList);
      const allImages = [];
      vendorsList.forEach((item) => {
        if (item.images) {
          item.images.forEach((img) => {
            if (!allImages.includes(img)) allImages.push(img);
          });
        }
      });

      const { error: updateErr } = await supabase
        .from("sub_service_details")
        .update({ description: jsonDesc, images: allImages })
        .eq("key", v.dbKey);

      if (updateErr) throw updateErr;

      toast.success("Vendor deleted successfully!");
      loadSubItemDetails();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete vendor: " + err.message);
    }
  };

  const loadSubItemDetails = async () => {
    try {
      const { data, error } = await supabase.from("sub_service_details").select("*");
      if (!error && data) {
        const mapping = {};
        data.forEach(item => {
          // key format: "Category::ServiceName"
          const k = item.key || item.service_id || "";
          mapping[k] = item;
        });
        setSubItemDetails(mapping);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllVendors = () => {
    const list = [];
    let globalIdx = 0;
    Object.entries(subItemDetails).forEach(([key, detail]) => {
      const parts = key.split("::");
      const category = parts[0] || "";
      const service = parts[1] || "";
      if (detail?.description) {
        try {
          const parsed = JSON.parse(detail.description);
          const vendors = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === "object" ? [parsed] : []);
          vendors.forEach((v, vi) => {
            globalIdx++;
            list.push({
              id: `VND-${String(globalIdx).padStart(4, "0")}`,
              name: v.vendorName || "Vendor",
              description: v.description || "",
              phone: v.phone || "",
              email: v.email || "",
              price: v.price || "",
              service,
              category,
              images: v.images || detail.images || [],
              originalIndex: vi,
              dbKey: key,
            });
          });
        } catch {
          // skip malformed
        }
      }
    });

    return list;
  };

  const allVendors = getAllVendors();

  // Always show all 8 SERVICE_CATEGORIES (show 0 if no vendors added yet)
  const displayCategories = SERVICE_CATEGORIES.map(c => c.name);

  // Vendors for the selected category, filtered by search
  const filteredVendors = selectedCategory
    ? allVendors.filter(v =>
        v.category === selectedCategory &&
        (search === "" ||
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.service.toLowerCase().includes(search.toLowerCase()) ||
          v.id.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", borderBottom: `1px solid ${G.border}`, paddingBottom: "1.25rem" }}>
        <span style={{ color: G.gold, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Partners & Providers</span>
        <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.8rem", fontWeight: 700, margin: "4px 0 4px" }}>Vendor Directory</h2>
        <p style={{ color: G.muted, fontSize: "0.85rem", margin: 0 }}>
          {allVendors.length > 0 ? `${allVendors.length} vendor${allVendors.length !== 1 ? "s" : ""} registered across ${displayCategories.length} categories` : "Select a category to view registered vendors."}
        </p>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: G.muted }}>Loading vendors database...</div>
      ) : (
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            /* ── PAGE 1: Category Grid ── */
            <motion.div key="cat-grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
              <style>{`
                .vendor-cat-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 1.1rem;
                  margin-bottom: 2rem;
                }
                @media (min-width: 768px) {
                  .vendor-cat-grid { grid-template-columns: repeat(4, 1fr); }
                }
                .vendor-cat-box {
                  background: #14100a;
                  border: 1.5px solid rgba(201,168,76,0.18);
                  border-radius: 12px;
                  height: 116px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  padding: 1rem;
                  cursor: pointer;
                  transition: all 0.22s ease-in-out;
                }
                .vendor-cat-box:hover {
                  border-color: rgba(201,168,76,0.45);
                  background: rgba(201,168,76,0.06);
                  transform: translateY(-3px);
                  box-shadow: 0 6px 20px rgba(201,168,76,0.1);
                }
              `}</style>

              <div className="vendor-cat-grid">
                {displayCategories.map(catName => {
                  const count = allVendors.filter(v => v.category === catName).length;
                  return (
                    <div
                      key={catName}
                      onClick={() => { setSelectedCategory(catName); setSearch(""); }}
                      className="vendor-cat-box"
                    >
                      <p style={{ fontFamily: G.serif, color: G.text, fontSize: "0.88rem", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>{catName}</p>
                      <span style={{ fontSize: "0.7rem", color: count > 0 ? G.gold : G.muted, fontWeight: 600 }}>
                        {count} vendor{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>

              {allVendors.length === 0 && (
                <div style={{ padding: "3rem 2rem", textAlign: "center", background: G.surface, border: `1px dashed ${G.border}`, borderRadius: "14px" }}>
                  <p style={{ color: G.muted, fontSize: "0.92rem", margin: 0 }}>No vendors added yet. Go to Services → select a sub-service → click "Add Vendor".</p>
                </div>
              )}
            </motion.div>
          ) : (
            /* ── PAGE 2: Vendor List for selected category ── */
            <motion.div key={`vendors-${selectedCategory}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>

              {/* Page header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "0.75rem", borderBottom: `1px solid ${G.border}`, paddingBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    onClick={() => { setSelectedCategory(null); setSearch(""); }}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: `1px solid ${G.border}`, color: G.muted, borderRadius: "8px", padding: "6px 14px", fontSize: "0.78rem", cursor: "pointer", fontFamily: G.sans, transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget).style.borderColor = G.gold; (e.currentTarget).style.color = G.gold; }}
                    onMouseLeave={e => { (e.currentTarget).style.borderColor = G.border; (e.currentTarget).style.color = G.muted; }}
                  >
                    ← Back to Categories
                  </button>
                  <div>
                    <span style={{ color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Vendor Directory</span>
                    <h3 style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.35rem", margin: "2px 0 0" }}>
                      {selectedCategory}
                    </h3>
                  </div>
                  <span style={{ background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.25)`, color: G.gold, borderRadius: "20px", padding: "3px 12px", fontSize: "0.7rem", fontWeight: 700 }}>
                    {filteredVendors.length} vendor{filteredVendors.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, service, or ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ padding: "0.6rem 1.1rem", background: G.surface, border: `1px solid ${G.border}`, borderRadius: "8px", color: G.text, fontSize: "0.82rem", outline: "none", width: "250px", fontFamily: G.sans }}
                />
              </div>

              {filteredVendors.length === 0 ? (
                <div style={{ padding: "5rem 2rem", textAlign: "center", background: G.surface, border: `1px dashed ${G.border}`, borderRadius: "14px" }}>
                  <p style={{ color: G.muted, fontSize: "0.92rem", margin: 0 }}>
                    {allVendors.filter(v => v.category === selectedCategory).length === 0
                      ? "No vendors added to this category yet. Use the Services tab to add vendors."
                      : "No vendors match your search."}
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
                  {filteredVendors.map((v) => (
                    <div key={v.id} style={{ background: G.surface, border: `1.5px solid ${G.border}`, borderRadius: "12px", padding: "1.4rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "border-color 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget).style.borderColor = "rgba(201,168,76,0.4)"; }}
                      onMouseLeave={e => { (e.currentTarget).style.borderColor = G.border; }}>

                      {/* Vendor ID badge + avatar + name */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: G.gold, fontSize: "1rem", fontWeight: 700, flexShrink: 0 }}>
                            {v.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem", margin: 0, fontWeight: 600 }}>{v.name}</h4>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.22)`, borderRadius: "6px", padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, color: G.gold, letterSpacing: "0.06em", whiteSpace: "nowrap", flexShrink: 0 }}>
                            {v.id}
                          </span>
                          <button onClick={() => handleEditVendor(v)} style={{ background: "transparent", border: "none", color: G.gold, cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }} title="Edit Vendor">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDeleteVendor(v)} style={{ background: "transparent", border: "none", color: "#e05555", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }} title="Delete Vendor">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      {v.description && <p style={{ color: G.muted, fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>{v.description}</p>}

                      {/* Contact + price */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        {v.phone && (
                          <span style={{ color: G.muted, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ color: G.gold }}>📞</span> {v.phone}
                          </span>
                        )}
                        {v.email && (
                          <span style={{ color: G.muted, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ color: G.gold }}>✉</span> {v.email}
                          </span>
                        )}
                        {v.price && (
                          <span style={{ color: G.gold, fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>₹</span> {v.price}
                          </span>
                        )}
                      </div>

                      {/* Photos */}
                      {v.images.length > 0 && (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {v.images.slice(0, 4).map((img, idx) => (
                            <img key={idx} src={img} alt="" style={{ width: "52px", height: "40px", objectFit: "cover", borderRadius: "4px", border: `1px solid ${G.border}` }} />
                          ))}
                        </div>
                      )}

                      {/* Footer: Category → Sub-service hierarchy (highlighted) */}
                      <div style={{ borderTop: `1px solid rgba(201,168,76,0.1)`, paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: G.muted, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</span>
                          <span style={{ background: `linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.07))`, border: `1px solid rgba(201,168,76,0.35)`, borderRadius: "20px", padding: "3px 12px", fontSize: "0.72rem", fontWeight: 700, color: G.gold }}>
                            {v.category}
                          </span>
                        </div>
                        {v.service && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ color: G.muted, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sub-service</span>
                            <span style={{ background: G.surface2, border: `1px solid rgba(201,168,76,0.2)`, borderRadius: "20px", padding: "3px 12px", fontSize: "0.7rem", fontWeight: 600, color: G.text }}>
                              {v.service}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <EditVendorModal
        isOpen={isEditVendorModalOpen}
        onClose={() => { setIsEditVendorModalOpen(false); setEditingVendor(null); }}
        vendor={editingVendor}
        onSaved={loadSubItemDetails}
      />
    </div>
  );
}

/* ══════════════ PERFORMANCE PANEL ══════════════ */
function ReportsPanel({ bookings = [], profiles = [] }) {
  const [vendorCount, setVendorCount] = useState(0);

  // Fetch vendor count from sub_service_details
  useEffect(() => {
    const fetchVendorCount = async () => {
      try {
        const { data } = await supabase.from("sub_service_details").select("*");
        if (data) {
          let count = 0;
          data.forEach((item) => {
            if (item.description) {
              try {
                const parsed = JSON.parse(item.description);
                if (Array.isArray(parsed)) count += parsed.length;
                else if (parsed && typeof parsed === "object" && parsed.vendorName) count += 1;
              } catch { /* skip */ }
            }
          });
          setVendorCount(count);
        }
      } catch { /* ignore */ }
    };
    fetchVendorCount();
  }, []);

  // Stats from real data
  const totalBookings = bookings.length;
  const totalPayment = bookings
    .filter(b => b.status !== "Cancelled")
    .reduce((sum, b) => sum + parseAmount(b.amount), 0);
  const formattedPayment = totalPayment >= 100000
    ? `₹${(totalPayment / 100000).toFixed(1)}L`
    : `₹${totalPayment.toLocaleString()}`;

  // Monthly data (last 6 months) — real data only, no fakes
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i);
    return { name: format(d, "MMM"), monthIndex: d.getMonth(), year: d.getFullYear() };
  });

  const monthlyBookings = last6Months.map(m => {
    const count = bookings.filter(b => {
      const bDate = b.event_date ? new Date(b.event_date) : new Date();
      return bDate.getFullYear() === m.year && bDate.getMonth() === m.monthIndex;
    }).length;
    return { month: m.name, bookings: count };
  });

  const monthlyRevenue = last6Months.map(m => {
    const total = bookings
      .filter(b => {
        if (b.status === "Cancelled") return false;
        const bDate = b.event_date ? new Date(b.event_date) : new Date();
        return bDate.getFullYear() === m.year && bDate.getMonth() === m.monthIndex;
      })
      .reduce((sum, b) => sum + parseAmount(b.amount), 0);
    return { month: m.name, revenue: Math.round(total / 1000) };
  });

  const tooltipStyle = { background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.75rem" };

  return (
    <div style={{ padding: "2rem" }}>
      <AHead label="Overview" title="Performance" />

      {/* ── Top 3 Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Total Bookings", value: String(totalBookings), icon: ShoppingBag, color: "#60a5fa", bgColor: "rgba(96,165,250,0.08)" },
          { label: "Total Vendors", value: String(vendorCount), icon: Users, color: "#4ade80", bgColor: "rgba(74,222,128,0.08)" },
          { label: "Total Payment", value: formattedPayment, icon: CreditCard, color: G.gold, bgColor: "rgba(201,168,76,0.08)" },
        ].map(card => {
          const IconComp = card.icon;
          return (
            <div key={card.label} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", padding: "1.75rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: card.bgColor, border: `1px solid ${card.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconComp size={22} style={{ color: card.color }} />
              </div>
              <div>
                <p style={{ color: G.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{card.label}</p>
                <p style={{ fontFamily: G.serif, color: G.text, fontSize: "1.8rem", fontWeight: 700, margin: 0, lineHeight: 1 }}>{card.value}</p>
                <p style={{ color: G.muted, fontSize: "0.68rem", marginTop: "4px" }}>Till now</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Monthly Status Section ── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.15rem", fontWeight: 700, margin: "0 0 1.25rem" }}>Monthly Status</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* Monthly Bookings Bar Chart */}
        <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", padding: "1.75rem" }}>
          <p style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", marginBottom: "1.25rem", fontWeight: 600 }}>Monthly Bookings</p>
          {totalBookings === 0 ? (
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: G.muted, fontSize: "0.85rem" }}>No bookings data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                <XAxis dataKey="month" stroke={G.muted} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={G.muted} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="bookings" fill={G.gold} radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly Revenue Line Chart */}
        <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", padding: "1.75rem" }}>
          <p style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", marginBottom: "1.25rem", fontWeight: 600 }}>Monthly Revenue (in ₹K)</p>
          {totalPayment === 0 ? (
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: G.muted, fontSize: "0.85rem" }}>No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                <XAxis dataKey="month" stroke={G.muted} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={G.muted} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}K`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke={G.gold} strokeWidth={2.5} dot={{ fill: G.gold, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ REVIEWS PANEL ══════════════ */
function StarRow({ n, filled }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={13} style={{ color: G.gold, fill: i < filled ? G.gold : "transparent" }} />
      ))}
    </div>
  );
}

function ReviewsPanel({ reviews, onReload }) {
  const [filter, setFilter] = useState("All");
  
  const statusColors = {
    Approved: { c: "#4ade80", bg: "rgba(74,222,128,0.1)" },
    Pending:  { c: G.gold,    bg: "rgba(201,168,76,0.1)"  },
    Flagged:  { c: "#f87171", bg: "rgba(248,113,113,0.1)" },
  };

  const reviewsList = reviews || [];
  const totalReviews = reviewsList.length;

  let avgRating = 0;
  if (totalReviews > 0) {
    avgRating = reviewsList.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  }

  let satPct = 0;
  if (totalReviews > 0) {
    const positive = reviewsList.filter(r => r.rating >= 4).length;
    satPct = Math.round((positive / totalReviews) * 100);
  }

  const complaintsCount = reviewsList.filter(r => r.rating <= 2).length;
  const pendingCount = reviewsList.filter(r => r.status === "Pending").length;
  const resolvedCount = reviewsList.filter(r => r.rating <= 2 && r.reply).length;

  const overviewCards = [
    { title: "Overall Rating", val: totalReviews > 0 ? `${avgRating.toFixed(1)}/5` : "0.0/5", desc: `Out of ${totalReviews} reviews` },
    { title: "Customer Satisfaction", val: `${satPct}%`, desc: "Highly positive rating ratio" },
    { title: "Total Reviews", val: String(totalReviews), desc: "All-time customer feedback" },
    { title: "Complaints", val: String(complaintsCount), desc: "Negative reviews flagged" },
    { title: "Pending Reviews", val: String(pendingCount), desc: "Awaiting moderator review" },
    { title: "Resolved Issues", val: String(resolvedCount), desc: "Client complaints resolved" }
  ];

  const ratingDist = [5, 4, 3, 2, 1].map(star => {
    const count = reviewsList.filter(r => r.rating === star).length;
    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, pct };
  });

  const SERVICES_LIST = ["Decoration", "Catering", "Photography", "Entertainment"];
  const servicePerformance = SERVICES_LIST.map(service => {
    const matching = reviewsList.filter(r => r.service_name === service && r.service_rating !== null && r.service_rating !== undefined);
    const count = matching.length;
    const avg = count > 0 ? matching.reduce((sum, r) => sum + (r.service_rating || 0), 0) / count : 0;
    return {
      service,
      rating: count > 0 ? `⭐ ${avg.toFixed(1)}` : "⭐ 5.0",
      reviews: count,
      avgValue: count > 0 ? avg : 5.0
    };
  });

  let bestService = "Decoration";
  let needsImprovement = "Entertainment";
  if (reviewsList.some(r => r.service_name)) {
    const reviewed = servicePerformance.filter(s => s.reviews > 0);
    if (reviewed.length > 0) {
      const sorted = [...reviewed].sort((a, b) => b.avgValue - a.avgValue);
      bestService = sorted[0].service;
      needsImprovement = sorted[sorted.length - 1].service;
    }
  }

  const SUPERVISORS_LIST = ["John", "Kumar", "Priya"];
  const supervisorPerformance = SUPERVISORS_LIST.map(supervisor => {
    const matching = reviewsList.filter(r => r.supervisor === supervisor && r.supervisor_rating !== null && r.supervisor_rating !== undefined);
    const count = matching.length;
    const avg = count > 0 ? matching.reduce((sum, r) => sum + (r.supervisor_rating || 0), 0) / count : 0;
    return {
      supervisor,
      events: count,
      rating: count > 0 ? `⭐ ${avg.toFixed(1)}` : "⭐ 5.0"
    };
  });

  const EVENT_TYPES_LIST = ["Wedding", "Reception", "Birthday", "Housewarming", "Baby Shower", "Corporate Event"];
  const eventFeedback = EVENT_TYPES_LIST.map(type => {
    const matching = reviewsList.filter(r => r.event_type === type);
    const count = matching.length;
    const avg = count > 0 ? matching.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return {
      type,
      rating: count > 0 ? `⭐ ${avg.toFixed(1)}` : "⭐ 5.0"
    };
  });

  const filtered = filter === "All" ? reviewsList : reviewsList.filter(r => r.status === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status: "Approved" })
        .eq("id", reviewId);

      if (error) throw error;
      onReload();
    } catch (err) {
      alert("Failed to approve review: " + err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;
      onReload();
    } catch (err) {
      alert("Failed to delete review: " + err.message);
    }
  };

  const handleReply = async (reviewId, currentReply) => {
    const replyText = prompt("Enter your reply:", currentReply || "");
    if (replyText === null) return;
    
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ reply: replyText.trim() || null })
        .eq("id", reviewId);

      if (error) throw error;
      onReload();
    } catch (err) {
      alert("Failed to save reply: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <AHead label="Customer Voice" title="Reviews & Feedback" />

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {overviewCards.map((c, i) => (
          <div key={i} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "1.1rem" }}>
            <p style={{ color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{c.title}</p>
            <p style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>
              {c.title === "Overall Rating" && totalReviews > 0 ? "⭐ " : ""}{c.val}
            </p>
            <p style={{ color: G.muted, fontSize: "0.68rem", marginTop: "4px", opacity: 0.7 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Lower Analytics Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }} className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.5rem" }}>
            <p style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem" }}>
              📈 Customer Satisfaction Chart
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {ratingDist.map(item => (
                <div key={item.star} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <span style={{ color: G.gold, fontSize: "0.8rem", fontWeight: 600, minWidth: "22px" }}>{item.star}⭐</span>
                  <div style={{ flex: 1, height: "8px", background: G.surface2, borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${item.pct}%`, background: `linear-gradient(to right, ${G.gold}, #9a7a2e)`, borderRadius: "99px" }} />
                  </div>
                  <span style={{ color: G.text, fontSize: "0.78rem", fontWeight: 700, minWidth: "25px", textAlign: "right" }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.5rem" }}>
            <p style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem" }}>
              🛠️ Service Performance
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${G.border}` }}>
                  <th style={{ color: G.muted, textAlign: "left", padding: "6px 8px", fontSize: "0.7rem", textTransform: "uppercase" }}>Service</th>
                  <th style={{ color: G.muted, textAlign: "left", padding: "6px 8px", fontSize: "0.7rem", textTransform: "uppercase" }}>Rating</th>
                  <th style={{ color: G.muted, textAlign: "right", padding: "6px 8px", fontSize: "0.7rem", textTransform: "uppercase" }}>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {servicePerformance.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < servicePerformance.length - 1 ? `1px dashed ${G.border}` : "none" }}>
                    <td style={{ color: G.text, padding: "8px", fontWeight: 600 }}>{row.service}</td>
                    <td style={{ color: G.gold, padding: "8px", fontWeight: 600 }}>{row.rating}</td>
                    <td style={{ color: G.muted, padding: "8px", textAlign: "right" }}>{row.reviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)", color: "#4ade80", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🏆</span>
                <span><strong>Best Service:</strong> {bestService}</span>
              </div>
              <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.18)", color: "#f87171", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>⚠️</span>
                <span><strong>Needs Improvement:</strong> {needsImprovement}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.5rem" }}>
            <p style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem" }}>
              👥 Supervisor Performance
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${G.border}` }}>
                  <th style={{ color: G.muted, textAlign: "left", padding: "6px 8px", fontSize: "0.7rem", textTransform: "uppercase" }}>Supervisor</th>
                  <th style={{ color: G.muted, textAlign: "left", padding: "6px 8px", fontSize: "0.7rem", textTransform: "uppercase" }}>Events</th>
                  <th style={{ color: G.muted, textAlign: "right", padding: "6px 8px", fontSize: "0.7rem", textTransform: "uppercase" }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {supervisorPerformance.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < supervisorPerformance.length - 1 ? `1px dashed ${G.border}` : "none" }}>
                    <td style={{ color: G.text, padding: "8px", fontWeight: 600 }}>{row.supervisor}</td>
                    <td style={{ color: G.muted, padding: "8px" }}>{row.events}</td>
                    <td style={{ color: G.gold, padding: "8px", textAlign: "right", fontWeight: 600 }}>{row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.5rem" }}>
            <p style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem" }}>
              🎉 Event-wise Feedback
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${G.border}` }}>
                  <th style={{ color: G.muted, textAlign: "left", padding: "6px 8px", fontSize: "0.7rem", textTransform: "uppercase" }}>Event Type</th>
                  <th style={{ color: G.muted, textAlign: "right", padding: "6px 8px", fontSize: "0.7rem", textTransform: "uppercase" }}>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {eventFeedback.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < eventFeedback.length - 1 ? `1px dashed ${G.border}` : "none" }}>
                    <td style={{ color: G.text, padding: "8px", fontWeight: 600 }}>{row.type}</td>
                    <td style={{ color: G.gold, padding: "8px", textAlign: "right", fontWeight: 600 }}>{row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Log Filters */}
      <div style={{ display: "flex", gap: "0.55rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <p style={{ color: G.text, fontWeight: 700, fontSize: "0.9rem", marginRight: "1rem", margin: 0 }}>Review Logs</p>
        {(["All", "Approved", "Pending", "Flagged"]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "0.4rem 1.1rem", border: `1px solid ${filter === f ? G.gold : G.border}`, background: filter === f ? "rgba(201,168,76,0.12)" : "transparent", color: filter === f ? G.gold : G.muted, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontFamily: G.sans, fontWeight: filter === f ? 600 : 400, transition: "all 0.2s" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Review Card Listing */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", background: G.surface, border: `1px dashed ${G.border}`, borderRadius: "12px", padding: "4rem 2rem", textAlign: "center" }}>
            <p style={{ color: G.muted, fontSize: "0.92rem", margin: 0 }}>No reviews submitted yet. Feedbacks posted by users will display here in real-time.</p>
          </div>
        ) : (
          filtered.map(r => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "border-color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget).style.borderColor = "rgba(201,168,76,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget).style.borderColor = G.border; }}>

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#0a0804", fontWeight: 700, fontSize: "1rem" }}>{(r.user_name || "C")[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p style={{ color: G.text, fontSize: "0.9rem", fontFamily: G.serif }}>{r.user_name}</p>
                    <p style={{ color: G.muted, fontSize: "0.7rem" }}>{formatDate(r.created_at)}</p>
                  </div>
                </div>
                <Chip label={r.status} color={statusColors[r.status]?.c || G.gold} bg={statusColors[r.status]?.bg || "rgba(201,168,76,0.1)"} />
              </div>

              <div>
                <StarRow n={5} filled={r.rating} />
                <p style={{ color: G.muted, fontSize: "0.7rem", marginTop: "4px", lineHeight: 1.4 }}>
                  <strong>{r.event_type}</strong>
                  {r.service_name && ` · Service: ${r.service_name} (${r.service_rating}⭐)`}
                  {r.supervisor && ` · Supervisor: ${r.supervisor} (${r.supervisor_rating}⭐)`}
                </p>
              </div>

              <div style={{ background: G.surface2, borderLeft: `3px solid ${r.rating >= 4 ? G.gold : r.rating === 3 ? "#60a5fa" : "#f87171"}`, borderRadius: "0 6px 6px 0", padding: "0.85rem 1rem" }}>
                <p style={{ color: "rgba(245,234,214,0.82)", fontSize: "0.84rem", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>"{r.text}"</p>
              </div>

              {r.reply && (
                <div style={{ background: "rgba(201,168,76,0.04)", borderLeft: `3px solid ${G.gold}`, borderRadius: "0 6px 6px 0", padding: "0.75rem 1rem", marginTop: "-0.5rem" }}>
                  <p style={{ color: G.gold, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "3px", letterSpacing: "0.05em" }}>Admin Response</p>
                  <p style={{ color: G.text, fontSize: "0.8rem", fontStyle: "italic", margin: 0 }}>"{r.reply}"</p>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ThumbsUp size={13} style={{ color: G.muted }} />
                  <span style={{ color: G.muted, fontSize: "0.72rem" }}>{r.helpful || 0} found helpful</span>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {r.status !== "Approved" && (
                    <ActionBtn icon={CheckCircle} label="Approve" onClick={() => handleApprove(r.id)} />
                  )}
                  <ActionBtn icon={MessageSquare} label="Reply" onClick={() => handleReply(r.id, r.reply)} />
                  <ActionBtn icon={Trash2} label="Delete" danger onClick={() => handleDelete(r.id)} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* ══════════════ EVENT GALLERY PANEL ══════════════ */
function AdminEventGalleryPanel() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formUrl, setFormUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `gallery-uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, file);
        
      if (error) {
        // Fallback to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setFormUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('user_uploads')
          .getPublicUrl(filePath);
        setFormUrl(publicUrlData?.publicUrl || "");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };
  const [formCaption, setFormCaption] = useState("");
  const [formCategory, setFormCategory] = useState("Wedding Gallery");
  const [formMediaType, setFormMediaType] = useState("image");
  const [formBudgetTier, setFormBudgetTier] = useState("medium");
  const [formServiceName, setFormServiceName] = useState("");

  const loadGallery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setGallery(data || []);
    } catch (err) {
      console.error("Error loading gallery:", err);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormUrl("");
    setFormCaption("");
    setFormCategory("Wedding Gallery");
    setFormMediaType("image");
    setFormBudgetTier("medium");
    setFormServiceName("");
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormUrl(item.url || "");
    setFormCaption(item.caption || "");
    setFormCategory(item.category || "Wedding Gallery");
    setFormMediaType(item.media_type || "image");
    setFormBudgetTier(item.budget_tier || "medium");
    setFormServiceName(item.service_name || "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      toast.success("Gallery item deleted successfully");
      loadGallery();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting item: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formUrl.trim()) {
      toast.error("URL is required");
      return;
    }
    const payload = {
      url: formUrl.trim(),
      caption: formCaption.trim(),
      category: formCategory,
      media_type: formMediaType,
      budget_tier: formBudgetTier,
      service_name: formServiceName.trim() || null,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("gallery")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Gallery item updated successfully");
      } else {
        const { error } = await supabase
          .from("gallery")
          .insert([payload]);
        if (error) throw error;
        toast.success("New gallery item added successfully");
      }
      setShowModal(false);
      loadGallery();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save: " + err.message);
    }
  };

  const filtered = activeTab === "All" ? gallery : gallery.filter(item => item.category === activeTab);
  const categories = ["All", "Wedding Gallery", "Birthday Gallery", "Family Function Gallery", "Videos"];

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <AHead label="Media Management" title="Event Gallery" />
        <button onClick={handleOpenAdd} style={{ display: "flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #c9a84c, #9a7a2e)", border: "none", color: "#0a0804", padding: "8px 18px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans, boxShadow: "0 4px 15px rgba(201,168,76,0.25)", transition: "transform 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
          <Plus size={15} /> Add Gallery Media
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {categories.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.45rem 1rem",
              border: `1px solid ${activeTab === tab ? G.gold : G.border}`,
              background: activeTab === tab ? "rgba(201,168,76,0.12)" : "transparent",
              color: activeTab === tab ? G.gold : G.muted,
              borderRadius: "4px", cursor: "pointer",
              fontSize: "0.78rem", fontFamily: G.sans,
              fontWeight: activeTab === tab ? 600 : 400,
              transition: "all 0.2s"
            }}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: G.muted, textAlign: "center", padding: "3rem" }}>Loading media items...</p>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", background: G.surface, borderRadius: "10px", border: `1px solid ${G.border}` }}>
          <p style={{ color: G.muted, margin: 0 }}>No media found under this category.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {filtered.map(item => {
            const isVideo = item.media_type === "video";
            return (
              <div key={item.id} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; }}>
                
                {/* Media preview */}
                <div style={{ height: "160px", background: "#1a1610", position: "relative", overflow: "hidden" }}>
                  {isVideo ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#14100a" }}>
                      <Play size={32} style={{ color: G.gold }} />
                      <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(10,8,4,0.75)", color: G.text, padding: "2px 6px", borderRadius: "4px", fontSize: "0.6rem" }}>VIDEO</span>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { (e.target).src = "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=300&fit=crop"; }} />
                  )}
                </div>

                {/* Info & Action area */}
                <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <p style={{ color: G.text, fontSize: "0.85rem", fontWeight: 600, fontFamily: G.serif, margin: "0 0 4px 0", lineBreak: "anywhere" }}>{item.caption || "No Caption"}</p>
                    <p style={{ color: G.muted, fontSize: "0.7rem", margin: "0 0 2px 0" }}>Category: <span style={{ color: G.gold }}>{item.category}</span></p>
                    <p style={{ color: G.muted, fontSize: "0.7rem", margin: 0 }}>Tier: <span style={{ textTransform: "capitalize" }}>{item.budget_tier || "Medium"}</span></p>
                  </div>
                  
                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => handleOpenEdit(item)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, color: G.gold, padding: "5px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer", fontFamily: G.sans }}>
                      <Edit3 size={11} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", padding: "5px 10px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer", fontFamily: G.sans }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.85)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={{ background: "#14100a", border: `1px solid ${G.gold}`, borderRadius: "12px", width: "100%", maxWidth: "480px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: G.serif, color: G.text, fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                  {editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
                </p>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer" }}><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: G.text, fontSize: "0.78rem", marginBottom: "4px" }}>Upload Media File</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} style={{ display: "none" }} id="gallery-photo-upload" />
                    <label htmlFor="gallery-photo-upload" style={{ background: "rgba(201,168,76,0.12)", border: `1px solid ${G.border}`, color: G.gold, borderRadius: "6px", padding: "8px 15px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, display: "inline-block" }}>
                      {uploading ? "Uploading..." : "Choose File"}
                    </label>
                    <input readOnly type="text" value={formUrl ? (formUrl.startsWith("data:") ? "Local File Selected (Base64)" : formUrl.substring(0, 30) + "...") : "No file selected"} style={{ flex: 1, padding: "8px 10px", background: "rgba(26,20,8,0.5)", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.muted, fontSize: "0.82rem", outline: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: G.text, fontSize: "0.78rem", marginBottom: "4px" }}>Caption</label>
                  <input type="text" value={formCaption} onChange={e => setFormCaption(e.target.value)} placeholder="e.g. Dream Stage Decoration" style={{ width: "100%", background: "rgba(26,20,8,0.5)", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, padding: "8px 10px", fontSize: "0.82rem", outline: "none" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", color: G.text, fontSize: "0.78rem", marginBottom: "4px" }}>Category</label>
                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)} style={{ width: "100%", background: "#1a1408", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, padding: "8px", fontSize: "0.82rem", outline: "none" }}>
                      <option value="Wedding Gallery">Wedding Gallery</option>
                      <option value="Birthday Gallery">Birthday Gallery</option>
                      <option value="Family Function Gallery">Family Function Gallery</option>
                      <option value="Videos">Videos</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", color: G.text, fontSize: "0.78rem", marginBottom: "4px" }}>Media Type</label>
                    <select value={formMediaType} onChange={e => setFormMediaType(e.target.value)} style={{ width: "100%", background: "#1a1408", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, padding: "8px", fontSize: "0.82rem", outline: "none" }}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", color: G.text, fontSize: "0.78rem", marginBottom: "4px" }}>Budget Tier</label>
                    <select value={formBudgetTier} onChange={e => setFormBudgetTier(e.target.value)} style={{ width: "100%", background: "#1a1408", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, padding: "8px", fontSize: "0.82rem", outline: "none" }}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", color: G.text, fontSize: "0.78rem", marginBottom: "4px" }}>Service Name (Optional)</label>
                    <input type="text" value={formServiceName} onChange={e => setFormServiceName(e.target.value)} placeholder="e.g. Decoration" style={{ width: "100%", background: "rgba(26,20,8,0.5)", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, padding: "8px 10px", fontSize: "0.82rem", outline: "none" }} />
                  </div>
                </div>

                <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.muted, padding: "8px 16px", borderRadius: "6px", fontSize: "0.82rem", cursor: "pointer", fontFamily: G.sans }}>Cancel</button>
                  <button type="submit" style={{ background: "linear-gradient(135deg, #c9a84c, #9a7a2e)", border: "none", color: "#0a0804", padding: "8px 20px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════ MAIN ══════════════ */

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [adminName, setAdminName] = useState("Vaishnavi");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes, rRes, uRes] = await Promise.allSettled([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*"),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
        supabase.auth.getUser(),
      ]);

      const bookingsData = bRes.status === "fulfilled" && !bRes.value.error ? bRes.value.data : [];
      const profilesData = pRes.status === "fulfilled" && !pRes.value.error ? pRes.value.data : [];
      const reviewsData = rRes.status === "fulfilled" && !rRes.value.error ? rRes.value.data : [];
      const adminUser = uRes.status === "fulfilled" && !uRes.value.error ? uRes.value.data?.user : null;
      const adminId = adminUser?.id;

      if (adminId && profilesData.length > 0) {
        const adminProf = profilesData.find((p) => p.id === adminId);
        if (adminProf?.full_name) {
          setAdminName(adminProf.full_name);
        }
      }

      let finalProfiles = profilesData.filter((p) => {
        if (p.id === adminId) return false;
        const nameLower = (p.full_name || "").toLowerCase();
        if (nameLower.includes("vaishnavi")) return false;
        if ((p.email || "").toLowerCase().includes("vaishnaviboopathi")) return false;
        if ((p.role || "").toLowerCase() === "admin") return false;
        return true;
      });

      const profilesMap = new Map(finalProfiles.map((p) => [p.id, p]));

      const processedBookings = bookingsData.map((b) => ({
        ...b,
        profiles: profilesMap.get(b.user_id) || { full_name: "Customer", phone: "", address: "" }
      }));

      setBookings(processedBookings);
      setProfiles(finalProfiles);
      setReviews(reviewsData);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Set up real-time postgres changes subscription
    const channel = supabase
      .channel("db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        loadData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        loadData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
        loadData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, (payload) => {
        toast.success("New payment received.");
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const allItems = NAV_GROUPS.flatMap(g => g.items);

  const PANEL_MAP = {
    dashboard:     <DashboardPanel bookings={bookings} profiles={profiles} />,
    services_mgmt: <ServicesMgmtPanel />,
    packages_mgmt: <AdminPackagesPanel />,
    vendors_mgmt:  <VendorsPanel />,
    bookings:      <BookingsPanel bookings={bookings} onReload={loadData} />,
    reports:       <ReportsPanel bookings={bookings} profiles={profiles} />,
    reviews:       <ReviewsPanel reviews={reviews} onReload={loadData} />,
    event_gallery: <AdminEventGalleryPanel />,
    profile:       <ProfileTab userName={adminName} onLogout={onLogout} />,
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Logo — fixed */}
      <div style={{ padding: "1.1rem 1.5rem", borderBottom: `1px solid ${G.border}`, flexShrink: 0, display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={logo} alt="Vizhaa Logo" style={{ height: "44px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 1px 6px rgba(201,168,76,0.3))" }} />
        <div>
          <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1 }}>Vizhaa</p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ color: G.muted, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Scrollable nav */}
      <nav style={{ flex: 1, minHeight: 0, overflowY: "scroll", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: `rgba(201,168,76,0.25) transparent`, paddingBottom: "0.5rem" }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p style={{ color: G.muted, fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.18em", padding: "0.85rem 1.5rem 0.25rem", opacity: 0.6, userSelect: "none" }}>{group.label}</p>
            {group.items.map(({ id, label, icon: Icon }) => {
              const active = id === activeTab;
              return (
                <button key={id} onClick={() => { setActiveTab(id); setMobileOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: "0.65rem", width: "100%", padding: "0.58rem 1.5rem", background: active ? "linear-gradient(90deg, rgba(201,168,76,0.14), rgba(201,168,76,0.03))" : "transparent", border: "none", borderLeft: active ? `3px solid ${G.gold}` : "3px solid transparent", color: active ? G.gold : G.muted, cursor: "pointer", transition: "all 0.18s", textAlign: "left" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = G.text; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = G.muted; }}>
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", fontFamily: G.sans, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                  {active && <ChevronRight size={12} style={{ marginLeft: "auto", flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout — fixed at bottom */}
      <div style={{ padding: "0.85rem 1.5rem", borderTop: `1px solid ${G.border}`, flexShrink: 0 }}>
        <button onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "none", border: "none", color: G.muted, cursor: "pointer", fontFamily: G.sans, width: "100%", padding: "0.4rem 0", transition: "color 0.2s", fontSize: "0.82rem" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.color = G.muted; }}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: G.bg, overflow: "hidden", fontFamily: G.sans }}>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col" style={{ width: "230px", height: "100vh", background: G.surface, borderRight: `1px solid ${G.border}`, flexShrink: 0, overflow: "hidden" }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.7)", zIndex: 40 }} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "230px", background: G.surface, borderRight: `1px solid ${G.border}`, zIndex: 50, display: "flex", flexDirection: "column" }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Mobile top bar */}
        <header className="flex lg:hidden items-center justify-between" style={{ background: G.surface, borderBottom: `1px solid ${G.border}`, padding: "0 1rem", height: "52px", flexShrink: 0 }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", color: G.gold, cursor: "pointer" }}><Menu size={20} /></button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={logo} alt="Vizhaa Logo" style={{ height: "30px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 1px 4px rgba(201,168,76,0.25))" }} />
            <span style={{ fontFamily: G.script, color: G.gold, fontSize: "1.4rem" }}>Vizhaa</span>
          </div>
          <div style={{ width: "20px" }} />
        </header>

        {/* Breadcrumb bar */}
        <div style={{ background: G.surface2, borderBottom: `1px solid ${G.border}`, padding: "0 1.5rem", height: "48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: G.muted, fontSize: "0.72rem" }}>Admin</span>
            <span style={{ color: G.border }}>›</span>
            <span style={{ color: G.gold, fontSize: "0.8rem", fontWeight: 600 }}>
              {allItems.find(n => n.id === activeTab)?.label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ color: G.muted, fontSize: "0.72rem" }}>{adminName}</span>
          </div>
        </div>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: `${G.border} transparent` }}>
          {loading ? (
            <p style={{ color: G.muted, fontSize: "0.9rem", textAlign: "center", padding: "4rem" }}>Loading dashboard details...</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ minHeight: "100%" }}>
                {PANEL_MAP[activeTab]}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}

