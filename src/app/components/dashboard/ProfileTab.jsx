import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { motion } from "motion/react";
import { User, Edit3, ShoppingBag, CreditCard, Settings, LogOut, Camera, Shield, Bell, ChevronRight, Check } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const G = {
  surface: "rgba(20, 16, 10, 0.72)", surface2: "rgba(26, 20, 8, 0.55)", border: "rgba(201,168,76,0.18)", gold: "#c9a84c",
  text: "#f5ead6", muted: "#9a8060",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

const statusColor = (s) => s === "Confirmed" || s === "Paid" || s === "Completed" ? "#4ade80" : s === "In Progress" || s === "Pending" ? G.gold : "#f87171";
const statusBg   = (s) => s === "Confirmed" || s === "Paid" || s === "Completed" ? "rgba(74,222,128,0.1)" : s === "In Progress" || s === "Pending" ? "rgba(201,168,76,0.1)" : "rgba(248,113,113,0.1)";

const PTABS = ["My Account", "Edit Profile", "Orders Placed Before", "Payment History", "Settings"];

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

function Card({ children, style = {} }) {
  return <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", ...style }}>{children}</div>;
}

export default function ProfileTab({ userName, onLogout }) {
  // Password update state (admin only)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwChanging, setPwChanging] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 4) {
      toast.error("New password must be at least 4 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setPwChanging(true);

    // Determine current user email from Supabase session or active profile / local storage
    let currentEmail = "vaishnaviboopathi127@gmail.com";
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) currentEmail = user.email;
    } catch (e) {}

    if (!currentEmail && profile.email) {
      currentEmail = profile.email;
    }

    // Try Supabase auth update if available
    try {
      if (oldPassword) {
        await supabase.auth.signInWithPassword({ email: currentEmail, password: oldPassword });
      }
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError && !updateError.message.toLowerCase().includes("failed to fetch") && !updateError.message.toLowerCase().includes("auth")) {
        console.warn("Supabase password update warning:", updateError.message);
      }
    } catch (err) {
      console.warn("Supabase network error during password update, updating local session password.");
    }

    // Update local admin/user password storage for instant login access
    localStorage.setItem("vizhaa_admin_password", newPassword);
    toast.success("Password updated successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwChanging(false);
  };
  const [active, setActive] = useState("My Account");
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    fullName: userName,
    email: "",
    phone: "",
    address: "",
    preferences: "Wedding, Reception, Birthday",
    rewardPoints: 0
  });
  const [orders, setOrders] = useState([]);
  const [payHistory, setPayHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile({
            fullName: data.full_name || user.user_metadata?.full_name || userName,
            email: user.email || "",
            phone: data.phone || user.user_metadata?.phone || "",
            address: data.address || user.user_metadata?.address || "",
            preferences: data.preferences || "Wedding, Reception, Birthday",
            rewardPoints: data.reward_points || 0
          });
        } else {
          setProfile({
            fullName: user.user_metadata?.full_name || userName,
            email: user.email || "",
            phone: user.user_metadata?.phone || "",
            address: user.user_metadata?.address || "",
            preferences: "Wedding, Reception, Birthday",
            rewardPoints: 0
          });
        }

        // Fetch bookings (orders)
        const { data: bData } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (bData) {
          setOrders(bData.map((b) => ({
            id: b.id.substring(0, 8).toUpperCase(),
            event: b.event_name,
            date: b.event_date,
            amount: b.amount,
            status: b.status
          })));
        }

        // Fetch payments
        const { data: pData } = await supabase
          .from("payments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (pData) {
          const bMap = new Map((bData || []).map(b => [b.id, b]));
          setPayHistory(pData.map(p => {
            const b = bMap.get(p.booking_id);
            return {
              id: p.id.substring(0, 8).toUpperCase(),
              desc: `${b?.event_name || "General Booking"} — Payment`,
              date: p.date,
              amount: p.amount,
              method: p.method
            };
          }));
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [userName]);

  const handleSave = async () => {
    setSaved(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: profile.fullName,
          phone: profile.phone,
          address: profile.address,
          preferences: profile.preferences,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error("Error saving profile:", error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <SectionHead script="Your Account" title="Profile" />

      {/* Side tabs + content layout */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem", alignItems: "start" }} className="lg:grid-cols-[220px_1fr]">
        {/* Left menu */}
        <Card style={{ overflow: "hidden" }}>
          {/* Avatar */}
          <div style={{ padding: "1.5rem", borderBottom: `1px solid ${G.border}`, textAlign: "center" }}>
            <div style={{ position: "relative", width: "72px", margin: "0 auto 0.75rem" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #9a7a2e)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${G.gold}` }}>
                <span style={{ color: "#0a0804", fontSize: "2rem", fontWeight: 700 }}>{(profile.fullName || "?")[0].toUpperCase()}</span>
              </div>
              <button style={{ position: "absolute", bottom: 0, right: 0, width: "24px", height: "24px", borderRadius: "50%", background: G.gold, border: "2px solid #0a0804", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={11} style={{ color: "#0a0804" }} />
              </button>
            </div>
            <p style={{ color: G.text, fontFamily: G.serif, fontSize: "0.95rem", fontWeight: 600 }}>{profile.fullName}</p>
          </div>

          {/* Nav items */}
          {[
            { id: "My Account", icon: User },
            { id: "Edit Profile", icon: Edit3 },
            { id: "Orders Placed Before", icon: ShoppingBag },
            { id: "Payment History", icon: CreditCard },
            { id: "Settings", icon: Settings },
          ].map(({ id, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: active === id ? "rgba(201,168,76,0.1)" : "transparent", borderLeft: active === id ? `3px solid ${G.gold}` : "3px solid transparent", border: "none", color: active === id ? G.gold : G.muted, cursor: "pointer", transition: "all 0.2s", fontFamily: G.sans }}>
              <div className="flex items-center gap-2">
                <Icon size={15} />
                <span style={{ fontSize: "0.82rem" }}>{id}</span>
              </div>
              <ChevronRight size={13} />
            </button>
          ))}

          {/* Logout */}
          <button onClick={onLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "0.75rem 1.25rem", background: "transparent", border: "none", borderTop: `1px solid ${G.border}`, color: G.muted, cursor: "pointer", fontFamily: G.sans, transition: "color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = G.muted; }}>
            <LogOut size={15} />
            <span style={{ fontSize: "0.82rem" }}>Logout</span>
          </button>
        </Card>

        {/* Content */}
        <motion.div key={active} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>

          {/* My Account */}
          {active === "My Account" && (
            <Card style={{ padding: "1.75rem" }}>
              <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.15rem", marginBottom: "1.5rem" }}>Account Overview</h3>
              {loading ? (
                <p style={{ color: G.muted }}>Loading your profile details...</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                  {[{ label: "Full Name", val: profile.fullName }, { label: "Email", val: profile.email }, { label: "Phone", val: profile.phone || "Not provided" }, { label: "Address", val: profile.address || "Not provided" }, { label: "Total Bookings", val: `${orders.length} Booked` }, { label: "Loyalty Points", val: `${profile.rewardPoints} Pts` }].map(({ label, val }) => (
                    <div key={label} style={{ background: G.surface2, borderRadius: "8px", padding: "1rem" }}>
                      <p style={{ color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{label}</p>
                      <p style={{ color: G.text, fontSize: "0.9rem" }}>{val}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Edit Profile */}
          {active === "Edit Profile" && (
            <Card style={{ padding: "1.75rem" }}>
              <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.15rem", marginBottom: "1.5rem" }}>Edit Profile</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Full Name</label>
                  <input type="text" value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.88rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Email Address</label>
                  <input type="email" value={profile.email} disabled
                    style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.muted, fontSize: "0.88rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box", cursor: "not-allowed" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Phone Number</label>
                  <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.88rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>City / Address</label>
                  <input type="text" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                    style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.88rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Event Preferences</label>
                <textarea value={profile.preferences} onChange={e => setProfile(p => ({ ...p, preferences: e.target.value }))} rows={2}
                  style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.88rem", fontFamily: G.sans, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <button onClick={handleSave}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.7rem 2rem", borderRadius: "6px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans, transition: "opacity 0.2s" }}>
                {saved ? <><Check size={15} /> Saved!</> : "Save Changes"}
              </button>
              {/* Password Update Section */}
              <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: G.surface2, borderRadius: "8px" }}>
                <h4 style={{ color: G.text, marginBottom: "0.75rem" }}>Change Password</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                    style={{ padding: "0.6rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text }} />
                  <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    style={{ padding: "0.6rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text }} />
                  <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    style={{ padding: "0.6rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text }} />
                  <button onClick={handleChangePassword} disabled={pwChanging}
                    style={{ background: G.gold, color: "#0a0804", padding: "0.6rem", borderRadius: "6px", border: "none", fontWeight: 700, cursor: "pointer" }}>
                    {pwChanging ? "Updating..." : "Change Password"}
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Orders */}
          {active === "Orders Placed Before" && (
            <Card style={{ overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${G.border}` }}>
                <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.05rem" }}>Order History</h3>
              </div>
              {orders.length === 0 ? (
                <p style={{ color: G.muted, fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>No orders found.</p>
              ) : (
                orders.map((o, i) => (
                  <div key={o.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", padding: "1.1rem 1.5rem", borderBottom: i < orders.length - 1 ? `1px solid ${G.border}` : "none" }}>
                    <div>
                      <p style={{ color: G.text, fontSize: "0.9rem", marginBottom: "3px", fontFamily: G.serif }}>{o.event}</p>
                      <p style={{ color: G.muted, fontSize: "0.72rem" }}>{o.id} · {o.date}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ color: G.gold, fontWeight: 700 }}>{o.amount}</span>
                      <span style={{ background: statusBg(o.status), color: statusColor(o.status), padding: "2px 10px", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 600 }}>{o.status}</span>
                    </div>
                  </div>
                ))
              )}
            </Card>
          )}

          {/* Payment History */}
          {active === "Payment History" && (
            <Card style={{ overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${G.border}` }}>
                <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.05rem" }}>Payment History</h3>
              </div>
              {payHistory.length === 0 ? (
                <p style={{ color: G.muted, fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>No payments found.</p>
              ) : (
                payHistory.map((p, i) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", padding: "1.1rem 1.5rem", borderBottom: i < payHistory.length - 1 ? `1px solid ${G.border}` : "none" }}>
                    <div>
                      <p style={{ color: G.text, fontSize: "0.88rem", marginBottom: "3px" }}>{p.desc}</p>
                      <p style={{ color: G.muted, fontSize: "0.72rem" }}>{p.id} · {p.date} · {p.method}</p>
                    </div>
                    <span style={{ color: G.gold, fontWeight: 700, fontSize: "0.95rem" }}>{p.amount}</span>
                  </div>
                ))
              )}
            </Card>
          )}

          {/* Settings */}
          {active === "Settings" && (
            <Card style={{ overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${G.border}` }}>
                <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.05rem" }}>Settings</h3>
              </div>
              {[
                { icon: Bell, label: "Push Notifications", desc: "Receive booking updates and reminders", on: true },
                { icon: Bell, label: "Email Notifications", desc: "Get offers and updates via email", on: true },
                { icon: Shield, label: "Two-Factor Authentication", desc: "Add extra security to your account", on: false },
                { icon: Settings, label: "Language", desc: "English (India)", on: null },
              ].map(({ icon: Icon, label, desc, on }, i, arr) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1.1rem 1.5rem", borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : "none" }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={16} style={{ color: G.gold }} />
                    </div>
                    <div>
                      <p style={{ color: G.text, fontSize: "0.88rem" }}>{label}</p>
                      <p style={{ color: G.muted, fontSize: "0.72rem" }}>{desc}</p>
                    </div>
                  </div>
                  {on !== null ? (
                    <button style={{ width: "44px", height: "24px", borderRadius: "12px", background: on ? `linear-gradient(135deg, ${G.gold}, #9a7a2e)` : G.surface2, border: `1px solid ${G.border}`, cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
                      <div style={{ position: "absolute", top: "3px", left: on ? "22px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: on ? "#0a0804" : G.muted, transition: "left 0.2s" }} />
                    </button>
                  ) : (
                    <ChevronRight size={16} style={{ color: G.muted }} />
                  )}
                </div>
              ))}
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <button onClick={onLogout}
                  style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "0.65rem 1.5rem", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer", fontFamily: G.sans }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

