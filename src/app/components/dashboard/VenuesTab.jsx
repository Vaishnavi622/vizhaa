import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const G = {
  surface: "rgba(20, 16, 10, 0.72)", border: "rgba(201,168,76,0.18)", gold: "#c9a84c",
  text: "#f5ead6", muted: "#9a8060",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

const VENUES = {
  "Marriage Halls": [
    { name: "The Maharaja Grand Hall", location: "Andheri West, Mumbai", capacity: "200–1500", price: "₹1,50,000/day", rating: 4.9, img: "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?w=600&h=380&fit=crop&auto=format", tags: ["AC", "Parking", "Catering", "Stage"], avail: "Available" },
    { name: "Regal Celebrations Banquet", location: "Juhu, Mumbai", capacity: "100–800", price: "₹90,000/day", rating: 4.7, img: "https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=600&h=380&fit=crop&auto=format", tags: ["AC", "In-house Decor", "DJ"], avail: "Available" },
    { name: "Shubh Vivah Hall", location: "Borivali, Mumbai", capacity: "150–600", price: "₹65,000/day", rating: 4.6, img: "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=600&h=380&fit=crop&auto=format", tags: ["Valet", "Bridal Room", "Catering"], avail: "Available" },
  ],
  "Convention Centers": [
    { name: "Mumbai Convention Expo", location: "BKC, Mumbai", capacity: "500–5000", price: "₹5,00,000/day", rating: 4.8, img: "https://images.unsplash.com/photo-1780542785051-2e320486c71d?w=600&h=380&fit=crop&auto=format", tags: ["Multi-Hall", "AV System", "Breakout Rooms"], avail: "Available" },
    { name: "Olympia Grand Center", location: "Lower Parel, Mumbai", capacity: "300–2000", price: "₹2,50,000/day", rating: 4.7, img: "https://images.unsplash.com/photo-1759730840961-09faa5731a3b?w=600&h=380&fit=crop&auto=format", tags: ["Stage", "LED Walls", "F&B"], avail: "Available" },
  ],
  "Resorts": [
    { name: "Aamby Valley Resort", location: "Lonavala, Pune", capacity: "50–500", price: "₹3,00,000/day", rating: 4.9, img: "https://images.unsplash.com/photo-1729957385579-528ce50ffd94?w=600&h=380&fit=crop&auto=format", tags: ["Pool", "Lawn", "Rooms", "Spa"], avail: "Available" },
    { name: "Della Adventure Resort", location: "Khopoli, Maharashtra", capacity: "100–800", price: "₹4,00,000/day", rating: 4.8, img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=600&h=380&fit=crop&auto=format", tags: ["Adventure", "Poolside", "Rooms", "Catering"], avail: "Available" },
  ],
  "Hotels": [
    { name: "The Oberoi Mumbai", location: "Nariman Point, Mumbai", capacity: "50–600", price: "₹4,50,000/day", rating: 5.0, img: "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?w=600&h=380&fit=crop&auto=format", tags: ["5 Star", "Luxury", "Sea View", "Butler"], avail: "Available" },
    { name: "JW Marriott Juhu", location: "Juhu, Mumbai", capacity: "100–800", price: "₹3,50,000/day", rating: 4.9, img: "https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=600&h=380&fit=crop&auto=format", tags: ["Beachfront", "Multi-Hall", "Gourmet"], avail: "Booked" },
    { name: "Taj Lands End", location: "Bandra, Mumbai", capacity: "80–500", price: "₹3,00,000/day", rating: 4.9, img: "https://images.unsplash.com/photo-1780542785051-2e320486c71d?w=600&h=380&fit=crop&auto=format", tags: ["Heritage", "Sea View", "Fine Dining"], avail: "Available" },
  ],
  "Outdoor Venues": [
    { name: "Bandra Fort Lawns", location: "Bandra, Mumbai", capacity: "100–2000", price: "₹2,00,000/day", rating: 4.8, img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=380&fit=crop&auto=format", tags: ["Open Air", "Sea View", "Tent Allowed"], avail: "Available" },
    { name: "Powai Lake Gardens", location: "Powai, Mumbai", capacity: "50–500", price: "₹1,20,000/day", rating: 4.6, img: "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=600&h=380&fit=crop&auto=format", tags: ["Lake View", "Greenery", "Sunset Spot"], avail: "Available" },
  ],
};

const TABS = ["Marriage Halls", "Convention Centers", "Resorts", "Hotels", "Outdoor Venues"];

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

export default function VenuesTab() {
  const [active, setActive] = useState("Marriage Halls");
  const [dbVenues, setDbVenues] = useState({
    "Marriage Halls": [],
    "Convention Centers": [],
    "Resorts": [],
    "Hotels": [],
    "Outdoor Venues": []
  });
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState("");

  const getVenuesSource = () => {
    const hasAnyDbVenues = Object.values(dbVenues).some(arr => arr.length > 0);
    return hasAnyDbVenues ? dbVenues : VENUES;
  };

  const currentVenuesSource = getVenuesSource();

  const isNearUser = (venueLocation) => {
    if (!userAddress) return false;
    const addressParts = userAddress
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(p => p.length > 2);
    if (addressParts.length === 0) return false;
    const locationLower = venueLocation.toLowerCase();
    return addressParts.some(part => locationLower.includes(part));
  };

  const sortedVenues = [...(currentVenuesSource[active] || [])].sort((a, b) => {
    const aNear = isNearUser(a.location);
    const bNear = isNearUser(b.location);
    if (aNear && !bNear) return -1;
    if (!aNear && bNear) return 1;
    return 0;
  });

  useEffect(() => {
    const fetchUserProfileAndVenues = async () => {
      try {
        // Fetch current authenticated user's address from profiles
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (user) {
          const { data: profData, error: profError } = await supabase
            .from("profiles")
            .select("address")
            .eq("id", user.id)
            .single();
          if (!profError && profData && profData.address) {
            setUserAddress(profData.address);
          }
        }

        // Fetch DB venues
        const { data, error } = await supabase
          .from("venues")
          .select("*")
          .order("name", { ascending: true });

        if (!error && data && data.length > 0) {
          const grouped = {
            "Marriage Halls": [],
            "Convention Centers": [],
            "Resorts": [],
            "Hotels": [],
            "Outdoor Venues": []
          };
          data.forEach((item) => {
            const cat = item.type;
            if (grouped[cat]) {
              grouped[cat].push({
                name: item.name,
                location: item.city,
                capacity: item.capacity,
                price: item.price,
                avail: item.avail,
                rating: item.rating || 4.8,
                img: item.img || "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?w=600&h=380&fit=crop&auto=format",
                tags: item.features || [],
                media_type: item.media_type || "image"
              });
            }
          });
          setDbVenues(grouped);
        }
      } catch (err) {
        console.error("Error loading db venues or user address:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfileAndVenues();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: G.gold }}>
        <p style={{ fontFamily: G.serif, fontSize: "1.2rem" }}>Loading venues...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <SectionHead script="Find Your Space" title="Venues" />
      {/* Category tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActive(t)}
            style={{ padding: "0.45rem 1.1rem", border: `1px solid ${active === t ? G.gold : G.border}`, background: active === t ? "rgba(201,168,76,0.14)" : "transparent", color: active === t ? G.gold : G.muted, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontFamily: G.sans, fontWeight: active === t ? 600 : 400, transition: "all 0.2s" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <AnimatePresence mode="wait">
          {sortedVenues.map((v, i) => (
            <motion.div key={v.name}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.08 }}
              style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.25s" }}
              onMouseEnter={(e) => { (e.currentTarget).style.borderColor = "rgba(201,168,76,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.borderColor = G.border; }}>
              <div style={{ position: "relative" }}>
                {v.media_type === "video" ? (
                  <video src={v.img} autoPlay loop muted playsInline style={{ width: "100%", height: "175px", objectFit: "cover", display: "block" }} />
                ) : (
                  <img src={v.img} alt={v.name} style={{ width: "100%", height: "175px", objectFit: "cover", display: "block" }} />
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.65), transparent 55%)" }} />
                <div style={{ position: "absolute", top: "10px", left: "12px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {v.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ background: "rgba(10,8,4,0.7)", backdropFilter: "blur(4px)", color: G.gold, padding: "2px 8px", borderRadius: "99px", fontSize: "0.65rem", border: `1px solid rgba(201,168,76,0.3)` }}>{tag}</span>
                  ))}
                </div>
                <div style={{ position: "absolute", top: "10px", right: "12px" }}>
                  <span style={{ background: v.avail === "Available" ? "rgba(74,222,128,0.85)" : "rgba(201,168,76,0.85)", backdropFilter: "blur(4px)", color: v.avail === "Available" ? "#0a0804" : "#f5ead6", padding: "2px 10px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 700 }}>
                    {v.avail}
                  </span>
                </div>
                {/* Recommended Badge */}
                {isNearUser(v.location) && (
                  <div style={{ position: "absolute", bottom: "10px", left: "12px" }}>
                    <span style={{ background: "rgba(201,168,76,0.9)", backdropFilter: "blur(4px)", color: "#0a0804", padding: "3px 10px", borderRadius: "99px", fontSize: "0.68rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                      <MapPin size={10} /> Recommended Near You
                    </span>
                  </div>
                )}
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div className="flex items-start justify-between gap-2" style={{ marginBottom: "0.3rem" }}>
                  <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem" }}>{v.name}</h3>
                  <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
                    <Star size={13} style={{ color: G.gold, fill: G.gold }} />
                    <span style={{ color: G.gold, fontSize: "0.78rem", fontWeight: 600 }}>{v.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1" style={{ marginBottom: "0.6rem" }}>
                  <MapPin size={13} style={{ color: G.muted }} />
                  <span style={{ color: G.muted, fontSize: "0.78rem" }}>{v.location}</span>
                </div>
                <div className="flex items-center gap-1" style={{ marginBottom: "1rem" }}>
                  <Users size={13} style={{ color: G.muted }} />
                  <span style={{ color: G.muted, fontSize: "0.78rem" }}>Capacity: {v.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: G.gold, fontWeight: 700, fontSize: "0.95rem" }}>{v.price}</span>
                  <button disabled={v.avail === "Booked"} style={{ display: "flex", alignItems: "center", gap: "5px", background: v.avail === "Booked" ? "rgba(201,168,76,0.1)" : `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: v.avail === "Booked" ? G.muted : "#0a0804", border: v.avail === "Booked" ? `1px solid ${G.border}` : "none", padding: "6px 14px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: v.avail === "Booked" ? "not-allowed" : "pointer", fontFamily: G.sans, transition: "all 0.2s" }}>
                    {v.avail === "Booked" ? "Booked" : "Check Availability"} <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

