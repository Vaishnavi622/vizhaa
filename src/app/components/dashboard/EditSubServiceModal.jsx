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
};

export const EditSubServiceModal = ({
  isOpen,
  onClose,
  parentService,
  subService,
  onSaved,
}) => {
  const [form, setForm] = useState({ name: "", desc: "", img: "" });
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `subservice-uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, file);
        
      if (error) {
        // Fallback to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setForm(prev => ({ ...prev, img: reader.result }));
          }
        };
        reader.readAsDataURL(file);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('user_uploads')
          .getPublicUrl(filePath);
        setForm(prev => ({ ...prev, img: publicUrlData?.publicUrl || "" }));
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (subService) {
      setForm(subService);
    } else {
      setForm({ name: "", desc: "", img: "" });
    }
  }, [subService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!parentService) return;

    let updatedItems = [];
    const items = parentService.items || [];

    if (subService) {
      // Edit existing item by matching name
      updatedItems = items.map((item) =>
        item.name === subService.name ? form : item
      );
    } else {
      // Add new item
      updatedItems = [...items, form];
    }

    const { error } = await supabase
      .from("services")
      .update({ items: updatedItems })
      .eq("id", parentService.id);

    if (error) {
      console.error("Failed to update sub-service:", error);
      alert("Failed to update sub-service: " + error.message);
    } else {
      onSaved();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={subService ? `Edit Sub-Service – ${subService.name}` : "Add Sub-Service"}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          placeholder="Sub-Service Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          style={{ padding: "0.5rem", borderRadius: "4px", border: `1px solid ${G.border}`, background: "rgba(0,0,0,0.2)", color: G.text }}
        />
        <textarea
          placeholder="Description"
          name="desc"
          value={form.desc}
          onChange={handleChange}
          rows={3}
          style={{ padding: "0.5rem", borderRadius: "4px", border: `1px solid ${G.border}`, background: "rgba(0,0,0,0.2)", color: G.text }}
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} id="subservice-img-upload" />
          <label htmlFor="subservice-img-upload" style={{ background: "rgba(201,168,76,0.12)", border: `1px solid ${G.border}`, color: G.gold, borderRadius: "4px", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, display: "inline-block" }}>
            {uploading ? "Uploading..." : "Upload Photo"}
          </label>
          <input readOnly type="text" value={form.img ? (form.img.startsWith("data:") ? "Local Photo Selected" : form.img.substring(0, 30) + "...") : "No image selected"} style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: `1px solid ${G.border}`, background: "rgba(0,0,0,0.2)", color: G.muted, fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }} />
        </div>
        <button
          onClick={handleSave}
          style={{ background: G.gold, color: "#0a0804", border: "none", padding: "0.6rem 1rem", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

