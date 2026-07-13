import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Utensils, Music, Palette, Mail, Clipboard, Star, ArrowRight, Wrench, Sparkles, Gift, CheckCircle, Clock, Upload, X, Users, ChevronDown, ChevronLeft, CreditCard } from "lucide-react";
// @ts-ignore
import confetti from "canvas-confetti";
import { EditServiceModal } from "./EditServiceModal";
import { EditSubServiceModal } from "./EditSubServiceModal";


const G = {
  surface: "rgba(20, 16, 10, 0.72)", border: "rgba(201,168,76,0.18)", gold: "#c9a84c",
  text: "#f5ead6", muted: "#9a8060", surface2: "rgba(26, 20, 8, 0.55)",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

const DEFAULT_SERVICES = [
  {
    name: "Decoration Services",
    icon: "Palette",
    tagline: "Transform spaces into dreamscapes",
    img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=360&fit=crop",
    price: "From ₹15,000",
    rating: 4.9,
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
    name: "Catering Services",
    icon: "Utensils",
    tagline: "Culinary excellence for every occasion",
    img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=600&h=360&fit=crop",
    price: "From ₹450/plate",
    rating: 4.8,
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
    name: "Photography & Videography",
    icon: "Camera",
    tagline: "Capture every precious moment",
    img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=600&h=360&fit=crop",
    price: "From ₹35,000",
    rating: 4.9,
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
    name: "Entertainment Services",
    icon: "Music",
    tagline: "Keep the energy alive all night",
    img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&h=360&fit=crop",
    price: "From ₹20,000",
    rating: 4.7,
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
    name: "Birthday Services",
    icon: "Gift",
    tagline: "Unforgettable birthday memories",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=360&fit=crop",
    price: "From ₹15,000",
    rating: 4.8,
    items: [
      { name: "Theme Setup", desc: "Creative birthday theme decorations and stages", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Character Mascots", desc: "Interactive mascots and cartoon entertainers", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Cake Arrangement", desc: "Customized multi-tier theme birthday cakes", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Games & Activities", desc: "Engaging game host, balloon twisting & magic show", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Return Gifts", desc: "Customized favors and return gift packaging", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" }
    ]
  },
  {
    name: "Wedding Services",
    icon: "Clipboard",
    tagline: "Flawless planning for your special day",
    img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=600&h=360&fit=crop",
    price: "From ₹30,000",
    rating: 5.0,
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
    name: "Family Function Services",
    icon: "Users",
    tagline: "Celebrating bond and togetherness",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=360&fit=crop",
    price: "From ₹25,000",
    rating: 4.8,
    items: [
      { name: "Baby Shower Decoration", desc: "Aesthetic theme setups for baby shower celebrations", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Naming Ceremony Setup", desc: "Traditional naming ceremony stage and cradle arrangements", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&h=300&fit=crop" },
      { name: "Housewarming Setup", desc: "Warm floral decor and traditional entrance arrangements", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop" },
      { name: "Ear Piercing Ceremony Arrangement", desc: "Traditional seating and decor setup for child ear piercing", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" },
      { name: "Puberty Function Decoration", desc: "Grand traditional arrangements and elegant backdrop decor", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" }
    ]
  },
  {
    name: "Additional Services",
    icon: "Wrench",
    tagline: "Comprehensive support for a perfect event",
    img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&h=360&fit=crop",
    price: "Custom Pricing",
    rating: 4.7,
    items: [
      { name: "Invitation Card Design", desc: "Traditional luxury printed event cards", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=500&h=300&fit=crop" },
      { name: "Digital Invitations", desc: "Cinematic animated video invitations", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=500&h=300&fit=crop" },
      { name: "Gift Arrangement", desc: "Fancy fruit, dry fruit, and customized gift packing", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Event Hosting", desc: "Professional coordinators and welcoming hosts", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" },
      { name: "Security Services", desc: "Trained security guards for event gate keeping", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" },
      { name: "Power Backup", desc: "Silent diesel generator rentals for uninterrupted lighting", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" },
      { name: "Cleaning Services", desc: "Pre-event and post-event sweepers and sanitization", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" }
    ]
  }
];

const G_ICONS: Record<string, React.ComponentType<any>> = {
  Palette,
  Utensils,
  Camera,
  Music,
  Mail,
  Clipboard,
  Wrench,
  Sparkles,
  Gift,
};

const getIcon = (name: string) => G_ICONS[name] || Sparkles;

const resolveDetailKey = (categoryName: string, subName: string) => {
  let mappedCat = categoryName;
  if (categoryName === "Decoration") mappedCat = "Decoration Services";
  if (categoryName === "Catering") mappedCat = "Catering Services";
  if (categoryName === "Entertainment") mappedCat = "Entertainment Services";
  if (categoryName === "Birthday") mappedCat = "Birthday Services";
  if (categoryName === "Wedding") mappedCat = "Wedding Services";
  if (categoryName === "Family Function") mappedCat = "Family Function Services";
  if (categoryName === "Additional") mappedCat = "Additional Services";
  return `${mappedCat}::${subName}`;
};

const SERVICE_PRICES: Record<string, { low: number; medium: number; high: number }> = {
  "Decoration": { low: 15000, medium: 25000, high: 50000 },
  "Catering": { low: 20000, medium: 45000, high: 90000 },
  "Photography & Videography": { low: 20000, medium: 35000, high: 70000 },
  "Entertainment": { low: 12000, medium: 20000, high: 40000 },
  "Invitation Design": { low: 3000, medium: 5000, high: 10000 },
  "Event Coordination": { low: 8000, medium: 15000, high: 30000 }
};

const getServicePrice = (name: string, budget: 'low' | 'medium' | 'high', parentCatName?: string) => {
  const n = name.toLowerCase();
  const p = (parentCatName || "").toLowerCase();
  
  let key = "Event Coordination";
  if (n.includes("decor") || n.includes("floral") || n.includes("stage") || p.includes("decor")) key = "Decoration";
  else if (n.includes("catering") || n.includes("refreshment") || n.includes("buffet") || n.includes("food") || n.includes("plate") || n.includes("cater") || p.includes("cater")) key = "Catering";
  else if (n.includes("photo") || n.includes("video") || n.includes("camera") || n.includes("drone") || p.includes("photo") || p.includes("video") || p.includes("camera")) key = "Photography & Videography";
  else if (n.includes("music") || n.includes("dj") || n.includes("sound") || n.includes("band") || n.includes("entertainment") || n.includes("show") || p.includes("music") || p.includes("dj") || p.includes("entertain")) key = "Entertainment";
  else if (n.includes("invite") || n.includes("invitation") || n.includes("card") || p.includes("invite")) key = "Invitation Design";
  
  return SERVICE_PRICES[key]?.[budget] || (budget === 'low' ? 10000 : budget === 'medium' ? 20000 : 40000);
};

function SectionHead({ script, title }: { script: string; title: string }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.6rem", lineHeight: 1 }}>{script}</p>
      <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, margin: 0 }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <div style={{ height: "1px", width: "40px", background: `linear-gradient(to right, transparent, ${G.gold})` }} />
        <span style={{ color: G.gold }}>✦</span>
        <div style={{ height: "1px", width: "40px", background: `linear-gradient(to left, transparent, ${G.gold})` }} />
      </div>
    </div>
  );
}

export default function ServicesTab({ initialEventType }: { initialEventType?: string } = {}) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subItemDetails, setSubItemDetails] = useState<Record<string, { description: string; images: string[] }>>({});
  const [selectedSub, setSelectedSub] = useState<{ name: string; category: string; description: string; images: string[] } | null>(null);

  // Unified Booking flow states
  const [selectedServices, setSelectedServices] = useState<Array<{
    serviceName: string;
    category: string;
    budget: 'low' | 'medium' | 'high';
    price: number;
    referenceImage?: string;
  }>>([]);

  const [selectedItems, setSelectedItems] = useState<Array<{
    id: string;
    name: string;
    subService: string;
    category: string;
    price: number;
    priceStr: string;
    image: string;
    tagline: string;
  }>>([]);

  const [expandedSubService, setExpandedSubService] = useState<string | null>(null);
  const [activeSubService, setActiveSubService] = useState<{ name: string; category: string } | null>(null);
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);
  const [advancePaymentOption, setAdvancePaymentOption] = useState<'50' | '100'>('50');
  const [showBookingSummary, setShowBookingSummary] = useState(false);

  const parsePrice = (priceStr: string | number): number => {
    if (typeof priceStr === "number") return priceStr;
    if (!priceStr) return 0;
    const cleaned = priceStr.toString().replace(/[^\d]/g, "");
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  };


  const [activeConfigService, setActiveConfigService] = useState<string | null>(null);
  const [activeBudget, setActiveBudget] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeRecommendations, setActiveRecommendations] = useState<any[]>([]);
  const [activeRecommendationsLoading, setActiveRecommendationsLoading] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [showBudgetPopup, setShowBudgetPopup] = useState(false);
  const [tempConfigService, setTempConfigService] = useState<string | null>(null);

  const [activeCategoryTab, setActiveCategoryTab] = useState<string | null>(null);

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [eventType, setEventType] = useState(initialEventType || "Custom Celebration");

  useEffect(() => {
    if (initialEventType) {
      setEventType(initialEventType);
    }
  }, [initialEventType]);

  const handleNextService = () => {
    const list = services.length > 0 ? services : DEFAULT_SERVICES;
    const currentIndex = list.findIndex(s => s.name === activeCategoryTab);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % list.length;
      setActiveCategoryTab(list[nextIndex].name);
    }
  };

  const handlePrevService = () => {
    const list = services.length > 0 ? services : DEFAULT_SERVICES;
    const currentIndex = list.findIndex(s => s.name === activeCategoryTab);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + list.length) % list.length;
      setActiveCategoryTab(list[prevIndex].name);
    }
  };


  const [showBookAnotherToggle, setShowBookAnotherToggle] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // CRUD States for Admin
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [isEditSubServiceModalOpen, setIsEditSubServiceModalOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState<any>(null);
  const [editingSubServiceParent, setEditingSubServiceParent] = useState<any>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === "vaishnaviboopathi127@gmail.com") {
        setIsAdmin(true);
      }
    }
    checkUserRole();
  }, []);


  const handleEditService = (svc: any) => {
    setEditingService(svc);
    setIsEditServiceModalOpen(true);
  };

  const handleDeleteService = async (svcName: string) => {
    if (!window.confirm(`Are you sure you want to delete the service "${svcName}"?`)) return;
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("name", svcName);
    if (error) {
      alert("Error deleting service: " + error.message);
    } else {
      loadServices();
    }
  };

  const handleEditSubService = (parentSvcName: string, subService: any) => {
    const parent = services.find(s => s.name === parentSvcName);
    if (parent) {
      setEditingSubServiceParent(parent);
      setEditingSubService(subService);
      setIsEditSubServiceModalOpen(true);
    }
  };

  const handleDeleteSubService = async (parentSvcName: string, subSvcName: string) => {
    if (!window.confirm(`Are you sure you want to delete the sub-service "${subSvcName}"?`)) return;
    const parent = services.find(s => s.name === parentSvcName);
    if (parent) {
      const updatedItems = (parent.items || []).filter((item: any) => 
        (typeof item === "string" ? item : item.name) !== subSvcName
      );
      const { error } = await supabase
        .from("services")
        .update({ items: updatedItems })
        .eq("id", parent.id);
      if (error) {
        alert("Error deleting sub-service: " + error.message);
      } else {
        loadServices();
      }
    }
  };


  useEffect(() => {
    async function loadSubItemDetails() {
      try {
        const { data, error } = await supabase
          .from("sub_service_details")
          .select("*");
        if (!error && data) {
          const mapping: Record<string, { description: string; images: string[] }> = {};
          data.forEach((row: any) => {
            mapping[row.key] = {
              description: row.description || "",
              images: row.images || []
            };
          });
          setSubItemDetails(mapping);
        }
      } catch (err) {
        console.error("Error loading sub-service details:", err);
      }
    }
    loadSubItemDetails();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        setServices(data);
      } else {
        setServices(DEFAULT_SERVICES);
      }
    } catch (err) {
      console.error("Error loading services:", err);
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    const channel1 = supabase.channel('customer:services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        loadServices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
    };
  }, []);

  useEffect(() => {
    const configSvc = activeConfigService;
    if (!configSvc || !activeBudget) {
      setActiveRecommendations([]);
      return;
    }
    async function fetchRecs(svcName: string) {
      setActiveRecommendationsLoading(true);
      try {
        // Try searching for specific sub-service recommendation first
        const { data: subRecs, error: subError } = await supabase
          .from("gallery")
          .select("*")
          .eq("budget_tier", activeBudget)
          .eq("service_name", svcName);

        if (!subError && subRecs && subRecs.length > 0) {
          setActiveRecommendations(subRecs);
          return;
        }

        // Try parent category matching
        let parentCat = "Decoration";
        const lowerSvc = svcName.toLowerCase();
        const parent = services.find(s => 
          (s.items || []).some((item: any) => 
            (typeof item === "string" ? item : item.name).toLowerCase() === lowerSvc
          )
        );
        if (parent) {
          parentCat = parent.name;
        } else {
          if (lowerSvc.includes("decor") || lowerSvc.includes("floral") || lowerSvc.includes("stage")) parentCat = "Decoration";
          else if (lowerSvc.includes("catering") || lowerSvc.includes("refreshment") || lowerSvc.includes("buffet") || lowerSvc.includes("food") || lowerSvc.includes("plate") || lowerSvc.includes("cater")) parentCat = "Catering";
          else if (lowerSvc.includes("photo") || lowerSvc.includes("video") || lowerSvc.includes("camera") || lowerSvc.includes("drone")) parentCat = "Photography & Videography";
          else if (lowerSvc.includes("music") || lowerSvc.includes("dj") || lowerSvc.includes("sound") || lowerSvc.includes("band") || lowerSvc.includes("entertainment") || lowerSvc.includes("show")) parentCat = "Entertainment";
          else if (lowerSvc.includes("invite") || lowerSvc.includes("invitation") || lowerSvc.includes("card")) parentCat = "Invitation Design";
        }

        let normalizedSvc = parentCat;
        if (parentCat.toLowerCase().includes("decor")) normalizedSvc = "Decoration";
        else if (parentCat.toLowerCase().includes("cater")) normalizedSvc = "Catering";
        else if (parentCat.toLowerCase().includes("photo") || parentCat.toLowerCase().includes("video")) normalizedSvc = "Photography & Videography";
        else if (parentCat.toLowerCase().includes("entertain")) normalizedSvc = "Entertainment";
        else if (parentCat.toLowerCase().includes("invite")) normalizedSvc = "Invitation Design";
        else if (parentCat.toLowerCase().includes("coord") || parentCat.toLowerCase().includes("plan")) normalizedSvc = "Event Coordination";

        const { data: svcRecs, error: svcError } = await supabase
          .from("gallery")
          .select("*")
          .eq("budget_tier", activeBudget)
          .eq("service_name", normalizedSvc);
          
        if (!svcError && svcRecs && svcRecs.length > 0) {
          setActiveRecommendations(svcRecs);
        } else {
          let mappedCategory = "Wedding Gallery";
          if (normalizedSvc === "Catering") mappedCategory = "Family Function Gallery";
          else if (normalizedSvc === "Entertainment") mappedCategory = "Birthday Gallery";
          
          const { data: catRecs } = await supabase
            .from("gallery")
            .select("*")
            .eq("budget_tier", activeBudget)
            .eq("category", mappedCategory);
          
          setActiveRecommendations(catRecs || []);
        }
      } catch (err) {
        console.error("Error fetching budget recommendations:", err);
      } finally {
        setActiveRecommendationsLoading(false);
      }
    }
    fetchRecs(configSvc);
  }, [activeConfigService, activeBudget, services]);


  const handleUserPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `user-ref/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, file);

      if (uploadError) {
        console.warn("Storage upload failed, using Base64 fallback:", uploadError.message);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setUploadedPhotoUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('user_uploads')
          .getPublicUrl(filePath);
        const url = publicUrlData?.publicUrl;
        if (url) {
          setUploadedPhotoUrl(url);
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('user_uploads').insert({
                event_key: 'Services Tab Booking',
                user_id: user.id,
                url,
                media_type: file.type.startsWith('video') ? 'video' : 'image',
                budget_tier: activeBudget
              });
            }
          } catch (tblErr) {
            console.error("Failed to insert row into user_uploads:", tblErr);
          }
        }
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddConfiguredService = () => {
    if (!activeConfigService) return;
    const parent = services.find(s => 
      (s.items || []).some((item: any) => 
        (typeof item === "string" ? item : item.name) === activeConfigService
      )
    );
    const price = getServicePrice(activeConfigService, activeBudget, parent?.name);
    const categoryName = parent?.name || "Other";
    
    setSelectedServices(prev => {
      const filtered = prev.filter(s => s.serviceName !== activeConfigService);
      return [...filtered, {
        serviceName: activeConfigService,
        category: categoryName,
        budget: activeBudget,
        price,
        referenceImage: uploadedPhotoUrl || undefined
      }];
    });

    setActiveConfigService(null);
    setUploadedPhotoUrl(null);
  };

  const handleRemoveService = (svcName: string) => {
    setSelectedServices(prev => prev.filter(s => s.serviceName !== svcName));
  };

  const handleBadgeClick = (subName: string, categoryName: string) => {
    const key = resolveDetailKey(categoryName, subName);
    const detail = subItemDetails[key];
    setSelectedSub({
      name: subName,
      category: categoryName,
      description: detail?.description || `Premium ${subName} solutions customized for your budget and space requirements. Contact our coordination desk to book.`,
      images: detail?.images || []
    });
  };

  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert("Please select at least one decoration or service.");
      return;
    }
    if (!eventDate) {
      alert("Event date is required.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to submit a booking.");
      return;
    }

    const totalCalculatedAmount = selectedItems.reduce((sum, it) => sum + it.price, 0);
    const chosenPaidAmount = advancePaymentOption === '50' ? totalCalculatedAmount * 0.5 : totalCalculatedAmount;
    const serviceStrings = selectedItems.map(item => `${item.name} (${item.subService})`);
    
    const details = {
      services_detailed: selectedItems.map(item => ({
        name: item.name,
        subService: item.subService,
        category: item.category,
        price: item.price,
        image: item.image,
        tagline: item.tagline
      })),
      payment_option: advancePaymentOption === '50' ? '50% Advance' : '100% Full',
      tracking_preparation: "Pending",
      tracking_setup: "Pending",
      tracking_execution: "Pending",
      timestamp: new Date().toISOString()
    };

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        event_name: eventType,
        event_date: eventDate,
        event_time: eventTime || null,
        guests_count: Number(guestCount) || null,
        venue: venueLocation || "TBD",
        status: "Pending",
        amount: `₹${totalCalculatedAmount.toLocaleString('en-IN')}`,
        paid: `₹${chosenPaidAmount.toLocaleString('en-IN')}`,
        services: serviceStrings,
        details: details
      })
      .select()
      .single();

    if (bookingError) {
      alert("Failed to submit booking: " + bookingError.message);
      return;
    }

    // Insert payment record into public.payments
    const paymentId = "PMT-" + Math.floor(Math.random() * 100000000);
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        id: paymentId,
        user_id: user.id,
        booking_id: bookingData.id,
        date: new Date().toLocaleDateString("en-IN"),
        amount: `₹${chosenPaidAmount.toLocaleString('en-IN')}`,
        status: "Paid",
        method: "Online Card Payment"
      });

    if (paymentError) {
      console.error("Failed to insert payment record:", paymentError.message);
    }

    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("Confetti error:", err);
    }
    
    setBookingSuccess(true);
    setSelectedItems([]);
    setShowOrderConfirmModal(false);
    setShowBookingSummary(false);
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: G.muted, textAlign: "center" }}>
        <SectionHead script="What We Provide" title="Our Services" />
        <p style={{ marginTop: "3rem" }}>Loading available services...</p>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div style={{ padding: "3rem 2rem", background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "14px", textAlign: "center", maxWidth: "600px", margin: "2rem auto" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: `2px solid ${G.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <CheckCircle size={32} style={{ color: G.gold }} />
        </div>
        <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.8rem", fontWeight: 700, margin: "0 0 0.5rem" }}>Booking Submitted Successfully!</h2>
        <p style={{ color: G.muted, fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Your service booking for <strong style={{ color: G.text }}>{eventType}</strong> has been received and is currently under review by our coordinators.
        </p>

        <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1.5rem", textAlign: "left", marginBottom: "2rem" }}>
          <p style={{ color: G.gold, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1rem" }}>Booking Summary</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.92rem", color: G.text }}>
            <div><span style={{ color: G.muted }}>Event Type:</span> {eventType}</div>
            <div><span style={{ color: G.muted }}>Date:</span> {eventDate} {eventTime && `@ ${eventTime}`}</div>
            <div><span style={{ color: G.muted }}>Venue:</span> {venueLocation || "TBD"}</div>
            <div><span style={{ color: G.muted }}>Guests:</span> {guestCount || "TBD"}</div>
            <div style={{ height: "1px", background: G.border, margin: "4px 0" }} />
            <div>
              <span style={{ color: G.muted }}>Selected Services:</span>
              <ul style={{ paddingLeft: "1.2rem", margin: "4px 0", color: G.text, fontSize: "0.88rem" }}>
                {selectedServices.map(s => (
                  <li key={s.serviceName}>{s.serviceName} ({s.budget.toUpperCase()} budget)</li>
                ))}
              </ul>
            </div>
            <div style={{ height: "1px", background: G.border, margin: "4px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
              <span>Total Cost:</span>
              <span style={{ color: G.gold }}>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <button onClick={() => { setBookingSuccess(false); setSelectedServices([]); }}
          style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.8rem 2.5rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <SectionHead script="What We Provide" title="Services" />

      <style>{`
        .services-category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .services-category-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .category-box {
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
        .category-box.active {
          border-color: #c9a84c;
          box-shadow: 0 0 12px rgba(201,168,76,0.15);
        }
        .category-box:hover {
          border-color: rgba(201,168,76,0.45);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Render either the 8-box Grid OR the Selected Category Details Panel (swapped view) */}
      <AnimatePresence mode="wait">
        {showBookingSummary ? (
          <motion.div
            key="booking-summary"
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            style={{ background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "14px", padding: "2rem", maxWidth: "800px", margin: "0 auto 3rem" }}
          >
            <button 
              onClick={() => setShowBookingSummary(false)}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: G.gold, cursor: "pointer", fontFamily: G.sans, fontSize: "0.85rem", marginBottom: "1.5rem", padding: 0 }}
            >
              <ChevronLeft size={16} /> Back to Services Directory
            </button>

            <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.4rem", fontWeight: 700, margin: "0 0 1rem", borderBottom: `1px solid ${G.border}`, paddingBottom: "0.5rem" }}>Your Selected Services & Decorations</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
              {selectedItems.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "10px 14px", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {item.image && (
                      <img src={item.image} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: `1px solid ${G.border}` }} />
                    )}
                    <div>
                      <p style={{ color: G.text, fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>{item.name}</p>
                      <p style={{ color: G.muted, fontSize: "0.8rem", margin: 0 }}>Sub-Service: {item.subService} ({item.category})</p>
                      <p style={{ color: G.muted, fontSize: "0.8rem", margin: 0 }}>Cost: {item.priceStr}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedItems(prev => prev.filter(it => it.id !== item.id))} style={{ background: "transparent", border: "none", color: "#e05555", cursor: "pointer", fontSize: "0.85rem" }}>Remove</button>
                </div>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowOrderConfirmModal(true); }}>
              <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.15rem", fontWeight: 700, margin: "0 0 1rem" }}>Provide Event Details</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Event Type *</label>
                  <select value={eventType} onChange={e => setEventType(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none" }}>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Family Function">Family Function</option>
                    <option value="Corporate Seminar">Corporate Seminar</option>
                    <option value="Corporate Gala Dinner">Corporate Gala Dinner</option>
                    <option value="Custom Celebration">Custom Celebration</option>
                  </select>
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
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Venue Location / Name</label>
                  <input placeholder="e.g. Maharaja Grand Hall, Bandra, Mumbai or TBD" value={venueLocation} onChange={e => setVenueLocation(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${G.border}`, paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
                <div>
                  <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>Total Package Cost</h4>
                  <p style={{ color: G.muted, fontSize: "0.78rem", margin: "2px 0 0" }}>All selected decorations & services</p>
                </div>
                <span style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.75rem", fontWeight: 700 }}>₹{selectedItems.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN')}</span>
              </div>

              <button type="submit" style={{ width: "100%", background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.85rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>
                Book Now
              </button>
            </form>
          </motion.div>
        ) : !activeCategoryTab ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="services-category-grid"
          >
            {(services.length > 0 ? services : DEFAULT_SERVICES).map((svc, i) => {
              const Icon = getIcon(svc.icon);
              const isAdded = selectedServices.some(s => s.category === svc.name);
              return (
                <motion.div 
                  key={svc.name}
                  onClick={() => setActiveCategoryTab(svc.name)}
                  className="category-box"
                  style={{
                    borderColor: isAdded ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.18)"
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {isAdmin && (
                    <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "4px" }}>
                      <button onClick={(e) => { e.stopPropagation(); handleEditService(svc); }} style={{ background: "none", border: "none", color: G.gold, cursor: "pointer", fontSize: "0.7rem" }}>✎</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteService(svc.name); }} style={{ background: "none", border: "none", color: "#e05555", cursor: "pointer", fontSize: "0.7rem" }}>✕</button>
                    </div>
                  )}
                  <Icon size={24} style={{ color: G.gold, marginBottom: "0.5rem" }} />
                  <h3 style={{ 
                    fontFamily: G.serif, 
                    color: G.text, 
                    fontSize: "0.95rem", 
                    margin: 0, 
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}>{svc.name}</h3>
                  <span style={{ color: G.muted, fontSize: "0.72rem", marginTop: "4px" }}>
                    {(svc.items || []).length} options
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          (() => {
            const activeSvc = services.find(s => s.name === activeCategoryTab) || DEFAULT_SERVICES.find(s => s.name === activeCategoryTab);
            if (!activeSvc) return null;

            if (activeSubService) {
              const subName = activeSubService.name;
              const catName = activeSubService.category;
              const key = resolveDetailKey(catName, subName);
              const detail = subItemDetails[key];
              
              let vendors: any[] = [];
              if (detail?.description) {
                try {
                  const parsed = JSON.parse(detail.description);
                  if (Array.isArray(parsed)) {
                    vendors = parsed;
                  } else if (parsed && typeof parsed === "object") {
                    vendors = [parsed];
                  }
                } catch (e) {
                  vendors = [{ vendorName: detail.description, description: "", price: "", images: detail.images || [] }];
                }
              }

              const handlePrev = () => {
                const subItems = activeSvc.items || [];
                const currentIndex = subItems.findIndex((it: any) => (typeof it === "string" ? it : it.name) === subName);
                if (currentIndex !== -1) {
                  const prevIndex = (currentIndex - 1 + subItems.length) % subItems.length;
                  const targetItem = subItems[prevIndex];
                  const targetName = typeof targetItem === "string" ? targetItem : targetItem.name;
                  setActiveSubService({ name: targetName, category: catName });
                }
              };

              const handleNext = () => {
                const subItems = activeSvc.items || [];
                const currentIndex = subItems.findIndex((it: any) => (typeof it === "string" ? it : it.name) === subName);
                if (currentIndex !== -1) {
                  const nextIndex = (currentIndex + 1) % subItems.length;
                  const targetItem = subItems[nextIndex];
                  const targetName = typeof targetItem === "string" ? targetItem : targetItem.name;
                  setActiveSubService({ name: targetName, category: catName });
                }
              };

              return (
                <motion.div 
                  key="portfolio-page"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", padding: "2rem", width: "100%", marginBottom: "3rem" }}
                >
                  <button 
                    onClick={() => setActiveSubService(null)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: G.gold, cursor: "pointer", fontFamily: G.sans, fontSize: "0.85rem", marginBottom: "1.5rem", padding: 0 }}
                  >
                    <ChevronLeft size={16} /> Back to Sub-Services
                  </button>

                  <div style={{ borderBottom: `1px solid ${G.border}`, paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
                    <span style={{ color: G.gold, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Sub-Service Portfolio</span>
                    <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.5rem", fontWeight: 700, margin: "3px 0 0 0" }}>{subName}</h3>
                    <p style={{ color: G.muted, fontSize: "0.85rem", marginTop: "6px", margin: "6px 0 0 0", lineHeight: 1.5 }}>
                      Explore exclusive designs, ratings, and pricing options for {subName}. Select items to build your custom bundle.
                    </p>
                  </div>

                  {(() => {
                    const optionItems: { itemId: string; name: string; img: string; desc: string; priceStr: string; priceVal: number }[] = [];
                    let optionCounter = 1;
                    vendors.forEach((vendorItem: any) => {
                      const vDesc = vendorItem.description || "Custom design option.";
                      const vPriceStr = vendorItem.price || "₹5,00,000";
                      const vPrice = parsePrice(vPriceStr);
                      const images = vendorItem.images || [];
                      
                      if (Array.isArray(images)) {
                        images.forEach((img: string) => {
                          if (img) {
                            const optionLabel = `Option ${optionCounter++}`;
                            const itemId = `${catName}::${subName}::${optionLabel}`;
                            optionItems.push({
                              itemId,
                              name: optionLabel,
                              img,
                              desc: vDesc,
                              priceStr: vPriceStr,
                              priceVal: vPrice
                            });
                          }
                        });
                      } else if (images && typeof images === "string") {
                        const optionLabel = `Option ${optionCounter++}`;
                        const itemId = `${catName}::${subName}::${optionLabel}`;
                        optionItems.push({
                          itemId,
                          name: optionLabel,
                          img: images,
                          desc: vDesc,
                          priceStr: vPriceStr,
                          priceVal: vPrice
                        });
                      }
                    });

                    if (optionItems.length === 0) {
                      return (
                        <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "2.5rem", textAlign: "center", color: G.muted, fontSize: "0.9rem" }}>
                          No designs or portfolio decorations uploaded for this sub-service yet.
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                        {optionItems.map((optItem, oIdx) => {
                          const ratingValue = (4.5 + (oIdx % 5) * 0.1).toFixed(1);
                          const isSelected = selectedItems.some(it => it.id === optItem.itemId);

                          return (
                            <div 
                              key={oIdx} 
                              style={{ 
                                background: "rgba(10,8,4,0.4)", 
                                border: `1.5px solid ${isSelected ? G.gold : G.border}`, 
                                borderRadius: "10px", 
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                transition: "all 0.2s"
                              }}
                            >
                              <div style={{ height: "150px", position: "relative", background: "#000" }}>
                                <img src={optItem.img} alt={optItem.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(10,8,4,0.85)", border: `1px solid ${G.border}`, borderRadius: "4px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: G.gold }}>
                                  <Star size={12} fill={G.gold} color={G.gold} /> {ratingValue}
                                </div>
                              </div>
                              <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                  <h5 style={{ color: G.text, fontSize: "0.95rem", fontWeight: 700, margin: "0 0 6px 0" }}>{optItem.name}</h5>
                                  <p style={{ color: G.muted, fontSize: "0.78rem", margin: "0 0 12px 0", lineHeight: 1.4 }}>{optItem.desc}</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", borderTop: `1px solid rgba(201,168,76,0.08)`, paddingTop: "10px", marginTop: "10px" }}>
                                  <span style={{ color: G.gold, fontWeight: 700, fontSize: "0.95rem" }}>{optItem.priceStr}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isSelected) {
                                        setSelectedItems(prev => prev.filter(it => it.id !== optItem.itemId));
                                      } else {
                                        setSelectedItems(prev => [
                                          ...prev, 
                                          {
                                            id: optItem.itemId,
                                            name: optItem.name,
                                            subService: subName,
                                            category: catName,
                                            price: optItem.priceVal,
                                            priceStr: optItem.priceStr,
                                            image: optItem.img,
                                            tagline: optItem.desc
                                          }
                                        ]);
                                        window.alert("Service selected successfully!");
                                      }
                                    }}
                                    style={{ 
                                      background: isSelected ? "rgba(201,168,76,0.15)" : `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, 
                                      color: isSelected ? G.gold : "#0a0804", 
                                      border: isSelected ? `1px solid ${G.gold}` : "none", 
                                      padding: "6px 14px", 
                                      borderRadius: "4px", 
                                      fontSize: "0.8rem", 
                                      fontWeight: 700, 
                                      cursor: "pointer", 
                                      fontFamily: G.sans 
                                    }}
                                  >
                                    {isSelected ? "Selected" : "Select"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  <div style={{ display: "flex", justifyContent: "center", borderTop: `1px solid ${G.border}`, paddingTop: "1.5rem", marginTop: "2rem" }}>
                    <button 
                      onClick={() => setActiveSubService(null)}
                      style={{ 
                        background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, 
                        color: "#0a0804", 
                        border: "none", 
                        padding: "0.65rem 2.5rem", 
                        borderRadius: "6px", 
                        fontSize: "0.85rem", 
                        fontWeight: 700, 
                        cursor: "pointer", 
                        fontFamily: G.sans,
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              );
            }

            const items: any[] = activeSvc.items || [];
            const isAdded = selectedServices.some(s => s.serviceName === activeSvc.name);

            return (
              <motion.div key={activeCategoryTab}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "14px", padding: "1.75rem", marginBottom: "3rem" }}>
                
                <button 
                  onClick={() => setActiveCategoryTab(null)}
                  style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: G.gold, cursor: "pointer", fontFamily: G.sans, fontSize: "0.85rem", marginBottom: "1.5rem", padding: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#e8cc84"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = G.gold; }}
                >
                  <ChevronLeft size={16} /> Back to Services
                </button>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap", borderBottom: `1px solid ${G.border}`, paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <span style={{ color: G.gold, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Category overview</span>
                    <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.35rem", fontWeight: 700, margin: "3px 0 0 0" }}>{activeSvc.name}</h3>
                    <p style={{ color: G.muted, fontSize: "0.85rem", marginTop: "6px", lineHeight: 1.5, margin: "6px 0 0 0" }}>{activeSvc.tagline}</p>
                  </div>
                </div>

            <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "0.95rem", marginBottom: "1rem", fontWeight: 600 }}>Included Events & Services</h4>
            {items.length === 0 ? (
              <p style={{ color: G.muted, fontSize: "0.8rem", fontStyle: "italic", margin: 0 }}>No sub-items configured for this category yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {items.map((item: any) => {
                  const name = typeof item === "string" ? item : item.name;
                  const desc = typeof item === "string" ? "" : item.desc;
                  const img = typeof item === "string" ? "" : item.img;
                  
                  const key = resolveDetailKey(activeSvc.name, name);
                  const detail = subItemDetails[key];
                  const isSelectedSubService = selectedItems.some(
                    it => it.subService === name && it.category === activeSvc.name
                  );

                  let vendors: any[] = [];
                  if (detail?.description) {
                    try {
                      const parsed = JSON.parse(detail.description);
                      if (Array.isArray(parsed)) {
                        vendors = parsed;
                      } else if (parsed && typeof parsed === "object") {
                        vendors = [parsed];
                      }
                    } catch (e) {
                      vendors = [{ vendorName: detail.description, description: "", price: "", images: detail.images || [] }];
                    }
                  }

                  return (
                    <motion.div key={name}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveSubService({ name, category: activeSvc.name })}
                      style={{
                        background: isSelectedSubService ? "rgba(234,179,8,0.12)" : G.surface,
                        border: `1.5px solid ${isSelectedSubService ? "#eab308" : G.border}`,
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1.25rem",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#eab308"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = isSelectedSubService ? "#eab308" : G.border; }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        {img && (
                          <img src={img} alt={name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px", border: `1px solid ${G.border}`, flexShrink: 0 }} />
                        )}
                        <div>
                          <h5 style={{ fontFamily: G.serif, color: isSelectedSubService ? "#eab308" : G.text, fontSize: "0.95rem", margin: "0 0 0.25rem 0", fontWeight: 600 }}>
                            {name} {isSelectedSubService && <span style={{ color: "#eab308", fontSize: "0.85rem", marginLeft: "4px" }}>✓</span>}
                          </h5>
                          {desc && (
                            <p style={{ color: G.muted, fontSize: "0.76rem", lineHeight: 1.4, margin: 0 }}>{desc}</p>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {isAdmin && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleEditSubService(activeSvc.name, item); }} style={{ background: "none", border: "none", color: G.gold, cursor: "pointer", fontSize: "0.8rem" }}>Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteSubService(activeSvc.name, name); }} style={{ background: "none", border: "none", color: "#e05555", cursor: "pointer", fontSize: "0.8rem" }}>Delete</button>
                          </>
                        )}
                        <span style={{ color: isSelectedSubService ? "#eab308" : G.gold, fontSize: "0.72rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                          View Portfolio <ArrowRight size={12} />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {!isAdmin && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${G.border}` }}>
                <button 
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      alert("Please select at least one decoration from the View Portfolio screens first.");
                      return;
                    }
                    setShowBookingSummary(true);
                  }}
                  style={{ 
                    background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, 
                    color: "#0a0804", 
                    border: "none", 
                    padding: "0.6rem 1.5rem", 
                    borderRadius: "6px", 
                    fontSize: "0.85rem", 
                    fontWeight: 700, 
                    cursor: "pointer", 
                    fontFamily: G.sans,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  Book Now
                </button>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={handlePrevService}
                    style={{ 
                      background: "rgba(201,168,76,0.08)", 
                      border: `1px solid ${G.border}`, 
                      color: G.gold, 
                      padding: "0.6rem 1.5rem", 
                      borderRadius: "6px", 
                      fontSize: "0.85rem", 
                      fontWeight: 700, 
                      cursor: "pointer", 
                      fontFamily: G.sans,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.18)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
                  >
                    ← Previous Service
                  </button>

                  <button 
                    onClick={handleNextService}
                    style={{ 
                      background: "rgba(201,168,76,0.08)", 
                      border: `1px solid ${G.border}`, 
                      color: G.gold, 
                      padding: "0.6rem 1.5rem", 
                      borderRadius: "6px", 
                      fontSize: "0.85rem", 
                      fontWeight: 700, 
                      cursor: "pointer", 
                      fontFamily: G.sans,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.18)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
                  >
                    Next Service →
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        );
      })()
      )}
      </AnimatePresence>

      {/* Inline Configuration Panel */}
      {activeConfigService && (
        <div style={{ background: G.surface, border: `1.5px solid ${G.gold}`, borderRadius: "14px", padding: "1.75rem", marginBottom: "3rem", maxWidth: "800px", margin: "0 auto 3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${G.border}`, paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
            <div>
              <span style={{ color: G.gold, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Service Configuration</span>
              <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.25rem", margin: "2px 0 0 0", fontWeight: 700 }}>{activeConfigService} ({activeBudget.toUpperCase()} budget)</h4>
            </div>
            <button onClick={() => { setActiveConfigService(null); setUploadedPhotoUrl(null); }} style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.muted, width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
          </div>

          {/* Recommendations */}
          <label style={{ display: "block", color: G.gold, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>Recommendations ({activeBudget} budget)</label>
          {activeRecommendationsLoading ? (
            <div style={{ color: G.muted, fontSize: "0.8rem", padding: "1rem", textAlign: "center" }}>Loading recommendations...</div>
          ) : activeRecommendations.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px", maxHeight: "180px", overflowY: "auto", marginBottom: "1.5rem", paddingRight: "4px" }}>
              {activeRecommendations.map((rec, idx) => (
                <div key={idx} style={{ border: `1px solid ${G.border}`, borderRadius: "6px", overflow: "hidden", position: "relative", height: "90px" }}>
                  {rec.media_type === "video" ? (
                    <video src={rec.url} muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <img src={rec.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  {rec.caption && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", padding: "2px 4px", fontSize: "0.6rem", color: "#fff", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {rec.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1rem", color: G.muted, fontSize: "0.75rem", textAlign: "center", marginBottom: "1.5rem" }}>
              No recommendations uploaded for this budget yet.
            </div>
          )}

          {/* Photo Upload */}
          <label style={{ display: "block", color: G.gold, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>Upload Custom Reference Photo</label>
          <div style={{ marginBottom: "1.5rem" }}>
            <input type="file" accept="image/*" onChange={handleUserPhotoUpload} style={{ display: "none" }} id="user-service-photo" />
            <label htmlFor="user-service-photo" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "0.8rem 1rem", background: "transparent", border: `1.5px dashed ${G.border}`, borderRadius: "8px", color: G.muted, cursor: "pointer", fontSize: "0.85rem", fontFamily: G.sans, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G.gold; e.currentTarget.style.color = G.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.color = G.muted; }}>
              <Upload size={16} style={{ color: G.gold }} />
              {uploadingPhoto ? "Uploading..." : uploadedPhotoUrl ? "Photo Uploaded Successfully!" : "Choose Reference Image"}
            </label>
            {uploadedPhotoUrl && (
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={uploadedPhotoUrl} alt="Preview" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: `1px solid ${G.border}` }} />
                <button type="button" onClick={() => setUploadedPhotoUrl(null)} style={{ background: "transparent", border: "none", color: "#f44336", cursor: "pointer", fontSize: "0.8rem" }}>Remove</button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleAddConfiguredService} type="button"
              style={{ flex: 1, background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.75rem", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>
              Confirm Service Configuration
            </button>
            <button onClick={() => { setActiveConfigService(null); setUploadedPhotoUrl(null); }} type="button"
              style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text, padding: "0.75rem 1.2rem", borderRadius: "8px", fontSize: "0.9rem", cursor: "pointer", fontFamily: G.sans }}>
              Cancel
            </button>
          </div>
        </div>
      )}



      {/* Order Details & Payment Modal */}
      {showOrderConfirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.9)", backdropFilter: "blur(10px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div style={{ background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "14px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", padding: "2rem", color: G.text, position: "relative" }}>
            <button onClick={() => setShowOrderConfirmModal(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: `1px solid ${G.border}`, color: G.muted, width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>✕</button>
            
            <h3 style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.35rem", fontWeight: 700, margin: "0 0 1.25rem 0", borderBottom: `1px solid ${G.border}`, paddingBottom: "0.5rem" }}>Order Details & Payment</h3>

            {/* Event Info Summary */}
            <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1rem", marginBottom: "1.25rem", fontSize: "0.85rem" }}>
              <p style={{ color: G.gold, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.5rem 0" }}>Event Summary</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", color: G.text }}>
                <div><span style={{ color: G.muted }}>Type:</span> {eventType}</div>
                <div><span style={{ color: G.muted }}>Date:</span> {eventDate}</div>
                <div><span style={{ color: G.muted }}>Time:</span> {eventTime || "TBD"}</div>
                <div><span style={{ color: G.muted }}>Guests:</span> {guestCount || "TBD"}</div>
                <div style={{ gridColumn: "span 2" }}><span style={{ color: G.muted }}>Venue:</span> {venueLocation || "TBD"}</div>
              </div>
            </div>

            {/* Selected Items */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: G.gold, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.5rem 0" }}>Selected Services & Decorations</p>
              <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", paddingRight: "4px" }}>
                {selectedItems.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: "4px", border: `1px solid ${G.border}` }}>
                    <span style={{ color: G.text }}>{item.name} <span style={{ color: G.muted, fontSize: "0.74rem" }}>({item.subService})</span></span>
                    <span style={{ color: G.gold, fontWeight: 600 }}>{item.priceStr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown & Payment Options */}
            {(() => {
              const totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);
              const halfAmount = totalAmount * 0.5;
              const dueAmount = advancePaymentOption === '50' ? halfAmount : totalAmount;
              const remainingAmount = totalAmount - dueAmount;

              return (
                <>
                  <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: "1rem", marginBottom: "1.5rem" }}>
                    <p style={{ color: G.gold, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem 0" }}>Select Payment Option</p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <label style={{ flex: 1, display: "flex", flexDirection: "column", background: advancePaymentOption === '50' ? "rgba(201,168,76,0.1)" : "transparent", border: `1.5px solid ${advancePaymentOption === '50' ? G.gold : G.border}`, borderRadius: "8px", padding: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <input type="radio" name="paymentOpt" checked={advancePaymentOption === '50'} onChange={() => setAdvancePaymentOption('50')} style={{ accentColor: G.gold }} />
                          <span style={{ color: G.text, fontSize: "0.85rem", fontWeight: 700 }}>Pay 50% Advance</span>
                        </div>
                        <span style={{ color: G.gold, fontSize: "0.95rem", fontWeight: 700, paddingLeft: "20px" }}>₹{halfAmount.toLocaleString('en-IN')}</span>
                      </label>

                      <label style={{ flex: 1, display: "flex", flexDirection: "column", background: advancePaymentOption === '100' ? "rgba(201,168,76,0.1)" : "transparent", border: `1.5px solid ${advancePaymentOption === '100' ? G.gold : G.border}`, borderRadius: "8px", padding: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <input type="radio" name="paymentOpt" checked={advancePaymentOption === '100'} onChange={() => setAdvancePaymentOption('100')} style={{ accentColor: G.gold }} />
                          <span style={{ color: G.text, fontSize: "0.85rem", fontWeight: 700 }}>Pay 100% Full</span>
                        </div>
                        <span style={{ color: G.gold, fontSize: "0.95rem", fontWeight: 700, paddingLeft: "20px" }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Details Form */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
                    <p style={{ color: G.gold, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CreditCard size={14} /> Credit/Debit Card Details
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div style={{ gridColumn: "span 2" }}>
                        <input required placeholder="Cardholder Name" style={{ width: "100%", padding: "0.55rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <input required placeholder="Card Number (16 digits)" maxLength={19} style={{ width: "100%", padding: "0.55rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <input required placeholder="MM/YY" maxLength={5} style={{ width: "100%", padding: "0.55rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <input required type="password" placeholder="CVV" maxLength={3} style={{ width: "100%", padding: "0.55rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${G.border}`, paddingTop: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                      <p style={{ color: G.muted, fontSize: "0.76rem", margin: 0 }}>Total Amount: ₹{totalAmount.toLocaleString('en-IN')}</p>
                      <p style={{ color: G.text, fontSize: "0.85rem", fontWeight: 700, margin: "2px 0 0 0" }}>Due Now: <span style={{ color: G.gold }}>₹{dueAmount.toLocaleString('en-IN')}</span></p>
                      {remainingAmount > 0 && (
                        <p style={{ color: G.muted, fontSize: "0.76rem", margin: "2px 0 0 0" }}>Remaining Balance: ₹{remainingAmount.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                    <button 
                      onClick={handleConfirmBooking}
                      style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.75rem 2rem", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}
                    >
                      Pay & Confirm Booking
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Budget Popup */}
      {showBudgetPopup && tempConfigService && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.9)", backdropFilter: "blur(10px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={() => setShowBudgetPopup(false)}>
          <div style={{ background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "14px", width: "100%", maxWidth: "450px", overflow: "hidden", cursor: "default" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ color: G.gold, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Select Budget</span>
                <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.25rem", margin: "2px 0 0 0", fontWeight: 700 }}>{tempConfigService}</h3>
              </div>
              <button onClick={() => setShowBudgetPopup(false)} style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.muted, width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                {(['low', 'medium', 'high'] as const).map(b => {
                  const priceVal = getServicePrice(tempConfigService, b);
                  return (
                    <button key={b} onClick={() => {
                      setActiveConfigService(tempConfigService);
                      setActiveBudget(b);
                      setShowBudgetPopup(false);
                      setUploadedPhotoUrl(null);
                    }} type="button"
                      style={{
                        background: "rgba(201,168,76,0.06)",
                        border: `1px solid ${G.border}`,
                        color: G.text,
                        padding: "14px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily: G.sans,
                        transition: "all 0.2s",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = G.gold; e.currentTarget.style.background = "rgba(201,168,76,0.12)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.background = "rgba(201,168,76,0.06)"; }}
                    >
                      <span style={{ fontSize: "0.95rem", fontWeight: 700, textTransform: "capitalize" }}>{b} Budget</span>
                      <span style={{ fontSize: "0.9rem", color: G.gold, fontWeight: 600 }}>₹{priceVal.toLocaleString('en-IN')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Service Modal */}
      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        onClose={() => { setIsEditServiceModalOpen(false); setEditingService(null); }}
        service={editingService}
        onSaved={loadServices}
      />

      {/* Admin Edit Sub-Service Modal */}
      <EditSubServiceModal
        isOpen={isEditSubServiceModalOpen}
        onClose={() => { setIsEditSubServiceModalOpen(false); setEditingSubService(null); setEditingSubServiceParent(null); }}
        parentService={editingSubServiceParent}
        subService={editingSubService}
        onSaved={loadServices}
      />
    </div>
  );
}

