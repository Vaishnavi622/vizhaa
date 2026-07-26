import { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Users, Wallet, Camera, Star, Clock, Bell, Shield, Image, Sparkles,
  Heart, ChevronDown, Menu, X, Quote, ArrowRight, Phone, Mail, MapPin, Instagram,
  Facebook, Twitter, Youtube
} from "lucide-react";
import DashboardLayout, { type TabId } from "./components/dashboard/DashboardLayout";
import HomeTab from "./components/dashboard/HomeTab";
import EventsTab from "./components/dashboard/EventsTab";
import ServicesTab from "./components/dashboard/ServicesTab";
import VenuesTab from "./components/dashboard/VenuesTab";
import GalleryTab from "./components/dashboard/GalleryTab";
import BookingsTab from "./components/dashboard/BookingsTab";
import NotificationsTab from "./components/dashboard/NotificationsTab";
import PackagesTab from "./components/dashboard/PackagesTab";
import ProfileTab from "./components/dashboard/ProfileTab";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import { supabase } from "../supabaseClient";


/* Admin emails list */
const ADMIN_EMAILS = [
  "vaishnaviboopathi127@gmail.com"
];

/* Hardcoded credentials */
const CREDENTIALS = {
  admin: { email: "vaishnaviboopathi127@gmail.com", password: "121212" },
  user:  { email: "user@vizhaa.in",  password: "User@123"  },
};

/* MARKER-MAKE-KIT-INVOKED */

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=1920&h=1080&fit=crop&auto=format",
    label: "Grand Entrance Decor",
  },
  {
    url: "https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=1920&h=1080&fit=crop&auto=format",
    label: "Wedding Stage",
  },
  {
    url: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=1920&h=1080&fit=crop&auto=format",
    label: "Elegant Buffet",
  },
  {
    url: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=1920&h=1080&fit=crop&auto=format",
    label: "Bridal Makeover",
  },
  {
    url: "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=1920&h=1080&fit=crop&auto=format",
    label: "Floral Reception",
  },
];

const FEATURES = [
  { icon: Calendar, title: "All-in-One Event Planning", desc: "Manage weddings, birthdays, receptions, and family celebrations in one seamless app." },
  { icon: Users, title: "Smart Vendor Booking", desc: "Book photographers, decorators, caterers, DJs, and makeup artists instantly." },
  { icon: Wallet, title: "Budget Management", desc: "Track expenses and manage event budgets with real-time insights and alerts." },
  { icon: Heart, title: "Guest Management", desc: "Invite guests, manage RSVPs, and send beautifully designed digital invitations." },
  { icon: Sparkles, title: "AI Event Suggestions", desc: "Smart AI recommendations for themes, venues, and hand-picked vendors." },
  { icon: Clock, title: "Real-Time Event Tracking", desc: "Monitor schedules, tasks, and bookings live from anywhere in the world." },
  { icon: Image, title: "Digital Invitations", desc: "Create and share elegant, personalized invitations instantly with one click." },
  { icon: Shield, title: "Secure Online Payments", desc: "Easy booking and payment integration with bank-grade security." },
  { icon: Bell, title: "Event Timeline & Scheduling", desc: "Plan every activity with smart reminders and push notifications." },
  { icon: Camera, title: "Photo & Memory Gallery", desc: "Store, curate, and share all your precious event memories in one place." },
];

