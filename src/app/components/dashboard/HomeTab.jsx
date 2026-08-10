import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Star, Phone, Mail, MapPin, Sparkles, TrendingUp, Gift, Award, CheckCircle, Crown } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import { toast } from "sonner";

const G = {
  bg: "#0a0804", surface: "rgba(20, 16, 10, 0.72)", surface2: "rgba(26, 20, 8, 0.55)",
  border: "rgba(201,168,76,0.18)", gold: "#c9a84c",
  text: "#f5ead6", muted: "#9a8060",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

/* Map home-card titles → EventsTab event names */
const FEATURED_EVENTS = [
  {
    title: "Grand Wedding Ceremony",
    date: "Available Now",
    img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=400&fit=crop&auto=format",
    tag: "Wedding",
    eventName: "Grand Wedding Ceremony",
  },
  {
    title: "Royal Birthday Party",
    date: "Book Anytime",
    img: "https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=600&h=400&fit=crop&auto=format",
    tag: "Birthday",
    eventName: "Royal Birthday Party",
  },
  {
    title: "Corporate Seminar",
    date: "Professional Setup",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&auto=format",
    tag: "Corporate",
    eventName: "Corporate Seminar",
  },
  {
    title: "Corporate Gala Dinner",
    date: "Premium Experience",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&auto=format",
    tag: "Corporate",
    eventName: "Corporate Gala Dinner",
  },
];

const OFFERS = [
  { icon: Gift,      title: "Early Bird Discount",  desc: "Book 3 months in advance and save up to 20% on any event.",      badge: "20% OFF" },
  { icon: Sparkles,  title: "Combo Package Deal",   desc: "Bundle decoration + catering + photography for exclusive pricing.", badge: "Bundle"  },
  { icon: TrendingUp,title: "Referral Bonus",       desc: "Refer a friend and earn ₹5,000 credit on your next booking.",      badge: "₹5,000"  },
];

const TESTIMONIALS = [
  { name: "Priya Sharma",   role: "Bride 2024",        rating: 5, text: "Vizhaa turned our wedding into a fairy tale. Every detail was pure perfection.",                   avatar: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=80&h=80&fit=crop&auto=format" },
  { name: "Rahul & Anjali", role: "Reception 2024",    rating: 5, text: "Found the perfect photographer, decorator, and caterer all in one place. Magical!",                   avatar: "https://images.unsplash.com/photo-1684868268327-7e5590bcfbd6?w=80&h=80&fit=crop&auto=format" },
  { name: "Meera Patel",    role: "Mother of Bride",   rating: 5, text: "400 guests, seamless RSVPs, and flawless digital invitations. Couldn't ask for more.",                avatar: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=80&h=80&fit=crop&auto=format" },
];

function SCard({ children, style = {} }) {
  return (
    <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", ...style }}>
      {children}
    </div>
  );
}

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

export default function HomeTab({ onNavigate, onEventClick }) {
  const [loyaltyLoading, setLoyaltyLoading] = useState(true);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [claimedIds, setClaimedIds] = useState(new Set());
  const [liveReviews, setLiveReviews] = useState([]);

  const loadLoyaltyData = async () => {
    try {
      setLoyaltyLoading(true);
      const sRes = await supabase.auth.getSession();
      const user = sRes.data?.session?.user;
      if (user) {
        const [profRes, bRes, sRes, cRes] = await Promise.allSettled([
          supabase.from("profiles").select("reward_points").eq("id", user.id).single(),
          supabase.from("bookings").select("id").eq("user_id", user.id),
          supabase.from("reward_schemes").select("*").eq("status", "Active"),
          supabase.from("reward_claims").select("scheme_id").eq("user_id", user.id),
        ]);

        const profData = profRes.status === "fulfilled" && !profRes.value.error ? profRes.value.data : null;
        const bData = bRes.status === "fulfilled" && !bRes.value.error ? bRes.value.data : [];
        const sData = sRes.status === "fulfilled" && !sRes.value.error ? sRes.value.data : [];
        const cData = cRes.status === "fulfilled" && !cRes.value.error ? cRes.value.data : [];

        setRewardPoints(profData?.reward_points || 0);
        setBookingsCount(bData.length);
        setClaimedIds(new Set(cData.map(c => c.scheme_id)));
        setEligibleSchemes(sData);
      }
    } catch (err) {
      console.warn("HomeTab loyalty details load error:", err);
    } finally {
      setLoyaltyLoading(false);
    }
  };

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  useEffect(() => {
    async function loadReviews() {
      try {
        const { data } = await supabase
          .from("reviews")
          .select("user_name, event_type, rating, text")
          .gte("rating", 4)
          .order("rating", { ascending: false })
          .limit(6);

        if (data && data.length > 0) {
          setLiveReviews(data);
        }
      } catch (e) {}
    }
    loadReviews();
  }, []);

  const handleClaimReward = async (schemeId, schemeName, schemeRewardPoints) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to claim rewards");
        return;
      }

      const { error: claimError } = await supabase
        .from("reward_claims")
        .insert([{ user_id: user.id, scheme_id: schemeId }]);

      if (claimError) {
        if (claimError.code === "23505") {
          toast.error("You have already claimed this reward scheme!");
        } else {
          throw claimError;
        }
        return;
      }

      const { error: profError } = await supabase
        .from("profiles")
        .update({ reward_points: rewardPoints + schemeRewardPoints })
        .eq("id", user.id);

      if (profError) throw profError;

      toast.success(`Congratulations! You claimed ${schemeRewardPoints} points for "${schemeName}"!`, {
        style: { background: G.surface2, border: `1px solid rgba(201,168,76,0.3)`, color: G.gold }
      });

      loadLoyaltyData();
    } catch (err) {
      console.error("Error claiming reward:", err);
      toast.error(err.message || "Failed to claim reward. Please try again.");
    }
  };

  return (
    <div style={{ padding: "0 0 3rem" }}>
      {/* Hero Banner */}
      <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=1400&h=500&fit=crop&auto=format"
          alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,8,4,0.82) 40%, rgba(10,8,4,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem 2.5rem" }}>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: G.script, color: G.gold, fontSize: "2rem", lineHeight: 1 }}>
            Welcome Back
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: G.serif, color: G.text, fontSize: "clamp(1.5rem,4vw,2.4rem)", fontWeight: 700, lineHeight: 1.2, maxWidth: "520px", margin: "0.25rem 0 0.75rem" }}>
            Plan Your Perfect <span style={{ color: G.gold, fontStyle: "italic" }}>Celebration</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            style={{ color: "rgba(245,234,214,0.7)", fontSize: "0.92rem", maxWidth: "400px", lineHeight: 1.7 }}>
            Explore events, book vendors, and manage every detail — all from your personal dashboard.
          </motion.p>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            onClick={() => onNavigate?.("events")}
            style={{ marginTop: "1.25rem", padding: "0.6rem 1.8rem", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", borderRadius: "4px", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.08em", cursor: "pointer", width: "fit-content", fontFamily: G.sans }}>
            Browse Events <ArrowRight size={14} style={{ display: "inline", marginLeft: "4px", verticalAlign: "middle" }} />
          </motion.button>
        </div>
      </div>

      <div style={{ padding: "2.5rem 2rem 0" }}>

        {/* Loyalty Program Section */}
        {!loyaltyLoading && (
          <div style={{ marginBottom: "3rem" }}>
            <SectionHead script="Vizhaa Club" title="Your Loyalty Rewards" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {/* Balance Card */}
              <div style={{ background: "linear-gradient(135deg, #1a1408, #14100a)", border: `1px solid ${G.gold}33`, borderRadius: "12px", padding: "1.5rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: `radial-gradient(circle, ${G.gold}1a 0%, transparent 70%)` }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                    <Crown size={24} style={{ color: G.gold }} />
                    <span style={{ color: G.gold, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Vizhaa Club Member</span>
                  </div>
                  <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.5rem", fontWeight: 700 }}>Your Points Balance</h3>
                  <p style={{ color: G.gold, fontSize: "2.4rem", fontWeight: 900, fontFamily: G.sans, margin: "0.5rem 0" }}>
                    {rewardPoints.toLocaleString()} <span style={{ fontSize: "1rem", fontWeight: 500, color: G.text }}>pts</span>
                  </p>
                </div>
                <p style={{ color: G.muted, fontSize: "0.8rem", margin: 0 }}>
                  Active Bookings: <strong>{bookingsCount}</strong> · Claim rewards below reach new milestones!
                </p>
              </div>

              {/* Claims Card list */}
              <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", fontWeight: 600, borderBottom: `1px solid ${G.border}`, paddingBottom: "0.5rem", margin: 0 }}>Available Milestones & Offers</p>
                
                {(() => {
                  const sortedSchemes = [...eligibleSchemes].sort((a, b) => {
                    const aEligible = rewardPoints >= a.min_redemption;
                    const bEligible = rewardPoints >= b.min_redemption;
                    const aClaimed = claimedIds.has(a.id);
                    const bClaimed = claimedIds.has(b.id);

                    if (aClaimed && !bClaimed) return 1;
                    if (!aClaimed && bClaimed) return -1;
                    if (aEligible && !bEligible) return -1;
                    if (!aEligible && bEligible) return 1;
                    return a.min_redemption - b.min_redemption;
                  });

                  if (sortedSchemes.length === 0) {
                    return <p style={{ color: G.muted, fontSize: "0.85rem", textAlign: "center", margin: "1rem 0" }}>No loyalty rewards available at the moment.</p>;
                  }

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "200px", overflowY: "auto", scrollbarWidth: "none" }}>
                      {sortedSchemes.map((s) => {
                        const isEligible = rewardPoints >= s.min_redemption;
                        const isClaimed = claimedIds.has(s.id);

                        return (
                          <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "0.5rem 0", borderBottom: `1px solid ${G.border}44` }}>
                            <div>
                              <p style={{ color: G.text, fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>{s.name}</p>
                              <p style={{ color: G.muted, fontSize: "0.72rem", margin: "2px 0 0" }}>
                                {s.reward_points} pts · Requires {s.min_redemption} points
                              </p>
                            </div>
                            
                            {isClaimed ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#4ade80", fontSize: "0.75rem", fontWeight: 600 }}>
                                <CheckCircle size={14} /> Claimed
                              </span>
                            ) : isEligible ? (
                              <button
                                onClick={() => handleClaimReward(s.id, s.name, s.reward_points)}
                                style={{ padding: "0.4rem 1rem", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}
                              >
                                Claim
                              </button>
                            ) : (
                              <span style={{ color: G.muted, fontSize: "0.72rem", fontStyle: "italic" }}>
                                Locked (Need {s.min_redemption - rewardPoints} more)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Featured Events */}
        <SectionHead script="Handpicked for You" title="Featured Events" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {FEATURED_EVENTS.map((ev, i) => (
            <motion.div
              key={ev.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => onEventClick?.(ev.eventName)}
              style={{
                background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px",
                overflow: "hidden", cursor: "pointer", transition: "border-color 0.25s, transform 0.2s",
              }}
              whileHover={{ y: -4 }}
              onMouseEnter={(e) => { (e.currentTarget).style.borderColor = "rgba(201,168,76,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.borderColor = G.border; }}
            >
              <div style={{ position: "relative" }}>
                <img src={ev.img} alt={ev.title} style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.6) 0%, transparent 60%)" }} />
                <span style={{ position: "absolute", top: "10px", left: "10px", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", padding: "2px 10px", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 700 }}>
                  {ev.tag}
                </span>
              </div>
              <div style={{ padding: "1rem" }}>
                <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", marginBottom: "0.3rem" }}>{ev.title}</h3>
                <p style={{ color: G.muted, fontSize: "0.78rem", marginBottom: "0.85rem" }}>{ev.date}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); onEventClick?.(ev.eventName); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804",
                    border: "none", padding: "0.55rem", borderRadius: "5px",
                    fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans,
                  }}
                >
                  Book Now <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Latest Offers */}
        <SectionHead script="Exclusive Deals" title="Latest Offers" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {OFFERS.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <motion.div key={offer.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <SCard style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(201,168,76,0.1)", border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} style={{ color: G.gold }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center justify-between gap-2">
                      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem" }}>{offer.title}</h3>
                      <span style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", padding: "2px 8px", borderRadius: "99px", fontSize: "0.65rem", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>{offer.badge}</span>
                    </div>
                    <p style={{ color: G.muted, fontSize: "0.82rem", lineHeight: 1.6, marginTop: "0.4rem" }}>{offer.desc}</p>
                  </div>
                </SCard>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <SectionHead script="Kind Words" title="What Our Clients Say" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {(liveReviews.length > 0 ? liveReviews : TESTIMONIALS).map((t, i) => {
            const name = t.user_name ?? t.name;
            const role = t.event_type ?? t.role;
            const rating = t.rating;
            const text = t.text;
            const avatar = t.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c9a84c&color=0a0804&size=80`;
            return (
              <motion.div key={`review-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <SCard style={{ padding: "1.5rem" }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: "1rem" }}>
                    <img src={avatar} alt={name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${G.gold}` }} />
                    <div>
                      <p style={{ color: G.text, fontSize: "0.88rem", fontWeight: 600, fontFamily: G.serif }}>{name}</p>
                      <p style={{ color: G.muted, fontSize: "0.72rem" }}>{role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1" style={{ marginBottom: "0.75rem" }}>
                    {Array.from({ length: rating }).map((_, j) => <Star key={j} size={13} style={{ color: G.gold, fill: G.gold }} />)}
                  </div>
                  <p style={{ color: "rgba(245,234,214,0.75)", fontSize: "0.85rem", lineHeight: 1.75, fontStyle: "italic" }}>"{text}"</p>
                </SCard>
              </motion.div>
            );
          })}
        </div>

        {/* Contact */}
        <SectionHead script="Reach Us" title="Contact Information" />
        <SCard style={{ padding: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: Phone, label: "Phone",   value: "+91 63811 39837" },
              { icon: Mail,  label: "Email",   value: "hello@vizhaa.in" },
              { icon: MapPin,label: "Address", value: "Erode, Tamilnadu" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(201,168,76,0.1)", border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} style={{ color: G.gold }} />
                </div>
                <div>
                  <p style={{ color: G.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                  <p style={{ color: G.text, fontSize: "0.88rem", marginTop: "2px" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </SCard>
      </div>
    </div>
  );
}

