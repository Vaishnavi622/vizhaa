import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Clock, ChevronLeft, CheckCircle, ArrowRight, X, Car, BedDouble, Camera, Sparkles, ChevronDown, Upload, Image, MapPin, Palette, Utensils, Music, Mail, Gift } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import confetti from "canvas-confetti";

const G = {
  bg: "#0a0804", surface: "rgba(20, 16, 10, 0.72)", surface2: "rgba(26, 20, 8, 0.55)",
  border: "rgba(201,168,76,0.18)", gold: "#c9a84c",
  text: "#f5ead6", muted: "#9a8060",
  serif: "'Playfair Display', serif", sans: "'Raleway', sans-serif", script: "'Great Vibes', cursive",
};

const svcIcon = (svc) => {
  const s = svc.toLowerCase();
  if (s.includes("venue") || s.includes("hall")) return <MapPin size={14} />;
  if (s.includes("decor") || s.includes("floral") || s.includes("stage")) return <Palette size={14} />;
  if (s.includes("catering") || s.includes("refreshment") || s.includes("buffet") || s.includes("snack")) return <Utensils size={14} />;
  if (s.includes("photo") || s.includes("video") || s.includes("camera") || s.includes("drone")) return <Camera size={14} />;
  if (s.includes("music") || s.includes("dj") || s.includes("sound") || s.includes("band") || s.includes("entertainment")) return <Music size={14} />;
  if (s.includes("invite") || s.includes("invitation") || s.includes("card")) return <Mail size={14} />;
  if (s.includes("gift") || s.includes("return")) return <Gift size={14} />;
  return <Sparkles size={14} />;
};

/* ─── UI ATOMS ─── */

function ModalWrap({ onClose, onSubmit, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,4,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <form onSubmit={onSubmit} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", width: "100%", maxWidth: "720px", maxHeight: "90vh", overflowY: "auto", position: "relative", padding: "2rem", scrollbarWidth: "thin", scrollbarColor: `${G.border} transparent` }}>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(201,168,76,0.1)", border: `1px solid ${G.border}`, color: G.gold, borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={16} />
        </button>
        {children}
      </form>
    </div>
  );
}