const CATEGORIES = [
  // Marriage
  { group: "Marriage", name: "Weddings", emoji: "👰", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=400&h=500&fit=crop&auto=format" },
  { group: "Marriage", name: "Engagements", emoji: "💍", img: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=400&h=500&fit=crop&auto=format" },
  { group: "Marriage", name: "Receptions", emoji: "🥂", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=400&h=500&fit=crop&auto=format" },
  { group: "Marriage", name: "Mehendi Ceremonies", emoji: "🌿", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=500&fit=crop&auto=format" },
  { group: "Marriage", name: "Haldi Ceremonies", emoji: "🌼", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop&auto=format" },
  { group: "Marriage", name: "Sangeet Nights", emoji: "🎶", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&h=500&fit=crop&auto=format" },
  { group: "Marriage", name: "Bachelor / Bachelorette", emoji: "🎉", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop&auto=format" },
  { group: "Marriage", name: "Anniversary Celebrations", emoji: "💑", img: "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=400&h=500&fit=crop&auto=format" },
  { group: "Marriage", name: "Proposal Events", emoji: "💌", img: "https://images.unsplash.com/photo-1684868268327-7e5590bcfbd6?w=400&h=500&fit=crop&auto=format" },
  // Birthday Celebrations
  { group: "Birthday Celebrations", name: "Birthday Parties", emoji: "🎂", img: "https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=400&h=500&fit=crop&auto=format" },
  { group: "Birthday Celebrations", name: "Kids' Birthdays", emoji: "🎈", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop&auto=format" },
  { group: "Birthday Celebrations", name: "Milestone Birthdays", emoji: "🏆", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&h=500&fit=crop&auto=format" },
  // Family Celebrations
  { group: "Family Celebrations", name: "Baby Showers", emoji: "👶", img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=400&h=500&fit=crop&auto=format" },
  { group: "Family Celebrations", name: "Naming Ceremonies", emoji: "📜", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=400&h=500&fit=crop&auto=format" },
  { group: "Family Celebrations", name: "Housewarming", emoji: "🏡", img: "https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=400&h=500&fit=crop&auto=format" },
  { group: "Family Celebrations", name: "Ear Piercing Ceremony", emoji: "✨", img: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=400&h=500&fit=crop&auto=format" },
  { group: "Family Celebrations", name: "Puberty Function", emoji: "🌸", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=400&h=500&fit=crop&auto=format" },
];

const WHY_CHOOSE = [
  { icon: "✨", title: "Luxury Experience", desc: "Every detail curated for an unforgettable celebration." },
  { icon: "🎯", title: "Easy Planning", desc: "Streamlined tools that make planning effortless and enjoyable." },
  { icon: "🤝", title: "Trusted Vendors", desc: "500+ verified premium vendors across all categories." },
  { icon: "🤖", title: "AI-Powered", desc: "Intelligent recommendations tailored to your unique vision." },
  { icon: "💎", title: "Modern Design", desc: "Elegant, user-friendly interface crafted for discerning clients." },
];

const STATS = [
  { value: "10,000+", label: "Events Managed" },
  { value: "5,000+", label: "Trusted Vendors" },
  { value: "50,000+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Bride — Wedding 2024",
    text: "Vizhaa transformed our wedding into a fairy tale. Every detail was perfect, from the floral arrangements to the catering. I couldn't have asked for a more seamless experience.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=80&h=80&fit=crop&auto=format",
  },
  {
    name: "Rahul & Anjali",
    role: "Couple — Reception 2024",
    text: "The vendor booking feature saved us weeks of searching. We found the perfect photographer, decorator, and caterer all within one platform. Truly magical!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1684868268327-7e5590bcfbd6?w=80&h=80&fit=crop&auto=format",
  },
  {
    name: "Meera Patel",
    role: "Mother of the Bride",
    text: "The guest management and digital invitations were flawless. Our 400 guests received personalized invites, and the RSVP tracking made seating arrangements a breeze.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=80&h=80&fit=crop&auto=format",
  },
];

const GALLERY = [
  { url: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=400&fit=crop&auto=format", label: "Grand Entrance" },
  { url: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=600&h=400&fit=crop&auto=format", label: "Reception Table" },
  { url: "https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=600&h=400&fit=crop&auto=format", label: "Wedding Stage" },
  { url: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=600&h=400&fit=crop&auto=format", label: "Bridal Glam" },
  { url: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=600&h=400&fit=crop&auto=format", label: "Buffet Setup" },
  { url: "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=600&h=400&fit=crop&auto=format", label: "Floral Decor" },
];

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
      <div style={{ color: "#c9a84c", fontSize: "1.25rem" }}>✦</div>
      <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a84c", fontSize: "2rem", lineHeight: 1.2, textAlign: "center" }}>
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', serif",
        color: "#f5ead6",
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: 700,
        lineHeight: 1.2,
        textAlign: "center",
      }}
    >
      {children}
    </h2>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={16} style={{ color: "#c9a84c", fill: "#c9a84c" }} />
      ))}
    </div>
  );
}

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [countersVisible, setCountersVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [userName, setUserName] = useState("Priya Sharma");
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupAddress, setSignupAddress] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [pendingEventName, setPendingEventName] = useState<string | undefined>(undefined);
  const [notifCount, setNotifCount] = useState(0);

  const fetchUnreadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("read", false);
        if (!error && count !== null) {
          setNotifCount(count);
        }
      }
    } catch (err) {
      console.error("Error fetching unread notifications count:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const openModal = (type: "login" | "signup") => {
    setAuthTab(type);
    setShowAuthModal(true);
  };

  // Check for active Supabase Auth sessions on mount and listen to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setLoggedIn(true);
        const email = session.user.email;
        if (email && ADMIN_EMAILS.includes(email)) {
          setUserRole("admin");
        } else {
          setUserRole("user");
        }
        setUserName(session.user.user_metadata?.full_name || email?.split("@")[0] || "User");
        fetchUnreadNotifications();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setLoggedIn(true);
        const email = session.user.email;
        if (email && ADMIN_EMAILS.includes(email)) {
          setUserRole("admin");
        } else {
          setUserRole("user");
        }
        setUserName(session.user.user_metadata?.full_name || email?.split("@")[0] || "User");
        fetchUnreadNotifications();
      } else {
        setLoggedIn(false);
        setUserRole("user");
        setNotifCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoginError("");
    if (authTab === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setLoginError(error.message);
      } else if (data.user) {
        const email = data.user.email;
        if (email && ADMIN_EMAILS.includes(email)) {
          setUserRole("admin");
        } else {
          setUserRole("user");
        }
        setUserName(data.user.user_metadata?.full_name || email?.split("@")[0] || "User");
        setLoggedIn(true);
        setShowAuthModal(false);
        fetchUnreadNotifications();
        if (!email || !ADMIN_EMAILS.includes(email)) {
          setActiveTab("home");
        }
      }
      return;
    }
    
    /* signup flow */
    if (!signupName.trim()) {
      setLoginError("Please enter your name.");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: loginEmail,
      password: loginPassword,
      options: {
        data: {
          full_name: signupName.trim(),
          phone: signupPhone.trim(),
          address: signupAddress.trim(),
        }
      }
    });

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        setLoginError("Email rate limit exceeded. Please disable 'Confirm Email' in your Supabase Auth Providers setting, or try again in a few minutes.");
      } else {
        setLoginError(error.message);
      }
    } else if (data.user) {
      const session = data.session;
      if (session) {
        setUserName(signupName.trim());
        setUserRole("user");
        setLoggedIn(true);
        setShowAuthModal(false);
        setActiveTab("home");
      } else {
        setLoginError("Sign up successful! Please check your email for a confirmation link.");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setActiveTab("home");
  };

  /* navigate from HomeTab event click → EventsTab with that event preselected */
  const handleHomeEventClick = (eventName: string) => {
    setPendingEventName(eventName);
    setActiveTab("events");
  };

  /* ── Admin dashboard ── */
  if (loggedIn && userRole === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  /* ── User dashboard ── */
  if (loggedIn && userRole === "user") {
    return (
      <DashboardLayout
        activeTab={activeTab}
        onTabChange={(t) => { setActiveTab(t); if (t !== "events") setPendingEventName(undefined); }}
        onLogout={handleLogout}
        userName={userName}
        notifCount={notifCount}
      >
        {activeTab === "home"          && <HomeTab onNavigate={(t) => setActiveTab(t as TabId)} onEventClick={handleHomeEventClick} />}
        {activeTab === "events"        && <ServicesTab initialEventType={pendingEventName} />}
        {activeTab === "packages"      && <PackagesTab />}
        {activeTab === "bookings"      && <BookingsTab />}
        {activeTab === "gallery"       && <GalleryTab />}
        {activeTab === "notifications" && <NotificationsTab onReadChange={fetchUnreadNotifications} />}
        {activeTab === "profile"       && <ProfileTab userName={userName} onLogout={handleLogout} />}
      </DashboardLayout>
    );
  }

  return (
    <div style={{ fontFamily: "'Raleway', sans-serif", background: "#0a0804", color: "#f5ead6", overflowX: "hidden" }}>

      {/* ──────── NAVBAR ──────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background 0.4s, backdrop-filter 0.4s",
          background: scrolled ? "rgba(10,8,4,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(201,168,76,0.15)" : "none",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
          <div className="flex items-center justify-between" style={{ height: "72px" }}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Vizhaa Logo" style={{ height: "46px", width: "46px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.3)", objectFit: "cover" }} />
              <div className="flex flex-col">
                <span style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a84c", fontSize: "2rem", lineHeight: 1 }}>
                  Vizhaa
                </span>
                <span style={{ color: "#9a8060", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1.4 }}>
                  Event Management App
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {["Features", "Categories", "Services", "Gallery", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  style={{ color: "#c9a84c", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#e8cc84"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#c9a84c"; }}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => openModal("login")}
                style={{
                  padding: "0.45rem 1.4rem",
                  border: "1px solid rgba(201,168,76,0.6)",
                  borderRadius: "4px",
                  background: "transparent",
                  color: "#c9a84c",
                  fontSize: "0.82rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  fontFamily: "'Raleway', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Login
              </button>
              <button
                onClick={() => openModal("signup")}
                style={{
                  padding: "0.45rem 1.4rem",
                  border: "1px solid #c9a84c",
                  borderRadius: "4px",
                  background: "linear-gradient(135deg, #c9a84c, #9a7a2e)",
                  color: "#0a0804",
                  fontSize: "0.82rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                Sign Up
              </button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer" }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: "rgba(10,8,4,0.97)", borderTop: "1px solid rgba(201,168,76,0.15)", overflow: "hidden" }}
            >
              <div className="flex flex-col p-6 gap-4">
                {["Features", "Categories", "Services", "Gallery", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: "#c9a84c", textDecoration: "none", fontSize: "1rem", letterSpacing: "0.1em" }}
                  >
                    {item}
                  </a>
                ))}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { openModal("login"); setMobileMenuOpen(false); }}
                    style={{ flex: 1, padding: "0.6rem", border: "1px solid rgba(201,168,76,0.6)", borderRadius: "4px", background: "transparent", color: "#c9a84c", cursor: "pointer", fontFamily: "'Raleway', sans-serif" }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { openModal("signup"); setMobileMenuOpen(false); }}
                    style={{ flex: 1, padding: "0.6rem", border: "none", borderRadius: "4px", background: "linear-gradient(135deg, #c9a84c, #9a7a2e)", color: "#0a0804", cursor: "pointer", fontWeight: 700, fontFamily: "'Raleway', sans-serif" }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ──────── HERO ──────── */}
      <section style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        {HERO_SLIDES.map((slide, i) => (
          <motion.div
            key={slide.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === slideIndex ? 1 : 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${slide.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 1,
            }}
          />
        ))}

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,4,0.5) 0%, rgba(10,8,4,0.25) 40%, rgba(10,8,4,0.78) 100%)", zIndex: 2 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 35%, rgba(10,8,4,0.55) 100%)", zIndex: 3 }} />

        <div
          style={{
            position: "relative",
            zIndex: 4,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "80px 1.5rem 0",
            boxSizing: "border-box",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a84c", fontSize: "clamp(2.5rem, 6vw, 4rem)", marginBottom: "0.5rem" }}
          >
            Vizhaa
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
              fontWeight: 700,
              color: "#f5ead6",
              lineHeight: 1.1,
              maxWidth: "880px",
              textShadow: "0 2px 30px rgba(0,0,0,0.6)",
            }}
          >
            Your Story,{" "}
            <span style={{ color: "#c9a84c", fontStyle: "italic" }}>Our Celebration</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            style={{ color: "#e8cc84", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "1rem", fontWeight: 300 }}
          >
            Your Event · Our Elegance
          </motion.p>

          <GoldDivider />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{ color: "rgba(245,234,214,0.7)", maxWidth: "540px", lineHeight: 1.85, marginBottom: "2.5rem", fontSize: "1rem" }}
          >
            India's most elegant event planning platform. From intimate gatherings to grand celebrations — crafted with love, delivered with perfection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <button
              onClick={() => openModal("signup")}
              style={{
                padding: "0.85rem 2.5rem",
                background: "linear-gradient(135deg, #c9a84c, #9a7a2e)",
                color: "#0a0804",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "'Raleway', sans-serif",
                boxShadow: "0 4px 24px rgba(201,168,76,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,168,76,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,168,76,0.35)"; }}
            >
              Start Planning Free
            </button>
            <a
              href="#features"
              style={{
                padding: "0.85rem 2.5rem",
                border: "1px solid rgba(201,168,76,0.5)",
                color: "#c9a84c",
                borderRadius: "4px",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Explore <ArrowRight size={15} />
            </a>
          </motion.div>

          <div className="flex gap-2 mt-10">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                style={{
                  width: i === slideIndex ? "2rem" : "0.45rem",
                  height: "0.45rem",
                  borderRadius: "99px",
                  background: i === slideIndex ? "#c9a84c" : "rgba(201,168,76,0.3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 5, cursor: "pointer" }}
        >
          <a href="#features">
            <ChevronDown style={{ color: "rgba(201,168,76,0.6)" }} size={32} />
          </a>
        </motion.div>
      </section>

      {/* ──────── FEATURES ──────── */}
      <section id="features" style={{ padding: "6rem 1.5rem", background: "#0a0804", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionLabel>What We Offer</SectionLabel>
            <SectionTitle>Main Features</SectionTitle>
            <GoldDivider />
            <p style={{ textAlign: "center", color: "#9a8060", maxWidth: "540px", margin: "0 auto 4rem", lineHeight: 1.85, fontSize: "0.95rem" }}>
              Everything you need to plan, manage, and celebrate your most cherished moments — all in one place.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.5rem" }}>
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: "linear-gradient(145deg, #14100a, #1a1408)",
                    border: "1px solid rgba(201,168,76,0.14)",
                    borderRadius: "8px",
                    padding: "2rem",
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.14)"; }}
                >
                  <div style={{ width: "50px", height: "50px", borderRadius: "10px", background: "rgba(201,168,76,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", border: "1px solid rgba(201,168,76,0.18)" }}>
                    <Icon size={22} style={{ color: "#c9a84c" }} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#f5ead6", marginBottom: "0.5rem", fontSize: "1.05rem" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "#9a8060", lineHeight: 1.75, fontSize: "0.88rem" }}>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────── CATEGORIES ──────── */}
      <section id="categories" style={{ padding: "6rem 1.5rem", background: "#0d0b07" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionLabel>Celebrations We Cover</SectionLabel>
            <SectionTitle>Event Categories</SectionTitle>
            <GoldDivider />
            <p style={{ textAlign: "center", color: "#9a8060", maxWidth: "500px", margin: "0 auto 4rem", lineHeight: 1.85, fontSize: "0.95rem" }}>
              From intimate ceremonies to grand social celebrations — we bring every occasion to life.
            </p>
          </motion.div>

          {(["Marriage", "Birthday Celebrations", "Family Celebrations"] as const).map((group) => {
            const groupItems = CATEGORIES.filter((c) => c.group === group);
            return (
              <div key={group} style={{ marginBottom: "3.5rem" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.35))" }} />
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#c9a84c", fontSize: "1rem", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {group}
                  </p>
                  <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, rgba(201,168,76,0.35))" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "1rem" }}>
                  {groupItems.map((cat, i) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ scale: 1.04 }}
                      style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "3/4", cursor: "pointer", border: "1px solid rgba(201,168,76,0.18)" }}
                    >
                      <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.9) 0%, rgba(10,8,4,0.1) 55%, transparent 100%)" }} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem 0.75rem", textAlign: "center" }}>
                        <p style={{ fontFamily: "'Playfair Display', serif", color: "#f5ead6", fontWeight: 600, fontSize: "0.82rem", lineHeight: 1.3 }}>{cat.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────── SERVICES PREVIEW ──────── */}
      <section id="services" style={{ padding: "6rem 1.5rem", background: "#0a0804" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a84c", fontSize: "1.6rem", lineHeight: 1 }}>Our Offerings</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#f5ead6", fontSize: "2rem", fontWeight: 700, margin: "4px 0 0" }}>Interactive Services Preview</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
              <div style={{ height: "1px", width: "40px", background: "linear-gradient(to right, transparent, #c9a84c)" }} />
              <span style={{ color: "#c9a84c" }}>✦</span>
              <div style={{ height: "1px", width: "40px", background: "linear-gradient(to left, transparent, #c9a84c)" }} />
            </div>
          </div>
          <ServicesTab />
        </div>
      </section>

      {/* ──────── WHY CHOOSE US ──────── */}
      <section style={{ padding: "6rem 1.5rem", background: "#0a0804", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionLabel>Our Promise</SectionLabel>
            <SectionTitle>Why Choose Vizhaa?</SectionTitle>
            <GoldDivider />
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginTop: "4rem" }}>
            {WHY_CHOOSE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ textAlign: "center", padding: "2.5rem 1rem", background: "linear-gradient(145deg, #14100a, #1a1408)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "8px" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.35)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.12)"; }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#c9a84c", marginBottom: "0.75rem", fontSize: "1.1rem" }}>
                  {item.title}
                </h3>
                <div style={{ width: "36px", height: "1px", background: "rgba(201,168,76,0.4)", margin: "0 auto 0.75rem" }} />
                <p style={{ color: "#9a8060", lineHeight: 1.75, fontSize: "0.88rem" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── STATISTICS ──────── */}
      <section
        ref={statsRef}
        style={{ padding: "5rem 1.5rem", background: "linear-gradient(135deg, #14100a 0%, #1a1408 50%, #14100a 100%)", borderTop: "1px solid rgba(201,168,76,0.15)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "3rem", textAlign: "center" }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={countersVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "#c9a84c", fontWeight: 700, lineHeight: 1, marginBottom: "0.5rem" }}>
                {stat.value}
              </p>
              <p style={{ color: "#9a8060", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.75rem" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────── TESTIMONIALS ──────── */}
      <section style={{ padding: "6rem 1.5rem", background: "#0a0804" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionLabel>Love Stories</SectionLabel>
            <SectionTitle>What Our Clients Say</SectionTitle>
            <GoldDivider />
          </motion.div>

          <div style={{ position: "relative", marginTop: "3rem" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "linear-gradient(145deg, #14100a, #1a1408)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "12px",
                  padding: "3rem 2.5rem",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <Quote style={{ color: "#c9a84c", opacity: 0.25, position: "absolute", top: "1.5rem", left: "1.5rem" }} size={44} />
                <img
                  src={TESTIMONIALS[activeTestimonial].avatar}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  style={{ width: "76px", height: "76px", borderRadius: "50%", objectFit: "cover", border: "2px solid #c9a84c", margin: "0 auto 1rem" }}
                />
                <StarRating count={TESTIMONIALS[activeTestimonial].rating} />
                <p style={{ color: "rgba(245,234,214,0.85)", lineHeight: 1.95, fontSize: "1rem", margin: "1.25rem 0", fontStyle: "italic" }}>
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", color: "#c9a84c", fontWeight: 600, fontSize: "1.05rem" }}>
                  {TESTIMONIALS[activeTestimonial].name}
                </p>
                <p style={{ color: "#9a8060", fontSize: "0.82rem", marginTop: "0.25rem" }}>
                  {TESTIMONIALS[activeTestimonial].role}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? "2rem" : "0.45rem",
                    height: "0.45rem",
                    borderRadius: "99px",
                    background: i === activeTestimonial ? "#c9a84c" : "rgba(201,168,76,0.3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── GALLERY ──────── */}
      <section id="gallery" style={{ padding: "6rem 1.5rem", background: "#0d0b07" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionLabel>Captured Moments</SectionLabel>
            <SectionTitle>Gallery Preview</SectionTitle>
            <GoldDivider />
            <p style={{ textAlign: "center", color: "#9a8060", maxWidth: "500px", margin: "0 auto 4rem", lineHeight: 1.85, fontSize: "0.95rem" }}>
              A glimpse into the celebrations we've had the privilege to craft.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {GALLERY.map((item, i) => (
              <motion.div
                key={item.url}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "4/3", cursor: "pointer", border: "1px solid rgba(201,168,76,0.18)" }}
              >
                <img src={item.url} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.75) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#f5ead6", fontSize: "0.88rem" }}>{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section style={{ padding: "6rem 1.5rem", background: "linear-gradient(135deg, #14100a, #1e1710)", position: "relative", overflow: "hidden", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=1920&h=800&fit=crop&auto=format)`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.07 }} />
        <div style={{ position: "relative", maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Begin Your Journey</SectionLabel>
          <SectionTitle>Ready to Create Your Dream Event?</SectionTitle>
          <GoldDivider />
          <p style={{ color: "#9a8060", lineHeight: 1.85, margin: "1.5rem 0 2.5rem", fontSize: "0.95rem" }}>
            Join thousands of happy couples and families who trusted Vizhaa to make their celebrations unforgettable.
          </p>
          <button
            onClick={() => openModal("signup")}
            style={{
              padding: "1rem 3rem",
              background: "linear-gradient(135deg, #c9a84c, #9a7a2e)",
              color: "#0a0804",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Raleway', sans-serif",
              boxShadow: "0 4px 30px rgba(201,168,76,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(201,168,76,0.55)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 30px rgba(201,168,76,0.4)"; }}
          >
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer id="contact" style={{ padding: "5rem 1.5rem 2.5rem", background: "#0a0804", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "3rem" }}>
          <div>
            <p style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a84c", fontSize: "2.5rem", marginBottom: "0.5rem" }}>Vizhaa</p>
            <p style={{ color: "#9a8060", lineHeight: 1.8, maxWidth: "300px", fontSize: "0.88rem" }}>
              Your story, our celebration. India's most trusted luxury event planning platform — crafting memories that last forever.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Twitter, Youtube].map((SocialIcon, i) => (
                <button
                  key={i}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.3)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#c9a84c", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
                >
                  <SocialIcon size={15} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#c9a84c", marginBottom: "1.5rem", fontSize: "0.9rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Quick Links</h4>
            {["Features", "Event Categories", "Gallery", "Testimonials", "About Us", "Pricing"].map((link) => (
              <p
                key={link}
                style={{ color: "#9a8060", marginBottom: "0.65rem", fontSize: "0.88rem", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c9a84c"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#9a8060"; }}
              >
                {link}
              </p>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#c9a84c", marginBottom: "1.5rem", fontSize: "0.9rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Get in Touch</h4>
            {[
              { icon: Phone, text: "+91 98765 43210" },
              { icon: Mail, text: "hello@vizhaa.in" },
              { icon: MapPin, text: "Mumbai, Maharashtra, India" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 mb-4">
                <Icon size={16} style={{ color: "#c9a84c", flexShrink: 0 }} />
                <p style={{ color: "#9a8060", fontSize: "0.88rem" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1280px", margin: "3rem auto 0", paddingTop: "2rem", borderTop: "1px solid rgba(201,168,76,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "#9a8060", fontSize: "0.78rem" }}>© 2024 Vizhaa. All rights reserved.</p>
          <p style={{ color: "#9a8060", fontSize: "0.78rem" }}>Crafted with ❤️ for your celebrations</p>
        </div>
      </footer>

      {/* ──────── AUTH MODAL ──────── */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,8,4,0.85)",
              backdropFilter: "blur(12px)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.25rem",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                background: "linear-gradient(145deg, #18130c, #100d07)",
                border: "1px solid rgba(201,168,76,0.35)",
                borderRadius: "16px",
                padding: "2.25rem 2rem",
                width: "100%",
                maxWidth: "440px",
                maxHeight: "88vh",
                overflowY: "auto",
                position: "relative",
                boxShadow: "0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(201,168,76,0.15)",
              }}
            >
              {/* Prominent Visible Wrong/Close (X) Symbol */}
              <button
                aria-label="Close modal"
                onClick={() => setShowAuthModal(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(201,168,76,0.15)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  color: "#e8cc84",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  zIndex: 10,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#c9a84c";
                  e.currentTarget.style.color = "#0a0804";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(201,168,76,0.15)";
                  e.currentTarget.style.color = "#e8cc84";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <div style={{ textAlign: "center", marginBottom: "1.75rem", paddingRight: "1rem" }}>
                <p style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a84c", fontSize: "2.2rem", marginBottom: "0.25rem" }}>Vizhaa</p>
                <p style={{ color: "#9a8060", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {authTab === "login" ? "Welcome Back" : "Begin Your Journey"}
                </p>

                <div className="flex mt-4" style={{ border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", overflow: "hidden" }}>
                  {(["login", "signup"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setAuthTab(tab); setLoginError(""); }}
                      style={{
                        flex: 1,
                        padding: "0.6rem",
                        border: "none",
                        background: authTab === tab ? "linear-gradient(135deg, #c9a84c, #9a7a2e)" : "transparent",
                        color: authTab === tab ? "#0a0804" : "#9a8060",
                        fontWeight: authTab === tab ? 700 : 400,
                        cursor: "pointer",
                        textTransform: "capitalize",
                        fontSize: "0.88rem",
                        fontFamily: "'Raleway', sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      {tab === "login" ? "Login" : "Sign Up"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {authTab === "signup" && (
                  <>
                    <div>
                      <label style={{ display: "block", color: "#9a8060", fontSize: "0.72rem", marginBottom: "0.35rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Full Name</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        style={{ width: "100%", padding: "0.7rem 0.9rem", background: "#1e1710", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "6px", color: "#f5ead6", fontSize: "0.88rem", fontFamily: "'Raleway', sans-serif", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "#9a8060", fontSize: "0.72rem", marginBottom: "0.35rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 63811 39837"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        style={{ width: "100%", padding: "0.7rem 0.9rem", background: "#1e1710", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "6px", color: "#f5ead6", fontSize: "0.88rem", fontFamily: "'Raleway', sans-serif", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "#9a8060", fontSize: "0.72rem", marginBottom: "0.35rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Address</label>
                      <input
                        type="text"
                        placeholder="City, State"
                        value={signupAddress}
                        onChange={(e) => setSignupAddress(e.target.value)}
                        style={{ width: "100%", padding: "0.7rem 0.9rem", background: "#1e1710", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "6px", color: "#f5ead6", fontSize: "0.88rem", fontFamily: "'Raleway', sans-serif", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </>
                )}
                <div>
                  <label style={{ display: "block", color: "#9a8060", fontSize: "0.72rem", marginBottom: "0.35rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginError(""); }}
                    style={{ width: "100%", padding: "0.7rem 0.9rem", background: "#1e1710", border: `1px solid ${loginError && !loginError.includes("sent") ? "rgba(248,113,113,0.5)" : "rgba(201,168,76,0.18)"}`, borderRadius: "6px", color: "#f5ead6", fontSize: "0.88rem", fontFamily: "'Raleway', sans-serif", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#9a8060", fontSize: "0.72rem", marginBottom: "0.35rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
                    style={{ width: "100%", padding: "0.7rem 0.9rem", background: "#1e1710", border: `1px solid ${loginError && !loginError.includes("sent") ? "rgba(248,113,113,0.5)" : "rgba(201,168,76,0.18)"}`, borderRadius: "6px", color: "#f5ead6", fontSize: "0.88rem", fontFamily: "'Raleway', sans-serif", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                {authTab === "login" && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.2rem" }}>
                    <button
                      type="button"
                      onClick={async () => {
                        setLoginError("");
                        if (!loginEmail.trim()) {
                          setLoginError("Please enter your email above to reset password.");
                          return;
                        }
                        const { error } = await supabase.auth.resetPasswordForEmail(loginEmail.trim());
                        if (error) {
                          setLoginError(error.message);
                        } else {
                          setLoginError("Reset email sent! Please check your inbox.");
                        }
                      }}
                      style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "0.76rem", cursor: "pointer", textDecoration: "underline", fontFamily: "'Raleway', sans-serif" }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {loginError && (
                  <p style={{ color: loginError.includes("sent") ? "#4ade80" : "#f87171", fontSize: "0.78rem", marginTop: "-0.2rem" }}>{loginError}</p>
                )}

                <button
                  style={{
                    padding: "0.8rem",
                    background: "linear-gradient(135deg, #c9a84c, #9a7a2e)",
                    color: "#0a0804",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontFamily: "'Raleway', sans-serif",
                    marginTop: "0.4rem",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  onClick={handleLogin}
                >
                  {authTab === "login" ? "Login to Vizhaa" : "Create Your Account"}
                </button>

                <p style={{ color: "#9a8060", fontSize: "0.78rem", textAlign: "center" }}>
                  {authTab === "login" ? "New to Vizhaa? " : "Already have an account? "}
                  <span
                    style={{ color: "#c9a84c", cursor: "pointer" }}
                    onClick={() => { setAuthTab(authTab === "login" ? "signup" : "login"); setLoginError(""); }}
                  >
                    {authTab === "login" ? "Sign up free" : "Login here"}
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


