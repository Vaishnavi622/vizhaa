import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CalendarDays, CheckCircle, Clock, XCircle, CreditCard, ArrowRight, Star, Sparkles, X } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const G = {
  surface: "rgba(20, 16, 10, 0.72)", surface2: "rgba(26, 20, 8, 0.55)", border: "rgba(201,168,76,0.18)", gold: "#c9a84c",
  text: "#f5ead6", muted: "#9a8060",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

const statusColor = (s) => s === "Confirmed" || s === "Paid" || s === "Completed" ? "#4ade80" : s === "In Progress" || s === "Pending" ? G.gold : "#f87171";
const statusBg   = (s) => s === "Confirmed" || s === "Paid" || s === "Completed" ? "rgba(74,222,128,0.1)" : s === "In Progress" || s === "Pending" ? "rgba(201,168,76,0.1)" : "rgba(248,113,113,0.1)";
const StatusIcon = ({ s }) => s === "Confirmed" || s === "Paid" || s === "Completed" ? <CheckCircle size={13} /> : s === "In Progress" || s === "Pending" ? <Clock size={13} /> : <XCircle size={13} />;

const TABS = ["Active Bookings", "Booking History", "Payment Status"];

function SectionHead({ script, title }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.6rem", lineHeight: 1.1 }}>{script}</p>
      <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, margin: 0 }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <div style={{ height: "1px", width: "40px", background: `linear-gradient(to right, transparent, ${G.gold})` }} />
        <span style={{ color: G.gold }}>âœ¦</span>
        <div style={{ height: "1px", width: "40px", background: `linear-gradient(to left, transparent, ${G.gold})` }} />
      </div>
    </div>
  );
}

