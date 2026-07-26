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
          background: "linear-gradient(145deg, #18130c, #100d07)",
          border: `1px solid ${G.border}`,
          borderRadius: "14px",
          width: "92%",
          maxWidth: "500px",
          maxHeight: "88vh",
          overflowY: "auto",
          padding: "1.75rem",
          position: "relative",
          boxShadow: "0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(201,168,76,0.15)",
        }}
      >
        <button
          aria-label="Close modal"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "32px",
            height: "32px",
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c9a84c";
            e.currentTarget.style.color = "#0a0804";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(201,168,76,0.15)";
            e.currentTarget.style.color = "#e8cc84";
          }}
        >
          <X size={18} strokeWidth={2.5} />
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
