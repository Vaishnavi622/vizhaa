import React, { ReactNode } from "react";
import { X } from "lucide-react";

// Re‑declare the same design tokens used elsewhere
const G = {
  surface: "rgba(20, 16, 10, 0.72)",
  border: "rgba(201,168,76,0.18)",
  gold: "#c9a84c",
  text: "#f5ead6",
  muted: "#9a8060",
  serif: "'Playfair Display', serif",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,8,4,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: G.surface,
          border: `1px solid ${G.border}`,
          borderRadius: "12px",
          width: "90%",
          maxWidth: "500px",
          padding: "1.5rem",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: "transparent",
            border: "none",
            color: G.muted,
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
        {title && (
          <h3
            style={{
              marginBottom: "1rem",
              fontFamily: G.serif,
              color: G.text,
              fontSize: "1.2rem",
            }}
          >
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};
