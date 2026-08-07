import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { Plus, Edit3, Trash2, X, Check, Folder, Sparkles } from "lucide-react";

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
};

const DEFAULT_TIERS = [
  {
    name: "Silver Package",
    price: "₹50,000 – ₹1,50,000",
    features: ["Venue Assistance", "Basic Stage Decoration", "Floral Decoration", "Basic Photography"]
  },
  {
    name: "Gold Package",
    price: "₹1,50,000 – ₹3,00,000",
    includes_note: "Includes everything in Silver, plus:",
    features: ["Theme Decoration", "Professional Photography", "Videography", "DJ"]
  },
  {
    name: "Platinum Package",
    price: "₹3,00,000+",
    includes_note: "Includes everything in Gold, plus:",
    features: ["Luxury Decoration", "Drone Photography", "Premium Catering", "Complete Event Coordination"]
  }
];

const DEFAULT_PACKAGES = [
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

export function AdminPackagesPanel() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit / Add Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [currentPkg, setCurrentPkg] = useState(null); // null means adding a new package
  
  // Form fields
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `admin-uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, file);
        
      if (error) {
        // Fallback to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImg(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('user_uploads')
          .getPublicUrl(filePath);
        setImg(publicUrlData?.publicUrl || "");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };
  
  // Tiers Form Fields
  const [silverPrice, setSilverPrice] = useState("");
  const [silverFeatures, setSilverFeatures] = useState([]);
  const [newSilverFeature, setNewSilverFeature] = useState("");

  const [goldPrice, setGoldPrice] = useState("");
  const [goldNote, setGoldNote] = useState("");
  const [goldFeatures, setGoldFeatures] = useState([]);
  const [newGoldFeature, setNewGoldFeature] = useState("");

  const [platinumPrice, setPlatinumPrice] = useState("");
  const [platinumNote, setPlatinumNote] = useState("");
  const [platinumFeatures, setPlatinumFeatures] = useState([]);
  const [newPlatinumFeature, setNewPlatinumFeature] = useState("");

  const loadPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("event_packages")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setPackages(data);
      } else {
        // Try auto-seeding if empty
        try {
          const { error: seedError } = await supabase
            .from("event_packages")
            .insert(DEFAULT_PACKAGES);
          
          if (!seedError) {
            const { data: refetched } = await supabase
              .from("event_packages")
              .select("*")
              .order("name", { ascending: true });
            if (refetched && refetched.length > 0) {
              setPackages(refetched);
              return;
            }
          }
        } catch (se) {
          console.warn("Auto-seeding failed:", se);
        }
        setPackages(DEFAULT_PACKAGES);
      }
    } catch (err) {
      console.warn("Failed to load packages from database, using local fallback defaults:", err.message);
      setPackages(DEFAULT_PACKAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleOpenEdit = (pkg) => {
    setCurrentPkg(pkg);
    setName(pkg.name);
    setImg(pkg.img);

    const sTier = pkg.tiers.find(t => t.name.toLowerCase().includes("silver")) || DEFAULT_TIERS[0];
    const gTier = pkg.tiers.find(t => t.name.toLowerCase().includes("gold")) || DEFAULT_TIERS[1];
    const pTier = pkg.tiers.find(t => t.name.toLowerCase().includes("platinum")) || DEFAULT_TIERS[2];

    setSilverPrice(sTier.price);
    setSilverFeatures([...sTier.features]);
    setNewSilverFeature("");

    setGoldPrice(gTier.price);
    setGoldNote(gTier.includes_note || "");
    setGoldFeatures([...gTier.features]);
    setNewGoldFeature("");

    setPlatinumPrice(pTier.price);
    setPlatinumNote(pTier.includes_note || "");
    setPlatinumFeatures([...pTier.features]);
    setNewPlatinumFeature("");

    setIsOpen(true);
  };

  const handleOpenAdd = () => {
    setCurrentPkg(null);
    setName("");
    setImg("https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop&auto=format");

    setSilverPrice(DEFAULT_TIERS[0].price);
    setSilverFeatures([...DEFAULT_TIERS[0].features]);
    setNewSilverFeature("");

    setGoldPrice(DEFAULT_TIERS[1].price);
    setGoldNote(DEFAULT_TIERS[1].includes_note || "");
    setGoldFeatures([...DEFAULT_TIERS[1].features]);
    setNewGoldFeature("");

    setPlatinumPrice(DEFAULT_TIERS[2].price);
    setPlatinumNote(DEFAULT_TIERS[2].includes_note || "");
    setPlatinumFeatures([...DEFAULT_TIERS[2].features]);
    setNewPlatinumFeature("");

    setIsOpen(true);
  };

  const handleAddFeature = (tier) => {
    if (tier === "silver" && newSilverFeature.trim()) {
      setSilverFeatures(prev => [...prev, newSilverFeature.trim()]);
      setNewSilverFeature("");
    } else if (tier === "gold" && newGoldFeature.trim()) {
      setGoldFeatures(prev => [...prev, newGoldFeature.trim()]);
      setNewGoldFeature("");
    } else if (tier === "platinum" && newPlatinumFeature.trim()) {
      setPlatinumFeatures(prev => [...prev, newPlatinumFeature.trim()]);
      setNewPlatinumFeature("");
    }
  };

  const handleRemoveFeature = (tier, index) => {
    if (tier === "silver") {
      setSilverFeatures(prev => prev.filter((_, idx) => idx !== index));
    } else if (tier === "gold") {
      setGoldFeatures(prev => prev.filter((_, idx) => idx !== index));
    } else if (tier === "platinum") {
      setPlatinumFeatures(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedTiers = [
      {
        name: "Silver Package",
        price: silverPrice,
        features: silverFeatures
      },
      {
        name: "Gold Package",
        price: goldPrice,
        includes_note: goldNote || undefined,
        features: goldFeatures
      },
      {
        name: "Platinum Package",
        price: platinumPrice,
        includes_note: platinumNote || undefined,
        features: platinumFeatures
      }
    ];

    const payload = {
      name: name.trim(),
      img: img.trim(),
      tiers: updatedTiers
    };

    try {
      if (currentPkg && currentPkg.id) {
        // Edit Mode
        const { error } = await supabase
          .from("event_packages")
          .update(payload)
          .eq("id", currentPkg.id);

        if (error) throw error;
        alert("Package category updated successfully!");
      } else {
        // Add Mode
        const { error } = await supabase
          .from("event_packages")
          .insert(payload);

        if (error) throw error;
        alert("Package category created successfully!");
      }
      setIsOpen(false);
      loadPackages();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save package: " + err.message);
    }
  };

  const handleDelete = async (id, pkgName) => {
    if (!window.confirm(`Are you sure you want to delete "${pkgName}"?`)) return;

    try {
      const { error } = await supabase
        .from("event_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      alert("Deleted package successfully!");
      loadPackages();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <span style={{ color: G.gold, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Management</span>
          <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.5rem", fontWeight: 700, margin: "2px 0 0" }}>Manage Event Packages</h2>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", borderRadius: "4px", padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px" }}
        >
          <Plus size={14} /> Add Event Type
        </button>
      </div>

      {loading ? (
        <p style={{ color: G.muted, fontSize: "0.88rem" }}>Loading packages management data...</p>
      ) : packages.length === 0 ? (
        <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "3rem", textAlign: "center", color: G.muted }}>
          <Folder size={32} style={{ color: G.gold, marginBottom: "0.75rem", opacity: 0.6 }} />
          <p style={{ fontSize: "0.9rem", margin: 0 }}>No package event types in database. Try seeding default categories by reloading or clicking "Add Event Type"!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {packages.map(pkg => (
            <div key={pkg.id} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ height: "140px", position: "relative" }}>
                  <img src={pkg.img} alt={pkg.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.9), transparent 70%)" }} />
                  <h3 style={{ position: "absolute", bottom: "0.85rem", left: "1.25rem", fontFamily: G.serif, color: G.text, fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                    {pkg.name}
                  </h3>
                </div>
                
                {/* Preview of Tiers Pricing */}
                <div style={{ padding: "1.25rem" }}>
                  <p style={{ color: G.gold, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.6rem" }}>Tier Prices Preview</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {pkg.tiers.map(t => (
                      <div key={t.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: G.text, borderBottom: `1px solid rgba(201,168,76,0.05)`, paddingBottom: "4px" }}>
                        <span style={{ color: G.muted }}>{t.name}</span>
                        <span style={{ fontWeight: 600 }}>{t.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  style={{ flex: 1, background: "rgba(201,168,76,0.1)", border: `1px solid ${G.gold}`, color: G.gold, borderRadius: "4px", padding: "0.45rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
                >
                  <Edit3 size={13} /> Edit Details
                </button>
                <button
                  onClick={() => pkg.id && handleDelete(pkg.id, pkg.name)}
                  style={{ background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.3)", color: "#f87171", borderRadius: "4px", padding: "0.45rem 0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflowY: "auto" }}>
          <div style={{ background: "#14100a", border: `1.5px solid ${G.gold}`, borderRadius: "14px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            
            {/* Modal Header */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                {currentPkg ? `Edit Package: ${currentPkg.name}` : "Add New Event Package"}
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: "1.5rem" }}>
              
              {/* Category Info */}
              <h4 style={{ color: G.gold, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem", borderBottom: `1px solid rgba(201,168,76,0.1)`, paddingBottom: "4px" }}>Event Info</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", marginBottom: "4px" }}>Event Type Name *</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Wedding Packages" style={{ width: "100%", padding: "0.6rem 0.8rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: G.muted, fontSize: "0.75rem", marginBottom: "4px" }}>Upload Cover Image</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} id="package-photo-upload" />
                    <label htmlFor="package-photo-upload" style={{ background: "rgba(201,168,76,0.12)", border: `1px solid ${G.border}`, color: G.gold, borderRadius: "6px", padding: "0.55rem 1.25rem", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, display: "inline-block", fontFamily: G.sans }}>
                      {uploading ? "Uploading..." : "Choose File"}
                    </label>
                    <input readOnly type="text" value={img ? (img.startsWith("data:") ? "Local Photo Selected (Base64)" : img.substring(0, 45) + "...") : "No image selected"} style={{ flex: 1, padding: "0.6rem 0.8rem", background: "rgba(10,8,4,0.4)", border: `1px solid ${G.border}`, borderRadius: "6px", color: G.muted, fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>

              {/* TIER FORMS */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                
                {/* 1. Silver Tier */}
                <div style={{ border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1.25rem", background: "rgba(10,8,4,0.3)" }}>
                  <h4 style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.75rem" }}>🥉 Silver Package</h4>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "3px" }}>Price Range Text *</label>
                    <input required type="text" value={silverPrice} onChange={e => setSilverPrice(e.target.value)} placeholder="e.g. ₹2,00,000 – ₹5,00,000" style={{ width: "100%", padding: "0.5rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "4px" }}>Features List</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                      {silverFeatures.map((f, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, borderRadius: "4px", padding: "2px 8px", fontSize: "0.75rem", color: G.text }}>
                          {f}
                          <button type="button" onClick={() => handleRemoveFeature("silver", i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}>×</button>
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input type="text" value={newSilverFeature} onChange={e => setNewSilverFeature(e.target.value)} placeholder="Add a feature..." style={{ flex: 1, padding: "0.4rem 0.65rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "4px", color: G.text, fontSize: "0.78rem", outline: "none" }} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddFeature("silver"))} />
                      <button type="button" onClick={() => handleAddFeature("silver")} style={{ background: "rgba(201,168,76,0.15)", border: `1px solid ${G.gold}`, color: G.gold, borderRadius: "4px", padding: "0.3rem 0.75rem", fontSize: "0.78rem", cursor: "pointer" }}>Add</button>
                    </div>
                  </div>
                </div>

                {/* 2. Gold Tier */}
                <div style={{ border: `1px solid ${G.gold}55`, borderRadius: "8px", padding: "1.25rem", background: "rgba(201,168,76,0.02)" }}>
                  <h4 style={{ color: G.gold, fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.75rem" }}>🥈 Gold Package (Highlighted)</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "3px" }}>Price Range Text *</label>
                      <input required type="text" value={goldPrice} onChange={e => setGoldPrice(e.target.value)} placeholder="e.g. ₹5,00,000 – ₹10,00,000" style={{ width: "100%", padding: "0.5rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "3px" }}>Includes Note (Optional)</label>
                      <input type="text" value={goldNote} onChange={e => setGoldNote(e.target.value)} placeholder="e.g. Includes everything in Silver, plus:" style={{ width: "100%", padding: "0.5rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "4px" }}>Features List</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                      {goldFeatures.map((f, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, borderRadius: "4px", padding: "2px 8px", fontSize: "0.75rem", color: G.text }}>
                          {f}
                          <button type="button" onClick={() => handleRemoveFeature("gold", i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}>×</button>
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input type="text" value={newGoldFeature} onChange={e => setNewGoldFeature(e.target.value)} placeholder="Add a feature..." style={{ flex: 1, padding: "0.4rem 0.65rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "4px", color: G.text, fontSize: "0.78rem", outline: "none" }} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddFeature("gold"))} />
                      <button type="button" onClick={() => handleAddFeature("gold")} style={{ background: "rgba(201,168,76,0.15)", border: `1px solid ${G.gold}`, color: G.gold, borderRadius: "4px", padding: "0.3rem 0.75rem", fontSize: "0.78rem", cursor: "pointer" }}>Add</button>
                    </div>
                  </div>
                </div>

                {/* 3. Platinum Tier */}
                <div style={{ border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1.25rem", background: "rgba(10,8,4,0.3)" }}>
                  <h4 style={{ color: "#e2e8f0", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.75rem" }}>🥇 Platinum Package</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "3px" }}>Price Range Text *</label>
                      <input required type="text" value={platinumPrice} onChange={e => setPlatinumPrice(e.target.value)} placeholder="e.g. ₹10,00,000+" style={{ width: "100%", padding: "0.5rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "3px" }}>Includes Note (Optional)</label>
                      <input type="text" value={platinumNote} onChange={e => setPlatinumNote(e.target.value)} placeholder="e.g. Includes everything in Gold, plus:" style={{ width: "100%", padding: "0.5rem 0.75rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", color: G.muted, fontSize: "0.72rem", marginBottom: "4px" }}>Features List</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                      {platinumFeatures.map((f, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(201,168,76,0.08)", border: `1px solid ${G.border}`, borderRadius: "4px", padding: "2px 8px", fontSize: "0.75rem", color: G.text }}>
                          {f}
                          <button type="button" onClick={() => handleRemoveFeature("platinum", i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}>×</button>
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input type="text" value={newPlatinumFeature} onChange={e => setNewPlatinumFeature(e.target.value)} placeholder="Add a feature..." style={{ flex: 1, padding: "0.4rem 0.65rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "4px", color: G.text, fontSize: "0.78rem", outline: "none" }} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddFeature("platinum"))} />
                      <button type="button" onClick={() => handleAddFeature("platinum")} style={{ background: "rgba(201,168,76,0.15)", border: `1px solid ${G.gold}`, color: G.gold, borderRadius: "4px", padding: "0.3rem 0.75rem", fontSize: "0.78rem", cursor: "pointer" }}>Add</button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "2rem", borderTop: `1px solid ${G.border}`, paddingTop: "1.25rem" }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{ background: "none", border: `1px solid ${G.border}`, color: G.text, borderRadius: "4px", padding: "0.55rem 1.5rem", cursor: "pointer", fontSize: "0.85rem", fontFamily: G.sans }}>
                  Cancel
                </button>
                <button type="submit" style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", borderRadius: "4px", padding: "0.55rem 2rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, fontFamily: G.sans }}>
                  Save Package
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

