import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, ArrowRight, ChevronLeft, CalendarDays, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import confetti from "canvas-confetti";

const G = {
  bg: "#0a0804",
  surface: "rgba(20, 16, 10, 0.72)",
  surface2: "rgba(26, 20, 8, 0.55)",
  border: "rgba(201,168,76,0.18)",
  gold: "#c9a84c",
  goldLight: "#e8cc84",
  text: "#f5ead6",
  muted: "#9a8060",
  serif: "'Playfair Display', serif",
  sans: "'Raleway', sans-serif",
  script: "'Great Vibes', cursive",
};

interface PackageTier {
  name: string;
  price: string;
  includes_note?: string;
  features: string[];
}

interface EventPackage {
  id?: string;
  name: string;
  img: string;
  tiers: PackageTier[];
}

const DEFAULT_PACKAGES: EventPackage[] = [
  {
    name: "Wedding Packages",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹2,00,000 – ₹5,00,000",
        features: ["Venue Assistance", "Basic Stage Decoration", "Floral Decoration", "Basic Photography", "Standard Videography", "Standard Catering", "Basic Sound System", "Digital Invitation", "Guest Seating Arrangement", "Event Coordinator"]
      },
      {
        name: "Gold Package",
        price: "₹5,00,000 – ₹10,00,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["Premium Theme Decoration", "Professional Photography", "Cinematic Videography", "Deluxe Catering", "DJ & Entertainment", "Bridal Room Setup", "Printed Invitations", "Guest Management", "Dedicated Supervisor", "Real-Time Event Tracking"]
      },
      {
        name: "Platinum Package",
        price: "₹10,00,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Venue", "Designer Stage Decoration", "Drone Photography", "Premium Multi-Cuisine Catering", "Live Music & Entertainment", "Bridal & Groom Grand Entry", "Guest Accommodation", "Transportation", "Luxury Floral Decoration", "Complete End-to-End Event Management"]
      }
    ]
  },
  {
    name: "Engagement Packages",
    img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹50,000 – ₹1,50,000",
        features: ["Venue Assistance", "Basic Decoration", "Photography", "Catering", "Sound System", "Digital Invitation"]
      },
      {
        name: "Gold Package",
        price: "₹1,50,000 – ₹3,00,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["Theme Decoration", "Professional Photography", "Videography", "DJ", "LED Screen", "Dedicated Supervisor", "Real-Time Tracking"]
      },
      {
        name: "Platinum Package",
        price: "₹3,00,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Decoration", "Drone Photography", "Premium Catering", "Live Entertainment", "Guest Management", "VIP Seating", "Complete Event Coordination"]
      }
    ]
  },
  {
    name: "Birthday Party Packages",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹20,000 – ₹50,000",
        features: ["Balloon Decoration", "Theme Backdrop", "Birthday Cake", "Photography", "Snacks & Refreshments", "Sound System"]
      },
      {
        name: "Gold Package",
        price: "₹50,000 – ₹1,00,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["Customized Theme Decoration", "Professional Photography", "DJ", "Buffet Catering", "Return Gifts", "Event Supervisor"]
      },
      {
        name: "Platinum Package",
        price: "₹1,00,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Theme Setup", "Designer Cake", "Kids Entertainment", "Live Performers", "Premium Buffet", "Real-Time Tracking"]
      }
    ]
  },
  {
    name: "Baby Shower Packages",
    img: "https://images.unsplash.com/photo-1597294150753-b6e790b68d1c?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹25,000 – ₹60,000",
        features: ["Balloon Decoration", "Floral Decoration", "Photography", "Catering", "Welcome Board"]
      },
      {
        name: "Gold Package",
        price: "₹60,000 – ₹1,50,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["Theme Decoration", "Professional Photography", "Return Gifts", "Games Host", "Dedicated Supervisor"]
      },
      {
        name: "Platinum Package",
        price: "₹1,50,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Floral Setup", "Cinematic Video", "Premium Catering", "Premium Return Gifts", "Real-Time Tracking"]
      }
    ]
  },
  {
    name: "Ear Piercing Ceremony Packages",
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹15,000 – ₹40,000",
        features: ["Basic Decoration", "Photography", "Catering", "Seating Arrangement"]
      },
      {
        name: "Gold Package",
        price: "₹40,000 – ₹80,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["Theme Decoration", "Professional Photography", "Return Gifts", "Dedicated Supervisor"]
      },
      {
        name: "Platinum Package",
        price: "₹80,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Decoration", "Premium Catering", "Premium Photography", "Real-Time Tracking"]
      }
    ]
  },
  {
    name: "Puberty Function Packages",
    img: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹50,000 – ₹1,00,000",
        features: ["Stage Decoration", "Floral Decoration", "Photography", "Catering", "Sound System"]
      },
      {
        name: "Gold Package",
        price: "₹1,00,000 – ₹3,00,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["Theme Decoration", "Professional Photography", "DJ", "Invitation Cards", "Dedicated Supervisor"]
      },
      {
        name: "Platinum Package",
        price: "₹3,00,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Stage", "Drone Photography", "Premium Catering", "Live Entertainment", "Real-Time Tracking"]
      }
    ]
  },
  {
    name: "Housewarming Packages",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹20,000 – ₹60,000",
        features: ["Entrance Decoration", "Floral Decoration", "Photography", "Catering"]
      },
      {
        name: "Gold Package",
        price: "₹60,000 – ₹1,50,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["Theme Decoration", "Professional Photography", "Return Gifts", "Dedicated Supervisor"]
      },
      {
        name: "Platinum Package",
        price: "₹1,50,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Decoration", "Premium Catering", "Guest Management", "Real-Time Tracking"]
      }
    ]
  },
  {
    name: "Anniversary Packages",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹30,000 – ₹80,000",
        features: ["Decoration", "Cake", "Photography", "Catering"]
      },
      {
        name: "Gold Package",
        price: "₹80,000 – ₹2,00,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["Theme Decoration", "Professional Photography", "DJ", "Return Gifts", "Dedicated Supervisor"]
      },
      {
        name: "Platinum Package",
        price: "₹2,00,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Decoration", "Premium Buffet", "Live Band", "Cinematic Video", "Real-Time Tracking"]
      }
    ]
  },
  {
    name: "Corporate Event Packages",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop&auto=format",
    tiers: [
      {
        name: "Silver Package",
        price: "₹50,000 – ₹2,00,000",
        features: ["Venue Arrangement", "Stage Setup", "Audio System", "Tea & Snacks", "Registration Desk"]
      },
      {
        name: "Gold Package",
        price: "₹2,00,000 – ₹5,00,000",
        includes_note: "Includes everything in Silver, plus:",
        features: ["LED Screen", "Professional Photography", "Buffet Lunch", "Branding Materials", "Dedicated Supervisor"]
      },
      {
        name: "Platinum Package",
        price: "₹5,00,000+",
        includes_note: "Includes everything in Gold, plus:",
        features: ["Luxury Venue", "Multi-Screen Setup", "Premium Catering", "Live Streaming", "VIP Guest Management", "Real-Time Event Tracking", "Complete Event Management"]
      }
    ]
  }
];

