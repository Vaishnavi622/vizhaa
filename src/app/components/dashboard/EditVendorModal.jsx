import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { supabase } from "../../../supabaseClient";

const G = {
  surface: "rgba(20, 16, 10, 0.72)",
  border: "rgba(201,168,76,0.18)",
  gold: "#c9a84c",
  text: "#f5ead6",
  muted: "#9a8060",
  serif: "'Playfair Display', serif",
  sans: "'Raleway', sans-serif",
  surface2: "rgba(26, 20, 8, 0.55)",
};

export const EditVendorModal = ({
  isOpen,
  onClose,
  vendor,
  onSaved,
}) => {
  const [form, setForm] = useState({
    vendorName: "",
    description: "",
    phone: "",
    email: "",
    price: "",
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (vendor) {
      setForm({
        vendorName: vendor.name || "",
        description: vendor.description || "",
        phone: vendor.phone || "",
        email: vendor.email || "",
        price: vendor.price || "",
        images: vendor.images || [],
      });
    }
  }, [vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFileToSupabase(file);
      setForm(prev => ({ ...prev, images: [...prev.images, url] }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (idx) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    if (!vendor) return;

    try {
      // 1. Fetch current sub_service_details row
      const { data, error: fetchErr } = await supabase
        .from("sub_service_details")
        .select("*")
        .eq("key", vendor.dbKey)
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

      // 2. Update the item at originalIndex
      if (vendor.originalIndex >= 0 && vendor.originalIndex < vendorsList.length) {
        vendorsList[vendor.originalIndex] = {
          ...vendorsList[vendor.originalIndex],
          vendorName: form.vendorName,
          description: form.description,
          phone: form.phone,
          email: form.email,
          price: form.price,
          images: form.images,
        };
      }

      // 3. Update the sub_service_details row in DB
      const jsonDesc = JSON.stringify(vendorsList);
      // Collect all images from all vendors in this list to sync sub_service_details.images
      const allImages = [];
      vendorsList.forEach((v) => {
        if (v.images) {
          v.images.forEach((img) => {
            if (!allImages.includes(img)) allImages.push(img);
          });
        }
      });

      const { error: updateErr } = await supabase
        .from("sub_service_details")
        .update({ description: jsonDesc, images: allImages })
        .eq("key", vendor.dbKey);

      if (updateErr) throw updateErr;

      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save vendor details:", err);
      alert("Failed to save vendor details: " + err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Vendor – ${vendor?.name}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "75vh", overflowY: "auto", paddingRight: "4px" }}>
        
        {/* Vendor Name */}
        <div>
          <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Name</label>
          <input
            placeholder="Vendor Name"
            name="vendorName"
            value={form.vendorName}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: `1px solid ${G.border}`, background: "rgba(0,0,0,0.2)", color: G.text, boxSizing: "border-box", outline: "none" }}
          />
        </div>

        {/* Tag line */}
        <div>
          <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Tag line</label>
          <textarea
            placeholder="Tag line / Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: `1px solid ${G.border}`, background: "rgba(0,0,0,0.2)", color: G.text, boxSizing: "border-box", outline: "none", resize: "none" }}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ width: "100%", fontSize: "0.78rem", color: G.muted, padding: "0.45rem 0" }}
          />
          {uploading && <p style={{ color: G.gold, fontSize: "0.72rem", margin: "4px 0 0" }}>Uploading to Storage...</p>}
          
          {/* Photos Grid */}
          {form.images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))", gap: "6px", marginTop: "8px" }}>
              {form.images.map((img, idx) => (
                <div key={idx} style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: `1px solid ${G.border}`, aspectRatio: "4/3" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(10,8,4,0.85)", border: "none", color: "#f87171", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.6rem", fontWeight: 700 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Mail</label>
          <input
            placeholder="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: `1px solid ${G.border}`, background: "rgba(0,0,0,0.2)", color: G.text, boxSizing: "border-box", outline: "none" }}
          />
        </div>

        {/* Phone number */}
        <div>
          <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Phone number</label>
          <input
            placeholder="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: `1px solid ${G.border}`, background: "rgba(0,0,0,0.2)", color: G.text, boxSizing: "border-box", outline: "none" }}
          />
        </div>

        {/* Price */}
        <div>
          <label style={{ display: "block", color: G.muted, fontSize: "0.68rem", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 600 }}>Price</label>
          <input
            placeholder="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: `1px solid ${G.border}`, background: "rgba(0,0,0,0.2)", color: G.text, boxSizing: "border-box", outline: "none" }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{ background: G.gold, color: "#0a0804", border: "none", padding: "0.75rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontFamily: G.sans, marginTop: "0.5rem" }}
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

