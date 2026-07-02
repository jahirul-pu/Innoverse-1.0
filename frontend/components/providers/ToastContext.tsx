"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    info: (msg: string) => addToast(msg, "info"),
  };

  // Icon SVG paths
  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="url(#successGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
            <defs>
              <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-circuit-green, #10B981)" />
                <stop offset="100%" stopColor="var(--color-trace-blue, #4F46E5)" />
              </linearGradient>
            </defs>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case "error":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-status-cancelled)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="12" style={{ display: "none" }} /> {/* formatting placeholder safety */}
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case "info":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-trace-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card toast-card--${t.type}`}>
            <span className="toast-card__icon">{getIcon(t.type)}</span>
            <div className="toast-card__content">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="toast-card__close"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider");
  }
  return context;
};