function SectionHead({ script, title }: { script: string; title: string }) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
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

function parseStartingPrice(priceStr: string): number {
  const part = priceStr.split(/[–-]/)[0] || "";
  const clean = part.replace(/[^\d]/g, "");
  return Number(clean) || 50000;
}

export default function PackagesTab() {
  const [categories, setCategories] = useState<EventPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // User navigation state
  const [selectedCategory, setSelectedCategory] = useState<EventPackage | null>(null);
  const [selectedTier, setSelectedTier] = useState<PackageTier | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Booking fields state
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [advancePaymentOption, setAdvancePaymentOption] = useState<"50" | "100">("50");
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [createdBookingDetails, setCreatedBookingDetails] = useState<any>(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("event_packages")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Fallback to local default list
        setCategories(DEFAULT_PACKAGES);
      }
    } catch (e) {
      console.warn("Could not fetch packages from DB, using fallback defaults:", e);
      setCategories(DEFAULT_PACKAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();

    // Subscribe to realtime changes of event_packages table
    const channel = supabase
      .channel("user-packages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "event_packages" }, () => {
        fetchPackages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSelectCategory = (cat: EventPackage) => {
    setSelectedCategory(cat);
    setSelectedTier(null);
    setShowCheckout(false);
  };

  const handleSelectTierForBooking = (tier: PackageTier) => {
    setSelectedTier(tier);
    setShowCheckout(true);
    // Reset booking fields
    setEventDate("");
    setEventTime("");
    setGuestCount("");
    setVenueLocation("");
    setAdvancePaymentOption("50");
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedTier) return;
    if (!eventDate) {
      alert("Event date is required.");
      return;
    }

    setSubmittingBooking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to submit a booking.");
        setSubmittingBooking(false);
        return;
      }

      const startingPrice = parseStartingPrice(selectedTier.price);
      const paidAmount = advancePaymentOption === "50" ? startingPrice * 0.5 : startingPrice;

      const details = {
        package_info: {
          categoryName: selectedCategory.name,
          packageName: selectedTier.name,
          priceRange: selectedTier.price,
          features: selectedTier.features
        },
        payment_option: advancePaymentOption === "50" ? "50% Advance" : "100% Full",
        tracking_preparation: "Pending",
        tracking_setup: "Pending",
        tracking_execution: "Pending",
        timestamp: new Date().toISOString()
      };

      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          event_name: `${selectedCategory.name} - ${selectedTier.name}`,
          event_date: eventDate,
          event_time: eventTime || null,
          guests_count: Number(guestCount) || null,
          venue: venueLocation || "TBD",
          status: "Pending",
          amount: `₹${startingPrice.toLocaleString("en-IN")}`,
          paid: `₹${paidAmount.toLocaleString("en-IN")}`,
          services: [selectedTier.name],
          details: details
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Insert payment record
      const paymentId = "PMT-" + Math.floor(Math.random() * 100000000);
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          id: paymentId,
          user_id: user.id,
          booking_id: bookingData.id,
          date: new Date().toLocaleDateString("en-IN"),
          amount: `₹${paidAmount.toLocaleString("en-IN")}`,
          status: "Paid",
          method: "Online Card Payment"
        });

      if (paymentError) {
        console.error("Failed to insert payment record:", paymentError.message);
      }

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      setCreatedBookingDetails({
        categoryName: selectedCategory.name,
        packageName: selectedTier.name,
        date: eventDate,
        time: eventTime,
        venue: venueLocation || "TBD",
        guests: guestCount || "TBD",
        amount: startingPrice,
        paid: paidAmount
      });
      setBookingSuccess(true);
    } catch (err: any) {
      console.error("Error creating booking:", err);
      alert("Failed to submit booking: " + err.message);
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedTier(null);
    setShowCheckout(false);
    setBookingSuccess(false);
    setCreatedBookingDetails(null);
  };

  if (loading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <p style={{ color: G.muted, fontSize: "0.95rem" }}>Loading packages details...</p>
      </div>
    );
  }

  // Success Screen
  if (bookingSuccess && createdBookingDetails) {
    return (
      <div style={{ padding: "3rem 2rem", background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "14px", textAlign: "center", maxWidth: "600px", margin: "2rem auto" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: `2px solid ${G.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <CheckCircle size={32} style={{ color: G.gold }} />
        </div>
        <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.8rem", fontWeight: 700, margin: "0 0 0.5rem" }}>Booking Submitted Successfully!</h2>
        <p style={{ color: G.muted, fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Your package booking for <strong style={{ color: G.text }}>{createdBookingDetails.categoryName}</strong> has been received and is currently under review by our coordinators.
        </p>

        <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1.5rem", textAlign: "left", marginBottom: "2rem" }}>
          <p style={{ color: G.gold, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1rem" }}>Booking Summary</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.92rem", color: G.text }}>
            <div><span style={{ color: G.muted }}>Plan:</span> {createdBookingDetails.categoryName} ({createdBookingDetails.packageName})</div>
            <div><span style={{ color: G.muted }}>Date:</span> {createdBookingDetails.date} {createdBookingDetails.time && `@ ${createdBookingDetails.time}`}</div>
            <div><span style={{ color: G.muted }}>Venue:</span> {createdBookingDetails.venue}</div>
            <div><span style={{ color: G.muted }}>Guests:</span> {createdBookingDetails.guests}</div>
            <div style={{ height: "1px", background: G.border, margin: "4px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
              <span>Total Cost (Start):</span>
              <span style={{ color: G.gold }}>₹{createdBookingDetails.amount.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.95rem" }}>
              <span>Paid Advance:</span>
              <span style={{ color: G.gold }}>₹{createdBookingDetails.paid.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <button onClick={handleReset}
          style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.8rem 2.5rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>
          Back to Packages
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <style>{`
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .package-card {
          background: ${G.surface};
          border: 1px solid ${G.border};
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease-in-out;
        }
        .package-card:hover {
          transform: translateY(-4px);
          border-color: rgba(201,168,76,0.45);
          box-shadow: 0 10px 25px rgba(201,168,76,0.08);
        }
        .package-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .package-card:hover img {
          transform: scale(1.04);
        }
        .tier-card {
          background: ${G.surface};
          border: 1px solid ${G.border};
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        .tier-card.highlight {
          border-color: ${G.gold};
          box-shadow: 0 0 35px rgba(201,168,76,0.12);
          transform: scale(1.02);
        }
      `}</style>

      <AnimatePresence mode="wait">
        {/* CHECKOUT FLOW */}
        {showCheckout && selectedCategory && selectedTier ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "14px", padding: "2rem", maxWidth: "800px", margin: "0 auto 3rem" }}
          >
            <button
              onClick={() => setShowCheckout(false)}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: G.gold, cursor: "pointer", fontFamily: G.sans, fontSize: "0.85rem", marginBottom: "1.5rem", padding: 0 }}
            >
              <ChevronLeft size={16} /> Back to Package Tiers
            </button>

            <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.4rem", fontWeight: 700, margin: "0 0 1.5rem", borderBottom: `1px solid ${G.border}`, paddingBottom: "0.5rem" }}>
              Book {selectedCategory.name} - {selectedTier.name}
            </h3>

            <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1.25rem", marginBottom: "2rem" }}>
              <p style={{ color: G.gold, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Included Features:</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
                {selectedTier.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", color: G.text, fontSize: "0.8rem" }}>
                    <Check size={12} style={{ color: G.gold }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.15rem", fontWeight: 700, margin: "0 0 1rem" }}>Provide Event Details</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Event Category</label>
                  <input readOnly type="text" value={selectedCategory.name} style={{ width: "100%", padding: "0.65rem 0.9rem", background: "rgba(10,8,4,0.4)", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Package Tier</label>
                  <input readOnly type="text" value={selectedTier.name} style={{ width: "100%", padding: "0.65rem 0.9rem", background: "rgba(10,8,4,0.4)", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Event Date *</label>
                  <input required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Event Time</label>
                  <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Guest Count</label>
                  <input type="number" placeholder="e.g. 150" value={guestCount} onChange={e => setGuestCount(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Venue Location / Name</label>
                  <input placeholder="e.g. Grand Palace Hall, Mumbai" value={venueLocation} onChange={e => setVenueLocation(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Payment Advance Option */}
              <div style={{ background: "rgba(201,168,76,0.05)", border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1.25rem", marginBottom: "1.5rem" }}>
                <p style={{ color: G.text, fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.75rem" }}>Choose Payment Term</p>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: G.text, fontSize: "0.82rem" }}>
                    <input type="radio" name="paymentOption" checked={advancePaymentOption === "50"} onChange={() => setAdvancePaymentOption("50")} style={{ accentColor: G.gold }} />
                    <span>Pay 50% Advance Booking Fee (₹{(parseStartingPrice(selectedTier.price) * 0.5).toLocaleString("en-IN")})</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: G.text, fontSize: "0.82rem" }}>
                    <input type="radio" name="paymentOption" checked={advancePaymentOption === "100"} onChange={() => setAdvancePaymentOption("100")} style={{ accentColor: G.gold }} />
                    <span>Pay 100% Full Amount (₹{parseStartingPrice(selectedTier.price).toLocaleString("en-IN")})</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${G.border}`, paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
                <div>
                  <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>Package Price Range</h4>
                  <p style={{ color: G.muted, fontSize: "0.78rem", margin: "2px 0 0" }}>Starting price used for calculations</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.6rem", fontWeight: 700 }}>{selectedTier.price}</span>
                  <p style={{ color: G.muted, fontSize: "0.7rem", margin: 0 }}>Starting calculated base: ₹{parseStartingPrice(selectedTier.price).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingBooking}
                style={{ width: "100%", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.85rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: submittingBooking ? "not-allowed" : "pointer", fontFamily: G.sans, opacity: submittingBooking ? 0.7 : 1 }}
              >
                {submittingBooking ? "Processing booking payment..." : "Confirm & Pay Booking Amount"}
              </button>
            </form>
          </motion.div>
        ) : selectedCategory ? (
          /* COMPARISON VIEW OF THREE TIERS */
          <motion.div
            key="category-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: G.gold, cursor: "pointer", fontFamily: G.sans, fontSize: "0.85rem", marginBottom: "1.5rem", padding: 0 }}
            >
              <ChevronLeft size={16} /> Back to Event Categories
            </button>

            {/* Banner */}
            <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", marginBottom: "2rem", height: "200px" }}>
              <img src={selectedCategory.img} alt={selectedCategory.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.9), rgba(10,8,4,0.3) 50%, rgba(10,8,4,0.7) 100%)" }} />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.4rem", lineHeight: 1 }}>Vizhaa Premium Plans</p>
                <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "2rem", fontWeight: 700, margin: "4px 0 0" }}>{selectedCategory.name}</h2>
              </div>
            </div>

            {/* 3 columns of tiers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", alignItems: "stretch" }}>
              {selectedCategory.tiers.map((tier, idx) => {
                // Gold is the middle one and we highlight it
                const isGold = tier.name.toLowerCase().includes("gold");
                const colorCode = tier.name.toLowerCase().includes("silver") ? "#94a3b8" : tier.name.toLowerCase().includes("gold") ? G.gold : "#e2e8f0";

                return (
                  <div key={tier.name} className={`tier-card ${isGold ? "highlight" : ""}`} style={{ display: "flex", flexDirection: "column" }}>
                    {isGold && (
                      <div style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, padding: "6px 0", textAlign: "center" }}>
                        <span style={{ color: "#0a0804", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                          Most Popular Choice
                        </span>
                      </div>
                    )}
                    <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                      <div>
                        {/* Header */}
                        <div style={{ marginBottom: "1.25rem" }}>
                          <span style={{ color: colorCode, fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
                            {tier.name.includes("Silver") ? "🥉 Silver Tier" : tier.name.includes("Gold") ? "🥈 Gold Tier" : "🥇 Platinum Tier"}
                          </span>
                          <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.5rem", fontWeight: 700, marginTop: "4px" }}>{tier.name}</h3>
                          <p style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.6rem", fontWeight: 700, margin: "6px 0" }}>{tier.price}</p>
                          <div style={{ height: "1px", background: G.border, margin: "12px 0 0" }} />
                        </div>

                        {/* Note */}
                        {tier.includes_note && (
                          <p style={{ color: G.goldLight, fontSize: "0.8rem", fontWeight: 600, fontStyle: "italic", marginBottom: "0.75rem" }}>
                            {tier.includes_note}
                          </p>
                        )}

                        {/* Features */}
                        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                          {tier.features.map(f => (
                            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.25)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                                <Check size={8} style={{ color: G.gold }} />
                              </div>
                              <span style={{ color: G.muted, fontSize: "0.82rem", lineHeight: 1.4 }}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectTierForBooking(tier)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          background: isGold ? `linear-gradient(135deg, ${G.gold}, #9a7a2e)` : "transparent",
                          border: `1px solid ${isGold ? G.gold : G.border}`,
                          color: isGold ? "#0a0804" : G.gold,
                          padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                          fontFamily: G.sans, transition: "all 0.2s",
                        }}
                      >
                        Book {tier.name} <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* EVENT TYPES GRID */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SectionHead script="Pick Your Occasion" title="Event Packages" />
            <p style={{ color: G.muted, fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "560px", marginBottom: "2.5rem" }}>
              Explore luxury all-inclusive packages tailored for your special occasions. Choose from Silver, Gold, or Platinum tiers and book with ease.
            </p>

            <div className="packages-grid">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  className="package-card"
                  onClick={() => handleSelectCategory(cat)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                    <img src={cat.img} alt={cat.name} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.85) 0%, rgba(10,8,4,0.1) 60%)" }} />
                    <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
                      <span style={{ color: G.gold, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Exclusive Plans</span>
                      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", fontWeight: 700, margin: "2px 0 0 0" }}>{cat.name}</h3>
                    </div>
                  </div>
                  <div style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: G.muted, fontSize: "0.78rem" }}>3 Packages (Silver, Gold, Platinum)</span>
                    <span style={{ color: G.gold, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "3px" }}>
                      View Details <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