export default function BookingsTab() {
  const [active, setActive] = useState("Active Bookings");
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reviews and Feedback state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [serviceName, setServiceName] = useState("");
  const [serviceRating, setServiceRating] = useState(5);
  const [supervisor, setSupervisor] = useState("");
  const [supervisorRating, setSupervisorRating] = useState(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const handleOpenFeedback = (b) => {
    setSelectedBooking(b);
    setRating(5);
    setReviewText("");
    setServiceName("");
    setServiceRating(5);
    setSupervisor("");
    setSupervisorRating(5);

    if (b) {
      const name = (b.event_name || "").toLowerCase();
      if (name.includes("wedding") || name.includes("marriage") || name.includes("engagement") || name.includes("sangeet")) {
        setEventType("Wedding");
      } else if (name.includes("reception")) {
        setEventType("Reception");
      } else if (name.includes("birthday")) {
        setEventType("Birthday");
      } else if (name.includes("housewarming")) {
        setEventType("Housewarming");
      } else if (name.includes("baby shower")) {
        setEventType("Baby Shower");
      } else if (name.includes("corporate") || name.includes("seminar") || name.includes("gala") || name.includes("conference")) {
        setEventType("Corporate Event");
      } else {
        setEventType("Wedding");
      }
      
      const coord = b.coordinator || "";
      if (["John", "Kumar", "Priya"].includes(coord)) {
        setSupervisor(coord);
      }
    } else {
      setEventType("Wedding");
    }

    setFeedbackOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!reviewText.trim()) return;
    setSubmittingFeedback(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to leave feedback.");
        setSubmittingFeedback(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const userName = profileData?.full_name || user.email?.split("@")[0] || "Customer";

      const newReview = {
        user_id: user.id,
        user_name: userName,
        event_type: eventType,
        rating,
        text: reviewText,
        service_name: serviceName || null,
        service_rating: serviceName ? serviceRating : null,
        supervisor: supervisor || null,
        supervisor_rating: supervisor ? supervisorRating : null,
        status: "Pending",
        helpful: 0
      };

      const { error } = await supabase
        .from("reviews")
        .insert([newReview]);

      if (error) {
        throw error;
      }

      alert("Thank you! Your feedback has been submitted successfully and is pending moderation.");
      setFeedbackOpen(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit feedback: " + err.message);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  async function loadData() {
    try {
      setLoading(true);
      const sRes = await supabase.auth.getSession();
      const user = sRes.data?.session?.user;
      if (user) {
        const [bRes, pRes] = await Promise.allSettled([
          supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("payments").select("*, bookings(event_name)").eq("user_id", user.id).order("created_at", { ascending: false }),
        ]);

        if (bRes.status === "fulfilled" && !bRes.value.error && bRes.value.data) {
          setBookings(bRes.value.data);
        }
        if (pRes.status === "fulfilled" && !pRes.value.error && pRes.value.data) {
          setPayments(pRes.value.data);
        }
      }
    } catch (err) {
      console.warn("Bookings load caught non-blocking error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("user-bookings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        loadData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePay = async (paymentId) => {
    const { error } = await supabase
      .from("payments")
      .update({ status: "Paid" })
      .eq("id", paymentId);

    if (error) {
      alert("Failed to process payment: " + error.message);
    } else {
      alert("Payment processed successfully!");
      loadData();
    }
  };

  const activeBookings = bookings.filter(b => ["Pending", "Confirmed", "In Progress"].includes(b.status));
  const historyBookings = bookings.filter(b => ["Completed", "Cancelled"].includes(b.status));

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SectionHead script="Your Events" title="My Bookings" />

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActive(t)}
            style={{ padding: "0.45rem 1.1rem", border: `1px solid ${active === t ? G.gold : G.border}`, background: active === t ? "rgba(201,168,76,0.12)" : "transparent", color: active === t ? G.gold : G.muted, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontFamily: G.sans, fontWeight: active === t ? 600 : 400, transition: "all 0.2s" }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: G.muted, fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>Loading bookings details...</p>
      ) : (
        <>
          {/* Active Bookings */}
          {active === "Active Bookings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {activeBookings.length === 0 ? (
                <p style={{ color: G.muted, fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>No active bookings found.</p>
              ) : (
                activeBookings.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.5rem" }}>
                    <div className="flex items-start justify-between flex-wrap gap-3" style={{ marginBottom: "1rem" }}>
                      <div>
                        <div className="flex items-center gap-2" style={{ marginBottom: "0.25rem" }}>
                          <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.05rem" }}>{b.event_name}</h3>
                          <span style={{ background: statusBg(b.status), color: statusColor(b.status), display: "flex", alignItems: "center", gap: "4px", padding: "2px 10px", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 600 }}>
                            <StatusIcon s={b.status} /> {b.status}
                          </span>
                        </div>
                        <p style={{ color: G.muted, fontSize: "0.8rem" }}>Booking ID: <span style={{ color: G.gold }}>{b.id.substring(0, 8).toUpperCase()}</span></p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: G.gold, fontWeight: 700, fontSize: "1.05rem" }}>{b.amount}</p>
                        <p style={{ color: G.muted, fontSize: "0.72rem" }}>Paid: {b.paid}</p>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                      {[{ label: "Event Date", val: formatDate(b.event_date), icon: CalendarDays }, { label: "Venue", val: b.venue || "TBD", icon: null }, { label: "Coordinator", val: b.coordinator || "TBD", icon: null }].map(({ label, val }) => (
                        <div key={label} style={{ background: G.surface2, borderRadius: "6px", padding: "0.75rem" }}>
                          <p style={{ color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>{label}</p>
                          <p style={{ color: G.text, fontSize: "0.82rem" }}>{val}</p>
                        </div>
                      ))}
                    </div>
                    {b.services && b.services.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {b.services.map((s) => <span key={s} style={{ background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, color: G.muted, padding: "3px 10px", borderRadius: "99px", fontSize: "0.72rem" }}>{s}</span>)}
                      </div>
                    )}

                    {["Confirmed", "In Progress", "Completed"].includes(b.status) && (
                      <div style={{ marginTop: "1.25rem", borderTop: `1px solid ${G.border}`, paddingTop: "1.25rem" }}>
                        <p style={{ color: G.gold, fontFamily: G.serif, fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Sparkles size={14} /> Event Tracking Status
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", flexWrap: "wrap" }}>
                          {[
                            { label: "Booking Confirmed", status: "Completed" },
                            { label: "Advance Payment", status: "Completed" },
                            { label: "Event Preparation", status: b.details?.tracking_preparation || "Pending" },
                            { label: "On-site Setup", status: b.details?.tracking_setup || "Pending" },
                            { label: "Event Executed", status: b.details?.tracking_execution || "Pending" }
                          ].map((step, idx) => {
                            const isCompleted = step.status === "Completed";
                            const isInProgress = step.status === "In Progress";
                            
                            const bulletColor = isCompleted ? "#4ade80" : isInProgress ? G.gold : "#444";
                            const textColor = isCompleted ? G.text : isInProgress ? G.gold : G.muted;

                            return (
                              <div key={idx} style={{ flex: 1, minWidth: "120px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
                                <div style={{ 
                                  width: "20px", 
                                  height: "20px", 
                                  borderRadius: "50%", 
                                  background: bulletColor, 
                                  border: `2px solid ${isCompleted ? "rgba(74,222,128,0.2)" : isInProgress ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)"}`, 
                                  display: "flex", 
                                  alignItems: "center", 
                                  justifyContent: "center",
                                  marginBottom: "6px",
                                  zIndex: 2
                                }}>
                                  {isCompleted && <span style={{ color: "#000", fontSize: "10px", fontWeight: "bold" }}>âœ“</span>}
                                  {isInProgress && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#000" }} />}
                                </div>
                                <p style={{ color: textColor, fontSize: "0.76rem", fontWeight: isInProgress ? 700 : 500, margin: 0 }}>{step.label}</p>
                                <p style={{ color: isCompleted ? "rgba(74,222,128,0.7)" : isInProgress ? "rgba(201,168,76,0.7)" : G.muted, fontSize: "0.68rem", margin: "2px 0 0" }}>{step.status}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}          {/* History */}
          {active === "Booking History" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* General Feedback Invitation */}
              <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem", marginBottom: "4px" }}>Share Your Experience</h3>
                  <p style={{ color: G.muted, fontSize: "0.78rem" }}>We value your voice. Write a review to help us improve our services.</p>
                </div>
                <button
                  onClick={() => handleOpenFeedback(null)}
                  style={{
                    background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`,
                    color: "#0a0804",
                    border: "none",
                    padding: "6px 16px",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: G.sans,
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Write a Review
                </button>
              </div>

              <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", overflow: "hidden" }}>
                {historyBookings.length === 0 ? (
                  <p style={{ color: G.muted, fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>No booking history found.</p>
                ) : (
                  historyBookings.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", padding: "1.25rem 1.5rem", borderBottom: i < historyBookings.length - 1 ? `1px solid ${G.border}` : "none" }}>
                      <div>
                        <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", marginBottom: "3px" }}>{b.event_name}</h3>
                        <p style={{ color: G.muted, fontSize: "0.75rem" }}>{b.id.substring(0, 8).toUpperCase()} Â· {b.venue || "TBD"}</p>
                        <div className="flex items-center gap-1" style={{ marginTop: "4px" }}>
                          <CalendarDays size={12} style={{ color: G.muted }} />
                          <span style={{ color: G.muted, fontSize: "0.72rem" }}>{formatDate(b.event_date)}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ color: G.gold, fontWeight: 700, fontSize: "0.95rem" }}>{b.amount}</span>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                          <span style={{ background: statusBg(b.status), color: statusColor(b.status), display: "flex", alignItems: "center", gap: "4px", padding: "3px 10px", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 600 }}>
                            <StatusIcon s={b.status} /> {b.status}
                          </span>
                          {b.status === "Completed" && (
                            <button
                              onClick={() => handleOpenFeedback(b)}
                              style={{
                                background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`,
                                color: "#0a0804",
                                border: "none",
                                padding: "4px 10px",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: G.sans,
                                transition: "opacity 0.2s"
                              }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                            >
                              Leave Feedback
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

      {/* Leave Feedback Modal */}
      {feedbackOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,8,4,0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem"
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: G.surface,
              border: `1px solid ${G.border}`,
              borderRadius: "12px",
              width: "100%",
              maxWidth: "500px",
              padding: "2rem",
              boxSizing: "border-box",
              position: "relative"
            }}
          >
            <button
              onClick={() => setFeedbackOpen(false)}
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
            <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.3rem", marginBottom: "0.5rem" }}>
              {selectedBooking ? `Feedback for ${selectedBooking.event_name}` : "Write a Review"}
            </h3>
            <p style={{ color: G.muted, fontSize: "0.8rem", marginBottom: "1.5rem" }}>
              Your review will be shared with the administrators and helps other customers.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "60vh", overflowY: "auto", paddingRight: "4px" }}>
              {/* Event Type */}
              <div>
                <label style={{ display: "block", color: G.muted, fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>Event Type</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none" }}
                >
                  {["Wedding", "Reception", "Birthday", "Housewarming", "Baby Shower", "Corporate Event"].map(t => (
                    <option key={t} value={t} style={{ background: "#1a1408" }}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Overall Rating */}
              <div>
                <label style={{ display: "block", color: G.muted, fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>Overall Rating</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <Star
                        size={20}
                        style={{
                          color: G.gold,
                          fill: star <= rating ? G.gold : "transparent",
                          transition: "transform 0.1s"
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label style={{ display: "block", color: G.muted, fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>Review Details</label>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                  rows={3}
                  style={{ width: "100%", padding: "0.6rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", resize: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Optional Service Rating */}
              <div style={{ borderTop: `1px dashed ${G.border}`, paddingTop: "1rem" }}>
                <p style={{ color: G.gold, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.6rem" }}>Rate Specific Service (Optional)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", marginBottom: "0.3rem" }}>Service</label>
                    <select
                      value={serviceName}
                      onChange={e => setServiceName(e.target.value)}
                      style={{ width: "100%", padding: "0.5rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "4px", color: G.text, fontSize: "0.8rem", outline: "none" }}
                    >
                      <option value="" style={{ background: "#1a1408" }}>None / Select</option>
                      {["Decoration", "Catering", "Photography", "Entertainment"].map(s => (
                        <option key={s} value={s} style={{ background: "#1a1408" }}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {serviceName && (
                    <div>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", marginBottom: "0.3rem" }}>Rating</label>
                      <div style={{ display: "flex", gap: "4px", height: "30px", alignItems: "center" }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setServiceRating(star)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <Star
                              size={15}
                              style={{
                                color: G.gold,
                                fill: star <= serviceRating ? G.gold : "transparent"
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Supervisor Rating */}
              <div style={{ borderTop: `1px dashed ${G.border}`, paddingTop: "1rem", marginBottom: "0.5rem" }}>
                <p style={{ color: G.gold, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.6rem" }}>Rate Supervisor (Optional)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", marginBottom: "0.3rem" }}>Supervisor</label>
                    <select
                      value={supervisor}
                      onChange={e => setSupervisor(e.target.value)}
                      style={{ width: "100%", padding: "0.5rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "4px", color: G.text, fontSize: "0.8rem", outline: "none" }}
                    >
                      <option value="" style={{ background: "#1a1408" }}>None / Select</option>
                      {["John", "Kumar", "Priya"].map(sup => (
                        <option key={sup} value={sup} style={{ background: "#1a1408" }}>{sup}</option>
                      ))}
                    </select>
                  </div>
                  {supervisor && (
                    <div>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", marginBottom: "0.3rem" }}>Rating</label>
                      <div style={{ display: "flex", gap: "4px", height: "30px", alignItems: "center" }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setSupervisorRating(star)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <Star
                              size={15}
                              style={{
                                color: G.gold,
                                fill: star <= supervisorRating ? G.gold : "transparent"
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                onClick={() => setFeedbackOpen(false)}
                disabled={submittingFeedback}
                style={{
                  background: "transparent",
                  color: G.muted,
                  border: `1px solid ${G.border}`,
                  padding: "0.55rem 1.25rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  fontFamily: G.sans
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback || !reviewText.trim()}
                style={{
                  background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`,
                  color: "#0a0804",
                  border: "none",
                  padding: "0.55rem 1.5rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: G.sans,
                  opacity: submittingFeedback || !reviewText.trim() ? 0.6 : 1
                }}
              >
                {submittingFeedback ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

          {/* Payment Status */}
          {active === "Payment Status" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {payments.length === 0 ? (
                <p style={{ color: G.muted, fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>No payment history found.</p>
              ) : (
                payments.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CreditCard size={18} style={{ color: G.gold }} />
                      </div>
                      <div>
                        <p style={{ color: G.text, fontSize: "0.88rem", marginBottom: "2px" }}>{p.bookings?.event_name || "General Booking"} â€” {p.id.substring(0, 8).toUpperCase()}</p>
                        <p style={{ color: G.muted, fontSize: "0.72rem" }}>{formatDate(p.date)} Â· {p.method}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ color: G.gold, fontWeight: 700, fontSize: "1rem" }}>{p.amount}</span>
                      <span style={{ background: statusBg(p.status), color: statusColor(p.status), display: "flex", alignItems: "center", gap: "4px", padding: "3px 12px", borderRadius: "99px", fontSize: "0.72rem", fontWeight: 600 }}>
                        <StatusIcon s={p.status} /> {p.status}
                      </span>
                      {p.status === "Pending" && (
                        <button onClick={() => handlePay(p.id)} style={{ display: "flex", alignItems: "center", gap: "4px", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "5px 14px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>
                          Pay Now <ArrowRight size={11} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