function TickCheck({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "0.6rem 0.85rem", background: checked ? "rgba(201,168,76,0.08)" : "transparent", border: `1px solid ${checked ? G.gold : G.border}`, borderRadius: "6px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
      <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: checked ? G.gold : "transparent", border: `2px solid ${checked ? G.gold : G.muted}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
        {checked && <CheckCircle size={13} color="#0a0804" />}
      </div>
      <span style={{ color: checked ? G.gold : G.muted, fontSize: "0.85rem", fontFamily: G.sans }}>{label}</span>
    </button>
  );
}

function CheckOption({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.5rem 0.75rem", background: checked ? "rgba(201,168,76,0.08)" : "transparent", border: `1px solid ${checked ? G.gold : G.border}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: checked ? G.gold : "transparent", border: `2px solid ${checked ? G.gold : G.muted}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <CheckCircle size={10} color="#0a0804" />}
      </div>
      <span style={{ color: checked ? G.gold : G.muted, fontSize: "0.78rem", fontFamily: G.sans, whiteSpace: "nowrap" }}>{label}</span>
    </button>
  );
}

function Label({ text }) {
  return <p style={{ color: G.muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>{text}</p>;
}

function Input({ placeholder, type = "text", name, required }) {
  return <input name={name} required={required} type={type} placeholder={placeholder} style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />;
}

function Select({ options, name }) {
  return (
    <select name={name} style={{ width: "100%", padding: "0.6rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none" }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function FieldGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>{children}</div>;
}

function Divider({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0 1rem" }}>
      <div style={{ flex: 1, height: "1px", background: G.border }} />
      <span style={{ color: G.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ flex: 1, height: "1px", background: G.border }} />
    </div>
  );
}

function UploadBtn({ label = "Upload Reference Image", name }) {
  const ref = useRef(null);
  const [filename, setFilename] = useState(null);
  return (
    <div>
      <input ref={ref} type="file" name={name} accept="image/*" style={{ display: "none" }} onChange={e => setFilename(e.target.files?.[0]?.name ?? null)} />
      <button type="button" onClick={() => ref.current?.click()} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "0.65rem 1rem", background: "transparent", border: `1.5px dashed ${G.border}`, borderRadius: "8px", color: G.muted, cursor: "pointer", fontSize: "0.82rem", fontFamily: G.sans, transition: "border-color 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = G.gold; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; }}>
        <Upload size={15} style={{ color: G.gold }} />
        {filename ? <span style={{ color: G.gold }}>{filename}</span> : label}
      </button>
    </div>
  );
}

/* ─── COMMON EVENT FORM ─── */
function CommonEventForm({ hideVenueLocation, hideGuests }) {
  return (
    <div>
      <Divider title="Event Details" />
      <FieldGrid>
        <div><Label text="Event Date" /><Input required name="date" placeholder="Select date" type="date" /></div>
        <div><Label text="Event Time" /><Input name="time" placeholder="Select time" type="time" /></div>
        {!hideGuests && (
          <div><Label text="Number of Guests" /><Input name="guests" placeholder="e.g. 200" type="number" /></div>
        )}
        {!hideVenueLocation && (
          <div><Label text="Venue (if known)" /><Input name="venue" placeholder="Venue name or TBD" /></div>
        )}
      </FieldGrid>
      <div style={{ marginTop: "1.5rem" }}>
        <button type="submit" style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.75rem 2rem", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans, width: "100%" }}>
          Submit Booking Request
        </button>
      </div>
    </div>
  );
}

/* ─── VENUE BOOKING MODAL ─── */
function VenueBookingModal({ eventName, onClose, onSubmit }) {
  const [guests, setGuests] = useState(100);
  const [parking, setParking] = useState(false);
  const [rooms, setRooms] = useState(false);
  const [roomCount, setRoomCount] = useState(5);
  const [showVenues, setShowVenues] = useState(false);

  const VENUES = [
    { name: "Maharaja Grand Hall", city: "Andheri West, Mumbai", cap: "200–1500", img: "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?w=400&h=220&fit=crop&auto=format" },
    { name: "JW Marriott", city: "Juhu, Mumbai", cap: "100–800", img: "https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=400&h=220&fit=crop&auto=format" },
    { name: "Aamby Valley Resort", city: "Lonavala, Pune", cap: "50–500", img: "https://images.unsplash.com/photo-1729957385579-528ce50ffd94?w=400&h=220&fit=crop&auto=format" },
    { name: "Regal Banquet", city: "Borivali, Mumbai", cap: "100–800", img: "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=400&h=220&fit=crop&auto=format" },
    { name: "Bandra Fort Lawns", city: "Bandra, Mumbai", cap: "150–1000", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=220&fit=crop&auto=format" },
    { name: "Della Resort", city: "Khopoli, Maharashtra", cap: "100–800", img: "https://images.unsplash.com/photo-1780542785051-2e320486c71d?w=400&h=220&fit=crop&auto=format" },
  ];

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Venue Booking</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="guests" value={guests} />
      <input type="hidden" name="parking_required" value={parking ? "Yes" : "No"} />
      <input type="hidden" name="rooms_required" value={rooms ? "Yes" : "No"} />
      <input type="hidden" name="room_count" value={rooms ? roomCount : 0} />

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Preferred Venue Location / City" />
        <Input name="location" placeholder="e.g. Mumbai, Pune, Lonavala..." />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Label text={`Guest Count: ${guests}`} />
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {[50,100,200,300,500,1000].map(n => (
            <button type="button" key={n} onClick={() => setGuests(n)} style={{ padding: "4px 12px", background: guests === n ? "rgba(201,168,76,0.15)" : "transparent", border: `1px solid ${guests === n ? G.gold : G.border}`, color: guests === n ? G.gold : G.muted, borderRadius: "99px", fontSize: "0.78rem", cursor: "pointer" }}>
              {n}
            </button>
          ))}
        </div>
        <input type="range" min={10} max={2000} value={guests} onChange={e => setGuests(Number(e.target.value))} style={{ width: "100%", accentColor: G.gold }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
        <TickCheck checked={parking} onChange={setParking} label="Parking Required" />
        <TickCheck checked={rooms} onChange={setRooms} label="Guest Rooms Required" />
      </div>

      {rooms && (
        <div style={{ marginBottom: "1rem" }}>
          <Label text="Number of Rooms" />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button type="button" onClick={() => setRoomCount(Math.max(1, roomCount - 1))} style={{ width: "34px", height: "34px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer", fontSize: "1.2rem" }}>-</button>
            <span style={{ color: G.text, fontFamily: G.serif, fontSize: "1.2rem", minWidth: "30px", textAlign: "center" }}>{roomCount}</span>
            <button type="button" onClick={() => setRoomCount(roomCount + 1)} style={{ width: "34px", height: "34px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer", fontSize: "1.2rem" }}>+</button>
          </div>
        </div>
      )}

      <button type="button" onClick={() => setShowVenues(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "0.7rem", background: "rgba(201,168,76,0.1)", border: `1px solid ${G.gold}`, color: G.gold, borderRadius: "8px", cursor: "pointer", fontFamily: G.sans, fontSize: "0.88rem", marginBottom: "1rem" }}>
        <Camera size={16} /> Find Available Venues
      </button>

      {showVenues && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
          {VENUES.map(v => (
            <div key={v.name} style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "10px", overflow: "hidden" }}>
              <img src={v.img} alt={v.name} style={{ width: "100%", height: "110px", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "0.75rem" }}>
                <p style={{ color: G.text, fontSize: "0.82rem", fontFamily: G.serif, marginBottom: "2px" }}>{v.name}</p>
                <p style={{ color: G.muted, fontSize: "0.7rem" }}>{v.city}</p>
                <p style={{ color: G.muted, fontSize: "0.7rem" }}>Cap: {v.cap}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <CommonEventForm hideVenueLocation hideGuests />
    </ModalWrap>
  );
}

/* ─── CATERING MODAL ─── */
const CATERING_MENU = {
  Continental: {
    Breakfast: { Starter: ["Fruit Platter","Yogurt Parfait","Mixed Nuts"], MainCourse: ["Omelette Station","Pancakes","Avocado Toast","French Toast"], Dessert: ["Croissants","Danish Pastry","Muffins"] },
    Lunch: { Starter: ["Caesar Salad","Mushroom Soup","Bruschetta"], MainCourse: ["Grilled Chicken","Pasta Alfredo","Fish & Chips","Veg Quiche"], Dessert: ["Tiramisu","Panna Cotta","Cheesecake"] },
    Dinner: { Starter: ["Garlic Bread","Stuffed Mushrooms","Tomato Soup"], MainCourse: ["Roast Chicken","Salmon","Beef Lasagna","Mushroom Risotto"], Dessert: ["Chocolate Mousse","Creme Brulee","Fruit Tart"] },
  },
  Chettinad: {
    Breakfast: { Starter: ["Paruppu Vadai","Coconut Chutney"], MainCourse: ["Kothu Parotta","Idiyappam with Egg Curry","Pongal"], Dessert: ["Kavuni Arisi","Filter Coffee"] },
    Lunch: { Starter: ["Rasam","Mor Kuzhambu","Papadam"], MainCourse: ["Chettinad Chicken Curry","Mutton Chukka","Kara Kuzhambu","Rice"], Dessert: ["Payasam","Therattipal"] },
    Dinner: { Starter: ["Pepper Rasam","Mini Vadai"], MainCourse: ["Chicken Chettinad Gravy","Prawn Masala","Kothu Parotta"], Dessert: ["Semiya Payasam","Coconut Burfi"] },
  },
  Kongunadu: {
    Breakfast: { Starter: ["Kozhukattai","Coconut Chutney"], MainCourse: ["Ragi Mudde","Pongal","Idli with Kongu Sambar"], Dessert: ["Sakkarai Pongal","Puttu with Banana"] },
    Lunch: { Starter: ["Puliyodarai","Papadam"], MainCourse: ["Kongu Kozhi Varuval","Thengai Paal Kuzhambu","Rice","Kootu"], Dessert: ["Pal Payasam","Adhirasam"] },
    Dinner: { Starter: ["Vazha Poo Vadai","Murukku"], MainCourse: ["Kongu Mutton Curry","Chapati","Sambar Rice"], Dessert: ["Semiya Payasam","Jangiri"] },
  },
  "North Indian": {
    Breakfast: { Starter: ["Aloo Paratha","Lassi"], MainCourse: ["Chole Bhature","Poha","Masala Omelette"], Dessert: ["Halwa","Gulab Jamun"] },
    Lunch: { Starter: ["Dal Tadka","Raita","Papadam"], MainCourse: ["Dal Makhani","Paneer Butter Masala","Biryani","Naan"], Dessert: ["Gulab Jamun","Kheer","Jalebi"] },
    Dinner: { Starter: ["Tandoori Chicken","Seekh Kebab","Dahi Bhalla"], MainCourse: ["Butter Chicken","Mutton Rogan Josh","Garlic Naan","Pulao"], Dessert: ["Shahi Tukda","Gajar Ka Halwa","Kulfi"] },
  },
  "South Indian": {
    Breakfast: { Starter: ["Mini Idli","Vada","Chutneys"], MainCourse: ["Masala Dosa","Pongal","Uthappam"], Dessert: ["Payasam","Filter Coffee"] },
    Lunch: { Starter: ["Rasam","Buttermilk","Papadam"], MainCourse: ["Sambar Rice","Kootu","Curd Rice","Appam"], Dessert: ["Payasam","Kesari"] },
    Dinner: { Starter: ["Tomato Rasam","Mini Vada"], MainCourse: ["Parotta with Salna","Egg Kurma","Chapati","Biryani"], Dessert: ["Pal Payasam","Mysore Pak"] },
  },
};

const CUISINE_IMGS = {
  Continental: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=180&fit=crop&auto=format",
  Chettinad: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=180&fit=crop&auto=format",
  Kongunadu: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=300&h=180&fit=crop&auto=format",
  "North Indian": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=180&fit=crop&auto=format",
  "South Indian": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&h=180&fit=crop&auto=format",
};

const SECTION_DOTS = { Starter: "#60a5fa", MainCourse: G.gold, Dessert: "#f9a8d4" };

function CateringModal({ eventName, onClose, onSubmit }) {
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [meal, setMeal] = useState("Lunch");
  const [guestCount, setGuestCount] = useState(100);
  const [buffetService, setBuffetService] = useState(false);
  const [liveCounters, setLiveCounters] = useState(false);
  const [dessertStation, setDessertStation] = useState(false);
  const [welcomeDrinks, setWelcomeDrinks] = useState(false);

  const menuData = selectedCuisine ? CATERING_MENU[selectedCuisine]?.[meal] : null;

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Catering Services</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="selected_cuisine" value={selectedCuisine || ""} />
      <input type="hidden" name="meal_type" value={meal} />
      <input type="hidden" name="guests" value={guestCount} />
      <input type="hidden" name="buffet_service" value={buffetService ? "Yes" : "No"} />
      <input type="hidden" name="live_counters" value={liveCounters ? "Yes" : "No"} />
      <input type="hidden" name="sweet_and_dessert_counters" value={dessertStation ? "Yes" : "No"} />
      <input type="hidden" name="welcome_drinks" value={welcomeDrinks ? "Yes" : "No"} />

      <p style={{ color: G.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Select Cuisine</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {Object.keys(CATERING_MENU).map(c => (
          <div key={c} onClick={() => setSelectedCuisine(selectedCuisine === c ? null : c)}
            style={{ borderRadius: "10px", overflow: "hidden", border: `2px solid ${selectedCuisine === c ? G.gold : G.border}`, cursor: "pointer", transition: "all 0.2s" }}>
            <img src={CUISINE_IMGS[c]} alt={c} style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }} />
            <p style={{ color: selectedCuisine === c ? G.gold : G.text, fontSize: "0.78rem", fontFamily: G.sans, padding: "0.4rem 0.6rem", background: G.surface2, textAlign: "center" }}>{c}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCuisine && menuData && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "1.25rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {(["Breakfast","Lunch","Dinner"]).map(m => (
                  <button type="button" key={m} onClick={() => setMeal(m)} style={{ padding: "5px 16px", borderRadius: "99px", border: `1px solid ${meal === m ? G.gold : G.border}`, background: meal === m ? "rgba(201,168,76,0.15)" : "transparent", color: meal === m ? G.gold : G.muted, fontSize: "0.8rem", cursor: "pointer" }}>
                    {m}
                  </button>
                ))}
              </div>
              {(["Starter","MainCourse","Dessert"]).map(sec => (
                <div key={sec} style={{ marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.4rem" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: SECTION_DOTS[sec] }} />
                    <span style={{ color: G.text, fontSize: "0.78rem", fontWeight: 600 }}>{sec === "MainCourse" ? "Main Course" : sec}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {menuData[sec].map((dish) => (
                      <span key={dish} style={{ background: "rgba(201,168,76,0.06)", border: `1px solid ${G.border}`, color: G.muted, padding: "3px 10px", borderRadius: "99px", fontSize: "0.72rem" }}>{dish}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginBottom: "1rem" }}>
        <Label text={`Guest Count: ${guestCount}`} />
        <input type="range" min={10} max={2000} value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} style={{ width: "100%", accentColor: G.gold }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
        <TickCheck checked={buffetService} onChange={setBuffetService} label="Buffet Service" />
        <TickCheck checked={liveCounters} onChange={setLiveCounters} label="Live Food Counters" />
        <TickCheck checked={dessertStation} onChange={setDessertStation} label="Sweet & Dessert Counters" />
        <TickCheck checked={welcomeDrinks} onChange={setWelcomeDrinks} label="Welcome Drinks" />
      </div>

      <CommonEventForm hideGuests />
    </ModalWrap>
  );
}

/* ─── MAKEUP MODAL ─── */
function MakeupModal({ eventName, onClose, onSubmit }) {
  const [memberCount, setMemberCount] = useState(1);
  const [bride, setBride] = useState(false);
  const [groom, setGroom] = useState(false);
  const [selectedLook, setSelectedLook] = useState(null);
  const [mehendi, setMehendi] = useState(false);
  const [artistCount, setArtistCount] = useState(1);
  const [selectedDesigns, setSelectedDesigns] = useState([]);

  const looks = ["Traditional Bridal","Modern Minimal","Royal Mughal","South Indian Classic","Contemporary Glam","Natural Dewy"];
  const designs = ["Arabic","Rajasthani","Bridal Full Hand","Feet Mehendi","Indo-Arabic","Floral Vine"];

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Makeup & Styling</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="member_count" value={memberCount} />
      <input type="hidden" name="bride_makeup" value={bride ? "Yes" : "No"} />
      <input type="hidden" name="groom_makeup" value={groom ? "Yes" : "No"} />
      <input type="hidden" name="selected_look" value={selectedLook || ""} />
      <input type="hidden" name="include_mehendi" value={mehendi ? "Yes" : "No"} />
      <input type="hidden" name="mehendi_artists" value={mehendi ? artistCount : 0} />
      <input type="hidden" name="mehendi_designs" value={selectedDesigns.join(", ")} />

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Number of Members" />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button type="button" onClick={() => setMemberCount(Math.max(1, memberCount - 1))} style={{ width: "34px", height: "34px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer", fontSize: "1.2rem" }}>-</button>
          <span style={{ color: G.text, fontFamily: G.serif, fontSize: "1.2rem", minWidth: "30px", textAlign: "center" }}>{memberCount}</span>
          <button type="button" onClick={() => setMemberCount(memberCount + 1)} style={{ width: "34px", height: "34px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer", fontSize: "1.2rem" }}>+</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
        <TickCheck checked={bride} onChange={setBride} label="Bride" />
        <TickCheck checked={groom} onChange={setGroom} label="Groom" />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Look Style" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {looks.map(l => (
            <button type="button" key={l} onClick={() => setSelectedLook(selectedLook === l ? null : l)} style={{ padding: "5px 14px", borderRadius: "99px", border: `1px solid ${selectedLook === l ? G.gold : G.border}`, background: selectedLook === l ? "rgba(201,168,76,0.12)" : "transparent", color: selectedLook === l ? G.gold : G.muted, fontSize: "0.78rem", cursor: "pointer" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <TickCheck checked={mehendi} onChange={setMehendi} label="Include Mehendi Artist" />

      {mehendi && (
        <div style={{ marginTop: "0.75rem", padding: "1rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
            <Label text="Number of Artists" />
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto" }}>
              <button type="button" onClick={() => setArtistCount(Math.max(1, artistCount - 1))} style={{ width: "28px", height: "28px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer" }}>-</button>
              <span style={{ color: G.text, minWidth: "20px", textAlign: "center" }}>{artistCount}</span>
              <button type="button" onClick={() => setArtistCount(artistCount + 1)} style={{ width: "28px", height: "28px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer" }}>+</button>
            </div>
          </div>
          <Label text="Mehendi Design" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {designs.map(d => (
              <button type="button" key={d} onClick={() => setSelectedDesigns(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} style={{ padding: "4px 12px", borderRadius: "99px", border: `1px solid ${selectedDesigns.includes(d) ? G.gold : G.border}`, background: selectedDesigns.includes(d) ? "rgba(201,168,76,0.12)" : "transparent", color: selectedDesigns.includes(d) ? G.gold : G.muted, fontSize: "0.75rem", cursor: "pointer" }}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <CommonEventForm />
      </div>
    </ModalWrap>
  );
}

/* ─── PHOTOGRAPHY MODAL ─── */
function PhotographyModal({ eventName, onClose, onSubmit }) {
  const [indoor, setIndoor] = useState(false);
  const [outdoor, setOutdoor] = useState(false);
  const [drone, setDrone] = useState(false);
  const [coverage, setCoverage] = useState([]);
  const [videoPackages, setVideoPackages] = useState([]);

  const isBirthday = /birthday|kids/i.test(eventName);
  const weddingCoverage = ["Ceremony","Bride Getting Ready","Groom Getting Ready","Reception","Sangeet","Haldi","Mehendi","Couple Portraits","Family Portraits","Guest Candids"];
  const birthdayCoverage = ["Birthday Setup","Cake Cutting","Games & Activities","Group Photos","Family Portraits","Candid Moments","Cake Smash","Decoration Details"];
  const coverageOptions = isBirthday ? birthdayCoverage : weddingCoverage;
  const videoOptions = ["Basic Highlight Reel","Cinematic Film","Same-Day Edit","Social Media Reels","Pre-Wedding Teaser","Full Event Documentation","Live Streaming","Behind the Scenes"];

  const toggleArr = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Photography & Videography</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="indoor_photography" value={indoor ? "Yes" : "No"} />
      <input type="hidden" name="outdoor_photography" value={outdoor ? "Yes" : "No"} />
      <input type="hidden" name="drone_photography" value={drone ? "Yes" : "No"} />
      <input type="hidden" name="coverage_areas" value={coverage.join(", ")} />
      <input type="hidden" name="video_packages" value={videoPackages.join(", ")} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
        <TickCheck checked={indoor} onChange={setIndoor} label="Indoor" />
        <TickCheck checked={outdoor} onChange={setOutdoor} label="Outdoor" />
        <TickCheck checked={drone} onChange={setDrone} label="Drone Photography" />
      </div>

      <Divider title="Coverage Areas" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.5rem", marginBottom: "1rem" }}>
        {coverageOptions.map(o => (
          <CheckOption key={o} checked={coverage.includes(o)} onChange={() => toggleArr(coverage, setCoverage, o)} label={o} />
        ))}
      </div>

      <Divider title="Video Package (Multi-select)" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem", marginBottom: "0.5rem" }}>
        {videoOptions.map(o => (
          <CheckOption key={o} checked={videoPackages.includes(o)} onChange={() => toggleArr(videoPackages, setVideoPackages, o)} label={o} />
        ))}
      </div>
      {videoPackages.length > 0 && (
        <p style={{ color: G.gold, fontSize: "0.75rem", marginBottom: "1rem" }}>Selected: {videoPackages.join(", ")}</p>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Number of Photographers" />
        <Select name="photographers_count" options={["1 Photographer","2 Photographers","3 Photographers","4+ Photographers"]} />
      </div>

      <CommonEventForm />
    </ModalWrap>
  );
}

/* ─── DECORATION MODAL ─── */
function DecorationModal({ eventName, onClose, onSubmit }) {
  const isBirthday = /birthday|kids|surprise/i.test(eventName);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedColour, setSelectedColour] = useState(null);
  const [stage, setStage] = useState(false);
  const [balloon, setBalloon] = useState(false);
  const [entranceArch, setEntranceArch] = useState(false);
  const [photoBooth, setPhotoBooth] = useState(false);
  const [mandap, setMandap] = useState(false);
  const [led, setLed] = useState(false);
  const [table, setTable] = useState(false);

  const birthdayPhotos = [
    { url: "https://images.unsplash.com/photo-1770806850642-5db99488cc75?w=400&h=280&fit=crop&auto=format", label: "Barbie Pink Theme" },
    { url: "https://images.unsplash.com/photo-1778874902512-70d36cca2557?w=400&h=280&fit=crop&auto=format", label: "Star Theme Party" },
    { url: "https://images.unsplash.com/photo-1770804673655-36b6e9bf68f1?w=400&h=280&fit=crop&auto=format", label: "Balloon & Cake" },
    { url: "https://images.unsplash.com/photo-1770805001834-f9ccd734c6fb?w=400&h=280&fit=crop&auto=format", label: "Princess Balloons" },
    { url: "https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=400&h=280&fit=crop&auto=format", label: "Classic Birthday" },
    { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=280&fit=crop&auto=format", label: "Colourful Balloons" },
  ];
  const weddingPhotos = [
    { url: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=280&fit=crop&auto=format", label: "Floral Elegance" },
    { url: "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=400&h=280&fit=crop&auto=format", label: "Royal Setup" },
    { url: "https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=400&h=280&fit=crop&auto=format", label: "Garden Paradise" },
    { url: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=400&h=280&fit=crop&auto=format", label: "Fairy Lights" },
    { url: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=400&h=280&fit=crop&auto=format", label: "Candle Glow" },
    { url: "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=400&h=280&fit=crop&auto=format", label: "Grand Banquet" },
  ];
  const photos = isBirthday ? birthdayPhotos : weddingPhotos;
  const themes = isBirthday
    ? ["Princess","Barbie","Superhero","Cartoon","Unicorn","Jungle","Space","Royal","Mermaid","Sports"]
    : ["Floral","Royal","Rustic","Modern Minimal","Garden Paradise","Bollywood","Fairy Tale","Traditional"];
  const colours = ["Blush Pink","Gold & Ivory","Royal Blue","Emerald Green","Lavender","Coral","Burgundy","All White"];

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Decoration</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="selected_theme_reference" value={selectedPhoto !== null ? photos[selectedPhoto].label : ""} />
      <input type="hidden" name="selected_theme" value={selectedTheme || ""} />
      <input type="hidden" name="selected_colour" value={selectedColour || ""} />
      <input type="hidden" name="stage_decoration" value={stage ? "Yes" : "No"} />
      <input type="hidden" name="balloon_decoration" value={balloon ? "Yes" : "No"} />
      <input type="hidden" name="entrance_arch" value={entranceArch ? "Yes" : "No"} />
      <input type="hidden" name="photo_booth" value={photoBooth ? "Yes" : "No"} />
      <input type="hidden" name="mandap_decoration" value={mandap ? "Yes" : "No"} />
      <input type="hidden" name="led_decoration" value={led ? "Yes" : "No"} />
      <input type="hidden" name="table_decoration" value={table ? "Yes" : "No"} />

      <p style={{ color: G.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Recommended Themes</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "0.75rem" }}>
        {photos.map((p, i) => (
          <div key={i} onClick={() => setSelectedPhoto(selectedPhoto === i ? null : i)}
            style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: `2px solid ${selectedPhoto === i ? G.gold : "transparent"}`, cursor: "pointer" }}>
            <img src={p.url} alt={p.label} style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }} />
            {selectedPhoto === i && (
              <div style={{ position: "absolute", top: "5px", right: "5px", background: G.gold, borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={13} color="#0a0804" />
              </div>
            )}
            <p style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,8,4,0.7)", color: G.text, fontSize: "0.62rem", padding: "3px 6px", textAlign: "center" }}>{p.label}</p>
          </div>
        ))}
      </div>
      <UploadBtn name="decoration_reference_image" label="Upload Your Own Reference Image" />

      <div style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
        <Label text="Theme" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {themes.map(t => (
            <button type="button" key={t} onClick={() => setSelectedTheme(selectedTheme === t ? null : t)} style={{ padding: "4px 12px", borderRadius: "99px", border: `1px solid ${selectedTheme === t ? G.gold : G.border}`, background: selectedTheme === t ? "rgba(201,168,76,0.12)" : "transparent", color: selectedTheme === t ? G.gold : G.muted, fontSize: "0.76rem", cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Colour Palette" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {colours.map(c => (
            <button type="button" key={c} onClick={() => setSelectedColour(selectedColour === c ? null : c)} style={{ padding: "4px 12px", borderRadius: "99px", border: `1px solid ${selectedColour === c ? G.gold : G.border}`, background: selectedColour === c ? "rgba(201,168,76,0.12)" : "transparent", color: selectedColour === c ? G.gold : G.muted, fontSize: "0.76rem", cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
        <TickCheck checked={stage} onChange={setStage} label="Stage Decoration" />
        <TickCheck checked={balloon} onChange={setBalloon} label="Balloon Decoration" />
        <TickCheck checked={entranceArch} onChange={setEntranceArch} label="Entrance Decoration" />
        <TickCheck checked={photoBooth} onChange={setPhotoBooth} label="Photo Booth" />
        <TickCheck checked={mandap} onChange={setMandap} label="Mandap Decoration" />
        <TickCheck checked={led} onChange={setLed} label="LED Decoration" />
        <TickCheck checked={table} onChange={setTable} label="Table Decoration" />
      </div>

      <CommonEventForm />
    </ModalWrap>
  );
}

/* ─── INVITATION MODAL ─── */
function InvitationModal({ eventName, onClose, onSubmit }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [digital, setDigital] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [video, setVideo] = useState(false);
  const [printCount, setPrintCount] = useState(100);
  const [designStyle, setDesignStyle] = useState(null);

  const photos = [
    { url: "https://images.unsplash.com/photo-1731068381691-dd9f121114e9?w=400&h=280&fit=crop&auto=format", label: "Elegant Box" },
    { url: "https://images.unsplash.com/photo-1642573863221-ef123ae0a9db?w=400&h=280&fit=crop&auto=format", label: "Gold Ring & Card" },
    { url: "https://images.unsplash.com/photo-1720686614659-4ca242ab7e3f?w=400&h=280&fit=crop&auto=format", label: "Envelope & Rings" },
    { url: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=400&h=280&fit=crop&auto=format", label: "Floral Table" },
    { url: "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=400&h=280&fit=crop&auto=format", label: "Candle & Floral" },
    { url: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=280&fit=crop&auto=format", label: "Royal Gold" },
  ];
  const togglePhoto = (i) => setSelectedPhotos(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const designStyles = ["Classic Floral","Modern Minimal","Royal Border","Rustic Wood","Watercolour","Gold Foil"];

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Invitations</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="selected_styles" value={selectedPhotos.map(i => photos[i].label).join(", ")} />
      <input type="hidden" name="digital_invitation" value={digital ? "Yes" : "No"} />
      <input type="hidden" name="printed_invitation" value={printed ? "Yes" : "No"} />
      <input type="hidden" name="video_invitation" value={video ? "Yes" : "No"} />
      <input type="hidden" name="printed_copies" value={printed ? printCount : 0} />
      <input type="hidden" name="design_style" value={designStyle || ""} />

      <p style={{ color: G.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Recommended Invitation Styles</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "0.75rem" }}>
        {photos.map((p, i) => (
          <div key={i} onClick={() => togglePhoto(i)}
            style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: `2px solid ${selectedPhotos.includes(i) ? G.gold : "transparent"}`, cursor: "pointer" }}>
            <img src={p.url} alt={p.label} style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }} />
            {selectedPhotos.includes(i) && (
              <div style={{ position: "absolute", top: "5px", right: "5px", background: G.gold, borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={13} color="#0a0804" />
              </div>
            )}
            <p style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,8,4,0.7)", color: G.text, fontSize: "0.62rem", padding: "3px 6px", textAlign: "center" }}>{p.label}</p>
          </div>
        ))}
      </div>
      <UploadBtn name="invitation_reference_image" label="Upload Your Design Reference" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", margin: "1rem 0" }}>
        <TickCheck checked={digital} onChange={setDigital} label="Digital" />
        <TickCheck checked={printed} onChange={setPrinted} label="Printed" />
        <TickCheck checked={video} onChange={setVideo} label="Video Invite" />
      </div>

      {printed && (
        <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
          <Label text={`Number of Printed Copies: ${printCount}`} />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            {[50,100,200,500,1000].map(n => (
              <button type="button" key={n} onClick={() => setPrintCount(n)} style={{ padding: "4px 10px", background: printCount === n ? "rgba(201,168,76,0.15)" : "transparent", border: `1px solid ${printCount === n ? G.gold : G.border}`, color: printCount === n ? G.gold : G.muted, borderRadius: "99px", fontSize: "0.75rem", cursor: "pointer" }}>
                {n}
              </button>
            ))}
          </div>
          <input type="range" min={10} max={2000} value={printCount} onChange={e => setPrintCount(Number(e.target.value))} style={{ width: "100%", accentColor: G.gold }} />
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Design Style" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {designStyles.map(s => (
            <button type="button" key={s} onClick={() => setDesignStyle(designStyle === s ? null : s)} style={{ padding: "4px 12px", borderRadius: "99px", border: `1px solid ${designStyle === s ? G.gold : G.border}`, background: designStyle === s ? "rgba(201,168,76,0.12)" : "transparent", color: designStyle === s ? G.gold : G.muted, fontSize: "0.76rem", cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Language" />
        <Select name="language" options={["English","Hindi","Tamil","Telugu","Marathi","Gujarati","Bengali","Kannada"]} />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Custom Message" />
        <textarea name="custom_message" placeholder="Enter your custom message or special note..." style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", resize: "vertical", minHeight: "80px", boxSizing: "border-box" }} />
      </div>

      <CommonEventForm />
    </ModalWrap>
  );
}

/* ─── CAKE MODAL ─── */
function CakeModal({ eventName, onClose, onSubmit }) {
  const [flavour, setFlavour] = useState(null);
  const [tiers, setTiers] = useState(1);
  const [custom, setCustom] = useState(false);
  const flavours = ["Vanilla","Chocolate","Red Velvet","Black Forest","Butterscotch","Mango","Strawberry","Pineapple"];

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Cake Arrangements</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="cake_flavour" value={flavour || ""} />
      <input type="hidden" name="cake_tiers" value={tiers} />
      <input type="hidden" name="custom_cake_design" value={custom ? "Yes" : "No"} />

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Flavour" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {flavours.map(f => (
            <button type="button" key={f} onClick={() => setFlavour(flavour === f ? null : f)} style={{ padding: "5px 14px", borderRadius: "99px", border: `1px solid ${flavour === f ? G.gold : G.border}`, background: flavour === f ? "rgba(201,168,76,0.12)" : "transparent", color: flavour === f ? G.gold : G.muted, fontSize: "0.78rem", cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Label text={`Number of Tiers: ${tiers}`} />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button type="button" onClick={() => setTiers(Math.max(1, tiers - 1))} style={{ width: "34px", height: "34px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer", fontSize: "1.2rem" }}>-</button>
          <span style={{ color: G.text, fontFamily: G.serif, fontSize: "1.2rem", minWidth: "30px", textAlign: "center" }}>{tiers}</span>
          <button type="button" onClick={() => setTiers(tiers + 1)} style={{ width: "34px", height: "34px", borderRadius: "50%", border: `1px solid ${G.border}`, background: "transparent", color: G.gold, cursor: "pointer", fontSize: "1.2rem" }}>+</button>
        </div>
      </div>

      <TickCheck checked={custom} onChange={setCustom} label="Custom Cake Design (fondant / photo print)" />
      {custom && <div style={{ marginTop: "0.75rem" }}><UploadBtn name="cake_design_reference" label="Upload Cake Design Reference" /></div>}

      <div style={{ marginTop: "1rem" }}>
        <CommonEventForm />
      </div>
    </ModalWrap>
  );
}

/* ─── ENTERTAINMENT MODAL ─── */
function EntertainmentModal({ eventName, onClose, onSubmit }) {
  const [selected, setSelected] = useState([]);
  const options = ["DJ & Sound System","Live Band","Orchestra","Dance Performance","Magic Show","Celebrity Appearance","Emcee / Anchor","Kids Entertainer","Fire Show","Comedian"];
  const toggle = (o) => setSelected(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Entertainment</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="entertainment_services" value={selected.join(", ")} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
        {options.map(o => (
          <TickCheck key={o} checked={selected.includes(o)} onChange={() => toggle(o)} label={o} />
        ))}
      </div>

      <CommonEventForm />
    </ModalWrap>
  );
}

/* ─── RETURN GIFTS MODAL ─── */
function ReturnGiftsModal({ eventName, onClose, onSubmit }) {
  const [personalized, setPersonalized] = useState(false);
  const [giftCount, setGiftCount] = useState(50);
  const [selectedType, setSelectedType] = useState(null);
  const types = ["Dry Fruits Box","Chocolate Box","Candles Set","Photo Frame","Customized Mug","Keychain","Scented Soap Set","Silver Coin","Sweet Box","Utility Kit"];

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>Return Gifts</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>

      <input type="hidden" name="gift_type" value={selectedType || ""} />
      <input type="hidden" name="gift_quantity" value={giftCount} />
      <input type="hidden" name="personalized_gifts" value={personalized ? "Yes" : "No"} />

      <div style={{ marginBottom: "1rem" }}>
        <Label text="Gift Type" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {types.map(t => (
            <button type="button" key={t} onClick={() => setSelectedType(selectedType === t ? null : t)} style={{ padding: "5px 14px", borderRadius: "99px", border: `1px solid ${selectedType === t ? G.gold : G.border}`, background: selectedType === t ? "rgba(201,168,76,0.12)" : "transparent", color: selectedType === t ? G.gold : G.muted, fontSize: "0.78rem", cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Label text={`Quantity: ${giftCount}`} />
        <input type="range" min={10} max={1000} value={giftCount} onChange={e => setGiftCount(Number(e.target.value))} style={{ width: "100%", accentColor: G.gold }} />
      </div>

      <TickCheck checked={personalized} onChange={setPersonalized} label="Personalized / Custom Printed Gifts" />

      <div style={{ marginTop: "1rem" }}>
        <CommonEventForm />
      </div>
    </ModalWrap>
  );
}

/* ─── IMAGE SUGGESTIONS MODAL ─── */
const SERVICE_IMAGES = {
  "Luxury Stage Design": [
    "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=400&h=260&fit=crop&auto=format",
  ],
  "Couple Grand Entry": [
    "https://images.unsplash.com/photo-1542598688-76ad90c5b01e?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1758939560877-53fa3590a582?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1781154110379-f2447cd4e2ca?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1772466910118-2c6a9ccd85ce?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1597294150753-b6e790b68d1c?w=400&h=260&fit=crop&auto=format",
  ],
  "Guest Seating Arrangement": [
    "https://images.unsplash.com/photo-1780542900375-0cf459e38fbb?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1729957385579-528ce50ffd94?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1780542785051-2e320486c71d?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1759730840961-09faa5731a3b?w=400&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=400&h=260&fit=crop&auto=format",
  ],
};
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=260&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=400&h=260&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=400&h=260&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=400&h=260&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=400&h=260&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=400&h=260&fit=crop&auto=format",
];

function ImageSuggestionsModal({ serviceName, eventName, onClose, onSubmit }) {
  const images = SERVICE_IMAGES[serviceName] ?? DEFAULT_IMAGES;
  const [selected, setSelected] = useState(null);

  return (
    <ModalWrap onClose={onClose} onSubmit={onSubmit}>
      <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.5rem", lineHeight: 1, marginBottom: "0.25rem" }}>{serviceName}</p>
      <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{eventName}</h3>
      
      <input type="hidden" name="selected_suggestion_reference" value={selected !== null ? images[selected] : ""} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {images.map((url, i) => (
          <div key={i} onClick={() => setSelected(selected === i ? null : i)} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: `2px solid ${selected === i ? G.gold : "transparent"}`, cursor: "pointer" }}>
            <img src={url} alt={`Option ${i + 1}`} style={{ width: "100%", height: "100px", objectFit: "cover", display: "block" }} />
            {selected === i && (
              <div style={{ position: "absolute", top: "6px", right: "6px", background: G.gold, borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={14} color="#0a0804" />
              </div>
            )}
          </div>
        ))}
      </div>
      <CommonEventForm />
    </ModalWrap>
  );
}

/* ─── MODAL TYPE ROUTING ─── */

function getModalType(svc) {
  const s = svc.toLowerCase();
  if (s.includes("plan") || s === "general booking" || s === "general") return "general";
  if (s.includes("venue") || s.includes("hall") || s.includes("resort") || s.includes("venue booking")) return "venue";
  if (s.includes("catering") || s.includes("cuisine") || s.includes("buffet") || s.includes("snacks") || s.includes("dessert counter") || s.includes("refreshment")) return "catering";
  if (s.includes("makeup") || s.includes("styling") || s.includes("mehendi") || s.includes("mehandi") || s.includes("bridal")) return "makeup";
  if (s.includes("photography") || s.includes("videography") || s.includes("photo booth") || s.includes("drone")) return "photography";
  if (s.includes("decoration") || s.includes("decor") || s.includes("floral") || s.includes("balloon") || s.includes("theme") || s.includes("stage") || s.includes("led") || s.includes("lighting") || s.includes("entrance arch") || s.includes("mandap")) return "decoration";
  if (s.includes("cake") || s.includes("cakes")) return "cake";
  if (s.includes("entertainment") || s.includes("games") || s.includes("magic") || s.includes("clown") || s.includes("mascot") || s.includes("dj") || s.includes("music") || s.includes("choreograph") || s.includes("emcee") || s.includes("anchor") || s.includes("live band") || s.includes("orchestra") || s.includes("dance")) return "entertainment";
  if (s.includes("return gifts") || s.includes("personalized gifts") || s.includes("gift arrangement")) return "return_gifts";
  if (s.includes("invitation") || s.includes("invite") || s.includes("card") || s.includes("digital invitation")) return "invitation";
  return "images";
}

/* ─── EVENT SERVICES ─── */
const EVENT_SERVICES = {
  "Grand Wedding Ceremony": ["Venue Booking","Stage Decoration","Catering Services","Photography & Videography","Bridal Makeup & Styling","Wedding Invitations","DJ & Music Arrangements","Guest Management","Return Gifts"],
  "Engagement Ceremony": ["Ring Ceremony Setup","Floral Decoration","Photography","Catering","Invitation Design","Couple Entry Setup","Music & Entertainment","Lighting Arrangements"],
  "Reception Party": ["Luxury Stage Design","LED & Lighting Setup","Reception Catering","Live Music/DJ","Guest Seating Arrangement","Photography Booth","Couple Grand Entry","Valet Parking","All Decorations","Invitation Cards","Return Gifts"],
  "Mehendi Ceremony": ["Mehendi Artists","Traditional Decoration","Music & Dance Setup","Floral Seating","Snacks & Refreshments","Photography","Theme-Based Setup"],
  "Haldi Ceremony": ["Yellow Theme Decoration","Floral Arrangements","Haldi Setup","Traditional Music","Photography","Family Seating Arrangement"],
  "Sangeet Night": ["Dance Stage Setup","DJ & Sound System","LED Screens","Lighting Effects","Choreographers","Live Entertainment","Photo Booth"],
  "Bachelor / Bachelorette": ["Party Venue Booking","DJ & Dance Floor","Theme Decoration","Private Dining","Entertainment Activities","Photography","Travel Arrangements"],
  "Anniversary Celebration": ["Romantic Decoration","Candlelight Dinner Setup","Photography","Customized Cakes","Music Arrangements","Surprise Planning"],
  "Proposal Event": ["Romantic Venue Setup","Floral Decoration","Candlelight Arrangements","Photography & Videography","Surprise Entry Planning","Live Music"],
  "Royal Birthday Party": ["Theme Decoration","Cake Arrangements","Photography","Entertainment & Games","Catering","Invitation Design","Return Gifts"],
  "Kids Birthday Bash": ["Cartoon Theme Decoration","Magic Shows","Balloon Decoration","Kids' Games","Cake Arrangements","Mascot Entries","Entertainment & Games","Return Gifts","Invitation Design"],
  "Surprise Party": ["Secret Planning","Venue Decoration","Personalized Gifts","Photography","Music & Entertainment","Customized Cakes"],
  "Milestone Birthday": ["Premium Decoration","Memory Wall Setup","Luxury Catering","Live Music","Family Photo Sessions","Customized Invitations"],
  "Baby Shower": ["Pastel Theme Decoration","Games & Activities","Photography","Dessert Counters","Gift Arrangements","Invitation Design"],
  "Naming Ceremony": ["Traditional Decoration","Pooja Arrangements","Catering Services","Photography","Family Seating Setup","Invitation Cards"],
  "Housewarming Party": ["Floral Entrance Decoration","Pooja Setup","Catering","Guest Seating","Return Gifts","Photography","Traditional Music"],
};

export const getEventServices = (name) => {
  const clean = name.replace(/[^\w\s]/g, '').trim().toLowerCase();
  if (clean.includes("wedding")) return ["Venue Booking","Stage Decoration","Catering Services","Photography & Videography","Bridal Makeup & Styling","Wedding Invitations","DJ & Music Arrangements","Guest Management","Return Gifts"];
  if (clean.includes("engagement")) return ["Ring Ceremony Setup","Floral Decoration","Photography","Catering","Invitation Design","Couple Entry Setup","Music & Entertainment","Lighting Arrangements"];
  if (clean.includes("reception")) return ["Luxury Stage Design","LED & Lighting Setup","Reception Catering","Live Music/DJ","Guest Seating Arrangement","Photography Booth","Couple Grand Entry","Valet Parking","All Decorations","Invitation Cards","Return Gifts"];
  if (clean.includes("mehendi")) return ["Mehendi Artists","Traditional Decoration","Music & Dance Setup","Floral Seating","Snacks & Refreshments","Photography","Theme-Based Setup"];
  if (clean.includes("haldi")) return ["Yellow Theme Decoration","Floral Arrangements","Haldi Setup","Traditional Music","Photography","Family Seating Arrangement"];
  if (clean.includes("sangeet")) return ["Dance Stage Setup","DJ & Sound System","LED Screens","Lighting Effects","Choreographers","Live Entertainment","Photo Booth"];
  if (clean.includes("birthday")) return ["Theme Decoration","Cake Arrangements","Photography","Entertainment & Games","Catering","Invitation Design","Return Gifts"];
  if (clean.includes("baby shower")) return ["Pastel Theme Decoration","Games & Activities","Photography","Dessert Counters","Gift Arrangements","Invitation Design"];
  if (clean.includes("naming")) return ["Traditional Decoration","Pooja Arrangements","Catering Services","Photography","Family Seating Setup","Invitation Cards"];
  if (clean.includes("housewarming")) return ["Floral Entrance Decoration","Pooja Setup","Catering","Guest Seating","Return Gifts","Photography","Traditional Music"];
  if (clean.includes("ear piercing")) return ["Traditional Decoration","Pooja Setup","Catering","Guest Seating","Return Gifts","Photography"];
  if (clean.includes("puberty")) return ["Floral Decoration","Stage Setup","Catering","Photography","Return Gifts"];
  if (clean.includes("anniversary")) return ["Romantic Decoration","Candlelight Dinner Setup","Photography","Customized Cakes","Music Arrangements","Surprise Planning"];
  return EVENT_SERVICES[name] ?? [];
};

export const getIncludedServices = (name) => {
  const clean = name.replace(/[^\w\s]/g, '').trim().toLowerCase();
  if (clean.includes("wedding")) return ["Catering", "Decoration", "Photography", "Entertainment"];
  if (clean.includes("engagement")) return ["Decoration", "Photography", "Catering"];
  if (clean.includes("reception")) return ["Stage Decoration", "Photography", "Catering", "Entertainment"];
  if (clean.includes("birthday")) return ["Decoration", "Cake", "Photography", "Entertainment"];
  if (clean.includes("baby shower")) return ["Theme Decoration", "Photography", "Catering"];
  if (clean.includes("housewarming")) return ["Catering", "Decoration", "Photography"];
  if (clean.includes("haldi")) return ["Floral Decoration", "Photography", "Catering", "Entertainment", "Makeup"];
  if (clean.includes("mehendi") || clean.includes("mehandi")) return ["Mehendi Artists", "Decoration", "Photography", "Catering", "Entertainment"];
  if (clean.includes("sangeet")) return ["DJ & Music", "Decoration", "Photography", "Catering", "Dance Floor"];
  if (clean.includes("anniversary")) return ["Decoration", "Cake", "Photography", "Catering", "Entertainment"];
  return [];
};

/* ─── EVENTS DATA ─── */
const EVENTS = {
  "Marriage Events": [
    { name: "💍 Wedding",  desc: "Complete wedding planning and management services.", img: "https://images.unsplash.com/photo-1542598688-76ad90c5b01e?w=800&h=500&fit=crop&auto=format",   duration: "2-3 Days", guests: "200-2000", price: "From Rs.5,00,000" },
    { name: "💑 Engagement",     desc: "Celebrate your special beginning with elegant arrangements.", img: "https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8?w=800&h=500&fit=crop&auto=format",  duration: "1 Day",    guests: "50-300",   price: "From Rs.80,000"  },
    { name: "🎊 Reception",         desc: "Grand reception setup with premium event services.", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=800&h=500&fit=crop&auto=format",       duration: "1 Night",  guests: "100-1000", price: "From Rs.1,50,000" },
    { name: "🌿 Mehendi Ceremony",        desc: "Traditional mehendi celebration with customized decorations.", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=800&h=500&fit=crop&auto=format",          duration: "Half Day", guests: "50-200",   price: "From Rs.40,000"  },
    { name: "🌼 Haldi Ceremony",          desc: "Vibrant haldi arrangements and themed decorations.", img: "https://images.unsplash.com/photo-1781154110379-f2447cd4e2ca?w=800&h=500&fit=crop&auto=format",           duration: "Half Day", guests: "30-150",   price: "From Rs.25,000"  },
    { name: "🎵 Sangeet Night",           desc: "Music, dance, DJ, and entertainment management.", img: "https://images.unsplash.com/photo-1758939560877-53fa3590a582?w=800&h=500&fit=crop&auto=format",            duration: "1 Night",  guests: "50-500",   price: "From Rs.75,000"  },
    { name: "💖 Anniversary Celebration", desc: "Celebrate milestones with memorable arrangements.", img: "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=800&h=500&fit=crop&auto=format",  duration: "1 Evening",guests: "20-200",   price: "From Rs.35,000"  },
  ],
  "Birthday Celebrations": [
    { name: "🎂 Birthday Party",    desc: "Fun-filled birthday celebrations for all age groups.", img: "https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=800&h=500&fit=crop&auto=format",  duration: "1 Day",    guests: "20-150",   price: "From Rs.25,000"  },
  ],
  "Family Celebrations": [
    { name: "👶 Baby Shower",             desc: "Beautiful baby shower planning and decorations.", img: "https://images.unsplash.com/photo-1597294150753-b6e790b68d1c?w=800&h=500&fit=crop&auto=format",          duration: "3-5 Hours",guests: "20-100",   price: "From Rs.15,000" },
    { name: "👶 Naming Ceremony",         desc: "Traditional naming ceremony arrangements.", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=800&h=500&fit=crop&auto=format",       duration: "Half Day", guests: "30-200",   price: "From Rs.20,000"  },
    { name: "🏠 Housewarming Ceremony",      desc: "Complete housewarming event planning.", img: "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=800&h=500&fit=crop&auto=format",     duration: "1 Day",    guests: "30-300",   price: "From Rs.25,000"  },
    { name: "👂 Ear Piercing Ceremony",      desc: "Traditional ear piercing event arrangements.", img: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=800&h=500&fit=crop&auto=format",     duration: "Half Day",    guests: "20-100",   price: "From Rs.15,000"  },
    { name: "🌸 Puberty Function",      desc: "Elegant and traditional puberty ceremony management.", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=800&h=500&fit=crop&auto=format",     duration: "1 Day",    guests: "30-200",   price: "From Rs.20,000"  },
  ],
};

const FAMILY_PLANS = {
  "baby shower": {
    name: "Baby Shower",
    emoji: "👶",
    plans: [
      {
        name: "Basic Plan",
        badge: "🥉",
        includes: [
          "Theme Decoration",
          "Welcome Board",
          "Photography",
          "Cake",
          "Guest Seating Arrangement",
          "Basic Sound System"
        ]
      },
      {
        name: "Standard Plan",
        badge: "🥈",
        includes: [
          "Premium Theme Decoration",
          "Photography & Videography",
          "Cake",
          "Catering",
          "Return Gifts",
          "Games & Activities",
          "Guest Seating Arrangement"
        ]
      },
      {
        name: "Premium Plan",
        badge: "🥇",
        includes: [
          "Luxury Theme Decoration",
          "Photography & Cinematic Videography",
          "Premium Catering",
          "Designer Cake",
          "Return Gifts",
          "Entertainment",
          "Balloon Decoration",
          "Event Coordinator"
        ]
      }
    ]
  },
  "naming ceremony": {
    name: "Naming Ceremony",
    emoji: "👶",
    plans: [
      {
        name: "Basic Plan",
        badge: "🥉",
        includes: [
          "Traditional Decoration",
          "Welcome Board",
          "Photography",
          "Guest Seating",
          "Snacks & Refreshments"
        ]
      },
      {
        name: "Standard Plan",
        badge: "🥈",
        includes: [
          "Premium Decoration",
          "Photography & Videography",
          "Catering",
          "Return Gifts",
          "Stage Setup",
          "Sound System"
        ]
      },
      {
        name: "Premium Plan",
        badge: "🥇",
        includes: [
          "Luxury Decoration",
          "Photography & Cinematic Videography",
          "Premium Catering",
          "Return Gifts",
          "LED Lighting",
          "Entertainment",
          "Event Coordinator"
        ]
      }
    ]
  },
  "housewarming": {
    name: "Housewarming Ceremony",
    emoji: "🏠",
    plans: [
      {
        name: "Basic Plan",
        badge: "🥉",
        includes: [
          "Entrance Decoration",
          "Floral Decoration",
          "Welcome Board",
          "Photography",
          "Guest Seating"
        ]
      },
      {
        name: "Standard Plan",
        badge: "🥈",
        includes: [
          "Premium Decoration",
          "Photography & Videography",
          "Catering",
          "Return Gifts",
          "Stage Setup",
          "Sound System"
        ]
      },
      {
        name: "Premium Plan",
        badge: "🥇",
        includes: [
          "Luxury Decoration",
          "Photography & Cinematic Videography",
          "Premium Catering",
          "LED Lighting",
          "Live Music",
          "Return Gifts",
          "Event Coordinator"
        ]
      }
    ]
  },
  "ear piercing": {
    name: "Ear Piercing Ceremony",
    emoji: "👂",
    plans: [
      {
        name: "Basic Plan",
        badge: "🥉",
        includes: [
          "Traditional Decoration",
          "Welcome Board",
          "Photography",
          "Guest Seating",
          "Snacks & Refreshments"
        ]
      },
      {
        name: "Standard Plan",
        badge: "🥈",
        includes: [
          "Premium Decoration",
          "Photography & Videography",
          "Catering",
          "Return Gifts",
          "Sound System"
        ]
      },
      {
        name: "Premium Plan",
        badge: "🥇",
        includes: [
          "Luxury Decoration",
          "Photography & Cinematic Videography",
          "Premium Catering",
          "Return Gifts",
          "Entertainment",
          "Event Coordinator"
        ]
      }
    ]
  },
  "puberty": {
    name: "Puberty Function",
    emoji: "🌸",
    plans: [
      {
        name: "Basic Plan",
        badge: "🥉",
        includes: [
          "Traditional Decoration",
          "Stage Setup",
          "Photography",
          "Guest Seating",
          "Basic Catering"
        ]
      },
      {
        name: "Standard Plan",
        badge: "🥈",
        includes: [
          "Premium Decoration",
          "Photography & Videography",
          "Catering",
          "Return Gifts",
          "Sound System",
          "Welcome Arch"
        ]
      },
      {
        name: "Premium Plan",
        badge: "🥇",
        includes: [
          "Luxury Theme Decoration",
          "Photography & Cinematic Videography",
          "Premium Catering",
          "Entertainment",
          "LED Lighting",
          "Return Gifts",
          "Event Coordinator"
        ]
      }
    ]
  }
};

// Marriage plans definition
const MARRIAGE_PLANS = {
  "wedding": {
    name: "Wedding",
    emoji: "💍",
    plans: [
      {
        name: "Basic Wedding",
        badge: "🥉",
        includes: [
          "Venue Coordination",
          "Basic Decoration",
          "Standard Catering",
          "Photography",
          "Bride & Groom Entry",
          "Sound System",
          "Guest Seating",
          "Event Coordinator"
        ]
      },
      {
        name: "Standard Wedding",
        badge: "🥈",
        includes: [
          "Premium Decoration",
          "Premium Catering",
          "Photography & Videography",
          "DJ & Entertainment",
          "Bridal Makeup",
          "Invitation Design",
          "Return Gifts",
          "Stage Setup",
          "Event Coordinator"
        ]
      },
      {
        name: "Premium Wedding",
        badge: "🥇",
        includes: [
          "Luxury Decoration",
          "Premium Multi-Cuisine Catering",
          "Cinematic Photography",
          "Drone Coverage",
          "Live Streaming",
          "Celebrity DJ / Live Music",
          "Luxury Bride & Groom Entry",
          "LED Wall",
          "Fireworks",
          "Return Gifts",
          "Luxury Vehicle",
          "Dedicated Event Manager"
        ]
      }
    ]
  },
  "engagement": {
    name: "Engagement",
    emoji: "💑",
    plans: [
      {
        name: "Basic Engagement",
        badge: "🥉",
        includes: [
          "Venue Coordination",
          "Basic Decoration",
          "Standard Catering",
          "Photography",
          "Bride & Groom Entry",
          "Sound System",
          "Guest Seating",
          "Event Coordinator"
        ]
      },
      {
        name: "Standard Engagement",
        badge: "🥈",
        includes: [
          "Premium Decoration",
          "Premium Catering",
          "Photography & Videography",
          "DJ & Entertainment",
          "Bridal Makeup",
          "Invitation Design",
          "Return Gifts",
          "Stage Setup",
          "Event Coordinator"
        ]
      },
      {
        name: "Premium Engagement",
        badge: "🥇",
        includes: [
          "Luxury Decoration",
          "Premium Multi-Cuisine Catering",
          "Cinematic Photography",
          "Drone Coverage",
          "Live Streaming",
          "Celebrity DJ / Live Music",
          "Luxury Bride & Groom Entry",
          "LED Wall",
          "Fireworks",
          "Return Gifts",
          "Luxury Vehicle",
          "Dedicated Event Manager"
        ]
      }
    ]
  },
  // Add other marriage related categories (reception, mehendi, haldi, sangeet, anniversary)
};

// Helper to get marriage key from event name
const getMarriageKey = (name) => {
  const clean = name.toLowerCase();
  if (clean.includes("wedding")) return "wedding";
  if (clean.includes("engagement")) return "engagement";
  if (clean.includes("reception")) return "reception";
  if (clean.includes("mehendi") || clean.includes("mehandi")) return "mehendi";
  if (clean.includes("haldi")) return "haldi";
  if (clean.includes("sangeet")) return "sangeet";
  if (clean.includes("anniversary")) return "anniversary";
  return null;
};

const getFamilyCelebrationKey = (name) => {
  const clean = name.toLowerCase();
  if (clean.includes("baby shower")) return "baby shower";
  if (clean.includes("naming")) return "naming ceremony";
  if (clean.includes("housewarming")) return "housewarming";
  if (clean.includes("ear piercing")) return "ear piercing";
  if (clean.includes("puberty")) return "puberty";
  return null;
};

const FAMILY_GALLERIES = {
  "baby shower": [
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1597294150753-b6e790b68d1c?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=800&fit=crop&auto=format"
  ],
  "naming ceremony": [
    "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&fit=crop&auto=format"
  ],
  "housewarming": [
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&fit=crop&auto=format"
  ],
  "ear piercing": [
    "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=800&fit=crop&auto=format",
"https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=800&fit=crop&auto=format"
  ],
  "puberty": [
    "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1724855946379-451f59d45df6?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=800&fit=crop&auto=format"
  ]
};
const CATEGORIES = ["Marriage Events","Birthday Celebrations","Family Celebrations"];

const DEFAULT_SERVICES_FALLBACK = [
  {
    name: "Decoration Services",
    icon: "Palette",
    items: [
      { name: "Baby Shower Decoration", desc: "Premium theme based baby shower decorations", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Naming Ceremony Setup", desc: "Elegant traditional setups for naming ceremonies", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&h=300&fit=crop" },
      { name: "Housewarming Setup", desc: "Warm and welcoming designs for new homes", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop" },
      { name: "Ear Piercing Ceremony Arrangement", desc: "Traditional decor for child ear piercing functions", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" },
      { name: "Puberty Function Decoration", desc: "Beautiful floral decorations and stage setups", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" }
    ]
  },
  {
    name: "Catering Services",
    icon: "Utensils",
    items: [
      { name: "Vegetarian Buffet", desc: "Delectable multi-cuisine vegetarian catering options", img: "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=500&h=300&fit=crop" },
      { name: "Live Food Counters", desc: "Interactive live counters for chat, mocktails & starters", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop" }
    ]
  },
  {
    name: "Photography & Videography",
    icon: "Camera",
    items: [
      { name: "Candid & Cinematic Shoots", desc: "Professional candid photography & event video reels", img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&h=300&fit=crop" }
    ]
  },
  {
    name: "Entertainment Services",
    icon: "Music",
    items: [
      { name: "DJ & Sound System", desc: "High-energy sound track arrangements & lighting system", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&h=300&fit=crop" }
    ]
  },
  {
    name: "Birthday Services",
    icon: "Gift",
    items: [
      { name: "Theme Birthday Decor", desc: "Creative theme based birthday party decorations", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" }
    ]
  },
  {
    name: "Wedding Services",
    icon: "Clipboard",
    items: [
      { name: "Bridal Makeup", desc: "Stunning makeup artistry for brides", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=300&fit=crop" },
      { name: "Groom Makeup", desc: "Professional grooming solutions for grooms", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=300&fit=crop" },
      { name: "Wedding Invitations", desc: "Designer invite cards and digital invites", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=500&h=300&fit=crop" },
      { name: "Mehendi Artists", desc: "Exquisite traditional henna designers", img: "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&h=300&fit=crop" },
      { name: "Wedding Car Decoration", desc: "Premium car decorations with artificial and real flowers", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop" },
      { name: "Guest Management", desc: "RSVP coordinations & check-in table desks", img: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=500&h=300&fit=crop" }
    ]
  }
];

const SERVICE_PRICES = {
  "Decoration": { low: 15000, medium: 25000, high: 50000 },
  "Catering": { low: 20000, medium: 45000, high: 90000 },
  "Photography & Videography": { low: 20000, medium: 35000, high: 70000 },
  "Entertainment": { low: 12000, medium: 20000, high: 40000 },
  "Invitation Design": { low: 3000, medium: 5000, high: 10000 },
  "Event Coordination": { low: 8000, medium: 15000, high: 30000 }
};

const getServicePrice = (name, budget, parentCatName) => {
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

function EventDetail({ card, onBack }) {
  const [dbServices, setDbServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState(null);

  const [selectedServices, setSelectedServices] = useState([]);

  const [activeConfigService, setActiveConfigService] = useState(null);
  const [activeBudget, setActiveBudget] = useState('medium');
  const [activeRecommendations, setActiveRecommendations] = useState([]);
  const [activeRecommendationsLoading, setActiveRecommendationsLoading] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [showBudgetPopup, setShowBudgetPopup] = useState(false);
  const [tempConfigService, setTempConfigService] = useState(null);

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [venueLocation, setVenueLocation] = useState("");

  const [showBookAnotherToggle, setShowBookAnotherToggle] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newBookingId, setNewBookingId] = useState(null);

  useEffect(() => {
    async function loadDbServices() {
      setServicesLoading(true);
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("name", { ascending: true });
        if (!error && data && data.length > 0) {
          setDbServices(data);
          setActiveCategoryTab(data[0].name);
        } else {
          setDbServices(DEFAULT_SERVICES_FALLBACK);
          setActiveCategoryTab(DEFAULT_SERVICES_FALLBACK[0].name);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setDbServices(DEFAULT_SERVICES_FALLBACK);
        setActiveCategoryTab(DEFAULT_SERVICES_FALLBACK[0].name);
      } finally {
        setServicesLoading(false);
      }
    }
    loadDbServices();
  }, []);

  useEffect(() => {
    if (!activeConfigService || !activeBudget) {
      setActiveRecommendations([]);
      return;
    }
    async function fetchRecs() {
      setActiveRecommendationsLoading(true);
      try {
        // Try searching for specific sub-service recommendation first
        const { data: subRecs, error: subError } = await supabase
          .from("gallery")
          .select("*")
          .eq("budget_tier", activeBudget)
          .eq("service_name", activeConfigService);

        if (!subError && subRecs && subRecs.length > 0) {
          setActiveRecommendations(subRecs);
          return;
        }

        const lowerSvc = (activeConfigService || "").toLowerCase();
        const parent = dbServices.find(s => 
          (s.items || []).some((item) => 
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
    fetchRecs();
  }, [activeConfigService, activeBudget, dbServices]);

  const handleUserPhotoUpload = async (e) => {
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
                event_key: card.name,
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
    const parent = dbServices.find(s => 
      (s.items || []).some((item) => 
        (typeof item === "string" ? item : item.name) === activeConfigService
      )
    );
    const price = getServicePrice(activeConfigService, activeBudget, parent?.name);
    
    setSelectedServices(prev => {
      const filtered = prev.filter(s => s.serviceName !== activeConfigService);
      return [...filtered, {
        serviceName: activeConfigService,
        budget: activeBudget,
        price,
        referenceImage: uploadedPhotoUrl || undefined
      }];
    });

    setActiveConfigService(null);
    setUploadedPhotoUrl(null);
  };

  const handleRemoveService = (svcName) => {
    setSelectedServices(prev => prev.filter(s => s.serviceName !== svcName));
  };

  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      alert("Please select and configure at least one service.");
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

    const serviceStrings = selectedServices.map(s => `${s.serviceName} (${s.budget.toUpperCase()})`);
    
    const details = {
      services_detailed: selectedServices.map(s => ({
        name: s.serviceName,
        budget: s.budget,
        price: s.price,
        reference_image: s.referenceImage || ""
      })),
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        event_name: card.name,
        event_date: eventDate,
        event_time: eventTime || null,
        guests_count: Number(guestCount) || null,
        venue: venueLocation || "TBD",
        status: "Pending",
        amount: `₹${totalAmount.toLocaleString('en-IN')}`,
        services: serviceStrings,
        details: details
      })
      .select();

    if (error) {
      alert("Failed to submit booking: " + error.message);
    } else {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error("Confetti error:", err);
      }
      setNewBookingId(data?.[0]?.id || null);
      setBookingSuccess(true);
    }
  };

  const activeCategoryObj = dbServices.find(s => s.name === activeCategoryTab);
  const subServices = activeCategoryObj?.items || [];
  const subServicesNormalized = (subServices || []).map((sub) => {
    if (typeof sub === "string") return { name: sub, desc: "", img: "" };
    return { name: sub.name || "", desc: sub.desc || sub.description || "", img: sub.img || sub.image || "" };
  });

  const totalPossibleSubServices = dbServices.reduce((acc, cat) => acc + (cat.items || []).length, 0);

  if (bookingSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "3rem 2rem", background: G.surface, border: `1px solid ${G.gold}`, borderRadius: "14px", textAlign: "center", maxWidth: "600px", margin: "2rem auto" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: `2px solid ${G.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <CheckCircle size={32} style={{ color: G.gold }} />
        </div>
        <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.8rem", fontWeight: 700, margin: "0 0 0.5rem" }}>Booking Submitted Successfully!</h2>
        <p style={{ color: G.muted, fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Your multi-service event booking for <strong style={{ color: G.text }}>{card.name}</strong> has been received and is currently under review by our coordinators.
        </p>

        <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "8px", padding: "1.5rem", textAlign: "left", marginBottom: "2rem" }}>
          <p style={{ color: G.gold, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1rem" }}>Booking Summary</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.92rem", color: G.text }}>
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
              <span>Total Package Cost:</span>
              <span style={{ color: G.gold }}>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <button onClick={() => { setBookingSuccess(false); setSelectedServices([]); onBack(); }}
          style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.8rem 2.5rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans }}>
          Return to Events Portfolio
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: G.gold, cursor: "pointer", fontFamily: G.sans, fontSize: "1rem", marginBottom: "1.25rem", padding: 0 }}>
        <ChevronLeft size={16} /> Back to Events
      </button>

      <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", marginBottom: "1.5rem" }}>
        <img src={card.img} alt={card.name} style={{ width: "100%", height: "260px", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.75), transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
          <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.4rem", lineHeight: 1 }}>Vizhaa Events</p>
          <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "clamp(1.5rem,3.5vw,2.2rem)", fontWeight: 700, margin: "4px 0 0" }}>{card.name}</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start", marginBottom: "2rem" }}>
        <div>
          <p style={{ color: "rgba(245,234,214,0.85)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>{card.desc}</p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} style={{ color: G.gold }} />
              <span style={{ color: G.muted, fontSize: "0.95rem" }}>{card.duration}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Users size={16} style={{ color: G.gold }} />
              <span style={{ color: G.muted, fontSize: "0.95rem" }}>{card.guests} Guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services selector section */}
      <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", padding: "1.75rem", marginBottom: "2rem" }}>
        <p style={{ color: G.gold, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Step 1</p>
        <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1.25rem 0" }}>Select Services to Book</h3>

        {servicesLoading ? (
          <div style={{ color: G.muted, padding: "1rem", textAlign: "center" }}>Loading service categories...</div>
        ) : (
          <div>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.5rem", borderBottom: `1px solid ${G.border}`, paddingBottom: "1rem" }}>
              {dbServices.map(cat => {
                const isActive = activeCategoryTab === cat.name;
                return (
                  <button key={cat.name} type="button" onClick={() => setActiveCategoryTab(cat.name)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "99px",
                      background: isActive ? "rgba(201,168,76,0.14)" : "transparent",
                      border: `1px solid ${isActive ? G.gold : G.border}`,
                      color: isActive ? G.gold : G.muted,
                      cursor: "pointer",
                      fontFamily: G.sans,
                      fontSize: "0.82rem",
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = G.gold; }}
                    onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = G.muted; }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Sub-services Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {subServicesNormalized.map((sub) => {
                const isAdded = selectedServices.some(s => s.serviceName === sub.name);
                const isConfiguring = activeConfigService === sub.name;
                return (
                  <div key={sub.name}
                    style={{
                      background: G.surface2,
                      border: `1px solid ${isAdded ? G.gold : isConfiguring ? "rgba(201,168,76,0.5)" : G.border}`,
                      borderRadius: "10px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.2s"
                    }}
                  >
                    {sub.img ? (
                      <img src={sub.img} alt={sub.name} style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: "130px", background: "rgba(201,168,76,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: G.muted, borderBottom: `1px solid ${G.border}` }}>
                        No Image Available
                      </div>
                    )}
                    <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h4 style={{ color: G.text, fontSize: "0.95rem", fontWeight: 700, margin: "0 0 6px 0", fontFamily: G.serif }}>{sub.name}</h4>
                        {sub.desc && (
                          <p style={{ color: G.muted, fontSize: "0.78rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>{sub.desc}</p>
                        )}
                      </div>
                      <button type="button"
                        onClick={() => {
                          setTempConfigService(sub.name);
                          setShowBudgetPopup(true);
                        }}
                        style={{
                          width: "100%",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: isAdded ? "rgba(201,168,76,0.15)" : `linear-gradient(135deg, ${G.gold}, #9a7a2e)`,
                          border: isAdded ? `1px solid ${G.gold}` : "none",
                          color: isAdded ? G.gold : "#0a0804",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontFamily: G.sans,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}
                      >
                        {isAdded ? "Added to Booking (Edit)" : "Book Service"}
                        {isAdded ? <CheckCircle size={13} style={{ color: G.gold }} /> : <ArrowRight size={13} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Services Summary */}
        {selectedServices.length > 0 && (
          <div style={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "1.25rem", marginTop: "1.5rem" }}>
            <p style={{ color: G.gold, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.85rem" }}>Configured Services</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {selectedServices.map(s => (
                <div key={s.serviceName} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "8px 12px", background: G.surface, border: `1px solid ${G.border}`, borderRadius: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {s.referenceImage && (
                      <img src={s.referenceImage} alt="" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "4px", border: `1px solid ${G.border}` }} />
                    )}
                    <div>
                      <p style={{ color: G.text, fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>{s.serviceName}</p>
                      <p style={{ color: G.muted, fontSize: "0.78rem", margin: 0 }}>Budget: {s.budget.toUpperCase()} · Cost: ₹{s.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleRemoveService(s.serviceName)} style={{ background: "transparent", border: "none", color: "#e05555", cursor: "pointer", fontSize: "0.82rem" }}>Remove</button>
                </div>
              ))}
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.25rem", borderTop: `1px solid ${G.border}`, paddingTop: "0.85rem" }}>
              <span style={{ color: G.muted, fontSize: "0.88rem" }}>Services Total ({selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}):</span>
              <span style={{ color: G.gold, fontSize: "1.1rem", fontWeight: 700 }}>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Can you book another services option */}
        {selectedServices.length > 0 && (
          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" id="book-another-toggle" checked={showBookAnotherToggle} onChange={e => setShowBookAnotherToggle(e.target.checked)} style={{ accentColor: G.gold }} />
            <label htmlFor="book-another-toggle" style={{ color: G.text, fontSize: "0.88rem", fontFamily: G.sans, cursor: "pointer" }}>
              Can you book another services? (Toggle to view and select additional services)
            </label>
          </div>
        )}
      </div>

      {/* Inline Configuration Panel */}
      {activeConfigService && (
        <div style={{ background: G.surface, border: `1.5px solid ${G.gold}`, borderRadius: "14px", padding: "1.75rem", marginBottom: "2rem" }}>
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

      {/* Collect Event Details and Checkout */}
      {selectedServices.length > 0 && (!showBookAnotherToggle || selectedServices.length === totalPossibleSubServices) && (
        <form onSubmit={handleConfirmBooking} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "14px", padding: "1.75rem", marginBottom: "2.5rem" }}>
          <p style={{ color: G.gold, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Step 2</p>
          <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1.25rem 0" }}>Provide Event Details</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", color: G.muted, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Event Date *</label>
              <input required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", color: G.muted, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Event Time</label>
              <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", color: G.muted, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Number of Guests</label>
              <input type="number" placeholder="e.g. 150" value={guestCount} onChange={e => setGuestCount(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", color: G.muted, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Venue Location / Name</label>
              <input placeholder="e.g. Maharaja Hall or TBD" value={venueLocation} onChange={e => setVenueLocation(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: "6px", color: G.text, fontSize: "0.85rem", fontFamily: G.sans, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ height: "1px", background: G.border, margin: "1.5rem 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h4 style={{ fontFamily: G.serif, color: G.text, fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>Total Amount</h4>
              <p style={{ color: G.muted, fontSize: "0.8rem", margin: "2px 0 0" }}>All configured services package</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontFamily: G.serif, color: G.gold, fontSize: "1.75rem", fontWeight: 700 }}>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button type="submit" style={{ background: `linear-gradient(135deg, ${G.gold}, #9a7a2e)`, color: "#0a0804", border: "none", padding: "0.85rem 2rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: G.sans, width: "100%" }}>
            Confirm booking
          </button>
        </form>
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
                {(['low', 'medium', 'high']).map(b => {
                  const priceVal = getServicePrice(tempConfigService, b, activeCategoryTab || undefined);
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
    </motion.div>
  );
}

export default function EventsTab({ initialEventName }) {
  const [dbEvents, setDbEvents] = useState({
    "Marriage Events": [],
    "Birthday Celebrations": [],
    "Family Celebrations": []
  });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Marriage Events");
  const [selectedCard, setSelectedCard] = useState(null);

  const getEventsSource = () => {
    const hasAnyDbEvents = Object.values(dbEvents).some(arr => arr.length > 0);
    return hasAnyDbEvents ? dbEvents : EVENTS;
  };

  const currentEventsSource = getEventsSource();

  useEffect(() => {
    const fetchDbEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("name", { ascending: true });

        if (!error && data && data.length > 0) {
          const grouped = {
            "Marriage Events": [],
            "Birthday Celebrations": [],
            "Family Celebrations": []
          };
          data.forEach((item) => {
            const cat = item.category;
            if (grouped[cat]) {
              grouped[cat].push({
                name: item.name,
                desc: item.desc || "",
                img: item.img || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=500&fit=crop&auto=format",
                duration: item.duration,
                guests: item.guests,
                price: item.price
              });
            }
          });
          setDbEvents(grouped);
        }
      } catch (err) {
        console.error("Error fetching db events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDbEvents();
  }, []);

  useEffect(() => {
    if (initialEventName) {
      const source = getEventsSource();
      const cleanInit = initialEventName.replace(/[^\w\s]/g, '').trim().toLowerCase();
      for (const cat of CATEGORIES) {
        const card = source[cat].find(c => {
          const cleanName = c.name.replace(/[^\w\s]/g, '').trim().toLowerCase();
          return cleanName === cleanInit || c.name === initialEventName;
        });
        if (card) {
          setActiveCategory(cat);
          setSelectedCard(card);
          break;
        }
      }
    }
  }, [initialEventName, dbEvents]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: G.gold }}>
        <p style={{ fontFamily: G.serif, fontSize: "1.2rem" }}>Loading events...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <AnimatePresence mode="wait">
        {selectedCard ? (
          <EventDetail key="detail" card={selectedCard} onBack={() => setSelectedCard(null)} />
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: G.script, color: G.gold, fontSize: "1.6rem", lineHeight: 1 }}>Our Portfolio</p>
              <h2 style={{ fontFamily: G.serif, color: G.text, fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, margin: "4px 0 0" }}>Events We Celebrate</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <div style={{ height: "1px", width: "32px", background: `linear-gradient(to right, transparent, ${G.gold})` }} />
                <span style={{ color: G.gold, fontSize: "0.9rem" }}>*</span>
                <div style={{ height: "1px", width: "32px", background: `linear-gradient(to left, transparent, ${G.gold})` }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              <AnimatePresence>
                {Object.values(currentEventsSource).flat().map((card, i) => {
                  const included = getIncludedServices(card.name);
                  return (
                    <motion.div key={card.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedCard(card)}
                      style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                      onMouseEnter={e => { (e.currentTarget).style.borderColor = "rgba(201,168,76,0.45)"; }}
                      onMouseLeave={e => { (e.currentTarget).style.borderColor = G.border; }}>
                      <div>
                        <div style={{ position: "relative" }}>
                          <img src={card.img} alt={card.name} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,4,0.7), transparent 55%)" }} />
                          <div style={{ position: "absolute", bottom: "0.75rem", left: "1rem" }}>
                            <h3 style={{ fontFamily: G.serif, color: G.text, fontSize: "1rem", fontWeight: 600 }}>{card.name}</h3>
                          </div>
                        </div>
                        <div style={{ padding: "1rem 1.25rem 0.5rem" }}>
                          <p style={{ color: G.muted, fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "0.85rem" }}>{card.desc}</p>
                          
                          {included.length > 0 && activeCategory !== "Family Celebrations" && (
                            <div style={{ margin: "0.75rem 0 0.25rem", padding: "0.5rem 0.75rem", background: "rgba(201,168,76,0.04)", borderRadius: "6px", border: `1px solid ${G.border}` }}>
                              <p style={{ color: G.gold, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.35rem 0" }}>Includes:</p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                                {included.map(svc => (
                                  <span key={svc} style={{ color: G.text, fontSize: "0.68rem", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px", fontFamily: G.sans }}>
                                    {svc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ padding: "0 1.25rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", borderTop: `1px solid ${G.border}`, paddingTop: "0.75rem" }}>
                          <span style={{ fontFamily: G.serif, color: G.gold, fontSize: "0.9rem", fontWeight: 700 }}>{card.price}</span>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: G.gold, display: "flex", alignItems: "center", gap: "4px" }}>
                            Book Now <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

